# Forensisch eindrapport MonteurMaatje — herstelronde 013cfa

Auditdatum: 20 augustus 2026  
Opdracht: volledige forensische vergelijking van de actuele master met uitsluitend de technisch bindende referentie met voorgeschreven SHA-256.

## 1. Identificatie van de bronbestanden

| Rol | Bestand | SHA-256 | Vaststelling |
|---|---|---|---|
| Huidige master | `MonteurMaatje-MASTER-HERSTELD-VPS.zip` | `dc905d74c749074abbbff168e3c5abeeedfe841c93f8ec395084775a38eab521` | Meest actuele aangeleverde VPS-versie; bevat 36 toestellen, ATAG en Bosch, en de huidige frontend met Home, Regelgeving, Kennis, handleidingweergave, parameterweergave en racecondition-fix. |
| Technische referentie | `monteurmaatje-vps-technische-bronaudit(1).zip` | `013cfa73680ae6bfa9943b76ffa1b3b775f12665795a5fae83034439abe1bf28` | Hash komt exact overeen met de verplicht voorgeschreven referentiehash. |

**Expliciete bevestiging:** de gebruikte technische referentie heeft exact SHA-256 `013cfa73680ae6bfa9943b76ffa1b3b775f12665795a5fae83034439abe1bf28`. Geen ander ZIP-bestand is als technische referentie gebruikt.

## 2. Werkwijze en beslisregel

De actuele master is integraal gekopieerd en daarna uitsluitend op aantoonbare technische dataregressies aangepast. Alle bestaande niet-data-applicatiebestanden bleven leidend en byte-identiek. De volledige `data/`-map is vergeleken op relatief pad, SHA-256, JSON-structuur, recordaantal, code/ID en volledige recordinhoud.

Per verschil is de voorgeschreven beslisvolgorde toegepast:

1. alleen in de actuele master: behouden;
2. identiek: niets gewijzigd;
3. referentie aantoonbaar specifieker en brongetrouwer: het volledige betreffende referentiebestand/record hersteld;
4. latere actuele toevoeging: behouden;
5. niet objectief beslisbaar: actuele master behouden en als onzeker gemarkeerd.

Er is geen nieuwe HVAC-inhoud gegenereerd, geïnterpreteerd of van internet gehaald. Er zijn geen hybride technische records samengesteld.

## 3. Volledige data-diff vóór herstel

| Categorie | Aantal |
|---|---:|
| Databestanden in actuele master | 109 |
| Databestanden in technische referentie | 100 |
| Unieke onderzochte databestanden (unie) | 109 |
| Byte-identieke databestanden | 71 |
| Gewijzigde bestaande databestanden | 29 |
| Alleen in actuele master | 9 |
| Alleen in technische referentie | 0 |
| Gedeelde recordbestanden inhoudelijk vergeleken | 97 |
| Bestaande records met enig inhoudelijk verschil | 1.698 |
| Record uitsluitend in referentie | 1 (`Remeha Quinta Pro E.15`) |

De 29 afwijkende bestanden kwamen exact overeen met het externe controlesignaal van ongeveer 29, maar zijn zelfstandig opnieuw vastgesteld. `data/catalog.json` was één van die 29 bestanden; de overige 28 waren technische datasets.

### Records en velden

Van de 1.698 afwijkende bestaande records bevatten 1.434 aantoonbare technische correcties: 1.426 storingsrecords en 8 parameterrecords. Daarnaast waren 264 Xtend-records uitsluitend gewijzigd in verificatiemetadata (`source` en `sourcePage`). Bij de 8 technisch gecorrigeerde Xtend-parameters wijzigden tevens die bronvelden, zodat de aantallen elkaar daar overlappen.

Over alle record-diffs kwamen de volgende veldwijzigingen voor:

| Veld | Aantal records |
|---|---:|
| `title` | 764 |
| `meaning` | 881 |
| `causes` | 843 |
| `checks` | 1.034 |
| `note` | 847 |
| `settingRange` | 8 |
| `unit` | 8 |
| `choices` | 2 |
| `source` | 272 |
| `sourcePage` | 272 |

## 4. Aantoonbaar hersteld

De 28 afwijkende technische datasets zijn als volledige, ongewijzigde bestanden uit de bindende technische referentie teruggezet. Hierdoor kan geen technisch onjuiste hybride recordinhoud ontstaan. `data/catalog.json` bleef het actuele masterbestand; uitsluitend de aantoonbaar noodzakelijke Quinta Pro-telling en totaaltelling zijn aangepast.

