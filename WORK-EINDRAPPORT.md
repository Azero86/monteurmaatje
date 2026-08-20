# WORK-EINDRAPPORT — MonteurMaatje

Datum: 20 augustus 2026  
Uitgangspunt: uitsluitend de aangeleverde actuele VPS-versie `monteurmaatje(3).zip`  
SHA-256 bron-ZIP: `211e41ee31b63b34f2a120f089da7cccff780595cc88a4e1aa9fd5a7c83de5de`

## 1. Gewijzigde bestanden

| Bestand | Reden |
|---|---|
| `app.js` | Duidelijke handleidingactie, beter scanbare parameterweergave en beveiliging tegen een raceconditie bij snel wisselen tussen toestellen. |
| `style.css` | Conservatieve styling voor handleidingknoppen en parameters, inclusief mobiel, toetsenbordfocus en dark mode. |
| `WORK-EINDRAPPORT.md` | Verplicht eindrapport van deze kwaliteitsronde. |

Geen bestand onder `data/` is gewijzigd. `index.html`, `sw.js`, manifesten, iconen, Admin/Data Studio en overige applicatiebestanden zijn ongewijzigd gebleven.

## 2. Uitgevoerde UI-wijzigingen

### Handleidingen

- Een bestaand officieel document verschijnt nu als een duidelijke knop met de tekst **Open officiële handleiding** en een extern-linkteken.
- Bij meerdere documenten wordt het bestaande documenttype in de actie gebruikt, bijvoorbeeld **Open installatiehandleiding**.
- De officiële documenttitel blijft beschikbaar via `title` en de toegankelijke `aria-label`.
- De bestaande externe werking (`target="_blank"` en `rel="noopener noreferrer"`) is behouden.
- De knop heeft een minimale aanraakhoogte van 44 px op mobiel, zichtbare toetsenbordfocus en expliciete light/dark-styling.
- Er zijn geen handleidingen toegevoegd of verwijderd. Alle 42 bestaande `sourceUrl`-/`manuals[].url`-records zijn exact ongewijzigd.

### Parameters

- Lange parameteromschrijvingen worden alleen in de keuzelijst visueel ingekort tot een compacte, herkenbare tekst. Na selectie blijft de volledige omschrijving zichtbaar.
- Afzonderlijke keuzes worden als losse, regelafbreekbare regels weergegeven in plaats van één lange tekstregel.
- Fabrieksinstelling, bereik, eenheid, categorie en alle keuzeteksten blijven behouden.
- Een aanvullende `note` wordt zichtbaar onder **Aanvullende informatie**. Een exact dubbel bereik-notitieblok wordt niet nogmaals getoond, omdat hetzelfde bereik al volledig onder **Instelbereik** staat.
- Zeer lange technische toelichtingen worden in een uitklapbaar blok geplaatst. De volledige bestaande tekst blijft in de DOM en is beschikbaar voor de monteur.
- Samengestelde parameters, waaronder de geteste Xtend Eco-parameters `P009` en `P049`, behouden al hun bestaande keuzes en toelichtingen.

## 3. Veilige code-opschoning

- Dubbele bronresolutie bij storingsweergave is vereenvoudigd; de al geladen bronmetadata wordt rechtstreeks gebruikt.
- Bronmetadata voor faults en parameters wordt expliciet in de toepassingsstatus bewaard.
- Een aantoonbare raceconditie is verholpen: bij snel wisselen kon een tragere laadactie van het vorige toestel later de gegevens van het nieuwe toestel overschrijven. Een nieuwe toestelselectie breekt de vorige laadactie nu af en controleert vóór weergave opnieuw of het antwoord bij het nog geselecteerde toestel hoort.
- Lopende toesteldata-loads worden ook afgebroken bij merk wisselen en bij **Wis keuze**.
- Verder zijn geen functies, CSS-regels of globale variabelen verwijderd. Mogelijke cosmetische refactors in de bestaande, deels gegenereerde/minified CSS zijn bewust niet uitgevoerd vanwege regressierisico.
- Er is geen framework, build-systeem, backend, database of nieuwe architectuur toegevoegd.

## 4. Regressietests en resultaten

De eerste pass is na de wijzigingen uitgevoerd. Na het verhelpen van een fout in de testverwachting voor een bewust dubbel bereik-notitieblok is de volledige eindpass opnieuw uitgevoerd.

