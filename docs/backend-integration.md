# Integração do backend — passo a passo

Como sair dos mocks em memória e chegar ao banco PostgreSQL descrito no PDF **"Travel Hub · Modelo de dados · V2 sem IA"**, sem reescrever o front.

> **Status:** Fase 1 implementada (Prisma, schema, migration inicial, seed). Fases 2–6 são o roteiro.

---

## 0. Decisões e diferenças em relação ao PDF

### Backend dentro do Next, não um Express separado

O PDF propõe `Front (Vercel) → API Express (Render) → Postgres (Neon)`. O projeto já tem um backend: os **Route Handlers** em `src/app/api/**` (ver `arquitetura-alvo.md` §2). Então a integração fica assim:

```
Front (TanStack Query + Zustand) ──fetch /api/...──▶ Route Handlers (Next, Vercel) ──Prisma──▶ PostgreSQL (Neon)
                                                              │
                                                              └──fetch──▶ REST Countries · Open-Meteo · Frankfurter
```

O que isso evita:

- **CORS**: front e API ficam na mesma origem.
- **Cold start do Render**: o plano grátis "dorme" após 15 min parado, e o primeiro acesso demora.
- **Reescrever a sessão**: o cookie httpOnly continua funcionando, e o front não guarda token.
- **Mudar o front**: `session.service.ts` e `destinos.service.ts` continuam chamando as mesmas rotas.

As **8 tabelas do PDF ficam iguais**. A única peça que sai é o JWT, substituído por uma tabela de sessões (abaixo).

### Ajustes no modelo (todos comentados no `schema.prisma`)

| PDF | No projeto | Por quê |
|---|---|---|
| `preferencias.orcamento` | `orcamento_min` + `orcamento_max` | O slider do cadastro é uma faixa (`orcamentoInicial`/`orcamentoFinal`). |
| `data_prevista` só em `viagens` | Também em `preferencias` | O header do dashboard edita uma data geral. Em `viagens` ela continua existindo, por destino. |
| `interesses` sem slug | `interesses.slug` (UK) | O front identifica interesses por `"natureza"`, `"cultura"`…, e o `id` numérico não é estável entre bancos. |
| JWT (`jsonwebtoken`) | Tabela `sessoes` | O cookie guarda um token aleatório e o banco guarda **só o hash** dele. Logout e "sair de todos os dispositivos" viram um `DELETE`, o que com JWT não é possível. |
| argon2 / bcrypt | scrypt (`node:crypto`) | Já implementado em `src/server/auth/senha.ts`. Equivalente em segurança e sem dependência nativa. |
| Campos `API` de `destinos` obrigatórios | Opcionais | Ficam vazios até a integração com a API de países (Fase 5). |

### Convenção de nomes

- **Prisma (TypeScript):** models e campos em camelCase português (`Usuario.senhaHash`).
- **Postgres:** `@@map`/`@map` deixam tabelas e colunas em snake_case, exatamente como no diagrama (`usuarios.senha_hash`).
- **Arquivos novos:** nome e export principal em inglês (`user-repository.ts` → `findUserByEmail`). Rotas HTTP seguem o padrão existente, em português (`/api/viagens`).

---

## Fase 1 — Fundação ✅ (já feita nesta branch)

**O que foi adicionado:**

| Arquivo | Para quê |
|---|---|
| `prisma/schema.prisma` | As 8 tabelas + `sessoes`, enums `PerfilViagem` e `StatusViagem`. |
| `prisma/migrations/20261116000000_init/` | SQL que cria tudo. Gerado offline com `prisma migrate diff`. |
| `prisma/seed.ts` | 6 interesses (de `INTERESTS`) + usuário demo `amanda@travelhub.com` / `12345678`. |
| `prisma.config.ts` | Configuração do CLI: schema, migrations, seed, URL de conexão. |
| `src/server/db/prisma.ts` | `prisma`, o client único (singleton) para usar nos Route Handlers. |
| `.env.example` | Modelo das variáveis `DATABASE_URL` e `DIRECT_URL`. |
| `package.json` | Scripts `db:*` e `postinstall: prisma generate`. |

Versões fixadas: **Prisma 7.10.1** (a tag `latest` no npm aponta para um RC do 8, por isso não foi usada) com `@prisma/adapter-pg`. O client é gerado em `src/generated/prisma`, que está no `.gitignore`.

