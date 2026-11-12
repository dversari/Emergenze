import { AnalisiEga } from '../components/AnalisiEga'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/*
 * Calcolatori rapidi per il pronto soccorso. Tutto gira nel browser: nessun dato
 * del paziente viene salvato o inviato. Le soglie sono quelle degli studi originali
 * o delle linee guida citate sotto ogni calcolatore.
 * Per aprirne uno direttamente: #/calcolatori?apri=<id> (usato dalle linee guida).
 */

type Livello = 'basso' | 'medio' | 'alto'
interface Esito { livello: Livello; testo: string }

interface VoceSiNo { tipo: 'si'; id: string; testo: string; punti: number }
interface VoceScelta { tipo: 'scelta'; id: string; testo: string; opzioni: { testo: string; punti: number }[] }
type Voce = VoceSiNo | VoceScelta

interface Punteggio {
  id: string
  nome: string
  ambito: string
  voci: Voce[]
  esito: (totale: number, risposte: Record<string, number>) => Esito
  fonte: string
  /** punteggio "a soglia": non è una somma ma conta se qualunque voce è presente */
  formato?: (totale: number) => string
}

const PUNTEGGI: Punteggio[] = [
  {
    id: 'nihss',
    nome: 'NIHSS',
    ambito: 'Ictus · gravità del deficit neurologico (0–42)',
    voci: [
      { tipo: 'scelta', id: '1a', testo: '1a · Livello di coscienza', opzioni: [{ testo: 'vigile', punti: 0 }, { testo: 'risvegliabile con stimoli lievi', punti: 1 }, { testo: 'solo con stimoli ripetuti o dolorosi', punti: 2 }, { testo: 'solo riflessi o areattivo', punti: 3 }] },
      { tipo: 'scelta', id: '1b', testo: '1b · Domande (mese ed età)', opzioni: [{ testo: 'entrambe giuste', punti: 0 }, { testo: 'una giusta', punti: 1 }, { testo: 'nessuna', punti: 2 }] },
      { tipo: 'scelta', id: '1c', testo: '1c · Comandi (occhi, mano)', opzioni: [{ testo: 'entrambi', punti: 0 }, { testo: 'uno', punti: 1 }, { testo: 'nessuno', punti: 2 }] },
      { tipo: 'scelta', id: '2', testo: 'Sguardo', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'paralisi parziale', punti: 1 }, { testo: 'deviazione forzata', punti: 2 }] },
      { tipo: 'scelta', id: '3', testo: 'Campo visivo', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'emianopsia parziale', punti: 1 }, { testo: 'emianopsia completa', punti: 2 }, { testo: 'bilaterale / cecità', punti: 3 }] },
      { tipo: 'scelta', id: '4', testo: 'Paralisi facciale', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'minima', punti: 1 }, { testo: 'parziale (metà inferiore)', punti: 2 }, { testo: 'completa', punti: 3 }] },
      { tipo: 'scelta', id: '5a', testo: '5a · Braccio sinistro (10 s)', opzioni: [{ testo: 'nessuno slivellamento', punti: 0 }, { testo: 'slivella', punti: 1 }, { testo: 'qualche sforzo contro gravità', punti: 2 }, { testo: 'nessuno sforzo contro gravità', punti: 3 }, { testo: 'nessun movimento', punti: 4 }] },
      { tipo: 'scelta', id: '5b', testo: '5b · Braccio destro (10 s)', opzioni: [{ testo: 'nessuno slivellamento', punti: 0 }, { testo: 'slivella', punti: 1 }, { testo: 'qualche sforzo contro gravità', punti: 2 }, { testo: 'nessuno sforzo contro gravità', punti: 3 }, { testo: 'nessun movimento', punti: 4 }] },
      { tipo: 'scelta', id: '6a', testo: '6a · Gamba sinistra (5 s)', opzioni: [{ testo: 'nessuno slivellamento', punti: 0 }, { testo: 'slivella', punti: 1 }, { testo: 'qualche sforzo contro gravità', punti: 2 }, { testo: 'nessuno sforzo contro gravità', punti: 3 }, { testo: 'nessun movimento', punti: 4 }] },
      { tipo: 'scelta', id: '6b', testo: '6b · Gamba destra (5 s)', opzioni: [{ testo: 'nessuno slivellamento', punti: 0 }, { testo: 'slivella', punti: 1 }, { testo: 'qualche sforzo contro gravità', punti: 2 }, { testo: 'nessuno sforzo contro gravità', punti: 3 }, { testo: 'nessun movimento', punti: 4 }] },
      { tipo: 'scelta', id: '7', testo: 'Atassia degli arti', opzioni: [{ testo: 'assente', punti: 0 }, { testo: 'in un arto', punti: 1 }, { testo: 'in due arti', punti: 2 }] },
      { tipo: 'scelta', id: '8', testo: 'Sensibilità', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'ridotta', punti: 1 }, { testo: 'grave o assente', punti: 2 }] },
      { tipo: 'scelta', id: '9', testo: 'Linguaggio', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'afasia lieve-moderata', punti: 1 }, { testo: 'afasia grave', punti: 2 }, { testo: 'muto / afasia globale', punti: 3 }] },
      { tipo: 'scelta', id: '10', testo: '10 · Disartria', opzioni: [{ testo: 'normale', punti: 0 }, { testo: 'lieve-moderata', punti: 1 }, { testo: 'grave', punti: 2 }] },
      { tipo: 'scelta', id: '11', testo: '11 · Estinzione / inattenzione', opzioni: [{ testo: 'assente', punti: 0 }, { testo: 'in una modalità', punti: 1 }, { testo: 'grave o in più modalità', punti: 2 }] },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: '0 · nessun deficit misurabile (non esclude ictus del circolo posteriore).' }
      : t <= 4 ? { livello: 'basso', testo: `${t} · ictus minore: trombolisi se il deficit è invalidante.` }
      : t <= 15 ? { livello: 'medio', testo: `${t} · ictus moderato${t >= 6 ? ': sospettare occlusione di grosso vaso, angio-TC e neuroradiologia' : ''}.` }
      : t <= 20 ? { livello: 'alto', testo: `${t} · moderato-grave: probabile grosso vaso, angio-TC e trombectomia.` }
      : { livello: 'alto', testo: `${t} · grave.` },
    fonte: 'NIH Stroke Scale (Brott 1989); versione italiana ISO-SPREAD',
  },
  {
    id: 'cha2ds2va',
    nome: 'CHA₂DS₂-VA',
    ambito: 'FA · rischio tromboembolico',
    voci: [
      { tipo: 'si', id: 'c', testo: 'Scompenso cardiaco o FE ridotta', punti: 1 },
      { tipo: 'si', id: 'h', testo: 'Ipertensione arteriosa', punti: 1 },
      { tipo: 'scelta', id: 'a', testo: 'Età', opzioni: [{ testo: '<65', punti: 0 }, { testo: '65-74', punti: 1 }, { testo: '≥75', punti: 2 }] },
      { tipo: 'si', id: 'd', testo: 'Diabete mellito', punti: 1 },
      { tipo: 'si', id: 's', testo: 'Ictus, TIA o tromboembolia pregressi', punti: 2 },
      { tipo: 'si', id: 'v', testo: 'Malattia vascolare (IMA, AOP, placca aortica)', punti: 1 },
    ],
    esito: (t) =>
      t >= 2 ? { livello: 'alto', testo: 'OAC raccomandata (classe I). DOAC preferiti agli AVK.' }
      : t === 1 ? { livello: 'medio', testo: 'OAC da considerare (classe IIa), decisione condivisa.' }
      : { livello: 'basso', testo: 'OAC a lungo termine non indicata. Dopo cardioversione: 4 settimane comunque.' },
    fonte: 'ESC 2024 FA. Il sesso femminile non conta più.',
  },
  {
    id: 'hasbled',
    nome: 'HAS-BLED',
    ambito: 'Rischio emorragico in OAC',
    voci: [
      { tipo: 'si', id: 'h', testo: 'Ipertensione non controllata (PAS >160)', punti: 1 },
      { tipo: 'si', id: 'r', testo: 'Insufficienza renale (dialisi, trapianto, Cr >2,26 mg/dL)', punti: 1 },
      { tipo: 'si', id: 'l', testo: 'Epatopatia (cirrosi, bilirubina >2×, transaminasi >3×)', punti: 1 },
      { tipo: 'si', id: 's', testo: 'Ictus pregresso', punti: 1 },
      { tipo: 'si', id: 'b', testo: 'Sanguinamento maggiore o predisposizione', punti: 1 },
      { tipo: 'si', id: 'i', testo: 'INR labile (TTR <60%)', punti: 1 },
      { tipo: 'si', id: 'e', testo: 'Età >65 anni', punti: 1 },
      { tipo: 'si', id: 'f', testo: 'Antiaggreganti o FANS', punti: 1 },
      { tipo: 'si', id: 'a', testo: 'Alcol ≥8 unità/settimana', punti: 1 },
    ],
    esito: (t) =>
      t >= 3 ? { livello: 'alto', testo: 'Rischio alto: correggere i fattori modificabili e seguire più da vicino. Non è un motivo per non anticoagulare.' }
      : { livello: 'basso', testo: 'Rischio non elevato. Correggere comunque i fattori modificabili.' },
    fonte: 'Pisters, Chest 2010',
  },
  {
    id: 'heart',
    nome: 'HEART',
    ambito: 'Dolore toracico',
    voci: [
      { tipo: 'scelta', id: 'h', testo: 'Storia', opzioni: [{ testo: 'Poco sospetta', punti: 0 }, { testo: 'Moderata', punti: 1 }, { testo: 'Molto sospetta', punti: 2 }] },
      { tipo: 'scelta', id: 'e', testo: 'ECG', opzioni: [{ testo: 'Normale', punti: 0 }, { testo: 'Ripolarizzazione aspecifica', punti: 1 }, { testo: 'Sottoslivellamento ST', punti: 2 }] },
      { tipo: 'scelta', id: 'a', testo: 'Età', opzioni: [{ testo: '<45', punti: 0 }, { testo: '45-64', punti: 1 }, { testo: '≥65', punti: 2 }] },
      { tipo: 'scelta', id: 'r', testo: 'Fattori di rischio', opzioni: [{ testo: 'Nessuno', punti: 0 }, { testo: '1-2', punti: 1 }, { testo: '≥3 o aterosclerosi nota', punti: 2 }] },
      { tipo: 'scelta', id: 't', testo: 'Troponina', opzioni: [{ testo: '≤ limite', punti: 0 }, { testo: '1-3× limite', punti: 1 }, { testo: '>3× limite', punti: 2 }] },
    ],
    esito: (t) =>
      t <= 3 ? { livello: 'basso', testo: 'Rischio basso: MACE a 6 settimane ~1,7%. Dimissione precoce possibile.' }
      : t <= 6 ? { livello: 'medio', testo: 'Rischio intermedio: MACE ~17%. Osservazione e test non invasivi.' }
      : { livello: 'alto', testo: 'Rischio alto: MACE ~50%. Strategia invasiva precoce.' },
    fonte: 'Backus, Int J Cardiol 2013',
  },
  {
    id: 'wells-ep',
    nome: 'Wells EP',
    ambito: 'Embolia polmonare',
    voci: [
      { tipo: 'si', id: 'tvp', testo: 'Segni clinici di TVP', punti: 3 },
      { tipo: 'si', id: 'alt', testo: "EP più probabile di un'alternativa", punti: 3 },
      { tipo: 'si', id: 'fc', testo: 'FC >100', punti: 1.5 },
      { tipo: 'si', id: 'imm', testo: 'Immobilità ≥3 giorni o chirurgia nelle 4 settimane', punti: 1.5 },
      { tipo: 'si', id: 'prec', testo: 'TVP o EP pregressa', punti: 1.5 },
      { tipo: 'si', id: 'emo', testo: 'Emottisi', punti: 1 },
      { tipo: 'si', id: 'k', testo: 'Neoplasia attiva', punti: 1 },
    ],
    esito: (t) =>
      t > 4 ? { livello: 'alto', testo: 'EP probabile: angio-TC (D-dimero non utile per escludere).' }
      : { livello: 'basso', testo: 'EP improbabile: D-dimero (soglia per età se >50 anni). Se basso rischio, valutare PERC.' },
    fonte: 'Wells, Thromb Haemost 2000 (modello a due livelli)',
    formato: (t) => t.toLocaleString('it-IT', { maximumFractionDigits: 1 }),
  },
  {
    id: 'perc',
    nome: 'PERC',
    ambito: 'Escludere EP a basso rischio',
    voci: [
      { tipo: 'si', id: 'eta', testo: 'Età ≥50', punti: 1 },
      { tipo: 'si', id: 'fc', testo: 'FC ≥100', punti: 1 },
      { tipo: 'si', id: 'sat', testo: 'SpO₂ <95% in aria', punti: 1 },
      { tipo: 'si', id: 'emo', testo: 'Emottisi', punti: 1 },
      { tipo: 'si', id: 'est', testo: 'Estrogeni', punti: 1 },
      { tipo: 'si', id: 'prec', testo: 'TVP o EP pregressa', punti: 1 },
      { tipo: 'si', id: 'gamba', testo: 'Edema monolaterale arto inferiore', punti: 1 },
      { tipo: 'si', id: 'chir', testo: 'Chirurgia o trauma con ricovero nelle 4 settimane', punti: 1 },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'PERC negativo: se il sospetto clinico è basso (<15%), nessun altro esame.' }
      : { livello: 'medio', testo: 'PERC positivo: non esclude. Procedere con D-dimero.' },
    fonte: 'Kline, J Thromb Haemost 2004',
    formato: (t) => (t === 0 ? 'neg' : `${t}/8`),
  },
  {
    id: 'spesi',
    nome: 'sPESI',
    ambito: 'EP · gravità e dimissione',
    voci: [
      { tipo: 'si', id: 'eta', testo: 'Età >80 anni', punti: 1 },
      { tipo: 'si', id: 'k', testo: 'Neoplasia', punti: 1 },
      { tipo: 'si', id: 'cp', testo: 'Scompenso o malattia polmonare cronica', punti: 1 },
      { tipo: 'si', id: 'fc', testo: 'FC ≥110', punti: 1 },
      { tipo: 'si', id: 'pas', testo: 'PAS <100 mmHg', punti: 1 },
      { tipo: 'si', id: 'sat', testo: 'SpO₂ <90%', punti: 1 },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'Basso rischio: mortalità a 30 giorni ~1%. Dimissione possibile se VD e troponina normali.' }
      : { livello: 'alto', testo: 'Rischio non basso: mortalità ~11%. Valutare VD e troponina (ESC intermedio; AHA categoria C o superiore).' },
    fonte: 'Jiménez, Arch Intern Med 2010',
  },
  {
    id: 'curb65',
    nome: 'CURB-65',
    ambito: 'Polmonite comunitaria',
    voci: [
      { tipo: 'si', id: 'c', testo: 'Confusione di nuova insorgenza', punti: 1 },
      { tipo: 'si', id: 'u', testo: 'Urea >42 mg/dL (BUN >19 mg/dL)', punti: 1 },
      { tipo: 'si', id: 'r', testo: 'FR ≥30', punti: 1 },
      { tipo: 'si', id: 'b', testo: 'PAS <90 o PAD ≤60', punti: 1 },
      { tipo: 'si', id: 'e', testo: 'Età ≥65', punti: 1 },
    ],
    esito: (t) =>
      t <= 1 ? { livello: 'basso', testo: 'Mortalità a 30 giorni ~1,5%: gestione domiciliare.' }
      : t === 2 ? { livello: 'medio', testo: 'Mortalità ~9%: ricovero breve o osservazione.' }
      : { livello: 'alto', testo: 'Mortalità ~22%: ricovero, valutare terapia intensiva se 4-5.' },
    fonte: 'Lim, Thorax 2003',
  },
  {
    id: 'gcs',
    nome: 'Glasgow Coma Scale',
    ambito: 'Stato di coscienza',
    voci: [
      { tipo: 'scelta', id: 'e', testo: 'Apertura occhi', opzioni: [{ testo: 'Nessuna', punti: 1 }, { testo: 'Al dolore', punti: 2 }, { testo: 'Alla voce', punti: 3 }, { testo: 'Spontanea', punti: 4 }] },
      { tipo: 'scelta', id: 'v', testo: 'Risposta verbale', opzioni: [{ testo: 'Nessuna', punti: 1 }, { testo: 'Suoni', punti: 2 }, { testo: 'Parole', punti: 3 }, { testo: 'Confusa', punti: 4 }, { testo: 'Orientata', punti: 5 }] },
      { tipo: 'scelta', id: 'm', testo: 'Risposta motoria', opzioni: [{ testo: 'Nessuna', punti: 1 }, { testo: 'Estensione', punti: 2 }, { testo: 'Flessione anomala', punti: 3 }, { testo: 'Retrazione', punti: 4 }, { testo: 'Localizza', punti: 5 }, { testo: 'Obbedisce', punti: 6 }] },
    ],
    esito: (t, r) => {
      const completo = ['e', 'v', 'm'].every((k) => k in r)
      if (!completo) return { livello: 'medio', testo: 'Seleziona le tre componenti.' }
      const dett = `E${r.e}V${r.v}M${r.m}`
      return t <= 8 ? { livello: 'alto', testo: `${dett} · coma grave: proteggere le vie aeree.` }
        : t <= 12 ? { livello: 'medio', testo: `${dett} · compromissione moderata.` }
        : { livello: 'basso', testo: `${dett} · compromissione lieve o assente.` }
    },
    fonte: 'Teasdale, Lancet 1974',
  },
  {
    id: 'gbs',
    nome: 'Glasgow-Blatchford',
    ambito: 'Emorragia digestiva alta · prima dell’endoscopia',
    voci: [
      { tipo: 'scelta', id: 'urea', testo: 'Urea (mg/dL)', opzioni: [{ testo: '<39', punti: 0 }, { testo: '39–47', punti: 2 }, { testo: '48–59', punti: 3 }, { testo: '60–149', punti: 4 }, { testo: '≥150', punti: 6 }] },
      { tipo: 'scelta', id: 'hb', testo: 'Emoglobina (g/dL)', opzioni: [{ testo: 'U ≥13 / D ≥12', punti: 0 }, { testo: 'U 12–12,9', punti: 1 }, { testo: 'D 10–11,9', punti: 1 }, { testo: 'U 10–11,9', punti: 3 }, { testo: '<10', punti: 6 }] },
      { tipo: 'scelta', id: 'pas', testo: 'PAS (mmHg)', opzioni: [{ testo: '≥110', punti: 0 }, { testo: '100–109', punti: 1 }, { testo: '90–99', punti: 2 }, { testo: '<90', punti: 3 }] },
      { tipo: 'si', id: 'fc', testo: 'FC ≥100', punti: 1 },
      { tipo: 'si', id: 'mel', testo: 'Melena', punti: 1 },
      { tipo: 'si', id: 'sin', testo: 'Sincope', punti: 2 },
      { tipo: 'si', id: 'epa', testo: 'Epatopatia', punti: 2 },
      { tipo: 'si', id: 'sc', testo: 'Scompenso cardiaco', punti: 2 },
    ],
    esito: (t) =>
      t <= 1 ? { livello: 'basso', testo: 'Rischio molto basso: gestione ambulatoriale con endoscopia programmata (ESGE 2021).' }
      : t <= 6 ? { livello: 'medio', testo: 'Ricovero ed endoscopia entro 24 h.' }
      : { livello: 'alto', testo: 'Alto rischio di intervento o morte: ricovero, endoscopia entro 24 h dopo stabilizzazione (prima se instabile).' },
    fonte: 'Blatchford, Lancet 2000. Urea convertita: mmol/L × 6 = mg/dL.',
  },
  {
    id: 'bisap',
    nome: 'BISAP',
    ambito: 'Pancreatite acuta · rischio di mortalità (prime 24 h)',
    voci: [
      { tipo: 'si', id: 'b', testo: 'Urea > 53 mg/dL (BUN > 25)', punti: 1 },
      { tipo: 'si', id: 'i', testo: 'Alterazione dello stato mentale (GCS < 15)', punti: 1 },
      { tipo: 'si', id: 's', testo: 'SIRS (≥ 2: T > 38 o < 36, FC > 90, FR > 20 o PaCO₂ < 32, GB > 12.000 o < 4.000)', punti: 1 },
      { tipo: 'si', id: 'a', testo: 'Età > 60 anni', punti: 1 },
      { tipo: 'si', id: 'p', testo: 'Versamento pleurico', punti: 1 },
    ],
    esito: (t) =>
      t <= 2 ? { livello: 'basso', testo: 'Mortalità < 2%.' }
      : { livello: 'alto', testo: 'Mortalità > 15% (BISAP ≥ 3): rischio di pancreatite grave, monitoraggio stretto.' },
    fonte: 'Wu, Gut 2008',
  },
  {
    id: 'ich',
    nome: 'ICH score',
    ambito: 'Emorragia cerebrale spontanea · mortalità a 30 giorni',
    voci: [
      { tipo: 'scelta', id: 'g', testo: 'GCS', opzioni: [{ testo: '13–15', punti: 0 }, { testo: '5–12', punti: 1 }, { testo: '3–4', punti: 2 }] },
      { tipo: 'si', id: 'v', testo: 'Volume ≥ 30 mL (A×B×C/2)', punti: 1 },
      { tipo: 'si', id: 'i', testo: 'Emorragia intraventricolare', punti: 1 },
      { tipo: 'si', id: 'o', testo: 'Origine sottotentoriale', punti: 1 },
      { tipo: 'si', id: 'a', testo: 'Età ≥ 80 anni', punti: 1 },
    ],
    esito: (t) => {
      const m = ['0%', '13%', '26%', '72%', '97%', '100%', '100%'][t]
      return { livello: t <= 1 ? 'basso' : t === 2 ? 'medio' : 'alto', testo: `Mortalità a 30 giorni nella coorte originale: ${m}. Non usarlo per limitare le cure nelle prime 24 h.` }
    },
    fonte: 'Hemphill, Stroke 2001',
  },
  {
    id: 'ottawa-esa',
    nome: 'Regola di Ottawa per ESA',
    ambito: 'Cefalea improvvisa · escludere l’emorragia subaracnoidea (vigili, > 15 anni, al massimo entro 1 h)',
    voci: [
      { tipo: 'si', id: 'e', testo: 'Età ≥ 40 anni', punti: 1 },
      { tipo: 'si', id: 'c', testo: 'Dolore o rigidità al collo', punti: 1 },
      { tipo: 'si', id: 'p', testo: 'Perdita di coscienza testimoniata', punti: 1 },
      { tipo: 'si', id: 's', testo: 'Esordio durante sforzo', punti: 1 },
      { tipo: 'si', id: 't', testo: 'Esordio a colpo di tuono (massimo istantaneo)', punti: 1 },
      { tipo: 'si', id: 'f', testo: 'Flessione del collo limitata alla visita', punti: 1 },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'Nessun criterio: ESA esclusa clinicamente (sensibilità ~100% nello studio di validazione).' }
      : { livello: 'alto', testo: 'Almeno un criterio: ESA non escludibile, eseguire la TC.' },
    formato: (t) => (t === 0 ? 'negativa' : 'positiva'),
    fonte: 'Perry, JAMA 2013',
  },
  {
    id: 'addrs',
    nome: 'ADD-RS',
    ambito: 'Sospetta sindrome aortica acuta · 1 punto per categoria (0–3)',
    voci: [
      { tipo: 'si', id: 'c', testo: 'Condizioni ad alto rischio: Marfan/connettivopatia, familiarità, valvulopatia aortica, manipolazione aortica recente, aneurisma toracico noto', punti: 1 },
      { tipo: 'si', id: 'd', testo: 'Dolore ad alto rischio: improvviso, intenso, lacerante', punti: 1 },
      { tipo: 'si', id: 'e', testo: 'Esame ad alto rischio: deficit di polso o differenza di PAS, deficit neurologico con dolore, soffio nuovo di insufficienza aortica, ipotensione/shock', punti: 1 },
    ],
    esito: (t) =>
      t <= 1 ? { livello: t === 0 ? 'basso' : 'medio', testo: 'Probabilità bassa: D-dimero (< 500 ng/mL con ADD-RS ≤ 1 rende improbabile la sindrome aortica) ed eco.' }
      : { livello: 'alto', testo: 'Probabilità alta: angio-TC aorta subito.' },
    fonte: 'ESC 2024; Nazerian, Circulation 2018 (ADvISED)',
  },
  {
    id: 'ciwa',
    nome: 'CIWA-Ar',
    ambito: 'Astinenza alcolica · gravità',
    voci: [
      { tipo: 'scelta', id: 'n', testo: 'Nausea/vomito (0 nessuno … 7 continui)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 't', testo: 'Tremore (0 assente … 7 grave anche a braccia ferme)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 's', testo: 'Sudorazione (0 … 7 profusa)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'a', testo: 'Ansia (0 … 7 attacco di panico)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'g', testo: 'Agitazione (0 … 7 si muove continuamente)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'ta', testo: 'Disturbi tattili (formicolii, insetti) (0 … 7)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'u', testo: 'Disturbi uditivi (0 … 7 allucinazioni continue)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'v', testo: 'Disturbi visivi (luce, allucinazioni) (0 … 7)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'c', testo: 'Cefalea, testa stretta (0 … 7)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }, { testo: '5', punti: 5 }, { testo: '6', punti: 6 }, { testo: '7', punti: 7 }] },
      { tipo: 'scelta', id: 'o', testo: 'Orientamento (0 orientato … 4 disorientato su luogo/persona)', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '2', punti: 2 }, { testo: '3', punti: 3 }, { testo: '4', punti: 4 }] },
    ],
    esito: (t) =>
      t < 10 ? { livello: 'basso', testo: 'Lieve (< 10): niente benzodiazepine, ricontrollo ogni 4 h.' }
      : t < 19 ? { livello: 'medio', testo: 'Moderata (10–18): diazepam (Valium) 10–20 mg, ricontrollo ogni 1–2 h.' }
      : { livello: 'alto', testo: 'Grave (≥ 19): diazepam ripetuto, monitoraggio stretto, valutare terapia intensiva.' },
    fonte: 'Sullivan, Br J Addict 1989; ASAM 2020',
  },
  {
    id: '4at',
    nome: '4AT',
    ambito: 'Delirium · screening',
    voci: [
      { tipo: 'scelta', id: 'v', testo: 'Vigilanza', opzioni: [{ testo: 'Normale', punti: 0 }, { testo: 'Alterata', punti: 4 }] },
      { tipo: 'scelta', id: 'a', testo: 'AMT4 (età, data di nascita, luogo, anno): errori', opzioni: [{ testo: '0', punti: 0 }, { testo: '1', punti: 1 }, { testo: '≥ 2 o non testabile', punti: 2 }] },
      { tipo: 'scelta', id: 'm', testo: 'Mesi dell’anno a ritroso', opzioni: [{ testo: '≥ 7 corretti', punti: 0 }, { testo: '< 7 o rifiuta', punti: 1 }, { testo: 'Non testabile', punti: 2 }] },
      { tipo: 'scelta', id: 'c', testo: 'Cambiamento acuto o decorso fluttuante', opzioni: [{ testo: 'No', punti: 0 }, { testo: 'Sì', punti: 4 }] },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'Delirium o deficit cognitivo grave improbabili.' }
      : t < 4 ? { livello: 'medio', testo: '1–3: possibile deficit cognitivo; approfondire.' }
      : { livello: 'alto', testo: '≥ 4: possibile delirium ± deficit cognitivo; cercare la causa.' },
    fonte: 'Bellelli, Age Ageing 2014; NICE CG103',
  },
  {
    id: 'csrs',
    nome: 'Canadian Syncope Risk Score',
    ambito: 'Sincope · rischio di eventi gravi a 30 giorni',
    voci: [
      { tipo: 'si', id: 'p', testo: 'Predisposizione vasovagale (caldo, folla, in piedi a lungo, paura, dolore)', punti: -1 },
      { tipo: 'si', id: 'h', testo: 'Cardiopatia nota', punti: 1 },
      { tipo: 'si', id: 'b', testo: 'PAS < 90 o > 180 in PS', punti: 2 },
      { tipo: 'si', id: 't', testo: 'Troponina > 99° percentile', punti: 2 },
      { tipo: 'si', id: 'x', testo: 'Asse QRS anomalo (< −30° o > 100°)', punti: 1 },
      { tipo: 'si', id: 'q', testo: 'QRS > 130 ms', punti: 1 },
      { tipo: 'si', id: 'qt', testo: 'QTc > 480 ms', punti: 2 },
      { tipo: 'scelta', id: 'd', testo: 'Diagnosi in PS', opzioni: [{ testo: 'Altra', punti: 0 }, { testo: 'Vasovagale', punti: -2 }, { testo: 'Cardiaca', punti: 2 }] },
    ],
    esito: (t) =>
      t <= -2 ? { livello: 'basso', testo: 'Rischio molto basso a 30 giorni: dimissione.' }
      : t <= 0 ? { livello: 'basso', testo: 'Rischio basso: dimissione con controllo.' }
      : t <= 3 ? { livello: 'medio', testo: 'Rischio medio: osservazione con monitor, percorso rapido.' }
      : { livello: 'alto', testo: t <= 5 ? 'Rischio alto: ricovero/monitor.' : 'Rischio molto alto: ricovero con monitor.' },
    fonte: 'Thiruganasambandamoorthy, CMAJ 2016',
  },
  {
    id: 'twist',
    nome: 'TWIST',
    ambito: 'Scroto acuto · rischio di torsione del testicolo',
    voci: [
      { tipo: 'si', id: 'g', testo: 'Testicolo gonfio', punti: 2 },
      { tipo: 'si', id: 'd', testo: 'Testicolo duro', punti: 2 },
      { tipo: 'si', id: 'c', testo: 'Riflesso cremasterico assente', punti: 1 },
      { tipo: 'si', id: 'n', testo: 'Nausea o vomito', punti: 1 },
      { tipo: 'si', id: 'a', testo: 'Testicolo alto', punti: 1 },
    ],
    esito: (t) =>
      t <= 2 ? { livello: 'basso', testo: 'Rischio basso (0–2): ecodoppler; torsione improbabile ma non esclusa.' }
      : t <= 4 ? { livello: 'medio', testo: 'Rischio intermedio (3–4): ecodoppler urgente e urologo.' }
      : { livello: 'alto', testo: 'Rischio alto (≥ 5): urologo subito per esplorazione, senza aspettare l’ecografia.' },
    fonte: 'Barbosa, J Urol 2013 (validato soprattutto in età pediatrica)',
  },
  {
    id: 'abcd2',
    nome: 'ABCD²',
    ambito: 'TIA · rischio di ictus a 2 giorni (non usarlo da solo per dimettere)',
    voci: [
      { tipo: 'si', id: 'a', testo: 'Età ≥ 60 anni', punti: 1 },
      { tipo: 'si', id: 'b', testo: 'PA ≥ 140/90 alla prima misurazione', punti: 1 },
      { tipo: 'scelta', id: 'c', testo: 'Clinica', opzioni: [{ testo: 'Altro', punti: 0 }, { testo: 'Disturbo del linguaggio senza deficit motorio', punti: 1 }, { testo: 'Deficit motorio unilaterale', punti: 2 }] },
      { tipo: 'scelta', id: 'd', testo: 'Durata', opzioni: [{ testo: '< 10 min', punti: 0 }, { testo: '10–59 min', punti: 1 }, { testo: '≥ 60 min', punti: 2 }] },
      { tipo: 'si', id: 'e', testo: 'Diabete', punti: 1 },
    ],
    esito: (t) =>
      t <= 3 ? { livello: 'basso', testo: 'Rischio basso (≈1% a 2 giorni): comunque accertamenti entro 24 h; FA e stenosi carotidea cambiano tutto.' }
      : t <= 5 ? { livello: 'medio', testo: 'Rischio moderato (≈4% a 2 giorni): doppia antiaggregazione per 21 giorni se non cardioembolico.' }
      : { livello: 'alto', testo: 'Rischio alto (≈8% a 2 giorni): doppia antiaggregazione, valutazione specialistica immediata.' },
    fonte: 'Johnston, Lancet 2007; ESO 2021',
  },
  {
    id: 'hacor',
    nome: 'HACOR (NIV nell’ipossiemico)',
    ambito: 'NIV · a 1 ora dall’inizio: rischio di fallimento nell’insufficienza ipossiemica',
    voci: [
      { tipo: 'scelta', id: 'h', testo: 'Frequenza cardiaca', opzioni: [{ testo: '≤ 120', punti: 0 }, { testo: '≥ 121', punti: 1 }] },
      { tipo: 'scelta', id: 'a', testo: 'pH', opzioni: [{ testo: '≥ 7,35', punti: 0 }, { testo: '7,30–7,34', punti: 2 }, { testo: '7,25–7,29', punti: 3 }, { testo: '< 7,25', punti: 4 }] },
      { tipo: 'scelta', id: 'c', testo: 'GCS', opzioni: [{ testo: '15', punti: 0 }, { testo: '13–14', punti: 2 }, { testo: '11–12', punti: 5 }, { testo: '≤ 10', punti: 10 }] },
      { tipo: 'scelta', id: 'o', testo: 'PaO₂/FiO₂', opzioni: [{ testo: '≥ 201', punti: 0 }, { testo: '176–200', punti: 2 }, { testo: '151–175', punti: 3 }, { testo: '126–150', punti: 4 }, { testo: '101–125', punti: 5 }, { testo: '≤ 100', punti: 6 }] },
      { tipo: 'scelta', id: 'r', testo: 'Frequenza respiratoria', opzioni: [{ testo: '≤ 30', punti: 0 }, { testo: '31–35', punti: 1 }, { testo: '36–40', punti: 2 }, { testo: '41–45', punti: 3 }, { testo: '≥ 46', punti: 4 }] },
    ],
    esito: (t) =>
      t <= 5 ? { livello: 'basso', testo: 'HACOR ≤ 5: rischio di fallimento basso; continuare la NIV con rivalutazione.' }
      : { livello: 'alto', testo: 'HACOR > 5 a 1 ora: fallimento molto probabile (>80% nello studio originale): anticipare l’intubazione se indicata.' },
    fonte: 'Duan et al., Intensive Care Med 2017',
  },
  {
    id: 'plasmic',
    nome: 'PLASMIC',
    ambito: 'Microangiopatia trombotica · probabilità di PTT (ADAMTS-13 < 10%)',
    voci: [
      { tipo: 'si', id: 'p', testo: 'Piastrine < 30.000', punti: 1 },
      { tipo: 'si', id: 'h', testo: 'Emolisi (reticolociti > 2,5%, aptoglobina non dosabile o bilirubina indiretta > 2 mg/dL)', punti: 1 },
      { tipo: 'si', id: 'c', testo: 'NO neoplasia attiva nell’ultimo anno', punti: 1 },
      { tipo: 'si', id: 't', testo: 'NO trapianto d’organo o di midollo', punti: 1 },
      { tipo: 'si', id: 'm', testo: 'MCV < 90 fL', punti: 1 },
      { tipo: 'si', id: 'i', testo: 'INR < 1,5', punti: 1 },
      { tipo: 'si', id: 'k', testo: 'Creatinina < 2,0 mg/dL', punti: 1 },
    ],
    esito: (t) =>
      t <= 4 ? { livello: 'basso', testo: 'Rischio basso (0–4%) di deficit grave di ADAMTS-13: cercare altre cause di MAT.' }
      : t === 5 ? { livello: 'medio', testo: 'Rischio intermedio (5–24%): ematologo, ADAMTS-13 urgente.' }
      : { livello: 'alto', testo: 'Rischio alto (62–82%): PTT probabile, plasmaferesi urgente dopo il prelievo per ADAMTS-13.' },
    fonte: 'Bendapudi et al., Lancet Haematol 2017',
  },
  {
    id: 'isth-dic',
    nome: 'ISTH DIC',
    ambito: 'CID conclamata · solo se c’è una causa predisponente',
    voci: [
      { tipo: 'scelta', id: 'p', testo: 'Piastrine', opzioni: [{ testo: '≥ 100.000', punti: 0 }, { testo: '50–100.000', punti: 1 }, { testo: '< 50.000', punti: 2 }] },
      { tipo: 'scelta', id: 'd', testo: 'D-dimero', opzioni: [{ testo: 'Normale', punti: 0 }, { testo: 'Aumento moderato', punti: 2 }, { testo: 'Aumento marcato', punti: 3 }] },
      { tipo: 'scelta', id: 't', testo: 'PT prolungato', opzioni: [{ testo: '< 3 s', punti: 0 }, { testo: '3–6 s', punti: 1 }, { testo: '> 6 s', punti: 2 }] },
      { tipo: 'scelta', id: 'f', testo: 'Fibrinogeno', opzioni: [{ testo: '> 1 g/L', punti: 0 }, { testo: '≤ 1 g/L', punti: 1 }] },
    ],
    esito: (t) =>
      t >= 5 ? { livello: 'alto', testo: 'Compatibile con CID conclamata: trattare la causa, ripetere il punteggio ogni giorno.' }
      : { livello: 'basso', testo: 'Non suggestivo di CID conclamata (possibile fase precoce): ripetere in 24–48 h.' },
    fonte: 'Taylor et al., Thromb Haemost 2001 (ISTH); ISTH 2025: D-dimero > 3× = 2 punti, > 7× = 3 punti',
  },
  {
    id: 'nexus',
    nome: 'NEXUS (rachide cervicale)',
    ambito: 'Trauma · serve l’imaging del rachide cervicale? Basso rischio solo se TUTTI assenti',
    voci: [
      { tipo: 'si', id: 'd', testo: 'Dolorabilità sulla linea mediana posteriore del collo', punti: 1 },
      { tipo: 'si', id: 'n', testo: 'Deficit neurologico focale', punti: 1 },
      { tipo: 'si', id: 'v', testo: 'Vigilanza alterata (GCS < 15, disorientato, risposta lenta)', punti: 1 },
      { tipo: 'si', id: 'i', testo: 'Intossicazione (alcol, droghe)', punti: 1 },
      { tipo: 'si', id: 'l', testo: 'Lesione dolorosa che distrae (frattura di un osso lungo, ustione estesa…)', punti: 1 },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'Nessun criterio: rachide cervicale clinicamente escluso, niente imaging, si toglie il collare.' }
      : { livello: 'alto', testo: 'Almeno un criterio: imaging del rachide cervicale (TC negli adulti).' },
    formato: (t) => (t === 0 ? 'neg' : 'pos'),
    fonte: 'Hoffman, N Engl J Med 2000',
  },
  {
    id: 'ccsr',
    nome: 'Canadian C-spine rule',
    ambito: 'Trauma · adulto vigile (GCS 15) e stabile: serve l’imaging cervicale?',
    voci: [
      { tipo: 'si', id: 'a1', testo: '1 · ALTO rischio: età ≥ 65 anni', punti: 0 },
      { tipo: 'si', id: 'a2', testo: '1 · ALTO rischio: dinamica pericolosa (caduta da ≥ 1 m o 5 scalini, carico assiale sul capo, incidente ad alta velocità > 100 km/h, ribaltamento o sbalzato fuori, veicolo a motore ricreativo, collisione in bicicletta)', punti: 0 },
      { tipo: 'si', id: 'a3', testo: '1 · ALTO rischio: parestesie alle estremità', punti: 0 },
      { tipo: 'si', id: 'b1', testo: '2 · BASSO rischio: tamponamento semplice', punti: 0 },
      { tipo: 'si', id: 'b2', testo: '2 · BASSO rischio: seduto in PS', punti: 0 },
      { tipo: 'si', id: 'b3', testo: '2 · BASSO rischio: ha camminato in qualsiasi momento', punti: 0 },
      { tipo: 'si', id: 'b4', testo: '2 · BASSO rischio: dolore al collo comparso dopo, non subito', punti: 0 },
      { tipo: 'si', id: 'b5', testo: '2 · BASSO rischio: nessuna dolorabilità sulla linea mediana', punti: 0 },
      { tipo: 'si', id: 'c', testo: '3 · Ruota attivamente il collo di 45° a destra E a sinistra', punti: 0 },
    ],
    esito: (_t, r) => {
      const alto = ['a1', 'a2', 'a3'].some((k) => k in r)
      const basso = ['b1', 'b2', 'b3', 'b4', 'b5'].some((k) => k in r)
      if (alto) return { livello: 'alto', testo: 'Fattore ad alto rischio: imaging del rachide cervicale.' }
      if (!basso) return { livello: 'alto', testo: 'Nessun fattore a basso rischio che permetta di testare il movimento: imaging.' }
      if (!('c' in r)) return { livello: 'medio', testo: 'Fattore a basso rischio presente: chiedi di ruotare il collo di 45° per lato. Se non ci riesce: imaging.' }
      return { livello: 'basso', testo: 'Ruota il collo senza problemi: niente imaging.' }
    },
    formato: () => '→',
    fonte: 'Stiell, JAMA 2001 (non vale se GCS < 15, instabile, < 16 anni, deficit acuti, malattia vertebrale nota)',
  },
  {
    id: 'ccthr',
    nome: 'Canadian CT Head Rule',
    ambito: 'Trauma cranico con GCS 13–15 e perdita di coscienza, amnesia o disorientamento: serve la TC?',
    voci: [
      { tipo: 'si', id: 'h1', testo: 'ALTO: GCS < 15 a 2 ore dal trauma', punti: 10 },
      { tipo: 'si', id: 'h2', testo: 'ALTO: sospetta frattura aperta o affondata del cranio', punti: 10 },
      { tipo: 'si', id: 'h3', testo: 'ALTO: segni di frattura della base (emotimpano, occhi di procione, otoliquorrea o rinoliquorrea, segno di Battle)', punti: 10 },
      { tipo: 'si', id: 'h4', testo: 'ALTO: vomito ≥ 2 episodi', punti: 10 },
      { tipo: 'si', id: 'h5', testo: 'ALTO: età ≥ 65 anni', punti: 10 },
      { tipo: 'si', id: 'm1', testo: 'MEDIO: amnesia retrograda (prima dell’impatto) ≥ 30 minuti', punti: 1 },
      { tipo: 'si', id: 'm2', testo: 'MEDIO: dinamica pericolosa (pedone investito, sbalzato dal veicolo, caduta da > 1 m o 5 scalini)', punti: 1 },
    ],
    esito: (t) =>
      t >= 10 ? { livello: 'alto', testo: 'Alto rischio di intervento neurochirurgico: TC.' }
      : t > 0 ? { livello: 'medio', testo: 'Rischio medio di lesione alla TC: TC.' }
      : { livello: 'basso', testo: 'Nessun criterio: TC non necessaria per la regola (verificare comunque il PDTA aziendale).' },
    formato: (t) => (t >= 10 ? 'alto' : t > 0 ? 'medio' : 'basso'),
    fonte: 'Stiell, Lancet 2001 (non vale in anticoagulati, convulsioni, < 16 anni)',
  },
  {
    id: 'nexus2',
    nome: 'NEXUS II (TC cranio)',
    ambito: 'Trauma cranico: TC se almeno un criterio',
    voci: [
      { tipo: 'si', id: 'f', testo: 'Segni di frattura cranica significativa', punti: 1 },
      { tipo: 'si', id: 's', testo: 'Ematoma del cuoio capelluto', punti: 1 },
      { tipo: 'si', id: 'n', testo: 'Deficit neurologico', punti: 1 },
      { tipo: 'si', id: 'v', testo: 'Vigilanza alterata', punti: 1 },
      { tipo: 'si', id: 'b', testo: 'Comportamento anomalo', punti: 1 },
      { tipo: 'si', id: 'c', testo: 'Coagulopatia (anche terapia anticoagulante)', punti: 1 },
      { tipo: 'si', id: 'p', testo: 'Vomito persistente', punti: 1 },
      { tipo: 'si', id: 'e', testo: 'Età ≥ 65 anni', punti: 1 },
    ],
    esito: (t) =>
      t === 0 ? { livello: 'basso', testo: 'Nessun criterio: rischio molto basso di lesione intracranica significativa.' }
      : { livello: 'alto', testo: 'Almeno un criterio: TC cranio.' },
    formato: (t) => (t === 0 ? 'neg' : 'pos'),
    fonte: 'Mower, J Trauma 2005',
  },
]

