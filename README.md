# Anime Kingdom

Anime Kingdom storefront source, assets, standalone HTML export, and Android wrapper source.

## Standalone website (Supabase connected)

Open `outputs/anime-kingdom.html` in a browser. This is the updated standalone storefront connected to the Supabase `AK orders` table. UPI submissions require manual payment verification.

Rebuild it with:

```sh
node work/build-html-export.mjs
node work/supabase/test-connection.mjs
```

The HTML export source is in `work/export-*`. The database submission policy is documented in `work/supabase/connect.sql`; the policy already exists in the connected project. Do not rerun that SQL blindly. `work/supabase/live-test.mjs` creates labelled test records in the live database when run.

## Full-stack source

The separate React/Vinext application lives in `app/`, `components/`, and `lib/`, with database migrations in `drizzle/`.

```sh
npm ci
npm run dev
```

Requires Node.js 22.13 or newer. Review `.env.example` for optional server configuration. The standalone HTML Supabase integration does not automatically configure the separate full-stack application.

## Android source

`outputs/anime-kingdom-android/` contains the earlier Android WebView wrapper source. Its bundled HTML predates the latest Supabase integration; it is not a verified current APK.

Local environment secrets, dependencies, caches, and test databases are excluded from Git. Only the public Supabase publishable key is included in the client. Never put a secret or service-role key in browser code.
