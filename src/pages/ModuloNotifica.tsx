import { useState } from 'react'
import BarraModulo from '../components/BarraModulo'

/*
 * «Scheda unica di segnalazione delle malattie infettive» (DM 7/3/2022; Regione Toscana, DD 16355/2025, all. A),
 * ridisegnata con campi compilabili. ☎ = entro 12 h, ✉ = entro 48 h, ▣ = sorveglianza speciale.
 * I dati del paziente NON vengono salvati; nome, telefono ed email del medico sì (condivisi con gli altri moduli).
 */

const CHIAVE_MEDICO = 'emergenze.trasfusione.medico'
const leggiMedico = () => { try { return JSON.parse(localStorage.getItem(CHIAVE_MEDICO) ?? '{}') as { nome?: string; tel?: string; email?: string } } catch { return {} } }
const oggi = () => new Date().toLocaleDateString('it-IT')
const DEST = ['malattieinfettiveigiene.prato@uslcentro.toscana.it', 'infezionicorrelate.prato@uslcentro.toscana.it']

// [nome, 12 h? , sorveglianza speciale?]
const MALATTIE: [string, boolean, boolean][] = [
  ['Antrace', true, false], ['Borreliosi', false, false], ['Botulismo', true, true], ['Brucellosi', false, false], ['Chikungunya', true, true],
  ['Colera', true, false], ['Criptosporidiosi', false, false], ['Dengue', true, true], ['Dermatofitosi', false, false], ['Difterite', true, false],
  ['Echinococcosi', false, false], ['Encefalite virale da zecche', true, true], ['Encefalite virale trasmessa da artropodi', true, true],
  ['Epatite virale A', true, false], ['Epatite virale B', false, false], ['Epatite virale C', false, false], ['Epatite virale D', false, false],
  ['Epatite virale E', false, false], ['Epatiti virali acute altre', false, false], ['Febbre emorragica virale', true, false], ['Febbre gialla', true, false],
  ['Febbre Q', false, false], ['Febbre tifoide e paratifoide', false, false], ['Febbre virale West Nile', true, true], ['Giardiasi', false, false],
  ['Herpes zoster', false, false], ['Infezione correlata all’assistenza (ICA)', false, true], ['Infezione da Chlamydia', false, false],
  ['Infezione gonococcica', false, false], ['Campylobacter', false, false], ['E. coli STEC/VTEC (inclusa SEU)', false, false],
  ['Enterobatteri produttori di carbapenemasi (CPE)', false, true], ['Yersinia enterocolitica', false, false], ['Salmonella', false, false],
  ['Influenza (forma grave)', true, true], ['Influenza aviaria', true, true], ['Lebbra', false, false], ['Legionellosi', true, true],
  ['Leishmaniosi cutanea', false, false], ['Leishmaniosi viscerale', false, false], ['Leptospirosi', false, false], ['Linfogranuloma venereo', false, false],
  ['Listeriosi', false, false], ['Malaria', true, true], ['Malattia batterica invasiva', true, true], ['Malattia di Creutzfeldt-Jakob', true, true],
  ['Meningiti virali', false, false], ['Micobatteriosi non tubercolare', false, true], ['Morbillo', true, true], ['Parotite epidemica', false, false],
  ['Pediculosi e ftiriasi', false, false], ['Pertosse', false, false], ['Peste', true, false], ['Poliomielite acuta', true, true],
  ['Psittacosi', false, false], ['Rabbia', true, false], ['Rickettsiosi', false, false], ['Rosolia', true, true], ['Rosolia congenita', true, true],
  ['Rosolia in gravidanza', true, true], ['Scabbia', false, false], ['Scarlattina', false, false], ['Shigellosi', false, false], ['MERS-CoV', true, true],
  ['Sifilide', false, false], ['Sifilide congenita', false, false], ['Tetano', true, false], ['Tifo esantematico', true, false],
  ['Tossinfezioni di origine alimentare', true, false], ['Toxoplasmosi', false, false], ['Toxoplasmosi congenita', false, false], ['Trichinellosi', true, false],
  ['Tubercolosi', false, true], ['Tularemia', false, false], ['Vaiolo', true, false], ['Vaiolo delle scimmie (Mpox)', true, true], ['Varicella', true, false],
  ['Zika', true, true], ['Zika congenita', true, true],
]

function C({ className = '', ...p }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`campo ${className}`} />
}