// ─── Componenti ───────────────────────────────────────────────────────────────

const coloreEsito: Record<Livello, string> = {
  basso: 'bg-verde3 text-verde-scuro border-verde2/40',
  medio: 'bg-oro3 text-oro border-oro2/50',
  alto: 'bg-bordeaux3 text-bordeaux border-bordeaux2/40',
}

function Scheda({ id, nome, ambito, aperto, onToggle, riassunto, livello, children }: {
  id: string; nome: string; ambito: string; aperto: boolean; onToggle: () => void
  riassunto?: string; livello?: Livello; children: React.ReactNode
}) {
  return (
    <section id={`calc-${id}`} className="card !p-0 overflow-hidden scroll-mt-24">
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <div className="flex-1 min-w-0">
          <p className="font-bold leading-tight">{nome}</p>
          <p className="text-xs text-tenue truncate">{ambito}</p>
        </div>
        {riassunto && (
          <span className={`shrink-0 text-sm font-extrabold px-2.5 py-0.5 rounded-full border ${livello ? coloreEsito[livello] : 'border-linea text-tenue'}`}>
            {riassunto}
          </span>
        )}
        <span className={`text-tenue transition-transform ${aperto ? 'rotate-90' : ''}`}>›</span>
      </button>
      {aperto && <div className="px-4 pb-4 border-t border-linea pt-3">{children}</div>}
    </section>
  )
}

