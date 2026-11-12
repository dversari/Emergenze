import type { ReactNode } from 'react'

/*
 * Regolamento della formazione ASL Toscana Centro (DOC.STDA.02, rev. 0, 2026) e FAQ (24/08/2026):
 * scheda riassuntiva con link ai documenti originali.
 */
const base = import.meta.env.BASE_URL

const CODICI = [
  { c: '28001', t: 'Formazione obbligatoria in sede', n: 'digitarlo all’orologio della sede del corso, in entrata e in uscita, poi OK' },
  { c: '29003', t: 'Docenza in orario di lavoro', n: 'stessi adempimenti del discente' },
  { c: '29001', t: 'Docenza fuori orario', n: 'timbrare solo nella sede della docenza; viaggio fuori timbratura' },
  { c: '9070', t: 'Corsi FAD', n: 'inserito d’ufficio nel mese della prova finale' },
  { c: '3044', t: 'Riserva oraria dirigenza', n: 'solo dirigenti sanitari, inserimento manuale su WHR-Time' },
]

function Blocco({ titolo, colore, icona, children }: { titolo: string; colore: string; icona: string; children: ReactNode }) {
  return (
    <section className={`rounded-2xl border p-4 ${colore}`}>
      <p className="flex items-center gap-2 text-[17px] font-black"><span className="text-xl">{icona}</span>{titolo}</p>
      <ul className="mt-2 space-y-1.5 text-[14px] leading-snug">{children}</ul>
    </section>
  )
}
const Li = ({ children }: { children: ReactNode }) => <li className="flex gap-2"><span className="opacity-50">•</span><span>{children}</span></li>

