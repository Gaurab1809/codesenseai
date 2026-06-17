<div align="center">

# </>CodeSense AI

**Your friendly AI mentor for learning to code.**

Paste a snippet → get plain-English explanations, bug fixes, optimization tips, and বাংলা (Bangla) support.

[![Live App](https://img.shields.io/badge/Live%20App-codesenseai.lovable.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://codesenseai.lovable.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-97.5%25-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

</div>

---

## Overview

CodeSense AI is an AI-powered code analysis web application designed for beginner and intermediate developers. It offers an interactive Monaco-based editor where users paste or upload code and receive instant, actionable feedback — plain-English explanations, bug reports with line numbers, Big-O complexity analysis, security scanning, and uniquely, full support for learning programming concepts explained in Bangla (বাংলা). The app is built on a modern, type-safe React stack and deployed on Cloudflare via Lovable.

---

## Features

| Feature | Description |
|---|---|
| **Code Explanation** | Line-by-line breakdowns written for beginners, not experts |
| **Bug Detection** | Catches off-by-ones, infinite loops, and logic errors with precise line references |
| **Optimization Suggestions** | Big-O analysis and concrete rewrites with explanations of *why* they're faster |
| **Security Scan** | Detects unsafe inputs, leaked secrets, and injection risks |
| **বাংলা Mode** | Full Bangla-language explanations of programming concepts, with English technical terms preserved |
| **Quiz Generator** *(Pro)* | Auto-generates MCQs from your code so you can practice concepts |
| **PDF Export** *(Pro)* | Download your analysis results as a PDF |
| **Customizable Themes** | Multiple syntax-highlighting themes (Candyfloss, Neon Jungle, Retro Arcade, Ocean Drift, Lava Field, Cream Soda) with a live code preview and a build-your-own-theme option |
| **Interactive Playground** | Full Monaco editor with file upload support and live AI workspace |
| **3D Particle Visualizer** | A cursor-reactive, Three.js-powered particle scene on the homepage |

### Supported Languages

Python · JavaScript · TypeScript · Java · C · C++ · C# · Go · PHP · Rust

---

## Tech Stack

### Frontend

- **[React 19](https://react.dev/)** — UI framework
- **[TanStack Router](https://tanstack.com/router)** & **[TanStack Start](https://tanstack.com/start)** — type-safe file-based routing and SSR
- **[TanStack Query](https://tanstack.com/query)** — server-state management
- **[TypeScript 5.8](https://www.typescriptlang.org/)** — end-to-end type safety
- **[Tailwind CSS v4](https://tailwindcss.com/)** — utility-first styling
- **[shadcn/ui](https://ui.shadcn.com/) + Radix UI** — accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** — animations
- **[@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)** — VS Code-quality embedded editor
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Three.js](https://threejs.org/)** — 3D particle visualizer
- **[Prism.js](https://prismjs.com/)** — syntax tokenization for theme previews
- **[react-markdown](https://github.com/remarkjs/react-markdown) + remark-gfm** — rendering AI markdown output
- **[Recharts](https://recharts.org/)** — data visualization
- **[react-hook-form](https://react-hook-form.com/) + Zod** — form handling and validation
- **[Sonner](https://sonner.emilkowal.ski/)** — toast notifications

### Backend & Infrastructure

- **[Supabase](https://supabase.com/)** — authentication, database, and Edge Functions
- **[Cloudflare Workers](https://workers.cloudflare.com/)** — edge deployment (via `wrangler.jsonc`)
- **[Vite 7](https://vitejs.dev/)** — build tool (configured via `@lovable.dev/vite-tanstack-config`)
- **[Bun](https://bun.sh/)** — package manager and runtime

---

## Project Structure
```bash
codesenseai/

├── public/               # Static assets

├── src/

│   ├── components/       # Reusable UI components

│   ├── routes/           # TanStack file-based routes (pages)

│   ├── hooks/            # Custom React hooks

│   ├── lib/              # Utility functions and Supabase client

│   └── integrations/     # Supabase type-safe integration layer

├── supabase/

│   └── functions/        # Supabase Edge Functions (AI analysis logic)

├── .env                  # Environment variables (see setup below)

├── vite.config.ts        # Vite config (powered by Lovable preset)

├── wrangler.jsonc        # Cloudflare Workers deployment config

├── components.json       # shadcn/ui config

└── package.json
```
---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18 or [Bun](https://bun.sh/) ≥ 1.0
- A [Supabase](https://supabase.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/Gaurab1809/codesenseai.git
cd codesenseai

# Install dependencies (using Bun, recommended)
bun install

# or with npm
npm install
```

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
SUPABASE_URL="your_supabase_project_url"
SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_PUBLISHABLE_KEY="your_supabase_anon_key"
VITE_SUPABASE_PROJECT_ID="your_supabase_project_id"
```

> **Note:** The `.env` file in this repository contains public anon keys for a demo Supabase project. Replace these values with your own project credentials before deploying.

### Development

```bash
bun run dev
# or
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build

```bash
# Production build
bun run build

# Development build
bun run build:dev

# Preview production build locally
bun run preview
```

### Linting & Formatting

```bash
# Lint
bun run lint

# Format with Prettier
bun run format
```

---

## Pricing Tiers

| Plan | Price | Analyses | Features |
|---|---|---|---|
| **Free** | $0/mo | 5 / day | Bug detection, Bangla mode, community access |
| **Pro** | $12/mo | Unlimited | Everything free + optimization, security scan, PDF exports, quiz generator |
| **Team** | $29/mo | Unlimited | Everything Pro + shared workspaces, leaderboards, API access, priority support |

---

## Deployment

The app is configured for edge deployment on **Cloudflare Workers** via `wrangler.jsonc`. The Lovable platform handles CI/CD automatically when connected to this repository.

To deploy manually via Wrangler:

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate
wrangler login

# Deploy
wrangler deploy
```

AI analysis logic runs as **Supabase Edge Functions** in the `supabase/functions/` directory. Deploy them using the Supabase CLI:

```bash
supabase functions deploy
```

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code passes lint checks (`bun run lint`) and is formatted (`bun run format`) before submitting.

---

## Security

> **Warning:** The `.env` file is currently committed to the repository with a live Supabase anon key. While anon keys are designed to be public-facing, it is strongly recommended to add `.env` to `.gitignore` and use environment variable injection through your CI/CD platform or Cloudflare Workers secrets instead.

---

## License

This project does not currently include a license file. All rights reserved by the author unless stated otherwise.

---

<div align="center">

Built with ☕ + ⚡ by [Gaurab1809](https://github.com/Gaurab1809)

**[Try CodeSense AI free →](https://codesenseai.lovable.app/)**

</div>
