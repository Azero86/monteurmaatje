# Technisch auditrapport MonteurMaatje — VPS-productieversie

Auditdatum: 20 augustus 2026  
Bronbestand: uitsluitend de aangeleverde `monteurmaatje.zip` (SHA-256 `7d32baf1e2f2e885a7e1139687adb37cda1989b3679b8662aa570e77212d93e5`)  
GitHub/main is niet gebruikt.

## Uitkomst

De productiecatalogus bevat 33 toestellen van vier merken. Voor 30 toestellen is de exacte officiële Nederlandse fabrikantdocumentatie bevestigd. Voor drie oudere Vaillant-generaties kon geen exacte officiële Nederlandse installatie-/servicehandleiding op de fabrikantwebsite worden bevestigd; deze datasets zijn daarom technisch ongewijzigd gebleven en staan onder **ONZEKER / HANDMATIGE CONTROLE NODIG**.

In totaal zijn 1426 bestaande storingscoderecords inhoudelijk gecorrigeerd en is 1 aantoonbaar ontbrekende code toegevoegd. Er zijn 8 parameterrecords technisch gecorrigeerd. Geen verbrandingswaarden zijn gewijzigd: alle numerieke waarden van de 25 bevestigde keteldatasets zijn tegen de officiële bron gecontroleerd; drie oudere Vaillant-datasets zijn niet als bevestigd aangemerkt.

Belangrijkste structurele bevindingen:

- In meerdere Remeha-, Vaillant- en Nefit-bestanden stonden hergebruikte, generieke oorzaken/controleblokken die niet per code door de gekoppelde handleiding werden gedragen. Bij alle 30 bevestigde toestellen zijn die velden per code vervangen door uitsluitend de tekst/informatie uit de exacte officiële tabel; waar de fabrikant geen oorzaak of oplossing noemt, blijft de betreffende lijst leeg.
- Remeha Quinta Pro miste de officieel gedocumenteerde code `E.15`; deze is toegevoegd en catalogustellingen zijn daarop aangepast.
- Intergas Xtend Split en Xtend Monoblock bevatten bij P140, P142 en P144 buitenlandse valuta-eenheden en bij P187 een Engelse eenheid/keuzetekst. Die acht records zijn rechtstreeks volgens de officiële Nederlandse Intergas-tabellen gecorrigeerd.
- Intergas-document 88008407 (december 2024) noemt zowel buitenunit 050614 (wit, oorspronkelijke Split) als 050616 (grijs, Cool Grey). De bestaande gescheiden generatiedatasets zijn behouden; er zijn geen codes of parameters tussen generaties gelijkgetrokken.
- De serviceworker verwierp de vier Xtend-datasets omdat hun correcte catalogus-`deviceId` het merkvoorvoegsel bevat. De validator accepteert nu zowel map-id als data-gedreven merk/toestel-id. Zonder deze kleine correctie konden de datasets door de PWA-cache worden geweigerd.
- De bestaande niet-officiële links voor drie oudere Vaillant-generaties zijn niet als technische bron gebruikt. Er is geen buitenlandse of vergelijkbare toestelhandleiding als vervanging ingezet.

## Audittrail per toestel

In de kolom ‘gecorrigeerd’ worden alleen technische inhoudsverschillen geteld; bron-URL-, paginaverwijzings- en verificatiemetadata tellen niet mee.

