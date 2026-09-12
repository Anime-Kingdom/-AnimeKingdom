# Anime Kingdom — Vite

The default project is now the existing Anime Kingdom storefront running on Vite with vanilla JavaScript and CSS. The original design, hash navigation, cart, wishlist, local editor, COD/UPI checkout, QR, UTR, screenshot upload, and Supabase submission logic are preserved.

## Run

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

## Build and preview

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static host. Use HTTPS for customer submissions. UPI payment verification remains manual.

## Files

- `index.html`: page shell
- `src/style.css`: existing storefront styles
- `public/storefront/app.js`: storefront behavior, retained as a classic script so existing inline controls and downloaded receipts continue to work
- `public/storefront/`: image assets; embedded originals are also retained for offline receipt/export compatibility
- `vite.config.ts`: Vite configuration
- `outputs/anime-kingdom.html`: original standalone export

Run `node work/test-vite.mjs` to check checkout submission handling without creating real orders.

To regenerate the Vite storefront after editing the original `work/export-*` sources, run `node work/build-html-export.mjs` followed by `node work/convert-vite.mjs`.

The older React/Vinext source remains in the repository for reference; its configuration is `vite.legacy.config.ts`. The default Vite site does not depend on those server routes.

Customer order records are stored in Supabase `AK orders`. The client uses only the public publishable key. Local browser data from a file URL or another domain does not automatically move to a new localhost or hosted origin. Server-saved orders remain in Supabase.
