# Design notes

**Who it's for:** founders, finance leads and board members who want to see what a
decision does to cash and ownership before they commit. The look should feel like a
trustworthy finance tool, not a toy and not a generic startup landing page.

## The look

Think of a clean ledger: cool paper, dark ink, one blue accent.

| Token | Light | Dark | Used for |
|---|---|---|---|
| Canvas | `#f3f4f1` | `#0f1216` | Page background |
| Surface | `#fbfbf9` | `#161a20` | Panels and cards |
| Ink | `#15191f` | `#eceee9` | Main text |
| Muted ink | `#47505c` | `#b0b7c1` | Body copy and labels |
| Accent | `#2f4bd8` | `#8ea2ff` | Buttons, links, the live cash line, the logo |
| Danger | `#b4232f` | `#f08a93` | The zero-cash line and errors |

Light and dark mode follow your system setting. The three path colors (teal, amber,
blue) are data colors so you can tell paths apart. They don't mean better or worse.

**Type:** Schibsted Grotesk for headlines and big numbers, IBM Plex Sans for
everything else. Both are self-hosted through Fontsource, so the app never calls a
font server. Numbers in tables use tabular figures so columns line up.

**Shapes:** controls get 6px corners, panels get 10px, pills are fully round.

**Logo:** a solid blue square with "TM" in white. Same format as the Y Combinator
logo, but in our own color so it doesn't read as a knockoff. The browser tab icon
(`app/icon.svg`) matches it.

## The pages

**Home:** the hero is the real model, not a picture of it. The big founder ownership
number changes as you drag the capital slider, using the same engine as the
workspace. Below that: four quick facts, the actual equations next to a four-step
"how it works", the form to start your own decision, and your saved decisions.

**Workspace:** levers on the left, the decision map and cash chart in the middle,
and the selected path's thinking on the right. Comparisons, the sensitivity lab, the
optional AI panel and exports come after.

## Motion

There's one moment of motion on load: the hero's cash line draws itself in. Values
update instantly when you drag, with no animated counting. Turning on reduced motion
in your system turns all of it off.
