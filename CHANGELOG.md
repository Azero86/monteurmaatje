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
## Release-update — Asbestverdacht materiaal — 2026-08-23

### Nieuwe functionaliteit

- Onder **Richtlijnen** is een nieuwe module **Asbestverdacht materiaal** toegevoegd.
- De module is uitsluitend bedoeld als informatieve herkennings- en signaleringshulp voor monteurs.
- MonteurMaatje stelt niet vast dat materiaal asbest bevat. De module benoemt materiaal alleen als mogelijk/asbestverdacht.
- In de module staat expliciet vermeld dat alleen onderzoek/laboratoriumanalyse zekerheid kan geven over de aanwezigheid van asbest.
- De inhoud is opgebouwd rond toepassingen die relevant zijn voor installatie- en servicemonteurs, waaronder:
  - CV-ketels, boilers en geisers
  - rookgas- en ventilatiekanalen
  - pakkingen en afdichtkoord
  - leiding- en ketelisolatie
  - plaat- en bouwmaterialen rondom installaties
  - overige materialen die tijdens servicewerkzaamheden kunnen worden aangetroffen

### Bronnen

De technische inhoud van de module is gebaseerd op betrouwbare Nederlandse bronnen:

- **IPLO / Informatiepunt Leefomgeving** als primaire bron voor toepassingen, vindplaatsen en herkenningskenmerken
- **Arboportaal** voor arbeidsveiligheid en historische context
- **Ascert** voor formele terminologie rondom asbestverdacht materiaal en inventarisatie

De bestaande links naar officiële voorbeeldinformatie zijn in de module behouden.

### Voorbeeldfoto's

- Aan de asbestmodule zijn lokale voorbeeldfoto's toegevoegd ter visuele ondersteuning.
- De foto's zijn geselecteerd uit bronnen met gecontroleerde hergebruikrechten.
- Bij iedere foto is bron-/licentie-informatie opgenomen.
- De foto's dienen uitsluitend als herkenningsvoorbeeld; een vergelijkbaar uiterlijk is geen bevestiging dat materiaal daadwerkelijk asbest bevat.
- De foto's zijn lokaal opgenomen zodat zij ook binnen de PWA/offline beschikbaar blijven.

### Gebruikersinterface

- De asbestmodule gebruikt dezelfde bestaande Richtlijnen-opbouw en visuele stijl als de rest van MonteurMaatje.
- Alle onderdelen van de asbestpagina starten standaard **ingeklapt**.
- Er wordt pas inhoud geopend wanneer de gebruiker zelf een onderdeel selecteert.
- De bestaande officiële voorbeeldlinks blijven zichtbaar als aanvullende naslagmogelijkheid.

### PWA / cache-hardening

Tijdens de eerste implementatie bleek dat een nieuwe `index.html` in combinatie met een oudere gecachte `app.js` kon leiden tot een lege Richtlijnen-detailview.

Dit is hersteld door:

- assetversies van `app.js` en `style.css` te verhogen
- de serviceworker/app-shellcache te verhogen
- een fail-safe toe te voegen waardoor een onbekende of verouderde Richtlijnen-route niet meer in een lege pagina kan eindigen
- de nieuwe asbestassets mee te nemen in de PWA-cache

### GitHub Pages

- De GitHub Pages-build is opnieuw rechtstreeks opgebouwd vanuit de actuele VPS-build.
- VPS en GitHub zijn bestand-voor-bestand vergeleken.
- De GitHub-build is inhoudelijk identiek aan de VPS-build.
- Het enige aanvullende bestand in de GitHub-build is `.nojekyll`.

### Expliciet niet gewijzigd

Bij deze uitbreiding zijn de bestaande technische toestelgegevens ongemoeid gelaten:

- `data/`
- `knowledge/`
- `tools/`
- storingscodes
- parameters
- verbrandingsgegevens
- diagnosegegevens
- toestelcatalogus

De asbestuitbreiding is daarmee een aanvullende Richtlijnen-module en geen wijziging van de bestaande toesteltechnische inhoud.

## Visuele kleurcorrectie — warm Industrial accent — 2026-08-23

- De huidige Industrial-layout en alle bestaande UI-structuren zijn behouden.
- Het felle primaire rood is vervangen door een rustiger warm koraal/oranje accent, afgeleid van de eerder gebruikte MonteurMaatje-kleurstelling.
- Actieve borders, accenttekst, knoppen, geselecteerde states en subtiele glow gebruiken nu het warmere accentpalet.
- De functionele statuskleur `danger` blijft rood, zodat storingen/fouten visueel onderscheiden blijven van gewone actieve navigatie en selectie.
- Het lichte thema is in dezelfde warmere accentfamilie aangepast.
- Alleen visuele tokens en noodzakelijke cache-/releaseversies zijn aangepast; layout, routes, data, tools, richtlijnen en applicatielogica zijn niet gewijzigd.
