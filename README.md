# Emergenze

Strumenti per il pronto soccorso, in un'app web installabile sul telefono: calcolatori rapidi e riassunti brevi delle linee guida.

- **Indirizzo:** `https://dversari.github.io/Emergenze/`
- **Nessun login, nessun dato.** App statica: i valori inseriti nei calcolatori restano nel browser e non vengono salvati. Funziona anche senza rete (service worker).
- **Telefono:** apri l'indirizzo in Safari → Condividi → **Aggiungi a Home**.

## Contenuti

| Scheda | Dove si modifica |
|---|---|
| **Calcolatori** | `src/pages/Calcolatori.tsx`: punteggi a voci (CHA₂DS₂-VA, HAS-BLED, HEART, Wells EP, PERC, CURB-65, GCS) nell'array `PUNTEGGI`; Cockcroft-Gault ed elettroliti come componenti a parte. `#/?apri=<id>` apre direttamente un calcolatore |
| **Linee guida** | `src/lib/lineeGuida.ts`: per ogni linea guida fonte, data dell'ultimo controllo, punti «In PS, in breve», sezioni, registro degli aggiornamenti e calcolatori collegati |

Le dosi riportate vanno sempre verificate su linee guida e scheda tecnica.

## Pubblicazione

Ogni push su `main` ripubblica il sito (GitHub Actions → Pages). Nel repository: Settings → Pages → Source: **GitHub Actions**.