function CalcoloPunteggio({ p, aperto, onToggle }: { p: Punteggio; aperto: boolean; onToggle: () => void }) {
  const [risposte, setRisposte] = useState<Record<string, number>>({})
  const totale = Object.values(risposte).reduce((a, b) => a + b, 0)
  const esito = p.esito(totale, risposte)
  const toccato = Object.keys(risposte).length > 0
  const mostra = p.formato ? p.formato(totale) : String(totale)

  const imposta = (id: string, v: number | null) =>
    setRisposte((r) => {
      const n = { ...r }
      if (v === null) delete n[id]
      else n[id] = v
      return n
    })

  return (
    <Scheda id={p.id} nome={p.nome} ambito={p.ambito} aperto={aperto} onToggle={onToggle}
      riassunto={toccato ? mostra : undefined} livello={toccato ? esito.livello : undefined}>
      <div className="flex flex-col gap-1.5">
        {p.voci.map((v) =>
          v.tipo === 'si' ? (
            <label key={v.id} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border cursor-pointer select-none transition-colors ${
              v.id in risposte ? 'bg-verde3 border-verde2/50' : 'bg-white border-linea'}`}>
              <input type="checkbox" className="w-5 h-5 accent-[#2f6652]" checked={v.id in risposte}
                onChange={(e) => imposta(v.id, e.target.checked ? v.punti : null)} />
              <span className="flex-1 text-sm">{v.testo}</span>
              <span className="text-xs font-bold text-tenue">{v.punti > 0 ? '+' : ''}{v.punti.toLocaleString('it-IT')}</span>
            </label>
          ) : (
            <div key={v.id} className="rounded-xl px-3 py-2 border border-linea bg-white">
              <p className="text-sm mb-1.5">{v.testo}</p>
              <div className="flex flex-wrap gap-1">
                {v.opzioni.map((o) => {
                  const sel = risposte[v.id] === o.punti
                  return (
                    <button key={o.testo} onClick={() => imposta(v.id, sel ? null : o.punti)}
                      className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border transition-colors ${
                        sel ? 'bg-verde text-white border-verde' : 'bg-sabbia border-linea text-testo'}`}>
                      {o.testo}{o.testo !== String(o.punti) && <span className="opacity-60"> {o.punti}</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          ),
        )}
      </div>
      <div className={`mt-3 rounded-xl border px-3 py-2.5 ${coloreEsito[esito.livello]}`}>
        <p className="text-sm"><span className="font-extrabold text-lg mr-1.5">{mostra}</span>{esito.testo}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] text-tenue">{p.fonte}</p>
        {toccato && <button onClick={() => setRisposte({})} className="text-xs font-semibold text-tenue underline">Azzera</button>}
      </div>
    </Scheda>
  )
}

