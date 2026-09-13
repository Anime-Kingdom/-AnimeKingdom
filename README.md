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

## File locations

- `public/storefront/`: product images, generated artwork, and storefront JavaScript.
- `public/`: additional posters, reference images, and logo files.
- `src/style.css`: current website styling.
- `work/export-*`: editable page, form, animation, and Supabase source.
- `work/supabase/connect.sql`: existing-table submission policy reference; not a complete database initializer.
- `outputs/`: standalone HTML and payment QR image.

`node_modules` and `dist` are generated locally and are not committed. Old React/Next pages were removed when the repository was replaced with the current vanilla Vite storefront.
