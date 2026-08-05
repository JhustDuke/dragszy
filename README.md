# Dragszy 

Dragsy is a WYSIWYG UI builder that lets you design visually and compile directly to real Vue or React components. Start with customizable Bootstrap 5 or Tailwind CSS presets, or build from scratch — everything is fully customizable either way. No browser-editor hopping. AI integration coming in V2.

## How it works

1. **Pick a styling system** — Bootstrap 5 or Tailwind CSS (chosen once, upfront)
2. **Pick an output framework** — Vue or React
3. **Start from a preset or blank canvas** — v1 ships a small preset library  (navbars, cards, footers, images)all presets I designed to be mobile first 
4. **Design visually** — WYSIWYG in-browser editing; every preset is fully overwritable
5. **Preview across screen sizes**
6. **Export** — get clean Vue or React code, ready to drop into your own project

## Status

🚧 Early development (v1). Currently:
- Styling/framework selection and home page are built
- Vue compiler is done
- No backend yet — everything runs client-side, with state persisted to IndexedDB

v1 focuses on markup and styling only (no logic/interaction compilation yet).

## Controls

Dragsy uses keyboard shortcuts to switch between tool modes on the canvas (similar to CorelDraw):

- `C` — Create mode: click to place a new element, then choose the element type (e.g. box, text, image)
- `R` — Resize mode: select an element and drag its handles to resize
- `M` — Move mode: select and drag an element to reposition it
- `U` — Update mode: select an element, then edit its inline styles, classes, or text content

Many more controls are available — see the in-app **Help** section for the full list.

Every change is undo/redo-able — so you're always safe after shooting yourself in the foot! 🥲

## Tech stack

- [Nuxt](https://nuxt.com) (Vue)
- [Pinia](https://pinia.vuejs.org) for state management
- IndexedDB for local persistence

## Setup

Install dependencies:

```bash
npm install
```

Start the development server on `http://localhost:3331`:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Locally preview a production build:

```bash
npm run preview
```

## Roadmap

- Expand preset library
- Layout/logic compilation beyond markup + styling
- AI integration (V2)