| Onderdeel | Uitgevoerde controle | Resultaat |
|---|---|---|
| A. Navigatie | Initialisatie, merkselectie, toestelselectie, toestelpagina, tabs, storingsselectie en **Wis keuze** over alle 33 toestellen. | **GESLAAGD** |
| B. Storingen | Alle 33 gekoppelde `faults.json`-bestanden laden; eerste code per toestel interactief weergegeven; 2.088 records structureel gevalideerd; geen dubbele codes. | **GESLAAGD** |
| C. Parameters | Alle 33 gekoppelde `parameters.json`-bestanden laden; eerste parameter per toestel interactief weergegeven; 1.886 records structureel gevalideerd; geen dubbele codes; lange/samengestelde parametercontrole uitgevoerd. | **GESLAAGD** |
| D. Verbranding | Alle 28 gekoppelde `combustion.json`-bestanden laden en renderen; toestellen zonder bestand tonen geen verbrandingstab; warmtepompen hebben geen `combustionPath`. | **GESLAAGD** |
| E. Handleidingen | Actie verschijnt bij storing en parameter; bestaande URL per toestel/dataset blijft behouden; ontbreken veroorzaakt geen lege knop. | **GESLAAGD** |
| F. Light/dark | Themawissel, opslag van de keuze, wijziging van `theme-color`, specifieke contraststijlen voor handleidingknop en parameterblokken. | **GESLAAGD** |
| G. Mobiel | Bestaande breakpoints behouden; 44 px aanraakhoogte; bron/knop onder elkaar; parameterwaarden en keuzes naar één kolom; `overflow-wrap` voor lange tekst. | **GESLAAGD (structureel)** |
| H. Desktop | Bestaande grid/layout ongewijzigd; parameterwaarden rechts uitgelijnd en begrensd; bron en actie blijven naast elkaar zolang ruimte beschikbaar is. | **GESLAAGD (structureel)** |
| I. PWA | Manifest is geldige JSON; alle 3 manifesticonen bestaan; alle serviceworker app-shellbestanden bestaan; JSON-shape-validatie en conditionele revalidatie aanwezig. | **GESLAAGD** |
| J. Data-integriteit | Catalogus, alle gekoppelde paden, alle 99 JSON-bestanden, deviceId's en record-ID's gecontroleerd. Hashvergelijking van alle 100 bestanden onder `data/`. | **GESLAAGD** |

Aanvullend:

- `app.js` en `sw.js` slagen voor `node --check`.
- De echte `app.js` is in een geïsoleerde DOM-regressieharness uitgevoerd voor alle 33 catalogustoestellen.
- Faults, parameters, verbranding en de 3 aanwezige diagnosedatasets zijn daadwerkelijk door de toepassingslogica geladen en gerenderd.
- De snelle-toestelwisseltest is met een kunstmatig vertraagde oude load uitgevoerd en geslaagd.
- Tijdens de eindpass zijn geen JavaScript-consolefouten opgetreden.
- De beschikbare cloudbrowser weigerde om veiligheidsredenen toegang tot de lokale testserver. Daarom kon in deze werkomgeving geen pixelmatige Chromium-screenshotcontrole worden uitgevoerd. Mobiel en desktop zijn wel structureel gecontroleerd via de echte HTML/CSS-breakpoints en de DOM-regressietest. Een korte visuele praktijktest op een fysiek mobiel toestel blijft aanbevolen.

## 5. Structurele dataresultaten

| Controle | Resultaat |
|---|---:|
| Merken | 4 |
| Catalogustoestellen | 33 |
| Geldige JSON-bestanden onder `data/` | 99 |
| Gekoppelde datasetpaden | 97 |
| Storingsrecords | 2.088 |
| Parameterrecords | 1.886 |
| Verbrandingsbestanden | 28 |
| Diagnoseflows | 28 |
| Ongewijzigde bestanden onder `data/` | 100/100 |
| Ongewijzigde bron-/handleiding-URL-records | 42/42 |

`data/version.json` is aanwezig maar niet rechtstreeks vanuit `catalog.json` gekoppeld. Dit bestaande bestand is bewust behouden en niet gewijzigd.

## 6. Bewust niet aangepast

- Geen redesign of wijziging van de Eneco-geïnspireerde huisstijl.
- Geen wijziging van navigatie, gebruikersflow, logo’s, iconen of thema-opzet.
- Geen wijziging van Admin/Data Studio.
- Geen opschoning van de omvangrijke bestaande minified/bundled basis-CSS; dat zou zonder buildbron een onnodig regressierisico geven.
- Geen wijziging van `sw.js` of cachenaam. Dit is niet noodzakelijk: de bestaande serviceworker valideert frontendassets conditioneel bij het netwerk en levert gewijzigde `app.js`/`style.css` daardoor actueel uit. Een onnodige cacheversiewijziging is vermeden.
- Geen inhoudelijke technische data-audit en geen correctie van storings-, parameter- of verbrandingsinhoud.

## 7. Mogelijke technische datafouten

Tijdens deze structurele en UI-gerichte kwaliteitsronde zijn geen nieuwe, objectief aantoonbare technische datafouten vastgesteld. De inhoud van toesteldata is conform opdracht niet opnieuw beoordeeld of herschreven.

## 8. Bevestiging data-integriteit

- Technische toesteldata is niet inhoudelijk herschreven.
- Geen storingscode, parameter, technische waarde, eenheid, verbrandingswaarde, handleiding-URL, bron-URL, `deviceId` of cataloguspad is gewijzigd.
- De SHA-256-hashes van alle 100 oorspronkelijke bestanden onder `data/` zijn na de wijzigingen identiek aan de aangeleverde versie.

## 9. Eindconclusie

**Klaar voor praktijktest.** De gevraagde usability-verbeteringen zijn conservatief uitgevoerd, de bestaande functionaliteit en technische dataset zijn behouden en de volledige geautomatiseerde eindpass is geslaagd. Voer vóór publieke uitrol nog een korte visuele rooktest uit op de daadwerkelijk gebruikte mobiele browsers, omdat de lokale site vanuit deze werkomgeving niet door de cloudbrowser mocht worden geopend.