| Merk | Toestel | Officiële handleiding / revisie | NL bevestigd | Storingen huidig → gecontroleerd / gecorrigeerd / toegevoegd / onbevestigd | Parameters gecontroleerd / gecorrigeerd | Verbranding gecontroleerd / gecorrigeerd |
|---|---|---|---:|---:|---:|---:|
| Intergas | Kombi Kompakt HRE | [Intergas installatievoorschrift Kombi Kompakt HRE, document 88557809](https://www.intergas-verwarming.nl/app/uploads/2018/01/88557809-Installatievoorschrift-Kombi-Kompakt-HRE.pdf) — document 88557809, 2018/01 | JA | 20 → 20 / 0 / 0 / 0 | 33 / 0 | 15 / 0 |
| Intergas | Kombi Kompakt HREco | [Intergas installatievoorschrift Kombi Kompakt HREco](https://www.intergas-verwarming.nl/app/uploads/2018/01/88399809-Installatievoorschrift-HReco.pdf) — 2018/01 | JA | 20 → 20 / 0 / 0 / 0 | 33 / 0 | 14 / 0 |
| Intergas | Xtreme | [Intergas installatievoorschrift Xtreme 24/30/36, document 84004414](https://www.intergas-verwarming.nl/app/uploads/2018/01/84004414.pdf) — document 84004414, 2018/01 | JA | 22 → 22 / 0 / 0 / 0 | 17 / 0 | 14 / 0 |
| Intergas | Xtend Split 5 kW | [Intergas Installatievoorschrift Xtend, document 88008407 (december 2024)](https://www.intergas-verwarming.nl/app/uploads/2025/05/88008407-Installatievoorschrift-Xtend-Cool-Grey.pdf) — document 88008407, 2025/05, december 2024 | JA | 38 → 38 / 0 / 0 / 0 | 89 / 4 | n.v.t. |
| Intergas | Xtend Cool Grey 5 kW | [Intergas Installatievoorschrift Xtend, document 88008407 (december 2024)](https://www.intergas-verwarming.nl/app/uploads/2025/05/88008407-Installatievoorschrift-Xtend-Cool-Grey.pdf) — document 88008407, 2025/05, december 2024 | JA | 69 → 69 / 0 / 0 / 0 | 122 / 0 | n.v.t. |
| Intergas | Xtend Monoblock 5 kW R32 | [Intergas installatievoorschrift Xtend Monoblock, document 88102401](https://www.intergas-verwarming.nl/app/uploads/2024/03/88102401-Installatievoorschrift-Xtend-Monoblock.pdf) — document 88102401, 2024/03 | JA | 56 → 56 / 0 / 0 / 0 | 89 / 4 | n.v.t. |
| Intergas | Xtend Eco | [Intergas Installatievoorschrift Xtend Eco, document 88104401 (juni 2026)](https://www.intergas-verwarming.nl/app/uploads/2025/12/88104401-Installatievoorschrift-Xtend-Eco-1.pdf) — document 88104401, 2025/12, juni 2026 | JA | 77 → 77 / 0 / 0 / 0 | 123 / 0 | n.v.t. |
| Remeha | Avanta | [Remeha installatie- en servicehandleiding Avanta 24c/28c/35c](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Avanta-Installatie-en-servicehandleiding-NL-V13.pdf) — V13, 2025/12 | JA | 17 → 17 / 17 / 0 / 0 | 15 / 0 | 10 / 0 |
| Remeha | Quinta | [Remeha Technische informatie Quinta 25s/30s/28c/35c (versie AH)](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Quinta-25s_28c_30s_35c-versie-AH.pdf) — versie AH, 2025/12 | JA | 19 → 19 / 19 / 0 / 0 | 29 / 0 | 10 / 0 |
| Remeha | Quinta Pro | [Remeha installatie-, gebruikers- en servicehandleiding Quinta Pro 45/65/90/115, V12](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Installatie-gebruikers-en-servicehandleiding-Quinta-Pro-45-65-90-%E2%80%93-115-%E2%80%93-V12.pdf) — V12, 2025/12 | JA | 42 → 43 / 42 / 1 / 0 | 41 / 0 | 12 / 0 |
| Remeha | Quinta Ace | [Remeha installatie- en gebruikershandleiding Quinta Ace 45–115](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Quinta-Ace-45-115-Installatie-en-gebruikershandleiding-NL-V14.pdf) — V14, 2025/12 | JA | 75 → 75 / 75 / 0 / 0 | 61 / 0 | 10 / 0 |
| Remeha | Tzerra Ace | [Remeha servicehandleiding Tzerra Ace](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Tzerra-Ace-Servicehandleiding-NL-V8.pdf) — V8, 2025/12 | JA | 66 → 66 / 66 / 0 / 0 | 56 / 0 | 10 / 0 |
| Remeha | Calenta Ace | [Remeha installatie- en servicehandleiding Calenta Ace](https://documentation.remeha.nl/wp-content/uploads/sites/68/2025/12/Installatie-en-servicehandleiding-Calenta-Ace-V11.pdf) — V11, 2025/12 | JA | 85 → 85 / 85 / 0 / 0 | 67 / 0 | 13 / 0 |
| Remeha | Avanta Ace | [Remeha installatie- en servicehandleiding Avanta Ace](https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/RemehaNL/RemehaNL/Documentatie/Consument/01---CV-ketels/Avanta-Ace/Documentatie-voor-installateurs/Installatie--en-servicehandleiding-Avanta-Ace.pdf) — niet afzonderlijk vermeld | JA | 62 → 62 / 62 / 0 / 0 | 45 / 0 | 12 / 0 |
| Remeha | Tzerra Ace-Matic | [Remeha installatie- en servicehandleiding Tzerra Ace-Matic](https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/RemehaNL/RemehaNL/Documentatie/Consument/01---CV-ketels/Tzerra-Ace-Matic/Documentatie-voor-installateurs/Installatie--en-servicehandleiding-Tzerra-Ace-Matic.pdf) — niet afzonderlijk vermeld | JA | 97 → 97 / 97 / 0 / 0 | 66 / 0 | 8 / 0 |
| Remeha | Calenta Ace-Matic | [Remeha installatie- en servicehandleiding Calenta Ace-Matic](https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/RemehaNL/RemehaNL/Documentatie/Consument/01---CV-ketels/Calenta-Ace-Matic/Documentatie-voor-installateurs/7861541_Calenta-Ace-Matic-Installatie-service-handleiding.pdf) — niet afzonderlijk vermeld | JA | 97 → 97 / 97 / 0 / 0 | 60 / 0 | 9 / 0 |
| Remeha | Calenta Ace-Matic 40L | [Remeha installatie- en servicehandleiding Calenta Ace-Matic 40L](https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/RemehaNL/RemehaNL/Documentatie/Consument/01---CV-ketels/Calenta-Ace-Matic/Documentatie-voor-installateurs/7861586_Calenta-Ace-Matic_Installatie-en-servicehandleiding_40L.pdf) — niet afzonderlijk vermeld | JA | 106 → 106 / 106 / 0 / 0 | 63 / 0 | 11 / 0 |
| Remeha | Elga Ace | [Remeha installatie-, gebruikers- en servicehandleiding Elga Ace](https://edge.sitecorecloud.io/bdrthermea1-platform-production-864a/media/Project/RemehaNL/RemehaNL/Documentatie/Consument/02---Hybride-warmtepompen/Elga-Ace/Documentatie-voor-installateurs/Installatie-gebruikers-en-servicehandleiding-Elga-Ace.pdf) — niet afzonderlijk vermeld | JA | 28 → 28 / 28 / 0 / 0 | 70 / 0 | n.v.t. |
| Vaillant | ecoTEC plus IoniDetect | [Vaillant ecoTEC plus — Installatie- en onderhoudshandleiding 0020282267_08 (NL)](https://www.vaillant.nl/api/download/product/nl/_ecotec-plus_1410230.pdf) — 0020282267_08 | JA | 84 → 84 / 84 / 0 / 0 | 99 / 0 | 3 / 0 |
| Vaillant | ecoTEC exclusive IoniDetect | [Vaillant ecoTEC exclusive installatie- en onderhoudshandleiding 0020282268_07 (NL)](https://www.vaillant.nl/api/download/product/nl/_ecotec-exclusive_1387681.pdf) — 0020282268_07 | JA | 84 → 84 / 84 / 0 / 0 | 99 / 0 | 5 / 0 |
| Vaillant | ecoFIT pro | [Vaillant ecoFIT pro installatie- en onderhoudshandleiding 0020288882_06 (NL)](https://www.vaillant.nl/api/download/product/nl/_ecofit-pro_1463408.pdf) — 0020288882_06 | JA | 38 → 38 / 38 / 0 / 0 | 67 / 0 | 10 / 0 |
| Vaillant | ecoTEC classic | [Vaillant ecoTEC classic installatie- en onderhoudshandleiding 0020275648_03 (NL)](https://www.vaillant.nl/api/download/product/nl/_ecotec-classic_1452305.pdf) — 0020275648_03 | JA | 33 → 33 / 33 / 0 / 0 | 69 / 0 | 7 / 0 |
| Vaillant | ecoTEC plus /5-5 | Geen exact officieel NL-servicevoorschrift bevestigd | NEE | 49 → 0 / 0 / 0 / 49 | 0 / 0 (dataset: 70) | 0 / 0 (datasetrecords: 6) |
| Vaillant | ecoTEC exclusive /5-7 | Geen exact officieel NL-servicevoorschrift bevestigd | NEE | 45 → 0 / 0 / 0 / 45 | 0 / 0 (dataset: 76) | 0 / 0 (datasetrecords: 8) |
| Vaillant | ecoTEC pure | Geen exact officieel NL-servicevoorschrift bevestigd | NEE | 36 → 0 / 0 / 0 / 36 | 0 / 0 (dataset: 59) | 0 / 0 (datasetrecords: 4) |
| Nefit | ProLine NxT | [Nefit Bosch installatie-instructie ProLine NxT, document 6721823664 (2024/09)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6721823664) — document 6721823664, 2024/09 | JA | 48 → 48 / 46 / 0 / 0 | 18 / 0 | 15 / 0 |
| Nefit | ProLine HRC | [Nefit Bosch installatie-instructie ProLine Eco, document 6721823665 (2024/09)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6721823665.pdf) — document 6721823665, 2024/09 | JA | 48 → 48 / 46 / 0 / 0 | 18 / 0 | 10 / 0 |
| Nefit | TopLine Compact | [Nefit installatie-instructie TopLine Compact HRC, document 6720641180 (2019/07)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6720641180.pdf) — document 6720641180, 2019/07 | JA | 86 → 86 / 72 / 0 / 0 | 21 / 0 | 5 / 0 |
| Nefit | TopLine | [Nefit installatie-instructie TopLine HR/AquaPower, document 6720641179 (2019/07)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6720641179.pdf) — document 6720641179, 2019/07 | JA | 95 → 95 / 63 / 0 / 0 | 21 / 0 | 6 / 0 |
| Nefit | TopLine II | [Nefit installatie-instructie TopLine HR II/AquaPower II, document 6720801234 (2019/07)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6720801234.pdf) — document 6720801234, 2019/07 | JA | 93 → 93 / 0 / 0 / 0 | 21 / 0 | 14 / 0 |
| Nefit | TrendLine II | [Nefit Bosch installatie-instructie TrendLine II, document 6721823668 (2024/09)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6721823668) — document 6721823668, 2024/09 | JA | 124 → 124 / 96 / 0 / 0 | 40 / 0 | 13 / 0 |
| Nefit | TrendLine II AquaPower Plus | [Nefit Bosch installatie-instructie TrendLine II AquaPower Plus, document 6721823669 (2024/09)](https://nefit-nl-nl-b.boschhc-documents.com/download/pdf/file/6721823669) — document 6721823669, 2024/09 | JA | 124 → 124 / 96 / 0 / 0 | 39 / 0 | 13 / 0 |
| Nefit | 9700i | [Nefit Bosch installatie- en onderhoudsinstructie 9700i HR(C), document 6721875843 (2024/02)](https://www.nefit-bosch.nl/media/country_pool/professioneel/documenten/hr-ketels/6721875843.pdf) — document 6721875843, 2024/02 | JA | 105 → 105 / 74 / 0 / 0 | 90 / 0 | 22 / 0 |

## ONZEKER / HANDMATIGE CONTROLE NODIG

Voor de volgende toestellen kon de in de VPS-data genoemde exacte Nederlandse installatie-/servicehandleiding niet als officiële Vaillant-download worden bevestigd. De bestaande links zijn bronnen van derden en zijn daarom afgewezen. Geen storingscode, parameter of verbrandingswaarde is op basis daarvan gewijzigd:

### Vaillant ecoTEC plus /5-5

- Niet-geaccepteerd startpunt uit de VPS: `https://www.gebruikershandleiding.com/Vaillant-ecoTEC-plus-VHR-NL-25-30-5-5/handleiding-5-616414.html`
- Geclaimd document in de bestaande data: Vaillant ecoTEC plus VHR NL /5-5 installatie- en onderhoudshandleiding (NL, doc. 0020116691_02)
- Openstaande controle: fabrikantkopie van exact deze Nederlandse generatie/uitvoering verkrijgen en daarna alle 49 storingscodes, 70 parameters en 6 verbrandingsrecords opnieuw verifiëren.
- Status: **NL-documentatie niet voldoende bevestigd**.

### Vaillant ecoTEC exclusive /5-7

- Niet-geaccepteerd startpunt uit de VPS: `https://www.gebruikershandleiding.com/Vaillant-ecoTEC-exclusive-VHR/preview-handleiding-951418.html`
- Geclaimd document in de bestaande data: Vaillant ecoTEC exclusive VHR /5-7 installatie- en onderhoudshandleiding 0020196927_01 (N-NL)
- Openstaande controle: fabrikantkopie van exact deze Nederlandse generatie/uitvoering verkrijgen en daarna alle 45 storingscodes, 76 parameters en 8 verbrandingsrecords opnieuw verifiëren.
- Status: **NL-documentatie niet voldoende bevestigd**.

### Vaillant ecoTEC pure

- Niet-geaccepteerd startpunt uit de VPS: `https://www.gebruikershandleiding.com/Vaillant-ecoTEC-pure-VHR-23-28-7--2/preview-handleiding-951469.html`
- Geclaimd document in de bestaande data: Vaillant ecoTEC pure VHR /7-2 installatie- en onderhoudshandleiding 0020231718_01 (NL, K-NL)
- Openstaande controle: fabrikantkopie van exact deze Nederlandse generatie/uitvoering verkrijgen en daarna alle 36 storingscodes, 59 parameters en 4 verbrandingsrecords opnieuw verifiëren.
- Status: **NL-documentatie niet voldoende bevestigd**.

## Tweede controlepass

Na de correctie is een tweede pass uitgevoerd met code-/tabelvergelijking, duplicaatdetectie en willekeurige hercontrole over verschillende merken. Expliciete testcase:

- **Remeha Tzerra Ace E.01.11** luidt nu exact: ‘Ventilatortoerental overschrijdt normaal werkingsbereik’. De controles behandelen bedrading/connectoren, de defecte ventilator en te veel schoorsteentrek. De oude generieke verwijzingen naar sifon, terugslagklep en warmtewisselaar komen niet meer in dit record voor.
- Aanvullende bronhercontrole: Intergas Xtreme `F004`, Intergas Xtend `F022`, Remeha Calenta Ace-Matic `E04.24`, Vaillant ecoTEC plus IoniDetect `F.022`, Vaillant ecoFIT pro `F.28`, Nefit 9700i `224` en Nefit TrendLine II `4A-218`. Code, omschrijving en de aanwezige fabrikantcontrole-informatie zijn opnieuw rechtstreeks met de gebruikte PDF-tabellen vergeleken.
- Hergebruikte causes/checks-signaturen zijn opnieuw geteld. De nog grootschalig hergebruikte generieke blokken bevinden zich uitsluitend in de drie hierboven als onbevestigd gemarkeerde oude Vaillant-datasets. Identieke blokken in bevestigde datasets zijn alleen behouden wanneer de fabrikanttabel dezelfde oplossing voor meerdere codes vermeldt of een codebereik gezamenlijk documenteert.
- De Xtend-codegroepen en generatieverschillen zijn behouden; warmtepompen hebben geen `combustionPath`.

## Validatieresultaten

- 100 JSON-bestanden syntactisch geldig.
- 33 catalogustoestellen; catalogustelling en som van toestelrecords zijn beide 2089.
- Alle 97 vanuit de catalogus gekoppelde datasets via een lokale HTTP-server geladen; `index.html` gaf HTTP 200.
- Geen dubbele storingscodes of parametercodes.
- Geen ontbrekende cataloguspaden; alle payload-`deviceId`-waarden komen overeen met de catalogus-id.
- Geen lege code/titel/parameteromschrijving in de vereiste records.
- Alle numerieke parameterbereiken voldoen aan minimum ≤ maximum; geen numerieke fabrieksinstelling viel buiten het opgegeven bereik.
- JavaScript-syntax van `app.js` en `sw.js` is geldig.
- PWA-cache blijft netwerkhervaliderend werken; alleen de noodzakelijke deviceId-validatie in `sw.js` is verruimd. Cacheversies hoefden niet te worden gewijzigd.
- Geen layout-, huisstijl-, admin-, zoek-, print-, thema- of navigatiewijzigingen uitgevoerd.

## Gewijzigde bestanden

- `data/catalog.json`
- `data/intergas/hre/faults.json`
- `data/intergas/xtend-monoblock-r32-5kw/faults.json`
- `data/intergas/xtend-monoblock-r32-5kw/parameters.json`
- `data/intergas/xtend-split-5kw/faults.json`
- `data/intergas/xtend-split-5kw/parameters.json`
- `data/intergas/xtreme/faults.json`
- `data/nefit/9700i/faults.json`
- `data/nefit/proline-eco/faults.json`
- `data/nefit/proline-nxt/faults.json`
- `data/nefit/topline-compact/faults.json`
- `data/nefit/topline/faults.json`
- `data/nefit/trendline-ii-aquapower-plus/faults.json`
- `data/nefit/trendline-ii/faults.json`
- `data/remeha/avanta-ace/faults.json`
- `data/remeha/avanta-classic/faults.json`
- `data/remeha/calenta-ace-matic-40l/faults.json`
- `data/remeha/calenta-ace-matic/faults.json`
- `data/remeha/calenta-ace/faults.json`
- `data/remeha/elga-ace/faults.json`
- `data/remeha/quinta-ace/faults.json`
- `data/remeha/quinta-classic/faults.json`
- `data/remeha/quinta-pro/faults.json`
- `data/remeha/tzerra-ace-matic/faults.json`
- `data/remeha/tzerra-ace/faults.json`
- `data/vaillant/ecofit-pro-6-3/faults.json`
- `data/vaillant/ecotec-classic-5-3/faults.json`
- `data/vaillant/ecotec-exclusive-cf/faults.json`
- `data/vaillant/ecotec-plus-cs/faults.json`
- `sw.js`
- `TECHNISCH-AUDITRAPPORT.md` (nieuw auditrapport)
- `ONZEKER-HANDMATIGE-CONTROLE.md` (nieuwe afzonderlijke onzekerhedenlijst)

## Afbakening

Er zijn geen toestellen toegevoegd of verwijderd. De gebruikersinterface en technische architectuur zijn ongewijzigd, behalve de strikt noodzakelijke PWA-deviceId-validatie. Bij onvoldoende bronzekerheid is niets ingevuld of aangepast op basis van technische aannames.
