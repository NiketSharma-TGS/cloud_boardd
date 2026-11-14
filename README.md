# Cloud Board

A static CAT/MBA resource website. Built with Next.js, TypeScript, and CSS.

## Local review

Requires Node.js 20.9 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For the production version:

```sh
npm run build
npm run preview
```

## Checks

```sh
npm run check
npm run build
npm run test:ui
```

Browser checks use an already installed Google Chrome; no separate browser download is required. They start a separate preview on port 3100.

Read [architecture.md](architecture.md) for content editing and deployment details. [logs.md](logs.md) records decisions and verification. No publication has been performed.
