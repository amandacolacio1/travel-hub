# Travel Hub — Arquitetura Alvo

> Este documento descreve o **estado final pretendido** da arquitetura de dados do projeto — como backend, TanStack Query, Zustand e formulários se encaixam, e como a informação flui do cadastro até o dashboard. Complementa (não substitui) `travel-hub-plano-completo.md`, que foca no fluxo de cadastro em si.

---

## 1. O problema central que essa arquitetura resolve

Até agora, boa parte da conversa foi sobre **onde cada estado mora**. Esse documento formaliza isso numa regra que guia todas as decisões daqui pra frente:

> **Todo dado na aplicação tem uma "natureza", e a natureza dele decide onde mora — não o módulo, não a tela, a natureza do dado.**

Existem três naturezas, e confundi-las é a causa mais comum de bugs de sincronização em apps React:

| Natureza                                                                                              | Exemplo no Travel Hub                                    | Onde mora                                               | Ferramenta          |
| ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------- | ------------------- |
| **Server State** — dado que existe no backend, pode ficar desatualizado, precisa de cache/revalidação | Usuário logado, preferências salvas, ranking de destinos | Cache gerenciado, **não em** `useState` **nem Zustand** | **TanStack Query**  |
| **Global Client State** — estado de UI/sessão que só existe no navegador, não vem de uma API          | "Estou no meio do wizard, etapa 2", tema claro/escuro    | Store fora da árvore de componentes                     | **Zustand**         |
| **Local Form State** — o que o usuário está digitando agora, validação, erros                         | Campos da Etapa 1 antes de confirmar                     | Dentro do componente da etapa                           | **React Hook Form** |

🤔 Pergunta pra mentoria, porque é a mais importante desse documento inteiro: por que o **usuário logado e suas preferências** são Server State (TanStack Query) e não Zustand, mesmo sendo um dado que "parece" global? (Dica: pensa no que acontece se o usuário mudar o perfil de viagem em outra aba, ou se o token expirar — quem precisa saber disso automaticamente?)

---

## 2. Backend — Route Handlers como BFF

A stack lista Node.js mas não um framework de backend separado (Express, Nest, etc). Isso aponta pra uma escolha comum em projetos Next.js modernos: usar os **Route Handlers** do próprio App Router (`app/api/**/route.ts`) como um **BFF** (Backend for Frontend) — uma camada HTTP fina, dentro do mesmo projeto, sem precisar de outro servidor rodando.

```
src/
└── app/
    └── api/
        ├── auth/
        │   ├── register/route.ts   # POST — cria usuário + preferências
        │   ├── login/route.ts      # POST
        │   └── session/route.ts    # GET — "quem sou eu"
        └── destinos/
            └── route.ts            # GET — lista/ranking, aceita query params de filtro
```

Por baixo desses `route.ts`, a mesma ideia de **camada de serviço** que já vínhamos desenhando em `features/*/api/*.service.ts` — só que agora o service roda no servidor (dentro do Route Handler), não é mockado no cliente. Hoje (fase de mock), o service devolve dados fixos com delay simulado; quando entrar banco de dados, só o _corpo_ da função muda — a assinatura (o que entra, o que sai) permanece.

🤔 Pergunta pra mentoria — vale muito a pena levantar isso especificamente: **Route Handlers do Next é a escolha certa pro nível de projeto de vocês, ou um backend separado (Express/Nest/Fastify) seria mais alinhado com o que um time sênior real faria?** Não existe resposta universal — depende de: o backend vai crescer e ser consumido por outros clientes além desse frontend? Vai ter lógica de negócio pesada o suficiente pra merecer isolamento? Pra um projeto de estudo focado em aprender React/Next, Route Handlers como BFF é **suficiente e realista**, mas é uma decisão consciente, não default.

---

## 3. Sessão e autenticação — uma única fonte da verdade

Erro comum: guardar o usuário logado tanto num cookie/token (que o backend controla) quanto duplicado num Zustand store, esperando que os dois fiquem sincronizados manualmente. Isso quebra assim que um dos dois desatualiza.

**Padrão recomendado:**

