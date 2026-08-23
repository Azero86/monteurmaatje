# CHANGELOG — MonteurMaatje industriële visuele restyle

Datum: 23 augustus 2026  
Zichtbare release: v1.0  
Bronbestand: MonteurMaatje-v1.0-VPS-FULL-QA-VISUAL-FIX.zip  
SHA-256 bronbestand: be6cb3b1ad00db2017a4d186f6aeacd7bc99fb997316ee20d8c95fd48afbdfa9

## Doel

De bestaande, werkende MonteurMaatje-app heeft een volledig nieuwe donker-industriële rood/zwart/witte presentatie gekregen. De bestaande functionaliteit, technische inhoud, routes, selectielogica, diagnose, PWA-opzet en updatearchitectuur zijn behouden.

## Gewijzigde bestaande bestanden

| Bestand | Exacte wijziging |
|---|---|
| **style.css** | De oude, gestapelde stylesheet van 2.944 regels is vervangen door één schone stylesheet met centrale design tokens. Alle bestaande schermen en dynamische componenten zijn opnieuw gestyled. Oude groen/oranje/bruin-themalagen zijn verwijderd. |
| **index.html** | Alleen de initiële donkere visuele status, de bijpassende theme-color en de cache-busting query voor style.css en app.js zijn aangepast. DOM-structuur, schermen, inhoud, navigatie en routes zijn niet gewijzigd. |
| **app.js** | Alleen de standaard visuele voorkeur voor nieuwe gebruikers (dark), de twee meta-themakleuren en het versienummer van de serviceworker-URL zijn aangepast. Selectie-, data-, diagnose-, navigatie-, tool- en updatecode is verder byte-ongewijzigd. Een eerder opgeslagen licht/donker-voorkeur blijft gerespecteerd. |
| **sw.js** | Alleen de naam van de app-shellcache en de queryversies van style.css en app.js zijn verhoogd. Cachinglogica, datarevalidatie, offlinegedrag en updatearchitectuur zijn niet gewijzigd. De data-cache heeft exact dezelfde naam gehouden. |
| **release.json** | Alleen appRevision, generatedAt en de omschrijving van deze visuele release zijn bijgewerkt. De zichtbare versie blijft v1.0 en dataRevision is ongewijzigd. |

## Toegevoegde bestanden

| Bestand | Inhoud |
|---|---|
| **CHANGELOG.md** | Dit exacte wijzigingsoverzicht. |
| **STYLE-TOKENS.md** | Centrale design tokens en gebruiksregels. |
| **REGRESSION-REPORT.md** | Integriteits-, regressie-, toegankelijkheids- en testresultaten, inclusief niet automatisch uitgevoerde controles. |

## Expliciet niet gewijzigd

- data/ en alle faults-, parameters-, combustion- en diagnostics-bestanden
- data/catalog.json
- knowledge/
- tools/
- assets/
- icons/
- manifest-v3.webmanifest
- version.json
- 404.html
- favicon-v3.svg
- JSON-schema's en technische inhoud
- routes en padstructuur
- selectie- en navigatielogica
- data-update- en cachevalidatielogica
- manifest- en PWA-functionaliteit

## Visuele hoofdwijzigingen

- Donkere industriële basis met vrijwel zwarte achtergrond
- Donkergrijze panelen en dunne technische borders
- Helder rood als primaire accentkleur
- Rode actieve states met border, tekst en zachte glow
- Rode storingsaccenten en afzonderlijke groene, gele en blauwe statuskleuren
- Compacte mobiele kaarten met touch targets van minimaal circa 44 px
- Uniforme styling voor storingen, parameters, verbranding, diagnose, handleidingen, richtlijnen en tools
- Zichtbare focus states en voldoende contrast
- Originele afbeeldingen en iconbestanden zonder recolorfilter of verlaagde opacity
- Licht thema behouden als bestaande keuze, in dezelfde technische designtaal

## Production hardening — 2026-08-23
- Rogafa fullscreen viewer: bewezen mobiele viewport/safe-area/contain-geometrie hersteld zonder zoom-/drag-JavaScript te wijzigen.
- Combustion: mobiele waardepresentatie gehard voor alle toestellen; variantregels responsive en lange technische waarden zonder horizontale overflow.
- PWA manifest splash/theme-kleuren gelijkgezet aan de standaard Industrial dark theme.
- Technische data ongewijzigd.

