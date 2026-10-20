# Design direction

The goal: make Time Machine feel like a tool a finance lead or a board would trust. Calm,
light, data first. It's in the same family as our ChaosMonkey AI app (white canvas, thin
borders, one strong accent), but it has its own look so the two don't get mixed up.

## How it's different from ChaosMonkey

| | ChaosMonkey AI | Time Machine |
|---|---|---|
| Accent | Cobalt blue | Deep teal green `#0f6e5c` |
| Controls | Round pill buttons | Squared 8px buttons and inputs |
| Font | Figtree | Inter (bundled locally) |
| Layout | Top nav with pill tabs | Marketing page plus an app shell with breadcrumb |
| Canvas | Pure white | Light grey `#f5f6f8` with white cards |

## Tokens

All colors live as CSS variables on `:root` in `app/globals.css`.

- **Canvas and surfaces:** grey canvas `#f5f6f8`, white cards, hairline borders `#e3e6eb`.
- **Text:** ink `#0e1726`, secondary `#344054`, muted `#5d6b7e`.
- **Brand:** teal `#0f6e5c`, used for primary buttons, kickers and the live preview line.
- **Status:** green for good, red for negative cash and short runway, amber for unsaved and
  risks, violet only for AI content.
- **Paths:** blue, orange and green. These only tell paths apart. They never mean better
  or worse, and they aren't a recommendation.

## Type and numbers

Inter variable, shipped through Fontsource so there's no remote font request. Headings are
bold with tight letter spacing. Every money and percentage value uses tabular numbers so
columns line up.

## Layout

The home page reads like a B2B product page: a sticky header, a hero with a live preview
card that runs the real engine, a stats band, a three step "how it works", the new decision
form next to a privacy section, and a workbench table for saved scenarios.

The workspace is an app shell. A sticky header with a breadcrumb and Save, a page header
with export buttons, a path switcher, then a KPI strip so the four numbers that matter
(runway, ending cash, funding gap, founder ownership) sit right under the controls. Below
that, three columns: assumptions on the left, charts and comparisons in the middle, the path
brief on the right. It collapses to two columns, then one on phones.

## Motion

Barely any. The KPI strip does a tiny fade when numbers change. Values update instantly,
with no animated counting on financial numbers. Reduced motion settings turn off all
decorative motion.
