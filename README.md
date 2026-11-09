# Emergenze

Strumenti per il pronto soccorso, in un'app web installabile sul telefono: calcolatori rapidi e riassunti brevi delle linee guida.

- **Indirizzo:** `https://dversari.github.io/Emergenze/`
- **Nessun login.** I valori inseriti nei calcolatori restano nel browser e non vengono salvati. Funziona anche senza rete (service worker), tranne la barra delle domande.
- **Telefono:** apri l'indirizzo in Safari → Condividi → **Aggiungi a Home**.

## Contenuti

| Scheda | Dove si modifica |
|---|---|
| **Calcolatori** | `src/pages/Calcolatori.tsx`: punteggi a voci (CHA₂DS₂-VA, HAS-BLED, HEART, Wells EP, PERC, CURB-65, GCS) nell'array `PUNTEGGI`; Cockcroft-Gault ed elettroliti come componenti a parte. `#/?apri=<id>` apre direttamente un calcolatore |
| **Antibiotici** | `src/lib/antibiotici.ts`: `CONDIZIONI` (card per condizione; nel testo `{id}` diventa il collegamento alla scheda del farmaco), `FARMACI` (confezioni, preparazione, dose, aggiustamento per CrCl, monitoraggio), `REGOLE` (allergia, rene). Pagina `src/pages/Antibiotici.tsx` |
| **Procedure / Sedazione** | `src/lib/schede.ts` (`PROCEDURE`, `SEDAZIONE`): card con blocchi; `numerato: true` per i passaggi in sequenza. Pagina generica `src/components/PaginaSchede.tsx` |
| **Linee guida** | `src/lib/lineeGuida.ts`: per ogni linea guida fonte, data dell'ultimo controllo, punti «In PS, in breve», sezioni, registro degli aggiornamenti e calcolatori collegati |

Le dosi riportate vanno sempre verificate su linee guida e scheda tecnica.

## Domande sul testo completo

In fondo a ogni linea guida con `fonti` c'è una barra «Chiedi al testo completo». Chiama la Edge Function `emergenze-chiedi` del progetto Supabase del Cruscotto (`supabase/functions/emergenze-chiedi`, deploy con `verify_jwt` disattivato perché l'app non ha login):

- **Accesso:** PIN nel segreto `EMERGENZE_PIN` (inserito una volta, salvato sul telefono); dopo 10 PIN errati in un'ora si blocca; massimo 40 domande in 24 ore; stesso tetto di spesa mensile dell'assistente (`ai_spesa`, `AI_BUDGET_MENSILE_USD`).
- **Testo completo:** caricato una volta in `emergenze_testi` (bibliografia tolta). Ordine: PDF in Dropbox `/Documents/Emergenze/Linee guida/<fonte>.pdf` → PDF ad accesso libero → pagina della rivista letta con lo strumento `web_fetch` di Claude. Le linee guida AHA (ahajournals.org) non sono leggibili automaticamente: serve il PDF in Dropbox.
- **Risposta:** Claude Haiku (riserva Sonnet), solo dal testo, con sezione e classe di raccomandazione; registro in `emergenze_domande`.
- **Nuova fonte:** aggiungerla in `FONTI` nella funzione e nel campo `fonti` della linea guida in `src/lib/lineeGuida.ts`.

## Pubblicazione

Ogni push su `main` ripubblica il sito (GitHub Actions → Pages). Nel repository: Settings → Pages → Source: **GitHub Actions**.
