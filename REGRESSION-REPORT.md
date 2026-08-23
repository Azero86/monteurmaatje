# REGRESSION-REPORT — MonteurMaatje visuele restyle

Datum: 23 augustus 2026  
Bron-SHA-256: be6cb3b1ad00db2017a4d186f6aeacd7bc99fb997316ee20d8c95fd48afbdfa9

## 1. Broninventarisatie

- 193 ZIP-items geïnventariseerd
- 142 werkelijke bronbestanden
- 116 JSON-bestanden
- 6 merken
- 37 toestellen
- 2.169 catalogusrecords
- 109 vanuit catalog.json verwezen toestelbestanden
- Presentatie-/shellbestanden: index.html, style.css, app.js, sw.js, release.json
- Functioneel read-only: data/, knowledge/, tools/, assets/, icons/, manifest, routes en technische logica

## 2. Data- en bestandsintegriteit

| Controle | Resultaat |
|---|---|
| SHA-256 vóór/na van alle bestanden in data/, knowledge/, tools/, assets/ en icons/ | PASS — alle 133 bestanden byte-identiek |
| data/catalog.json | PASS — byte-identiek |
| Faults, parameters, combustion en diagnostics | PASS — byte-identiek |
| JSON-parse van alle 116 JSON-bestanden | PASS |
| Alle 109 cataloguspaden bestaan | PASS |
| deviceId hoort bij catalogusmerk/toestel | PASS |
| manifest-v3.webmanifest | PASS — byte-identiek |
| Manifesticoonpaden bestaan | PASS |
| version.json, 404.html en favicon | PASS — ongewijzigd |
| Bestands- en URL/padstructuur | PASS — behouden |

## 3. Presentatie-integriteit

| Controle | Resultaat |
|---|---|
| Oude gestapelde stylesheet verwijderd | PASS |
| Centrale CSS-tokens aanwezig | PASS |
| Losse kleurwaarden buiten tokenblokken | PASS — geen gevonden |
| Oude groen/oranje/bruin-kleurcodes in actieve HTML/CSS/JS | PASS — geen gevonden |
| Bestaande en dynamische class-hooks | PASS — 208 van 208 afgedekt of als structurele state behouden |
| Header, selectors, tabs, storingen, parameters, verbranding, diagnose, handleidingen, richtlijnen, tools, meldingen, loading en footer | PASS — alle bestaande componenthooks hebben één consistente stijllaag |
| Afbeeldingen en bestaande iconbestanden | PASS — byte-identiek |
| CSS-recolorfilter op logo's/afbeeldingen | PASS — geen recolorfilter |
| Verlaagde opacity op logo's/afbeeldingen | PASS — niet toegepast |
| Warmtepompiconen Elga Ace en Xtend | PASS — originele inline SVG behouden; accentkleur via currentColor, zonder filter of opacityverlies |

De huidige bron gebruikt op de selectiepagina geen losse merk- of toestelafbeeldingen. Alle wél aanwezige appiconen, inline warmtepompiconen en Rogafa-afbeeldingen zijn behouden.

## 4. Functionele equivalentie via code-diff

| Onderdeel | Controle |
|---|---|
| Merk kiezen | Selectielogica byte-ongewijzigd |
| Toestel verplicht kiezen | Disabled-/renderlogica byte-ongewijzigd |
| Toestel wisselen | Event- en laadlogica byte-ongewijzigd |
| Storing kiezen en storingsdetail | Render- en selectielogica byte-ongewijzigd |
| Parameters | Render- en selectielogica byte-ongewijzigd |
| Verbranding | Render- en selectielogica byte-ongewijzigd |
| Diagnosevragen en resultaten | Flowlogica byte-ongewijzigd |
| Handleidingen | Linkopbouw en URL's byte-ongewijzigd |
| Hoofdnavigatie, terugnavigatie en routes | Byte-ongewijzigd |
| Tools en richtlijnen | Byte-ongewijzigd |
| Directe JSON-data-update | Datarevalidatielogica byte-ongewijzigd |
| Online/offline fallback | Cache- en fallbacklogica byte-ongewijzigd |
| PWA en manifest | Manifest byte-identiek; registratielogica inhoudelijk ongewijzigd |
| Updateflow | Alleen app-shellcache-ID en assetquery verhoogd; updatearchitectuur ongewijzigd |

De drie functioneel rakende diffregels in app.js zijn uitsluitend: standaard visuele voorkeur, meta-themakleuren en serviceworker-queryversie. In sw.js zijn uitsluitend de app-cachenaam en twee statische assetquery's gewijzigd. DATA_CACHE en alle cache-/validatiefuncties zijn exact behouden.

## 5. Syntaxis, paden en shell

| Controle | Resultaat |
|---|---|
| app.js syntaxis met node --check | PASS |
| sw.js syntaxis met node --check | PASS |
| CSS accolades, haakjes en blokbalans | PASS |
| Lokale src/href-verwijzingen in HTML | PASS |
| Serviceworker core-shellpaden | PASS — 20 bestanden bestaan |
| HTTP-opvraag van index, CSS, JS, SW, manifest en catalogus | PASS — HTTP 200 |
| Dubbele HTML-id's | PASS — geen |
| Afbeeldingen met alt | PASS — 8 van 8 |
| Benoemde knoppen | PASS — 24 van 24 |
| Gelabelde statische inputs/selects | PASS — 13 van 13 |

## 6. Responsive en bediening

De stylesheet is mobile-first uitgewerkt met expliciete regimes voor:

- 320–440 px
- 441–720 px
- 721–920 px
- tablet en desktop boven 920 px

Geborgde regels:

- layoutkolommen vallen gecontroleerd terug naar één kolom
- kaarten en bronlinks worden op telefoon volledige breedte
- geen vaste contentbreedtes groter dan het viewport
- lange codes en teksten gebruiken overflow-wrap
- knoppen, selects en interactieve controls zijn minimaal circa 44 px hoog
- de vaste ondernavigatie respecteert safe-area-insets
- 360, 390 en 412 px vallen binnen het expliciet mobiele CSS-regime
- tablet en desktop behouden de tweekoloms werkruimte waar ruimte beschikbaar is

## 7. Accessibility

Gemeten contrastverhoudingen:

| Combinatie | Contrast |
|---|---:|
| Donker: primaire tekst / achtergrond | 18,57:1 |
| Donker: secundaire tekst / achtergrond | 10,63:1 |
| Donker: gedempte tekst / achtergrond | 5,47:1 |
| Donker: accent / achtergrond | 4,95:1 |
| Wit / rode knopvulling | 4,93:1 |
| Licht: primaire tekst / oppervlak | 18,02:1 |
| Licht: secundaire tekst / oppervlak | 8,59:1 |
| Licht: accent / oppervlak | 4,93:1 |

Verder:

- zichtbare focus-visible-states
- prefers-reduced-motion ondersteund
- rood wordt gecombineerd met border, tekst, vorm of icoon
- succes, waarschuwing, gevaar en informatie hebben afzonderlijke kleuren en context
- semantische bestaande knoppen, selects, details en links zijn behouden

## 8. Niet automatisch uitvoerbaar in deze werkomgeving

De lokale browsertestruntime bevatte geen render-engine en de gecontroleerde download daarvan werd door de netwerkomgeving geblokkeerd. Daardoor zijn de volgende controles niet als echte browser-/apparaatinteractie uitgevoerd:

1. Pixelvisuele screenshots op exact 360, 390, 412 px, tablet en desktop
2. Live controle op horizontale overflow en overlap in een browserlayout-engine
3. Volledige keyboard-tabvolgorde in Chrome/Edge/Firefox
4. Werkelijke PWA-installatieprompt en standalone-start op Android/iOS
5. Live cyclus online → offline → refresh → online
6. Serviceworker-update van een reeds geïnstalleerde oudere productieversie
7. Openen van externe handleidinglinks
8. Werkelijke pinch-/dragbediening van de fullscreen Rogafa-viewer

Voor deze punten zijn wel de bijbehorende codepaden, CSS-regels, lokale bestanden, cachelijsten en byte-diffs gecontroleerd. Zij moeten na plaatsing nog één keer in de echte VPS-/testomgeving worden doorlopen.

## 9. Eindconclusie

De technische MonteurMaatje-inhoud en applicatielogica zijn intact gebleven. Alle 133 read-only bestanden zijn byte-identiek. De visuele laag is centraal en volledig vervangen door één donkere industriële stijl. De enige PWA-wijziging is de noodzakelijke app-shellcacheversie om de nieuwe statische styling te laden; caching- en updategedrag zelf zijn niet herschreven.