const num = (s: string) => {
  const v = parseFloat(s.replace(',', '.'))
  return Number.isFinite(v) ? v : null
}
const f1 = (v: number) => v.toLocaleString('it-IT', { maximumFractionDigits: 1 })

function Campo({ etichetta, unita, valore, onChange }: { etichetta: string; unita: string; valore: string; onChange: (s: string) => void }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="etichetta">{etichetta}</span>
      <span className="flex items-center gap-1.5">
        <input inputMode="decimal" value={valore} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-linea px-3 py-2 text-base font-semibold" />
        <span className="text-xs text-tenue shrink-0 w-12">{unita}</span>
      </span>
    </label>
  )
}

function Risultato({ etichetta, valore, nota }: { etichetta: string; valore: string; nota?: string }) {
  return (
    <div className="rounded-xl bg-sabbia border border-linea px-3 py-2">
      <p className="etichetta">{etichetta}</p>
      <p className="valore !text-xl">{valore}</p>
      {nota && <p className="text-[11px] text-tenue">{nota}</p>}
    </div>
  )
}

function CockcroftGault({ aperto, onToggle }: { aperto: boolean; onToggle: () => void }) {
  const [eta, setEta] = useState('')
  const [peso, setPeso] = useState('')
  const [cr, setCr] = useState('')
  const [donna, setDonna] = useState(false)
  const e = num(eta), p = num(peso), c = num(cr)
  const clcr = e && p && c ? ((140 - e) * p) / (72 * c) * (donna ? 0.85 : 1) : null
  return (
    <Scheda id="cockcroft" nome="Clearance creatinina" ambito="Cockcroft-Gault · dosaggio DOAC e farmaci"
      aperto={aperto} onToggle={onToggle} riassunto={clcr ? `${Math.round(clcr)} mL/min` : undefined}
      livello={clcr ? (clcr < 30 ? 'alto' : clcr < 50 ? 'medio' : 'basso') : undefined}>
      <div className="grid grid-cols-3 gap-2">
        <Campo etichetta="Età" unita="anni" valore={eta} onChange={setEta} />
        <Campo etichetta="Peso" unita="kg" valore={peso} onChange={setPeso} />
        <Campo etichetta="Creatinina" unita="mg/dL" valore={cr} onChange={setCr} />
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm">
        <input type="checkbox" className="w-5 h-5 accent-[#2f6652]" checked={donna} onChange={(ev) => setDonna(ev.target.checked)} />
        Donna (×0,85)
      </label>
      {clcr !== null && <div className="mt-3"><Risultato etichetta="CrCl" valore={`${f1(clcr)} mL/min`} nota="Peso reale, come negli studi registrativi dei DOAC." /></div>}
    </Scheda>
  )
}

