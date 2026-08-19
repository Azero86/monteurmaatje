# PWA icon/cache audit v3

Volledig gecontroleerd:
- manifest is versioned
- serviceworker script-URL is versioned
- app- en datacache zijn verhoogd
- 192x192, 512x512, maskable 512x512 en Apple 180x180 zijn nieuw en gecontroleerd
- maskable icon heeft Android-safe-zone
- favicon is versioned
- header gebruikt hetzelfde nieuwe MM-beeldmerk
- oude manifest fallback verwijst eveneens naar de nieuwe v3 assets
- oude iconbestanden zijn fysiek verwijderd
- 404/_not-found/Next-exportmetadata zijn ook opgeschoond
- HTML theme-color is gecorrigeerd
- alle JSON is syntactisch valide
- geen oude actieve iconpaden meer gevonden
