# Vaillant V2 – Release Candidate Audit

Datum: 2026-08-18

## Actieve Nederlandse Vaillant-kern

| Familie | Foutcodes | Parameters | Verbrandingsrecords | Controle |
|---|---:|---:|---:|---|
| ecotec-plus-cs | 84 | 99 | 1 | NL fabrikant-PDF; 84 F / 99 D; IoniDetect diagramprocedure |
| ecotec-exclusive-cf | 84 | 99 | 3 | NL fabrikant-PDF; 16 F toegevoegd, 2 foutieve verwijderd; D.185–D.187 toegevoegd |
| ecofit-pro-6-3 | 38 | 67 | 9 | NL fabrikant-PDF; 38 F / 67 D; aardgas-K CO₂/O₂ gecorrigeerd |
| ecotec-classic-5-3 | 33 | 69 | 7 | NL fabrikant-PDF; 33 F / 69 D; aardgas-K verbranding gecontroleerd |
| ecotec-plus-5-5 | 49 | 70 | 6 | NL VHR-handleiding; 49 F / 70 D; G25/G31 CO₂ uit NL tabel |
| ecotec-exclusive-5-7 | 45 | 76 | 5 | NL N-NL-handleiding; 45 F / 76 D; Hongaarse bron/tekst verwijderd |
| ecotec-pure-7-2 | 36 | 59 | 3 | NL K-NL-handleiding; 36 F / 59 D; G25 CO₂ 8,8/9,0 ±0,3 uit NL tabel |

## Uitgesloten

- `ecotec-pro-5-3`: aangeleverde VC/VCW België-set niet als Nederlandse VHR-uitvoering bewezen.
- `turbomax-plus-2`: Britse 824/2E / 828/2E-set; geen Nederlandse dekking vastgesteld.
- `atmotec-turbotec-3`: niet actief in oorspronkelijke catalogus en niet compleet voor parameters/verbranding.

## Belangrijkste herstelwerk

- ecoTEC plus CS: 78 → 84 F-codes; de zes ontbrekende officiële codes toegevoegd.
- ecoTEC exclusive CF: officiële NL-fouttabel opnieuw vergeleken; 16 codes toegevoegd, F.073/F.346 verwijderd, D.185–D.187 toegevoegd.
- ecoFIT pro: oude verbrandingsset vervangen door NL aardgas-K waarden.
- ecoTEC plus /5-5: VC/VCW-benaming vervangen door VHR NL-reeks; verbranding beperkt tot NL G25/G31-tabel.
- ecoTEC exclusive /5-7: Hongaarse bronverwijzingen en Hongaarse parameterproza verwijderd; N-NL handleiding is leidend.
- ecoTEC pure /7-2: Belgische E/ES-waarden verwijderd; NL G25-setpoints opgenomen.

## Automatische validatie

- Alle actieve JSON-bestanden laden.
- Geen dubbele fault- of parametercodes.
- Alle Vaillant `recordCount`-waarden matchen het aantal faults.
- Globale `catalog.json.recordCount` opnieuw berekend.
- Geen actieve `vaillant.hu` of Britse Vaillant-bronnen.

Validatiefouten: **0**

## Status

Deze ZIP is de samengevoegde release-candidate. De drie uitgesloten families blijven bewust buiten de actieve catalogus totdat hun Nederlandse marktdekking en complete technische set aantoonbaar zijn.