export default function Formazione() {
  return (
    <div className="flex flex-col gap-3 lg:max-w-5xl lg:mx-auto">
      <div>
        <p className="etichetta !text-oro">ASL Toscana Centro · 2026</p>
        <h1 className="text-2xl font-black leading-tight">Formazione: le regole in breve</h1>
        <p className="mt-1 text-[13px] text-tenue">Riassunto non ufficiale del Regolamento della Formazione e delle FAQ. In caso di dubbio vale il testo originale.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <a href={`${base}docs/regolamento-formazione-2026.pdf`} target="_blank" rel="noreferrer" className="rounded-full bg-verde px-3 py-1.5 text-sm font-bold text-white">📄 Regolamento (DOC.STDA.02)</a>
          <a href={`${base}docs/faq-regolamento-formazione-2026.pdf`} target="_blank" rel="noreferrer" className="rounded-full border border-verde px-3 py-1.5 text-sm font-bold text-verde">❓ FAQ (agosto 2026)</a>
        </div>
      </div>

      <section className="rounded-2xl border border-[#e6d5b0] bg-[#f6eedd] p-4">
        <p className="text-[17px] font-black text-[#7a5a17]">🔢 Codici da timbrare</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {CODICI.map((k) => (
            <div key={k.c} className="flex items-start gap-3 rounded-xl bg-white/70 p-2.5">
              <span className="rounded-lg bg-[#7a5a17] px-2 py-1 font-mono text-[15px] font-black text-white">{k.c}</span>
              <span className="text-[13px] leading-snug"><b>{k.t}</b><br /><span className="text-tenue">{k.n}</span></span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[12.5px] text-tenue">Codice dimenticato: WHR-Time → Richieste → «richiesta causale timbratura» (o «richiesta timbratura» se manca proprio). Sede senza orologio: inserimento su WHR-Time, convalida del responsabile.</p>
      </section>

      <div className="grid gap-3 lg:grid-cols-2">
        <Blocco titolo="Corso obbligatorio in azienda" icona="🏥" colore="border-[#c6dacd] bg-[#e6efe9]">
          <Li>Lo dispone il responsabile; le ore di corso sono <b>orario di lavoro</b>.</Li>
          <Li>Se si parte dal servizio: timbrare l’uscita in reparto, poi entrata/uscita con <b>28001</b> nella sede del corso.</Li>
          <Li>Ore oltre il dovuto giornaliero: conteggiate in automatico (FAQ); corso più corto del dovuto: il viaggio completa la giornata.</Li>
          <Li>Firma sul foglio presenze, questionario di gradimento e test su WHR-Time «Area Formazione».</Li>
          <Li>ECM solo con almeno il <b>90%</b> di presenza, test superato e gradimento compilato.</Li>
        </Blocco>

        <Blocco titolo="Viaggio, mezzi e pasti" icona="🚗" colore="border-[#c8d6e4] bg-[#e6edf4]">
          <Li>Tempo di viaggio: solo per completare il dovuto giornaliero → WHR-Time, «Missioni», tipo «completamento orario corsi aziendali».</Li>
          <Li>Mezzi pubblici: rimborso del biglietto in classe economica (stesso percorso WHR, campo TICKET con il biglietto in pdf). Mezzo proprio: nessun rimborso.</Li>
          <Li>Fuori dal proprio ambito (Prato = Zona Pratese): auto aziendale condivisa, anche fuori timbratura, con registro uscite.</Li>
          <Li>Pausa pranzo non è orario di lavoro; corso ≥ 6 ore: mensa aziendale (timbratura mensa) o card sostitutiva.</Li>
        </Blocco>

        <Blocco titolo="Giorno non lavorativo" icona="📅" colore="border-[#e2c9cd] bg-[#f4e9ea]">
          <Li>Timbrare con 28001 nella sede del corso; le ore sono <b>eccedenti da recuperare</b>, nessun riposo compensativo.</Li>
          <Li>Se non vengono conteggiate: WHR-Time «sblocco allineamento/autorizzazione eccedenze» o «richiesta cambio orario».</Li>
          <Li>Fuori ambito: il viaggio conta fino al debito orario standard. Copertura assicurativa anche nel tragitto.</Li>
          <Li>Part-time: comunicare al responsabile il giorno di recupero.</Li>
        </Blocco>

        <Blocco titolo="Obbligatoria fuori Azienda" icona="✈️" colore="border-[#d9e3c8] bg-[#eef3e4]">
          <Li>Proposta del direttore; modulo <b>MOD.STDA.03</b> a <span className="break-all">formazione.individualeobbligatoria@uslcentro.toscana.it</span> almeno <b>20 giorni prima</b>.</Li>
          <Li>Non si timbra: vale la presenza dall’attestato o dal programma; viaggio solo a completamento del dovuto.</Li>
          <Li>Rimborsi: iscrizione, mezzo pubblico in classe economica (niente auto aziendale), pasto fino a <b>€ 22,26</b> (&gt; 8 h; 2 pasti se &gt; 12 h), pernottamento fino a <b>€ 120</b>/notte se &gt; 100 km.</Li>
          <Li>Anticipo del 75% dopo l’autorizzazione: trattamentoeconomico.risorseumane@uslcentro.toscana.it.</Li>
          <Li>Dopo: modulo <b>MOD.STDA.05</b> (rimborso e orario) con attestato e ricevute alla mail della formazione.</Li>
        </Blocco>

        <Blocco titolo="Facoltativa e sponsorizzata" icona="🎓" colore="border-[#e6d5b0] bg-[#faf3e3]">
          <Li>Facoltativa: <b>8 giorni</b> di permesso retribuito all’anno (dirigenti anche riserva oraria), autorizzazione preventiva del responsabile.</Li>
          <Li>Dopo l’evento: WHR-Time → Richieste → Richiesta assenze giorni → Perm. retribuito esami, concorsi → Aggiornamento facoltativo, con attestato allegato.</Li>
          <Li>Sponsorizzata: l’invito arriva dallo sponsor all’Azienda (formazione.sponsorizzata@…) 30 giorni prima, senza nominativi: la scelta è aziendale.</Li>
          <Li>Senza costi per l’Azienda la partecipazione la autorizza il direttore, senza modulo (FAQ).</Li>
        </Blocco>

        <Blocco titolo="FAD" icona="💻" colore="border-[#c8d6e4] bg-[#eef2f8]">
          <Li>Vale come orario di lavoro se obbligatoria aziendale o individuale autorizzata dal responsabile.</Li>
          <Li>Ore accreditate d’ufficio con <b>9070</b> dopo il test superato; se le ore non sono indicate: 1 credito ECM = 1 ora, massimo 12.</Li>
          <Li>Si può fare da una postazione aziendale se libera per tutto il corso e concordata.</Li>
          <Li>Non compatibile con ferie, malattia o altre assenze a giornata intera; l’Azienda può controllare i log di accesso.</Li>
        </Blocco>

        <Blocco titolo="Docenza" icona="🧑‍🏫" colore="border-[#e2c9cd] bg-[#f8eff0]">
          <Li>In orario (<b>29003</b>): si resta in timbratura anche nello spostamento, ma la docenza non viene pagata.</Li>
          <Li>Fuori orario (<b>29001</b>): pagata a parte, nessun riconoscimento del viaggio né ore sul cartellino; non conta per il riposo di 11 ore.</Li>
          <Li>Non retribuite docenze sotto i 30 minuti; mai con assenze a giornata intera; con le 150 ore solo se c’è almeno 1 ora di servizio timbrata.</Li>
          <Li>Docenza in altri enti in orario di lavoro: gratuita, senza rimborsi, autorizzata dal direttore.</Li>
        </Blocco>

        <Blocco titolo="Audit, M&M, riunioni, TOJ" icona="🗂️" colore="border-[#d9d4c7] bg-[#f3f0ea]">
          <Li>Sono servizio: timbratura normale, nessun codice; ECM con i soliti adempimenti.</Li>
          <Li>Il viaggio è orario di lavoro; mezzo proprio secondo le regole aziendali, con registro uscite e autorizzazione.</Li>
          <Li>Eventi di norma sospesi dal 15 giugno al 15 settembre e dal 15 dicembre al 10 gennaio.</Li>
        </Blocco>
      </div>
    </div>
  )
}