1. Backend, ao autenticar (login ou fim do cadastro), seta um **cookie httpOnly** com a sessão (o navegador guarda automaticamente, JS não consegue nem ler — mais seguro contra XSS).
2. O frontend nunca guarda o token manualmente. Em vez disso, existe **um único** `useQuery(['session'])` que bate em `GET /api/auth/session` e devolve `{ usuario, preferencias, perfilViagem }` (ou `401` se não autenticado).
3. Esse `useQuery(['session'])` é a **única fonte da verdade** sobre "quem está logado" em toda a aplicação — Dashboard, header, guarda de rota, todo mundo lê dali, ninguém duplica em Zustand.

```
shared/
└── session/
    ├── use-session.ts        # hook: useQuery(['session'], fetchSession)
    └── session.service.ts    # fetchSession(), logout()
```

**O que sobra pro Zustand, então?** Só o que é _puramente client-side e não vem do backend_ — ex: "o usuário fechou o banner de boas-vindas", "o wizard de cadastro está na etapa 2". Isso é a diferença entre "estado sobre o usuário" (Query) e "estado sobre a interface" (Zustand).

🤔 Pergunta pra mentoria: nesse desenho, o `useCadastroStore` (Zustand, guarda os dados do wizard enquanto ainda não confirmado) continua fazendo sentido, ou ele deveria virar parte do `useQuery`/mutation também? Pensa: os dados do wizard existem no backend antes do usuário terminar a Etapa 3? Isso ajuda a decidir se é Server State ou Client State.

---

## 4. Onde entra o React Hook Form nisso tudo

RHF continua exatamente como desenhado no plano de cadastro — validação e estado de digitação **local a cada etapa**. A novidade aqui é **o que acontece no fim da Etapa 3**, quando o cadastro precisa de fato ir pro backend:

```
EtapaPerfilViagem (RHF valida)
   └─> onProximo(dadosEtapa3)
        └─> CadastroWizard junta dadosConta + dadosPreferencias + dadosEtapa3 (do useCadastroStore)
             └─> dispara useMutation(registerUser) do TanStack Query
                  ├─ sucesso: invalida/atualiza ['session'], useCadastroStore.reset(), redireciona pro /dashboard
                  └─ erro: mostra erro na tela, mantém dados no store (usuário não perde o preenchimento)
```

Ou seja: **as etapas 1 e 2 nunca chamam a API sozinhas** — elas só acumulam dados no `useCadastroStore`. Só a etapa final dispara a mutation, com o payload completo. Isso evita criar "meio-usuários" no backend se alguém abandonar o fluxo na Etapa 2.

🤔 Pergunta pra mentoria: existe um argumento a favor do **oposto** — cada etapa já persistir progressivamente no backend (ex: criar o usuário "rascunho" já na Etapa 1)? Em que tipo de produto isso valeria a pena, e por que o Travel Hub provavelmente não precisa disso agora?

---

## 5. Como as preferências do cadastro chegam até o Dashboard

Esse é o fio que conecta as duas pontas do projeto. Passo a passo:

1. **Na Etapa 2**, o usuário seleciona interesses (`string[]`), orçamento, destinos desejados — tudo isso vive temporariamente no `useCadastroStore`.
2. **Na Etapa 3**, perfil de viagem (`sozinho | casal | familia`) é adicionado ao mesmo store.
3. **Ao finalizar**, a `useMutation(registerUser)` envia o payload completo pro backend, que persiste o Usuário **com suas preferências já embutidas** (não são duas entidades separadas do ponto de vista do frontend — preferências são um campo do Usuário).
4. **No Dashboard**, nada é lido do `useCadastroStore` (que inclusive foi resetado no passo 3). O Dashboard usa `useQuery(['session'])` — o mesmo hook do item 3 da seção anterior — que já devolve `{ usuario, interesses, orcamento, perfilViagem, destinosDesejados }` vindos do backend.
5. O Dashboard então faz **uma segunda query, dependente da primeira**: `useQuery(['destinos', 'ranking', { interesses, orcamento, perfilViagem }])` — o ranking de destinos é recalculado com base nas preferências atuais do usuário, que vieram da sessão.

```
useQuery(['session'])
        │
        │ usuario.interesses, usuario.perfilViagem, usuario.orcamento
        ▼
useQuery(['destinos', 'ranking', preferenciasAtuais])   ← query encadeada/dependente
        │
        ▼
   Dashboard renderiza o ranking
```

