/** Sequenze illustrate di vestizione e svestizione con DPI NBCR (figure ritagliate dalle schede del PS). */
const base = import.meta.env.BASE_URL

export const VESTIZIONE = [
  ['Monili', 'Togliere anelli, orologio, braccialetti, collane.'],
  ['Igiene', 'Lavare accuratamente le mani.'],
  ['Calzature', 'Togliere le scarpe da lavoro.'],
  ['Tuta (parte inferiore)', 'Indossare la tuta NBCR dal basso, con i calzari integrati, fino alla vita.'],
  ['Stivali', 'Stivali sopra i calzari; risvoltare le fasce sovrastivale a copertura.'],
  ['Primo paio di guanti', 'Guanti monouso a manichetta lunga; poi infilare le braccia nelle maniche della tuta.'],
  ['Anelli / fissaggio', 'Fissare gli anelli di ritenzione sopra i guanti (oppure nastrare la manica).'],
  ['Maschera e tenuta', 'Maschera pieno facciale senza filtro; stringere la bardatura; prova di tenuta: chiudere il bocchettone con la mano e inspirare.'],
  ['Cappuccio e cerniera', 'Cappuccio sul bordo della maschera; chiudere la cerniera fino sotto il mento.'],
  ['Sigillatura maschera', 'Nastro telato su tutti i punti di giunzione tra maschera e cappuccio, gola compresa.'],
  ['Secondo paio di guanti', 'Guanti NBCR esterni, sigillati alla tuta con nastro telato.'],
  ['Filtro', 'Verificare l’integrità del filtro NBCR, scartarlo e avvitarlo alla maschera.'],
] as const

export const SVESTIZIONE = [
  ['Nastro telato', 'Togliere il nastro (contorno del volto e dei guanti esterni) → contenitore dei rifiuti.'],
  ['Stivali', 'Togliere gli stivali e metterli nel contenitore ermetico per la decontaminazione.'],
  ['Cerniera', 'Aprire la cerniera della tuta fino a fine corsa.'],
  ['Cappuccio', 'Togliere il cappuccio pizzicandolo all’apice della nuca e portandolo indietro.'],
  ['Guanti esterni', 'Srotolarli dall’interno verso l’esterno senza toccare il guanto sotto → rifiuti.'],
  ['Spalle e braccia', 'Estrarre spalle e braccia rivoltando la tuta dall’interno verso l’esterno.'],
  ['Braccia', 'Sfilare entrambe le braccia.'],
  ['Gambe e tuta', 'Estrarre le gambe appoggiando le scarpe su pavimento pulito → tuta nei rifiuti.'],
  ['Maschera', 'Togliere la maschera senza smontare i filtri, dal basso verso l’alto, dal davanti verso la nuca.'],
  ['Filtri', 'Scollegare i filtri → rifiuti; maschera nel contenitore ermetico per la decontaminazione.'],
  ['Ultimi guanti', 'Togliere il paio interno → rifiuti; igiene delle mani.'],
  ['Chiusura', 'Chiudere definitivamente il contenitore.'],
] as const

function Passi({ passi, prefisso, colore }: { passi: readonly (readonly [string, string])[]; prefisso: string; colore: string }) {
  return (
    <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {passi.map(([t, d], i) => (
        <li key={t} className="overflow-hidden rounded-xl border border-linea bg-white">
          <div className="relative">
            <img src={`${base}img/nbcr/${prefisso}-${String(i + 1).padStart(2, '0')}.webp`} alt={t} loading="lazy" className="block aspect-[5/4] w-full object-cover" />
            <span className={`absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-black text-white ${colore}`}>{i + 1}</span>
          </div>
          <div className="px-2 py-1.5">
            <p className="text-[12.5px] font-extrabold leading-tight">{t}</p>
            <p className="text-[11.5px] leading-snug text-tenue">{d}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export const FiguraVestizione = () => <Passi passi={VESTIZIONE} prefisso="vestizione" colore="bg-verde" />
export const FiguraSvestizione = () => <Passi passi={SVESTIZIONE} prefisso="svestizione" colore="bg-bordeaux" />
