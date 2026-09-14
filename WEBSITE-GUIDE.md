# Website guide

## Storefront and features

The active application is a vanilla HTML, CSS and JavaScript storefront built with Vite. It uses hash routes, including `#home`, `#shop`, `#collections`, `#custom`, `#wishlist`, `#checkout`, `#orders` and `#contact`.

- Home: studio campaign artwork, collections, featured products, custom figure introduction and home-accessory inquiries.
- Shop: search, category and series filters, sorting, maximum price, product detail dialogs and photo zoom.
- Product galleries: multiple supplied photos, currently four for Pikachu.
- Shopping: browser-persisted cart and wishlist, quantity controls and order summary.
- Custom figures: reference image, name, email, phone, optional Instagram ID, character/style, size, pose, accessories, finish and special requirements.
- Checkout: delivery details, COD or UPI, payment QR, UTR and payment screenshot.
- Presentation: black/purple styling, responsive layouts, scroll reveals, hover depth and reduced-motion support.

## Current catalog

| Product | Price (INR) | Height | Images |
| --- | ---: | --- | --- |
| Gojo Satoru Figure | 999 | 23 cm | New supplied main photo |
| Spider-Man Display Figure | 1,199 | 20 cm in existing catalog | Existing photo; replacement photos pending |
| Red Hulk Collectible | 1,299 | Not supplied | Existing photo |
| Pikachu Figure | 1,299 | 23 cm | Four supplied photos |

Custom Character Concept is removed from the catalog and filtered from older browser catalogs, carts and wishlists. Historical order records are retained.

Some inventory values remain demonstration values. Pikachu availability is marked for seller confirmation. Dimensions and materials not supplied by the seller should not be invented. Studio campaign and home-accessory artwork is illustrative; it does not establish stocked products.

## Order handling

The existing Supabase integration targets the `AK orders` table. Successful submission is acknowledged after the database accepts it; a rejected submission retains the cart. Orders include customer and delivery details, line items, totals, payment method, UTR and screenshot when supplied. UPI payment remains subject to manual seller verification.

Pack support records both packs and pieces: one 20-piece pack costs INR 999; two packs contain 40 pieces and have a merchandise subtotal of INR 1,998. Fractional pack additions are rejected. The requested keychain listings still await their image files.

Cart, wishlist and some account/order state are stored in the browser. Browser storage is not a shared inventory or authentication service. Do not commit customer submissions, payment screenshots, credentials, or service-role keys to this repository.

## Source editing and builds

1. Install Node.js 22.13 or newer and run `npm ci`.
2. Edit the source files described below.
3. Run `npm run export` to regenerate the Vite files and standalone HTML.
4. Run `npm run build` and `npm test`.
5. Run `npm run preview` and inspect the changed pages.

| File | Purpose |
| --- | --- |
| `work/export-core.js` | Catalog, navigation, products, gallery, cart and wishlist |
| `work/export-pages.js` | Checkout, custom forms, other pages and receipts |
| `work/export-supabase.js` | Submission handling |
| `work/export-layout.txt` | Page shell and homepage |
| `work/export-motion.css` / `work/export-motion.js` | Styling and motion |
| `work/export-assets.json` | Embedded image source map |
| `public/storefront/` | Exported images and application script |
| `outputs/anime-kingdom.html` | Standalone HTML export |

Update the asset source map when replacing an image; editing only an exported image can be overwritten by the next export. Update browser-state migrations when a catalog change must reach returning visitors.

## Deployment and verification

Build and deploy `dist`. It is generated and intentionally excluded from Git, as is `node_modules`. Hash routes do not require individual server routes. A GitHub push updates source; it does not by itself prove that an external hosting provider deployed that revision.

The local preview URL works only while its local server is running. If the browser shows connection refused, restart the preview server. For the familiar port use `npm run preview -- --host 127.0.0.1 --port 5183 --strictPort`.

Automated checks use mocked database responses and cover rejected/successful submissions and pack calculations. They do not prove live payment settlement, shipment, live database availability or physical TV compatibility.

## Remaining requested assets

See `work/pending-product-images.json` for pending image replacements and additional products. These are not live listings. This list includes the second Gojo photo, replacement Spider-Man photos, Ganesha, a book stand, Krishna and two keychain packs.