### Banco criado ✅

Projeto Neon **`travel-hub`** (`aws-us-east-1`, a mesma região padrão das funções da Vercel; Postgres 18), database `travelhub`. Migration `init` e seed já aplicados. As URLs estão no `.env` local, com `sslmode=verify-full`.

Para recriar o `.env` em outra máquina: `npx neonctl auth`, depois `npx neonctl connection-string --project-id lingering-night-72983076 --database-name travelhub` (acrescente `--pooled` para a `DATABASE_URL`). Ou copie as URLs do console do Neon.

### Setup do zero (referência)

1. **Node 22.** O Prisma 7 exige Node ≥ 22.12, e o `.nvmrc` já pede 22.
   ```bash
   nvm use        # lê o .nvmrc (22). Se faltar: nvm install
   ```
2. **Criar o banco no Neon.** Em [neon.tech](https://neon.tech), crie o projeto `travel-hub` e o database `travelhub`. Depois, em **Connect**, copie as duas strings:
   - com **Connection pooling ligado**: o host termina em `-pooler`. Vai em `DATABASE_URL`.
   - com **pooling desligado**: vai em `DIRECT_URL`.
3. **Configurar o `.env`.**
   ```bash
   cp .env.example .env   # e cole as duas URLs
   ```
4. **Instalar, criar as tabelas e popular o banco.**
   ```bash
   npm install            # roda o prisma generate
   npm run db:migrate     # aplica a migration init no Neon
   npm run db:seed        # interesses + usuário demo
   npm run db:studio      # abre o navegador do banco para conferir
   ```
   No Studio devem aparecer 9 tabelas, 6 interesses e 1 usuário.

**Comandos do dia a dia:**

| Quando | Comando |
|---|---|
| Mudou o `schema.prisma` | `npm run db:migrate -- --name descreva-a-mudanca` |
| Quer ver ou editar dados | `npm run db:studio` |
| Erro "Cannot find module '@/generated/prisma'" | `npm run db:generate` |

---

## Fase 2 — Autenticação no banco

**Objetivo:** login, sessão, cadastro e troca de senha passam a ler e gravar no Postgres. O contrato das rotas **não muda**, então o front continua igual, exceto o cadastro, que hoje só faz `console.log`.

### 2.1 Repositório de usuários (substitui `usuarios-mock.ts`)

Crie `src/server/users/user-repository.ts`:

```ts
import "server-only";
import { prisma } from "@/server/db/prisma";

export function findUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
}

export function findUserById(id: string) {
  return prisma.usuario.findUnique({ where: { id } });
}
```

Troque os imports em `api/auth/login/route.ts` e `api/auth/senha/route.ts`. Lembre do `await`, porque agora as funções são assíncronas. Na rota de senha, troque `usuario.senhaHash = ...` por:

```ts
await prisma.usuario.update({ where: { id: usuarioId }, data: { senhaHash } });
```

### 2.2 Conversor banco → `Session`

O front espera o tipo `Session` (`src/shared/session/session.types.ts`). Centralize a conversão num lugar só, em `src/server/auth/session-mapper.ts`:

```ts
import "server-only";
import type { Prisma } from "@/generated/prisma/client";
import type { PerfilViagem } from "@/features/auth/types/auth";
import type { Session } from "@/shared/session/session.types";

/** Tudo o que a sessão precisa, num único `include`. */
export const SESSION_INCLUDE = {
  preferencias: true,
  interesses: { include: { interesse: true } },
  viagens: { include: { destino: true }, orderBy: { criadoEm: "asc" } },
} satisfies Prisma.UsuarioInclude;

export type UsuarioComSessao = Prisma.UsuarioGetPayload<{
  include: typeof SESSION_INCLUDE;
}>;

export function toPublicSession(u: UsuarioComSessao): Session {
  const p = u.preferencias;
  return {
    usuario: {
      nome: u.nome,
      email: u.email,
      fotoUrl: u.fotoUrl,
      pais: u.pais,
      cidade: u.cidade,
    },
    preferencias: {
      interesses: u.interesses.map(({ interesse }) => interesse.slug),
      // Decimal do Prisma não é number: converta explicitamente.
      orcamentoInicial: Number(p?.orcamentoMin ?? 0),
      orcamentoFinal: Number(p?.orcamentoMax ?? 0),
      destinos: u.viagens.map(({ destino }) => ({
        pais: destino.pais,
        cidade: destino.cidade,
      })),
      dataPrevista: p?.dataPrevista?.toISOString().slice(0, 10) ?? "",
    },
    perfilViagem: (p?.perfilViagem ?? "SOZINHO").toLowerCase() as PerfilViagem,
  };
}
```

> Por que um mapper? O banco usa `SOZINHO`, `Decimal` e `Date`; o front usa `"sozinho"`, `number` e `"2026-12-01"`. Se essa tradução ficar espalhada pelas rotas, cada rota vai fazer de um jeito.

### 2.3 Sessão na tabela `sessoes` (reescreve `src/server/auth/sessao.ts`)

A ideia: o cookie leva um **token aleatório** e o banco guarda o **SHA-256** dele.

```ts
import { createHash, randomBytes } from "node:crypto";

const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

export async function criarSessao(usuarioId: string): Promise<Session> {
  const token = randomBytes(32).toString("base64url");

  await prisma.sessao.create({
    data: {
      tokenHash: hashToken(token),
      usuarioId,
      expiraEm: new Date(Date.now() + DURACAO_SEGUNDOS * 1000),
    },
  });

  await definirCookie(token); // mesmas opções de hoje: httpOnly, sameSite, secure…

  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    include: SESSION_INCLUDE,
  });
  return toPublicSession(usuario);
}

async function lerRegistro() {
  const token = (await cookies()).get(COOKIE_SESSAO)?.value;
  if (!token) return null;

  const sessao = await prisma.sessao.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { usuario: { include: SESSION_INCLUDE } },
  });

  if (!sessao || sessao.expiraEm <= new Date()) return null;
  return { token, sessao };
}
```

Pontos de atenção:

- **`encerrarSessao`** vira `prisma.sessao.deleteMany({ where: { tokenHash } })` e apaga o cookie.
- **Renovação deslizante:** para não gravar no banco a cada request, só atualize `expiraEm` quando faltar menos da metade do tempo. Ao renovar, **reenvie o cookie com novo `maxAge`**. Hoje o código renova só o registro em memória, e o cookie expira 30 min após o login mesmo com o usuário ativo.
- **Limpeza:** sessões expiradas podem ser apagadas no próprio login (`deleteMany({ where: { expiraEm: { lt: new Date() } } })`).
- `criarSessao` passa a receber `usuarioId`. Ajuste a chamada em `login/route.ts`.

### 2.4 `PATCH /api/auth/session` grava no banco

`atualizarSessao(patch)` passa a fazer, numa **transação** (`prisma.$transaction`):

| Campo do patch | Escrita |
|---|---|
| `usuario.*` | `usuario.update` (normalize `email` para minúsculas e trate e-mail duplicado, ver 2.5) |
| `perfilViagem` | `preferencias.update` com `perfilViagem.toUpperCase()` |
| `preferencias.orcamento*`, `dataPrevista` | `preferencias.update` |
| `preferencias.interesses` | `usuarioInteresse.deleteMany` + `createMany` com os ids buscados por `slug` |
| `preferencias.destinos` | Sincroniza `viagens`: apaga as que saíram e cria as novas com upsert em `destinos` (ver Fase 3) |

Depois, releia com `SESSION_INCLUDE` e devolva `toPublicSession(...)`. O front não muda nada.

### 2.5 Nova rota `POST /api/auth/register`

O wizard já monta o `AuthPayload` (`registration-wizard.tsx:65`) e só falta enviá-lo.

**Servidor** (`src/app/api/auth/register/route.ts`):

1. Valide com Zod: reuse os schemas de `conta.schema.ts` e `sessao.schema.ts`.
2. Gere o hash **antes** da transação. O scrypt é lento, e transação boa é transação curta.
3. Rode tudo numa `prisma.$transaction(async (tx) => { ... })`:
   - `tx.usuario.create` com `preferencias: { create: {...} }` e `interesses: { create: [...] }` (nested writes).
   - Para cada destino: `tx.destino.upsert({ where: { codigoPais_cidade: {...} } })` e depois `tx.viagem.create`.
4. Se o e-mail já existir, o Prisma lança `PrismaClientKnownRequestError` com `code === "P2002"`. Responda **409** `"Este e-mail já está cadastrado"`.
5. `criarSessao(usuario.id)` e responda `201` com a sessão.

> `DestinoDesejado` hoje só tem `{ pais, cidade }`, mas a tabela `destinos` precisa de `codigo_pais`. Recomendado: adicionar `codigoPais` ao tipo e enviá-lo do `PreferencesStep`, que já tem `DESTINATIONS[].codigo`. Assim o servidor não precisa adivinhar o código pelo nome.

**Front:**

- `session.service.ts`: crie `register(payload: AuthPayload): Promise<Session>`.
- `use-session-mutations.ts`: crie `useRegisterMutation()`, com `onSuccess` usando `setQueryData(SESSION_QUERY_KEY, session)`, igual ao login.
- `registration-wizard.tsx`: troque o `console.log` por `mutation.mutate(payload, { onSuccess: () => { reset(); router.push("/dashboard"); } })`. Em erro, **não** chame `reset()`, para o usuário não perder o preenchimento, e mostre a mensagem (`arquitetura-alvo.md` §4).

### 2.6 Remover o mock

Apague `src/server/auth/usuarios-mock.ts` e confira com `grep -r usuarios-mock src`.

**✔ Pronto quando:** dá para criar uma conta, sair, entrar de novo, mudar o perfil de viagem, reiniciar o `npm run dev` e **continuar logada** (antes, o restart apagava as sessões).

---

## Fase 3 — Viagens ("Meus Destinos")

Hoje a lista de destinos desejados mora em `session.preferencias.destinos`. Faça a migração em dois passos, para nunca quebrar a tela.

### 3a. Mesmo contrato, novo armazenamento

Ao fim da Fase 2, `preferencias.destinos` já é lido e gravado na tabela `viagens` (via mapper e PATCH), e `useMeusDestinos` continua funcionando sem mudança.

**Regra do limite de 4:** antes de criar uma viagem, conte as do usuário com `status: "PLANEJANDO"`. Se forem 4, responda `422`. A constante `MAX_DESTINATIONS = 4` já existe. **A regra precisa estar no servidor**, porque o front pode ser burlado.

### 3b. Rotas próprias (quando precisar de `status` e `data_prevista` por viagem)

| Rota | Faz |
|---|---|
| `GET /api/viagens` | Lista as viagens do usuário com o destino. |
| `POST /api/viagens` `{ codigoPais, pais, cidade }` | Upsert em `destinos` + `create` em `viagens` (passos 3 e 4 do PDF). |
| `PATCH /api/viagens/[id]` `{ status?, dataPrevista? }` | Muda o status (PLANEJANDO → ESCOLHIDA → REALIZADA). |
| `DELETE /api/viagens/[id]` | Remove. Use `deleteMany({ where: { id, usuarioId } })` para nunca apagar a viagem de outro usuário. |

Front: `features/destinos/api/trips.service.ts` + `use-trips.ts` com `useQuery(["viagens"])`. Nas mutations, `invalidateQueries({ queryKey: ["viagens"] })`. Quando tudo migrar, tire `destinos` de `SessionPreferencias`.

> **Segurança em toda rota com `[id]`:** sempre filtre por `usuarioId` da sessão junto com o `id`. Nunca confie que o id que veio do front pertence a quem está logado.

---

## Fase 4 — Passeios salvos (♡ no Explorar)

Enquanto a "API de passeios" não está definida, as experiências do catálogo local (`src/server/destinos/catalogo`) fazem esse papel. O `experiencia.id` vira o `api_id`.

| Rota | Faz |
|---|---|
| `GET /api/passeios-salvos` | `apiId`s salvos pelo usuário, para pintar os corações. |
| `POST /api/passeios-salvos` `{ apiId }` | Upsert em `passeios` + `create` em `passeios_salvos` (`skipDuplicates`). |
| `DELETE /api/passeios-salvos/[apiId]` | Apaga **só** a linha de `passeios_salvos`. |

**Importante:** o `POST` recebe **só o `apiId`**. O servidor busca título, preço e categoria na fonte (hoje o catálogo, depois a API). Se aceitar `preco` vindo do front, qualquer pessoa grava o preço que quiser.

Front: `features/explorar/api/use-saved-tours.ts` com `useQuery(["passeios-salvos"])` + `useToggleSavedTour()` com update otimista (mesmo padrão de `useUpdatePerfilViagemMutation`). O botão ♡ entra no `ExperienciaCard` com `aria-label` e `aria-pressed`.

---

## Fase 5 — APIs externas

Todas são chamadas **no servidor** (Route Handler), nunca direto do navegador. Assim dá para fazer cache, trocar de provedor sem mexer no front e não expor chaves.

| API | Uso | Onde |
|---|---|---|
| [REST Countries](https://restcountries.com) | Bandeira, moeda e coordenadas do país | Preenche os campos opcionais de `destinos` no upsert (Fase 3). Também pode substituir a lista fixa `DESTINATIONS`. |
| [Open-Meteo](https://open-meteo.com) | Clima atual e previsão | `GET /api/destinos/[id]/clima`, usando `destinos.latitude`/`longitude`. |
| [Frankfurter](https://frankfurter.dev) | Câmbio | `GET /api/cambio?de=EUR&para=BRL`, usando `destinos.moeda` e `preferencias.moeda`. |
| API de passeios | A definir | Substitui o catálogo na Fase 4, e só o `GET` de busca muda. |

Use `fetch(url, { next: { revalidate: 3600 } })` para o Next cachear as respostas (o câmbio pode ficar em cache por 1h, o clima por 30 min).

> **O catálogo editorial fica.** O ranking (`utils/score.ts`) usa `afinidade`, `nota`, `custoDiarioBRL`, informações que nenhuma API pública fornece. As APIs **enriquecem** os destinos, não substituem o catálogo. O PDF confirma isso: o ranking é calculado na hora, sem coluna.

---

## Fase 6 — Deploy e endurecimento

1. **Vercel → Settings → Environment Variables:** `DATABASE_URL` e `DIRECT_URL`. O `postinstall` já gera o client no build.
2. **Migrations em produção:** rode `npm run db:deploy` (aplica migrations pendentes sem gerar novas). O mais simples: rodar manualmente antes de cada deploy que mexe no schema. Depois, dá para automatizar no build.
3. **Previews isolados:** a [integração Neon ↔ Vercel](https://vercel.com/integrations/neon) cria um *branch* do banco por preview, para um PR nunca mexer nos dados de produção.
4. **Rate limit:** `limite-de-tentativas.ts` guarda contagens em memória, e na Vercel cada instância tem a sua. Mova para uma tabela no Postgres ou para o Upstash Redis.
5. **Testes de rota com Postman:** monte uma collection com login → session → PATCH → logout. O cookie é guardado automaticamente entre requests.

---

## Mapa: tela → tabela → rota

| Tela | Tabelas | Rotas |
|---|---|---|
| Cadastro (3 etapas) | `usuarios`, `preferencias`, `usuario_interesses`, `destinos`, `viagens`, `sessoes` | `POST /api/auth/register` |
| Login / Logout | `usuarios`, `sessoes` | `POST /api/auth/login`, `POST /api/auth/logout` |
| Dashboard / header | todas da sessão | `GET`/`PATCH /api/auth/session` |
| Perfil | `usuarios`, `preferencias`, `usuario_interesses` | `PATCH /api/auth/session`, `POST /api/auth/senha` |
| Meus Destinos / Comparador | `viagens`, `destinos` | sessão (3a) → `/api/viagens` (3b) |
| Explorar ♡ | `passeios`, `passeios_salvos` | `/api/passeios-salvos` |
| Detalhe do destino | `destinos` + APIs | `/api/destinos`, `/clima`, `/api/cambio` |

## Ordem sugerida de PRs

1. ✅ `feat/database-foundation`: Fase 1
2. `feat/auth-database`: 2.1 → 2.4 + 2.6 (login, sessão, perfil no banco)
3. `feat/register-endpoint`: 2.5 (cadastro de verdade)
4. `feat/trips-api`: Fase 3
5. `feat/saved-tours`: Fase 4
6. `feat/external-apis`: Fase 5
7. Deploy (Fase 6) pode acontecer já depois do PR 2.
