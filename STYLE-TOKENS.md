# STYLE-TOKENS — MonteurMaatje

Alle actieve kleuren zijn centraal gedefinieerd in **style.css**. Buiten de tokenblokken komen geen losse hex-, rgb- of rgba-kleurwaarden voor.

## Donker thema — standaard

| Token | Waarde | Gebruik |
|---|---:|---|
| --bg | #07090a | Basisachtergrond |
| --bg-ambient | #0a0d0f | Bovenste achtergrondlaag |
| --surface | #0d1012 | Primaire kaarten en panelen |
| --surface-elevated | #121619 | Verhoogde of geneste panelen |
| --surface-hover | #171c20 | Hover- en interactieve achtergrond |
| --surface-strong | #1b2024 | Sterke neutrale invulling |
| --surface-inset | #090b0d | Inliggende velden en secties |
| --border | #292e32 | Standaard border |
| --border-subtle | #1e2327 | Subtiele scheidingslijn |
| --border-active | #f32d20 | Actieve border |
| --text-primary | #f5f7f8 | Primaire tekst |
| --text-secondary | #b8bec3 | Secundaire tekst |
| --text-muted | #7f878d | Gedempte tekst |
| --text-on-accent | #ffffff | Tekst op gevulde actieknoppen |
| --accent | #f32d20 | Accenttekst, iconen en actieve lijnen |
| --accent-hover | #ff4438 | Lichte accentvariatie |
| --accent-strong | #bf1d14 | Donkere accentvariatie |
| --accent-fill | #d9271b | Toegankelijke rode knopvulling |
| --accent-fill-hover | #c52218 | Hovervulling met wit tekstcontrast |
| --accent-soft | rgba(243,45,32,.12) | Zachte rode achtergrond |
| --accent-soft-strong | rgba(243,45,32,.2) | Sterkere rode achtergrond/border |
| --accent-glow | rgba(243,45,32,.25) | Subtiele actieve glow |
| --success | #31d17c | OK- en successtatus |
| --success-soft | rgba(49,209,124,.12) | Zachte succesachtergrond |
| --warning | #f4b642 | Waarschuwing |
| --warning-soft | rgba(244,182,66,.12) | Zachte waarschuwingsachtergrond |
| --danger | #ff5a4f | Fout-/gevaarstatus |
| --danger-soft | rgba(255,90,79,.12) | Zachte foutachtergrond |
| --info | #4aa8ff | Informatieve status |
| --info-soft | rgba(74,168,255,.12) | Zachte informatieachtergrond |
| --focus | #ff746b | Keyboardfocus |
| --overlay | rgba(0,0,0,.9) | Fullscreen diagramviewer |
| --grid-line | rgba(255,255,255,.018) | Subtiel technisch achtergrondraster |
| --inset-highlight | rgba(255,255,255,.035) | Inliggende highlight |

## Licht thema — bestaande keuze behouden

| Token | Waarde |
|---|---:|
| --bg | #e8ebed |
| --bg-ambient | #f2f4f5 |
| --surface | #ffffff |
| --surface-elevated | #f7f8f9 |
| --surface-hover | #eef1f3 |
| --surface-strong | #e2e6e9 |
| --surface-inset | #f3f5f6 |
| --border | #c9d0d4 |
| --border-subtle | #dce1e4 |
| --border-active | #d9271b |
| --text-primary | #141718 |
| --text-secondary | #464d52 |
| --text-muted | #6c747a |
| --accent | #d9271b |
| --accent-hover | #ef3326 |
| --accent-strong | #ad1d14 |
| --accent-fill | #d9271b |
| --accent-fill-hover | #c52218 |
| --success | #087b46 |
| --warning | #9a6500 |
| --danger | #c72c23 |
| --info | #1769aa |
| --focus | #b91f15 |

De transparante lichte varianten, schaduwen en rasterwaarden zijn eveneens centraal in het blok voor het lichte thema vastgelegd.

## Vorm en diepte

| Token | Waarde |
|---|---:|
| --radius-sm | 8px |
| --radius-md | 12px |
| --radius-lg | 16px |
| --radius-xl | 20px |
| --shadow | Diepe maar terughoudende kaartschaduw |
| --shadow-soft | Lichte kaartschaduw |
| --shadow-active | Actieve rode rand/glow |

## Spacing en layout

| Token | Waarde |
|---|---:|
| --spacing-1 | 4px |
| --spacing-2 | 8px |
| --spacing-3 | 12px |
| --spacing-4 | 16px |
| --spacing-5 | 20px |
| --spacing-6 | 24px |
| --spacing-7 | 32px |
| --spacing-8 | 40px |
| --spacing-9 | 48px |
| --spacing-10 | 64px |
| --content-width | 1180px |
| --nav-height | 70px desktop, 66px mobiel |

## Gebruikregels

- Gebruik --accent voor iconen, actieve tekst en lijnen.
- Gebruik --accent-fill voor vlakken met witte tekst; deze combinatie voldoet aan WCAG AA voor normale tekst.
- Gebruik rood nooit als enige informatiedrager: actieve onderdelen combineren kleur met border, tekst en/of icoon.
- Gebruik --success, --warning, --danger en --info alleen voor hun functionele status.
- Voeg geen losse kleurwaarden toe buiten de centrale tokenblokken.
- Pas afbeeldingen en bestaande logo's niet aan met CSS-filters of verlaagde opacity.