function Elettroliti({ aperto, onToggle }: { aperto: boolean; onToggle: () => void }) {
  const [v, setV] = useState({ na: '', cl: '', hco3: '', alb: '', glu: '', ca: '' })
  const s = (k: keyof typeof v) => (x: string) => setV((o) => ({ ...o, [k]: x }))
  const na = num(v.na), cl = num(v.cl), hco3 = num(v.hco3), alb = num(v.alb), glu = num(v.glu), ca = num(v.ca)
  const gap = na !== null && cl !== null && hco3 !== null ? na - cl - hco3 : null
  const gapCorr = gap !== null && alb !== null ? gap + 2.5 * (4 - alb) : null
  const naCorr = na !== null && glu !== null && glu > 100 ? na + 1.6 * (glu - 100) / 100 : null
  const caCorr = ca !== null && alb !== null ? ca + 0.8 * (4 - alb) : null
  return (
    <Scheda id="elettroliti" nome="Gap anionico, Na e Ca corretti" ambito="Emogasanalisi ed elettroliti" aperto={aperto} onToggle={onToggle}
      riassunto={gap !== null ? `AG ${f1(gapCorr ?? gap)}` : undefined}
      livello={gap !== null ? ((gapCorr ?? gap) > 12 ? 'alto' : 'basso') : undefined}>
      <div className="grid grid-cols-3 gap-2">
        <Campo etichetta="Na" unita="mEq/L" valore={v.na} onChange={s('na')} />
        <Campo etichetta="Cl" unita="mEq/L" valore={v.cl} onChange={s('cl')} />
        <Campo etichetta="HCO₃" unita="mEq/L" valore={v.hco3} onChange={s('hco3')} />
        <Campo etichetta="Albumina" unita="g/dL" valore={v.alb} onChange={s('alb')} />
        <Campo etichetta="Glicemia" unita="mg/dL" valore={v.glu} onChange={s('glu')} />
        <Campo etichetta="Calcio" unita="mg/dL" valore={v.ca} onChange={s('ca')} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {gap !== null && <Risultato etichetta="Gap anionico" valore={f1(gap)} nota="Normale 8-12 (senza K)" />}
        {gapCorr !== null && <Risultato etichetta="AG corretto per albumina" valore={f1(gapCorr)} nota="+2,5 per ogni g/dL sotto 4" />}
        {naCorr !== null && <Risultato etichetta="Na corretto per glicemia" valore={f1(naCorr)} nota="Katz 1,6; con Hillier (2,4) è più alto" />}
        {caCorr !== null && <Risultato etichetta="Ca corretto per albumina" valore={f1(caCorr)} nota="Meglio il Ca ionizzato se disponibile" />}
      </div>
    </Scheda>
  )
}

