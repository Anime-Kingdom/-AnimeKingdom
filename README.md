# Anime Kingdom

Anime Kingdom storefront built with Vite, HTML, CSS, and JavaScript.

## Run

Use Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## Build and host

```sh
npm run build
npm run preview
```

Deploy the generated `dist` directory. Pages use hash navigation.

## Edit

Editable source is in `work/export-*`. After editing run `npm run export`, then `npm run build`. This updates the Vite entry, styles, storefront script, and standalone HTML in `outputs/anime-kingdom.html`. Images are in `public/storefront`.

## Submissions

Existing Supabase submission integration is preserved. UPI payments require seller verification. The browser uses a publishable key; never add a service-role key.

Run `npm test` for the mocked submission checks.
