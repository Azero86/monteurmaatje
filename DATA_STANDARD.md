# MonteurMaatje-datastandaard

## CV-ketel

```text
data/<merk>/<toestel>/
├── faults.json
├── parameters.json
└── combustion.json
```

Gebruik in `data/catalog.json`:

```json
"deviceType": "boiler"
```

## Warmtepomp

```text
data/<merk>/<toestel>/
├── faults.json
└── parameters.json
```

Gebruik in `data/catalog.json`:

```json
"deviceType": "heatpump"
```

Een warmtepomp krijgt geen `combustion.json` en geen `combustionPath`.

## Vaste regels

- Gebruik uitsluitend officiële fabrikantdocumentatie en behoud document-, pagina- en bronverwijzingen.
- Verzin geen technische waarden en extrapoleer niet uit vergelijkbare modellen.
- Behandel bestaande `faults.json` bij data-updates als read-only.
- Neem `faultsPath`, `parametersPath` en `combustionPath` alleen op als het genoemde bestand bestaat.
- Laat `deviceId` in ieder databestand exact overeenkomen met de toestel-ID in `data/catalog.json`.
- Gebruik uitsluitend `boiler` of `heatpump` als `deviceType`.
- Valideer alle JSON syntactisch vóór oplevering.
