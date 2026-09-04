# Guia dos componentes — branch `feat/auth-components`

Documento para quem está começando em frontend. Explica **cada arquivo**, **para que serve**, **como foi feito** e **como as pastas se encaixam**.

> Esta branch mostra a **biblioteca visual** (design system + componentes de auth).  
> Ainda **não** é o fluxo completo de cadastro (wizard em 3 etapas). Isso vive na outra branch (`feat/auth-cadastro`).

---

## 1. Ideia geral da arquitetura (bem simples)

Pense no app como três camadas:

| Camada | Pasta | Papel |
|--------|--------|--------|
| **Rotas (páginas)** | `src/app/` | O Next.js decide a URL. Quase sem lógica de UI. |
| **Features (domínio)** | `src/features/auth/` | Coisas específicas de autenticação / cadastro. |
| **Shared (reutilizável)** | `src/shared/components/ui/` | Peças genéricas: botão, input, select… |

**Regra de ouro:**  
- Se o componente fala a linguagem do produto (“interesse Natureza”, “Continuar com Google”) → **feature**.  
- Se serve em qualquer tela (“botão primário”, “campo de texto”) → **shared**.

```
src/app/page.tsx          ← URL "/" monta a vitrine
src/app/auth/page.tsx     ← URL "/auth" shell (sem formulário ainda)
       │
       └── AuthLayout     ← feature (hero embutido + área de conteúdo)
                │
                ├── Button, Input, Select, CurrencyInput  ← shared
                └── InterestCard, ProfileCard, SocialAuth… ← feature
```

---

## 2. `src/features/auth/components` — arquivo por arquivo

### 2.1 `components-showcase.tsx`

**Importância:** é a “página de catálogo” do design system. Mostra tipografia, botões, campos, cards e login social juntos para você **ver e testar** sem montar o fluxo de cadastro.

**Como foi feito:**
- Marca `"use client"` porque usa `useState` (estado no navegador).
- Guarda estados de demonstração: etapa selecionada, interesses, perfil, orçamento, país.
- Importa peças de `shared` e das outras pastas de auth.
- Organiza em `<section>`s (Tipografia, Botões, Campos…).

**Para iniciantes:**  
Sem essa tela, você teria que ir em várias páginas para conferir se o botão ou o input ficaram certos. Aqui tudo fica num só lugar — como um catálogo de peças de Lego.

---

### 2.2 `auth-layout.tsx`

**Importância:** layout da área de autenticação / vitrine. Une o **hero** (imagem + textos da marca) com a coluna de conteúdo (`children`).

**Como foi feito:**
- Hero embutido no próprio layout (não precisa de `auth-hero.tsx` separado).
- Desktop: hero à esquerda (~40%), conteúdo à direita.
- Mobile: hero no topo, conteúdo em card com cantos arredondados.
- Props opcionais: `currentStep` (mostra `StepIndicator`), `footer`, `heroSizes`.

**Para iniciantes:**  
Layout = “sala”. Hero = quadro na parede (já pregado na sala). O formulário/vitrine entra como `children` (o que vai na mesa).

---

### 2.3 `auth-icon.tsx`

**Importância:** ponto único para ícones usados na feature de auth. Evita espalhar SVGs e imports do Lucide em todo lugar.

**Como foi feito:**
- Ícones genéricos vêm da lib **`lucide-react`** (Leaf, Heart, ArrowRight…).
- O Google **não** usa Lucide: usa um SVG colorido oficial do “G” (fundo transparente).
- API simples: `<AuthIcon name="natureza" />` ou `name="google"`.

**Para iniciantes:**  
Em vez de cada componente inventar o próprio desenho, todos pedem o ícone pelo nome. Se amanhã trocar o ícone de “natureza”, você muda só neste arquivo.

---

### 2.4 `social-auth.tsx`

**Importância:** bloco “Ou acesse com” + botão **Continuar com Google**.

**Como foi feito:**
- Divider com texto no meio.
- Usa o **`Button` do design system** com `variant="secondary"`.
- Dentro do botão: `AuthIcon name="google"` + texto (padrão das guidelines do Google: não usar só a palavra “Google”).
- Por enquanto fica `disabled` (fluxo real ainda não existe nesta branch).

**Para iniciantes:**  
Aqui você vê composição: um componente de feature montado em cima de um botão **shared**.

---

### 2.5 `step-indicator.tsx`

**Importância:** mostra em qual etapa o usuário está (1, 2 ou 3). Visualmente são tres “barrinhas”.