🤔 Pergunta técnica pra pesquisar com a mentora: isso se chama **dependent query** (query dependente) no TanStack Query — a segunda só dispara quando a primeira já tem dado (`enabled: !!usuario`). Por que simplesmente **não seria possível** rodar as duas em paralelo desde o início, já que tecnicamente são duas chamadas HTTP diferentes?

---

## 6. Transição de perfil de viagem pós-cadastro (o texto "altere isso a qualquer momento")

Os designs da Etapa 3 dizem literalmente: _"Você pode alterar isso a qualquer momento no dashboard."_ Isso significa que `perfilViagem` **não é um dado write-once do cadastro** — é um dado editável, e mudá-lo precisa **re-afetar o ranking de destinos imediatamente**, sem o usuário dar refresh na página.

Isso é o caso de uso clássico de **mutation + invalidation** do TanStack Query:

```
Usuário clica "Casal" no seletor do dashboard
        │
        ▼
useMutation(updatePerfilViagem) → PATCH /api/auth/session (ou /api/usuario)
        │
        ├─ ao ter sucesso: queryClient.invalidateQueries(['session'])
        │        │
        │        ▼
        │  useQuery(['session']) refaz a busca automaticamente
        │        │
        │        ▼
        │  como ['destinos','ranking', preferenciasAtuais] depende de 'session',
        │  o TanStack Query também refaz essa query sozinho
        │        │
        │        ▼
        │  Dashboard re-renderiza com o novo ranking, sem você escrever esse
        │  "avise o dashboard que mudou" manualmente em lugar nenhum
        │
        └─ ao falhar: reverte o seletor pro valor anterior (rollback)
```

O ganho de arquitetura aqui é grande: **você não precisa de nenhum código explícito conectando "mudei o perfil" com "atualize o ranking"** — isso é consequência natural de `['destinos', 'ranking', preferenciasAtuais]` incluir `perfilViagem` na _query key_. TanStack Query trata query key diferente como "isso é outro dado", e busca de novo automaticamente.

🤔 Pergunta pra mentoria, sobre UX: enquanto o `PATCH` está em voo (rede lenta), o seletor deveria já mostrar "Casal" selecionado (assumindo que vai dar certo — **optimistic update**) ou esperar a confirmação do backend pra atualizar visualmente? Quais são os riscos de cada abordagem, especialmente se o `PATCH` falhar?

---

## 7. Estrutura de pastas final (consolidando tudo)

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts
│   │   │   ├── login/route.ts
│   │   │   └── session/route.ts
│   │   └── destinos/route.ts
│   ├── (auth)/
│   │   ├── cadastro/page.tsx
│   │   └── login/page.tsx
│   └── (dashboard)/
│       └── dashboard/page.tsx
│
├── features/
│   ├── auth/
│   │   ├── cadastro/
│   │   │   ├── components/         # EtapaConta, EtapaPreferencias, EtapaPerfilViagem, CadastroWizard
│   │   │   ├── schemas/            # Zod por etapa
│   │   │   └── store/
│   │   │       └── use-cadastro-store.ts   # Zustand — transitório, só durante o wizard
│   │   ├── login/
│   │   ├── api/
│   │   │   ├── auth.service.ts             # registerUser(), authenticate() — chamado pelas mutations
│   │   │   └── use-register-mutation.ts    # useMutation(registerUser)
│   │   └── index.ts
│   │
│   └── dashboard/
│       ├── components/
│       ├── api/
│       │   ├── destinos.service.ts
│       │   ├── use-destinos-ranking.ts     # useQuery(['destinos','ranking',...])
│       │   └── use-update-perfil-mutation.ts
│       └── index.ts
│
├── shared/
│   ├── session/
│   │   ├── use-session.ts          # useQuery(['session']) — fonte única de verdade do usuário
│   │   └── session.service.ts
│   ├── components/ui/
│   └── query/
│       └── query-client.ts         # configuração do QueryClient (staleTime, retry, etc)
│
├── lib/
│   └── mocks/
│
└── stores/
    └── use-app-store.ts            # estado global genérico, não relacionado a usuário/sessão
```

Note que **não existe mais nenhum** `usuario` **guardado em** `stores/use-app-store.ts` **nem em nenhum Zustand** — isso é intencional, é a aplicação direta da regra da Seção 1.

---
