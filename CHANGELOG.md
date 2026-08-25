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

## v1.0.1 — Elga Ace & Xtend Eco insteltools — 25 augustus 2026

### Elga Ace
- Bestaande keuze **Afgiftesysteem** is functioneel gemaakt.
- Nieuwe keuze **Thermostaat / regeling** toegevoegd: eTwist/R-bus, Aan/Uit of OpenTherm.
- Streefdebiet blijft modelspecifiek: 12 l/min (4 kW) en 17 l/min (6 kW).
- Dynamisch insteladvies toegevoegd voor CP780 en, waar van toepassing, CP230.
- Officiële CP230-startwaarden toegepast: radiatoren/combinatie 1,5 met eTwist/R-bus of 1,7 met Aan/Uit; vloerverwarming 0,7 met eTwist/R-bus of Aan/Uit.
- OpenTherm wordt als ruimteregeling behandeld; de officiële Elga Ace CP230-tabel geeft hiervoor geen afzonderlijke vaste startwaarde.
- CP210/CP220 blijven als uitgangspunt 15 °C; bestaande comfort- en hybride-uitleg blijft behouden.
- Hydraulische toelichting verandert mee met het gekozen afgiftesysteem.
- Bronbasis: officiële Remeha Elga Ace installatie-/servicehandleiding plus actuele Remeha Kennisbank.

### Xtend Eco
- Keuze **Afgiftesysteem** toegevoegd: radiatoren of vloerverwarming.
- Keuze **Thermostaat / regeling** toegevoegd: OpenTherm/Comfort Touch, Aan/Uit met hysterese of Aan/Uit met proportionele band.
- Keuze **benodigde maximale aanvoertemperatuur P194** toegevoegd: 35, 40, 45, 50, 55, 65 of 75 °C.
- Dynamisch insteladvies toegevoegd voor P202, P064 en waar van toepassing P006, P187, P210, P192 en P221.
- Officiële stooklijntabel uit Intergas document 88104401 (juni 2026) verwerkt.
- P221 wordt alleen geadviseerd bij Aan/Uit met proportionele band.
- Bij standaard OpenTherm blijft P194 het temperatuurplafond; de WAR-stooklijntabel wordt niet als leidende instelling gepresenteerd.
- Bestaande Xtore-sectie en firmware/update-link zijn inhoudelijk en qua positie behouden.
- De Xtend-handleidinglink in de tool is bijgewerkt naar de actuele juni-2026 revisie.

### Techniek / release
- Zichtbare versie verhoogd van v1.0 naar **v1.0.1**.
- App-shell/serviceworker-cacheversie verhoogd om oude toolcode uit PWA-cache te voorkomen.
- Geen wijzigingen aan bestaande storings-, parameter-, verbrandings-, diagnose-, knowledge- of toesteldatasets buiten de twee toolbestanden.
- Warm Industrial styling en bestaande navigatiestructuur behouden.

### v1.0.1 verificatiecorrectie — 25 augustus 2026
- Xtend Eco stooklijnmatrix opnieuw regel voor regel gecontroleerd tegen Intergas installatievoorschrift 88104401 (juni 2026).
- Bevestigd: vloerverwarming gebruikt P210 = 0 en bij P194 = 40 °C P192 = 0,74; radiatoren gebruikt P210 = 8 en bij P194 = 40 °C P192 = 0,44. De bestaande toolmapping was correct en is inhoudelijk niet omgewisseld.
- Bij de keuze Afgiftesysteem is een korte toelichting toegevoegd dat Intergas geen afzonderlijke officiële stooklijntabel voor een gecombineerd radiator-/vloerverwarmingssysteem publiceert. Er wordt daarom geen fictieve combiwaarde aangeboden.
- Alleen deze verduidelijking en noodzakelijke PWA-cacheversies zijn aangepast; Elga/Xtend-besliswaarden en overige technische data zijn verder ongewijzigd.

## Unreleased — Mitsubishi Electric Ecodan fase 1 — 25 augustus 2026

- Mitsubishi Electric toegevoegd als nieuw merk in de toestelcatalogus.
- Eerste ondersteunde combinatie: **Ecodan EHSD-VM2D / FTC6 + SUZ-SWM40VA**.
- FTC6/Hydrobox-storingen uit Mitsubishi Service Manual **OCH712C** toegevoegd.
- Buitenunitstoringen voor **SUZ-SWM40VA** uit Mitsubishi Service Manual **OCH718** toegevoegd.
- Praktische controles in korte monteurstaal opgenomen zonder de fabrikantdiagnose te vervangen.
- Parameters-tab toegevoegd als **servicemenu / Running Information**-naslag; Mitsubishi gebruikt hiervoor geen Remeha-achtige CP/HP-codeopbouw.
- Request codes 103–105, 567, 569 en 571 opgenomen als praktische diagnose-ingangen.
- Request code **200** expliciet als resetactie gemarkeerd om onbedoeld resetten van Function Settings te voorkomen.
- DIP-switches, interactieve printkaart, klachtgestuurde diagnose en uitgebreide Mitsubishi servicetool zijn bewust nog **niet** in deze fase ingebouwd.
- Bestaande Intergas/Remeha/Vaillant/Nefit/ATAG/Bosch-data niet gewijzigd.