**Como foi feito:**
- Recebe `current` e `total` (padrão 3).
- Gera um array com `Array.from` e pinta de escuro as etapas `<= current`.
- Usa atributos de acessibilidade (`role="progressbar"`, `aria-valuenow`…).

**Para iniciantes:**  
É só feedback visual. Não navega sozinho — quem muda a etapa é o componente pai (no cadastro completo, o wizard).

---

### 2.6 `interest-card.tsx`

**Importância:** card clicável de interesse (Natureza, Cultura, Gastronomia…). Pode ficar selecionado ou não (multi-select).

**Como foi feito:**
- Recebe `option` (dados), `selected` (boolean) e `onToggle`.
- É um `<button>` com `aria-pressed` (acessível).
- Visual muda: fundo escuro quando selecionado, claro quando não.
- Ícone via `AuthIcon`.

**Para iniciantes:**  
O card **não guarda** sozinho a lista de interesses. Ele só avisa o pai: “clicaram em mim”. O estado mora no `ComponentsShowcase` (ou no wizard, no futuro).

---

### 2.7 `profile-card.tsx`

**Importância:** card de perfil de viagem (Sozinho / Casal / Família). É escolha **única** (como radio).

**Como foi feito:**
- Parecido com `InterestCard`, mas com `onSelect` e um círculo de check à direita.
- Borda mais forte quando selecionado.

**Para iniciantes:**  
Mesma ideia: componente “burro” (apresentação) + pai “inteligente” (estado).

---

### 2.8 Constantes e tipos (fora de `components/`, mas ligados)

Não estão em `components/`, mas a vitrine depende deles:

| Arquivo | Função |
|---------|--------|
| `constants/interesses.ts` | Lista dos 6 interesses (id, título, descrição, ícone). |
| `constants/perfis-viagem.ts` | Sozinho, Casal, Família. |
| `constants/destinos.ts` | Países e cidades mockadas para os selects. |
| `types/auth.ts` | Tipos TypeScript (`PerfilViagem`, etc.). |
| `assets/` | Imagens (banner) e exports. |
| `index.ts` | Porta de saída da feature: reexporta o que o resto do app pode importar. |

**Para iniciantes:**  
Separar **dados** (constants) de **UI** (components) evita misturar “o que mostrar” com “como desenhar”.

---

## 3. `src/shared/components/ui` — arquivo por arquivo

Aqui mora o **design system**: peças sem regra de negócio de viagem/auth.

### 3.1 `index.ts`

**Importância:** atalho de import.

```ts
import { Button, Input } from "@/shared/components/ui";
```

Em vez de importar cada arquivo separado. É o “balcão” da pasta.

---

### 3.2 `button.tsx`

**Importância:** botão padrão do app (primário, secundário, ghost).

**Como foi feito:**
- `forwardRef` para permitir `ref` no `<button>` (útil com forms e libs).
- Variantes em um mapa de classes Tailwind:
  - **primary:** fundo `brand-500`, texto claro.
  - **secondary:** fundo branco (`paper`), texto `brand-500`, sem borda.
  - **ghost:** estilo de link/texto.
- Aceita `disabled`, `type`, `className` e o resto das props nativas do botão HTML.

**Para iniciantes:**  
Um botão bem feito evita copiar as mesmas 10 classes em 20 lugares. Muda o visual uma vez → muda em todo o app.

---

### 3.3 `label.tsx`

**Importância:** rótulo uppercase pequeno acima dos campos (`NOME COMPLETO`, `E-MAIL`…).

**Como foi feito:**
- Wrapper fino em torno de `<label>`.
- Classes de tipografia e cor via tokens (`text-muted-500`).

**Para iniciantes:**  
Label ≠ Input. O label descreve; o input recebe o valor. Ligam-se pelo `htmlFor` / `id`.

---

### 3.4 `input.tsx`

**Importância:** campo de texto padrão (nome, e-mail, senha…).

**Como foi feito:**
- Combina `Label` + `<input>` + mensagem de `error`.
- Tokens: `bg-paper`, `border-surface-600`, foco `brand-500`, erro `error-500`.
- Prop opcional **`startAdornment`**: conteúdo à esquerda (ícone, “R$”…). Quando existe, o campo vira um container flex com borda (mesmo visual).

**Para iniciantes:**  
`startAdornment` existe para o `CurrencyInput` reutilizar o **mesmo** input, em vez de reinventar borda e label.

---

### 3.5 `select.tsx`

**Importância:** lista dropdown (país, cidade).

**Como foi feito:**
- Mesmo padrão do Input: label, borda, erro.
- Recebe `options: { value, label }[]` e um `placeholder`.
- Usa `<select>` nativo do HTML (simples e acessível).

