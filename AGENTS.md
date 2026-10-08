<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The inventory map reads `src/data/listings.ts` directly; ZIP centroids in `src/data/zip-coordinates.ts` are approximate map positions, never property addresses, because the source inventory only includes city/state/ZIP.
- The inventory map runs only after hydration via dynamic Leaflet imports, because Leaflet accesses browser globals during module initialization.
- The site header (logo, centered navigation, market clocks, mobile menu) lives in `src/components/site-header.tsx` and is rendered by every page, so header edits apply site-wide; it publishes its measured height as the `--site-header-height` CSS variable that pages use to offset content below the fixed bar.
- The inventory map wrapper carries `isolate` because Leaflet panes use z-index values up to 1000, which would otherwise paint over the fixed header and hide its mobile menu.
- Map marker styling must be scoped as `.inventory-map .leaflet-marker-icon.inventory-marker`, because Leaflet's own `.leaflet-marker-icon { display: block }` otherwise beats the single-class rule and the price label drifts to the circle's top-left instead of centering.
- The Available Vehicles section is the single shared component `src/components/vehicle-inventory.tsx`, rendered by both the Home page and the Inventory page, so vehicle changes apply to both; it carries `id="vehicles"`, so that id must stay unique per page.
- Vehicle map pins: vehicles have no ZIPs in source data, so `src/data/vehicle-locations.ts` maps each "City, ST" to a representative ZIP centroid (added to `zip-coordinates.ts`); vehicles use negative map ids (-(index+1)) in `src/routes/inventory.tsx` to share the property map.
- Access-page video and poster use CDN asset pointers and remain local to the unlock route, so changing the entry presentation does not affect homepage media or gate logic.
- Home's film uses its own CDN pointer; About Us owns the join form so section reordering preserves email submission without changing the access-page film.
- Site access requires a per-tab visit token (sessionStorage) matching the server session (gate-v3 cookie, idle + absolute limits); protected routes use ssr:false so the tab token is checked on every entry, because shared cookies alone let new tabs and restored browsers skip the password.
