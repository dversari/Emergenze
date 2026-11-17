/*
 * Nomi commerciali degli antibiotici, aggiunti tra parentesi dopo il principio attivo nei testi dell'app
 * (PDTA, algoritmi, schede, antibiotici). Se più di uno: i due più comuni in Italia.
 * Non si aggiungono se il testo ha già una parentesi subito dopo o cita già il nome commerciale lì vicino.
 * Le combinazioni vanno prima dei singoli principi attivi.
 */
export const ANTIBIOTICI_COMMERCIALI: [string, string[]][] = [
  ['amoxicillina ?(?:/|-|\\+|e) ?(?:acido )?clavulan(?:ato|ico)', ['Augmentin', 'Clavulin']],
  ['ampicillina ?(?:/|-|\\+) ?sulbactam', ['Unasyn']],
  ['piperacillina ?(?:/|-|\\+) ?tazobactam', ['Tazocin']],
  ['ceftazidima ?(?:/|-|\\+) ?avibactam', ['Zavicefta']],
  ['ceftolozano ?(?:/|-|\\+) ?tazobactam', ['Zerbaxa']],
  ['meropenem ?(?:/|-|\\+) ?vaborbactam', ['Vaborem']],
  ['imipenem ?(?:/|-|\\+) ?relebactam', ['Recarbrio']],
  ['imipenem(?: ?/ ?cilastatina)?', ['Tienam']],
  ['(?:cotrimossazolo|trimetoprim ?(?:/|-|\\+) ?sulfametossazolo)', ['Bactrim']],
  ['amoxicillina', ['Zimox', 'Velamox']],
  ['ampicillina', ['Amplital']],
  ['oxacillina', ['Penstapho']],
  ['ceftriaxone', ['Rocefin']],
  ['cefotaxime', ['Claforan']],
  ['cefazolina', ['Cefamezin']],
  ['ceftazidima', ['Glazidim']],
  ['cefepime', ['Maxipime']],
  ['cefixima', ['Cefixoral', 'Suprax']],
  ['cefale(?:x|ss)ina', ['Keforal']],
  ['ceftarolina', ['Zinforo']],
  ['ceftobiprolo', ['Mabelio']],
  ['cefiderocol', ['Fetcroja']],
  ['meropenem', ['Merrem']],
  ['ertapenem', ['Invanz']],
  ['aztreonam', ['Azactam']],
  ['vancomicina', ['Vancocina']],
  ['teicoplanina', ['Targosid']],
  ['dalbavancina', ['Xydalba']],
  ['linezolid', ['Zyvoxid']],
  ['daptomicina', ['Cubicin']],
  ['clindamicina', ['Dalacin C']],
  ['gentamicina', ['Gentalyn']],
  ['amikacina', ['BBK8']],
  ['tobramicina', ['Nebicina', 'Tobral']],
  ['azitromicina', ['Zitromax']],
  ['claritromicina', ['Klacid', 'Macladin']],
  ['eritromicina', ['Eritrocina']],
  ['doxiciclina', ['Bassado']],
  ['minociclina', ['Minocin']],
  ['tigeciclina', ['Tygacil']],
  ['ciprofloxacina', ['Ciproxin']],
  ['levofloxacina', ['Tavanic', 'Levoxacin']],
  ['moxifloxacina', ['Avalox']],
  ['metronidazolo', ['Flagyl']],
  ['fosfomicina', ['Monuril', 'Fosfocin']],
  ['nitrofurantoina', ['Neofuradantin']],
  ['rifampicina', ['Rifadin']],
  ['rifaximina', ['Normix']],
  ['colistina', ['Colimicina']],
]

const RE = new RegExp(`\\b(${ANTIBIOTICI_COMMERCIALI.map(([p]) => `(${p})`).join('|')})(?![\\w/-])(?!\\s*\\()`, 'gi')

/** Aggiunge «(Nome commerciale)» dopo ogni antibiotico citato che non ce l'ha già. */
export function conCommerciali(t: string): string {
  return t.replace(RE, (m, _tutto, ...resto) => {
    const offset = resto[resto.length - 2] as number
    const gruppi = resto.slice(0, ANTIBIOTICI_COMMERCIALI.length)
    const i = gruppi.findIndex((g) => g !== undefined)
    if (i < 0) return m
    const nomi = ANTIBIOTICI_COMMERCIALI[i][1]
    const vicino = t.slice(Math.max(0, offset - 40), offset + m.length + 40).toLowerCase()
    if (nomi.some((n) => vicino.includes(n.toLowerCase()))) return m
    return `${m} (${nomi.join(', ')})`
  })
}