| Gewijzigd bestand | Herstel en rechtvaardiging |
|---|---|
| `data/catalog.json` | Actuele mastercatalogus behouden. Alleen Quinta Pro `recordCount` 42 → 43 en totaal 2.146 → 2.147 wegens de aantoonbaar ontbrekende referentiecode `E.15`. Alle merken, toestellen, paden, `sourceUrl` en `manuals` bleven ongewijzigd. |
| `data/intergas/hre/faults.json` | 20 records technisch identiek; uitsluitend bovenliggende audit-/bronmetadata uit de bindende referentie hersteld. |
| `data/intergas/xtreme/faults.json` | 22 records technisch identiek; uitsluitend bovenliggende audit-/bronmetadata uit de bindende referentie hersteld. |
| `data/intergas/xtend-split-5kw/faults.json` | 38 records technisch identiek; officiële recordmetadata `source`/`sourcePage` hersteld. |
| `data/intergas/xtend-split-5kw/parameters.json` | 89 records; `source`/`sourcePage` hersteld en P140, P142, P144 en P187 technisch teruggezet volgens de referentie. |
| `data/intergas/xtend-monoblock-r32-5kw/faults.json` | 56 records technisch identiek; officiële recordmetadata `source`/`sourcePage` hersteld. |
| `data/intergas/xtend-monoblock-r32-5kw/parameters.json` | 89 records; `source`/`sourcePage` hersteld en P140, P142, P144 en P187 technisch teruggezet volgens de referentie. |
| `data/nefit/9700i/faults.json` | 74 van 105 records technisch hersteld; fabrikant-specifieke checks/notities teruggezet. |
| `data/nefit/proline-eco/faults.json` | 46 van 48 records technisch hersteld. |
| `data/nefit/proline-nxt/faults.json` | 46 van 48 records technisch hersteld. |
| `data/nefit/topline-compact/faults.json` | 72 van 86 records technisch hersteld. |
| `data/nefit/topline/faults.json` | 63 van 95 records technisch hersteld. |
| `data/nefit/trendline-ii/faults.json` | 96 van 124 records technisch hersteld. |
| `data/nefit/trendline-ii-aquapower-plus/faults.json` | 96 van 124 records technisch hersteld. |
| `data/remeha/avanta-classic/faults.json` | Alle 17 records technisch hersteld. |
| `data/remeha/avanta-ace/faults.json` | Alle 62 records technisch hersteld. |
| `data/remeha/calenta-ace/faults.json` | Alle 85 records technisch hersteld. |
| `data/remeha/calenta-ace-matic/faults.json` | Alle 97 records technisch hersteld. |
| `data/remeha/calenta-ace-matic-40l/faults.json` | Alle 106 records technisch hersteld. |
| `data/remeha/elga-ace/faults.json` | Alle 28 records technisch hersteld. |
| `data/remeha/quinta-classic/faults.json` | Alle 19 records technisch hersteld. |
| `data/remeha/quinta-pro/faults.json` | Alle 42 bestaande records technisch hersteld en officiële code `E.15` als 43e record toegevoegd. |
| `data/remeha/quinta-ace/faults.json` | Alle 75 records technisch hersteld. |
| `data/remeha/tzerra-ace/faults.json` | Alle 66 records technisch hersteld. Expliciete testcase E.01.11 is brongetrouw hersteld. |
| `data/remeha/tzerra-ace-matic/faults.json` | Alle 97 records technisch hersteld. |
| `data/vaillant/ecofit-pro-6-3/faults.json` | Alle 38 records technisch hersteld. |
| `data/vaillant/ecotec-classic-5-3/faults.json` | Alle 33 records technisch hersteld. |
| `data/vaillant/ecotec-exclusive-cf/faults.json` | Alle 84 records technisch hersteld. |
| `data/vaillant/ecotec-plus-cs/faults.json` | Alle 84 records technisch hersteld. |

### Expliciete testcase Remeha Tzerra Ace E.01.11

De einddataset bevat:

- titel: `Ventilatortoerental overschrijdt normaal werkingsbereik`;
- oorzaken: ventilatorstoring, slechte verbinding, defecte ventilator en ventilator draait terwijl hij niet mag draaien;
- controles: bedrading/connectoren controleren, ventilator vervangen en controleren op te veel schoorsteentrek.

De oude generieke verwijzingen naar sifon, terugslagklep en warmtewisselaar zijn niet meer in dit record aanwezig.

### Parameters Xtend

In zowel Xtend Split als Xtend Monoblock zijn uitsluitend de door de referentie aangetoonde parameterregressies hersteld:

- P140, P142 en P144: Nederlandse energie-/gaseenheden en bijbehorende bereik/notitievelden;
- P187: Nederlandse eenheid/keuzetekst voor schakelingen per uur.

Geen andere parameterbetekenis, numerieke waarde of generatie-indeling is door deze herstelronde zelf geïnterpreteerd.

## 5. Bewust behouden latere toevoegingen

De volgende negen datasets bestaan uitsluitend in de actuele master en zijn als latere toevoeging volledig behouden:

| Toestel | Faults | Parameters | Verbrandingsrecords | Status |
|---|---:|---:|---:|---|
| ATAG A-Serie | 18 | 14 | 4 | Alleen in huidige master — behouden |
| Bosch HRC | 19 | 10 | 8 | Alleen in huidige master — behouden |
| Bosch HRS/HRC Top | 21 | 12 | 12 | Alleen in huidige master — behouden |

Dit zijn samen 9 bestanden en 118 records. Geen van deze bestanden is technisch herschreven of verwijderd.

## 6. Onzeker — handmatige controle nodig

De drie onderstaande Vaillant-generaties waren in de bindende technische referentie al expliciet onbevestigd. Master en referentie zijn voor deze datasets byte-identiek. Daardoor bestond geen objectieve grond voor herstel; de actuele master is ongewijzigd behouden.

| Toestel | Faults | Parameters | Verbrandingsrecords | Onzekere bestanden/records |
|---|---:|---:|---:|---:|
| Vaillant ecoTEC plus /5-5 | 49 | 70 | 6 | 3 / 125 |
| Vaillant ecoTEC exclusive /5-7 | 45 | 76 | 8 | 3 / 129 |
| Vaillant ecoTEC pure /7-2 | 36 | 59 | 4 | 3 / 99 |
| **Totaal** | **130** | **205** | **18** | **9 / 353** |

Status voor alle drie: **NL-documentatie niet voldoende bevestigd; handmatige fabrikantbroncontrole nodig**.

Daarnaast zijn de huidige catalogus-`sourceUrl`-waarden bij Remeha Quinta en Quinta Pro niet gewijzigd, omdat de opdracht catalogusbronvelden uit de actuele master expliciet beschermt. De technische faultrecords zijn wel exact uit de bindende referentie hersteld. Deze cataloguslinks blijven daarom een afzonderlijk bronmetadata-aandachtspunt en zijn in de controlematrix als onzeker gemarkeerd.

## 7. Detectie van generieke regressiepatronen

De volledige einddataset is gescand op exacte herhaling van `causes`, `checks` en gecombineerde blokken. Dat leverde 24 hergebruikgroepen voor oorzaken, 90 voor controles en 87 voor gecombineerde blokken op; het hoogste hergebruik was 118 records.

Dit is uitsluitend als detectiesignaal gebruikt. Alle records in de grote gevonden groepen zijn ook in de bindende technische referentie aanwezig. Geen tekst is op basis van alleen patroonherkenning gewijzigd. De herstelde bestanden zijn bytegelijk aan de referentie; onzeker gebleven oude Vaillant-data is niet zonder bronbewijs herschreven.

## 8. Validatie einddataset

| Controle | Resultaat |
|---|---|
| JSON-syntaxis | PASS — 109 JSON-bestanden geparseerd |
| Catalogus | PASS — 6 merken, 36 toestellen |
| Storingsrecords | PASS — 2.147; catalogustotaal eveneens 2.147 |
| Parameterrecords | PASS — 1.922 |
| Verbranding | PASS — 31 datasets, 313 records |
| Diagnostics | PASS — 3 datasets, 28 flows |
| Cataloguskoppelingen | PASS — 106 gekoppelde datasets bestaan en laden |
| Ontbrekende paden | PASS — geen |
| Orphan datasets | PASS — geen |
| Dubbele storingscodes | PASS — geen per toestel |
| Dubbele parametercodes | PASS — geen per toestel |
| `deviceId`-consistentie | PASS |
| `sourceUrl`/`manuals` in catalogus | PASS — byte-inhoud behouden |
| Warmtepomp/verbrandingskoppeling | PASS — geen verzonnen combustion-data toegevoegd |
| ATAG aanwezig | PASS |
| Bosch HRC aanwezig | PASS |
| Bosch HRS/HRC Top aanwezig | PASS |

## 9. Frontend-integriteit

De actuele master bevatte 80 niet-data-bestanden. Voor het schrijven van dit rapport waren alle 80 bestaande niet-data-bestanden byte-identiek aan de huidige master; geen bestand was gewijzigd of verwijderd. Na de herstelronde is alleen dit nieuwe rapport toegevoegd.

Daarmee bleven onder meer `index.html`, `app.js`, `style.css`, `sw.js`, manifesten, iconen, Admin, Data Studio, navigatie, thema’s, handleidingweergave, parameterweergave en racecondition-fix ongewijzigd. De technische referentieversie van `sw.js` is bewust niet teruggezet, omdat de huidige master leidend is en de actuele serviceworker de nodige validatie al bevat.

Voor de GitHub-uitvoer wordt uitsluitend `.nojekyll` toegevoegd. Er zijn geen andere VPS/GitHub-verschillen.

## 10. Functionele regressietest

De bestaande `app.js` is in een gecontroleerde DOM-/fetch-harnas uitgevoerd tegen de volledige herstelde site.

| Test | Resultaat |
|---|---|
| App start en catalogusinitialisatie | PASS |
| Home, Regelgeving en Kennis | PASS |
| Merk- en toestelselectie | PASS — alle 36 toestellen |
| Toestelpagina en storingsselectie | PASS |
| Parameters en samengestelde keuzes | PASS |
| Verbranding waar aanwezig | PASS |
| Geen verbrandings-UI voor warmtepompen | PASS |
| Diagnostics waar aanwezig | PASS |
| Bestaande handleidinglinks weergegeven | PASS |
| Wis keuze / terug naar start | PASS |
| Light/dark mode | PASS |
| Snelle toestelwissel/racecondition | PASS — geen oude toesteldata |
| JavaScript-consolefouten | PASS — geen |
| `app.js`- en `sw.js`-syntaxis | PASS |
| Mobiele/desktopstructuur en tekstafbreking | PASS — bestaande 560px/850px-regels en dark-mode-regels aanwezig |
| Manifest, iconen en serviceworkerbestanden | PASS |
| Lokale HTTP-laadtest | PASS — `index.html` HTTP 200 en alle 106 gekoppelde datasets geladen |

Er is geen frontendcode gewijzigd om deze tests te laten slagen.

## 11. Volledige controlematrix

| MERK | TOESTEL | FAULTS | PARAMETERS | COMBUSTION | DIAGNOSTICS | BRONNEN | RESULTAAT |
|---|---|---|---|---|---|---|---|
| Intergas | Kombi Kompakt HRE | HERSTELD | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | HERSTELD |
| Intergas | Kombi Kompakt HREco | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK |
| Intergas | Xtreme | HERSTELD | IDENTIEK | IDENTIEK | IDENTIEK | IDENTIEK | HERSTELD |
| Intergas | Xtend Split 5 kW | HERSTELD | HERSTELD | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Intergas | Xtend Cool Grey 5 kW | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Intergas | Xtend Monoblock 5 kW R32 | HERSTELD | HERSTELD | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Intergas | Xtend Eco | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Remeha | Avanta | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Quinta | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | HERSTELD |
| Remeha | Quinta Pro | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | HERSTELD |
| Remeha | Quinta Ace | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Tzerra Ace | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Calenta Ace | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Avanta Ace | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Tzerra Ace-Matic | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Calenta Ace-Matic | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Calenta Ace-Matic 40L | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Remeha | Elga Ace | HERSTELD | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Vaillant | ecoTEC plus IoniDetect | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Vaillant | ecoTEC exclusive IoniDetect | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Vaillant | ecoFIT pro | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Vaillant | ecoTEC classic | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Vaillant | ecoTEC plus /5-5 | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Vaillant | ecoTEC exclusive /5-7 | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Vaillant | ecoTEC pure | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG | NIET AANWEZIG / NIET VAN TOEPASSING | ONZEKER — HANDMATIGE CONTROLE NODIG | ONZEKER — HANDMATIGE CONTROLE NODIG |
| Nefit | ProLine NxT | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | ProLine HRC | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | TopLine Compact | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | TopLine | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | TopLine II | IDENTIEK | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | IDENTIEK |
| Nefit | TrendLine II | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | TrendLine II AquaPower Plus | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| Nefit | 9700i | HERSTELD | IDENTIEK | IDENTIEK | NIET AANWEZIG / NIET VAN TOEPASSING | IDENTIEK | HERSTELD |
| ATAG | A-Serie | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |
| Bosch | HRC | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |
| Bosch | HRS/HRC Top | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | NIET AANWEZIG / NIET VAN TOEPASSING | ALLEEN IN HUIDIGE MASTER — BEHOUDEN | ALLEEN IN HUIDIGE MASTER — BEHOUDEN |

## 12. Eindconclusie

**Aantoonbaar hersteld:** 29 databestanden (28 technische referentiebestanden plus de actuele catalogus met twee noodzakelijke tellingwijzigingen), 1.434 technisch gecorrigeerde bestaande records en 1 aantoonbaar ontbrekende storingscode.

**Onzeker / niet gewijzigd:** 9 datasets met 353 records voor drie oudere Vaillant-generaties; daarnaast de behouden actuele catalogusbronlinks van Remeha Quinta en Quinta Pro als afzonderlijk bronmetadata-aandachtspunt.

De actuele applicatie, alle latere toestellen, ATAG, Bosch HRC, Bosch HRS/HRC Top, alle bestaande frontendbestanden en alle actuele PWA-functionaliteit zijn behouden. De herstelde master voldoet aan de structurele en functionele validaties en bevat geen zelf gegenereerde technische inhoud.
