# toprio

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_2XhBu9EfFMY9niekG4q0gLfKq9XK)

## Getting Started

This project runs on [Deno](https://deno.com) with [Next.js](https://nextjs.org).

### Prerequisites

- [Deno 2.x](https://docs.deno.com/runtime/getting_started/installation/) (recommended)

If `deno` is not recognized, install Deno and ensure `%USERPROFILE%\.deno\bin` is on your PATH:

```powershell
irm https://deno.land/install.ps1 | iex
```

After installation, **fully restart Cursor** (not just the terminal tab). Cursor keeps the PATH from when it was launched, so a new terminal alone may still not find `deno`.

This repo also configures `.vscode/settings.json` to prepend Deno to PATH in integrated terminals. If `deno` is still not found, use the helper scripts below.

### Install dependencies

```bash
deno install --allow-scripts
```

Or on Windows when `deno` is not on PATH:

```powershell
.\scripts\install.ps1
```

### Run the development server

```bash
deno task dev
```

Or on Windows when `deno` is not on PATH:

```powershell
.\scripts\dev.ps1
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Other commands

```bash
deno task build   # production build
deno task start   # run production server (after build)
```

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
