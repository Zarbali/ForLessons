# Veronika

Premium English learning web app — made with love.  
**No account required.** Progress is saved in the browser (Local Storage).

Сайт специально для моей любимой, удачи с учёбой)

## Live site (GitHub Pages)

After deploy:

**https://zarbali.github.io/ForLessons/**

### One-time setup in GitHub

1. Open repo → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Push to `master` — workflow **Deploy to GitHub Pages** builds the app
4. Wait ~1–2 minutes, then open the link above

If you still see this README, Source is still set to branch/`/` — switch it to **GitHub Actions**.

## Local

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
```

Static files go to the `out/` folder.

## Features

- **1300+ words** across 12 categories
- Learn modes, games, AI tutor, focus timer
- Music dock (can be closed)
- Dark / light mode, PWA

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion
