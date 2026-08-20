# Forensisch eindrapport — MonteurMaatje masterherstel

Auditdatum: 20 augustus 2026  
Werkwijze: uitsluitend vergelijking van de in deze opdracht aangeleverde MonteurMaatje-bestanden; geen internetbronnen en geen technische modelkennis gebruikt.

## 1. Ondubbelzinnige bronidentificatie

| Rol | Bestand | SHA-256 | Onderbouwing |
|---|---|---|---|
| HUIDIGE MASTER | `monteurmaatje(4).zip` | `e72cd7ff650fc6eb4c65701332266d200c8287a3f15e17cf4e877c3429394caa` | Nieuwste aangeleverde versie; 36 toestellen en 6 merken; bevat Home, Regelgeving, Kennis, ATAG, Bosch en het eerdere `WORK-EINDRAPPORT.md` dat de frontendronde op `monteurmaatje(3).zip` vastlegt. |
| TECHNISCHE REFERENTIE | `monteurmaatje(3).zip` | `211e41ee31b63b34f2a120f089da7cccff780595cc88a4e1aa9fd5a7c83de5de` | Bevat expliciet `TECHNISCH-AUDITRAPPORT.md` en `ONZEKER-HANDMATIGE-CONTROLE.md`, plus de bij die technische bronaudit behorende datasets. |

De oudere `monteurmaatje.zip` en `monteurmaatje(1).zip` zijn byte-identiek aan elkaar (`7d32baf1e2f2e885a7e1139687adb37cda1989b3679b8662aa570e77212d93e5`) en worden door het technische auditrapport zelf als de vóór-auditbron aangeduid. Zij zijn daarom niet als herstelreferentie gebruikt.

## 2. Hoofdconclusie

Er is **geen aantoonbare technische dataregressie** tussen de huidige master en de technische referentie gevonden.

- 99 van de 100 referentiebestanden onder `data/` zijn byte-identiek aan de huidige master.
- Het enige gedeelde bestand met een andere hash is `data/catalog.json`.
- De catalogusdiff bestaat uitsluitend uit de latere toevoeging van ATAG A-Serie, Bosch HRC en Bosch HRS/HRC Top en de daarmee correct verhoogde `recordCount` van 2.088 naar 2.146.
- Alle 33 gedeelde toestelobjecten in beide catalogi zijn inhoudelijk volledig identiek: namen, families, `deviceType`, paden, `sourceUrl`, manuals en toesteltellingen zijn ongewijzigd.
- Alle 97 gedeelde technische JSON-datasets zijn record voor record vergeleken. Samen bevatten zij 4.291 identieke technische records, 0 gewijzigde records, 0 verwijderde records en 0 toegevoegde records.

De enige technisch juiste herstelactie was daarom: **geen bestaande technische dataset wijzigen**. Dit volgt rechtstreeks uit de veiligheidsregel “zo min mogelijk wijzigen” en voorkomt dat geldige huidige toevoegingen of frontendwerk verloren gaan.

## 3. Forensische inventarisatie van `data/`

| Controle | Huidige master | Technische referentie |
|---|---:|---:|
| Bestanden onder `data/` | 109 | 100 |
| JSON-bestanden onder `data/` | 108 | 99 |
| Overige bestanden onder `data/` | 1 | 1 |
| Merken | 6 | 4 |
| Toestellen | 36 | 33 |

Volledige bestandsclassificatie:

- Identieke bestanden: **99**.
- Gedeelde bestanden met afwijkende hash: **1** (`data/catalog.json`).
- Alleen in huidige master: **9** technische bestanden.
- Alleen in technische referentie: **0**.
- Ontbrekende huidige bestanden ten opzichte van de referentie: **0**.
- Herstelde technische bestanden: **0**.
- Verwijderde technische bestanden: **0**.

### Alleen in huidige master — behouden

| Toestel | Bestanden | Storingen | Parameters | Verbrandingsrecords |
|---|---:|---:|---:|---:|
| ATAG A-Serie | 3 | 18 | 14 | 4 |
| Bosch HRC | 3 | 19 | 10 | 8 |
| Bosch HRS/HRC Top | 3 | 21 | 12 | 12 |
| **Totaal** | **9** | **58** | **36** | **24** |

Deze 118 technische records zijn structureel gevalideerd en volledig behouden. Omdat zij niet in de oudere technische referentie voorkomen, is hun technische inhoud in deze herstelronde niet herschreven en ook niet als door de referentie bevestigd aangemerkt.

## 4. Inhoudelijke recordvergelijking

Voor ieder gedeeld `faults.json`, `parameters.json`, `combustion.json` en `diagnostics.json` zijn zowel de volledige bestandshash als canonieke hashes per record vergeleken.

| Datasetcontrole | Resultaat |
|---|---:|
| Gedeelde technische JSON-bestanden inhoudelijk vergeleken | 97 |
| Identieke records | 4.291 |
| Gewijzigde records | 0 |
| Alleen in huidige master binnen gedeelde bestanden | 0 |
| Alleen in technische referentie binnen gedeelde bestanden | 0 |
| Verschillen in datasetmetadata | 0 |

Dit omvat de volledige recordinhoud: codes/ID’s, titels, betekenis, oorzaken, controles, oplossingen indien aanwezig, technische toelichtingen, parameterwaarden, eenheden, keuzes, verbrandingswaarden, voorwaarden, diagnosestappen, bronmetadata en bronpagina’s.

## 5. AANTOONBAAR HERSTELD

**Geen technische bestanden of records.**

Er bestond geen inhoudelijk verschil waarvoor de technische referentie specifiekere of brongetrouwere data bevatte dan de huidige master. Blind terugkopiëren zou geen technisch effect hebben en zou de huidige catalogus met ATAG en Bosch juist beschadigen.

Het bestand `data/catalog.json` is bewust niet vervangen. De huidige mastercatalogus is correct leidend en alle drie master-only toestellen, hun negen datasetpaden en de totale teller zijn geldig.

## 6. ONZEKER / NIET GEWIJZIGD

### 6.1 Bestaande onzekerheid uit de technische bronaudit

De technische referentie markeert de volgende drie Vaillant-generaties zelf als onvoldoende officieel bevestigd voor de Nederlandse markt. Master en referentie zijn voor deze bestanden wel byte-identiek, maar de onderliggende technische bronzekerheid blijft open:

| Toestel | Databestanden | Storingen onbevestigd | Parameters onbevestigd | Verbrandingsrecords onbevestigd |
|---|---:|---:|---:|---:|
| Vaillant ecoTEC plus /5-5 | 3 | 49 | 70 | 6 |
| Vaillant ecoTEC exclusive /5-7 | 3 | 45 | 76 | 8 |
| Vaillant ecoTEC pure | 3 | 36 | 59 | 4 |
| **Totaal** | **9** | **130** | **205** | **18** |

Dit zijn samen **353 vooraf bekende onbevestigde technische records in 9 bestanden**. Zij zijn conform de referentie en de veiligheidsregel niet gewijzigd.

### 6.2 Detectie van hergebruikte generieke patronen

De volledige huidige faultdataset is automatisch onderzocht op exact identieke `causes`-, `checks`- en gecombineerde blokken die bij minstens drie codes voorkomen:

| Signatuur | Groepen ≥3 keer gebruikt | Grootste groep | Unieke betrokken storingsrecords |
|---|---:|---:|---:|
| Oorzaken | 24 | 118 | 905 |
| Controles | 90 | 118 | 1.463 |
| Oorzaken + controles gecombineerd | 87 | 118 | 1.435 |

Dit is een detectiesignaal, geen zelfstandig technisch bewijs. Alle 1.435 storingsrecords met een herhaalde gecombineerde signatuur komen uit de 33 gedeelde toestellen en zijn byte-identiek aan de technische referentie. Er is dus aantoonbaar **geen regressie tussen master en referentie**. De technische referentie biedt geen verschil waarmee deze patronen verantwoord kunnen worden hersteld. Daarom is niets herschreven.

De grote hoeveelheid hergebruik verdient bij een toekomstige nieuwe fabrikantbronaudit wel afzonderlijke aandacht, omdat het bestaande technische auditrapport stelt dat grootschalige generieke blokken alleen in drie onbevestigde Vaillant-datasets zouden voorkomen. Deze forensische telling laat ook hergebruik in andere gedeelde datasets zien. Zonder nieuwe officiële broncontrole is niet vast te stellen of dit fabrikantmatig gedeelde instructies of een oudere generieke herschrijving betreft.

### 6.3 Latere ATAG/Bosch-data zonder referentievergelijking

De negen ATAG/Bosch-bestanden zijn alleen in de huidige master aanwezig. Zij zijn syntactisch en structureel geldig, gekoppeld aan bestaande catalogustoestellen en hebben consistente `deviceId`’s en recordtellingen. Omdat de technische referentie deze toestellen niet bevat, is hun technische inhoud niet inhoudelijk bevestigd of gewijzigd in deze ronde.

## 7. Catalogusvalidatie

| Controle | Resultaat |
|---|---|
| `catalog.json` geldige JSON | GESLAAGD |
| Merken | 6 |
| Toestellen | 36 |
| Gekoppelde datasetpaden | 106 |
| Ontbrekende cataloguspaden | 0 |
| Orphan technische datasets | 0 |
| Dubbele `deviceId`’s | 0 |
| DeviceId-mismatches tussen catalogus en dataset | 0 |
| Device-`recordCount` gelijk aan aantal faults | 36/36 correct |
| Catalogus-`recordCount` gelijk aan totaal faults | 2.146/2.146 correct |
| ATAG A-Serie aanwezig | JA |
| Bosch HRC aanwezig | JA |
| Bosch HRS/HRC Top aanwezig | JA |

De huidige catalogus bevat 36 `sourceUrl`-velden en 12 afzonderlijke `manuals[].url`-records. Zij zijn exact behouden. Externe bereikbaarheid is niet via internet gecontroleerd, omdat deze opdracht uitsluitend de aangeleverde bestanden als bron toestaat.

## 8. Eindtelling technische datasets

| Onderdeel | Aantal |
|---|---:|
| Storingsrecords | 2.146 |
| Parameterrecords | 1.922 |
| Verbrandingsdatasets | 31 |
| Verbrandingsrecords | 313 |
| Diagnosedatasets | 3 |
| Diagnoseflows | 28 |
| Geldige JSON-bestanden in de volledige site | 109 |

Er zijn geen dubbele storingscodes of parametercodes binnen hetzelfde toestel gevonden. Alle diagnosestartstappen verwijzen naar bestaande stappen.

## 9. Frontend-integriteit

De huidige master is leidend gebleven voor alle applicatieonderdelen.

- Alle **79 oorspronkelijke niet-data-bestanden** zijn vóór toevoeging van dit rapport via SHA-256 vergeleken.
- Gewijzigde bestaande niet-data-bestanden: **0**.
- Verwijderde bestaande niet-data-bestanden: **0**.
- `index.html`, `app.js`, `style.css`, `sw.js`, manifesten, iconen, PWA-opzet, Home, Regelgeving, Kennis, light/dark mode, handleidingweergave, parameterweergave en de racecondition-fix zijn byte-identiek aan `monteurmaatje(4).zip`.
- De enige toevoeging aan de VPS-oplevering is dit forensische eindrapport.
- De GitHub-oplevering bevat daarnaast uitsluitend `.nojekyll`, zodat GitHub Pages de bestaande statische mapstructuur zonder Jekyll-verwerking kan publiceren.

## 10. Functionele regressietest

De echte `app.js` van de huidige master is in een geïsoleerde DOM-regressieharness uitgevoerd tegen alle 36 catalogustoestellen.

| Test | Resultaat |
|---|---|
| App start en catalogus laadt | GESLAAGD |
| Home | GESLAAGD |
| Regelgeving | GESLAAGD |
| Kennis | GESLAAGD |
| Navigatie en hashwissel | GESLAAGD |
| Merkselectie | GESLAAGD — 6 merken |
| Toestelselectie | GESLAAGD — 36 toestellen |
| Storingen laden en selecteren | GESLAAGD |
| Parameters laden en selecteren | GESLAAGD |
| Verbranding laden waar aanwezig | GESLAAGD |
| Toestellen zonder verbranding veroorzaken geen ketel-UI | GESLAAGD |
| Diagnostics laden en starten waar aanwezig | GESLAAGD |
| Handleidinglinks worden weergegeven | GESLAAGD |
| Wis keuze | GESLAAGD |
| Light/dark mode | GESLAAGD |
| Snelle toestelwissel/racecondition | GESLAAGD |
| JavaScript-consolefouten | 0 |
| `app.js` syntaxis | GESLAAGD |
| `sw.js` syntaxis | GESLAAGD |
| Manifest en 3 iconen | GESLAAGD |
| Serviceworker app-shellpaden | GESLAAGD |
| Mobiele breakpoints/tekstafbreking | STRUCTUREEL GESLAAGD |
| Desktopstructuur | STRUCTUREEL GESLAAGD |

De lokale site kon vanuit de beschikbare beveiligde cloudbrowser niet rechtstreeks worden geopend. Daarom is geen pixelmatige browserscreenshotcontrole uitgevoerd. De daadwerkelijke applicatielogica, navigatie, dataflows en themawissel zijn wel uitgevoerd in de DOM-harness; HTML-, CSS-, manifest- en serviceworkerstructuur zijn aanvullend statisch gecontroleerd.

## 11. Gewijzigde bestanden in de opleveringen

### VPS

- Toegevoegd: `FORENSISCH-EINDRAPPORT.md`.
- Gewijzigde bestaande applicatiebestanden: geen.
- Gewijzigde technische databestanden: geen.

### GitHub Pages

- Toegevoegd: `FORENSISCH-EINDRAPPORT.md`.
- Toegevoegd: `.nojekyll`.
- Gewijzigde bestaande applicatiebestanden: geen.
- Gewijzigde technische databestanden: geen.

## 12. Volledige controlematrix

| MERK | TOESTEL | FAULTS | PARAMETERS | COMBUSTION | DIAGNOSTICS | BRONNEN | RESULTAAT |
|---|---|---|---|---|---|---|---|
| Intergas | Kombi Kompakt HRE | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK |
| Intergas | Kombi Kompakt HREco | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK |
| Intergas | Xtreme | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK |
| Intergas | Xtend Split 5 kW | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Intergas | Xtend Cool Grey 5 kW | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Intergas | Xtend Monoblock 5 kW R32 | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Intergas | Xtend Eco | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Avanta | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Quinta | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Quinta Pro | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Quinta Ace | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Tzerra Ace | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Calenta Ace | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Avanta Ace | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Tzerra Ace-Matic | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Calenta Ace-Matic | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Calenta Ace-Matic 40L | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Elga Ace | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Vaillant | ecoTEC plus IoniDetect | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Vaillant | ecoTEC exclusive IoniDetect | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Vaillant | ecoFIT pro | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Vaillant | ecoTEC classic | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Vaillant | ecoTEC plus /5-5 | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Vaillant | ecoTEC exclusive /5-7 | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Vaillant | ecoTEC pure | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Nefit | ProLine NxT | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | ProLine HRC | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TopLine Compact | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TopLine | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TopLine II | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TrendLine II | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TrendLine II AquaPower Plus | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | 9700i | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| ATAG | A-Serie | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |
| Bosch | HRC | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |
| Bosch | HRS/HRC Top | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |

## 13. Eindbesluit

De huidige master bevat voor alle gedeelde toestellen exact dezelfde technische dataset als de technische bronaudit-referentie. Er hoefde daarom niets technisch te worden hersteld. Alle huidige functionaliteit, alle huidige toesteldata en alle latere toevoegingen zijn behouden. De twee opleveringen verschillen uitsluitend door de voor GitHub Pages noodzakelijke `.nojekyll` in de GitHub-versie.
