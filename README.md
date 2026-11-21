# Kajal Patel — Portfolio

A React + Vite + Tailwind portfolio site with scroll animations, a project
timeline, an interactive cursor-linked dot background, and one-click resume
PDF download.

## Folder structure

```
kajal-portfolio/
├── index.html            Entry HTML (Vite loads src/main.jsx from here)
├── package.json           Dependencies & scripts
├── vite.config.js         Vite + React plugin config
├── tailwind.config.js     Tailwind content paths
├── postcss.config.js      Tailwind/autoprefixer pipeline
├── public/                Static assets (favicon, images) — served as-is
└── src/
    ├── main.jsx            React root — mounts <App /> into #root
    ├── App.jsx             The entire portfolio (nav, hero, sections, canvas bg)
    └── index.css           Tailwind directives + global resets
```

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

## Deploy

`dist/` is a static site — drag-and-drop it into Netlify, or connect the repo
to Vercel/Netlify and use:
- Build command: `npm run build`
- Output directory: `dist`

## Customize

- **Colors** — all hex values live in the `COLORS` object at the top of `src/App.jsx`.
- **Content** — skills, projects, and achievements are plain arrays
  (`SKILL_GROUPS`, `PROJECTS`, `ACHIEVEMENTS`; add `repo` / `demo` URLs to a project to show its link buttons) near the bottom of `src/App.jsx`.
- **Resume PDF** — generated client-side in `downloadResumePDF()` using jsPDF
  (loaded from CDN at click-time, no install needed). Edit the text there to
  update what's in the downloaded PDF.
- **Project links** — add real GitHub/live-demo URLs by wrapping each project
  card's tags or title in an `<a href="...">`.


## Updating your portfolio later

All your content lives in **`src/data.js`**. You never need to touch `App.jsx` for routine updates.

- **New project:** copy a block in `PROJECTS`, paste it at the top, edit the text, add your `repo` and `demo` links.
- **New skill:** add it to the right group in `SKILL_GROUPS`.
- **New achievement:** add a line to `ACHIEVEMENTS`.
- **Learning something new:** edit `PROFILE.learning`.

The hero terminal, the chatbot and the Resume PDF button all read from this same file, so one edit updates everything. After editing, run `npm run dev` to check, then `git add . && git commit -m "Update portfolio" && git push` 

PortFlio Link :-  https://kajal-portfolio-three.vercel.app/
