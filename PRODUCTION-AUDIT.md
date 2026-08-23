# MonteurMaatje Industrial Production Hardening

Datum: 23 augustus 2026

## Gericht hersteld

### ROG(A)FA fullscreen afbeeldingviewer
- De bewezen zoom-/sleep-JavaScriptlogica is behouden en vergeleken met de eerder werkende referentie.
- Mobiele viewport-geometrie hersteld.
- 100dvh en minmax-grid toegepast.
- Safe-area links, rechts, boven en onder verwerkt.
- Afbeelding blijft bij schaal 1 binnen de zichtbare stage.
- Pinch-zoom, slepen na zoom, desktop-wheel/dubbelklik en Passend-knop blijven door dezelfde bestaande JavaScriptlogica afgehandeld.
- Toolbar en sluitknop blijven binnen smalle mobiele viewports.

### Verbrandingsgegevens
- De bestaande generieke variant-renderer is behouden.
- Op mobiel worden label en hoofdwaarde niet meer in een te smalle algemene 90px-kolom geperst.
- Toestelvarianten worden op normale mobiele breedte als label + waarde weergegeven.
- Onder 420px schakelen variantregels naar een verticale, scanbare presentatie.
- Lange niet-variantwaarden mogen veilig afbreken zonder horizontale overflow.
- Desktopweergave blijft tweekoloms waar ruimte beschikbaar is.

### PWA-consistentie
- manifest theme_color en background_color gelijkgezet aan de standaard donkere Industrial-stijl (#07090a).
- start_url, scope en id blijven relatief (`./`) voor VPS/root/submap-portabiliteit.

## Automatische controles

PASS:
- app.js JavaScript-syntax
- sw.js JavaScript-syntax
- style.css CSS-parser
- 116 JSON-bestanden geldig
- 6 merken
- 37 toestellen
- 2169 storingsrecords
- catalog recordCount consistent
- alle cataloguspaden bestaan
- deviceId-koppelingen gecontroleerd
- diagnose startStep/branchverwijzingen gecontroleerd
- 66 unieke HTML-id's
- lokale index-assets bestaan
- alle manifest-iconen bestaan
- alle 20 serviceworker-precache-assets bestaan
- geen hardcoded `/monteurmaatje` base path
- Rogafa zoom-/drag-JavaScript matcht de bekende werkende referentie
- technische data byte-identiek aan de aangeleverde Work-productieversie: 111 databestanden ongewijzigd

## Bewuste niet-wijzigingen
- Geen faults/parameters/combustion/diagnostics inhoud aangepast.
- Geen caching/updatearchitectuur gewijzigd.
- Geen serviceworkerlogica gewijzigd.
- Geen navigatielogica gewijzigd.
- Geen Industrial restyle teruggedraaid.
- Geen Admin-tool opgenomen of gewijzigd.

## Praktijktest na upload
Na plaatsing op de VPS nog handmatig controleren op minstens één Android-telefoon:
1. Rogafa -> beugelschema -> fullscreen.
2. Pinch naar >1x -> horizontaal en verticaal slepen.
3. Passend -> afbeelding volledig terug binnen beeld.
4. HRE -> Verbranding -> Gasverbruik en rookgasmassaflow.
5. Minimaal één Remeha/Nefit/Vaillant combustion-scherm.
6. Vliegtuigstand -> eerder geopende toesteldata blijft beschikbaar.
7. Online terug -> JSON-correctie wordt direct opnieuw gevalideerd.

De browser-runtime in de uitvoeromgeving kon lokale pagina's niet betrouwbaar via Chromium benaderen; daarom is een echte toestelrender niet als automatisch PASS geclaimd.
