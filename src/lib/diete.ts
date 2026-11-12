/*
 * Diete e stili di vita da consegnare alla dimissione. Testi modificabili come le dimissioni
 * (si salvano sul dispositivo); le parti tra [parentesi quadre] vanno completate o tolte.
 */
import type { Dimissione } from './dimissioni'

export const DIETE: Dimissione[] = [
  // ─── Apparato digerente ───
  {
    id: 'reflusso', nome: 'Reflusso gastro-esofageo', gruppo: 'Apparato digerente',
    testo: `Consigli per il reflusso gastro-esofageo

Abitudini:
- Pasti piccoli e frequenti; mangi lentamente.
- Ceni almeno 3 ore prima di coricarsi; non si sdrai dopo mangiato.
- Alzi la testata del letto di 15–20 cm (spessori sotto i piedi del letto, non solo cuscini) se i disturbi sono notturni.
- Se è in sovrappeso, anche un calo di 3–5 kg riduce molto i sintomi.
- Eviti abiti e cinture stretti in vita; non fumi.

Alimenti da limitare (solo se le danno disturbi):
- Pasti abbondanti e grassi, fritti, cioccolato, menta.
- Caffè, alcol, bevande gassate.
- Pomodoro, agrumi e succhi acidi, cibi molto speziati.

Da preferire: carni e pesce magri cotti semplicemente, verdure cotte, pane e pasta, frutta non acida, acqua naturale.`,
  },
  {
    id: 'gastrite', nome: 'Gastrite e dispepsia', gruppo: 'Apparato digerente',
    testo: `Consigli per gastrite e dispepsia

- Pasti regolari, non saltarli; porzioni moderate, mastichi bene.
- Eviti alcol e fumo; limiti caffè e tè forte.
- Eviti antinfiammatori (ibuprofene, ketoprofene, diclofenac, aspirina) se non prescritti: per il dolore preferisca il paracetamolo.
- Riduca fritti, insaccati, cibi molto grassi o piccanti, bevande gassate.
- Non è necessaria una dieta «in bianco» rigida: escluda solo ciò che le dà fastidio.
- [Se prescritto: ricerca dell'Helicobacter pylori (breath test o feci) a distanza di almeno 2 settimane dall'ultimo gastroprotettore.]`,
  },
  {
    id: 'colon-irritabile', nome: 'Colon irritabile', gruppo: 'Apparato digerente',
    testo: `Consigli per il colon irritabile

Abitudini:
- Pasti regolari, senza fretta; non saltare la colazione.
- Attività fisica regolare (camminare 30 minuti al giorno aiuta l'intestino).
- Beva 1,5–2 litri di acqua al giorno.
- Lo stress peggiora i sintomi: tecniche di rilassamento, sonno regolare.

Alimentazione:
- Limiti caffè, alcol, bevande gassate, cibi grassi e piccanti.
- Gonfiore e diarrea: riduca legumi, cavoli, cipolla, aglio, latte, mele e pere, dolcificanti (sorbitolo, mannitolo, «senza zucchero»).
- Stitichezza: aumenti gradualmente le fibre solubili (avena, frutta, verdura cotta, semi di psillio), meno la crusca.
- Se i sintomi persistono il medico curante può proporre una dieta a basso contenuto di FODMAP, da seguire con un dietista per poche settimane e poi reintrodurre gli alimenti.

Torni dal medico se: sangue nelle feci, perdita di peso, febbre, diarrea notturna, anemia, sintomi comparsi dopo i 50 anni.`,
  },
  {
    id: 'colica-biliare', nome: 'Colica biliare e calcoli della colecisti', gruppo: 'Apparato digerente',
    testo: `Consigli dopo una colica biliare

- Pasti piccoli e frequenti; eviti i pasti abbondanti, soprattutto la sera.
- Riduca i grassi: fritti, burro, panna, formaggi grassi e stagionati, insaccati, carni grasse, sughi elaborati, dolci con creme.
- Preferisca cotture semplici (lessato, vapore, griglia, forno), olio extravergine a crudo in piccole quantità.
- Carni bianche e pesce magro, verdure cotte, pane, pasta e riso, frutta.
- Non stia a digiuno a lungo e non segua diete dimagranti drastiche: favoriscono nuovi calcoli.
- La dieta riduce le coliche ma non elimina i calcoli: la soluzione definitiva, se le coliche si ripetono, è la colecistectomia [è stata richiesta visita chirurgica].

Torni in Pronto Soccorso se: dolore che dura più di 4–6 ore, febbre con brividi, colorito giallo della pelle o degli occhi, urine scure e feci chiare, vomito che non si ferma.`,
  },
  {
    id: 'diverticoli', nome: 'Diverticolosi e diverticolite', gruppo: 'Apparato digerente',
    testo: `Consigli per la diverticolite

Nei primi giorni (fase acuta):
- Dieta leggera e povera di fibre: brodo, pasta e riso, pane bianco, carne e pesce magri, patate, frutta cotta o banana; molta acqua.
- Riprenda gradualmente l'alimentazione normale quando il dolore si attenua.

Dopo la guarigione (prevenzione):
- Dieta ricca di fibre: 25–30 g al giorno con verdura, frutta, legumi, cereali integrali.
- Beva almeno 1,5–2 litri di acqua al giorno.
- Non è necessario evitare semi, frutta secca, mais o pomodori.
- Attività fisica regolare e calo di peso se in sovrappeso; non fumi.
- Eviti, se possibile, gli antinfiammatori.

Torni in Pronto Soccorso se: febbre alta, dolore che aumenta, vomito, sangue abbondante nelle feci, pancia dura.`,
  },
  {
    id: 'stipsi', nome: 'Stitichezza', gruppo: 'Apparato digerente',
    testo: `Consigli per la stitichezza

- Beva 1,5–2 litri di acqua al giorno.
- Aumenti gradualmente le fibre (in 2–3 settimane, per evitare gonfiore): verdura a ogni pasto, 2–3 frutti al giorno (prugne, kiwi), legumi, pane e pasta integrali, avena.
- Si muova: camminare 30 minuti al giorno.
- Vada in bagno con regolarità, ad esempio dopo colazione, senza trattenere lo stimolo; uno sgabello sotto i piedi aiuta.
- [Macrogol (Movicol) 1 bustina sciolta in acqua 1–2 volte al giorno, riducendo quando le feci diventano morbide.]`,
  },
  {
    id: 'gastroenterite', nome: 'Gastroenterite e diarrea acuta', gruppo: 'Apparato digerente',
    testo: `Consigli per la gastroenterite

- La cosa più importante è bere: piccoli sorsi frequenti di acqua, tè leggero, brodo salato, oppure soluzioni reidratanti (in farmacia). Eviti succhi di frutta e bibite zuccherate o gassate.
- Appena se la sente, mangi normalmente in piccole quantità: riso, pasta, pane, patate, carote, banana, mela, carne e pesce magri, yogurt.
- Eviti per qualche giorno latte, fritti, cibi grassi, alcol e caffè.
- Si lavi spesso le mani e non prepari cibo per altri finché ha diarrea.
- Non prenda antidiarroici (loperamide) se ha febbre o sangue nelle feci.

Torni in Pronto Soccorso se: non riesce a bere o vomita tutto, urina pochissimo, febbre alta persistente, sangue nelle feci, forte dolore addominale, sonnolenza o confusione.`,
  },
  {
    id: 'pancreatite', nome: 'Dopo pancreatite acuta', gruppo: 'Apparato digerente',
    testo: `Consigli dopo una pancreatite acuta

- Alcol: va sospeso del tutto [se la causa è alcolica, per sempre].
- Non fumi.
- Pasti piccoli e frequenti, poveri di grassi per le prime settimane; riprenda gradualmente un'alimentazione normale ed equilibrata.
- [Se la causa sono i calcoli: la colecistectomia va fatta presto, di solito durante lo stesso ricovero o entro poche settimane.]
- [Se trigliceridi elevati: dieta povera di zuccheri e grassi, niente alcol, controllo dei trigliceridi dal curante.]`,
  },
  {
    id: 'emorroidi', nome: 'Emorroidi e ragade anale', gruppo: 'Apparato digerente',
    testo: `Consigli per emorroidi e ragade

- Feci morbide: fibre (frutta, verdura, legumi, cereali integrali, psillio) e 1,5–2 litri di acqua al giorno.
- Non sforzi e non resti a lungo in bagno (niente telefono in bagno).
- Bagni tiepidi in acqua semplice 2–3 volte al giorno per 10 minuti, soprattutto dopo l'evacuazione.
- Igiene delicata con acqua, senza salviette profumate.
- Limiti cibi molto piccanti e alcol se peggiorano i sintomi.`,
  },
  // ─── Allergie e intolleranze ───
  {
    id: 'allergia-alimentare', nome: 'Allergia alimentare', gruppo: 'Allergie e intolleranze',
    testo: `Consigli per l'allergia alimentare [a ...]

- Eviti completamente l'alimento [...] e i prodotti che lo contengono, anche in tracce.
- Legga sempre le etichette: gli allergeni principali sono evidenziati in grassetto nell'elenco degli ingredienti. Attenzione alla dicitura «può contenere tracce di».
- Al ristorante, al bar e in gelateria dichiari sempre l'allergia: per legge devono informarla sugli allergeni.
- Attenzione alle contaminazioni: utensili, friggitrici, taglieri in comune.
- [Porti sempre con sé l'adrenalina autoiniettabile (2 penne) e la sappia usare: in caso di difficoltà a respirare, gonfiore della gola, svenimento, vomito ripetuto dopo l'alimento la inietti subito nella coscia e chiami il 112.]
- [Antistaminico al bisogno per orticaria e prurito: cetirizina 10 mg 1 compressa.]
- Si allega richiesta per visita allergologica.`,
  },
  {
    id: 'lattosio', nome: 'Intolleranza al lattosio', gruppo: 'Allergie e intolleranze',
    testo: `Consigli per l'intolleranza al lattosio

- Riduca latte, panna, gelati, formaggi freschi (mozzarella, ricotta, stracchino).
- In genere sono ben tollerati: formaggi stagionati (parmigiano, grana, pecorino), yogurt, latte e prodotti «senza lattosio».
- Piccole quantità di latte durante il pasto spesso non danno disturbi: la tolleranza è individuale.
- Il lattosio si trova anche in prodotti confezionati (salumi, dolci, purè pronti): legga le etichette.
- Non serve escludere il calcio: lo assuma con latte delattosato, formaggi stagionati, acque ricche di calcio, verdure a foglia.`,
  },
  {
    id: 'celiachia-sospetta', nome: 'Sospetta celiachia', gruppo: 'Allergie e intolleranze',
    testo: `Sospetta celiachia: cosa fare

- NON inizi una dieta senza glutine prima di aver completato gli esami: la dieta rende falsamente negativi gli anticorpi e la biopsia.
- Continui a mangiare normalmente pane, pasta e altri cereali con glutine fino alla diagnosi.
- Si allega richiesta per dosaggio degli anticorpi anti-transglutaminasi IgA e IgA totali. Il medico curante valuterà la visita gastroenterologica.
- Solo dopo la diagnosi confermata la dieta senza glutine va seguita per sempre e in modo rigoroso, con il supporto dell'Associazione Italiana Celiachia e di un dietista.`,
  },
  // ─── Metabolismo, cuore e rene ───
  {
    id: 'iposodica', nome: 'Pressione alta: poco sale', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli per la pressione e per ridurre il sale

- Sale: meno di 5 g al giorno (un cucchiaino raso), compreso quello già presente nei cibi.
- La maggior parte del sale è nascosta: salumi, formaggi stagionati, pane, cracker e grissini, dadi e preparati per brodo, cibi in scatola, sottaceti, salse pronte, piatti pronti, patatine.
- Insaporisca con erbe aromatiche, spezie, limone, aceto, aglio, cipolla.
- Molta verdura e frutta (5 porzioni al giorno), legumi, pesce, cereali integrali, latticini magri.
- Alcol al massimo 1 bicchiere di vino al giorno; non fumi.
- Attività fisica moderata: camminare a passo svelto 30 minuti quasi tutti i giorni.
- Calo di peso se in sovrappeso.`,
  },
  {
    id: 'scompenso', nome: 'Scompenso cardiaco: sale, liquidi, peso', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli per lo scompenso cardiaco

- Si pesi ogni mattina, dopo aver urinato e prima di colazione, con gli stessi indumenti; scriva il peso.
- Se aumenta di più di 2 kg in 3 giorni, o compaiono gonfiore alle gambe e fiato corto, chiami il medico curante: può servire aumentare il diuretico.
- Sale: meno di 5 g al giorno; eviti cibi conservati e salati (vedi sopra).
- Liquidi: [non più di 1,5 litri al giorno, compresi brodi, frutta acquosa e bevande] [secondo le indicazioni del cardiologo].
- Alcol molto limitato; non fumi.
- Attività fisica leggera e regolare, compatibilmente con i sintomi.
- Non prenda antinfiammatori (ibuprofene, ketoprofene, diclofenac): trattengono liquidi.

Torni in Pronto Soccorso se: fiato corto a riposo o da sdraiato, dolore al petto, svenimento.`,
  },
  {
    id: 'iperglicemia', nome: 'Glicemia alta / diabete', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli per la glicemia alta

- Pasti regolari (3 pasti principali, eventualmente 1–2 spuntini), non saltarli.
- Riduca zuccheri semplici: bibite zuccherate e succhi di frutta, dolci, miele, marmellate.
- Pane, pasta e riso in porzioni moderate, preferibilmente integrali, sempre insieme a verdura e a una fonte di proteine.
- Frutta: 2–3 porzioni al giorno, non succhi.
- Bevande: acqua; alcol molto limitato e mai a digiuno.
- Attività fisica: almeno 30 minuti di camminata quasi tutti i giorni, anche dopo i pasti.
- [Controllo della glicemia a digiuno e dell'emoglobina glicata: si allega richiesta; visita diabetologica tramite il medico curante.]

Torni in Pronto Soccorso se: sete intensa e urina molto, vomito, respiro affannoso, sonnolenza o confusione.`,
  },
  {
    id: 'gotta', nome: 'Gotta e acido urico', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli per la gotta

- Beva almeno 2 litri di acqua al giorno.
- Alcol: eviti soprattutto birra e superalcolici; il vino al massimo un bicchiere ai pasti, mai durante un attacco.
- Riduca: frattaglie (fegato, rognone), selvaggina, carni rosse in eccesso, acciughe, sardine, frutti di mare, estratti di carne e dadi.
- Eviti bibite e succhi zuccherati con fruttosio.
- Bene: latticini magri, verdure, cereali, uova; il caffè non è vietato.
- Calo di peso graduale se in sovrappeso (non digiuni: possono scatenare un attacco).
- [La terapia per abbassare l'acido urico (allopurinolo) si valuta con il medico curante a distanza dall'attacco.]`,
  },
  {
    id: 'warfarin', nome: 'Anticoagulante (warfarin): alimentazione', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli alimentari con warfarin (Coumadin)

- Non deve eliminare le verdure: le mangi in quantità costante da una settimana all'altra. La vitamina K (verdure a foglia verde scuro: spinaci, cavoli, broccoli, lattuga, bieta) riduce l'effetto del farmaco se aumentata bruscamente.
- Alcol con moderazione e senza abbuffate.
- Eviti integratori, prodotti erboristici e pompelmo/succo di mirtillo senza averne parlato con il medico.
- Molti farmaci (antibiotici, antinfiammatori, antimicotici) cambiano l'INR: avvisi sempre che prende warfarin e controlli l'INR [entro ... giorni] dopo ogni nuova terapia.`,
  },
  {
    id: 'calcoli-renali', nome: 'Calcoli renali: prevenzione', gruppo: 'Metabolismo, cuore e rene',
    testo: `Consigli per prevenire i calcoli renali

- Beva 2,5–3 litri al giorno distribuiti nella giornata, in modo che le urine siano chiare; di più se fa caldo o suda.
- Sale ridotto (meno di 5 g al giorno).
- Non riduca il calcio: latte, yogurt e formaggi in quantità normale (2–3 porzioni al giorno) proteggono dai calcoli di ossalato.
- Riduca carni e salumi in eccesso; più frutta e verdura (gli agrumi aiutano).
- Limiti alimenti molto ricchi di ossalati se ha avuto calcoli di ossalato: spinaci, bietole, rabarbaro, cioccolato, frutta secca, tè molto concentrato.
- Eviti bibite zuccherate.
- Porti il calcolo, se lo recupera, al medico curante per l'analisi.`,
  },
]
