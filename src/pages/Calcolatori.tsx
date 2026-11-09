import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/*
 * Calcolatori rapidi per il pronto soccorso. Tutto gira nel browser: nessun dato
 * del paziente viene salvato o inviato. Le soglie sono quelle degli studi originali
 * o delle linee guida citate sotto ogni calcolatore.
 * Per aprirne uno direttamente: #/?apri=<id> (usato dalle linee guida).
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
    <section id={`calc-${id}`} className="card !p-0 overflow-hidden">
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
              <span className="text-xs font-bold text-tenue">+{v.punti.toLocaleString('it-IT')}</span>
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
                      {o.testo} <span className="opacity-60">{o.punti}</span>
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

  return (
    <div className="flex flex-col gap-2.5">
      <input value={cerca} onChange={(e) => setCerca(e.target.value)} placeholder="Cerca un calcolatore…"
        className="rounded-xl border border-linea px-3 py-2.5 text-base" />
      {punteggi.map((p) => (
        <CalcoloPunteggio key={p.id} p={p} aperto={aperto === p.id} onToggle={() => toggle(p.id)} />
      ))}
      {altri.map(({ id, Comp }) => <Comp key={id} aperto={aperto === id} onToggle={() => toggle(id)} />)}
      {!punteggi.length && !altri.length && <p className="text-sm text-tenue px-1">Nessun calcolatore trovato.</p>}
      <p className="text-[11px] text-tenue px-1 mt-1">I valori inseriti restano sul telefono e si cancellano chiudendo la pagina.</p>
    </div>
  )
}