// ─── Pagina ──────────────────────────────────────────────────────────────────

const ALTRI = [
  { id: 'cockcroft', nome: 'Clearance creatinina Cockcroft-Gault DOAC', Comp: CockcroftGault },
  { id: 'elettroliti', nome: 'Gap anionico sodio calcio corretto albumina glicemia emogas', Comp: Elettroliti },
]

export default function EmergenzeCalcolatori() {
  const [params] = useSearchParams()
  const [aperto, setAperto] = useState<string | null>(params.get('apri'))
  const [cerca, setCerca] = useState('')
  const q = cerca.trim().toLowerCase()

  const punteggi = useMemo(
    () => PUNTEGGI.filter((p) => !q || `${p.nome} ${p.ambito}`.toLowerCase().includes(q)),
    [q],
  )
  const altri = ALTRI.filter((a) => !q || a.nome.toLowerCase().includes(q))
  const toggle = (id: string) => setAperto((a) => (a === id ? null : id))
  useEffect(() => {
    const id = params.get('apri')
    if (id) setAperto(id)
    if (id) requestAnimationFrame(() => document.getElementById(`calc-${id}`)?.scrollIntoView({ block: 'start' }))
  }, [params])

  const [ega, setEga] = useState(params.get('apri') === 'ega')
  return (
    <div className="elenco">
      {ega && <AnalisiEga chiudi={() => setEga(false)} />}
      <button onClick={() => { setAperto('nihss'); requestAnimationFrame(() => document.getElementById('calc-nihss')?.scrollIntoView({ behavior: 'smooth', block: 'start' })) }}
        className="intero relative overflow-hidden rounded-2xl border border-[#e2bcbc] bg-[#f6e3e3] p-4 text-left shadow-[var(--shadow-card)] active:scale-[0.99] transition-transform">
        <span className="absolute -right-1 -bottom-5 text-[90px] leading-none opacity-10">🧠</span>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-bordeaux">In evidenza · ictus</p>
        <p className="text-xl font-black text-[#6e2f2f]">NIHSS</p>
        <p className="text-[13px] text-tenue">15 voci, punto per punto, con il totale e cosa significa</p>
      </button>
      <button onClick={() => setEga(true)} className="intero group relative overflow-hidden rounded-2xl bg-[#1f2b26] p-4 text-left text-white shadow-[var(--shadow-card)] active:scale-[0.99] transition-transform">
        <svg viewBox="0 0 200 60" className="absolute right-0 top-0 h-full w-1/2 opacity-30" aria-hidden>
          <path d="M0 40 L30 40 L40 12 L52 52 L62 30 L90 30 L100 18 L112 44 L124 30 L200 30" fill="none" stroke="#9fd3b5" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9fd3b5]">In evidenza · algoritmo</p>
        <p className="text-xl font-black">Analisi EGA</p>
        <p className="text-[13px] text-white/75">pH → disturbo primario → compenso → anion gap → delta ratio → cause → ossigenazione</p>
      </button>
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca un calcolatore…"
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {punteggi.map((p) => (
        <CalcoloPunteggio key={p.id} p={p} aperto={aperto === p.id} onToggle={() => toggle(p.id)} />
      ))}
      {altri.map(({ id, Comp }) => <Comp key={id} aperto={aperto === id} onToggle={() => toggle(id)} />)}
      {!punteggi.length && !altri.length && <p className="intero text-sm text-tenue px-1">Nessun calcolatore trovato.</p>}
      <p className="intero text-[11px] text-tenue px-1 mt-1">I valori inseriti restano sul telefono e si cancellano chiudendo la pagina.</p>
    </div>
  )
}
