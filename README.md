# Dragsy

Dragsy is a WYSIWYG UI builder that lets you design visually and compile directly to real Vue or React components. Start with customizable Bootstrap 5 or Tailwind CSS presets, or build from scratch — everything is fully customizable either way. No browser-editor hopping. AI integration coming in V2.

## How it works

1. **Pick a styling system** — Bootstrap 5 or Tailwind CSS (chosen once, upfront)
2. **Pick an output framework** — Vue or React
3. **Start from a preset or blank canvas** — v1 ships a small preset library (navbars, cards, footers, images)
4. **Design visually** — WYSIWYG in-browser editing; every preset is fully overwritable
5. **Preview across screen sizes**
6. **Export** — get clean Vue or React code, ready to drop into your own project

## Status

🚧 Early development (v1). Currently:
- Styling/framework selection and home page are built
- Vue compiler is done
- No backend yet — everything runs client-side, with state persisted to IndexedDB

v1 focuses on markup and styling only (no logic/interaction compilation yet).

## Tech stack

- [Nuxt](https://nuxt.com) (Vue)
- [Pinia](https://pinia.vuejs.org) for state management
- IndexedDB for local persistence

## Setup

Install dependencies:

```bash
npm install
```

Start the development server on `http://localhost:3000`:

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
