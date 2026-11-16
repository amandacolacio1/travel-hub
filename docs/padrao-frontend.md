# Padrão de frontend

Regras para montar qualquer tela autenticada. Em dúvida, copie uma view existente (`features/*/components/*-view.tsx`).

## Estrutura de uma tela

- `src/app/(dashboard)/<rota>/page.tsx` é **fina**: só renderiza a view da feature.
- A view (`"use client"`) cuida de carregando/erro/vazio com `StateMessage` e monta a página com `Page` + `PageHeader`.
- Dados de servidor vêm de hooks do TanStack Query (`useDestinosRanking`, `useSession`…); estado de UI vem de `useState` ou Zustand. Nunca duplique dado de servidor em Zustand.
- Regra de negócio fica em `utils/` (funções puras, sem JSX): `score.ts`, `analise.ts`, `formatadores.ts`.

## Espaçamento (tokens em `globals.css`)

| Token | Valor | Use para |
|-------|-------|----------|
| `gap-inline` | 8px | ícone + texto, chips, título → descrição |
| `gap-stack` | 16px | itens empilhados, título de seção → conteúdo |
| `gap-block` | 24px | entre cards de uma grade |
| `gap-section` | 32px | entre seções da página (já aplicado por `Page`) |
| `p-card` / `p-card-lg` | 20px / 24px | padding interno de card / card de destaque |

Padding externo da página (no shell): `p-4 md:p-6 lg:p-8`. Não use valores soltos (`gap-5`, `mt-7`) quando houver token equivalente.

## Tipografia e cor

- Título de página: `font-serif text-3xl` (via `PageHeader`). Título de seção: `font-serif text-lg` (via `SectionHeading`). Título de card: `font-serif text-base`/`text-lg`.
- Corpo: `font-sans text-sm`. Legenda: `text-xs text-text-muted-400`. Rótulo em caixa alta: `Eyebrow` (cor sempre por `tone`, nunca por `className`).
- Cores só pelos tokens do tema (`brand-*`, `surface-*`, `text-muted-*`, `success/warning/error-*`). Sem hex.
- Raio e sombra: `rounded-card`, `shadow-card` (já embutidos em `Card`).

## Componentes base (`@/shared/components/ui`)

| Precisa de… | Use |
|-------------|-----|
| Bloco de conteúdo | `Card` (`tone`: default/muted/dashed/dark; `padding`: none/md/lg) |
| Cabeçalho de página | `PageHeader` (breadcrumb, eyebrow, título, descrição, ações) |
| Título de seção | `SectionHeading` |
| Ação / navegação com cara de botão | `Button` / `ButtonLink` |
| Etiqueta curta | `Badge` |
| Filtro ou tag removível | `Chip` |
| Barra de score | `ScoreBar` |
| Foto com fallback | `CoverImage` (sempre informe `sizes`) |
| Carregando / erro / vazio | `StateMessage` |
| Modal | `Modal` |
| Largura da página | `Page` (`narrow` só para formulários) |

Antes de criar um componente, confira se um destes (ou um da feature) já resolve.

## Responsividade

- Mobile primeiro: grades começam em 1 coluna e sobem com `sm:` (2) → `lg:`/`xl:` (3+).
- Tabelas largas ficam em `overflow-x-auto` com `min-w` (ver `TabelaComparativa`).
- Barras de filtro rolam na horizontal em vez de quebrar linha.
- Ações do `PageHeader` descem para baixo do título no mobile.

## Acessibilidade mínima

- Botão só com ícone precisa de `aria-label`.
- Barras de progresso usam `role="progressbar"` (já em `ScoreBar`).
- Carregando usa `role="status"`; erro, `role="alert"` (já em `StateMessage`).
- Foto decorativa: `alt=""`; foto com informação: `alt` descritivo.