export default function ModuloNotifica() {
  const medico = leggiMedico()
  const [spunte, setSpunte] = useState<Record<string, boolean>>({})
  const [chiave, setChiave] = useState(0)
  const [nomeMed, setNomeMed] = useState(medico.nome ?? '')
  const [telMed, setTelMed] = useState(medico.tel ?? '')
  const [mailMed, setMailMed] = useState(medico.email ?? '')
  const salva = (n: string, t: string, m: string) => { try { localStorage.setItem(CHIAVE_MEDICO, JSON.stringify({ ...leggiMedico(), nome: n, tel: t, email: m })) } catch { /* privata */ } }

  const K = ({ id, gruppo, children }: { id: string; gruppo?: string[]; children?: React.ReactNode }) => {
    const on = !!spunte[id]
    const tocca = () => setSpunte((s) => {
      const n = { ...s, [id]: !s[id] }
      if (!on && gruppo) gruppo.filter((g) => g !== id).forEach((g) => { n[g] = false })
      return n
    })
    return (
      <label className="inline-flex items-start gap-[1.2mm] cursor-pointer">
        <span className={`casella shrink-0 mt-[0.3mm] ${on ? 'piena' : ''}`} onClick={tocca} role="checkbox" aria-checked={on} aria-label={typeof children === 'string' ? children : id} />
        {children && <span onClick={tocca}>{children}</span>}
      </label>
    )
  }
  const scelte = MALATTIE.filter(([m]) => spunte[`m-${m}`])
  const entro12 = scelte.some(([, h12]) => h12)

  return (
    <div className="flex flex-col gap-3 lg:max-w-4xl lg:mx-auto">
      <BarraModulo nomeFile="notifica-malattia-infettiva.pdf" titolo="Notifica malattia infettiva" onSvuota={() => { setSpunte({}); setChiave((k) => k + 1) }}
        extra={<a href={`mailto:${DEST.join(',')}?subject=${encodeURIComponent('Notifica malattia infettiva' + (scelte.length ? ' – ' + scelte.map((s) => s[0]).join(', ') : ''))}`} className="rounded-full border border-verde px-4 py-2 text-sm font-bold text-verde">✉ Mail</a>}
        nota={<>Compila e premi «PDF / Stampa»: dal menu di condivisione scegli <b>Mail</b> e invia a {DEST.join(' e ')} (il pulsante «✉ Mail» apre una mail già indirizzata, a cui allegare il PDF). {entro12 && <b className="text-bordeaux">Malattia da segnalare entro 12 h: per meningococco, morbillo, febbri emorragiche, rabbia, botulismo telefonare anche all’Igiene pubblica reperibile.</b>}</>} />

      <div className="overflow-x-auto -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        <div id="modulo-stampa" key={chiave} className="foglio trasf notifica">
          <p className="text-center font-bold text-[11.5pt]">SCHEDA UNICA DI SEGNALAZIONE DELLE MALATTIE INFETTIVE</p>
          <p className="text-center font-bold mb-[2mm]">D.M. 7 marzo 2022</p>
          <p className="flex gap-[4mm] font-bold mb-[1mm]">CASO <K id="sospetto" gruppo={['sospetto', 'confermato']}>SOSPETTO</K><K id="confermato" gruppo={['sospetto', 'confermato']}>CONFERMATO</K>
            <span className="ml-auto font-normal text-[8pt]"><b>☎</b> entro 12 h · <b>✉</b> entro 48 h · <b>▣</b> sorveglianza speciale</span></p>
          <div className="columns-3 gap-[3mm] text-[7.6pt] leading-[1.15] border border-black p-[1.5mm]">
            {MALATTIE.map(([m, h12, sp]) => (
              <div key={m} className="break-inside-avoid"><K id={`m-${m}`}>{m} <b>{h12 ? '☎' : '✉'}</b>{sp ? ' ▣' : ''}</K></div>
            ))}
            <div className="flex items-end gap-1 break-inside-avoid"><K id="m-altro">Altro ✉</K><C className="flex-1 min-w-0" /></div>
          </div>
          <div className="grid grid-cols-2 gap-x-[5mm] mt-[2mm]">
            <div className="flex flex-col gap-[1.2mm]">
              <p className="font-bold">DATI ANAGRAFICI DEL PAZIENTE</p>
              <p className="flex items-end gap-1">Cognome/Nome <C className="flex-1" /></p>
              <p className="flex items-end gap-2">Sesso <K id="sx-f" gruppo={['sx-f', 'sx-m']}>F</K><K id="sx-m" gruppo={['sx-f', 'sx-m']}>M</K> Data di nascita <C className="flex-1" placeholder="gg/mm/aaaa" /></p>
              <p className="flex items-end gap-1">Comune di nascita <C className="flex-1" /></p>
              <p className="flex items-end gap-1">Domicilio: via <C className="flex-1" /></p>
              <p className="flex items-end gap-1">Comune <C className="flex-1" /> Prov. <C className="w-[10mm]" /></p>
              <p className="flex items-end gap-1">Residenza (se diversa) <C className="flex-1" /></p>
              <p className="flex items-end gap-1">Telefono <C className="flex-1" /></p>
              <p className="flex items-end gap-1">E-mail <C className="flex-1" /></p>
              <p className="flex items-end gap-1">Professione <C className="flex-1" /></p>

              <p className="font-bold mt-[1.5mm]">DATI SANITARI</p>
              <p className="flex items-end gap-1">Inizio sintomi <C className="w-[22mm]" /> Comune <C className="flex-1" /></p>
              <p className="flex items-end gap-1"><K id="viaggi">Viaggi all’estero: sì,</K> dove <C className="flex-1" /></p>
              <p className="flex items-end gap-1"><K id="ricovero">Ricoverato: sì,</K> dove <C className="flex-1" /></p>
              <p className="flex items-end gap-1"><K id="gravidanza">Gravidanza: sì,</K> settimana <C className="w-[12mm]" /></p>
              <p className="flex items-end gap-2">Già vaccinato per questa malattia: <K id="vac-si" gruppo={['vac-si', 'vac-no', 'vac-ns']}>sì</K><K id="vac-no" gruppo={['vac-si', 'vac-no', 'vac-ns']}>no</K><K id="vac-ns" gruppo={['vac-si', 'vac-no', 'vac-ns']}>non so</K></p>

            </div>
            <div className="flex flex-col gap-[1.2mm]">
              <p className="font-bold">Criteri diagnostici</p>
              <p className="flex items-end gap-1"><K id="cr-sint">sintomi (spec.)</K><C className="flex-1" /></p>
              <p><K id="cr-epi">correlazione epidemiologica</K></p>
              <p><K id="cr-lab">laboratorio: ricerche eseguite e in corso</K></p>
              <p className="flex items-end gap-1 pl-[4mm]">Materiale <C className="flex-1" /> Laboratorio <C className="flex-1" /></p>
              <p className="flex flex-wrap gap-x-[3mm] gap-y-[0.5mm] pl-[4mm]">
                <K id="t-coltura">colturale</K><K id="t-micro">microscopico/istologico</K><K id="t-siero">sierologia</K><K id="t-pcr">PCR/biologia molecolare</K><K id="t-altro">altro</K>
              </p>
              <p className="flex items-end gap-1 pl-[4mm]">Data prelievo <C className="w-[22mm]" /> Data referto <C className="w-[22mm]" /></p>
              <p className="flex items-end gap-1 pl-[4mm]">Dettagli <C className="flex-1" /></p>

              <p className="font-bold mt-[1.5mm]">Origine del contagio e contatti</p>
              <p className="flex flex-wrap items-end gap-2">Acquisita in assistenza sanitaria? <K id="ica-si" gruppo={['ica-si', 'ica-no', 'ica-nn']}>sì</K><K id="ica-no" gruppo={['ica-si', 'ica-no', 'ica-nn']}>no</K><K id="ica-nn" gruppo={['ica-si', 'ica-no', 'ica-nn']}>non noto</K></p>
              <p className="flex flex-wrap items-end gap-2">Comunità? <K id="com-no" gruppo={['com-no', 'com-nn', 'com-si']}>no</K><K id="com-nn" gruppo={['com-no', 'com-nn', 'com-si']}>non noto</K><K id="com-si" gruppo={['com-no', 'com-nn', 'com-si']}>sì (scuola, RSA, altro)</K></p>
              <p className="flex items-end gap-1 pl-[4mm]">identificare <C className="flex-1" /></p>
              <p className="flex flex-wrap items-end gap-2">Da alimenti? <K id="al-si" gruppo={['al-si', 'al-no', 'al-nn']}>sì</K><K id="al-no" gruppo={['al-si', 'al-no', 'al-nn']}>no</K><K id="al-nn" gruppo={['al-si', 'al-no', 'al-nn']}>non noto</K></p>
              <p className="flex flex-wrap items-end gap-2">Altri coinvolti? <K id="alt-si" gruppo={['alt-si', 'alt-no']}>sì</K><K id="alt-no" gruppo={['alt-si', 'alt-no']}>no</K> <C className="flex-1 min-w-[30mm]" /></p>

              <p className="font-bold mt-[1.5mm]">DATI RELATIVI AL MEDICO</p>
              <p className="flex items-end gap-1">Cognome e nome <C className="flex-1" value={nomeMed} onChange={(e) => { setNomeMed(e.target.value); salva(e.target.value, telMed, mailMed) }} /></p>
              <p className="flex items-end gap-1">Tel. <C className="flex-1" value={telMed} onChange={(e) => { setTelMed(e.target.value); salva(nomeMed, e.target.value, mailMed) }} /> e-mail <C className="flex-1" value={mailMed} onChange={(e) => { setMailMed(e.target.value); salva(nomeMed, telMed, e.target.value) }} /></p>
              <p className="flex items-end gap-1">Struttura <C className="flex-1" defaultValue="PS – DEA, PO S. Stefano Prato" /></p>
              <p className="flex items-end gap-1 mt-[2mm]">Data <C className="w-[24mm]" defaultValue={oggi()} /> <span className="flex-1 text-right">Firma del medico ____________________</span></p>
            </div>
          </div>
          <p className="mt-[3mm] border border-[#c00] p-[1.5mm] text-center font-bold text-[#c00]">INVIARE IL MODULO per MAIL a: {DEST[0]}<br />{DEST[1]}</p>
        </div>
      </div>
    </div>
  )
}