**Para iniciantes:**  
Não é um select “customizado” com popup complexo — é o select do browser estilizado. Suficiente para MVP.

---

### 3.6 `currency-input.tsx`

**Importância:** campo de orçamento em reais, com digitação livre e formatação.

**Como foi feito:**
- `"use client"` porque formata conforme a pessoa digita.
- **Não** cria outro visual de input: **usa o `Input` shared** com `startAdornment` (ícone Wallet + `R$`).
- Guarda o valor como `number`.
- Na tela mostra `toLocaleString("pt-BR")` (ex.: `8000` → `8.000`).
- Ao digitar, remove tudo que não é dígito e reconstrói o número.

**Para iniciantes:**  
Isso se chama **composição**: um componente especializado empilha comportamento (máscara de moeda) em cima de um componente genérico (`Input`).

---

## 4. Por que **não** existe mais `app/auth` chamando a feature?

### O que existia / existe na outra branch

Na branch do **fluxo de cadastro** (`feat/auth-cadastro`), a ideia é:

```
src/app/auth/page.tsx      ← rota /auth
        └── AuthPage / AuthWizard  ← feature com as 3 etapas
```

A pasta `app/` só “amarra” a URL. A lógica e a UI ficam em `features/`.

### O que esta branch faz (`feat/auth-components`)

O objetivo **desta** branch é mostrar e validar **componentes**, e já deixar o **shell** de `/auth` pronto.

Por isso:

1. Existe `src/app/auth/page.tsx` — rota `/auth` com `AuthLayout` + placeholder (sem wizard).
2. A vitrine continua em **`src/app/page.tsx`** (rota `/`), também usando `AuthLayout`.
3. As duas pages chamam a feature; a diferença é o `children` (catálogo vs. texto “em breve”).

Quando o fluxo de cadastro entrar, o wizard substitui o placeholder de `/auth` — o layout e o hero já estão no lugar.

### Por que isso faz sentido

| Branch | Pergunta que responde | Rota principal |
|--------|------------------------|----------------|
| `feat/auth-components` | “Os componentes estão certos? O shell de `/auth` está pronto?” | `/` (vitrine) e `/auth` (shell) |
| `feat/auth-cadastro` | “O usuário consegue se cadastrar em 3 etapas?” | `/auth` (wizard) |

Evita misturar no mesmo PR:

- catálogo de UI, e  
- fluxo completo com React Hook Form, schemas Zod, etc.

Quando as duas forem mescladas na `main`, o natural é:

- manter os componentes shared + feature;
- ter de novo (ou manter) a rota `/auth` para o wizard;
- a home pode voltar a ser landing / link “Começar cadastro”.

### Resumo em uma frase

**A feature `auth` continua.** Há rota `/auth` com o shell (`AuthLayout`), sem o formulário multi-etapa ainda. A home usa o mesmo layout para a vitrine de componentes.

---

## 5. Glossário rápido para iniciantes

| Termo | Significado |
|-------|-------------|
| **Componente** | Função React que devolve UI (`function Button() { ... }`). |
| **Props** | Dados que o pai passa para o filho (`variant="secondary"`). |
| **Estado (`useState`)** | Valor que muda com a interação e redesenha a tela. |
| **`"use client"`** | Marca o arquivo para rodar no navegador (hooks, eventos). |
| **Tokens** | Cores/fontes nomeadas em `globals.css` (`brand-500`, `paper`…). |
| **Tailwind** | Classes utilitárias (`bg-paper`, `rounded-lg`) no JSX. |
| **forwardRef** | Permite que o pai pegue a referência do elemento DOM interno. |
| **Feature-based** | Organizar código por área do produto (`auth`), não só por tipo (`components` soltos). |

---

## 6. Ordem sugerida de leitura (se for estudar o código)

1. `src/app/page.tsx` e `src/app/auth/page.tsx` — como as URLs montam a tela  
2. `auth-layout.tsx` — shell com hero + conteúdo  
3. `components-showcase.tsx` — o que aparece na vitrine  
4. `button.tsx` → `input.tsx` → `label.tsx` — base do design system  
5. `currency-input.tsx` — exemplo de composição  
6. `interest-card.tsx` / `profile-card.tsx` — UI com estado no pai  
7. `social-auth.tsx` + `auth-icon.tsx` — feature + shared juntos  
8. `step-indicator.tsx` — progresso das etapas  

---

*Documento gerado para a branch `feat/auth-components` do Travel Hub.*
