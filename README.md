# Portofolio App

Modern portfolio website built with Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm run start
```

## Docker Deployment

Prepare the environment file:

```bash
cp .env.example .env
```

Update `.env` with the production domain and required Supabase values, then run:

```bash
docker compose up -d --build
```

The app is exposed on port `3000`.

Useful commands:

```bash
docker compose ps
docker compose logs -f portfolio-app
docker compose down
```

For Nginx or Caddy, reverse proxy your domain to:

```txt
http://127.0.0.1:3000
```

Set `NEXT_PUBLIC_SITE_URL` to your production URL, for example:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Docker Files

- `Dockerfile` uses a multi-stage Node 24 Alpine build with Next.js standalone output.
- `docker-compose.yml` builds and runs the app with restart policy and healthcheck.
- `.dockerignore` keeps local dependencies, build output, logs, and local env files out of the image context.
