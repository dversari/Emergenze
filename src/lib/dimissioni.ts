/*
 * Formule di dimissione modificabili. I campi tra [parentesi quadre] vanno completati o tolti.
 * Il testo modificato si salva sul telefono (localStorage) e resta finché non si ripristina l’originale.
 * Dosi per adulto senza controindicazioni: verificarle sul singolo paziente.
 */

export interface Dimissione { id: string; nome: string; gruppo: string; testo: string }

const RITORNO = 'Torni in Pronto Soccorso o chiami il 112 se:'
const CURANTE = 'Si rimanda al medico curante per competenza, per il proseguimento delle cure e per eventuali ulteriori accertamenti a sua discrezione.'
/** Sezione Controlli standard; le richieste specifiche vanno come «Si allega richiesta per …». */
const controlli = (...extra: string[]) => ['Controlli:', `- ${CURANTE}`, ...extra.map((e) => `- ${e}`)].join('\n')

export const DIMISSIONI: Dimissione[] = [
  // ─── Addome ───
  {
    id: 'colica-renale', nome: 'Colica renale', gruppo: 'Addome',
    testo: `Diagnosi: colica renale [destra/sinistra] [da calcolo di X mm in sede ...].

Terapia:
- Ibuprofene 600 mg: 1 compressa ogni 8 ore dopo i pasti, per 5 giorni o finché c'è dolore. In alternativa o in aggiunta paracetamolo 1 g: 1 compressa fino a 3 volte al giorno (almeno 6 ore tra una dose e l'altra).
- [Tamsulosina 0,4 mg: 1 compressa la sera fino all'espulsione del calcolo, per massimo 4 settimane. Può dare capogiri alzandosi in piedi. Uso off-label: il farmaco è registrato solo per l'ipertrofia prostatica (nella donna non ha indicazioni autorizzate); è prescritto perché favorisce l'espulsione dei calcoli dell'uretere distale. Il paziente è stato informato e acconsente.]
- [Deltacortene (prednisone) 25 mg: 1 compressa al mattino dopo colazione per ... giorni, insieme alla tamsulosina. Se diabetico controlli la glicemia.]
- [Gastroprotezione: pantoprazolo 20 mg 1 compressa al mattino a digiuno finché assume antinfiammatorio/cortisone.]

Indicazioni:
- Urini sempre in un colino o attraverso una garza finché il calcolo non viene espulso; lo conservi asciutto in un contenitore e lo porti al medico curante per l'analisi chimica: serve a scegliere la prevenzione giusta.

Prevenzione di nuovi calcoli:
- Beva 2,5–3 litri al giorno, distribuiti nella giornata, in modo da urinare almeno 2–2,5 litri (urine chiare); di più se suda molto o fa caldo.
- Riduca il sale (niente sale aggiunto, pochi insaccati, formaggi stagionati, cibi pronti) e non ecceda con le proteine animali (carne, pesce, uova).
- Non riduca latte, yogurt e formaggi freschi: un apporto normale di calcio protegge dai calcoli. Eviti invece integratori di calcio e di vitamina C ad alte dosi, salvo diversa indicazione medica.
- Molta frutta e verdura; eviti eccessi di cibi ricchi di ossalati (spinaci, bietole, rabarbaro, cioccolato, tè nero) e di bevande zuccherate.
- Mantenga il peso forma e faccia attività fisica regolare.
- [Gli integratori in commercio «contro i calcoli» non hanno dimostrato efficacia; un'eventuale terapia preventiva (es. citrato di potassio) verrà valutata dal medico in base al tipo di calcolo e agli esami.]

${controlli('[Si allega richiesta per ecografia dell\'apparato urinario e visita urologica.]')}

${RITORNO}
- febbre sopra 38 °C o brividi;
- dolore che non passa con la terapia;
- vomito che impedisce di bere o di prendere i farmaci;
- non riesce a urinare o urina molto poco;
- sangue abbondante nelle urine.`,
  },
  {
    id: 'colica-biliare', nome: 'Colica biliare', gruppo: 'Addome',
    testo: `Diagnosi: colica biliare [da calcolosi della colecisti].

Terapia:
- Al bisogno per il dolore: Spasmomen Somatico 40 mg + 2 mg (otilonio bromuro + diazepam): 1 compressa dopo i pasti, fino a 3 volte al giorno.
  Attenzione: contiene diazepam (benzodiazepina). Può dare sonnolenza, vertigini, rallentamento dei riflessi: non guidi e non usi macchinari pericolosi mentre lo assume. Non beva alcolici e non lo associ ad altri sedativi, sonniferi o oppioidi (es. codeina, tramadolo). Possibili anche bocca secca e difficoltà a urinare. Non usare in gravidanza (primo trimestre), glaucoma, ipertrofia prostatica, miastenia. Negli anziani usare la dose minima.
- In aggiunta, se serve: paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Dieta povera di grassi: eviti fritti, insaccati, formaggi grassi, burro, panna, uova, cioccolato. Pasti piccoli e frequenti.
- Niente alcol.

${controlli('[Si allega richiesta per ecografia dell\'addome superiore e visita chirurgica (valutazione colecistectomia).]')}

${RITORNO}
- il dolore dura più di 6 ore o non passa con la terapia;
- febbre sopra 38 °C o brividi;
- pelle o occhi gialli, urine scure come il marsala, feci chiare;
- vomito che non si ferma.`,
  },
  {
    id: 'colica-gassosa', nome: 'Colica addominale gassosa', gruppo: 'Addome',
    testo: `Diagnosi: dolore addominale da meteorismo (colica gassosa). Gli accertamenti eseguiti non hanno evidenziato una causa che richieda il ricovero.

Terapia:
- Simeticone 80–120 mg: 1 compressa masticabile dopo i pasti principali, per alcuni giorni.
- Al bisogno per il dolore: Spasmomen Somatico 40 mg + 2 mg (otilonio bromuro + diazepam): 1 compressa dopo i pasti, fino a 3 volte al giorno.
  Attenzione: contiene diazepam (benzodiazepina). Può dare sonnolenza, vertigini, rallentamento dei riflessi: non guidi e non usi macchinari pericolosi mentre lo assume. Non beva alcolici e non lo associ ad altri sedativi, sonniferi o oppioidi (es. codeina, tramadolo). Possibili anche bocca secca e difficoltà a urinare. Non usare in gravidanza (primo trimestre), glaucoma, ipertrofia prostatica, miastenia. Negli anziani usare la dose minima.

Indicazioni:
- Mangi lentamente, eviti bevande gassate, legumi, cavoli, chewing-gum, dolcificanti (sorbitolo).
- Regolarizzi l'intestino: acqua, frutta e verdura; movimento.

${controlli()}

${RITORNO}
- il dolore aumenta, diventa continuo o si localizza in un punto preciso (soprattutto in basso a destra);
- febbre;
- vomito ripetuto, pancia gonfia e dura, non emette più gas né feci;
- sangue nelle feci o feci nere.`,
  },
  {
    id: 'gastrite', nome: 'Gastrite / dispepsia', gruppo: 'Addome',
    testo: `Diagnosi: gastrite [dispepsia].

Terapia:
- Pantoprazolo 40 mg: 1 compressa al mattino a digiuno, 30 minuti prima della colazione, per [4] settimane.
- Al bisogno dopo i pasti e la sera: alginato/antiacido in sospensione [1 bustina].

Indicazioni:
- Eviti antinfiammatori (ibuprofene, ketoprofene, aspirina, ecc.): per il dolore usi paracetamolo.
- Eviti alcol, fumo, caffè, cibi piccanti, fritti, pasti abbondanti e pasti nelle 3 ore prima di coricarsi.

${controlli()}

${RITORNO}
- vomito con sangue o materiale scuro «a fondo di caffè»;
- difficoltà a deglutire;
- feci nere o con sangue;
- dolore molto forte o improvviso, vomito continuo.`,
  },
  {
    id: 'gastroenterite', nome: 'Gastroenterite', gruppo: 'Addome',
    testo: `Diagnosi: gastroenterite acuta [probabilmente virale].

Terapia:
- Idratazione: beva spesso piccoli sorsi, almeno 2 litri al giorno; soluzioni reidratanti orali [1 bustina in 200 mL d'acqua dopo ogni scarica].
- [Nausea o vomito: ondansetron 4 mg compressa orosolubile, 1 fino a 2–3 volte al giorno.]
- Febbre o dolore: paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Riprenda gradualmente l'alimentazione: riso, pasta in bianco, patate, carne o pesce magri, banane, mele, crackers. Eviti latte, latticini, fritti, alcol e caffè per qualche giorno.
- Si lavi spesso le mani e non condivida asciugamani: l'infezione è contagiosa.
- Non prenda antidiarroici se ha febbre o sangue nelle feci.

${controlli()}

${RITORNO}
- segni di disidratazione: bocca molto secca, urina poco o niente da più di 8–12 ore, capogiri alzandosi;
- vomito che impedisce di bere;
- sangue nelle feci o feci nere;
- febbre alta per più di 3 giorni o dolore addominale forte;
- sonnolenza o confusione.`,
  },
  {
    id: 'diverticolite', nome: 'Diverticolite non complicata', gruppo: 'Addome',
    testo: `Diagnosi: diverticolite acuta non complicata [confermata con TC/ecografia].

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno per il dolore. Eviti gli antinfiammatori (ibuprofene, ketoprofene).
- [Antibiotico: amoxicillina/acido clavulanico 875/125 mg, 1 compressa ogni 8 ore per 7 giorni.]

Indicazioni:
- Per 2–3 giorni dieta leggera e povera di scorie (brodo, riso, pasta, carne e pesce magri), poi ritorno graduale all'alimentazione normale.
- Dopo la guarigione: dieta ricca di fibre (frutta, verdura, cereali integrali) e molta acqua per prevenire nuovi episodi.

${controlli('[Si allega richiesta per colonscopia da eseguire a 6–8 settimane dalla guarigione.]')}

${RITORNO}
- febbre sopra 38 °C;
- dolore che aumenta o non migliora entro 2–3 giorni;
- vomito, impossibilità a mangiare o bere;
- pancia gonfia e dura, sangue nelle feci.`,
  },
  {
    id: 'emorroidi', nome: 'Emorroidi', gruppo: 'Addome',
    testo: `Diagnosi: malattia emorroidaria [trombosi emorroidaria esterna].

Terapia:
- [Pomata/crema per emorroidi: applicare 2–3 volte al giorno e dopo ogni evacuazione, per 7–10 giorni.]
- [Flavonoidi (diosmina/esperidina): secondo lo schema della confezione.]
- Dolore: paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Semicupi in acqua tiepida per 10–15 minuti, 2–3 volte al giorno.
- Feci morbide: almeno 1,5–2 litri di acqua al giorno, frutta, verdura e fibre; [macrogol 1 bustina al giorno] se stitichezza.
- Eviti di stare a lungo seduto sul water e gli sforzi; eviti cibi piccanti e alcol.

${controlli('[Si allega richiesta per visita proctologica.]')}

${RITORNO}
- sanguinamento abbondante o con capogiri/svenimento;
- dolore molto forte con nodulo duro e scuro;
- febbre, gonfiore e arrossamento della zona.`,
  },
  // ─── Respiratorie e ORL ───
  {
    id: 'bronchite', nome: 'Bronchite acuta', gruppo: 'Respiratorie e ORL',
    testo: `Diagnosi: bronchite acuta [probabilmente virale].

La tosse può durare fino a 3 settimane anche quando l'infezione sta guarendo. Nella maggior parte dei casi l'antibiotico non serve.

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno per febbre o dolore.
- [Sciroppo per la tosse / mucolitico secondo la confezione.]
- [Salbutamolo spray 100 µg: 2 spruzzi con distanziatore ogni 6 ore se respiro sibilante.]

Indicazioni:
- Beva molto, riposi, non fumi.

${controlli()}

${RITORNO}
- fiato corto o respiro difficoltoso;
- febbre sopra 38 °C per più di 3 giorni;
- sangue nell'espettorato;
- dolore al torace.`,
  },
  {
    id: 'faringite', nome: 'Faringite / tonsillite', gruppo: 'Respiratorie e ORL',
    testo: `Diagnosi: faringotonsillite [virale / streptococcica, test rapido positivo].

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno, oppure ibuprofene 400–600 mg ogni 8 ore dopo i pasti, per febbre e dolore.
- [Antibiotico: amoxicillina 1 g, 1 compressa ogni 12 ore per 10 giorni. Lo prenda per tutti i 10 giorni anche se sta meglio prima.]

Indicazioni:
- Beva molto anche se deglutire fa male; cibi morbidi e tiepidi.
- [Se streptococco: dopo 24 ore di antibiotico non è più contagioso.]

${controlli()}

${RITORNO}
- non riesce a deglutire nemmeno la saliva o a bere;
- non riesce ad aprire la bocca, voce «ovattata», gonfiore da un lato della gola o del collo;
- difficoltà a respirare;
- febbre alta che non scende dopo 48 ore di terapia.`,
  },
  {
    id: 'sinusite', nome: 'Sinusite acuta', gruppo: 'Respiratorie e ORL',
    testo: `Diagnosi: rinosinusite acuta [probabilmente virale].

Di solito guarisce da sola in 7–10 giorni senza antibiotico.

Terapia:
- Lavaggi nasali con soluzione fisiologica o ipertonica, 2–3 volte al giorno.
- Paracetamolo 1 g fino a 3 volte al giorno o ibuprofene 400–600 mg ogni 8 ore dopo i pasti.
- [Spray nasale cortisonico (mometasone): 2 spruzzi per narice una volta al giorno per 10–14 giorni.]
- [Decongestionante nasale: al massimo 5 giorni.]
- [Antibiotico (se sintomi oltre 10 giorni o peggioramento dopo un miglioramento): amoxicillina/acido clavulanico 875/125 mg ogni 12 ore per 5–7 giorni.]

${controlli()}

${RITORNO}
- gonfiore o arrossamento attorno all'occhio, vista doppia o calo della vista;
- mal di testa molto forte, rigidità del collo, confusione;
- febbre alta persistente.`,
  },
  {
    id: 'bpco', nome: 'Riacutizzazione lieve di BPCO', gruppo: 'Respiratorie e ORL',
    testo: `Diagnosi: riacutizzazione lieve di broncopneumopatia cronica ostruttiva (BPCO).

Terapia:
- Salbutamolo spray 100 µg: 2–4 spruzzi con distanziatore ogni 4–6 ore per 5–7 giorni, poi al bisogno.
- Prednisone 25 mg: 2 compresse (40–50 mg) al mattino per 5 giorni, poi stop.
- [Antibiotico: amoxicillina/acido clavulanico 875/125 mg, 1 compressa ogni 12 ore per 5 giorni.]
- Continui la sua terapia inalatoria abituale [...].

Indicazioni:
- Non fumi. Controlli la tecnica di inalazione con il distanziatore.
- [Ossigeno: come già prescritto.]
- Se diabetico: controlli la glicemia più spesso durante il cortisone.

${controlli('[Si allega richiesta per visita pneumologica.]', 'Vaccinazioni antinfluenzale e antipneumococcica, se non eseguite.')}

${RITORNO}
- il fiato corto peggiora o non migliora con lo spray;
- labbra o unghie bluastre;
- sonnolenza, confusione, mal di testa al risveglio;
- febbre alta, dolore toracico, gonfiore alle gambe.`,
  },
  // ─── Cardiovascolare e allergie ───
  {
    id: 'orticaria', nome: 'Orticaria / reazione allergica senza anafilassi', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: orticaria acuta [con angioedema del ...] [reazione allergica cutanea] senza segni di anafilassi, [verosimilmente da ... / causa non identificata].
[In Pronto Soccorso ha ricevuto: ... Osservazione di ... ore senza ricomparsa dei sintomi.]

Terapia:
- Cetirizina 10 mg: 1 compressa la sera per [5–7] giorni, poi al bisogno. [Se il prurito persiste: 1 compressa mattina e sera.] Può dare sonnolenza: non guidi se si sente assonnato.
- [Solo se forma estesa o non risponde all'antistaminico: prednisone (Deltacortene) 25 mg, 1–2 compresse al mattino dopo colazione per 3–5 giorni, poi stop senza scalare.]

Indicazioni:
- [Non assuma più ... e farmaci della stessa famiglia; lo riferisca sempre a medici, dentisti e farmacisti.]
- Eviti la causa sospetta. Finché ha i ponfi eviti anche antinfiammatori e aspirina (ibuprofene, ketoprofene, ecc.: per il dolore usi paracetamolo), alcol, docce molto calde, sforzi intensi, indumenti stretti.
- I ponfi possono ricomparire per qualche giorno anche con la terapia: se sono solo sulla pelle, senza altri sintomi, non è un segno di gravità.

${controlli('[Si allega richiesta per visita allergologica.]')}

Chiami subito il 112 se, anche a distanza di ore:
- gonfiore di labbra, lingua o gola, voce cambiata, difficoltà a deglutire;
- difficoltà a respirare, fischi nel petto, tosse insistente;
- capogiri, sensazione di svenimento, palpitazioni;
- vomito ripetuto o forti dolori alla pancia insieme ai ponfi.`,
  },
  {
    id: 'sincope-vasovagale', nome: 'Sincope vasovagale', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: sincope riflessa (vasovagale) [scatenata da ...]. [ECG, esami del sangue e visita senza alterazioni significative.]

È uno svenimento benigno dovuto a un riflesso che abbassa per pochi secondi pressione e battito. Può ripetersi, ma non indica una malattia del cuore.

Come riconoscerla e cosa fare:
- Di solito è preceduta da avvisaglie: calore, sudore freddo, nausea, pallore, vista che si annebbia, orecchie ovattate.
- Alle prime avvisaglie si sdrai subito con le gambe sollevate, oppure si sieda con la testa tra le ginocchia: non cerchi di restare in piedi o di raggiungere un'altra stanza.
- Se non può sdraiarsi: incroci le gambe stringendo forte cosce e glutei, oppure stringa le mani a pugno e tiri le braccia agganciando le dita, finché i sintomi passano.
- Si rialzi lentamente quando si sente bene.

Prevenzione:
- Beva almeno 2–2,5 litri al giorno. [Se non ha pressione alta, problemi di cuore o di reni: non limiti il sale.]
- Eviti le situazioni scatenanti: stare a lungo in piedi fermo, ambienti caldi e affollati, disidratazione, digiuno, alcol, alzarsi di colpo; [vista di sangue/aghi: si faccia prelievi e iniezioni da sdraiato].
- Nei primi giorni eviti attività in cui uno svenimento sarebbe pericoloso: salire su scale o in altezza, nuotare da solo, usare macchinari pericolosi.
- Guida: [può guidare normalmente: gli episodi sono rari e preceduti da avvisaglie] / [non guidi fino alla valutazione del medico curante/cardiologo].

${controlli('[Si allega richiesta per visita cardiologica / ECG Holter / ecocardiogramma / tilt test.]')}

${RITORNO}
- svenimento durante uno sforzo o da sdraiato;
- svenimento improvviso senza avvisaglie, o preceduto da palpitazioni o dolore al torace;
- fiato corto, dolore al torace, battito molto veloce o irregolare;
- si è fatto male cadendo;
- svenimenti ripetuti a breve distanza.

Riferisca al medico se in famiglia ci sono state morti improvvise in giovane età.`,
  },
  {
    id: 'sincope-ortostatica', nome: 'Sincope ortostatica', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: sincope da ipotensione ortostatica [verosimilmente da disidratazione / farmaci / ...]. [Pressione sdraiato ... mmHg, in piedi ... mmHg.]

È uno svenimento dovuto al calo della pressione quando ci si alza in piedi.

Terapia:
- [Modifiche alla terapia: ... ridotto/sospeso fino a rivalutazione del medico curante.] Non sospenda di sua iniziativa gli altri farmaci.

Precauzioni:
- Si alzi in tre tempi: da sdraiato si sieda sul bordo del letto per 1–2 minuti muovendo le gambe, poi si alzi restando vicino a un appoggio, e cammini solo se non ha capogiri. Molta attenzione al mattino, dopo i pasti e di notte (per andare in bagno usi la luce e si sieda sul water).
- Prima di alzarsi muova piedi e gambe e stringa i pugni per alcuni secondi.
- Beva almeno 2 litri al giorno [salvo restrizioni per cuore o reni]; un bicchiere d'acqua prima di alzarsi può aiutare.
- Pasti piccoli e frequenti, pochi carboidrati semplici; eviti alcol, bagni e docce molto caldi, ambienti caldi, stare fermo a lungo in piedi.
- [Dorma con la testata del letto sollevata di 10–15 cm.] [Calze elastiche a compressione graduata, da indossare al mattino prima di alzarsi.]
- Alle prime avvisaglie (capogiro, vista annebbiata, debolezza) si sieda o si sdrai subito con le gambe sollevate.
- In casa: luce notturna, tolga tappeti e ostacoli, usi appoggi in bagno. Non salga su scale o sgabelli.
- Guida: [non guidi finché i capogiri non sono scomparsi e la terapia non è stata rivalutata].

${controlli('[Si allega richiesta per controllo della pressione sdraiato e in piedi presso il medico curante entro 1 settimana.]', '[Si allega richiesta per esami del sangue: ...]')}

${RITORNO}
- svenimento durante uno sforzo o da sdraiato;
- svenimento improvviso senza avvisaglie, o con palpitazioni o dolore al torace;
- fiato corto, battito molto veloce o irregolare;
- feci nere o vomito con sangue;
- si è fatto male cadendo, o gli svenimenti si ripetono nonostante le precauzioni.`,
  },
  // ─── Neurologia e traumi cranici ───
  {
    id: 'cefalea', nome: 'Cefalea / emicrania', gruppo: 'Neurologia e psiche',
    testo: `Diagnosi: cefalea [emicrania senza aura / cefalea di tipo tensivo]. La visita e gli accertamenti non hanno evidenziato segni di gravità.

Terapia all'inizio del dolore:
- Ibuprofene 400–600 mg dopo aver mangiato qualcosa, oppure paracetamolo 1 g; [+ metoclopramide 10 mg se nausea].
- [Emicrania: sumatriptan 50–100 mg, 1 compressa all'inizio dell'attacco; ripetibile dopo 2 ore, massimo 200 mg al giorno.]

Indicazioni:
- Non prenda antidolorifici per più di 10–15 giorni al mese: l'abuso fa venire più mal di testa.
- Tenga un diario degli attacchi (giorno, durata, farmaci, possibili cause: sonno, pasti saltati, alcol, ciclo).
- Sonno e pasti regolari, idratazione, riduca caffè e alcol.

${controlli('[Si allega richiesta per visita neurologica / centro cefalee.]')}

${RITORNO}
- il mal di testa più forte della sua vita, comparso all'improvviso;
- febbre con rigidità del collo o macchie sulla pelle;
- debolezza o formicolio di braccio/gamba, bocca storta, difficoltà a parlare, disturbi della vista, confusione, convulsioni;
- mal di testa dopo un trauma, o che peggiora giorno dopo giorno.`,
  },
  {
    id: 'trauma-cranico', nome: 'Trauma cranico lieve', gruppo: 'Neurologia e psiche',
    testo: `Diagnosi: trauma cranico lieve [non commotivo / commotivo] [TC encefalo del ...: negativa per lesioni acute]. GCS 15 alla dimissione.

Si consegna il foglio informativo per l'osservazione domiciliare dopo trauma cranico.

Indicazioni:
- Un familiare o un amico deve sapere quanto accaduto e controllare le sue condizioni per almeno 24 ore.
- Riprenda gradualmente le normali attività. Nei primi giorni: cibi semplici e digeribili, niente alcol, eviti attività che possano causare un nuovo trauma, buona igiene del sonno, eviti esposizione prolungata a schermi e rumori intensi.
- Per il dolore: paracetamolo 1000 mg 1 compressa ogni 8 ore, oppure ibuprofene 400 mg 1 compressa ogni 8 ore a stomaco pieno, se non controindicati.
- Nei giorni successivi sono normali e tendono a migliorare: mal di testa, stanchezza, sensazione di instabilità, fastidio per luci e rumori, difficoltà di concentrazione o memoria, irritabilità, sonno alterato. Se non migliorano o la preoccupano, contatti il medico curante.
- Può aver bisogno di alcuni giorni di riposo dal lavoro o dalla scuola (di solito non più di 2–3).

${controlli('Il medico curante darà indicazioni sul ritorno al lavoro, alla scuola e all\'attività fisica.')}

Rivalutazione medica urgente (torni in Pronto Soccorso o chiami il 112) se:
- mal di testa che peggiora e non passa con gli antidolorifici;
- nausea importante o vomito ripetuto;
- comportamento insolito, confusione, agitazione, aggressività;
- sonnolenza, difficoltà a restare sveglio;
- difficoltà a parlare o nella coordinazione, debolezza o impossibilità a muovere un braccio o una gamba;
- convulsioni;
- perdita di coscienza.
Questi sintomi possono comparire anche a distanza di settimane, soprattutto negli anziani o in chi assume antiaggreganti o anticoagulanti: in quel caso riferisca al medico il trauma recente.`,
  },
  {
    id: 'trauma-cranico-tao', nome: 'Trauma cranico in terapia anticoagulante', gruppo: 'Neurologia e psiche',
    testo: `Diagnosi: trauma cranico lieve in paziente in terapia [anticoagulante con warfarin / apixaban / rivaroxaban / dabigatran / edoxaban] [antiaggregante con ...]. [TC encefalo del ... ore ...: negativa per lesioni acute.] GCS 15 alla dimissione.

Si consegna il foglio informativo per l'osservazione domiciliare dopo trauma cranico.

Terapia anticoagulante/antiaggregante:
- [Prosegua la terapia come di consueto.] / [Sospenda ... fino al ... e ricontatti il medico curante/centro TAO prima di riprenderla.]
- [INR del ...: ... Controllo INR il ... presso il centro TAO.]

Indicazioni:
- Un familiare o un amico deve sapere quanto accaduto e controllare le sue condizioni per almeno 24 ore.
- Riprenda gradualmente le normali attività. Nei primi giorni: cibi semplici e digeribili, niente alcol, eviti attività che possano causare un nuovo trauma, buona igiene del sonno, eviti esposizione prolungata a schermi e rumori intensi.
- Per il dolore: paracetamolo 1000 mg 1 compressa ogni 8 ore. Eviti antinfiammatori (ibuprofene, ketoprofene, aspirina, ecc.), che aumentano il rischio di sanguinamento.
- Nei giorni successivi sono normali e tendono a migliorare: mal di testa lieve, stanchezza, sensazione di instabilità, fastidio per luci e rumori, difficoltà di concentrazione o memoria, irritabilità, sonno alterato. Se non migliorano o la preoccupano, contatti il medico curante.

${controlli()}

Rivalutazione medica urgente (torni in Pronto Soccorso o chiami il 112) se:
- mal di testa che peggiora e non passa con il paracetamolo;
- nausea importante o vomito ripetuto;
- comportamento insolito, confusione, agitazione, aggressività;
- sonnolenza, difficoltà a restare sveglio;
- difficoltà a parlare o nella coordinazione, debolezza o impossibilità a muovere un braccio o una gamba;
- convulsioni;
- perdita di coscienza;
- nuove cadute.
Chi assume anticoagulanti o antiaggreganti può avere questi sintomi anche a distanza di settimane dal trauma: in quel caso torni subito e riferisca il trauma recente e la terapia che assume.`,
  },
  // ─── Muscoli, articolazioni, cute ───
  {
    id: 'ferita', nome: 'Ferita suturata', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: ferita lacero-contusa [sede ...], suturata con [n. ... punti / colla / strip].
[Profilassi antitetanica: eseguita / già coperta (ultima dose ...).]

Indicazioni:
- Tenga la medicazione pulita e asciutta per 48 ore; poi può fare la doccia e asciugare tamponando. Niente bagni, piscina, mare finché non si tolgono i punti.
- Medicazione [ogni 2–3 giorni] con disinfettante e garza, dal medico curante, in ambulatorio infermieristico o a casa.
- [Antibiotico: amoxicillina/acido clavulanico 875/125 mg ogni 12 ore per 5 giorni.]
- Dolore: paracetamolo 1 g fino a 3 volte al giorno.
- Dopo la guarigione protegga la cicatrice dal sole per 6–12 mesi (crema protezione alta).

Rimozione dei punti tra [indicare]:
- viso 5 giorni; cuoio capelluto 7–10 giorni; tronco e braccia 10 giorni; gambe e piedi 12–14 giorni; sopra le articolazioni 14 giorni.

${controlli()}

${RITORNO}
- arrossamento che si allarga, calore, gonfiore, pus o cattivo odore;
- febbre;
- la ferita si riapre o sanguina molto;
- formicolio o perdita di sensibilità/forza a valle della ferita.`,
  },
  {
    id: 'distorsione-caviglia', nome: 'Distorsione di caviglia', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: distorsione della caviglia [destra/sinistra] [di grado lieve/moderato]. [Radiografia negativa per fratture.]

Terapia:
- Ibuprofene 600 mg 1 compressa ogni 8 ore dopo i pasti per 5 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Tutore/cavigliera: da indossare quando cammina per 2–3 settimane.]
- [Diclofenac gel (es. Voltaren Emulgel 1%): applicare sulla zona dolente 3–4 volte al giorno per 7–14 giorni, spalmando senza massaggiare con forza, su cute integra; lavarsi le mani dopo.]
- [In alternativa ketoprofene schiuma/gel (es. Artrosilene schiuma 15%): 2–3 applicazioni al giorno per massimo 7–10 giorni. Non esporre la zona trattata al sole o a lampade abbronzanti durante la terapia e per 2 settimane dopo (rischio di reazioni da fotosensibilità); coprire la zona.]

Indicazioni per i primi 2–3 giorni:
- Riposo relativo; ghiaccio avvolto in un panno per 15–20 minuti ogni 2–3 ore; fasciatura elastica; piede sollevato sopra il livello del cuore quando è seduto o sdraiato.
- Carico sul piede quanto tollerato dal dolore [con stampelle se necessario].
- Dopo 3–5 giorni inizi a muovere la caviglia (cerchi, flesso-estensione) e riprenda gradualmente a camminare normalmente. Lo sport dopo 4–6 settimane.
- [Immobilizzazione rigida: profilassi antitrombotica con enoxaparina 4000 UI sottocute 1 volta al giorno fino alla rimozione.]

${controlli('[Si allega richiesta per visita ortopedica.]', '[Si consiglia valutazione fisioterapica per la rieducazione (equilibrio e propriocezione), che riduce il rischio di nuove distorsioni.]')}

${RITORNO}
- dolore che peggiora nonostante la terapia;
- piede freddo, pallido, formicolio o perdita di sensibilità;
- gonfiore e dolore al polpaccio, fiato corto o dolore al torace (possibile trombosi).`,
  },
  {
    id: 'distorsione-ginocchio', nome: 'Distorsione di ginocchio', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: distorsione del ginocchio [destro/sinistro]. [Radiografia negativa per fratture.]

Terapia:
- Ibuprofene 600 mg 1 compressa ogni 8 ore dopo i pasti per 5 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Ginocchiera elastica / tutore articolato.] [Stampelle con carico parziale.]
- [Diclofenac gel (es. Voltaren Emulgel 1%): applicare sulla zona dolente 3–4 volte al giorno per 7–14 giorni, spalmando senza massaggiare con forza, su cute integra; lavarsi le mani dopo.]
- [In alternativa ketoprofene schiuma/gel (es. Artrosilene schiuma 15%): 2–3 applicazioni al giorno per massimo 7–10 giorni. Non esporre la zona trattata al sole o a lampade abbronzanti durante la terapia e per 2 settimane dopo (rischio di reazioni da fotosensibilità); coprire la zona.]

Indicazioni:
- Primi 2–3 giorni: riposo relativo, ghiaccio in un panno 15–20 minuti ogni 2–3 ore, gamba sollevata.
- Carico quanto tollerato dal dolore; dopo qualche giorno inizi a piegare ed estendere il ginocchio senza forzare.
- [Profilassi antitrombotica con enoxaparina 4000 UI sottocute 1 volta al giorno se immobilizzato.]

${controlli('[Si allega richiesta per visita ortopedica entro 7–10 giorni.]', '[Si consiglia valutazione fisioterapica per il recupero del movimento e della forza.]')}

${RITORNO}
- il ginocchio si blocca e non riesce a stenderlo;
- gonfiore improvviso e importante, arrossamento e calore, febbre;
- gamba fredda, formicolio, gonfiore e dolore al polpaccio.`,
  },
  {
    id: 'stiramento', nome: 'Stiramento / lesione muscolare', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: stiramento muscolare [sede ...].

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno; [ibuprofene 600 mg ogni 8 ore dopo i pasti dal 3° giorno, per 5 giorni].
- [Diclofenac gel (es. Voltaren Emulgel 1%): applicare sulla zona dolente 3–4 volte al giorno per 7–14 giorni, spalmando senza massaggiare con forza, su cute integra; lavarsi le mani dopo.]
- [In alternativa ketoprofene schiuma/gel (es. Artrosilene schiuma 15%): 2–3 applicazioni al giorno per massimo 7–10 giorni. Non esporre la zona trattata al sole o a lampade abbronzanti durante la terapia e per 2 settimane dopo (rischio di reazioni da fotosensibilità); coprire la zona.]

Indicazioni:
- Primi 3 giorni (fase acuta): riposo del muscolo, ghiaccio in un panno 15–20 minuti ogni 2–3 ore, eventuale fasciatura compressiva, arto sollevato. NON applichi calore, NON massaggi e non faccia stretching: aumentano il sanguinamento nel muscolo e il gonfiore. Niente alcol.
- Dal 4° giorno, se gonfiore e livido stanno diminuendo: calore locale (20 minuti 2–3 volte al giorno) e massaggio leggero, ripresa graduale del movimento e stretching dolce senza dolore.
- Ritorno allo sport solo quando il movimento è completo, senza dolore e con forza recuperata (di solito 2–6 settimane, di più per le lesioni estese).

${controlli('[Si allega richiesta per ecografia muscolare a 5–7 giorni.]', '[Si consiglia valutazione fisioterapica per un programma di recupero graduale prima del ritorno allo sport.]')}

${RITORNO}
- gonfiore importante e duro, livido che si allarga rapidamente;
- formicolio, perdita di forza, arto freddo o pallido;
- gonfiore e dolore al polpaccio.`,
  },
  {
    id: 'contrattura', nome: 'Contrattura muscolare', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: contrattura muscolare [cervicale / dorsale / lombare / ...].

Terapia:
- Ibuprofene 600 mg 1 compressa ogni 8 ore dopo i pasti per 5 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Tiocolchicoside 4 mg: 1 capsula ogni 12 ore per massimo 7 giorni. Non in gravidanza o allattamento.]
- [Diclofenac gel (es. Voltaren Emulgel 1%): applicare sulla zona dolente 3–4 volte al giorno per 7–14 giorni, spalmando senza massaggiare con forza, su cute integra; lavarsi le mani dopo.]
- [In alternativa ketoprofene schiuma/gel (es. Artrosilene schiuma 15%): 2–3 applicazioni al giorno per massimo 7–10 giorni. Non esporre la zona trattata al sole o a lampade abbronzanti durante la terapia e per 2 settimane dopo (rischio di reazioni da fotosensibilità); coprire la zona.]

Indicazioni:
- Nella contrattura (senza trauma diretto né livido) il calore è utile da subito: borsa dell'acqua calda o cerotti autoriscaldanti 20 minuti più volte al giorno; non applicare calore sullo stesso punto del gel/schiuma antinfiammatoria e non dormire con fonti di calore sulla pelle.
- Massaggio leggero e decontratturante consentito da subito, senza provocare dolore.
- Movimento leggero e stretching dolce; eviti posture fisse prolungate e sforzi.

${controlli('[Si consiglia valutazione fisioterapica se il dolore persiste oltre 1–2 settimane o se gli episodi si ripetono.]')}

${RITORNO}
- debolezza o formicolio di braccia o gambe;
- febbre;
- dolore al torace, fiato corto.`,
  },
  {
    id: 'lombalgia', nome: 'Lombalgia acuta', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: lombalgia acuta aspecifica. Non sono emersi segni di malattia grave.

Il mal di schiena acuto migliora nella maggior parte dei casi in 2–6 settimane.

Terapia:
- Ibuprofene 600 mg 1 compressa ogni 8 ore dopo i pasti per 5–7 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Tiocolchicoside 4 mg: 1 capsula ogni 12 ore per massimo 7 giorni.]

Indicazioni:
- Resti attivo: il riposo a letto rallenta la guarigione. Cammini e riprenda gradualmente le attività abituali, anche con un po' di dolore.
- Calore locale; eviti di sollevare pesi e di stare fermo a lungo nella stessa posizione.

${controlli()}

${RITORNO}
- perdita di urine o feci, oppure non riesce a urinare;
- formicolio o insensibilità nella zona genitale/anale («a sella»);
- debolezza di una o entrambe le gambe;
- febbre, perdita di peso, dolore che peggiora di notte e a riposo.`,
  },
  {
    id: 'lombosciatalgia', nome: 'Lombosciatalgia', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: lombosciatalgia [destra/sinistra] senza deficit neurologici.

Nella maggior parte dei casi migliora in 4–6 settimane.

Terapia:
- Ibuprofene 600 mg 1 compressa ogni 8 ore dopo i pasti per 7 giorni, con [pantoprazolo 20 mg al mattino], oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Tiocolchicoside 4 mg: 1 capsula ogni 12 ore per massimo 7 giorni.]
- [Per il dolore forte: paracetamolo/codeina 500/30 mg, 1 compressa fino a 3 volte al giorno per pochi giorni. Può dare sonnolenza e stitichezza: non guidi.]

Indicazioni:
- Resti attivo per quanto possibile; eviti il riposo a letto prolungato, i sollevamenti e le posizioni che scatenano il dolore.

${controlli('[Si allega richiesta per visita fisiatrica.]')}

${RITORNO}
- perdita di urine o feci, oppure non riesce a urinare;
- insensibilità nella zona genitale/anale;
- debolezza della gamba (piede che «cade», non riesce a camminare sulle punte o sui talloni);
- dolore a entrambe le gambe, febbre.`,
  },
  // ─── Infezioni ───
  {
    id: 'cistite', nome: 'Cistite non complicata', gruppo: 'Infezioni',
    testo: `Diagnosi: cistite acuta non complicata. [Urinocoltura eseguita: il risultato andrà visionato dal medico curante.]

Terapia:
- [Fosfomicina 3 g: 1 bustina sciolta in mezzo bicchiere d'acqua, la sera a vescica vuota, a stomaco vuoto, dose unica.]
- [Oppure nitrofurantoina 100 mg: 1 capsula ogni 6 ore per 5 giorni, durante i pasti. Può colorare le urine di scuro.]
- Paracetamolo 1 g fino a 3 volte al giorno per bruciore e dolore.

Indicazioni:
- Beva 1,5–2 litri al giorno e non trattenga a lungo l'urina.
- I disturbi migliorano in 2–3 giorni; un lieve bruciore può durare qualche giorno dopo la fosfomicina.

${controlli()}

${RITORNO}
- febbre sopra 38 °C o brividi;
- dolore al fianco o alla schiena;
- vomito che impedisce di prendere la terapia;
- nessun miglioramento dopo 48–72 ore.`,
  },
  {
    id: 'pielonefrite', nome: 'Pielonefrite non complicata', gruppo: 'Infezioni',
    testo: `Diagnosi: pielonefrite acuta [destra/sinistra] non complicata. [Ecografia: non dilatazione delle vie urinarie.] [Urinocoltura ed emocolture eseguite: il risultato andrà visionato dal medico curante per adeguare la terapia.]
[In Pronto Soccorso: ceftriaxone 1 g ev.]

Terapia:
- [Cefixima 400 mg: 1 compressa al giorno, sempre alla stessa ora, per ... giorni (in totale 7–10 giorni di antibiotico).] Lo prenda fino alla fine anche se sta meglio.
- Paracetamolo 1 g fino a 3 volte al giorno per febbre e dolore.

Indicazioni:
- Beva almeno 2 litri al giorno; riposo.
- La febbre può durare ancora 48–72 ore dall'inizio dell'antibiotico.

${controlli('[Controllo dal medico curante entro 48–72 ore con il risultato dell\'urinocoltura.]')}

${RITORNO}
- febbre che non migliora dopo 72 ore di terapia;
- brividi scuotenti, pressione bassa, capogiri, confusione;
- vomito che impedisce di prendere l'antibiotico o di bere;
- urina molto poco o il dolore aumenta.`,
  },
  {
    id: 'cellulite', nome: 'Cellulite / erisipela', gruppo: 'Infezioni',
    testo: `Diagnosi: [cellulite / erisipela] [sede ...]. I margini dell'arrossamento sono stati segnati con il pennarello.

Terapia:
- [Cefalessina 500 mg: 1 compressa ogni 6 ore per 5–7 giorni] [oppure amoxicillina/acido clavulanico 875/125 mg ogni 8 ore per 5–7 giorni].
- Paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Tenga l'arto sollevato il più possibile (gamba sopra il livello del cuore da seduto e da sdraiato).
- Nelle prime 24–48 ore l'arrossamento può ancora allargarsi un poco: è atteso se la febbre scende e lei sta meglio.
- Curi le eventuali porte d'ingresso: screpolature tra le dita dei piedi, micosi, ferite, pelle secca (crema idratante).

${controlli('[Controllo dal medico curante a 48–72 ore per verificare la risposta alla terapia.]')}

${RITORNO}
- l'arrossamento continua ad allargarsi molto oltre i segni dopo 48 ore di antibiotico;
- febbre alta, brividi, malessere importante;
- dolore molto più forte di quanto ci si aspetterebbe, bolle scure, pelle grigia o insensibile, crepitio sotto la pelle;
- strie rosse che risalgono l'arto.`,
  },
  {
    id: 'zoster', nome: 'Herpes zoster (fuoco di Sant’Antonio)', gruppo: 'Infezioni',
    testo: `Diagnosi: herpes zoster [sede/dermatomero ...].

Terapia:
- [Valaciclovir 1 g: 1 compressa ogni 8 ore per 7 giorni.] Lo inizi il prima possibile: è utile soprattutto entro 72 ore dalla comparsa delle vescicole.
- Dolore: paracetamolo 1 g fino a 3 volte al giorno, [ibuprofene 600 mg ogni 8 ore dopo i pasti]. [Se il dolore è forte: ...]

Indicazioni:
- Tenga le vescicole pulite e asciutte e coperte da indumenti o garze; non le gratti. Niente creme o pomate antibiotiche se non prescritte.
- Finché le vescicole non sono tutte crostose è contagioso (può causare varicella) per chi non l'ha mai avuta: eviti contatti con donne in gravidanza, neonati, persone immunodepresse.
- Il dolore può durare anche dopo la guarigione della pelle (nevralgia post-erpetica): ne parli con il medico curante.
- Dopo la guarigione chieda al medico curante del vaccino contro l'herpes zoster.

${controlli()}

${RITORNO}
- vescicole sulla fronte, sul naso o vicino all'occhio, occhio rosso o dolente, calo della vista;
- mal di testa forte, rigidità del collo, confusione, debolezza di braccia o gambe;
- paralisi di metà del viso o dolore e vescicole all'orecchio;
- vescicole diffuse su tutto il corpo, febbre alta;
- segni di infezione delle lesioni (pus, arrossamento che si allarga).`,
  },
  // ─── Cardiovascolare (altre) ───
  {
    id: 'dolore-toracico', nome: 'Dolore toracico non cardiaco', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: dolore toracico [di verosimile origine muscolo-scheletrica / da reflusso / non specifico]. [ECG e dosaggi seriati della troponina nella norma.] Gli accertamenti eseguiti oggi non hanno evidenziato un infarto né altre cause che richiedano il ricovero.

Terapia:
- [Dolore di parete: paracetamolo 1 g fino a 3 volte al giorno o ibuprofene 600 mg ogni 8 ore dopo i pasti per 5 giorni.]
- [Reflusso: pantoprazolo 40 mg al mattino a digiuno per 4 settimane.]

Indicazioni:
- Gli esami di oggi escludono un evento acuto in corso, ma non sostituiscono una valutazione del rischio cardiovascolare nel tempo: la completi con il medico curante.
- Non fumi.

${controlli('[Si allega richiesta per visita cardiologica con test da sforzo / ...]')}

Chiami subito il 112 (non venga con mezzi propri) se:
- dolore al petto oppressivo o che si irradia a braccio, collo, mandibola o schiena, che dura più di 10–15 minuti o compare sotto sforzo;
- dolore con sudore freddo, nausea, fiato corto, svenimento o palpitazioni;
- fiato corto improvviso o dolore che aumenta respirando, specie con una gamba gonfia;
- dolore improvviso e lacerante al torace o alla schiena.`,
  },
  {
    id: 'ipertensione', nome: 'Pressione alta senza danno d’organo', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: valori pressori elevati [... / ... mmHg] senza segni di danno d'organo (urgenza ipertensiva / ipertensione asintomatica). [ECG ed esami eseguiti senza alterazioni acute.]

Non è necessario abbassare la pressione rapidamente: una riduzione graduale nei prossimi giorni è più sicura.

Terapia:
- [Prosegua la terapia abituale e la assuma regolarmente.] [Si aggiunge: ...]
- Non prenda farmaci «al bisogno» per abbassare la pressione di sua iniziativa.

Indicazioni:
- Misuri la pressione a casa per 7 giorni: al mattino prima dei farmaci e la sera, seduto da 5 minuti, 2 misurazioni a 1 minuto di distanza; scriva i valori e li porti al medico curante.
- Riduca il sale, l'alcol e la liquirizia; attività fisica regolare; non fumi. Eviti decongestionanti nasali e antinfiammatori (ibuprofene, ketoprofene, ecc.) se possibile.
- Se la pressione è alta ma lei sta bene, non serve tornare in Pronto Soccorso: ne parli con il medico curante.

${controlli('[Si allega richiesta per esami del sangue e delle urine / ecocardiogramma / visita cardiologica.]')}

${RITORNO}
- dolore al torace, fiato corto, battito irregolare;
- mal di testa improvviso e molto forte, confusione, sonnolenza;
- debolezza o formicolio di braccio/gamba, bocca storta, difficoltà a parlare;
- disturbi della vista;
- sangue dal naso che non si ferma.`,
  },
  {
    id: 'tvp', nome: 'Trombosi venosa profonda (cura a domicilio)', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: trombosi venosa profonda [della vena ... dell'arto inferiore destro/sinistro] [provocata da ... / non provocata].

Terapia anticoagulante (per almeno 3 mesi, poi rivalutazione):
- [Apixaban 5 mg: 2 compresse ogni 12 ore per 7 giorni (fino al ...), poi 1 compressa ogni 12 ore.]
- [Rivaroxaban 15 mg: 1 compressa ogni 12 ore durante i pasti per 21 giorni (fino al ...), poi rivaroxaban 20 mg 1 compressa al giorno durante il pasto principale.]
- Non salti dosi e non sospenda senza indicazione medica. Riferisca la terapia a ogni medico, dentista e farmacista.
- Eviti antinfiammatori e aspirina (salvo prescrizione): per il dolore usi paracetamolo.

Indicazioni:
- Cammini: non serve stare a letto. Tenga la gamba sollevata quando è seduto o sdraiato.
- [Calza elastica a compressione graduata (II classe) durante il giorno, se riduce gonfiore e dolore.]
- Eviti sport con rischio di traumi.

${controlli('[Si allega richiesta per visita angiologica entro ... settimane.]')}

${RITORNO}
- fiato corto improvviso, dolore al torace, tosse con sangue, svenimento, battito accelerato;
- sanguinamenti: feci nere o con sangue, vomito con sangue, urine rosse, sangue dal naso o dalle gengive che non si ferma, lividi estesi;
- mal di testa forte e improvviso o dopo un trauma alla testa;
- gamba molto più gonfia, fredda, bluastra o molto dolente.`,
  },
  {
    id: 'fa', nome: 'Fibrillazione atriale (dimissione)', gruppo: 'Cardiovascolare e allergie',
    testo: `Diagnosi: fibrillazione atriale [di nuova insorgenza / parossistica / persistente] [cardiovertita a ritmo sinusale con ... / a frequenza controllata].
[CHA2DS2-VA: ... — HAS-BLED: ...]

Terapia:
- [Anticoagulante: apixaban 5 mg 1 compressa ogni 12 ore / ... — da proseguire senza interruzioni: riduce il rischio di ictus.]
- [Controllo della frequenza: bisoprololo ... mg / ...]
- [Antiaritmico: ...]
- [Strategia «pill in the pocket»: flecainide ... mg in caso di nuovo episodio, come spiegato.]

Indicazioni:
- Riduca alcol e caffeina; non fumi; curi il sonno (russamento e apnee notturne favoriscono la fibrillazione). Controlli il peso e la pressione.
- Impari a sentire il polso (regolare/irregolare) e annoti gli episodi.
- Eviti antinfiammatori e aspirina se in terapia anticoagulante.

${controlli('[Si allega richiesta per visita cardiologica con ecocardiogramma / ECG Holter / esami tiroidei.]')}

${RITORNO}
- palpitazioni che non passano, con fiato corto, dolore al torace, capogiri o svenimento;
- debolezza o formicolio di braccio/gamba, bocca storta, difficoltà a parlare o a vedere (chiami il 112);
- sanguinamenti importanti (feci nere, vomito o urine con sangue).`,
  },
  // ─── Neurologia e psiche (altre) ───
  {
    id: 'vppb', nome: 'Vertigine parossistica posizionale', gruppo: 'Neurologia e psiche',
    testo: `Diagnosi: vertigine parossistica posizionale benigna [canale posteriore/laterale, destra/sinistra]. [Eseguita in PS manovra di riposizionamento (Epley/...).]

È causata da piccoli cristalli dell'orecchio interno che si spostano: dà vertigini brevi (meno di 1 minuto) cambiando posizione della testa. Non è un problema del cervello.

Terapia:
- [Nausea: metoclopramide 10 mg 1 compressa fino a 3 volte al giorno, al bisogno, per pochi giorni. Può dare sonnolenza.]
- I farmaci «per la vertigine» presi a lungo non servono e rallentano il recupero.

Indicazioni:
- Nelle prime 24–48 ore dorma con la testa leggermente sollevata e, se possibile, non sul lato [destro/sinistro].
- Si alzi lentamente; attenzione a scale, guida e movimenti bruschi finché le vertigini non sono passate.
- La vertigine può ripresentarsi anche dopo settimane o mesi: la manovra si può ripetere.
- [Esercizi da fare a casa come spiegato: ...]

${controlli('[Si allega richiesta per visita otorinolaringoiatrica/otoneurologica se le vertigini persistono.]')}

${RITORNO}
- vertigine continua che non passa a riposo, impossibilità a stare in piedi o camminare;
- mal di testa forte e improvviso, dolore al collo;
- vista doppia, difficoltà a parlare o a deglutire, debolezza o formicolio di braccio/gamba, bocca storta;
- calo improvviso dell'udito.`,
  },
  {
    id: 'panico', nome: 'Attacco di panico / crisi d’ansia', gruppo: 'Neurologia e psiche',
    testo: `Diagnosi: attacco di panico [crisi d'ansia]. [Visita, ECG ed esami eseguiti senza alterazioni.]

I sintomi che ha avuto (palpitazioni, fiato corto, oppressione al petto, formicolii, vertigine, paura di morire) sono reali e spiacevoli, ma non pericolosi: nell'attacco di panico non c'è un danno al cuore né al cervello.

Cosa fare se ricapita:
- Si sieda in un posto tranquillo e rallenti il respiro: inspiri dal naso contando fino a 4, espiri lentamente dalla bocca contando fino a 6, per alcuni minuti.
- Si ricordi che l'attacco raggiunge il massimo in pochi minuti e poi passa da solo.
- Riduca caffè, energy drink, alcol; dorma regolarmente; faccia attività fisica.
- [Terapia: ...]

${controlli('[Si allega richiesta per valutazione presso il Centro di Salute Mentale / psicologo.]')}

${RITORNO}
- dolore al petto diverso dal solito, sotto sforzo o con sudore freddo;
- svenimento;
- fiato corto che non migliora;
- pensieri di farsi del male (chiami il 112).`,
  },
  // ─── Respiratorie e ORL (altre) ───
  {
    id: 'epistassi', nome: 'Epistassi', gruppo: 'Respiratorie e ORL',
    testo: `Diagnosi: epistassi [anteriore destra/sinistra] [trattata con ...]. [Tampone nasale: da rimuovere il ... presso ...]

Se il naso sanguina di nuovo:
- Si sieda con la testa leggermente in avanti (non indietro) e sputi il sangue che arriva in gola.
- Stringa con pollice e indice la parte morbida del naso, sotto l'osso, per 10–15 minuti di fila senza lasciare per controllare. Può mettere ghiaccio sul dorso del naso.
- Se dopo 20 minuti di compressione continua sanguina ancora, torni in Pronto Soccorso.

Per i prossimi 7–10 giorni:
- Non si soffi il naso con forza, starnutisca a bocca aperta, non metta dita o oggetti nel naso.
- Eviti bevande e cibi molto caldi, alcol, sforzi, sollevamento pesi, esposizione al sole e saune.
- [Unguento/pomata nasale (es. vaselina) 2 volte al giorno nella narice per tenere umida la mucosa.] Umidifichi gli ambienti.
- [Terapia anticoagulante/antiaggregante: prosegua / sospenda ... fino al ...]
- Controlli la pressione arteriosa nei prossimi giorni.

${controlli('[Si allega richiesta per visita otorinolaringoiatrica.]')}

${RITORNO}
- il sangue non si ferma dopo 20 minuti di compressione continua;
- sangue abbondante dalla bocca, vomito di sangue;
- capogiri, svenimento, pallore, battito accelerato;
- febbre o dolore al viso con il tampone nel naso.`,
  },
  // ─── Traumi (altre) ───
  {
    id: 'colpo-frusta', nome: 'Distorsione cervicale (colpo di frusta)', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: distorsione del rachide cervicale [da incidente stradale del ...]. [Radiografia/TC negativa per fratture.] [Esame neurologico nella norma.]

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno e/o ibuprofene 600 mg ogni 8 ore dopo i pasti per 5–7 giorni.
- [Tiocolchicoside 4 mg: 1 capsula ogni 12 ore per massimo 7 giorni.]
- [Diclofenac gel 1%: sulla zona dolente 3–4 volte al giorno.]

Indicazioni:
- Il collare non serve e rallenta la guarigione: muova il collo dolcemente in tutte le direzioni, entro il limite del dolore, più volte al giorno.
- Prosegua le attività quotidiane; il calore locale (borsa dell'acqua calda) può aiutare dopo i primi giorni.
- Dolore e rigidità possono peggiorare nei primi 1–2 giorni e di solito migliorano in 2–3 settimane.
- Eviti di guidare finché non riesce a girare bene la testa.

${controlli('[Si consiglia valutazione fisioterapica se il dolore persiste oltre 2–3 settimane.]')}

${RITORNO}
- debolezza, formicolio o insensibilità di braccia o gambe;
- difficoltà a camminare o a controllare urine e feci;
- mal di testa forte, vertigini, disturbi della vista o della parola;
- dolore che aumenta nonostante la terapia.`,
  },
  {
    id: 'costale', nome: 'Trauma toracico / frattura costale', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: [contusione toracica / frattura della ... costa destra/sinistra] senza complicanze (non pneumotorace, non versamento).

Le costole guariscono da sole in 3–6 settimane. L'obiettivo della terapia è controllare il dolore così da respirare a fondo e tossire bene, per evitare la polmonite.

Terapia:
- Paracetamolo 1 g ogni 8 ore regolarmente per i primi giorni, [più ibuprofene 600 mg ogni 8 ore dopo i pasti per 5–7 giorni].
- [Per il dolore forte: ... Può dare sonnolenza e stitichezza: non guidi.]

Indicazioni:
- Ogni ora, da sveglio, faccia 10 respiri profondi lenti, trattenendo l'aria 2–3 secondi.
- Non trattenga la tosse: tossisca tenendo un cuscino premuto sulla zona dolente.
- Non usi fasce strette sul torace. Si muova e cammini; dorma semiseduto se più comodo.
- Non fumi. Eviti sport di contatto e sollevamento pesi per almeno 4–6 settimane.

${controlli()}

${RITORNO}
- fiato corto che aumenta, respiro veloce, labbra bluastre;
- tosse con sangue;
- febbre, tosse con catarro;
- dolore che aumenta nonostante la terapia, capogiri, svenimento, dolore alla pancia.`,
  },
  {
    id: 'polso', nome: 'Trauma del polso (radiografia negativa)', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: distorsione/contusione del polso [destro/sinistro]. Radiografia negativa per fratture.
[Dolore alla tabacchiera anatomica: possibile frattura dello scafoide non visibile alla prima radiografia. Si applica tutore/gesso che includa il pollice.]

Terapia:
- Ibuprofene 600 mg ogni 8 ore dopo i pasti per 5 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Diclofenac gel 1%: 3–4 volte al giorno sulla zona dolente.]
- [Tutore/polsiera: da tenere per ... giorni.]

Indicazioni:
- Primi 2–3 giorni: ghiaccio in un panno 15–20 minuti ogni 2–3 ore, mano sollevata sopra il livello del cuore. Tolga anelli e braccialetti.
- Muova le dita più volte al giorno.

${controlli('[Si allega richiesta per radiografia di controllo dello scafoide a 10–14 giorni e visita ortopedica.]')}

${RITORNO}
- dita fredde, bianche o bluastre, formicolio o perdita di sensibilità;
- dolore che aumenta molto, soprattutto se il tutore/gesso stringe;
- gonfiore importante che non diminuisce sollevando la mano.`,
  },
  {
    id: 'spalla', nome: 'Trauma della spalla (radiografia negativa)', gruppo: 'Traumi e muscoli',
    testo: `Diagnosi: contusione/distorsione della spalla [destra/sinistra]. Radiografia negativa per fratture e lussazioni.

Terapia:
- Ibuprofene 600 mg ogni 8 ore dopo i pasti per 5–7 giorni, oppure paracetamolo 1 g fino a 3 volte al giorno.
- [Diclofenac gel 1%: 3–4 volte al giorno sulla zona dolente.]
- [Reggibraccio solo per alcuni giorni, per il dolore.]

Indicazioni:
- Ghiaccio in un panno 15–20 minuti più volte al giorno nei primi 2–3 giorni.
- Non tenga il braccio fermo a lungo: dal secondo-terzo giorno faccia movimenti dolci (pendolo: busto inclinato in avanti e braccio rilassato che oscilla), entro il limite del dolore, per evitare che la spalla si irrigidisca.
- Eviti di sollevare pesi e movimenti sopra la testa per 2–3 settimane.

${controlli('[Si allega richiesta per visita ortopedica / ecografia della spalla se dopo 2–3 settimane il dolore o la debolezza nel sollevare il braccio persistono.]', '[Si consiglia valutazione fisioterapica.]')}

${RITORNO}
- braccio freddo, pallido, formicolio o perdita di forza della mano;
- gonfiore o livido che aumentano rapidamente;
- dolore che aumenta nonostante la terapia.`,
  },
  // ─── Cute, ustioni, morsi ───
  {
    id: 'ustione', nome: 'Ustione superficiale', gruppo: 'Cute, ustioni e morsi',
    testo: `Diagnosi: ustione di [1° / 2° grado superficiale] [sede ...], estensione circa ...%. [Profilassi antitetanica: eseguita / già coperta.]

Terapia:
- Paracetamolo 1 g fino a 3 volte al giorno o ibuprofene 400–600 mg ogni 8 ore dopo i pasti.
- [Medicazione con ... da rinnovare ogni 2–3 giorni (o prima se bagnata o sporca) presso ...]

Indicazioni:
- Tenga la medicazione pulita e asciutta. Non applichi ghiaccio, olio, dentifricio o rimedi casalinghi.
- Non rompa le bolle: proteggono la pelle sotto.
- Tenga la parte sollevata se è un arto.
- Il prurito durante la guarigione è normale; dopo la guarigione idrati la pelle e la protegga dal sole (crema a protezione molto alta) per almeno 12 mesi.
- Le ustioni superficiali guariscono di solito in 1–2 settimane.

${controlli('[Si allega richiesta per controllo presso ambulatorio chirurgico/dermatologico tra ... giorni.]')}

${RITORNO}
- febbre, arrossamento che si allarga intorno all'ustione, pus, cattivo odore;
- dolore che aumenta invece di diminuire;
- l'ustione non è guarita dopo 2 settimane.`,
  },
  {
    id: 'morso', nome: 'Morso di animale', gruppo: 'Cute, ustioni e morsi',
    testo: `Diagnosi: ferita da morso di [cane / gatto / ...] [sede ...], lavata e disinfettata [non suturata / suturata].
[Profilassi antitetanica: eseguita / già coperta.]
[È stata fatta segnalazione al Servizio Veterinario della ASL. Il proprietario dell'animale deve tenerlo in osservazione per 10 giorni, come indicato dal Servizio Veterinario.]

Terapia:
- [Amoxicillina/acido clavulanico 875/125 mg: 1 compressa ogni 12 ore per 3–5 giorni.]
- Paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Tenga la ferita pulita e asciutta; medicazione [ogni 1–2 giorni] con disinfettante e garza.
- Tenga l'arto sollevato nei primi giorni.
- [Animale sconosciuto, randagio o selvatico: comunichi qualsiasi informazione utile sull'animale al Servizio Veterinario della ASL.]

${controlli('[Controllo della ferita dal medico curante a 48 ore.]')}

${RITORNO}
- arrossamento, gonfiore, calore o dolore che aumentano, pus, strie rosse;
- febbre;
- difficoltà a muovere le dita o un'articolazione vicina alla ferita;
- l'animale si ammala, muore o scompare nei 10 giorni di osservazione.`,
  },
  {
    id: 'punture', nome: 'Puntura di insetto (reazione locale)', gruppo: 'Cute, ustioni e morsi',
    testo: `Diagnosi: puntura di [ape / vespa / calabrone / insetto non identificato] con reazione locale [estesa], senza reazione generalizzata.

Terapia:
- Cetirizina 10 mg: 1 compressa la sera per 3–5 giorni. Può dare sonnolenza.
- [Crema al cortisone (es. idrocortisone/betametasone): 2 volte al giorno sulla zona per pochi giorni.]
- [Prednisone (Deltacortene) 25 mg: 1–2 compresse al mattino per 3 giorni, se gonfiore esteso.]
- Ghiaccio in un panno 10–15 minuti più volte al giorno; parte sollevata. Non gratti.

Indicazioni:
- Il gonfiore può aumentare per 24–48 ore e durare fino a una settimana: non è un segno di allergia grave se resta solo nella zona della puntura.
- In futuro: scarpe chiuse all'aperto, attenzione a cibi e bevande all'aperto, niente profumi intensi.
- [Reazione generalizzata in passato o oggi: si allega richiesta per visita allergologica per la valutazione dell'immunoterapia; porti sempre con sé l'adrenalina autoiniettabile prescritta.]

${controlli()}

Chiami subito il 112 se, dopo una puntura:
- orticaria su tutto il corpo, gonfiore di labbra, lingua o gola;
- difficoltà a respirare o a deglutire, voce cambiata;
- capogiri, sensazione di svenimento, vomito, dolori alla pancia.
Torni in Pronto Soccorso se la zona diventa rossa, calda e dolente dopo alcuni giorni o compare febbre (possibile infezione).`,
  },
  // ─── Occhio e orecchio ───
  {
    id: 'congiuntivite', nome: 'Congiuntivite', gruppo: 'Occhio e orecchio',
    testo: `Diagnosi: congiuntivite [virale / batterica / allergica] [occhio destro/sinistro/bilaterale].

Terapia:
- Lavaggi con soluzione fisiologica sterile più volte al giorno, togliendo le secrezioni con garza sterile dall'interno verso l'esterno (una garza per occhio).
- [Batterica: collirio antibiotico (es. netilmicina/tobramicina) 1 goccia 4 volte al giorno per 5–7 giorni.]
- [Allergica: collirio antistaminico (es. ketotifene) 1 goccia 2 volte al giorno.]
- [Lacrime artificiali al bisogno.]

Indicazioni:
- Non usi lenti a contatto fino alla guarigione completa; poi usi lenti nuove e un astuccio nuovo.
- Non si strofini gli occhi. Si lavi spesso le mani; asciugamani e federe personali.
- La forma virale e batterica è contagiosa: eviti scuola/lavoro a stretto contatto finché la secrezione non è cessata. La virale può durare 1–3 settimane.

${controlli('[Si allega richiesta per visita oculistica.]')}

${RITORNO} (o si rivolga all'oculista con urgenza):
- calo della vista;
- dolore all'occhio (non solo bruciore o sensazione di sabbia);
- fastidio intenso alla luce;
- gonfiore e arrossamento delle palpebre con febbre;
- portatore di lenti a contatto che non migliora in 24 ore.`,
  },
  {
    id: 'corpo-estraneo-occhio', nome: 'Corpo estraneo / abrasione corneale', gruppo: 'Occhio e orecchio',
    testo: `Diagnosi: [corpo estraneo corneale rimosso / abrasione corneale] occhio [destro/sinistro].

Terapia:
- [Pomata/collirio antibiotico (es. ofloxacina / cloramfenicolo): 4 volte al giorno per 3–5 giorni.]
- Paracetamolo 1 g fino a 3 volte al giorno per il dolore.
- Non usi colliri anestetici a casa: ritardano la guarigione.

Indicazioni:
- Non si strofini l'occhio. Non usi lenti a contatto fino alla guarigione e al controllo.
- Occhiali da sole se dà fastidio la luce. Eviti di guidare se la vista non è nitida.
- Lavoro con mole, flessibili, saldature: usi sempre occhiali protettivi.
- Di solito il fastidio migliora molto in 24–48 ore.

${controlli('[Si allega richiesta per visita oculistica entro 24–48 ore (residuo di ruggine / portatore di lenti a contatto / ...).]')}

${RITORNO} (o si rivolga all'oculista con urgenza):
- calo della vista;
- dolore che aumenta o non migliora dopo 24–48 ore;
- macchia bianca sulla cornea, secrezione purulenta;
- fastidio intenso alla luce.`,
  },
  {
    id: 'otite-esterna', nome: 'Otite esterna', gruppo: 'Occhio e orecchio',
    testo: `Diagnosi: otite esterna [destra/sinistra].

Terapia:
- [Gocce auricolari (antibiotico ± cortisone, es. ...): ... gocce nell'orecchio ... volte al giorno per 7 giorni. Scaldi il flacone nella mano prima dell'uso; resti sdraiato sul fianco opposto per 3–5 minuti dopo aver messo le gocce.]
- Paracetamolo 1 g fino a 3 volte al giorno o ibuprofene 400–600 mg ogni 8 ore dopo i pasti.

Indicazioni:
- Tenga l'orecchio asciutto: durante la doccia un batuffolo di cotone con un po' di vaselina all'ingresso del condotto; niente piscina o mare per 7–10 giorni.
- Non usi cotton fioc né altri oggetti nell'orecchio; non usi auricolari o tappi finché non è guarito.
- Il dolore migliora di solito in 2–3 giorni dall'inizio delle gocce.

${controlli()}

${RITORNO}
- febbre, gonfiore e arrossamento che si estendono al padiglione, al viso o dietro l'orecchio;
- dolore molto forte o che non migliora dopo 48–72 ore, specialmente se diabetico o anziano;
- paralisi di metà del viso, vertigine, calo importante dell'udito.`,
  },
]
