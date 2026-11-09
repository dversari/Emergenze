/*
 * Anamnesi ed esame obiettivo mirati per sintomo di accesso, pronti da copiare in cartella.
 * Le parti tra [parentesi] sono da scegliere/completare; l'EO è scritto come reperto normale da correggere.
 * In fondo a ogni scheda: segni d'allarme e score da non dimenticare (da cancellare prima di copiare, se non servono).
 */

import type { TestoModificabile } from '../components/PaginaTesti'

const GENERALE = `Anamnesi patologica remota: [nulla di rilevante / ...]. Interventi: [...].
Terapia domiciliare: [...]. Anticoagulanti/antiaggreganti: [no / ...].
Allergie: [nega / ...]. Fumo: [...]. Alcol/sostanze: [...].`

const PARAMETRI = `Parametri: PA [...] mmHg, FC [...] bpm, SpO2 [...]% in [aa / O2 ...], FR [...]/min, TC [...] °C, glicemia [...] mg/dL, dolore NRS [...]/10.`

export const ANAMNESI: TestoModificabile[] = [
  // ─── Cardio-respiratorio ───
  {
    id: 'dolore-toracico', nome: 'Dolore toracico', gruppo: 'Cardio-respiratorio',
    testo: `ANAMNESI
Dolore toracico insorto [improvvisamente / gradualmente] alle ore [...] del [...], [a riposo / durante sforzo / al risveglio / dopo pasto].
Sede [retrosternale / precordiale / emitorace dx-sx / epigastrica], irradiazione [braccio sx / mandibola / dorso interscapolare / nessuna].
Caratteristiche [oppressivo / costrittivo / puntorio / urente / lacerante], intensità NRS [...]/10, durata [...], [continuo / intermittente].
Modificato da [respiro / tosse / movimenti / digitopressione / decubito / pasti / nitrato]: [...].
Sintomi associati: [dispnea / sudorazione algida / nausea-vomito / palpitazioni / sincope o presincope / febbre / tosse / emottisi]: [...].
Episodi precedenti simili: [...]. Sforzo abituale tollerato: [...].
Fattori di rischio CV: [ipertensione / diabete / dislipidemia / fumo / familiarità per cardiopatia precoce / obesità]. Cardiopatia nota: [...].
Rischio TEV: [immobilizzazione / chirurgia recente / neoplasia / TVP-EP pregressa / estroprogestinici / gravidanza]: [...].
Assunzione di cocaina/sostanze: [nega / ...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI} PA misurata ai due arti superiori: dx [...] / sx [...].
Condizioni generali [buone], vigile, orientato, eupnoico a riposo. Cute [normocolorita, non sudata].
Torace: MV fisiologico su tutto l'ambito, non rumori aggiunti. Dolore [non] evocabile alla digitopressione della parete toracica.
Cuore: toni validi, ritmici, pause libere, non soffi né sfregamenti.
Collo: giugulari non turgide, non soffi carotidei.
Addome: trattabile, non dolente, non masse pulsanti.
Arti: polsi periferici [presenti e simmetrici]; non edemi, non segni di TVP.

DA NON DIMENTICARE
- ECG entro 10 minuti dall'arrivo; ripetere se dolore ricorrente. Troponina hs 0/1 h o 0/2 h.
- Score: HEART (calcolatori), Wells/PERC se sospetta EP.
- Dissezione: dolore lacerante, deficit di polso o PA asimmetrica (>20 mmHg), deficit neurologico, soffio di insufficienza aortica.
- Altri: pneumotorace, tamponamento, rottura esofagea (vomito prima del dolore).`,
  },
  {
    id: 'dispnea', nome: 'Dispnea', gruppo: 'Cardio-respiratorio',
    testo: `ANAMNESI
Dispnea insorta [improvvisamente / gradualmente da ... giorni], [a riposo / da sforzo per ...], [ingravescente / stabile].
Ortopnea [sì/no] (n. cuscini [...]), dispnea parossistica notturna [sì/no].
Sintomi associati: [tosse secca / produttiva con espettorato ...] [emottisi] [febbre] [dolore toracico pleuritico / oppressivo] [sibili] [palpitazioni] [edemi arti inferiori, aumento ponderale ... kg] [riduzione della diuresi].
Fattori scatenanti: [infezione / sospensione terapia / eccesso idrico-salino / esposizione ad allergeni-fumi / FA].
Patologie respiratorie note: [BPCO / asma / OSAS / interstiziopatia]; O2 domiciliare [no / ... L/min]; ultime riacutizzazioni/ricoveri: [...]. Ultima spirometria: [...].
Cardiopatia nota: [scompenso, FE ... % / valvulopatia / cardiopatia ischemica].
Rischio TEV: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [discrete], vigile, orientato. [Eupnoico / tachipnoico], [non] uso dei muscoli accessori, eloquio [fluente / frammentato]. Non cianosi.
Torace: [espansibilità simmetrica], MV [fisiologico / ridotto alle basi / globalmente ridotto], [non] rumori aggiunti [crepitii bibasali / sibili espiratori / ronchi], FVT [normotrasmesso].
Cuore: toni validi, ritmici, pause libere, [non] soffi.
Collo: giugulari [non] turgide, reflusso epatogiugulare [assente].
Addome: trattabile, non dolente, fegato [nei limiti].
Arti: [non] edemi declivi [improntabili fino a ...], non segni di TVP.

DA NON DIMENTICARE
- EGA (lattati, PaCO2), ECG, RX torace / ecografia polmonare (linee B, versamento, sliding), NT-proBNP.
- Segni di gravità: SpO2 < 90%, FR > 30, uso dei muscoli accessori, sopore (ipercapnia), silenzio respiratorio.
- Score: Wells/PERC per EP.`,
  },
  {
    id: 'palpitazioni', nome: 'Palpitazioni', gruppo: 'Cardio-respiratorio',
    testo: `ANAMNESI
Cardiopalmo insorto alle ore [...], [a riposo / durante sforzo / dopo ...], ad insorgenza e risoluzione [improvvisa / graduale], [regolare / irregolare], durata [...], [ancora in atto / risolto spontaneamente / con manovre vagali].
Sintomi associati: [dispnea / dolore toracico / presincope / sincope / poliuria post-critica / ansia].
Episodi precedenti: [...]; aritmie note: [FA / flutter / TPSV / WPW]; ablazioni: [...]; portatore di [PM / ICD].
Possibili cause: [caffeina / alcol / sostanze / febbre / ipertiroidismo / anemia / disidratazione / farmaci (...)].
Familiarità per morte improvvisa o cardiomiopatie: [nega / ...].
Terapia anticoagulante e aderenza: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato, eupnoico, cute [normoperfusa].
Cuore: toni validi, [ritmici / aritmici], frequenza [...], pause libere, [non] soffi.
Torace: MV fisiologico, non rumori aggiunti.
Collo: giugulari non turgide; tiroide [non palpabile / ...].
Arti: non edemi.

DA NON DIMENTICARE
- ECG a 12 derivazioni durante il sintomo; registrare striscia del ritmo.
- Instabilità: ipotensione, shock, sincope, ischemia, scompenso → cardioversione elettrica.
- FA: data di esordio < o > 48 h, CHA₂DS₂-VA e HAS-BLED (calcolatori).
- Esami: K, Mg, TSH, emocromo, troponina se dolore.`,
  },
  {
    id: 'sincope', nome: 'Sincope / perdita di coscienza', gruppo: 'Cardio-respiratorio',
    testo: `ANAMNESI
Episodio di perdita di coscienza transitoria alle ore [...], durata riferita [...], [testimoniato da ...].
Circostanze: [ortostatismo prolungato / passaggio clino-ortostatismo / ambiente caldo e affollato / minzione / defecazione / tosse / dolore o emozione / durante sforzo / da supino / a riposo seduto].
Prodromi: [calore, sudorazione, nausea, offuscamento visivo / palpitazioni / dolore toracico / nessuno].
Durante l'episodio: [pallore / cianosi / scosse (n. ..., durata ...) / morsus laterale / perdita di urine / occhi aperti].
Ripresa: [immediata e completa / confusione post-critica per ... minuti / amnesia].
Traumi conseguenti: [nega / ...]. Sintomi residui: [...].
Episodi precedenti: [n. ..., ultimo ...].
Cardiopatia nota: [...]. Familiarità per morte improvvisa < 40 anni: [nega / ...].
Farmaci ipotensivanti/QT-allunganti: [...]. Nuove terapie: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
PA in clinostatismo [...] e dopo 1-3 min di ortostatismo [...]; FC [...] / [...]; sintomi in ortostatismo [sì/no].
Condizioni generali [buone], vigile, orientato nei tre ambiti, eupnoico.
Cuore: toni validi, ritmici, pause libere, [non] soffi (in particolare soffio eiettivo aortico).
Torace: MV fisiologico.
Neurologico: non deficit focali, non segni di lato. Morsus [assente].
Capo e cute: non segni di trauma [ferita ...].
Esplorazione rettale [se sospetta emorragia]: [...].

DA NON DIMENTICARE
- ECG: QTc, PR, blocchi di branca/bifascicolari, Brugada, pre-eccitazione, segni di ipertrofia o ischemia.
- Alto rischio (ESC): sincope da sforzo o supino, palpitazioni prima dell'evento, cardiopatia strutturale, ECG anormale, familiarità per morte improvvisa, ipotensione persistente.
- Hb, glicemia; test di gravidanza nelle donne in età fertile.`,
  },
  {
    id: 'ipertensione', nome: 'Pressione alta', gruppo: 'Cardio-respiratorio',
    testo: `ANAMNESI
Riscontro di valori pressori elevati [... mmHg], [domiciliare / da ...], [asintomatico / con ...].
Sintomi: [cefalea / disturbi visivi / dolore toracico / dispnea / deficit neurologici / confusione / epistassi / ansia].
Ipertensione nota da [...]; terapia antipertensiva [...]; aderenza [buona / sospesa da ...].
Fattori favorenti: [dolore / ansia / FANS / decongestionanti / cortisonici / liquirizia / sostanze / sospensione di clonidina-betabloccanti].
Possibile gravidanza: [no / settimana ...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI} PA ripetuta dopo 15–30 minuti di riposo: [...]; ai due arti: dx [...] / sx [...].
Condizioni generali [buone], vigile, orientato, eupnoico.
Cuore: toni validi, ritmici, pause libere, [non] soffi.
Torace: MV fisiologico, non crepitii.
Neurologico: non deficit focali; [fundus oculi se disponibile].
Arti: non edemi; polsi femorali [presenti e simmetrici].

DA NON DIMENTICARE
- Danno d'organo acuto (emergenza ipertensiva): SCA, EPA, dissezione, ictus/encefalopatia, retinopatia, IRA, preeclampsia → trattamento ev.
- Senza danno d'organo: niente riduzione rapida; ECG, creatinina, esame urine.`,
  },
  // ─── Addome e urologia ───
  {
    id: 'dolore-addominale', nome: 'Dolore addominale', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
Dolore addominale insorto [improvvisamente / gradualmente] alle ore [...] del [...].
Sede d'esordio [...], attuale [...], irradiazione [dorso / spalla / inguine / nessuna]. Caratteristiche [colico / continuo / trafittivo / urente], NRS [...]/10.
Rapporto con pasti [...], movimenti [...], decubito antalgico [...].
Sintomi associati: [nausea / vomito (n. ..., alimentare / biliare / fecaloide / ematico)] [febbre] [alvo: ultima evacuazione ..., canalizzato a gas sì/no, diarrea, melena, ematochezia] [disuria / ematuria] [ittero, urine ipercromiche, feci ipocoliche].
Donna: ultima mestruazione [...], possibile gravidanza [...], perdite vaginali [...], contraccezione [...].
Interventi addominali pregressi: [...]. Patologie note: [calcolosi biliare / renale, diverticolosi, ulcera, cirrosi, MICI, AAA].
Farmaci: [FANS / cortisonici / anticoagulanti / oppioidi]; alcol [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato. Cute e sclere [anitteriche]. Mucose [umide / asciutte].
Addome: [piano / globoso / disteso], [non] cicatrici, [trattabile], [dolente / dolorabile] alla palpazione [superficiale e profonda] in [...]. Difesa [assente], Blumberg [negativo], Murphy [negativo], McBurney [negativo], Rovsing [negativo], psoas [negativo]. Non masse né organomegalie palpabili, non masse pulsanti. Peristalsi [presente / ridotta / metallica]. Orifizi erniari [liberi].
Giordano [negativo] bilateralmente.
Esplorazione rettale [se indicata]: [...].
Torace: MV fisiologico (escludere polmonite basale).

DA NON DIMENTICARE
- Anziano, diabetico, immunodepresso: esame poco affidabile, soglia bassa per imaging.
- Dolore sproporzionato rispetto all'obiettività (ischemia mesenterica: lattati, FA); AAA in età > 60 anni (eco al letto); test di gravidanza nelle donne in età fertile.
- ECG negli epigastralgie (IMA inferiore).`,
  },
  {
    id: 'emorragia-digestiva', nome: 'Sanguinamento digestivo', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
[Ematemesi / vomito caffeano / melena / ematochezia / rettorragia] insorta [...], n. episodi [...], quantità stimata [...].
Sintomi associati: [astenia / lipotimia / sincope / dispnea / dolore toracico / dolore addominale / vomito ripetuto prima dell'ematemesi (Mallory-Weiss)].
Episodi precedenti, EGDS/colonscopie: [...]. Ulcera, varici, cirrosi, diverticolosi, MICI, emorroidi: [...].
Farmaci: [FANS / ASA / antiaggreganti / anticoagulanti (ultima dose ...) / SSRI / cortisonici / ferro (feci scure)]. Alcol: [...].
Perdita di peso, alterazione dell'alvo: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI} Shock index FC/PAS: [...]. PA e FC in ortostatismo [se stabile]: [...].
Condizioni generali [...], vigile, orientato. Cute e mucose [normocolorite / pallide], [non] sudate. Refill capillare [< 2 s].
Segni di epatopatia: [assenti / spider naevi, eritema palmare, ascite, circoli collaterali, ittero].
Addome: trattabile, [non] dolente, non masse, peristalsi presente.
Esplorazione rettale: [feci normocoliche / melena / sangue rosso vivo], [non] masse, [emorroidi].

DA NON DIMENTICARE
- Glasgow-Blatchford (≤ 1 → gestione ambulatoriale possibile); Hb, gruppo e prove crociate, coagulazione, urea.
- Varici sospette: terlipressina + ceftriaxone prima dell'endoscopia.
- Trasfondere con soglia Hb 7 g/dL (8 se cardiopatia).`,
  },
  {
    id: 'vomito-diarrea', nome: 'Vomito / diarrea', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
[Vomito / diarrea] da [...] [ore / giorni], n. episodi/die [...].
Vomito: [alimentare / biliare / caffeano / fecaloide]. Diarrea: [acquosa / con muco / con sangue], [notturna].
Sintomi associati: [febbre / dolore addominale (sede ...) / tenesmo / cefalea / vertigine / dolore toracico].
Diuresi [conservata / ridotta]; assunzione di liquidi [...].
Contatti con casi simili, alimenti sospetti, viaggi recenti, acqua non potabile: [...].
Antibiotici o ricoveri negli ultimi 3 mesi (C. difficile): [...].
Farmaci a rischio con la disidratazione (sospendere temporaneamente): [diuretici / ACE-i / sartani / metformina / SGLT2i / FANS / litio].
Possibile gravidanza: [...]. Diabete (chetoacidosi): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato. Mucose [umide / asciutte], cute [elastica / plica cutanea persistente], refill [< 2 s].
Addome: [piano], trattabile, [lievemente dolorabile diffusamente], non segni di peritonismo, peristalsi [vivace].
Esplorazione rettale [se sangue]: [...].

DA NON DIMENTICARE
- Segni d'allarme: sangue nelle feci, febbre > 39 °C, disidratazione grave, anziano o immunodepresso, dolore addominale localizzato, ostruzione.
- Esami se moderata-grave: elettroliti, creatinina, glicemia, chetonemia nel diabetico.`,
  },
  {
    id: 'colica-renale', nome: 'Dolore al fianco / colica renale', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
Dolore al fianco [dx / sx] insorto [improvvisamente] alle ore [...], [colico], irradiato a [inguine / genitali / non irradiato], NRS [...]/10, con [agitazione psicomotoria / nausea / vomito].
Sintomi urinari: [ematuria macroscopica / disuria / pollachiuria / stranguria / ritenzione].
Febbre o brividi: [...].
Precedenti episodi di calcolosi: [...]; espulsione/trattamenti: [...]. Rene unico o trapiantato: [...].
Età > 60 anni senza calcolosi nota (considerare AAA): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [discrete], [sofferente / agitato], vigile, orientato.
Addome: trattabile, [dolorabile in fianco / fossa iliaca dx-sx], non segni di peritonismo, non masse pulsanti.
Giordano [positivo a dx / sx].
Genitali [se dolore irradiato]: testicoli in sede, non dolenti, non tumefatti.

DA NON DIMENTICARE
- Febbre + ostruzione = drenaggio urgente (urologo).
- Creatinina, esame urine, ecografia (idronefrosi); TC senza mdc se dubbio o primo episodio con dolore atipico.
- AAA nell'anziano; torsione testicolare nel giovane.`,
  },
  {
    id: 'urinari', nome: 'Disturbi urinari', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
[Disuria / pollachiuria / urgenza / stranguria / ematuria / ritenzione urinaria] da [...].
Febbre, brividi, dolore lombare: [...]. Nausea/vomito: [...].
Donna: perdite vaginali [...], ultima mestruazione [...], possibile gravidanza [...].
Uomo: disturbi prostatici noti [...], dolore perineale/testicolare [...], secrezioni uretrali [...].
Episodi precedenti di IVU (n. nell'ultimo anno): [...]; ultime urinocolture: [...]. Catetere vescicale: [...].
Antibiotici negli ultimi 3 mesi, ricoveri, RSA: [...].
Farmaci anticolinergici/oppioidi (ritenzione): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato.
Addome: trattabile, [dolorabile in sede sovrapubica], globo vescicale [assente / presente], non segni di peritonismo.
Giordano [negativo] bilateralmente.
[Uomo: esplorazione rettale: prostata (dimensioni, consistenza, dolorabilità) ...]
Bladder scan: residuo post-minzionale [...] mL.

DA NON DIMENTICARE
- Donna non gravida senza febbre: cistite non complicata, urinocoltura non necessaria.
- Uomo: IVU sempre complicata; considerare prostatite. Urinocoltura prima dell'antibiotico.`,
  },
  {
    id: 'scroto', nome: 'Dolore scrotale', gruppo: 'Addome e urologia',
    testo: `ANAMNESI
Dolore testicolare [dx / sx] insorto [improvvisamente / gradualmente] alle ore [...] [a riposo / nel sonno / dopo trauma / dopo sforzo].
Nausea/vomito: [...]. Febbre: [...]. Sintomi urinari o secrezioni uretrali: [...]. Episodi simili risolti spontaneamente: [...].
Rapporti a rischio: [...]. Parotite recente: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Addome: trattabile, non dolente.
Genitali: emiscroto [dx / sx] [normale / tumefatto / arrossato]; testicolo [in sede / risalito / orizzontalizzato], [non] dolente; epididimo [non] dolente/tumefatto. Riflesso cremasterico [presente / assente]. Segno di Prehn [...]. Transilluminazione [...]. Orifizi erniari liberi.

DA NON DIMENTICARE
- Torsione: esordio improvviso, vomito, testicolo alto/orizzontale, cremasterico assente → urologo subito (finestra 6 h), l'ecodoppler non deve ritardare.`,
  },
  // ─── Neurologia ───
  {
    id: 'cefalea', nome: 'Cefalea', gruppo: 'Neurologia',
    testo: `ANAMNESI
Cefalea insorta [improvvisamente, massima intensità in < 1 minuto / gradualmente] alle ore [...], [durante sforzo / rapporto sessuale / Valsalva / a riposo / al risveglio].
Sede [...], caratteristiche [pulsante / gravativa / trafittiva], NRS [...]/10. [Prima cefalea di questo tipo / simile alle abituali / la peggiore della vita].
Sintomi associati: [nausea / vomito / foto-fonofobia / aura (...) / febbre / rigidità nucale / disturbi visivi / diplopia / deficit focali / confusione / convulsioni / dolore mandibolare alla masticazione / claudicatio mandibolare].
Trauma recente: [...]. Cefalea abituale (tipo, frequenza, terapia): [...]. Analgesici assunti oggi e uso mensile: [...].
Gravidanza/puerperio, neoplasia, immunodepressione, anticoagulanti: [...]. Possibile esposizione a monossido (altri in casa con sintomi, stufe): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato nei tre ambiti, eloquio fluente.
Neurologico: pupille isocoriche isocicliche normoreagenti, MOE nella norma, non nistagmo; VII nc simmetrico; forza e sensibilità conservate e simmetriche ai quattro arti; Mingazzini I e II mantenute; prove cerebellari nella norma; Romberg [negativo]; marcia [normale]. ROT [simmetrici]. Segni meningei [assenti] (rigidità nucale, Kernig, Brudzinski).
Arterie temporali [palpabili, non dolenti] (età > 50 anni). Seni paranasali [non dolenti]. Cute: [non petecchie].

DA NON DIMENTICARE
- Red flags (SNOOP): esordio a rombo di tuono, prima o peggiore, febbre/segni meningei, deficit focali, età > 50 anni, neoplasia/HIV, anticoagulanti, gravidanza, cambiamento del pattern, papilledema.
- TC encefalo; se negativa entro 6 h dall'esordio con TC di ultima generazione, ESA esclusa; oltre → rachicentesi.
- VES/PCR se sospetta arterite temporale.`,
  },
  {
    id: 'deficit-neurologico', nome: 'Deficit neurologico / sospetto ictus', gruppo: 'Neurologia',
    testo: `ANAMNESI
Ultima volta visto in benessere: ore [...] del [...] (testimone: [...]). Esordio [improvviso / al risveglio / non noto].
Sintomi: [ipostenia emisoma dx/sx / disturbo del linguaggio / deviazione della rima buccale / disturbo visivo / atassia / vertigine / disestesie / cefalea / vomito / convulsione all'esordio].
Andamento: [stabile / in peggioramento / in miglioramento / risolto (TIA) dopo ... minuti].
Episodi precedenti: [...]. FA nota, ictus/TIA pregressi: [...].
Anticoagulanti (farmaco, ultima dose, ore): [...]. Antiaggreganti: [...].
Interventi chirurgici, traumi, sanguinamenti recenti: [...]. Stato funzionale precedente (mRS): [...].
Glicemia capillare: [...] mg/dL.
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
NIHSS: [...] (coscienza [...], orientamento [...], comandi [...], sguardo [...], campo visivo [...], paralisi facciale [...], motilità arti sup dx/sx [...], inf dx/sx [...], atassia [...], sensibilità [...], linguaggio [...], disartria [...], neglect [...]).
Cuore: toni [ritmici / aritmici], [non] soffi. Collo: [non] soffi carotidei.
Capo: non segni di trauma; morsus [assente].

DA NON DIMENTICARE
- Codice ictus: TC + angio-TC; tempi per trombolisi (4,5 h) e trombectomia (fino a 24 h, selezionati).
- Mimics: ipoglicemia, crisi epilettica con paralisi di Todd, emicrania con aura, encefalopatia, sincope.`,
  },
  {
    id: 'vertigine', nome: 'Vertigine / capogiro', gruppo: 'Neurologia',
    testo: `ANAMNESI
[Vertigine oggettiva-rotatoria / instabilità / sensazione di svenimento] insorta [improvvisamente / gradualmente] alle ore [...].
Andamento: [episodi brevi < 1 min scatenati dai cambi di posizione del capo / continua da ... ore / episodi ricorrenti di ore].
Sintomi associati: [nausea / vomito / ipoacusia / acufeni / fullness auricolare / cefalea / cervicalgia / diplopia / disartria / disfagia / deficit di forza o sensibilità / atassia / palpitazioni / dolore toracico].
Infezione respiratoria recente: [...]. Trauma cranico o cervicale (dissezione): [...]. Episodi precedenti: [...].
Fattori di rischio vascolare: [...]. Farmaci (ipotensivanti, sedativi, nuovi farmaci): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI} PA in ortostatismo: [...].
Condizioni generali [buone], vigile, orientato, eloquio fluente.
Nistagmo: [assente / spontaneo orizzontale-torsionale, unidirezionale, che batte verso ..., inibito dalla fissazione / evocato dallo sguardo / verticale / che cambia direzione].
HINTS (solo con nistagmo spontaneo e sindrome vestibolare acuta): head impulse [patologico a dx/sx / normale], nistagmo [unidirezionale / cambia direzione], skew [assente / presente].
Dix-Hallpike: [negativo / positivo a dx/sx con nistagmo torsionale-verticale geotropo, latenza e affaticabilità]. Supine roll test: [...].
Neurologico: MOE nella norma, non diplopia, VII nc simmetrico, forza e sensibilità conservate, prove cerebellari [indice-naso, calcagno-ginocchio, diadococinesi nella norma], Romberg [...], marcia [autonoma / atassica / impossibile senza appoggio].
Otoscopia: [membrane timpaniche integre]. Udito [grossolanamente conservato].

DA NON DIMENTICARE
- Head impulse normale, nistagmo che cambia direzione o skew positivo, deficit neurologici, impossibilità a stare in piedi → sospetto centrale: imaging (RM > TC).
- VPPB: nistagmo solo posizionale, brevi episodi → manovra di riposizionamento.`,
  },
  {
    id: 'convulsione', nome: 'Crisi convulsiva', gruppo: 'Neurologia',
    testo: `ANAMNESI
Episodio alle ore [...], testimoniato da [...]: [perdita di coscienza / scosse tonico-cloniche generalizzate / focali (...)], durata [...], [morsus / perdita di urine / cianosi]. Ripresa con stato confusionale post-critico di [...] minuti.
Prodromi o aura: [...]. Circostanze: [sonno / privazione di sonno / alcol o sospensione / sostanze / febbre / flash luminosi].
[Prima crisi / epilessia nota (tipo ..., terapia ..., aderenza ..., ultima crisi ..., livelli farmaco ...)].
Trauma cranico, cefalea, febbre, neoplasia, ictus pregresso: [...]. Possibile gravidanza (eclampsia): [...].
Farmaci che abbassano la soglia (tramadolo, bupropione, antipsicotici, antibiotici...): [...]. Diabete/ipoglicemizzanti: [...].
Traumi riportati: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [...], [vigile e orientato / soporoso / confuso], GCS [...].
Morsus [assente / laterale lingua], incontinenza [...]. Segni di trauma: [capo ..., spalle (lussazione posteriore)].
Neurologico: pupille [isocoriche, normoreagenti], non deficit focali (paralisi di Todd [assente]), segni meningei [assenti].

DA NON DIMENTICARE
- Glicemia, Na, Ca, Mg, CK, lattati; livelli dei farmaci antiepilettici; tossicologico se indicato.
- Prima crisi: TC encefalo; EEG e visita neurologica.
- Stato di male: crisi > 5 minuti o crisi ripetute senza ripresa → benzodiazepina subito.
- Guida: comunicare il divieto temporaneo (normativa patenti).`,
  },
  {
    id: 'confusione', nome: 'Alterazione della coscienza / confusione', gruppo: 'Neurologia',
    testo: `ANAMNESI (da familiari/caregiver/118)
Alterazione dello stato di coscienza/confusione notata alle ore [...], esordio [acuto / subacuto / fluttuante]. Ultima volta visto al proprio stato abituale: [...].
Stato cognitivo e funzionale abituale: [autonomo / deterioramento cognitivo (...) / allettato].
Sintomi associati: [febbre / cefalea / vomito / dolore / caduta o trauma / convulsioni / deficit focali / dispnea / ritenzione urinaria / stipsi].
Farmaci nuovi, cambi di dose, possibili sovradosaggi: [sedativi / oppioidi / anticolinergici / ipoglicemizzanti / digossina / litio / antiepilettici]. Alcol, sostanze, sospensione recente: [...].
Diabete, epatopatia, insufficienza renale, BPCO ipercapnica: [...].
Monossido di carbonio (altri in casa, stufe/caminetti): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
GCS [E... V... M...]; 4AT [...]/12 (vigilanza [...], AMT4 [...], attenzione mesi a ritroso [...], esordio acuto/fluttuante [...]).
Pupille [...], MOE [...]. Non deficit focali grossolani. Segni meningei [...]. Asterixis [...]. Tremori, mioclonie, rigidità [...].
Cute: [segni di trauma / punture / ittero / cianosi / sudorazione / secca]. Alito: [alcolico / acetonemico / fetor hepaticus].
Torace: [...]. Cuore: [...]. Addome: [...], globo vescicale [...], ER (fecaloma) [...].

DA NON DIMENTICARE
- Glicemia subito; EGA (CO2, lattati, COHb), elettroliti incl. Ca, funzione renale ed epatica, ammonio, esame urine, tossicologico, TC encefalo se trauma/anticoagulanti/deficit.
- Tiamina prima del glucosio se alcolista o malnutrito.
- Cause frequenti nell'anziano: infezione, farmaci, ritenzione urinaria, fecaloma, disidratazione, iponatriemia, dolore.`,
  },
  // ─── Traumi e muscolo-scheletrico ───
  {
    id: 'trauma-cranico', nome: 'Trauma cranico', gruppo: 'Traumi',
    testo: `ANAMNESI
Trauma cranico alle ore [...] da [caduta accidentale dalla stazione eretta / caduta da altezza di ... m o da più di 5 scalini / incidente stradale (...) / aggressione / ...]. Causa della caduta: [accidentale / sincope / malore / ...].
Perdita di coscienza: [nega / riferita, durata ...]. Amnesia [anterograda / retrograda / nega]. Stato confusionale: [...].
Sintomi: [cefalea (diffusa / ingravescente) / vomito (n. ...) / convulsioni / sonnolenza / alterazioni comportamentali / disturbi visivi / deficit / otorrea-rinorrea].
Intossicazione alcolica o da sostanze: [...]. Pregressi interventi neurochirurgici: [...].
Anticoagulanti (farmaco, dose, ultima assunzione ore ...): [...]. Antiaggreganti (escluso ASA 100 mg): [...]. Coagulopatie: [...].
Caregiver per osservazione domiciliare: [presente / assente].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
GCS [15] (E4 V5 M6). Vigile, orientato nei tre ambiti.
Capo: [ferita lacero-contusa di ... cm in regione ... / ematoma / escoriazione]. Non segni di frattura della teca o della base (no infossamenti, no ecchimosi periorbitarie bilaterali, no segno di Battle, no oto-rinoliquorrea, no emotimpano).
Rachide cervicale: [non dolente alla digitopressione, motilità attiva conservata] (Canadian C-spine rule [...]).
Neurologico: pupille isocoriche isocicliche normoreagenti, MOE nella norma, non deficit di forza o sensibilità, prove cerebellari nella norma, marcia [...].
Altri traumi: [non segni di trauma a torace, addome, bacino, arti / ...].

DA NON DIMENTICARE (PDTA aziendale)
- TC entro 1 h: GCS < 15, segni di frattura cranica, convulsioni, deficit neurologico, vomito ripetuto.
- TC entro 8 h: PDC, amnesia o stato confusionale; cefalea diffusa, coagulopatia, intossicazione, dinamica maggiore, età > 65; antiaggreganti (escluso ASA 100), anticoagulanti, pregresso intervento NCH, difficoltà di osservazione.
- Dimissione con modulo per l'osservazione domiciliare.`,
  },
  {
    id: 'trauma-arto', nome: 'Trauma di un arto', gruppo: 'Traumi',
    testo: `ANAMNESI
Trauma [distorsivo / contusivo / da caduta / da schiacciamento] a carico di [...] [dx / sx] alle ore [...], dinamica: [...].
Dolore [...], NRS [...]/10; impotenza funzionale [assente / parziale / totale]; carico/uso dell'arto [possibile / impossibile] subito dopo e ora.
Parestesie, deficit di forza: [...]. Rumore di «crack», sensazione di cedimento: [...].
Mano dominante: [dx / sx]. Attività lavorativa/sportiva: [...].
Ultima vaccinazione antitetanica: [...] (se ferite).
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
[Sede ...]: [tumefazione / ecchimosi / deformità / ferite (esposizione)] [assenti / ...]. Dolorabilità alla palpazione in [...].
Motilità attiva [conservata / limitata da dolore in ...], passiva [...]. Stabilità legamentosa: [...].
Vascolare: polsi distali [presenti], refill [< 2 s], cute [calda, normocolorita].
Nervoso: sensibilità [conservata] nei territori di [...]; motilità [conservata] (es. mano: radiale/ulnare/mediano; piede: SPE/SPI).
Articolazioni a monte e a valle [non dolenti].
Caviglia (Ottawa): dolorabilità margine posteriore/apice malleolo peroneale [...] / tibiale [...], base V metatarso [...], navicolare [...], carico 4 passi [possibile / no].
Ginocchio (Ottawa): età > 55 [...], dolorabilità testa del perone [...], rotula isolata [...], flessione < 90° [...], carico 4 passi [...].
Polso: tabacchiera anatomica [non dolente].

DA NON DIMENTICARE
- Sindrome compartimentale: dolore sproporzionato, dolore allo stiramento passivo, tensione.
- Lussazioni e fratture con deficit neurovascolare: riduzione urgente.
- Anziano: frattura di femore anche con carico possibile; dolore al bacino.`,
  },
  {
    id: 'mal-di-schiena', nome: 'Lombalgia / dolore al rachide', gruppo: 'Traumi',
    testo: `ANAMNESI
Dolore [lombare / dorsale / cervicale] insorto [improvvisamente / gradualmente] da [...], [dopo sforzo / trauma (...) / spontaneamente].
Irradiazione: [arto inferiore dx/sx fino a (gluteo / coscia / ginocchio / piede)], parestesie [...], deficit di forza [...].
Caratteristiche: [meccanico, migliora a riposo / infiammatorio, notturno, rigidità mattutina > 30 min / costante, non modificato dalla posizione].
Disturbi sfinterici [ritenzione / incontinenza], anestesia a sella, disturbi sessuali: [nega / ...].
Febbre, calo ponderale, neoplasia nota, immunodepressione, uso di droghe ev, cortisonici a lungo, osteoporosi: [...]. Età < 20 o > 55 anni.
Episodi precedenti: [...]. Terapie assunte: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Deambulazione [autonoma / antalgica]; punte e talloni [possibile].
Rachide: [dolorabilità alla digitopressione delle apofisi spinose / paravertebrale dx-sx], contrattura muscolare paravertebrale [...], motilità [limitata in ...].
Lasègue [negativo / positivo a dx/sx a ...°], Wassermann [...].
Neurologico arti inferiori: forza [conservata] (flessione dorsale piede e alluce L4-L5, plantare S1, quadricipite L3-L4), sensibilità [conservata], ROT rotulei [presenti simmetrici], achillei [presenti simmetrici]. Sensibilità perineale [conservata]. [Tono sfinterico all'ER: ...]
Addome: trattabile, non masse pulsanti. Giordano [negativo]. Polsi femorali [presenti].
Bladder scan: residuo post-minzionale [...] mL (se sospetta cauda equina).

DA NON DIMENTICARE
- Cauda equina: ritenzione, anestesia a sella, deficit bilaterali → RM urgente.
- AAA, dissezione, colica renale, pielonefrite, pancreatite come cause di dolore lombare.
- Febbre o immunodepressione: spondilodiscite/ascesso epidurale; neoplasia nota: metastasi.`,
  },
  // ─── Infezioni e generale ───
  {
    id: 'febbre', nome: 'Febbre', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI
Febbre da [...] giorni, TC max [...] °C, [con brividi scuotenti], antipiretici assunti [...].
Sintomi di localizzazione: [respiratori (tosse, dispnea, mal di gola) / urinari / addominali (dolore, diarrea) / cutanei (ferite, cellulite) / cefalea, rigidità nucale, fotofobia / dolori articolari / dolore dentario o sinusale].
Stato mentale [abituale / alterato]; diuresi [conservata / ridotta].
Immunodepressione [chemioterapia (ultimo ciclo ...), cortisonici, biologici, splenectomia, HIV, trapianto]; dispositivi [CVC, PICC, catetere vescicale, protesi, valvole]; diabete: [...].
Antibiotici o ricoveri negli ultimi 3 mesi; RSA: [...]. Viaggi recenti (malaria): [...]. Contatti con casi simili; animali; punture di zecca: [...].
Vaccinazioni (influenza, COVID, pneumococco): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato. Cute [calda, normoperfusa], refill [< 2 s], [non] petecchie, [non] rash, [non] lesioni cutanee o ferite. Mucose [umide].
Orofaringe: [iperemico / essudato tonsillare / normale]. Linfonodi laterocervicali [non palpabili].
Collo: segni meningei [assenti].
Torace: MV [fisiologico / ridotto in ... / crepitii in ...].
Cuore: toni validi, ritmici, [non] soffi (endocardite).
Addome: trattabile, non dolente, Murphy [negativo], Giordano [negativo] bilateralmente.
Articolazioni: [non] tumefatte. Dispositivi: punti di inserzione [puliti].

DA NON DIMENTICARE
- qSOFA (FR ≥ 22, PAS ≤ 100, alterazione mentale) e NEWS; lattati; emocolture prima dell'antibiotico.
- Neutropenia febbrile: antibiotico entro 1 h.
- Febbre + petecchie / rigidità nucale: meningite, antibiotico subito.`,
  },
  {
    id: 'allergia', nome: 'Reazione allergica', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI
Reazione insorta alle ore [...], [... minuti] dopo [assunzione di farmaco (...) / alimento (...) / puntura di imenottero (...) / esposizione a ... / causa non identificata].
Sintomi: [orticaria / prurito / angioedema (labbra, lingua, palpebre, ...) / disfonia / disfagia / senso di costrizione alla gola / dispnea / sibili / tosse / nausea / vomito / dolore addominale / diarrea / capogiri / lipotimia / sincope].
Terapia già praticata (118 / autoiniettore): [...] alle ore [...].
Reazioni precedenti: [...]. Allergie note: [...]. Asma: [...]. ACE-inibitori (angioedema bradichininico), betabloccanti: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], vigile, orientato, eupnoico, voce [normale].
Cute: [orticaria diffusa / localizzata a ... / eritema / angioedema di ...].
Cavo orale e orofaringe: [non edema di lingua, ugola, pavimento orale].
Torace: MV fisiologico, [non] sibili, non stridore.
Cuore: toni ritmici, tachicardici [sì/no].
Addome: trattabile, non dolente.

DA NON DIMENTICARE
- Anafilassi = coinvolgimento cutaneo/mucoso + respiratorio, cardiovascolare o gastrointestinale grave (oppure ipotensione dopo allergene noto) → adrenalina 0,5 mg im (0,5 mL della fiala 1 mg/mL) nella coscia, ripetibile dopo 5 min.
- Angioedema senza orticaria (ACE-i, ereditario): antistaminici e cortisone poco efficaci.
- Osservazione: almeno 6 h dopo anafilassi (12–24 h se grave o adrenalina ripetuta); triptasi entro 1–4 h.`,
  },
  {
    id: 'arto-gonfio', nome: 'Arto inferiore gonfio / dolente', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI
Tumefazione [e dolore] all'arto inferiore [dx / sx / bilaterale] da [...], [improvvisa / graduale].
Sintomi associati: [arrossamento / calore / febbre / dispnea / dolore toracico / emottisi / sincope / ferite o porte d'ingresso / dolore al polpaccio in ortostatismo].
Fattori di rischio TEV: [immobilizzazione / gesso / chirurgia o ricovero recente / viaggio lungo / neoplasia attiva / TVP-EP pregressa / estroprogestinici / gravidanza o puerperio / trombofilia].
Trauma: [...]. Cisti di Baker nota: [...]. Insufficienza venosa: [...]. Scompenso, epatopatia, nefropatia, farmaci (calcioantagonisti): [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Arto inferiore [dx / sx]: circonferenza polpaccio 10 cm sotto la tuberosità tibiale [...] cm vs controlaterale [...] cm; edema [improntabile fino a ...]; cute [normocolorita / eritematosa / calda], [non] cordoni venosi palpabili, [non] dolorabilità lungo il decorso venoso profondo, vene superficiali collaterali [...]. Porte d'ingresso: [...]. Polsi pedidi e tibiali posteriori [presenti].
Torace: MV fisiologico. Cuore: [...].

DA NON DIMENTICARE
- Wells TVP; D-dimero (età-correlato dopo i 50 anni: età × 10) se probabilità bassa; ecografia CUS.
- Phlegmasia cerulea dolens; sindrome compartimentale; ischemia acuta (5 P).
- Sintomi respiratori: considerare EP.`,
  },
  {
    id: 'caduta-anziano', nome: 'Caduta nell’anziano', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI (paziente e familiari)
Caduta alle ore [...] [in casa / all'esterno], dinamica: [inciampo / scivolamento / perdita di equilibrio / alzandosi / senza causa evidente].
Perdita di coscienza, prodromi (capogiro, palpitazioni, dolore toracico): [...]. Trauma cranico: [...]. Tempo a terra: [...] (rabdomiolisi, ipotermia, piaghe).
Dolori attuali: [anca / polso / spalla / rachide / torace / capo].
Cadute precedenti nell'ultimo anno: [...]. Ausili: [nessuno / bastone / deambulatore]. Vista, udito: [...].
Stato cognitivo e autonomia abituali: [...]. Vive [solo / con ...]; supporto a domicilio: [...].
Farmaci (n. ...): [antipertensivi / diuretici / sedativi-ipnotici / antidepressivi / antipsicotici / ipoglicemizzanti / anticoagulanti / oppioidi]; modifiche recenti: [...]. Alcol: [...].
Sintomi di infezione intercorrente, disidratazione, disturbi urinari: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI} PA e FC in clino- e ortostatismo: [...] / [...].
Condizioni generali [...], vigile, orientato [...]; 4AT [...].
Capo: [segni di trauma]. Rachide: [non dolente].
Bacino e anche: [non dolenti], arti inferiori [non accorciati né extraruotati], rotazione e carico [possibili].
Arti superiori: polsi e spalle [non dolenti].
Torace: [non dolente alla compressione]. Cuore: toni [ritmici], [non] soffi (stenosi aortica).
Neurologico: non deficit focali; marcia (se possibile) [...]; Timed Up and Go [...].
Cute: [lesioni da pressione, ecchimosi].

DA NON DIMENTICARE
- Cercare la causa della caduta (sincope, aritmia, infezione, farmaci, ipoglicemia, iponatriemia, anemia).
- CK se tempo a terra prolungato; TC encefalo se anticoagulato o trauma cranico (PDTA).
- Frattura di femore occulta: RX anca, eventualmente TC; sicurezza della dimissione (chi sta con lui?).`,
  },
  {
    id: 'intossicazione', nome: 'Intossicazione / sovradosaggio', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI (paziente, familiari, 118, confezioni vuote)
Sostanza/e: [...], quantità [...], ora presunta di assunzione [...], via [orale / inalatoria / ev / ...]. Formulazioni a rilascio prolungato: [...].
[Intenzionale / accidentale / a scopo ricreativo]. Biglietti, messaggi, tentativi precedenti: [...].
Co-ingestione di alcol: [...]. Paracetamolo (sempre chiedere): [...].
Sintomi: [sopore / agitazione / allucinazioni / convulsioni / vomito / palpitazioni / dispnea / dolore toracico].
Malattie psichiatriche, terapie in atto: [...]. Gravidanza: [...].
Centro Antiveleni contattato: [ore ..., indicazioni ...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
GCS [...]; pupille [miotiche / midriatiche / normali], reattività [...]; nistagmo [...].
Cute: [secca / sudata / arrossata / cianotica], [segni di puntura / autolesioni].
Neurologico: tono [normale / ipertonia / rigidità], ROT [...], cloni [inducibili / spontanei / oculari], mioclonie [...], tremore [...].
Torace: [...]. Cuore: [...]. Addome: peristalsi [presente / ridotta / aumentata], globo vescicale [...].
Sindrome tossica: [anticolinergica / colinergica / simpaticomimetica / oppioide / sedativo-ipnotica / serotoninergica].

DA NON DIMENTICARE
- ECG (QRS > 100 ms, QTc), glicemia, EGA con lattati e gap anionico/osmolare, paracetamolo e salicilati, CK, funzione renale ed epatica.
- Valutazione psichiatrica se intenzionale prima della dimissione; sorveglianza e rimozione dei mezzi lesivi.`,
  },
  {
    id: 'mal-di-gola', nome: 'Mal di gola', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI
Odinofagia da [...] giorni, febbre [... °C], tosse [assente / presente], rinorrea [...].
Disfagia [...], scialorrea (non riesce a deglutire la saliva) [...], trisma [...], voce [normale / ovattata / disfonica], dispnea/stridore [...], dolore unilaterale [...], torcicollo [...].
Contatti con streptococco: [...]. Antibiotici già assunti: [...]. Episodi ricorrenti: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Condizioni generali [buone], eupnoico, voce [normale], deglutisce la saliva.
Orofaringe: tonsille [ipertrofiche / normali], [iperemiche], [essudato], ugola [in asse / deviata], pilastri [simmetrici / bombé a dx-sx]. Apertura della bocca [normale].
Linfonodi laterocervicali anteriori [non palpabili / dolenti]. Collo [mobile, non tumefatto].
Torace: MV fisiologico.
Centor/McIsaac: [...] (febbre > 38, essudato, linfonodi anteriori dolenti, assenza di tosse, età).

DA NON DIMENTICARE
- Ascesso peritonsillare (trisma, voce ovattata, ugola deviata), epiglottite (scialorrea, stridore, posizione seduta in avanti), ascesso retrofaringeo, Lemierre.
- Test rapido per lo streptococco se Centor ≥ 2–3.`,
  },
  {
    id: 'occhio-rosso', nome: 'Occhio rosso / dolente', gruppo: 'Infezioni e generale',
    testo: `ANAMNESI
Occhio [dx / sx / entrambi] arrossato da [...], [con / senza] dolore (NRS [...]), [prurito / sensazione di corpo estraneo / bruciore].
Visus: [conservato / ridotto]. Fotofobia [...]. Secrezione [acquosa / mucopurulenta]. Aloni colorati attorno alle luci, cefalea, nausea-vomito [...].
Trauma, corpo estraneo (mola, flessibile, martello su metallo), schizzi chimici: [...]. Lenti a contatto: [...].
Episodi precedenti (uveiti), malattie reumatologiche, herpes: [...]. Interventi oculari: [...].
${GENERALE}

ESAME OBIETTIVO
${PARAMETRI}
Acuità visiva (ottotipo / conta dita) OD [...] OS [...].
Palpebre: [normali / edema / vescicole (zoster V1, segno di Hutchinson)].
Congiuntiva: iperemia [diffusa / perilimbare (ciliare)], chemosi [...], secrezione [...].
Cornea: [trasparente / opacità], fluoresceina: [nessuna captazione / disepitelizzazione ... / lesione dendritica / segno di Seidel]. Corpo estraneo: [assente / sede ...] (eversione palpebra superiore [eseguita]).
Pupilla: [rotonda, normoreagente / media fissa / miotica]. Camera anteriore [profonda / ipopion / ifema]. Tono digitale [normale / aumentato].

DA NON DIMENTICARE
- Invio oculistico urgente: calo del visus, dolore vero, fotofobia, iperemia ciliare, pupilla anomala, opacità corneale, trauma penetrante o chimico, portatore di lenti con ulcera, zoster oftalmico.
- Ustione chimica: lavaggio abbondante prima di tutto (pH).`,
  },
]
