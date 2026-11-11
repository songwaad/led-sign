# LED Sign

React + Vite. 2 themes: **LED Board** and **Fireworks**. Edit the text, resize it, switch theme, go fullscreen.

## Run locally
```bash
npm install
npm run dev
```

## Deploy to Vercel
- Import the repo (or run `vercel` in this folder)
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

## Controls
- Text box: 1 line = 1 row of the sign
- Theme buttons, font size slider (40-130%)
- `F` fullscreen, `H` hide/show the panel
- Settings are saved in the browser (localStorage)
- The 1920x1080 stage scales to fit any screen automatically
