/*
 * Formule di dimissione modificabili. I campi tra [parentesi quadre] vanno completati o tolti.
 * Il testo modificato si salva sul telefono (localStorage) e resta finché non si ripristina l’originale.
 * Dosi per adulto senza controindicazioni: verificarle sul singolo paziente.
 */

export interface Dimissione { id: string; nome: string; gruppo: string; testo: string }

const RITORNO = 'Torni in Pronto Soccorso o chiami il 112 se:'

export const DIMISSIONI: Dimissione[] = [
  // ─── Addome ───
  {
    id: 'colica-renale', nome: 'Colica renale', gruppo: 'Addome',
    testo: `Diagnosi: colica renale [destra/sinistra] [da calcolo di X mm in sede ...].

Terapia:
- Ibuprofene 600 mg: 1 compressa ogni 8 ore dopo i pasti, per 5 giorni o finché c'è dolore. In alternativa o in aggiunta paracetamolo 1 g: 1 compressa fino a 3 volte al giorno (almeno 6 ore tra una dose e l'altra).
- [Tamsulosina 0,4 mg: 1 compressa la sera fino all'espulsione del calcolo, per massimo 4 settimane. Può dare capogiri alzandosi in piedi.]
- [Gastroprotezione: pantoprazolo 20 mg 1 compressa al mattino a digiuno finché assume l'antinfiammatorio.]

Indicazioni:
- Beva almeno 2 litri di acqua al giorno, distribuiti nella giornata.
- Urini in un colino o in una garza per recuperare il calcolo e lo porti al medico per l'analisi.

Controlli:
- Ecografia dell'apparato urinario e visita urologica entro [2–4] settimane, con richiesta del medico curante.

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
- Al bisogno per il dolore: butilscopolamina 10 mg, 1–2 compresse fino a 3 volte al giorno, e/o paracetamolo 1 g fino a 3 volte al giorno.

Indicazioni:
- Dieta povera di grassi: eviti fritti, insaccati, formaggi grassi, burro, panna, uova, cioccolato. Pasti piccoli e frequenti.
- Niente alcol.

Controlli:
- Visita chirurgica per valutare l'asportazione della colecisti (colecistectomia), con richiesta del medico curante [ecografia addome se non eseguita].

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
- Al bisogno per il dolore: butilscopolamina 10 mg, 1–2 compresse fino a 3 volte al giorno.

Indicazioni:
- Mangi lentamente, eviti bevande gassate, legumi, cavoli, chewing-gum, dolcificanti (sorbitolo).
- Regolarizzi l'intestino: acqua, frutta e verdura; movimento.

Controlli:
- Dal medico curante se i disturbi si ripetono.

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

Controlli:
- Dal medico curante tra 4 settimane; se i disturbi persistono, ricerca dell'Helicobacter pylori e/o gastroscopia.

${RITORNO}
- vomito con sangue o materiale scuro «a fondo di caffè»;
- feci nere o con sangue;
- dolore molto forte o improvviso;
- difficoltà a deglutire, vomito continuo.

Si rivolga al medico curante se perde peso senza motivo.`,
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

Controlli:
- Dal medico curante entro 2–3 giorni.
- [Colonscopia a 6–8 settimane dalla guarigione, se non eseguita negli ultimi anni.]

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

Controlli:
- Dal medico curante; visita proctologica se i disturbi si ripetono o il sanguinamento continua.

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

Controlli:
- Dal medico curante se dopo 3 settimane la tosse non migliora.

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

Controlli:
- Dal medico curante entro 1 settimana; visita pneumologica [entro 4–6 settimane].
- Vaccinazioni antinfluenzale e antipneumococcica se non eseguite.

${RITORNO}
- il fiato corto peggiora o non migliora con lo spray;
- labbra o unghie bluastre;
- sonnolenza, confusione, mal di testa al risveglio;
- febbre alta, dolore toracico, gonfiore alle gambe.`,
  },
  // ─── Neurologia e traumi cranici ───
  {
    id: 'cefalea', nome: 'Cefalea / emicrania', gruppo: 'Neurologia',
    testo: `Diagnosi: cefalea [emicrania senza aura / cefalea di tipo tensivo]. La visita e gli accertamenti non hanno evidenziato segni di gravità.

Terapia all'inizio del dolore:
- Ibuprofene 400–600 mg dopo aver mangiato qualcosa, oppure paracetamolo 1 g; [+ metoclopramide 10 mg se nausea].
- [Emicrania: sumatriptan 50–100 mg, 1 compressa all'inizio dell'attacco; ripetibile dopo 2 ore, massimo 200 mg al giorno.]

Indicazioni:
- Non prenda antidolorifici per più di 10–15 giorni al mese: l'abuso fa venire più mal di testa.
- Tenga un diario degli attacchi (giorno, durata, farmaci, possibili cause: sonno, pasti saltati, alcol, ciclo).
- Sonno e pasti regolari, idratazione, riduca caffè e alcol.

Controlli:
- Dal medico curante; [visita neurologica / centro cefalee] se gli attacchi sono frequenti.

${RITORNO}
- il mal di testa più forte della sua vita, comparso all'improvviso;
- febbre con rigidità del collo o macchie sulla pelle;
- debolezza o formicolio di braccio/gamba, bocca storta, difficoltà a parlare, disturbi della vista, confusione, convulsioni;
- mal di testa dopo un trauma, o che peggiora giorno dopo giorno.`,
  },
  {
    id: 'trauma-cranico', nome: 'Trauma cranico lieve', gruppo: 'Neurologia',
    testo: `Diagnosi: trauma cranico lieve [senza perdita di coscienza] [TC encefalo negativa].

Indicazioni per le prossime 24–48 ore:
- Resti in compagnia di un adulto responsabile per le prime 24 ore, che controlli che sia sveglio e orientato.
- Riposo; eviti sport, sforzi e alcol. Non guidi finché non si sente perfettamente bene.
- Per il dolore: paracetamolo 1 g fino a 3 volte al giorno. Eviti sonniferi e tranquillanti.
- Nei giorni successivi possono comparire mal di testa leggero, stanchezza, difficoltà di concentrazione, capogiri: di solito passano in 1–2 settimane. Riduca schermi e attività impegnative finché ci sono.

${RITORNO} (chi è con lei deve conoscere questi segni):
- sonnolenza, difficoltà a svegliarsi, confusione o comportamento strano;
- vomito ripetuto;
- mal di testa che peggiora;
- convulsioni;
- debolezza o formicolio di braccio/gamba, difficoltà a parlare, disturbi della vista, pupille diverse;
- liquido chiaro o sangue da naso o orecchie.`,
  },
  {
    id: 'trauma-cranico-tao', nome: 'Trauma cranico in terapia anticoagulante', gruppo: 'Neurologia',
    testo: `Diagnosi: trauma cranico lieve in paziente in terapia anticoagulante con [warfarin / apixaban / rivaroxaban / dabigatran / edoxaban] [/ antiaggregante].
[TC encefalo eseguita il ... alle ore ...: non sanguinamenti.] [Periodo di osservazione in Pronto Soccorso di ... ore senza peggioramenti.]

Anticoagulante:
- [Prosegua la terapia come di consueto.] / [Sospenda ... per ... giorni e ricontatti il medico curante/centro TAO prima di riprenderla.]
- [INR del ...: ... — controllo INR il ... presso il centro TAO.]

Indicazioni per i prossimi 7 giorni:
- Resti in compagnia di un adulto responsabile almeno per le prime 24–48 ore.
- Riposo; niente alcol, sport, guida, sforzi. Per il dolore solo paracetamolo 1 g fino a 3 volte al giorno: niente antinfiammatori o aspirina.
- Chi assume anticoagulanti ha un rischio più alto di sanguinamento anche nei giorni successivi: al minimo dubbio torni.

${RITORNO} (chi è con lei deve conoscere questi segni):
- sonnolenza, confusione, comportamento strano;
- mal di testa che compare o peggiora;
- vomito;
- convulsioni;
- debolezza o formicolio di braccio/gamba, difficoltà a parlare, disturbi della vista;
- nuove cadute o nuovi sanguinamenti (naso, gengive, urine, feci nere).`,
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

Indicazioni per i primi 2–3 giorni:
- Riposo relativo; ghiaccio avvolto in un panno per 15–20 minuti ogni 2–3 ore; fasciatura elastica; piede sollevato sopra il livello del cuore quando è seduto o sdraiato.
- Carico sul piede quanto tollerato dal dolore [con stampelle se necessario].
- Dopo 3–5 giorni inizi a muovere la caviglia (cerchi, flesso-estensione) e riprenda gradualmente a camminare normalmente. Lo sport dopo 4–6 settimane.
- [Immobilizzazione rigida: profilassi antitrombotica con enoxaparina 4000 UI sottocute 1 volta al giorno fino alla rimozione.]

Controlli:
- Dal medico curante o ortopedico se dopo 7–10 giorni non riesce ancora a caricare o il dolore non migliora.

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

Indicazioni:
- Primi 2–3 giorni: riposo relativo, ghiaccio in un panno 15–20 minuti ogni 2–3 ore, gamba sollevata.
- Carico quanto tollerato dal dolore; dopo qualche giorno inizi a piegare ed estendere il ginocchio senza forzare.
- [Profilassi antitrombotica con enoxaparina 4000 UI sottocute 1 volta al giorno se immobilizzato.]

Controlli:
- Visita ortopedica entro [7–10] giorni, quando il gonfiore è diminuito, per valutare legamenti e menischi [eventuale risonanza].

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

Indicazioni:
- Primi 2–3 giorni: riposo del muscolo, ghiaccio in un panno 15–20 minuti ogni 2–3 ore, eventuale fasciatura compressiva, arto sollevato. Niente calore e massaggi in questa fase.
- Poi ripresa graduale del movimento e stretching leggero senza dolore; ritorno allo sport solo quando il movimento è completo e senza dolore (di solito 2–6 settimane).

Controlli:
- [Ecografia muscolare a 5–7 giorni] / dal medico curante se il dolore non migliora entro 1–2 settimane.

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

Indicazioni:
- Calore locale (borsa dell'acqua calda, cerotti autoriscaldanti) 20 minuti più volte al giorno.
- Movimento leggero e stretching dolce; eviti posture fisse prolungate e sforzi.

Controlli:
- Dal medico curante se il dolore non migliora entro 1–2 settimane.

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

Controlli:
- Dal medico curante se il dolore non migliora entro 2–4 settimane.

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

Controlli:
- Dal medico curante entro 1–2 settimane; [visita fisiatrica/neurochirurgica] se il dolore non migliora dopo 6 settimane.

${RITORNO}
- perdita di urine o feci, oppure non riesce a urinare;
- insensibilità nella zona genitale/anale;
- debolezza della gamba (piede che «cade», non riesce a camminare sulle punte o sui talloni);
- dolore a entrambe le gambe, febbre.`,
  },
]
