import React, { useState, useMemo, useDeferredValue } from "react";

/*
  COMPARATORE PSICOFARMACI — strumento didattico
  Fonte unica dei dati: «Appunti di Psicofarmacologia», R. Di Lorenzo,
  Scuola di Specializzazione in Psichiatria, Università di Modena, AA 2024-2025.
  I dati NON vanno usati a fini prescrittivi: verificare sempre RCP/AIFA.
*/

const CLASSI = {
  tip: { label: "Antipsicotici tipici (I gen.)", short: "AP I gen.", color: "#3E4C7E", soft: "#ECEEF6" },
  ati: { label: "Antipsicotici atipici (II gen.)", short: "AP II gen.", color: "#0E7C86", soft: "#E3F0F1" },
  sta: { label: "Stabilizzanti dell’umore", short: "Stabilizzanti", color: "#A9761B", soft: "#F6EEDF" },
  ad:  { label: "Antidepressivi", short: "Antidepressivi", color: "#2E7D5B", soft: "#E5F1EA" },
  anx: { label: "Ansiolitici / Ipnotici", short: "Ansiolitici/Ipnotici", color: "#7A4EA8", soft: "#F0EAF7" },
  stim:{ label: "ADHD / stimolanti e correlati", short: "ADHD/stimolanti", color: "#B25B3A", soft: "#F6E9E2" },
  dip: { label: "Dipendenze / craving", short: "Dipendenze", color: "#A23E5C", soft: "#F6E6EC" },
  cog: { label: "Cognitivi / antidemenza", short: "Antidemenza", color: "#4A6B8A", soft: "#E8EEF4" },
  corr:{ label: "Correttori EPS / antidoti", short: "Correttori/antidoti", color: "#6B7A3F", soft: "#EEF2E2" },
};
const ORDINE_CLASSI = ["tip", "ati", "sta", "ad", "anx", "stim", "dip", "cog", "corr"];

const FARMACI = [
  // ============ ANTIPSICOTICI TIPICI ============
  {
    id: "clorpromazina", nome: "Clorpromazina", cls: "tip", sub: "Fenotiazina alifatica",
    com: "LARGACTIL, PROZIN — cpr 25-50 mg; fl 50 mg/2 ml im (anche ev diluito). Anche pediatrico 1 mg/kg/die.",
    mecc: "Blocco D2 (effetto AP ed EPS discreti). Marcata attività anti-H1 e α1-adrenolitica (sedazione, ipotensione); discreta attività anticolinergica ed endocrina.",
    ind: "Schizofrenia, stati paranoidi, mania, psicosi tossiche (amfetamina, cocaina, LSD); ansia grave resistente; depressione con sintomi psicotici/agitazione (+ AD); sindromi organiche con delirio; agitazione psicomotoria; vomito/singhiozzo incoercibile; medicazione pre-anestetica.",
    pos: "os 25-50 mg; bambini 1 mg/kg/die fino a 3 volte/die.",
    emi: "Bifasica: fase rapida ~2 h, fase lenta 15-30 h. Steady state 7-8 gg. Legame proteico 98-99%.",
    met: "Effetto di primo passaggio esteso (>80%); CYP2D6 e CYP1A2; inibisce CYP2D6 e CYP3A4. 150 metaboliti (alcuni attivi, es. 7-OH-clorpromazina).",
    eff: "EPS, sedazione, ipotensione ortostatica, effetti anticolinergici; abbassamento soglia epilettica (<1%); anomalie ECG (ripolarizzazione, ↑QT).",
    avv: "Rischio flebotrombosi con ev. Effetto stabilizzante di membrana/chinidino-simile, inotropo negativo.",
    note: "Primo neurolettico (Delay e Deniker, 1952). «Tranquillante maggiore».",
    rec: { "α1": 3, "D1": 1, "D2": 2, "H1": 3, "M1": 3, "5HT2A": 1 },
  },
  {
    id: "levomepromazina", nome: "Levomepromazina", cls: "tip", sub: "Fenotiazina alifatica",
    com: "NOZINAN — cpr 25-100 mg (dose max fino a 300 mg/die).",
    mecc: "Fenotiazina alifatica: blocco D2 con marcata attività anti-H1 e α1-adrenolitica (spiccato effetto sedativo e ipotensivante).",
    ind: "Schizofrenia, stati paranoidi, mania, psicosi tossiche; sindromi organiche con delirio; vomito/singhiozzo incoercibile; dolori intensi (+ analgesici stupefacenti).",
    pos: "25-100 mg, fino a 300 mg/die.",
    emi: "Ampia variabilità individuale (15-78 h).",
    met: "CYP3A4.",
    eff: "Marcata sedazione e ipotensione ortostatica; EPS.",
    avv: "Forte sedazione: cautela nell’anziano (cadute).",
    note: "Tra le fenotiazine più sedative.",
    rec: { "α1": 3, "D2": 1, "H1": 3, "M1": 3, "5HT2A": 1 },
  },
  {
    id: "promazina", nome: "Promazina", cls: "tip", sub: "Fenotiazina alifatica",
    com: "TALOFEN — gtt, fl 50 mg im e ev in infusione lenta (1 gtt = 2 mg). >12 anni; anziani 20-200 mg/die. Dose max 400 mg/die.",
    mecc: "Fenotiazina alifatica (profilo anti-H1/α1 marcato).",
    ind: "Schizofrenia e altri disturbi psicotici; agitazione psicomotoria e comportamenti aggressivi.",
    pos: ">12 anni 10-120 mg/die; anziani 20-200 mg/die; max 400 mg/die.",
    emi: "~6 h.",
    met: "CYP1A2, CYP3A4, CYP2D6; escrezione urinaria.",
    eff: "Sedazione, ipotensione, abbassamento soglia epilettica.",
    avv: "Spesso usata per l’agitazione dell’anziano a basse dosi.",
    note: "",
    rec: { "α1": 3, "D2": 1, "H1": 3, "M1": 3, "5HT2A": 1 },
  },
  {
    id: "perfenazina", nome: "Perfenazina", cls: "tip", sub: "Fenotiazina piperazinica",
    com: "TRILAFON — cpr 2-4-8 mg (dose max 64 mg/die). Non <12 anni. Depot: TRILAFON enantato 100 mg/ml (1 fl/14 gg).",
    mecc: "Fenotiazina piperazinica: marcato blocco D2, minore attività α1-adrenolitica, anti-H1 e anticolinergica.",
    ind: "Schizofrenia, stati paranoidi, mania, psicosi tossiche; ansia grave resistente; depressione con sintomi psicotici (+ AD); sindromi organiche con delirio; agitazione psicomotoria.",
    pos: "fino a 64 mg/die.",
    emi: "ND",
    met: "ND",
    eff: "EPS marcati (AP ad alta potenza).",
    avv: "AP ad alta potenza: elevato rischio EPS.",
    note: "Comparatore attivo nello studio CATIE (8 mg).",
    rec: { "α1": 1, "D1": 1, "D2": 2, "H1": 3, "M1": 1, "5HT2A": 3 },
  },
  {
    id: "aloperidolo", nome: "Aloperidolo", cls: "tip", sub: "Butirrofenone",
    com: "SERENASE, HALDOL — gtt 0,2-1%, cpr 1-5 mg, fl 2-5 mg im (ev NON più autorizzata dal 2007). Max 20 mg/die. Depot HALDOL DECANOAS 50-150 mg (1 fl/28 gg).",
    mecc: "Potente blocco D2, marcato effetto AP ed EPS; scarsa attività α1/anti-H1 (modesto sedativo/ipotensivo); modesto effetto anticolinergico ed endocrino.",
    ind: "Agitazione psicomotoria, deliri e allucinazioni (mania, demenza, schizofrenia acuta/cronica, alcolismo, disturbi di personalità); movimenti coreiformi, tics, singhiozzo, vomito; astinenza alcolica. Adol. 13-17 schizofrenia; autismo 6-17; Tourette 10-17.",
    pos: "max 20 mg/die; adolescenti 0,5-3 mg/die (max 5).",
    emi: "~20 h. Steady state 5 gg. Legame proteico 90-98%.",
    met: "CYP1A2, CYP2D6, CYP3A4; inibisce CYP2D6. Metaboliti inattivi. 60-70% nel latte materno.",
    eff: "EPS marcati (acatisia, distonia acuta, parkinsonismo, discinesia tardiva); ↑prolattina; s. maligna da neurolettici; ↑QTc con ev.",
    avv: "Somministrazione ev sospesa dal 2007 (rischio ↑QT, torsioni di punta). Preferito per os nel cardiopatico.",
    note: "Marcata azione antimaniacale. Alta potenza D2.",
    rec: { "α1": 0, "D1": 2, "D2": 3, "H1": 0, "M1": 0, "5HT2A": 1 },
  },
  {
    id: "pimozide", nome: "Pimozide", cls: "tip", sub: "Difenilbutilpiperidina",
    com: "ORAP — cpr 4 mg. Max 20 mg/die. Mono-somministrazione mattutina.",
    mecc: "Simile ai butirrofenoni; scarsa attività α1-adrenolitica, anti-H1 e anticolinergica.",
    ind: "Trattamento a lungo termine di psicosi croniche e acute; (L.648/96) sindrome di Tourette con compromissione moderata-grave (≥12 anni).",
    pos: "max 20 mg/die.",
    emi: "50-60 h.",
    met: "Metabolizzazione epatica senza metaboliti attivi.",
    eff: "EPS; ↑QT (cautela).",
    avv: "Controindicati pompelmo e inibitori del CYP2D6.",
    note: "Emivita lunga: mono-somministrazione.",
    rec: { "α1": 0.5, "D1": 0.5, "D2": 2, "H1": 0, "M1": 1, "5HT2A": 2 },
  },
  {
    id: "zuclopentixolo", nome: "Zuclopentixolo", cls: "tip", sub: "Tioxantene",
    com: "CLOPIXOL — gtt 20 mg/ml, cpr 10-25 mg. Depot: CLOPIXOL acetato (Acuphase, 1 fl/2-3 gg) e decanoato RP 200 mg/ml (1 fl/14 gg).",
    mecc: "Tioxantene con catena piperazinica (simile strutturalmente alla quetiapina).",
    ind: "Stati dissociativi acuti negli episodi maniacali e nella recrudescenza delle psicosi croniche; sindromi organiche (RM) con delirio e agitazione.",
    pos: "10-50 mg/die (max 75). Depot decanoato mant. 100-600 mg ogni 2-4 sett.",
    emi: "os ~20 h; depot decanoato picco 4-7 gg, T/2 19 gg, steady state 12 sett.",
    met: "CYP2D6, senza metaboliti attivi. Vd 12-24 l/kg.",
    eff: "EPS.",
    avv: "Acetato (Acuphase) per il controllo rapido; decanoato per il mantenimento.",
    note: "",
    rec: { "α1": 1, "D1": 1, "D2": 3, "H1": 2, "M1": 1, "5HT2A": 3 },
  },
  {
    id: "tiapride", nome: "Tiapride", cls: "tip", sub: "Benzamide sostituita",
    com: "SEREPRILE — cpr 100 mg, fl 100 mg.",
    mecc: "Benzamide sostituita (antagonista D2).",
    ind: "Agitazione psicomotoria nell’etilismo cronico e acuto; movimenti involontari coreici (usato anche in sindromi cefalalgiche, tics, balbuzie).",
    pos: "fino a 8 fl/die nell’etilismo acuto. Ridurre in insufficienza renale.",
    emi: "3-4 h.",
    met: "Scarsa metabolizzazione; escrezione renale 80% immodificato in 24 h.",
    eff: "EPS meno frequenti rispetto ad altri AP tipici.",
    avv: "Aggiustare in insufficienza renale (escrezione renale).",
    note: "Utile nell’agitazione dell’etilista.",
    rec: { "D2": 2 },
  },
  {
    id: "clotiapina", nome: "Clotiapina", cls: "tip", sub: "Dibenzotiazepina",
    com: "ENTUMIN — gtt 100 mg/ml, cpr 40 mg, fl 40 mg im. Max 360 mg/die. >16 anni.",
    mecc: "Dibenzotiazepina (blocco D2 e 5-HT2A).",
    ind: "Psicosi acute e croniche, schizofrenia acuta e cronica, episodi maniacali, psicosi paranoidi, stati d’ansia, stati confusionali.",
    pos: "max 360 mg/die.",
    emi: "~8 h; 90% eliminata entro 24 h (prevalentemente nelle feci).",
    met: "Metabolizzazione epatica.",
    eff: "Sedazione.",
    avv: "",
    note: "",
    rec: { "D1": 1, "D2": 2, "5HT2A": 3 },
  },
  {
    id: "loxapina", nome: "Loxapina (inalatoria)", cls: "tip", sub: "Dibenzoxazepina",
    com: "ADASUVE — 9,1 mg polvere per inalazione (confezione solo ospedaliera).",
    mecc: "Simile strutturalmente alla clozapina; metabolita attivo 7-OH-loxapina (CYP3A4, CYP2D6).",
    ind: "Controllo rapido dello stato di agitazione da lieve a moderato in schizofrenia o disturbo bipolare.",
    pos: "4,5-9,1 mg, max 2 volte a distanza di 2 ore.",
    emi: "2-4 h (assorbimento inalatorio: picco entro ~2 min).",
    met: "CYP3A4 e CYP2D6 (non inibisce i citocromi).",
    eff: "Broncospasmo, EPS, aggravamento glaucoma, ipotensione, ritenzione urinaria, abbassamento soglia convulsiva.",
    avv: "Rischio broncospasmo → uso solo in ambito ospedaliero con broncodilatatore disponibile.",
    note: "Via inalatoria per un rapido controllo dell’agitazione.",
  },

  // ============ ANTIPSICOTICI ATIPICI ============
  {
    id: "clozapina", nome: "Clozapina", cls: "ati", sub: "MARTA · Dibenzodiazepina",
    com: "LEPONEX — cpr 25-100 mg. Solo in pazienti >16 anni con quadro leucocitario normale.",
    mecc: "Massimo rapporto 5-HT2A/D2 tra gli atipici (efficacia sui sintomi negativi, basso rischio EPS). Alta affinità 5HT2C e H1 (↑peso); massima M1 (s. anticolinergica) + agonismo M4 (scialorrea); blocco α2; agonismo 5-HT1A. Bassa occupazione D2 (20-70%), alta affinità D4.",
    ind: "Schizofrenia resistente (≥2 antipsicotici, incluso un atipico) o con EPS gravi; psicosi in m. di Parkinson resistenti. Storia di comportamento suicidario (FDA).",
    pos: "Titolazione lenta da 12,5 mg; 300 mg/die usuale, fino a 600; max 900 mg/die. Parkinson: max 50-100 mg/die. Sospensione graduale in 12 sett.",
    emi: "~8 h (dose singola), ~12 h (dosi multiple; bifasica). Legame proteico 97%.",
    met: "CYP1A2 (principale), CYP2D6, CYP3A4 → norclozapina (attiva). Caffeina ↑livelli; nicotina ↓ (induce CYP1A2). Metabolita → ioni nitrenio (tossico emopoietico).",
    eff: "AGRANULOCITOSI (0,5-2%); sedazione (24%); scialorrea (11%); effetti anticolinergici; ipotensione/tachicardia; ↑peso e s. metabolica (20%); crisi epilettiche dose-dip. (1% a 300 mg, 4,4% a 600); miocardite/cardiomiopatia (primi mesi, anche fatali); rara s. maligna.",
    avv: "Emocromo settimanale nelle prime 18 sett., poi mensile. Sospensione a leucociti <2000 o granulociti <1000. Livelli terapeutici 350-420 ng/ml; tossicità >750. Rischio di psicosi da sospensione (supersensitività).",
    note: "Il più efficace nella schizofrenia resistente; unico con evidenza anti-suicidaria in schizofrenia.",
    rec: { "α1": 2, "α2": 2, "D2": 1, "H1": 3, "M": 2, "5HT1A": 1, "5HT2A": 3, "5HT2C": 3 },
  },
  {
    id: "olanzapina", nome: "Olanzapina", cls: "ati", sub: "MARTA · Tienobenzodiazepina",
    com: "ZYPREXA — cpr 2,5-5-10 mg, VT 5-10 mg, fl 10 mg im. Depot ZYPADHERA (pamoato) 210-300-405 mg (1 fl/14-28 gg).",
    mecc: "Alta affinità 5HT2A/2C; media D2 e M1; bassa α1/α2; altissima H1 (potente antistaminico). Induzione di neurosteroidi e BDNF.",
    ind: "Schizofrenia (attacco e mantenimento); episodio maniacale; prevenzione di episodi maniacali nel bipolare; agitazione psicomotoria (im). (FDA anche 13-17 anni.) + fluoxetina: depressione bipolare I e resistente (non in commercio in IT).",
    pos: "5-20 mg/die (iniziale 10). im 10 mg (ripetibile, max 20/24 h). Anziani 2,5-5 mg.",
    emi: "34,5 h. Legame proteico 93%. Depot: T/2 30 gg, steady state ~12 sett.",
    met: "CYP1A2 (principale), CYP2D6. Escrezione urinaria 57%.",
    eff: "AUMENTO DI PESO marcato; s. metabolica (obesità, DM tipo II); EPS/acatisia ad alte dosi; moderata s. anticolinergica.",
    avv: "Depot: rischio PDSS (post-injection delirium/sedation) → osservazione ≥1-3 h. Warning stroke/mortalità nella demenza.",
    note: "Buona efficacia a lungo termine come stabilizzatore dell’umore.",
    rec: { "α1": 2, "α2": 1, "D2": 2, "H1": 3, "M": 2, "5HT2A": 3, "5HT2C": 3 },
  },
  {
    id: "quetiapina", nome: "Quetiapina", cls: "ati", sub: "MARTA · Dibenzotiazepina",
    com: "SEROQUEL — cpr 25-100-200-300 mg (RI) e 50-400 mg (RP). Range 300-800 mg/die.",
    mecc: "Alto rapporto 5-HT2/D2, con la più bassa affinità D2/5HT2 tra gli atipici. Alta α1, moderata M, minima H1 tra gli atipici. Legame D2 breve (rapida dissociazione). Metabolita norquetiapina inibisce il reuptake della NA (azione AD).",
    ind: "Psicosi acute/croniche (schizofrenia), episodi maniacali e depressivi del bipolare; prevenzione recidive; RP add-on nella depressione maggiore resistente. (L.648/96 ≥12 anni.) In IT non raccomandata in età pediatrica.",
    pos: "RI iniziale 50 mg/die → 300 (range 150-750). RP 300 → 600 (mant. 400-800). Anziani da 25 mg.",
    emi: "6-7 h; norquetiapina ~12 h. Legame proteico 83%.",
    met: "CYP3A4 → norquetiapina (attiva). Escrezione urinaria 73%, feci 21%.",
    eff: "Sedazione (22%), cefalea (13%), vertigini, ipotensione (6% giovani, 20% anziani), ↑peso (7%), stipsi, secchezza fauci, tachicardia.",
    avv: "Duplice attività AP e AD. Basso rischio EPS/prolattina.",
    note: "Efficace nella depressione bipolare (formulazione RP).",
    rec: { "α1": 3, "α2": 2, "D2": 1, "H1": 2, "M": 1, "5HT1A": 2, "5HT2A": 2 },
  },
  {
    id: "risperidone", nome: "Risperidone", cls: "ati", sub: "Antagonista D2/5-HT2 · Benzoisossazolo",
    com: "RISPERDAL — cpr 1-2-3-4 mg, soluzione 1 mg/ml. Depot RISPERDAL RP 25-37,5-50 mg (1 fl/14 gg). Metabolita attivo = paliperidone.",
    mecc: "Potente antagonismo D2 (simile all’aloperidolo) e 5-HT2A (rapporto 5HT2/D2 >1). Potente antagonista α1 (ipotensione alla prima dose); discreta α2/H1; modesto M.",
    ind: "Psicosi schizofreniche acute/croniche; episodio maniacale del bipolare; demenza di Alzheimer (aggressività, max 6 sett.); gtt: comportamento dirompente in bambini/adolescenti. (L.648/96) autismo ≥5 anni, Tourette ≥7 anni, add-on ADHD ≥7 anni.",
    pos: "Iniziale 2 mg/die → 4-8 mg/die (max 16). Fino a 6 mg atipico; oltre → EPS. Anziani 0,5-2 mg x2.",
    emi: "3 h (metabolita 9-OH fino a 20 h). Legame proteico 88%. Depot RP: picco 35 gg, T/2 4 gg, steady state 8 sett.",
    met: "CYP2D6, CYP3A4 → 9-OH-risperidone (paliperidone, attivo). Escrezione renale 70%.",
    eff: "EPS ad alte dosi (>6 mg); FORTE ↑prolattina (bassa specificità D2); moderato ↑peso/s. metabolica; ↑QT; rara s. maligna.",
    avv: "Warning stroke/mortalità nella demenza. Permea la placenta ed è escreto nel latte.",
    note: "Depot RP: prima formulazione con microsfere biodegradabili.",
    rec: { "α1": 3, "α2": 2, "D2": 3, "H1": 2, "M": 1, "5HT2A": 3, "5HT2C": 1 },
  },
  {
    id: "paliperidone", nome: "Paliperidone", cls: "ati", sub: "Antagonista D2/5-HT2 (9-OH-risperidone)",
    com: "INVEGA — cpr 3-6-9 mg ER. Depot XEPLION (palmitato) 75-100-150 mg (1 fl/28 gg).",
    mecc: "Metabolita attivo del risperidone; antagonismo D2 e 5-HT2A, potente α1.",
    ind: "Schizofrenia.",
    pos: "6 mg al mattino (3-12). Il cibo (grassi) aumenta l’assorbimento.",
    emi: "Depot XEPLION: picco 13 gg, T/2 29-45 gg, steady state 20 sett.",
    met: "Scarsa metabolizzazione epatica; prevalente escrezione renale.",
    eff: "Come risperidone: ↑prolattina, EPS dose-dipendenti.",
    avv: "Formulazione depot mensile utile per l’aderenza.",
    note: "",
    rec: { "α1": 3, "α2": 2, "D2": 3, "H1": 2, "M": 1, "5HT2A": 3, "5HT2C": 1 },
  },
  {
    id: "ziprasidone", nome: "Ziprasidone", cls: "ati", sub: "Antagonista D2/5-HT2",
    com: "cps 20-40-60-80 mg; fl 20 mg/ml im (sale mesilato).",
    mecc: "Blocco 5-HT2A >80% e D2 >50% (PET). Antagonista 5HT2C/1D; agonista parziale 5HT1A (↑DA prefrontale → sintomi negativi). Affinità per i trasportatori 5HT/NA; H1 e α1 modeste; M1 trascurabile.",
    ind: "Schizofrenia (adulti); episodi maniacali/misti del bipolare (10-17 anni); mantenimento bipolare (+ litio/valproato). im: agitazione acuta in schizofrenia (max 3 gg).",
    pos: "80 mg/die (40 x2) a stomaco pieno, max 160. im 10-40 mg/die per max 3 gg.",
    emi: "6-10 h. Legame proteico 99%.",
    met: "CYP3A4 (+ CYP1A2) → S-metil-diidroziprasidone (attivo). Migliore assorbimento a stomaco pieno.",
    eff: "Basso ↑peso e vantaggi metabolici; nausea/vomito/stipsi; insonnia (im). ↑QTc dose-dipendente (>60 msec nell’1,6%; torsioni di punta rare).",
    avv: "Non superare 160 mg/die (profilo QT non confermato oltre). Assumere sempre ai pasti.",
    note: "Profilo metabolico favorevole tra gli atipici.",
    rec: { "α1": 1, "D2": 2, "H1": 1, "M": 0, "5HT2A": 3, "5HT2C": 2 },
  },
  {
    id: "asenapina", nome: "Asenapina", cls: "ati", sub: "MARTA · sublinguale",
    com: "SYCREST — cpr 5-10 mg sublinguali.",
    mecc: "Affinità 30x per 5HT2C e α2B, 15x per 5HT5A/5HT6; 5HT2A 19x > D2. Occupazione D2 ~75% a ~6 mg. Bassa affinità M e β2.",
    ind: "Episodi maniacali da moderati a severi del bipolare I (adulti, UE); trattamento acuto della schizofrenia (US).",
    pos: "5-10 mg due volte al giorno. Via sublinguale (biodisponibilità 35% vs 2% per os).",
    emi: "24 h. Picco 0,5-1,5 h, steady state 3 gg. Legame proteico 95%.",
    met: "CYP1A2 + glucuronidazione diretta. Escrezione 40% renale, 50% fecale.",
    eff: "Sonnolenza, vertigini, EPS, ↑peso; ipotensione ortostatica/sincope (α1); convulsioni; ↑prolattina. QT non clinicamente rilevante. Reazioni allergiche gravi (FDA warning: anafilassi, angioedema).",
    avv: "Non mangiare/bere per 10 min dopo l’assunzione sublinguale.",
    note: "",
    rec: { "α2": 3, "D2": 2, "H1": 1, "M": 0, "5HT2A": 3, "5HT2C": 3 },
  },
  {
    id: "lurasidone", nome: "Lurasidone", cls: "ati", sub: "MARTA",
    com: "LATUDA — cpr 18,5-37-74 mg.",
    mecc: "Alta affinità (antagonista) per 5-HT7, α2C, D2 e 5-HT2A; 5-HT1A agonista parziale. Scarsa affinità 5HT2C, H1, M1.",
    ind: "Schizofrenia (adulti ≥18; EMA 2020 anche adolescenti ≥13 anni).",
    pos: "37 mg/die iniziale (senza titolazione), range 37-148, max 148, ai pasti.",
    emi: "20-40 h. Picco 1-3 h, steady state 7 gg. Legame proteico 99%.",
    met: "CYP3A4 → 2 metaboliti attivi (+2 inattivi). Escrezione fecale 67%, urinaria 19%. Attenzione a inibitori/induttori forti del CYP3A4.",
    eff: "Sonnolenza, nausea, acatisia; scarso ↑peso e alterazioni lipidico/glicemiche ridotte.",
    avv: "Assumere ai pasti (≥350 kcal) per assorbimento adeguato. No induttori/inibitori forti CYP3A4.",
    note: "Profilo metabolico favorevole; nessun aumento di peso atteso.",
    rec: { "D2": 3, "5HT2A": 3, "5HT7": 3, "α2": 2, "H1": 0, "M": 0 },
  },
  {
    id: "amisulpride", nome: "Amisulpride", cls: "ati", sub: "Antagonista selettivo D2/D3 · Benzamide",
    com: "SOLIAN 200-400 mg cpr; DENIBAN, SULAMID 50 mg cpr.",
    mecc: "Antagonista D2/D3 (autorecettori) e, in minor misura, D1; affinità 1000x D2>D1. A basse dosi (50 mg) effetto timoanalettico, ad alte dosi neurolettico. Blocco eterorecettori D2 → ↑NA.",
    ind: "Distimia, depressione dell’anziano, disturbi somatoformi (basse dosi); schizofrenia (dosi neurolettiche).",
    pos: "600-800 mg/die (schizofrenia); 50 mg (effetto antidepressivo). Ridurre in insufficienza renale.",
    emi: "5-17 h. Legame proteico 17%.",
    met: "Scarsa metabolizzazione epatica (metaboliti inattivi); escrezione renale.",
    eff: "Endocrini (↑prolattina: ↓libido, galattorrea, amenorrea); ↑appetito/peso; EPS nei predisposti.",
    avv: "No interazioni metaboliche. Controindicato in mastopatie maligne e feocromocitoma. Ridurre in insuff. renale.",
    note: "Tra gli atipici con efficacia superiore agli AP di I gen. (Leucht 2009).",
    rec: { "D2": 4, "D3": 4, "D1": 1 },
  },
  {
    id: "levosulpiride", nome: "Levosulpiride", cls: "ati", sub: "Antagonista selettivo D2/D3 · Benzamide",
    com: "LEVOPRAID 25-50-100 mg cpr, gtt 2,5%, fl 25-50 mg im/iv.",
    mecc: "Antagonista D2/D3; a basse dosi (75-150 mg) timoanalettico. <75 mg procinetico/antiulcera (anti-D2 + agonismo 5HT4).",
    ind: "Distimia, depressione dell’anziano, disturbi somatoformi; procinetico a basse dosi.",
    pos: "150-300 mg/die (effetto AP); <75 mg come procinetico.",
    emi: "8-11 h. Legame proteico 40%.",
    met: "Scarsa metabolizzazione epatica; escrezione renale.",
    eff: "↑prolattina (galattorrea, amenorrea); ↑peso; EPS (maggiore rispetto ad amisulpride).",
    avv: "Ridurre in insufficienza renale.",
    note: "",
    rec: { "D2": 3, "D3": 3, "5HT4": 2 },
  },
  {
    id: "aripiprazolo", nome: "Aripiprazolo", cls: "ati", sub: "Agonista parziale dopaminergico",
    com: "ABILIFY. Depot ABILIFY MAINTENA (monoidrato) 300-400 mg (1 fl/28 gg).",
    mecc: "Agonista parziale D2 e 5-HT1A; antagonista 5-HT2A («stabilizzatore» dopaminergico-serotoninergico).",
    ind: "Schizofrenia, mania; buona efficacia a lungo termine come stabilizzatore dell’umore nel bipolare.",
    pos: "15-30 mg/die (dose minima efficace 10 mg). Depot 1 fl/28 gg.",
    emi: "75-146 h. Legame proteico 99%. Depot: picco 7 gg, T/2 30-45 gg, steady state 20 sett.",
    met: "CYP2D6, CYP3A4 → diidro-aripiprazolo (attivo, 40%). Escrezione renale 30%, fecale 60%.",
    eff: "Basso ↑peso; possibili sintomi da sospensione serotoninergici (5HT2A). Acatisia.",
    avv: "Meno sedativo; basso rischio metabolico e di iperprolattinemia.",
    note: "Emivita molto lunga.",
  },
  {
    id: "cariprazina", nome: "Cariprazina", cls: "ati", sub: "Agonista parziale D3/D2",
    com: "REAGILA — cps 1,5-3-4,5-6 mg.",
    mecc: "Agonista parziale D3/D2 (Ki D3 0,085-0,3 nM; D2 0,49-0,71) e 5-HT1A; antagonista 5-HT2B/2A e H1. Bassa 5HT2C/α1; nulla M. Forte affinità D3 → sintomi negativi/depressivi, cognitività, craving.",
    ind: "Schizofrenia (efficacia particolarmente elevata sui sintomi negativi).",
    pos: "Titolazione graduale da 1,5 mg/die fino a 6 mg/die (mono-somministrazione).",
    emi: "Cariprazina 2-4 gg; metaboliti attivi DCAR 1-2 gg, DDCAR 1-3 settimane.",
    met: "CYP3A4 → desmetil- e didesmetil-cariprazina (attivi, prolungano l’emivita).",
    eff: "Acatisia (19%) e parkinsonismo (17,5%) i più frequenti. Nessun ↑QT ≥60 msec negli studi registrativi.",
    avv: "Controindicati induttori (carbamazepina) e inibitori forti del CYP3A4.",
    note: "Emivita molto lunga (metaboliti attivi fino a settimane).",
    rec: { "D3": 4, "D2": 3, "5HT1A": 2, "5HT2A": 2, "H1": 1, "M": 0 },
  },
  {
    id: "brexpiprazolo", nome: "Brexpiprazolo", cls: "ati", sub: "Agonista parziale dopaminergico (nuovo)",
    com: "RXULTI — cpr 1-2-3-4 mg.",
    mecc: "Agonista parziale D2 e 5-HT1A, antagonista 5-HT2A (come aripiprazolo, ma minore attività intrinseca su D2 e azione su 5HT1A/2A/α1B ≥ D2 → minore attivazione/EPS).",
    ind: "Schizofrenia (adulti).",
    pos: "1 mg/die (gg 1-4) → 2 mg (gg 5-7) → max 4 mg/die.",
    emi: "~91 h (metabolita DM-3411 ~86 h). AUC 25% maggiore nelle donne.",
    met: "CYP3A4 e CYP2D6.",
    eff: "Bassa incidenza di effetti attivanti/sedativi; modesto ↑peso; QT e parametri metabolici non clinicamente significativi.",
    avv: "Profilo simile all’aripiprazolo con minore propensione all’attivazione.",
    note: "",
  },

  // ============ STABILIZZANTI DELL’UMORE ============
  {
    id: "litio", nome: "Litio", cls: "sta", sub: "Sale · catione monovalente",
    com: "CARBOLITHIUM cps 150-300 mg (carbonato, RI); RESILIENT cpr 83 mg (solfato, RP). Carbonato 300 mg = 8,1 mEq.",
    mecc: "Non del tutto chiaro. Inibizione di adenilato-ciclasi e fosfolipasi C, proteine G, inositolo-monofosfatasi; ↓release DA, ↑serotonina; down-regulation β-recettori; sostituzione al Na (potenziale cardiotossico); inibizione GSK-3β → neuroprotezione (↑bcl-2, BDNF).",
    ind: "Terapia d’attacco e mantenimento/profilassi degli episodi maniacali e depressivi del bipolare; riduce il rischio di suicidio (-80%). Non psichiatriche: cefalea a grappolo, leucopenie da farmaci.",
    pos: "Iniziare 600 mg/die in dosi refratte, titolare sulla litiemia. Litiemia efficace: mania 0,8-1,2 mEq/l; profilassi 0,5-0,8. Anziani ≤0,6. Non <12 anni.",
    emi: "T/2 10-24 h, steady state 2-5 gg. Vd 0,7-1 l/kg.",
    met: "NON metabolizzato, NON legame proteico. Escrezione renale 95% (riassorbito nel tubulo prossimale, compete col Na). Clearance 15-30 ml/min.",
    eff: "Fino al 90% dei pazienti: poliuria/polidipsia (diabete insipido nefrogenico, 50%), tremori (30-70%), ↑peso (11-65%), gozzo/ipotiroidismo (4-30%), iperparatiroidismo/ipocalcemia, inversione onda T. Teratogeno (anomalia di Ebstein).",
    avv: "Indice terapeutico ristretto. Monitoraggio litiemia (12 h, 7/14/21/30 gg, poi mensile x6 mesi, poi trimestrale) + creatinina, TSH/T3/T4, ECG, ecografia renale. Tossicità >1,5 mEq/l (letale >2,5): atassia, disartria, convulsioni, coma, insuff. renale (SILENT). Interazioni: tiazidici, ACE-i, FANS, sartani ↑litiemia; disidratazione pericolosa; rischio s. serotoninergica e s. maligna. Controindicazioni: insuff. renale acuta/grave, IMA acuto, s. Brugada, iponatremia marcata.",
    note: "Primo farmaco nella mania acuta e nella prevenzione delle recidive; dimostrata azione anti-suicidaria.",
  },
  {
    id: "valproato", nome: "Valproato (ac. valproico)", cls: "sta", sub: "Antiepilettico",
    com: "DEPAKIN 300-500 mg RP (Chrono), granulato 100-1000 mg RM; DEPAMIDE (valpromide). Livello efficace 50-100 mcg/ml.",
    mecc: "↑GABA cerebrale (incentiva la GAD, ac. glutammico → GABA); a livello limbico ↑inattivazione dei canali del Na (modello del kindling da stress).",
    ind: "Trattamento e prevenzione della mania nel bipolare. Non psichiatriche: epilessia generalizzata e parziale, S. West, S. Lennox-Gastaut.",
    pos: "Iniziale 500 mg/die, +250-500 mg ogni 3-4 gg. Effetto antimaniacale a 45-100 mcg/ml (>125 tossico). Maggiore efficacia del litio in mania disforica, stati misti, rapid cycling.",
    emi: "T/2 5-20 h, steady state 3-4 gg. Legame proteico 75%.",
    met: "Metaboliti attivi; inibitore del CYP2C9 (↑livello dei farmaci co-somministrati). Escrezione fecale 97%.",
    eff: "Atassia, nausea/vomito, ↑transaminasi, iperammoniemia, trombocitopenia/leucopenia, alopecia, ↑peso, alterazione dei cicli ovulatori.",
    avv: "Teratogeno (spina bifida 1-2%) → non in donne in età fertile. Intossicazione: sedazione fino al coma.",
    note: "Prima scelta nella mania disforica e negli stati misti.",
  },
  {
    id: "carbamazepina", nome: "Carbamazepina", cls: "sta", sub: "Antiepilettico",
    com: "TEGRETOL cpr 200-400 mg, RM. Livello efficace 4-10 mcg/ml.",
    mecc: "Composto triciclico (simile all’imipramina). Allunga l’inattivazione dei canali del Na, inibendo le scariche ripetute.",
    ind: "Mania (effetto più rapido del litio; efficace sui rapid cycling; profilassi 40% vs 78% placebo; tolleranza dopo 3-4 anni). Non psichiatriche: epilessia, nevralgia del trigemino.",
    pos: "Mania acuta 400-600 → 800-1000 mg/die. Profilassi 200 → 600-1200 mg/die.",
    emi: "10-56 h, steady state 2-4 gg. Autoinduttore.",
    met: "CYP3A4 (principale, autoinduzione), CYP2C9 → 10,11-epossido (attivo). Legame proteico 75%. Escrezione urinaria 70%. FORTE induttore del CYP3A4 (↓farmaci associati).",
    eff: "Neurologici (atassia, diplopia, vertigini); ematologici (leucopenia/trombocitopenia 10%, rara anemia aplastica/agranulocitosi); iponatremia da SIADH (5-30%, anziani); ↑transaminasi; rush (rari s. Lyell/Stevens-Johnson); alopecia (6%).",
    avv: "Teratogeno (spina bifida; ridurre con folati). Forte induttore enzimatico (interazioni). Intossicazione: midriasi, oftalmoplegia, EPS, s. cerebellari, coma.",
    note: "Effetto antimaniacale più rapido del litio.",
  },
  {
    id: "oxcarbazepina", nome: "Oxcarbazepina", cls: "sta", sub: "Antiepilettico (derivato carbamazepina)",
    com: "TOLEP cpr 300-600 mg divisibili.",
    mecc: "Derivato della carbamazepina; stesso meccanismo (canale del Na voltaggio-dipendente), minor impegno metabolico epatico e minor rischio di anemia grave.",
    ind: "Epilessia (crisi parziali e generalizzate). Nel documento non ha indicazione psichiatrica registrata autonoma (uso derivato dalla carbamazepina).",
    pos: "600-1200 mg/die (max 3000) in 2-3 dosi. Non <3 anni.",
    emi: "ND",
    met: "Minor impegno epatico rispetto alla carbamazepina.",
    eff: "Effetti collaterali minori rispetto alla carbamazepina, a parità di efficacia.",
    avv: "",
    note: "",
  },
  {
    id: "lamotrigina", nome: "Lamotrigina", cls: "sta", sub: "Antiepilettico",
    com: "LAMICTAL cpr 5-25-50-100-200 mg.",
    mecc: "Derivato feniltriazinico; stabilizzazione dei canali del Na.",
    ind: "Prevenzione degli episodi depressivi nel bipolare (efficacia dimostrata sui depressivi). Non psichiatriche: epilessia generalizzata e parziale.",
    pos: "Titolazione LENTA: iniziare 25 mg/die, +25 mg ogni 14 gg (dimezzata con valproato, raddoppiata con carbamazepina). Range 150-600 mg/die.",
    emi: "T/2 24 h. Picco 2-3 h. Legame proteico 50%.",
    met: "Glicuronoconiugazione (metaboliti inattivi); escrezione renale 80%.",
    eff: "Cutanei (2-5% maculo-papulari, sptt. <12 anni o titolazione rapida); 0,3-1% reazioni gravi (s. Lyell, Stevens-Johnson), sptt. nelle prime 8 sett.",
    avv: "Titolazione lenta obbligatoria per il rischio cutaneo. Teratogeno (ritardata ossificazione).",
    note: "Efficace nella prevenzione degli episodi depressivi del bipolare.",
  },
  {
    id: "topiramato", nome: "Topiramato", cls: "sta", sub: "Antiepilettico",
    com: "TOPAMAX cps 25-50-100-200 mg.",
    mecc: "Blocca i canali del Na voltaggio-dipendenti; ↑attività GABA-A; inibisce i recettori AMPA/kainato; debole inibitore dell’anidrasi carbonica.",
    ind: "(AIFA) epilessia parziale/generalizzata (monoterapia ≥6 anni; add-on ≥2 anni; Lennox-Gastaut); profilassi emicrania (adulti). Off-label: binge-eating, bulimia, disturbo da uso di alcol, ↑peso da antipsicotici, tremore essenziale. No terapia in acuto.",
    pos: "Titolazione da 25 mg/die (sera), +25-50 mg/settimana; max 500 mg/die (fino a 1000 nell’epilessia resistente). No monitoraggio ematico.",
    emi: "~21 h. Escrezione renale.",
    met: "Inibisce il CYP2C19; fenitoina/carbamazepina ↓ i suoi livelli. Monitorare la litiemia se co-somministrato.",
    eff: "SNC (parestesie, fatigue, deficit cognitivi, sonnolenza, rallentamento psicomotorio); ↓peso/anoressia; miopia acuta e glaucoma ad angolo chiuso; oligoidrosi/ipertermia; acidosi metabolica (calcoli renali); ideazione suicidaria.",
    avv: "Teratogeno (categoria D; labiopalatoschisi ~13x). Ridurre in insufficienza renale.",
    note: "Impiego off-label per il calo ponderale e nelle dipendenze.",
  },

  // ============ ANTIDEPRESSIVI — TRICICLICI ============
  {
    id: "amitriptilina", nome: "Amitriptilina", cls: "ad", sub: "Triciclico (amina terziaria)",
    com: "LAROXYL, TRIPTIZOL, ADEPRIL — cpr 10-25 mg, gtt (1 gtt = 2 mg). Range 75-200 ng/ml.",
    mecc: "Inibizione del reuptake di 5HT>NA; potente blocco M, H1, α1.",
    ind: "Depressione maggiore melancolica; profilassi emicrania; enuresi (bambini); nevralgie; ulcera peptica.",
    pos: "Depressione 50-250 mg/die; profilassi emicrania 10-50 mg/die.",
    emi: "20-50 h. Legame proteico 85%.",
    met: "CYP1A2 (demetilazione) e CYP2D6 (idrossilazione) → nortriptilina (attiva). Escrezione renale 2/3.",
    eff: "Anticolinergici marcati (secchezza fauci, stipsi, ritenzione urinaria, offuscamento visivo, tachicardia); sedazione, ↑peso (H1); ipotensione ortostatica (α1). Cardiotossicità (↑QTc, chinidino-simile). Epilettogeno dose-dip.",
    avv: "Controindicato nel glaucoma ad angolo chiuso. Tossico >1000 ng/ml (>1 g letale). Antidoto intossicazione: fisostigmina.",
    note: "Fra i TCA più sedativi e anticolinergici.",
    rec: { "re-NA": 0.5, "re-5HT": 2, "α1": 3, "H1": 4, "M": 4 },
  },
  {
    id: "clomipramina", nome: "Clomipramina", cls: "ad", sub: "Triciclico (amina terziaria)",
    com: "ANAFRANIL — cpr 10-25 mg, 75 mg SR, fl im/iv 25 mg/2 ml. Range 75-300 ng/ml.",
    mecc: "TCA più serotoninergico; inibizione del reuptake di 5HT>NA.",
    ind: "Depressione; fobie; DOC (gold standard, 225-300 mg/die per ≥12 sett.); disturbo da attacchi di panico; dolore cronico.",
    pos: "Depressione 75-200 mg/die; DOC 225-300 mg/die; DAP da 10-20 mg/die; dolore 10-150 mg/die. Minori (IT) 2-3 mg/kg/die.",
    emi: "20-50 h. Legame proteico 85%.",
    met: "CYP → desmetilclomipramina (attiva).",
    eff: "Anticolinergici, sedazione, cardiotossicità (come TCA). Sindrome da sospensione 30,8%.",
    avv: "Come TCA. Uno dei TCA utilizzati nei minori in IT (con imipramina).",
    note: "Standard di riferimento nel DOC.",
    rec: { "re-NA": 1, "re-5HT": 3, "α1": 2, "H1": 1, "M": 2 },
  },
  {
    id: "nortriptilina", nome: "Nortriptilina", cls: "ad", sub: "Triciclico (amina secondaria)",
    com: "NORITREN — cpr 10-25 mg. Range 50-200 ng/ml.",
    mecc: "Amina secondaria; inibizione del reuptake di NA>5HT; minore blocco M/H1/α1.",
    ind: "Depressione; nausea; nevralgie; orticaria.",
    pos: "75-150 mg/die.",
    emi: "20-50 h.",
    met: "Idrossilazione via CYP2D6.",
    eff: "Effetti anticolinergici e ipotensione minori rispetto alle amine terziarie.",
    avv: "Meglio tollerata nell’anziano rispetto alle amine terziarie.",
    note: "Metabolita attivo dell’amitriptilina.",
    rec: { "re-NA": 2, "re-5HT": 0.5, "α1": 1, "H1": 1, "M": 2 },
  },
  {
    id: "imipramina", nome: "Imipramina", cls: "ad", sub: "Triciclico (amina terziaria)",
    com: "TOFRANIL cpr 10-25 mg — NON più in commercio in IT. Range 75-300 ng/ml.",
    mecc: "Capostipite dei TCA; inibizione del reuptake di NA e 5HT.",
    ind: "Depressione; DAP; ADHD; bulimia; enuresi (bambini); nevralgie. Minori (IT) 1-5 mg/kg/die.",
    pos: "Max mono-somministrazione 150 mg.",
    emi: "20-50 h.",
    met: "CYP1A2 (demetilazione) → desipramina; CYP2D6 (idrossilazione).",
    eff: "Come TCA (anticolinergici, cardiotossicità, sedazione).",
    avv: "Come TCA. Non più in commercio in IT.",
    note: "",
    rec: { "re-NA": 1, "re-5HT": 1, "α1": 2, "H1": 1, "M": 2 },
  },
  {
    id: "desipramina", nome: "Desipramina", cls: "ad", sub: "Triciclico (amina secondaria)",
    com: "NORTIMIL cpr 25 mg — NON più in commercio in IT. Range 75-300 ng/ml.",
    mecc: "Amina secondaria; inibizione selettiva del reuptake della NA.",
    ind: "ADHD (200 mg/die nell’adulto); bulimia; cataplessia/narcolessia; nevralgie.",
    pos: "ND (range ematico 75-300 ng/ml).",
    emi: "20-50 h.",
    met: "Idrossilazione via CYP2D6.",
    eff: "Minori effetti anticolinergici; morti improvvise segnalate nei minori → non indicata nei minori.",
    avv: "Non indicata nei minori (morti improvvise). Non più in commercio in IT.",
    note: "Metabolita attivo dell’imipramina.",
    rec: { "re-NA": 3, "re-5HT": 0, "α1": 1, "H1": 0, "M": 1 },
  },
  {
    id: "trimipramina", nome: "Trimipramina", cls: "ad", sub: "Triciclico (amina terziaria)",
    com: "SURMONTIL — cpr 25-100 mg, gtt (1 gtt = 1 mg). Range 75-300 ng/ml.",
    mecc: "TCA (amina terziaria) con marcata attività antistaminica e sedativa.",
    ind: "Depressione, fobie, isteria, DOC.",
    pos: "75-300 mg/die.",
    emi: "20-50 h.",
    met: "Metabolismo epatico (CYP).",
    eff: "Marcata sedazione (H1); effetti anticolinergici.",
    avv: "Come TCA.",
    note: "",
    rec: { "re-NA": 1, "re-5HT": 0, "α1": 2, "H1": 3, "M": 2 },
  },
  {
    id: "dotiepina", nome: "Dotiepina (dosulepina)", cls: "ad", sub: "Triciclico (dibenzotiazepina)",
    com: "PROTIADEN — cpr 75 mg. Range 75-150 ng/ml.",
    mecc: "TCA (dibenzotiazepina), profilo sedativo.",
    ind: "Depressione.",
    pos: "75-150 mg/die.",
    emi: "20-50 h.",
    met: "Metabolismo epatico (CYP).",
    eff: "Sedazione (H1); effetti anticolinergici.",
    avv: "Come TCA.",
    note: "",
    rec: { "re-NA": 1, "re-5HT": 0, "α1": 1, "H1": 3, "M": 2 },
  },
  {
    id: "maprotilina", nome: "Maprotilina", cls: "ad", sub: "Tetraciclico (pseudo-quadriciclico)",
    com: "LUDIOMIL — cpr 50-75 mg. Range 50-150 ng/ml.",
    mecc: "Inibizione del reuptake della NA.",
    ind: "Depressione.",
    pos: "75-150 mg/die.",
    emi: "20-50 h.",
    met: "Metabolismo epatico (CYP).",
    eff: "Il più epilettogeno tra i triciclici (1/4 dei pazienti con dose tossica presenta crisi).",
    avv: "Elevato rischio epilettogeno; cautela nei predisposti.",
    note: "",
    rec: { "re-NA": 2, "re-5HT": 0, "α1": 1, "H1": 2, "M": 1 },
  },

  // ============ ANTIDEPRESSIVI — SARI ============
  {
    id: "trazodone", nome: "Trazodone", cls: "ad", sub: "SARI (triazolopiridina)",
    com: "TRITTICO 50-100 mg cpr, gtt (1 gtt = 2 mg), fl 50 mg im/iv; AC 75-150 mg; Contramid 150-300 mg.",
    mecc: "Agonista-antagonista serotoninergico: agonista 5-HT1A e (via metabolita m-CPP) 5HT1D; antagonista 5-HT2A/2C; debole inibizione del reuptake di 5HT (>150 mg). Antagonista α1 (>α2); moderata attività H1.",
    ind: "Depressione con/senza ansia (≥18 anni); ansia/insonnia (ipnoinducente, effetto simile al diazepam); agitazione in demenza; dolore; pre-anestesia.",
    pos: "75-600 mg/die (serale). Formulazione iniettiva per depressione/dolore/anestesia.",
    emi: "3-9 h (m-CPP 4-14 h). Legame proteico 95%.",
    met: "CYP3A4, CYP2D6 → m-CPP (attivo). Escrezione renale 75%. Ridurre in insufficienza epatica.",
    eff: "Sedazione/sonnolenza (70%), ipotensione ortostatica/tachicardia riflessa, PRIAPISMO (1:6000-1:20000), dispepsia.",
    avv: "Buon indice terapeutico. NON controindicato nel glaucoma/disturbi della minzione; nessun effetto extrapiramidale né sulla conduzione cardiaca (a differenza dei TCA). Rischio s. serotoninergica con IMAO/altri serotoninergici.",
    note: "Molto usato a basse dosi come ipnoinducente.",
  },

  // ============ ANTIDEPRESSIVI — SSRI ============
  {
    id: "citalopram", nome: "Citalopram", cls: "ad", sub: "SSRI",
    com: "ELOPRAM, SEROPRAM (e altri) — cpr 20-40 mg, fl 40 mg im/iv (10 gtt = 20 mg).",
    mecc: "Inibizione del SERT; attività accessoria: blocco H1.",
    ind: "Depressione, DAP.",
    pos: "20-60 mg/die (serale, sedativo); DAP da 10 mg/die +10/settimana. Dimezzare nell’anziano.",
    emi: "33 h (cinetica lineare). Legame proteico 80%.",
    met: "CYP3A4, CYP2C19, (CYP2D6). Biodisponibilità 80-95%.",
    eff: "GI, sedazione (H1), ↑peso; ↑QTc dose-dipendente.",
    avv: "↑QTc dose-dipendente: cautela con altri farmaci che allungano il QT.",
    note: "",
  },
  {
    id: "escitalopram", nome: "Escitalopram", cls: "ad", sub: "SSRI (enantiomero S)",
    com: "CIPRALEX, ENTACT — cpr 10 mg (10 gtt = 10 mg).",
    mecc: "Il più selettivo tra gli SSRI; nessuna attività recettoriale accessoria rilevante.",
    ind: "Depressione, DAP, fobia sociale, GAD.",
    pos: "10-20 mg/die (iniziale 5), al mattino o alla sera indifferentemente.",
    emi: "30 h (lineare). Legame proteico 50-80%.",
    met: "CYP3A4, CYP2C19, (CYP2D6).",
    eff: "Buona tollerabilità; ↑QTc dose-dipendente.",
    avv: "↑QTc dose-dipendente.",
    note: "Enantiomero S-(+) del citalopram; il più selettivo tra gli SSRI.",
  },
  {
    id: "fluoxetina", nome: "Fluoxetina", cls: "ad", sub: "SSRI",
    com: "PROZAC, FLUOXEREN (e altri) — cps/cpr 20 mg, soluzione 20 mg/5 ml.",
    mecc: "SSRI attivante; attività accessoria: inibizione del reuptake della NA, agonismo 5HT2C.",
    ind: "Depressione, DOC, bulimia (anche bambini >8 anni — unico SSRI approvato nei minori negli USA).",
    pos: "20-60 mg/die (mattino, stimolante); DAP da 10 mg; bulimia 60 mg. Ridurre in anziani/epato/nefropatici.",
    emi: "24-72 h; norfluoxetina 4-16 giorni (non lineare). Legame proteico 94%.",
    met: "CYP2D6 → norfluoxetina (attiva). Inibitore del CYP2D6 (++) e CYP2C (++).",
    eff: "Ansia/agitazione/insonnia; ↓peso; nausea; rash orticarioide; iponatremia da SIADH. Sindrome da sospensione 0% (lunga emivita).",
    avv: "Gravidanza: dati su malformazioni cardiovascolari; PPHN nel terzo trimestre.",
    note: "Emivita lunghissima → nessuna sindrome da sospensione.",
  },
  {
    id: "fluvoxamina", nome: "Fluvoxamina", cls: "ad", sub: "SSRI",
    com: "DUMIROX, FEVARIN, MAVERAL — cpr 50-100 mg.",
    mecc: "SSRI sedativo; affinità per i recettori σ.",
    ind: "Depressione, DOC (anche bambini >8 anni).",
    pos: "100-300 mg/die (iniziale 50, serale).",
    emi: "15 h (non lineare). Legame proteico 77%.",
    met: "CYP2D6. Potente inibitore del CYP1A2 (++++) e CYP3A4 (+++).",
    eff: "GI (i più frequenti), sedazione/sonnolenza. Sindrome da sospensione 14%.",
    avv: "Potente inibitore CYP1A2/CYP3A4: molte interazioni (es. ↑clozapina, ↑agomelatina).",
    note: "",
  },
  {
    id: "paroxetina", nome: "Paroxetina", cls: "ad", sub: "SSRI",
    com: "SEREUPIN, SEROXAT, EUTIMIL — cpr 20 mg, gtt (10 gtt = 5 mg); DAPAROX.",
    mecc: "SSRI più potente in vitro (25x fluvoxamina); accessori: inibizione del reuptake della NA, blocco M3, inibizione della NO-sintasi.",
    ind: "Depressione, DOC, fobia sociale, DPTS, DAP, GAD.",
    pos: "20-60 mg/die; DAP da 10 mg +10/settimana fino a 60; DOC fino a 60. <40 mg in anziani/epato/nefropatici.",
    emi: "20 h (non lineare). Legame proteico 95%.",
    met: "CYP2D6. Potente inibitore del CYP2D6 (++++).",
    eff: "Massima xerostomia/sudorazione (anticolinergica), disfunzioni sessuali (max tra SSRI, blocco NO-sintasi), ↑peso. Sindrome da sospensione 20% (breve emivita).",
    avv: "Non indicata nei minori (↑rischio suicidario). Malformazioni con esposizione precoce in gravidanza.",
    note: "SSRI con maggiore azione anticolinergica e sindrome da sospensione più frequente.",
  },
  {
    id: "sertralina", nome: "Sertralina", cls: "ad", sub: "SSRI",
    com: "ZOLOFT, TATIG, TRALISEN — cpr 50-100 mg, soluzione 20 mg/ml.",
    mecc: "SSRI; accessori: inibizione del reuptake della DA (proprietà attivanti/disinibenti), affinità σ.",
    ind: "Depressione, DOC, DPTS, DAP (anche pediatrici 6-17 anni).",
    pos: "50-200 mg/die (con i cibi); DAP da 25 mg +25/settimana.",
    emi: "24-26 h; desmetilsertralina 66 h (lineare). Legame proteico 99%.",
    met: "CYP3A4, CYP2C19, CYP2C9, CYP2D6, CYP2B6.",
    eff: "GI; minori effetti da ridotto tono dopaminergico (blocco DAT). Sindrome da sospensione 2,2%.",
    avv: "Buon profilo di interazioni; utilizzabile in età pediatrica.",
    note: "Blocca il trasportatore della dopamina → effetto lievemente attivante.",
  },

  // ============ ANTIDEPRESSIVI — SNRI ============
  {
    id: "venlafaxina", nome: "Venlafaxina", cls: "ad", sub: "SNRI",
    com: "EFEXOR, FAXINE, ZARELIS — cps RP 37,5-225 mg.",
    mecc: "Inibitore del reuptake di 5HT e NA (5x più potente per 5HT); debole reuptake DA. A basse dosi prevale 5HT, >150 mg 5HT+NA, dosi massime anche DA. Priva di affinità M/H1/α.",
    ind: "Depressione maggiore e prevenzione recidive; GAD; ansia sociale; DAP con/senza agorafobia.",
    pos: "RP 75 → 150-225 mg/die (max 375), ai pasti; incrementi ogni ≥2 sett.",
    emi: "Venlafaxina 5 h; O-demetilvenlafaxina (ODV, attivo) 11 h. Legame proteico 27-30%.",
    met: "CYP2D6 → ODV (attivo). Debole inibitore del CYP2D6. Escrezione renale.",
    eff: "Nausea, sudorazione, cefalea; insonnia, xerostomia, tremore; ↑PA diastolica dose-dipendente (>300 mg). Drop-out 28%. Sindrome da sospensione 44,5% (la più alta).",
    avv: "Controindicata con IMAO (intervallo 7 gg dopo venlafaxina, 14 gg dopo IMAO). Sindrome da sospensione frequente e marcata.",
    note: "Effetto AD già dal 7° giorno secondo la maggior parte degli studi.",
  },
  {
    id: "duloxetina", nome: "Duloxetina", cls: "ad", sub: "SNRI",
    com: "CYMBALTA, XERISTAR — cps 30-60 mg; YENTREVE 20-40 mg (incontinenza da sforzo).",
    mecc: "Inibitore bilanciato del reuptake di 5HT/NA (rapporto NA:5HT 9,4:1 vs 30:1 della venlafaxina). Debole reuptake DA. Priva di affinità H/DA/M/α.",
    ind: "Depressione maggiore (superiore agli SSRI nelle forme gravi); dolore neuropatico diabetico; GAD; fibromialgia (FDA).",
    pos: "60 mg/die (≈150 mg di venlafaxina), fino a 120.",
    emi: "12 h. Picco 6 h. Legame proteico 96%.",
    met: "CYP2D6, CYP1A2 (metaboliti inattivi). Debole inibitore del CYP2D6.",
    eff: "Nausea, secchezza fauci, stipsi; ↓peso, insonnia, disfunzioni sessuali; ↑FC (+1,4 bpm). Drop-out 10%.",
    avv: "Non in epatopatia/insufficienza renale grave. IMAO (14 gg / 5 gg). Cautela con inibitori CYP1A2 (fluvoxamina).",
    note: "Rapporto NA:5HT più bilanciato della venlafaxina.",
  },

  // ============ ANTIDEPRESSIVI — ALTRE CLASSI ============
  {
    id: "mirtazapina", nome: "Mirtazapina", cls: "ad", sub: "NaSSA (tetraciclico)",
    com: "REMERON — cpr orodispersibili 15-30 mg, soluzione (1 ml = 15 mg).",
    mecc: "Antagonista α2 pre-sinaptico (auto/eterorecettori) → ↑release di 5HT e NA; antagonista 5HT2/5HT3 (potenzia 5HT1A); potente antagonista H1.",
    ind: "Depressione (rapidità d’azione, efficace sull’ansia associata); off-label: panico, GAD, distimia.",
    pos: "15-45 mg/die (serale, dose unica). Non iniziare troppo basso: a <15 mg prevale l’effetto antistaminico/sedativo.",
    emi: "20-40 h, steady state 5 gg. Biodisponibilità 50%. Legame proteico 85%.",
    met: "CYP1A2, CYP3A4, CYP2D6. Escrezione renale 85%.",
    eff: "Sonnolenza, sedazione, secchezza fauci, ↑appetito/peso (H1). Basso rischio epilettico, buon indice terapeutico. Raro viraggio maniacale; rara neutropenia/agranulocitosi.",
    avv: "Limitati effetti cardiovascolari (non ↑QTc). Potenzia alcool e BDZ.",
    note: "A dosi più alte l’effetto noradrenergico controbilancia la sedazione.",
  },
  {
    id: "mianserina", nome: "Mianserina", cls: "ad", sub: "Tetraciclico (piperazinico)",
    com: "LANTANON — cpr 30 mg, gtt 60 mg/ml (1 gtt = 2 mg).",
    mecc: "Simile alla mirtazapina, ma antagonismo α1 10x superiore (mitiga la neurotrasmissione 5HT e causa ipotensione posturale).",
    ind: "Depressione (analogo spettro d’azione alla mirtazapina).",
    pos: "60-120 mg/die (serale).",
    emi: "10-40 h. Legame proteico 90%. Biodisponibilità 30%.",
    met: "Idrossi-mianserina e demetil-mianserina (attivi).",
    eff: "Molto sedativa; ipotensione; discrasie ematiche (granulocitopenia/agranulocitosi → controllo crasi nelle prime 6 sett.); abbassa la soglia epilettica.",
    avv: "Controllo dell’emocromo nelle prime 6 settimane.",
    note: "",
  },
  {
    id: "reboxetina", nome: "Reboxetina", cls: "ad", sub: "NARI (inibitore selettivo NA)",
    com: "EDRONAX — cpr 4 mg.",
    mecc: "Inibitore selettivo del reuptake della NA (il più potente); down-regulation dei β-recettori. Nessuna affinità α/M/H apprezzabile.",
    ind: "Depressione (con rallentamento psicomotorio, apatia, astenia, ritiro sociale; migliora il comportamento sociale).",
    pos: "4 mg x2/die, fino a 10-12 mg/die. Ridurre in anziani e insufficienza epatorenale.",
    emi: "12 h. Legame proteico 98%.",
    met: "CYP3A4 (non inibisce i citocromi). Interazioni con inibitori/induttori del CYP3A4 (ketoconazolo, carbamazepina).",
    eff: "«S. pseudo-anticolinergica» da ↑tono simpatico (ritenzione urinaria, secchezza fauci, stipsi, offuscamento visivo); sudorazione; ipertensione ad alte dosi; insonnia.",
    avv: "Farmaco attivante: utile nelle forme con apatia/ritiro. Ben tollerata, sicura in sovradosaggio.",
    note: "",
  },
  {
    id: "bupropione", nome: "Bupropione", cls: "ad", sub: "Inibitore reuptake DA/NA",
    com: "WELLBUTRIN, ELONTRIL cpr RP 150-300 mg (depressione); ZYBAN cpr 150 mg (tabagismo).",
    mecc: "Inibitore selettivo del reuptake della DA e, in minor misura, della NA; ↑DA n. accumbens, ↑NA locus coeruleus; agisce su gratificazione e craving. Non sopprime il sonno REM.",
    ind: "Depressione maggiore (efficace quanto SSRI/TCA); disassuefazione dal fumo (300 mg/die); bulimia; ADHD; bipolare II a cicli rapidi (minor rischio di viraggio).",
    pos: "Depressione: RP. Tabagismo: 150 mg x3 gg → 300 mg/die per 7-9 sett. (iniziare 1-2 sett. prima dello stop).",
    emi: "21 h (RP), steady state 5-8 gg. Legame proteico 85%.",
    met: "CYP2B6 → metaboliti attivi. Autoinduttore; inibisce il CYP2D6.",
    eff: "Attivante: insonnia, agitazione, ↓appetito, sintomi psicotici nei predisposti; cefalea, nausea, secchezza fauci. RISCHIO CONVULSIONI dose-dipendente (0,1% <300 mg; 0,33-0,44% >450 mg).",
    avv: "Non sedativo. Interazioni: IMAO (crisi ipertensive), fluoxetina/litio (convulsioni), L-DOPA (allucinazioni), valproato (↑livelli). Rischio convulsivo dose-dipendente.",
    note: "Basso rischio di disfunzione sessuale e viraggio maniacale.",
  },
  {
    id: "agomelatina", nome: "Agomelatina", cls: "ad", sub: "Agonista melatoninergico",
    com: "VALDOXAN, THYMANAX — cpr 25 mg.",
    mecc: "Agonista MT1/MT2 (ritmo circadiano, nucleo soprachiasmatico) + antagonista 5-HT2C/2B → ↑NA e DA corticali. Migliora il sonno profondo (SWS) senza alterare il REM.",
    ind: "Depressione maggiore (efficace già dalla prima settimana, anche nelle forme gravi; nessuna sindrome da sospensione).",
    pos: "25 mg la sera; se insufficiente, dopo 2 sett. → 50 mg.",
    emi: "1-2 h. Biodisponibilità <5%. Legame proteico 95%.",
    met: "CYP1A2 (principale), CYP2C9/2C19 (metaboliti inattivi). Escrezione renale 80%.",
    eff: "Cefalea, ansia, vertigini, sonnolenza, nausea; ↑enzimi epatici → monitoraggio (0, 6, 12, 24 sett.; sospendere se >3x ULN).",
    avv: "Controindicata in insufficienza epatica e con inibitori forti del CYP1A2 (fluvoxamina, ciprofloxacina). Nessuna alterazione cardiovascolare, psicomotoria o sessuale.",
    note: "Buona tollerabilità sessuale e sul peso; richiede monitoraggio epatico.",
  },
  {
    id: "vortioxetina", nome: "Vortioxetina", cls: "ad", sub: "AD multimodale",
    com: "BRINTELLIX — cpr 5-10 mg, soluzione 20 mg/ml.",
    mecc: "Multimodale: antagonista 5-HT3A e 5-HT7, agonista parziale 5-HT1B, agonista 5-HT1A, potente inibitore del reuptake di 5HT → ↑NA, DA e glutammato (disinibizione via blocco 5HT3 sugli interneuroni GABA).",
    ind: "Depressione maggiore (in commercio in IT dal 2016).",
    pos: "10 mg/die (iniziale), fino a 20 (anche 5 mg efficace negli intolleranti).",
    emi: "~57 h. Sintomi da sospensione infrequenti.",
    met: "CYP2D6, CYP2C9, CYP3A4/5, CYP2A6, CYP2C19 (livelli poco condizionati da altri farmaci).",
    eff: "Nausea (10-20%), cefalea (15%), diarrea (7-11%), xerostomia/iperidrosi.",
    avv: "Vantaggi: scarsa sonnolenza, scarso ↑peso, minori effetti sulla sfera sessuale rispetto ai serotoninergici.",
    note: "Presunto beneficio sulla cognitività.",
  },
  {
    id: "imao", nome: "IMAO (fenelzina, tranilcipromina, moclobemide)", cls: "ad", sub: "Inibitori delle MAO — NON in commercio in IT",
    com: "MARGYL (fenelzina), PARMODALIN (tranilcipromina + perfenazina), AURORIX (moclobemide) — tutti NON più in commercio in IT.",
    mecc: "Inibizione delle MAO-A/MAO-B (↑monoamine); irreversibili (idrazinici/fenil-etilaminici) o reversibili (moclobemide, selettivo MAO-A).",
    ind: "Depressione atipica, DAP, fobia sociale, DPTS, bulimia; narcolessia-cataplessia, dolore cronico, m. di Parkinson (selegilina). Farmaci di seconda scelta.",
    pos: "Fenelzina 15-90 mg/die; moclobemide 300-600 mg/die.",
    emi: "Variabile (dati non ben studiati). Tranilcipromina ~2,5 h.",
    met: "Metabolismo epatico; acetilazione dei composti idrazinici («acetilatori lenti»).",
    eff: "Agitazione/insonnia; ipotensione ortostatica; effetti pseudo-anticolinergici; ↑/↓peso; carenza di piridossina; epatotossicità (idrazinici).",
    avv: "RESTRIZIONI ALIMENTARI (crisi ipertensiva da tiramina, «crisi del formaggio»). Controindicati con feocromocitoma, simpaticomimetici, meperidina (reazione fatale), altri serotoninergici (s. serotoninergica). Attendere 2 sett. per lo switch con TCA.",
    note: "Classe di fatto non disponibile in Italia.",
  },
];

// --- Campi comuni a tutte le benzodiazepine (dal testo) ---
const BDZ_COMMON = {
  cls: "anx",
  mecc: "Modulatore allosterico positivo del recettore GABA-A (sito BDZ, subunità α/γ): aumenta la frequenza di apertura dei canali del Cl⁻, solo in presenza di GABA. Effetti centrali: ansiolitico, sedativo-ipnotico, anticonvulsivante, miorilassante, amnesizzante (amnesia anterograda).",
  eff: "Sonnolenza diurna/hangover, ↑tempi di reazione, atassia, amnesia anterograda, disartria; effetti paradossi (disinibizione, irritabilità); dipendenza fisica e psichica nell’uso cronico; sindrome astinenziale alla brusca sospensione (ansia, insonnia, fino a delirium e convulsioni). Tolleranza rapida per l’effetto anticonvulsivante e miorilassante.",
  avv: "Uso raccomandato ≤4 settimane; evitare nelle personalità tossicofiliche. Controindicate in miastenia, glaucoma ad angolo chiuso, gravidanza (I trimestre teratogeno — palatoschisi; III trimestre floppy infant) e allattamento; cautela in apnea morfeica/BPCO (depressione respiratoria). Antagonista specifico: flumazenil (ANEXATE). Intossicazione raramente fatale se non associata ad alcool/altri depressori del SNC.",
};

const BDZ = [
  { id: "bromazepam", nome: "Bromazepam", sub: "BDZ — emivita medio-lunga (pronordiazepam)",
    com: "LEXOTAN cpr/cps 1,5-3-6 mg, gtt (10 gtt = 1 mg); COMPENDIUM, BRIXOPAN.",
    emi: "Medio-lunga (48-100 h, gruppo pronordiazepam-simile).", pos: "Ansiolitico.", note: "Ansiolitico." },
  { id: "clordiazepossido", nome: "Clordiazepossido", sub: "BDZ — emivita medio-lunga (pronordiazepam)",
    com: "LIBRIUM cps 10 mg; LIBRAX (+ clidinio).",
    emi: "Medio-lunga (48-100 h).", pos: "Ansiolitico.", note: "Capostipite delle BDZ (Sternbach, 1957)." },
  { id: "delorazepam", nome: "Clordemetildiazepam (delorazepam)", sub: "BDZ — emivita medio-lunga (pronordiazepam)",
    com: "EN cpr 0,5-1-2 mg, gtt (26 gtt = 1 mg), fl im/iv 0,5-2-5 mg.",
    emi: "Medio-lunga (48-100 h).", pos: "Ansiolitico.", note: "Assorbimento im regolare (a differenza di molte BDZ)." },
  { id: "diazepam", nome: "Diazepam", sub: "BDZ — emivita medio-lunga (pronordiazepam)",
    com: "VALIUM, ANSIOLIN, NOAN, TRANQUIRIT cpr/cps 2-5-10 mg, gtt, fl im/iv 10 mg; MICROPAM soluzione rettale.",
    emi: "Medio-lunga (48-100 h). Picco: 30-120 min (os), 10-30 min (rettale), 90 min (im). Legame proteico 99%.",
    pos: "Adulti 15-30 mg/die (25-50 gtt x3); bambini 4-14 anni 4-12 mg.",
    note: "Pre-anestesia; astinenza alcolica; eclampsia (III trimestre). Coronarodilatazione dopo ev." },
  { id: "flurazepam", nome: "Flurazepam", sub: "BDZ ipnotica — emivita medio-lunga (pronordiazepam)",
    com: "DALMADORM, FLUNOX, VALDORM cps 15-30 mg.",
    emi: "Medio-lunga (48-100 h).", pos: "Ipnotico.", note: "Ipnotico; emivita medio-lunga → possibile hangover." },
  { id: "clonazepam", nome: "Clonazepam", sub: "Nitro-BDZ — emivita medio-lunga",
    com: "RIVOTRIL cpr 0,5-2 mg, gtt (10 gtt = 1 mg).",
    emi: "Medio-lunga (24-48 h, gruppo nitro-BDZ).",
    pos: "Adulto 4-8 mg/die in 3-4 dosi; bambino in età scolare 3-6 mg.",
    note: "Tra le più selettive come anticonvulsivante; usato in epilessia." },
  { id: "flunitrazepam", nome: "Flunitrazepam", sub: "Nitro-BDZ — emivita medio-lunga",
    com: "ROIPNOL cpr 1 mg.",
    emi: "Medio-lunga (24-48 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "nitrazepam", nome: "Nitrazepam", sub: "Nitro-BDZ — emivita medio-lunga",
    com: "MOGADON cpr 5 mg.",
    emi: "Medio-lunga (24-48 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "lorazepam", nome: "Lorazepam", sub: "BDZ oxazepam-simile — emivita breve",
    com: "TAVOR, CONTROL, LORANS cpr 1-2,5 mg, gtt (10 gtt = 0,5 mg), fl im/iv 4 mg, tavolette orosolubili.",
    emi: "Breve (~24 h, effetto fino a 8 h; picco 2-3 h). Glicuronoconiugazione diretta (no accumulo).",
    pos: "Ansiolitico; pre-anestesia.",
    note: "Assorbimento im regolare; nessun metabolita attivo → utile in epatopatia e nell’anziano." },
  { id: "lormetazepam", nome: "Lormetazepam", sub: "BDZ oxazepam-simile — emivita breve",
    com: "MINIAS gtt 0,25% (10 gtt = 1 mg); LUZUL cpr 1-2 mg.",
    emi: "Breve (<24 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "oxazepam", nome: "Oxazepam", sub: "BDZ oxazepam-simile — emivita breve",
    com: "SERPAX cpr 15-30 mg.",
    emi: "Breve (~15 h; picco 2-3 h). Glicuronoconiugazione diretta (no accumulo).",
    pos: "Ansiolitico.", note: "Metabolita comune di molte BDZ; nessun metabolita attivo." },
  { id: "temazepam", nome: "Temazepam", sub: "BDZ oxazepam-simile — emivita breve",
    com: "NORMISON cps 20 mg.",
    emi: "Breve (<24 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "alprazolam", nome: "Alprazolam", sub: "Triazolo-BDZ — emivita breve",
    com: "XANAX, FRONTAL cpr 0,25-0,5-1 mg, gtt (10 gtt = 0,25 mg); ALPRAZIG, VALEANS.",
    emi: "Breve (~11 h; picco 1-2 h). Legame proteico ~70% (il più basso tra le BDZ).",
    pos: "Ansiolitico.", note: "Molto usato come ansiolitico; astinenza rapida (alta potenza, breve emivita)." },
  { id: "etizolam", nome: "Etizolam", sub: "Tieno-triazolo-BDZ — emivita breve",
    com: "DEPAS, PASADEN cpr 0,5-1 mg, gtt (10 gtt = 0,25 mg).",
    emi: "Breve (<6 h).", pos: "Ansiolitico.", note: "Ansiolitico." },
  { id: "estazolam", nome: "Estazolam", sub: "Triazolo-BDZ — emivita breve",
    com: "ESILGAN cpr 1-2 mg.",
    emi: "Breve (<24 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "triazolam", nome: "Triazolam", sub: "Triazolo-BDZ — emivita ultrabreve",
    com: "HALCION cpr 0,125-0,25 mg; SONGAR.",
    emi: "Ultrabreve (<6 h; max dopo 2 h).", pos: "Ipnotico.",
    note: "Ipnotico; emivita ultrabreve → rischio di rimbalzo/risvegli notturni." },
  { id: "brotizolam", nome: "Brotizolam", sub: "Tieno-BDZ — emivita ultrabreve",
    com: "LENDORMIN cpr 0,25 mg.",
    emi: "Ultrabreve (<6 h).", pos: "Ipnotico.", note: "Ipnotico." },
  { id: "clotiazepam", nome: "Clotiazepam", sub: "Tieno-BDZ — emivita breve",
    com: "RIZEN, TIENOR cpr 5-10 mg, gtt (10 gtt = 4 mg).",
    emi: "Breve-ultrabreve (<24 h).", pos: "Ansiolitico.", note: "Ansiolitico." },
  { id: "midazolam", nome: "Midazolam", sub: "Imidazo-BDZ — emivita ultrabreve",
    com: "IPNOVEL fl im/iv 5-15 mg.",
    emi: "Ultrabreve (1-2,5 h; azione entro ~2 min per via ev).",
    pos: "Pre-anestesia/sedazione procedurale.",
    note: "Assorbimento im regolare; sedazione procedurale." },
].map((d) => ({ ...BDZ_COMMON, met: "Metabolizzazione epatica (glicuronoconiugazione; nitro-riduzione per le nitro-BDZ). Le BDZ non autoinducono il proprio metabolismo. Inibiscono il metabolismo delle BDZ: cimetidina, SSRI, contraccettivi orali, disulfiram.", ...d }));

// ============ IPNOTICI NON-BDZ / ALTRI ANSIOLITICI ============
const IPNOTICI = [
  {
    id: "zolpidem", nome: "Zolpidem", cls: "anx", sub: "Z-drug (imidazopiridina)",
    com: "STILNOX, NOTTEM cpr 10 mg; SONIREM (10 mg = 25 gtt).",
    mecc: "Azione selettiva sulla subunità α1 del GABA-A: proprietà sedativo-ipnotiche selettive, a dosi inferiori a quelle necessarie per l’effetto ansiolitico/miorilassante/anticonvulsivante.",
    ind: "Insonnia.",
    pos: "10 mg (ridurre in anziani e insufficienza epatorenale).",
    emi: "1-4 h. Metabolismo epatico, eliminazione renale.",
    met: "Metabolizzazione epatica; eliminazione renale.",
    eff: "Nessun hangover; dati non univoci su dipendenza e fenomeni di rebound.",
    avv: "Non modifica l’architettura del sonno. Ridurre la dose negli anziani.",
    note: "",
  },
  {
    id: "zaleplon", nome: "Zaleplon", cls: "anx", sub: "Z-drug (pirazolopirimidina)",
    com: "SONATA cps 5-10 mg.",
    mecc: "Modulatore selettivo della subunità α1 del GABA-A.",
    ind: "Insonnia (in particolare difficoltà di addormentamento).",
    pos: "5-10 mg.",
    emi: "~1 h. Metaboliti inattivi (70% urine, 17% feci).",
    met: "Metaboliti inattivi; escrezione renale/fecale.",
    eff: "Nessun hangover; non modifica l’architettura del sonno.",
    avv: "Emivita molto breve: indicato per l’induzione del sonno.",
    note: "",
  },
  {
    id: "zopiclone", nome: "Zopiclone", cls: "anx", sub: "Z-drug (ciclopirrolone)",
    com: "IMOVANE cpr 7,5 mg.",
    mecc: "Modulatore del GABA-A (subunità α1).",
    ind: "Insonnia.",
    pos: "7,5 mg (ridurre in anziani e insufficienza epatorenale).",
    emi: "3,5-6 h. Assorbimento condizionato dal cibo; secreto nella saliva («sapore amaro»).",
    met: "Decarbossilazione, N-desmetilazione, N-ossidazione; 30% escreto nelle urine.",
    eff: "Non modifica il sonno REM ma ↑fasi 2-3-4; nessun hangover.",
    avv: "Tipico «sapore amaro» per secrezione salivare.",
    note: "",
  },
  {
    id: "daridorexant", nome: "Daridorexant", cls: "anx", sub: "Antagonista duale dell’orexina (DORA)",
    com: "QUVIVIQ cpr 25-50 mg (in commercio in IT da marzo 2023).",
    mecc: "Antagonista duale dei recettori dell’orexina 1 e 2 (equipotente): riduce il segnale di veglia e favorisce il sonno senza alterare la proporzione delle fasi.",
    ind: "Insonnia dell’adulto presente da almeno 3 mesi con disturbi funzionali diurni.",
    pos: "50 mg la sera, 30 min prima di coricarsi (iniziare da 25). Dimezzare (25 mg) con inibitori del CYP3A4 o succo di pompelmo.",
    emi: "8 h (ottimale per il sonno: nessuna sedazione al risveglio). Picco 1-2 h.",
    met: "CYP3A4; effetto induttore sul CYP2C9. Escrezione 57% feci, 28% urine.",
    eff: "Nessuna sedazione mattutina; non anoressizzante.",
    avv: "Ridurre con inibitori del CYP3A4/pompelmo. Cautela con l’alcool.",
    note: "Nuova classe (antagonisti dell’orexina); efficacia fino a 12 mesi.",
  },
  {
    id: "melatonina", nome: "Melatonina", cls: "anx", sub: "Neuro-ormone (agonista MT1/MT2)",
    com: "Preparati galenici 1-2-5 mg.",
    mecc: "Neuro-ormone pineale (sintetizzato dalla serotonina via N-acetiltransferasi), agonista MT1/MT2 sul nucleo soprachiasmatico; regola il ritmo circadiano. Soppressa dalla luce.",
    ind: "Disturbi del ritmo circadiano (jet-lag, lavoro a turni).",
    pos: "1-5 mg poco prima di coricarsi, in ambiente buio.",
    emi: "3,5-4 h. Biodisponibilità os ~15% (↓ con il cibo).",
    met: "Coniugazione con acido glucuronico (6-idrossimelatonina); eliminazione renale. Completa in ~12 h.",
    eff: "Ben tollerata.",
    avv: "Efficace se assunta poco prima di coricarsi al buio.",
    note: "La produzione endogena diminuisce con l’età.",
  },
  {
    id: "pregabalin", nome: "Pregabalin", cls: "anx", sub: "Gabapentinoide (ligando α2δ)",
    com: "LYRICA (e altri: ACLATON, GABEX, PRELYNCA) cps 25-300 mg, soluzione orale.",
    mecc: "Analogo strutturale del GABA; si lega alla subunità α2δ dei canali del Ca voltaggio-dipendenti → ↓influsso di Ca e rilascio di neurotrasmettitori eccitatori (glutammato, NA, sostanza P); ↑attività della GAD. Non agisce sul recettore GABA.",
    ind: "Dolore neuropatico dell’adulto; add-on nell’epilessia parziale; GAD dell’adulto; (USA) fibromialgia.",
    pos: "Titolazione lenta 150 → 600 mg/die in 2-3 dosi. Ridurre in insufficienza renale.",
    emi: "5-6,5 h. Non legame proteico, scarsa metabolizzazione epatica, escrezione renale.",
    met: "Scarsa metabolizzazione; escrezione prevalentemente renale. Nessuna interazione metabolica significativa.",
    eff: "Edemi, parestesie, dispnea, tachicardia, vomito, diplopia, insonnia, deficit di memoria; torpore, capogiri.",
    avv: "Potenzia barbiturici, BDZ e altri depressori centrali. Farmaco di seconda scelta. Effetto più rapido della venlafaxina nel GAD.",
    note: "Comparabile alle BDZ nel GAD, senza dipendenza da BDZ.",
  },
];

/* ---- Farmaci aggiuntivi (dal testo, dove presenti) ---- */
const AGGIUNTE = [
  // ===== ANTIPSICOTICI TIPICI =====
  { id:"flufenazina", nome:"Flufenazina", cls:"tip", sub:"Fenotiazina piperazinica · disponibile depot",
    com:"Anatensol, Moditen · cpr; flufenazina decanoato (Moditen Depot) fl im",
    mecc:"Antagonista D2 ad alta potenza; minore attività α1-adrenolitica, antistaminica e anticolinergica rispetto alle fenotiazine alifatiche.",
    ind:"Schizofrenia e altre psicosi; forma decanoato per il mantenimento a lungo termine (LAI).",
    pos:"Orale 2,5-10 mg/die (max 20). Decanoato 12,5-25 mg ogni 2-3 settimane im.",
    emi:"Orale ≈ 15 h; decanoato a rilascio prolungato (settimane).", met:"Epatico (CYP2D6).",
    eff:"EPS marcati (distonie, acatisia, parkinsonismo, discinesia tardiva), iperprolattinemia; sedazione e ipotensione modeste.",
    avv:"Elevato rischio di EPS: sorveglianza per distonia acuta (spec. giovani) e discinesia tardiva. Controindicata nel Parkinson.",
    note:"Equivalenza depot (da testo): flufenazina decanoato 25 mg/21 gg ≈ aloperidolo decanoato 100 mg/28 gg." },
  { id:"flupentixolo", nome:"Flupentixolo", cls:"tip", sub:"Tioxantene · disponibile depot",
    com:"Fluanxol · cpr 0,5-1-3 mg; flupentixolo decanoato (Fluanxol Depot) fl im",
    mecc:"Antagonista D1/D2 (tioxantene); a basse dosi effetto attivante/antidepressivo, a dosi piene antipsicotico.",
    ind:"Schizofrenia e psicosi croniche (anche depot); a basse dosi stati ansioso-depressivi.",
    pos:"Orale 3-18 mg/die (basse dosi 1-3 mg). Decanoato 20-40 mg ogni 2-4 settimane im.",
    emi:"Orale ≈ 35 h; decanoato a rilascio prolungato.", met:"Epatico (CYP2D6).",
    eff:"EPS, iperprolattinemia; sedazione modesta; possibile attivazione a basse dosi.",
    avv:"Rischio di EPS e discinesia tardiva; cautela negli stati eccitatori (a basse dosi può attivare).",
    note:"Isomero cis(Z). Formulazione depot molto usata nel mantenimento." },
  { id:"bromperidolo", nome:"Bromperidolo", cls:"tip", sub:"Butirrofenone (analogo dell'aloperidolo)",
    com:"Impromen · gtt 1% (10 mg/ml), cpr 5 mg",
    mecc:"Antagonista D2 ad alta potenza, analogo dell'aloperidolo.",
    ind:"Psicosi schizofreniche e altre manifestazioni psicotiche (deliri e allucinazioni).",
    pos:"1-15 mg/die.", emi:"≈ 20-35 h.", met:"Epatico.",
    eff:"EPS marcati, iperprolattinemia; sedazione modesta.",
    avv:"Come aloperidolo: rischio di EPS/discinesia tardiva e prolungamento del QT ad alte dosi.",
    note:"Butirrofenone a lunga durata, disponibile anche in gocce." },
  // ===== ANTIPSICOTICI ATIPICI =====
  { id:"sulpiride", nome:"Sulpiride", cls:"ati", sub:"Benzamide sostituita (D2/D3)",
    com:"Dobren, Championyl · cpr 50 mg e 200 mg, fl im",
    mecc:"Antagonista selettivo D2/D3; a basse dosi blocco preferenziale degli autorecettori presinaptici (effetto disinibente/attivante), a dosi elevate effetto antipsicotico.",
    ind:"Psicosi acute e croniche; a basse dosi stati depressivi con inibizione, somatizzazioni, vertigini.",
    pos:"Depressione/somatizzazioni 50-150 mg/die; psicosi 400-800 mg/die (max 1600).",
    emi:"≈ 6-8 h.", met:"Scarsa metabolizzazione epatica; escrezione prevalentemente renale.",
    eff:"Iperprolattinemia (galattorrea, amenorrea, disfunzioni sessuali), EPS a dosi elevate, attivazione/insonnia a basse dosi, ↑peso modesto.",
    avv:"Aggiustare la dose in insufficienza renale; cautela con iperprolattinemia, epilessia, feocromocitoma.",
    note:"Racemo di levosulpiride/amisulpride. Attraversa poco la barriera ematoencefalica: dosi elevate per l'effetto centrale." },
  { id:"sertindolo", nome:"Sertindolo", cls:"ati", sub:"Antipsicotico atipico (fenilindolo)",
    com:"Serdolect · cpr 4-12-16-20 mg",
    mecc:"Antagonista D2 e 5-HT2A con antagonismo α1; selettività limbica.",
    ind:"Schizofrenia, in pazienti intolleranti ad almeno un altro antipsicotico (uso ristretto per il rischio cardiaco).",
    pos:"Avvio 4 mg/die, titolazione a 12-20 mg/die (max 24).", emi:"≈ 3 giorni (72 h).",
    met:"Epatico (CYP2D6, CYP3A4).",
    eff:"Prolungamento del QT (dose-dipendente, marcato), rinite, ipotensione, ↓eiaculazione; basso rischio di EPS e di aumento ponderale.",
    avv:"Marcato allungamento del QTc: ECG basale e in titolazione; controindicato con QT lungo, squilibri elettrolitici o farmaci QT-prolunganti. Impiego di seconda linea.",
    note:"Basso profilo EPS e metabolico, ma il rischio cardiaco ne limita fortemente l'uso." },
  // ===== ANTIDEPRESSIVI =====
  { id:"desvenlafaxina", nome:"Desvenlafaxina", cls:"ad", sub:"SNRI (metabolita attivo della venlafaxina, ODV)",
    com:"Faxilex · cpr a rilascio prolungato 50-100 mg",
    mecc:"Inibitore del reuptake di serotonina e noradrenalina (metabolita O-demetilato della venlafaxina).",
    ind:"Disturbo depressivo maggiore.",
    pos:"50 mg/die (dose efficace; incrementi oltre non aumentano costantemente l'efficacia).",
    emi:"≈ 11 h.", met:"Coniugazione (glicuronazione) e minima via CYP3A4; scarsa dipendenza dal CYP2D6 (vantaggio rispetto alla venlafaxina).",
    eff:"Nausea, sudorazione, insonnia, ↑pressione arteriosa dose-dipendente, disfunzioni sessuali; sindrome da sospensione.",
    avv:"Monitorare la pressione arteriosa; sospensione graduale (rischio di sintomi da discontinuazione come la venlafaxina).",
    note:"In Italia commercializzata come Faxilex. Metabolismo più lineare della venlafaxina." },
  { id:"tianeptina", nome:"Tianeptina", cls:"ad", sub:"Antidepressivo atipico (modulatore glutamatergico)",
    com:"Coaxil, Tatinol · cpr 12,5 mg (stato regolatorio da verificare)",
    mecc:"Modulazione della plasticità sinaptica e della trasmissione glutamatergica; agonismo μ-oppioide a dosi elevate.",
    ind:"Episodi depressivi maggiori (uso e disponibilità variabili).",
    pos:"12,5 mg tre volte al dì (37,5 mg/die).", emi:"≈ 2,5 h.", met:"β-ossidazione (non CYP-dipendente).",
    eff:"Generalmente ben tollerata; a dosi sovraterapeutiche potenziale d'abuso (attività oppioide).",
    avv:"Segnalato potenziale d'abuso ad alte dosi (agonismo μ-oppioide): attenzione all'uso improprio. Verificare lo stato regolatorio locale.",
    note:"In Italia impiego/disponibilità limitati e soggetti a particolare attenzione per il potenziale d'abuso." },
  { id:"esketamina", nome:"Esketamina (intranasale)", cls:"ad", sub:"Antagonista NMDA (enantiomero S della ketamina)",
    com:"Spravato · spray nasale 28 mg; somministrazione in ambiente sanitario controllato",
    mecc:"Antagonista non competitivo del recettore NMDA del glutammato (con inibizione del reuptake della dopamina); azione antidepressiva rapida.",
    ind:"Depressione resistente al trattamento (in associazione a SSRI/SNRI); episodi depressivi maggiori con emergenza psichiatrica acuta (uso ospedaliero).",
    pos:"56-84 mg per somministrazione (2 volte/settimana in induzione, poi diradamento). Solo in setting controllato con osservazione.",
    emi:"≈ 7-12 h.", met:"Epatico (CYP2B6, CYP3A4) a noresketamina.",
    eff:"Dissociazione, sedazione, aumento transitorio di pressione e frequenza, vertigini, nausea; potenziale d'abuso.",
    avv:"Somministrazione solo sotto osservazione medica (sedazione/dissociazione, rialzo pressorio); monitoraggio ≥2 h; non guidare nel giorno della somministrazione.",
    note:"La ketamina racemica (ev, off-label) ha effetto antidepressivo rapido analogo. Gestione ospedaliera/specialistica." },
  { id:"fenelzina", nome:"Fenelzina", cls:"ad", sub:"IMAO non selettivo irreversibile (idrazina)",
    com:"Margyl cpr 15 mg — NON PIÙ IN COMMERCIO IN ITALIA",
    mecc:"Inibizione irreversibile e non selettiva delle MAO (A e B) → ↑ serotonina, noradrenalina, dopamina.",
    ind:"Depressione (spec. atipica/resistente), fobia sociale (storicamente).",
    pos:"15-90 mg/die (inizio 15 mg x3; mantenimento anche 15 mg a giorni alterni).",
    emi:"Breve, ma effetto prolungato (inibizione irreversibile: recupero in 1-2 settimane).", met:"Acetilazione epatica.",
    eff:"Ipotensione ortostatica, insonnia, aumento ponderale, disfunzioni sessuali; rischio di crisi ipertensiva da tiramina.",
    avv:"Dieta priva di tiramina (formaggi stagionati, insaccati, vino) per evitare la crisi ipertensiva; wash-out ≥2 settimane verso/da serotoninergici (sindrome serotoninergica).",
    note:"Non più in commercio in Italia (valore storico/didattico)." },
  { id:"tranilcipromina", nome:"Tranilcipromina", cls:"ad", sub:"IMAO non selettivo irreversibile (fenil-etilamina)",
    com:"Parmodalin (associata a trifluoperazina) — NON PIÙ IN COMMERCIO IN ITALIA",
    mecc:"Inibizione irreversibile non selettiva delle MAO; struttura anfetamino-simile con componente attivante.",
    ind:"Depressione resistente/atipica (storicamente).",
    pos:"10-30 mg/die.", emi:"Breve; effetto prolungato per inibizione irreversibile.", met:"Epatico.",
    eff:"Attivazione/insonnia, ipotensione ortostatica; rischio di crisi ipertensiva da tiramina.",
    avv:"Dieta priva di tiramina; wash-out ≥2 settimane con serotoninergici. Potenziale attivante/abuso per la struttura anfetamino-simile.",
    note:"Non più in commercio in Italia (valore storico/didattico)." },
  { id:"moclobemide", nome:"Moclobemide", cls:"ad", sub:"RIMA — IMAO-A reversibile (morfolina)",
    com:"Aurorix — NON PIÙ IN COMMERCIO IN ITALIA",
    mecc:"Inibizione reversibile e selettiva della MAO-A → ↑ serotonina e noradrenalina; la reversibilità riduce il rischio di crisi da tiramina.",
    ind:"Depressione, fobia sociale (storicamente).",
    pos:"300-600 mg/die.", emi:"≈ 1-3 h (breve, reversibile).", met:"Epatico (CYP2C19).",
    eff:"Insonnia, nausea, cefalea; tollerabilità migliore degli IMAO irreversibili.",
    avv:"Minor rischio di crisi da tiramina rispetto agli irreversibili, ma cautela con serotoninergici (sindrome serotoninergica) e simpaticomimetici.",
    note:"Non più in commercio in Italia. Prototipo dei RIMA." },
  // ===== ANSIOLITICI / IPNOTICI =====
  { id:"buspirone", nome:"Buspirone", cls:"anx", sub:"Ansiolitico non benzodiazepinico (agonista parziale 5-HT1A)",
    com:"Buspar e generici · cpr 5-10 mg",
    mecc:"Agonista parziale dei recettori 5-HT1A (e debole antagonismo D2 presinaptico); nessuna azione sul recettore GABA-A.",
    ind:"Disturbo d'ansia generalizzato (GAD); augmentation degli SSRI.",
    pos:"5 mg x2-3, titolare a 20-30 mg/die (max 60), in 2-3 somministrazioni.",
    emi:"≈ 2-3 h.", met:"Epatico (CYP3A4): livelli aumentati da inibitori (pompelmo, azoli).",
    eff:"Vertigini, cefalea, nausea; non sedativo, non miorilassante.",
    avv:"Effetto ansiolitico graduale (1-2 settimane): non adatto all'ansia acuta 'al bisogno'. Nessuna dipendenza né tolleranza. Non associare a IMAO.",
    note:"Alternativa alle benzodiazepine senza dipendenza né sedazione; studiato anche nella discinesia tardiva." },
  { id:"idrossizina", nome:"Idrossizina", cls:"anx", sub:"Antistaminico ad azione ansiolitica (antagonista H1)",
    com:"Atarax · cpr 25 mg, sciroppo, fl 100 mg im-iv",
    mecc:"Antagonista dei recettori H1 con effetto sedativo e ansiolitico; lieve azione anticolinergica.",
    ind:"Ansia e tensione emotiva; prurito/orticaria; premedicazione.",
    pos:"Ansia 25-100 mg/die in dosi refratte (max 100).", emi:"≈ 14-20 h (metabolita cetirizina).", met:"Epatico.",
    eff:"Sedazione, secchezza delle fauci, capogiro; possibile prolungamento del QT ad alte dosi.",
    avv:"Cautela per il QTc (evitare con altri farmaci QT-prolunganti, squilibri elettrolitici); effetti anticolinergici nell'anziano.",
    note:"Ansiolitico senza rischio di dipendenza; utile quando le benzodiazepine sono controindicate." },
  { id:"prazepam", nome:"Prazepam", cls:"anx", sub:"Benzodiazepina a lunga durata (profarmaco)",
    com:"Prazene · cpr 10-20 mg, gtt",
    mecc:"Agonista del recettore GABA-A (attivo tramite il metabolita nordazepam).",
    ind:"Ansia e tensione emotiva.", pos:"20-60 mg/die.", emi:"Lunga (via nordazepam, 30-100 h).",
    met:"Epatico → nordazepam (desmetildiazepam).",
    eff:"Sedazione, sonnolenza, riduzione della vigilanza.",
    avv:"Come le altre BDZ: dipendenza, tolleranza, sospensione graduale; accumulo nell'anziano (emivita lunga).",
    note:"Benzodiazepina a lunga durata d'azione." },
  { id:"pinazepam", nome:"Pinazepam", cls:"anx", sub:"Benzodiazepina a lunga durata",
    com:"Domar · cps 5 mg, gtt",
    mecc:"Agonista del recettore GABA-A.", ind:"Ansia, insonnia.", pos:"5-20 mg/die.",
    emi:"Lunga (via nordazepam).", met:"Epatico → nordazepam.",
    eff:"Sedazione, sonnolenza.",
    avv:"Dipendenza/tolleranza; sospensione graduale; cautela nell'anziano.",
    note:"Benzodiazepina a lunga durata d'azione." },
  { id:"nordazepam", nome:"Nordazepam (desmetildiazepam)", cls:"anx", sub:"Benzodiazepina a lunga durata (metabolita comune)",
    com:"Madar, Stilny · cpr, gtt",
    mecc:"Agonista del recettore GABA-A; metabolita attivo di diazepam, clordiazepossido, prazepam, pinazepam, clorazepato.",
    ind:"Ansia e tensione emotiva.", pos:"5-15 mg/die.", emi:"Molto lunga (30-100 h).",
    met:"Epatico (idrossilazione → oxazepam, glicuronazione).",
    eff:"Sedazione, sonnolenza, riduzione della vigilanza.",
    avv:"Accumulo nell'anziano (emivita lunga); dipendenza/tolleranza; sospensione graduale.",
    note:"Metabolita attivo su cui converge il metabolismo di molte BDZ a lunga durata." },
  { id:"ketazolam", nome:"Ketazolam", cls:"anx", sub:"Benzodiazepina a lunga durata (profarmaco)",
    com:"Anseren · cps 15-30-45 mg",
    mecc:"Agonista del recettore GABA-A (attivo via metaboliti, incl. diazepam/nordazepam).",
    ind:"Ansia.", pos:"15-45 mg/die (spesso in unica dose serale).", emi:"Lunga (via metaboliti).",
    met:"Epatico → diazepam, nordazepam.",
    eff:"Sedazione, sonnolenza.",
    avv:"Dipendenza/tolleranza; sospensione graduale; cautela nell'anziano.",
    note:"Benzodiazepina a lunga durata; profarmaco." },
  { id:"gabapentin", nome:"Gabapentin", cls:"anx", sub:"Gabapentinoide (ligando α2δ)",
    com:"Neurontin e generici · cps 100-300-400 mg, cpr 600-800 mg",
    mecc:"Analogo strutturale del GABA che si lega alla subunità α2δ dei canali del calcio voltaggio-dipendenti (non agisce sul recettore GABA); attività anticonvulsivante, ansiolitica e analgesica.",
    ind:"Epilessia (add-on), dolore neuropatico. Off-label: ansia, astinenza, disturbi del sonno.",
    pos:"900-3600 mg/die in 3 somministrazioni (titolazione progressiva).",
    emi:"≈ 5-7 h.", met:"Non metabolizzato; escrezione renale (aggiustare in insufficienza renale).",
    eff:"Sonnolenza, vertigini, atassia, edema; ↑peso.",
    avv:"Aggiustare la dose nell'insufficienza renale. Potenziale d'abuso/uso improprio; cautela con oppioidi (depressione respiratoria).",
    note:"Analogo del pregabalin ma con assorbimento saturabile (biodisponibilità dose-dipendente)." },
  // ===== ADHD / STIMOLANTI =====
  { id:"metilfenidato", nome:"Metilfenidato", cls:"stim", sub:"Stimolante (inibitore reuptake DA/NA)",
    com:"Ritalin, Medikinet, Concerta (RP), Equasym · rilascio immediato e prolungato",
    mecc:"Inibizione del reuptake di dopamina e noradrenalina (blocco DAT/NET) → ↑ catecolamine nella corteccia prefrontale e nello striato.",
    ind:"ADHD (≥6 anni) nell'ambito di un programma multimodale; narcolessia.",
    pos:"RI 5-20 mg x2-3; formulazioni RP in unica dose mattutina (dose individualizzata).",
    emi:"RI ≈ 2-3 h; formulazioni RP a copertura prolungata.", met:"Idrolisi (esterasi) ad acido ritalinico; scarso impegno dei CYP.",
    eff:"Riduzione dell'appetito, insonnia, cefalea, ↑frequenza e pressione, irritabilità; possibile rallentamento della crescita nel bambino.",
    avv:"Stupefacente (tab. controllata): rischio di abuso/diversione. Screening cardiovascolare basale; cautela in ipertensione, aritmie, storia psicotica. Sindrome serotoninergica con IMAO.",
    note:"Prescrizione soggetta a piano terapeutico presso centri autorizzati; impiego regolamentato in Italia." },
  { id:"lisdexamfetamina", nome:"Lisdexamfetamina", cls:"stim", sub:"Profarmaco stimolante (destroanfetamina)",
    com:"Elvanse (Vyvanse) · cps 20-30-40-50-60-70 mg",
    mecc:"Profarmaco: dopo idrolisi rilascia destroanfetamina, che aumenta il rilascio e blocca il reuptake di dopamina e noradrenalina.",
    ind:"ADHD (≥6 anni) quando la risposta al metilfenidato è inadeguata; disturbo da alimentazione incontrollata (in alcuni Paesi).",
    pos:"30 mg/die al mattino, titolare 30-70 mg/die.",
    emi:"Destroanfetamina ≈ 10-12 h (copertura prolungata).", met:"Idrolisi ematica (globuli rossi) a destroanfetamina; conversione ≈ 29,5%.",
    eff:"Riduzione dell'appetito, insonnia, secchezza delle fauci, ↑frequenza/pressione, irritabilità.",
    avv:"Stupefacente: potenziale d'abuso (ridotto dalla natura di profarmaco). Screening cardiovascolare; cautela con IMAO e simpaticomimetici.",
    note:"La struttura di profarmaco riduce il picco plasmatico e il potenziale d'abuso rispetto all'anfetamina." },
  { id:"atomoxetina", nome:"Atomoxetina", cls:"stim", sub:"Non stimolante (inibitore selettivo reuptake NA)",
    com:"Strattera · cps 10-18-25-40-60-80 mg",
    mecc:"Inibizione selettiva del reuptake della noradrenalina (NRI); non stupefacente.",
    ind:"ADHD (bambini ≥6 anni, adolescenti e adulti).",
    pos:"Avvio ≈ 0,5 mg/kg, target ≈ 1,2 mg/kg/die (adulti 40→80 mg, max 100).",
    emi:"≈ 5 h (metabolizzatori CYP2D6 rapidi) fino a ≈ 21 h (metabolizzatori lenti).",
    met:"Epatico via CYP2D6: i metabolizzatori lenti hanno esposizione più elevata; cautela con inibitori del 2D6.",
    eff:"Riduzione dell'appetito, nausea, sonnolenza o insonnia, ↑pressione/frequenza, disfunzioni sessuali (adulti); rara epatotossicità.",
    avv:"Sorveglianza dell'umore (raro rischio suicidario nei giovani), funzione epatica se sintomi. Effetto pieno in 4-6 settimane.",
    note:"Non stupefacente. Nota AIFA 2023: cessata commercializzazione con importazione dall'estero avviata dalla RER (Emilia-Romagna) — verificare la disponibilità locale." },
  { id:"guanfacina", nome:"Guanfacina", cls:"stim", sub:"Non stimolante (agonista α2A-adrenergico)",
    com:"Intuniv · cpr a rilascio prolungato 1-2-3-4 mg",
    mecc:"Agonista selettivo dei recettori α2A post-sinaptici della corteccia prefrontale → potenziamento della trasmissione noradrenergica e delle funzioni esecutive.",
    ind:"ADHD (6-17 anni) quando gli stimolanti non sono adeguati/tollerati, in programma multimodale.",
    pos:"Avvio 1 mg/die, titolazione ≈ 0,05-0,12 mg/kg/die (1-7 mg secondo peso).",
    emi:"≈ 17 h.", met:"Epatico (CYP3A4): cautela con inibitori/induttori del 3A4.",
    eff:"Sonnolenza, ipotensione, bradicardia, cefalea, ↑peso; sedazione soprattutto in avvio.",
    avv:"Monitorare pressione e frequenza; non sospendere bruscamente (ipertensione da rimbalzo); cautela con altri ipotensivi.",
    note:"Non stupefacente. Utile quando è presente componente di iperattività/impulsività o tic." },
  { id:"modafinil", nome:"Modafinil", cls:"stim", sub:"Promotore della veglia",
    com:"Provigil · cpr 100 mg",
    mecc:"Promotore della veglia; debole inibizione del reuptake della dopamina e modulazione di più sistemi (istamina, orexine).",
    ind:"Narcolessia con eccessiva sonnolenza diurna. Off-label/augmentation: fatica e ipersonnia negli stati depressivi resistenti.",
    pos:"200-400 mg/die (mattino/mezzogiorno); prescrivibile con ricetta RRL.",
    emi:"≈ 12-15 h.", met:"Epatico (CYP3A4; induttore moderato — riduce l'efficacia dei contraccettivi orali).",
    eff:"Cefalea, nausea, insonnia, nervosismo, ↑pressione modesto; rara reazione cutanea grave.",
    avv:"Riduce l'efficacia dei contraccettivi ormonali (induzione). Potenziale d'abuso (minore degli stimolanti classici). Uso ristretto alla narcolessia.",
    note:"Impiegato in augmentation antidepressiva per la componente di fatica/ipersonnia (off-label)." },
  // ===== DIPENDENZE / CRAVING =====
  { id:"naltrexone", nome:"Naltrexone", cls:"dip", sub:"Antagonista dei recettori oppioidi (μ)",
    com:"Nalorex, Antaxone, Narcoral · cpr 50 mg; formulazione LAI im (in alcuni Paesi)",
    mecc:"Antagonista competitivo dei recettori oppioidi μ → blocca gli effetti gratificanti di oppioidi e alcol (riduzione del rilascio di endorfine).",
    ind:"Mantenimento dell'astinenza da alcol (riduce craving e bere pesante); dipendenza da oppioidi (dopo disintossicazione).",
    pos:"50 mg/die.", emi:"≈ 4 h (metabolita 6-β-naltrexolo più lungo).", met:"Epatico.",
    eff:"Nausea, cefalea, astenia, ansia; epatotossicità dose-dipendente ad alte dosi.",
    avv:"Controindicato con uso di oppioidi in atto (precipita l'astinenza) e in epatite acuta/insufficienza epatica. Verificare l'astinenza da oppioidi prima di iniziare.",
    note:"Riduce il rinforzo positivo dell'alcol. La combinazione buprenorfina + naltrexone è studiata nelle addizioni." },
  { id:"acamprosato", nome:"Acamprosato", cls:"dip", sub:"Anti-craving (modulatore glutammato/GABA)",
    com:"Campral · cpr gastroresistenti 333 mg",
    mecc:"Derivato della taurina, analogo del GABA; antagonismo sui recettori glutamatergici NMDA e ripristino dell'equilibrio eccitazione/inibizione → riduzione del craving.",
    ind:"Mantenimento dell'astinenza da alcol (con supporto psicosociale).",
    pos:"6 cpr/die (≈ 2 g) se peso ≥60 kg; 4 cpr/die se <60 kg, in 3 somministrazioni.",
    emi:"≈ 20-33 h.", met:"Non metabolizzato; escrezione renale.",
    eff:"Diarrea e disturbi gastrointestinali; buona tollerabilità sistemica.",
    avv:"Controindicato/da aggiustare nell'insufficienza renale grave. Iniziare dopo la disintossicazione, appena raggiunta l'astinenza.",
    note:"Non agisce sull'intossicazione acuta; agisce sul mantenimento dell'astinenza." },
  { id:"disulfiram", nome:"Disulfiram", cls:"dip", sub:"Terapia avversiva (inibitore ALDH)",
    com:"Antabuse, Etiltox · cpr 400 mg",
    mecc:"Inibizione irreversibile dell'aldeide deidrogenasi → accumulo di acetaldeide dopo assunzione di alcol, con reazione avversiva (flushing, nausea, tachicardia, ipotensione).",
    ind:"Mantenimento dell'astinenza da alcol tramite deterrenza (pazienti motivati e supervisionati).",
    pos:"400 mg/die (o a giorni alterni); dose individualizzata.",
    emi:"Lunga; effetto persistente per giorni (inibizione irreversibile).",
    met:"Epatico; inibisce diversi CYP (spec. CYP2E1) → prolunga l'emivita di caffeina e altri substrati.",
    eff:"Sonnolenza, sapore metallico, epatotossicità (rara ma grave), neuropatia; la reazione disulfiram-alcol può essere severa.",
    avv:"Assoluta astensione dall'alcol (anche in farmaci, colluttori, salse): la reazione può essere pericolosa. Controindicato in cardiopatia grave; attenzione all'alcol 'nascosto'.",
    note:"Efficacia legata alla supervisione (somministrazione controllata). Gli SSRI ne inibiscono il metabolismo." },
  { id:"nalmefene", nome:"Nalmefene", cls:"dip", sub:"Modulatore oppioide (antagonista μ/δ, agonista parziale κ)",
    com:"Selincro · cpr 18 mg",
    mecc:"Antagonista dei recettori μ e δ e agonista parziale dei κ → riduzione del rinforzo e del craving dell'alcol.",
    ind:"Riduzione del consumo di alcol in adulti con dipendenza ad alto rischio, senza astinenza e senza necessità di disintossicazione immediata.",
    pos:"18 mg 'al bisogno' nei giorni in cui si prevede il rischio di bere (1-2 h prima).",
    emi:"≈ 12 h (più lunga del naltrexone).", met:"Glicuronazione (minor impegno epatico); minore epatotossicità del naltrexone.",
    eff:"Nausea, vertigini, insonnia, cefalea (transitori).",
    avv:"Controindicato con oppioidi in atto. Approccio della 'riduzione del consumo' (non necessariamente astinenza) con supporto psicosociale.",
    note:"Migliore biodisponibilità ed emivita del naltrexone, con minor rischio epatico." },
  { id:"vareniclina", nome:"Vareniclina", cls:"dip", sub:"Agonista parziale nicotinico (α4β2)",
    com:"Champix · cpr 0,5-1 mg",
    mecc:"Agonista parziale dei recettori nicotinici α4β2 (e agonista pieno degli α7): riduce craving e sintomi d'astinenza e attenua la gratificazione da nicotina.",
    ind:"Cessazione del fumo di tabacco nell'adulto.",
    pos:"1 mg due volte/die, con titolazione in 8 giorni partendo da 0,5 mg/die.",
    emi:"≈ 24 h.", met:"Scarsamente metabolizzata; escrezione renale prevalente.",
    eff:"Nausea (frequente), insonnia, sogni vividi, cefalea; segnalazioni di alterazioni dell'umore/comportamento.",
    avv:"Sorvegliare umore e comportamento; aggiustare nell'insufficienza renale; iniziare 1-2 settimane prima della data di cessazione.",
    note:"Alternativa al bupropione per la cessazione del fumo; efficacia superiore al placebo e ai sostituti nicotinici." },
  // ===== COGNITIVI / ANTIDEMENZA =====
  { id:"donepezil", nome:"Donepezil", cls:"cog", sub:"Inibitore dell'acetilcolinesterasi (AChE)",
    com:"Aricept e generici · cpr 5-10 mg, cpr orodispersibili",
    mecc:"Inibizione reversibile e selettiva dell'acetilcolinesterasi → ↑ acetilcolina sinaptica (compenso del deficit colinergico nell'Alzheimer).",
    ind:"Malattia di Alzheimer di grado lieve-moderato (e severo).",
    pos:"5 mg/die per 4-6 settimane, poi 10 mg/die (unica dose serale).",
    emi:"≈ 70 h (lunga: unica somministrazione).", met:"Epatico (CYP2D6, CYP3A4).",
    eff:"Nausea, diarrea, crampi, insonnia/sogni vividi, bradicardia; effetti colinergici.",
    avv:"Cautela in bradiaritmie/blocchi (sincope), ulcera/sanguinamenti GI, asma/BPCO, epilessia. Piano Terapeutico AIFA.",
    note:"Trattamento sintomatico (non modifica il decorso di malattia)." },
  { id:"rivastigmina", nome:"Rivastigmina", cls:"cog", sub:"Inibitore AChE e butirrilcolinesterasi (BuChE)",
    com:"Exelon e generici · cps 1,5-3-4,5-6 mg; cerotto transdermico 4,6-9,5-13,3 mg/24 h",
    mecc:"Inibizione pseudo-irreversibile di acetilcolinesterasi e butirrilcolinesterasi → ↑ acetilcolina.",
    ind:"Alzheimer lieve-moderato; demenza associata alla malattia di Parkinson.",
    pos:"Orale 1,5 mg x2, titolare fino a 6 mg x2. Cerotto 4,6 → 9,5 mg/24 h (miglior tollerabilità GI).",
    emi:"≈ 1-2 h (inibizione enzimatica prolungata).", met:"Idrolisi da colinesterasi (non CYP-dipendente): poche interazioni metaboliche.",
    eff:"Nausea, vomito, calo ponderale, diarrea (spec. via orale e in titolazione); reazioni cutanee col cerotto.",
    avv:"Titolazione lenta per la tollerabilità GI; cautela in bradiaritmie, ulcera, asma/BPCO. Piano Terapeutico AIFA.",
    note:"La via transdermica riduce gli effetti gastrointestinali. Non impegna i CYP (utile in politerapia)." },
  { id:"galantamina", nome:"Galantamina", cls:"cog", sub:"Inibitore AChE + modulatore nicotinico",
    com:"Reminyl e generici · cps a rilascio prolungato 8-16-24 mg",
    mecc:"Inibizione dell'acetilcolinesterasi e modulazione allosterica dei recettori nicotinici (potenziamento della trasmissione colinergica).",
    ind:"Malattia di Alzheimer di grado lieve-moderato.",
    pos:"8 mg/die (RP), titolare a 16-24 mg/die.", emi:"≈ 7-8 h.", met:"Epatico (CYP2D6, CYP3A4).",
    eff:"Nausea, vomito, calo ponderale, vertigini; effetti colinergici.",
    avv:"Cautela in bradiaritmie, ulcera/sanguinamenti GI, asma/BPCO, insufficienza epatica/renale. Piano Terapeutico AIFA.",
    note:"Doppio meccanismo (inibizione AChE + modulazione nicotinica)." },
  { id:"memantina", nome:"Memantina", cls:"cog", sub:"Antagonista non competitivo del recettore NMDA",
    com:"Ebixa e generici · cpr 10-20 mg, gtt/soluzione",
    mecc:"Antagonista non competitivo, voltaggio-dipendente e a moderata affinità del recettore NMDA → riduzione dell'eccitotossicità glutamatergica preservando la trasmissione fisiologica.",
    ind:"Malattia di Alzheimer di grado moderato-severo (anche in associazione a un inibitore AChE).",
    pos:"Avvio 5 mg/die, incrementi settimanali di 5 mg fino a 20 mg/die.",
    emi:"≈ 60-100 h (lunga).", met:"Scarsamente metabolizzata; escrezione renale (aggiustare in insufficienza renale).",
    eff:"Capogiro, cefalea, stipsi, sonnolenza, ipertensione; generalmente ben tollerata.",
    avv:"Aggiustare la dose nell'insufficienza renale; cautela con altri antagonisti NMDA (amantadina, ketamina) e in epilessia. Piano Terapeutico AIFA.",
    note:"Agisce sul sistema glutamatergico (diverso dagli inibitori AChE): utile nelle fasi moderato-severe e in associazione." },
  { id:"prometazina", nome:"Prometazina", cls:"anx", sub:"Antistaminico fenotiazinico ad azione sedativa (antagonista H1)",
    com:"Farganesse, Fargan · fl 50 mg im, sciroppo, cpr",
    mecc:"Antagonista dei recettori H1 dell'istamina di derivazione fenotiazinica; marcata azione sedativa e anticolinergica, con blando effetto antidopaminergico.",
    ind:"Sedazione, insonnia occasionale, reazioni allergiche, nausea/vomito, premedicazione; in psichiatria spesso associata all'aloperidolo im nella tranquillizzazione rapida dell'agitazione.",
    pos:"25–50 mg (im o os); nel bambino dosi ridotte per età.",
    emi:"≈ 10–14 h.", met:"Epatico.",
    eff:"Sedazione marcata, secchezza delle fauci, capogiro, ipotensione; possibile prolungamento del QT ad alte dosi.",
    avv:"Effetti anticolinergici (cautela nell'anziano, glaucoma, ipertrofia prostatica); potenziamento della depressione del SNC con altri sedativi/oppioidi. Controindicata sotto i 2 anni (depressione respiratoria).",
    note:"Primo antistaminico sintetizzato (Bovet, 1937): capostipite da cui derivò la clorpromazina. L'associazione con aloperidolo im è uno schema classico per l'agitazione." },
  { id:"metadone", nome:"Metadone", cls:"dip", sub:"Agonista oppioide μ (dipendenza da oppioidi)",
    com:"Eptadone, Metadone cloridrato · sciroppo/soluzione orale a varie concentrazioni, fl",
    mecc:"Agonista completo dei recettori oppioidi μ a lunga durata d'azione (con debole antagonismo NMDA): satura i recettori riducendo craving e astinenza ed eliminando il picco euforizzante.",
    ind:"Terapia sostitutiva di mantenimento nella dipendenza da oppioidi; dolore cronico severo.",
    pos:"Induzione individualizzata (tipicamente 20–40 mg/die), mantenimento titolato (spesso 60–120 mg/die) in dose unica giornaliera.",
    emi:"≈ 15–60 h (lunga e variabile): accumulo nei primi giorni.", met:"Epatico (CYP3A4, CYP2B6, CYP2D6).",
    eff:"Sedazione, stipsi, sudorazione, disfunzioni sessuali, ↑peso; depressione respiratoria (soprattutto in induzione/associazioni); prolungamento del QT dose-dipendente.",
    avv:"Rischio di overdose in induzione (emivita lunga, accumulo): titolare con cautela. Monitorare il QTc (specie > 100 mg/die o con altri farmaci QT-prolunganti). Depressione respiratoria potenziata da BDZ, alcol, altri sedativi. Gestione nei servizi per le dipendenze (SerD).",
    note:"Composto racemico; l'enantiomero levogiro è la forma attiva sui recettori oppioidi. Erogazione controllata." },
  { id:"buprenorfina", nome:"Buprenorfina", cls:"dip", sub:"Agonista parziale oppioide μ (dipendenza da oppioidi)",
    com:"Subutex, Suboxone (con naloxone) · cpr/film sublinguali; formulazioni depot (LAI) in alcuni Paesi",
    mecc:"Agonista parziale dei recettori oppioidi μ (con antagonismo κ) ad alta affinità e lenta dissociazione: riduce craving e astinenza con un 'effetto tetto' che limita depressione respiratoria ed euforia.",
    ind:"Terapia sostitutiva della dipendenza da oppioidi; dolore cronico (formulazioni dedicate).",
    pos:"Induzione 2–8 mg sublinguale (ad astinenza iniziata), mantenimento titolato 8–24 mg/die in dose unica.",
    emi:"≈ 24–42 h (dissociazione lenta dal recettore): possibile somministrazione a giorni alterni.", met:"Epatico (CYP3A4) a norbuprenorfina; coniugazione.",
    eff:"Cefalea, stipsi, sudorazione, nausea; minore depressione respiratoria del metadone (effetto tetto).",
    avv:"Iniziare solo a astinenza iniziata: per l'alta affinità μ può spiazzare gli agonisti pieni e precipitare l'astinenza. L'associazione con naloxone (Suboxone) scoraggia l'uso iniettivo improprio. Cautela con BDZ/sedativi (depressione respiratoria).",
    note:"Migliore profilo di sicurezza in overdose rispetto al metadone grazie all'agonismo parziale (effetto tetto). Erogazione controllata." },
  // ===== ANTIPSICOTICI TIPICI (completamento) =====
  { id:"penfluridolo", nome:"Penfluridolo", cls:"tip", sub:"Difenilbutilpiperidina orale a lunghissima durata",
    com:"Semap · cpr 20 mg (somministrazione settimanale)",
    mecc:"Antagonista D2 ad alta potenza con emivita estremamente lunga: una singola dose orale copre l'intera settimana.",
    ind:"Schizofrenia e psicosi croniche in mantenimento, quando si desidera un'alternativa orale al depot.",
    pos:"20–60 mg una volta a settimana (dose settimanale unica).",
    emi:"Molto lunga (giorni): effetto per ≈ 7 giorni.", met:"Epatico.",
    eff:"EPS marcati, iperprolattinemia; sedazione modesta.",
    avv:"Rischio di EPS e discinesia tardiva; per la lunghissima durata gli effetti avversi persistono a lungo dopo la sospensione.",
    note:"Utile per l'aderenza (1 somministrazione/settimana per via orale) senza ricorrere alla via iniettiva." },
  { id:"periciazina", nome:"Periciazina", cls:"tip", sub:"Fenotiazina piperidinica a bassa potenza",
    com:"Neuleptil · gtt 4% e 1%, cps 10 mg",
    mecc:"Antagonista D2 a bassa potenza con marcata attività α1-adrenolitica, antistaminica e anticolinergica; profilo 'sedativo-comportamentale'.",
    ind:"Disturbi del comportamento con aggressività e impulsività; stati psicotici; agitazione.",
    pos:"5–30 mg/die (dosi maggiori nelle psicosi); frequente l'uso in gocce per titolazione fine.",
    emi:"≈ 12–20 h.", met:"Epatico (CYP2D6).",
    eff:"Sedazione, ipotensione ortostatica, effetti anticolinergici; EPS meno marcati delle fenotiazine ad alta potenza; iperprolattinemia.",
    avv:"Ipotensione ortostatica (cautela nell'anziano); effetti anticolinergici; abbassa la soglia convulsiva.",
    note:"Storicamente impiegata per il controllo dell'impulsività e dei disturbi del comportamento, anche in età evolutiva (con cautela)." },
  { id:"tioridazina", nome:"Tioridazina", cls:"tip", sub:"Fenotiazina piperidinica — ritirata per cardiotossicità",
    com:"Melleril — NON PIÙ IN COMMERCIO (ritirata per rischio di torsione di punta)",
    mecc:"Antagonista D2 a bassa potenza con forte attività anticolinergica e α1-adrenolitica.",
    ind:"Storicamente: psicosi, agitazione. Oggi non impiegata.",
    pos:"ND (non in commercio).", emi:"≈ 20–30 h.", met:"Epatico (CYP2D6).",
    eff:"Marcato prolungamento del QT con torsione di punta, retinopatia pigmentaria ad alte dosi, eiaculazione retrograda, effetti anticolinergici.",
    avv:"Ritirata dal commercio per cardiotossicità: valore esclusivamente storico/didattico. Prototipo del rischio QT da antipsicotici.",
    note:"Il suo ritiro ha segnato l'attenzione regolatoria al QTc in psicofarmacologia." },
  { id:"droperidolo", nome:"Droperidolo", cls:"tip", sub:"Butirrofenone ad azione rapida (uso ospedaliero)",
    com:"Xomolix e formulazioni ospedaliere · fl ev/im",
    mecc:"Antagonista D2 ad alta potenza, ad azione rapida e breve; marcata attività antiemetica.",
    ind:"Nausea e vomito postoperatori; storicamente sedazione rapida dell'agitazione in ambiente controllato.",
    pos:"Uso ospedaliero, dosi basse (es. 0,625–2,5 mg ev per l'antiemesi).",
    emi:"≈ 2–3 h (azione breve).", met:"Epatico.",
    eff:"Sedazione, ipotensione, EPS; prolungamento del QT dose-dipendente.",
    avv:"Allerta regolatoria per il QT: richiede ECG e monitoraggio; impiego limitato all'ambiente ospedaliero.",
    note:"Rapidità d'azione utile in urgenza, ma il rischio QT ne ha ristretto l'uso psichiatrico." },
  // ===== ANSIOLITICI / IPNOTICI (completamento) =====
  { id:"clobazam", nome:"Clobazam", cls:"anx", sub:"Benzodiazepina 1,5 (profilo meno sedativo)",
    com:"Frisium · cpr 10 mg",
    mecc:"Agonista del recettore GABA-A con struttura 1,5-benzodiazepinica: rispetto alle 1,4-benzodiazepine ha minore sedazione a parità di effetto ansiolitico/anticonvulsivante.",
    ind:"Ansia; epilessia (terapia aggiuntiva, incluse le sindromi resistenti).",
    pos:"Ansia 10–30 mg/die; epilessia fino a 40–80 mg/die (specialistico).",
    emi:"≈ 18 h (metabolita N-desmetilclobazam ≈ 40–80 h).", met:"Epatico (CYP3A4, CYP2C19) a N-desmetilclobazam attivo.",
    eff:"Sedazione (minore delle altre BDZ), atassia, sialorrea; tolleranza all'effetto anticonvulsivante.",
    avv:"Come le altre BDZ: dipendenza, tolleranza, sospensione graduale. Il metabolita attivo si accumula nei metabolizzatori lenti del CYP2C19.",
    note:"Struttura 1,5: maggiore selettività ansiolitico/anticonvulsivante rispetto alla sedazione." },
  { id:"quazepam", nome:"Quazepam", cls:"anx", sub:"Benzodiazepina ipnotica a lunga durata (selettiva ω1)",
    com:"Quazium · cpr 15 mg",
    mecc:"Agonista GABA-A con relativa selettività per il sottotipo ω1 (α1): profilo prevalentemente ipnotico.",
    ind:"Insonnia.", pos:"7,5–15 mg alla sera.",
    emi:"Lunga (≈ 40 h; metaboliti attivi ancora più lunghi).", met:"Epatico (CYP3A4, CYP2C9).",
    eff:"Sedazione residua diurna (hangover), sonnolenza.",
    avv:"Emivita lunga: accumulo e sedazione diurna, sconsigliato nell'anziano. Dipendenza e sospensione graduale.",
    note:"Selettività ω1: meno miorilassante rispetto alle BDZ non selettive." },
  { id:"clometiazolo", nome:"Clometiazolo", cls:"anx", sub:"Sedativo-ipnotico non benzodiazepinico (modulatore GABA-A)",
    com:"Distraneurin · cps 192 mg, sciroppo",
    mecc:"Modulatore del recettore GABA-A in sito distinto dalle benzodiazepine, con proprietà sedative, ipnotiche e anticonvulsivanti.",
    ind:"Sindrome da astinenza alcolica (in ambiente controllato); agitazione e insonnia nell'anziano.",
    pos:"Astinenza alcolica: schema a scalare secondo protocollo (es. 2–4 cps iniziali, poi riduzione in 5–6 giorni).",
    emi:"≈ 4 h.", met:"Epatico (elevato effetto di primo passaggio; ridotto nell'epatopatico).",
    eff:"Sedazione, congestione nasale e starnutazione (tipici), irritazione oculare, ipersecrezione bronchiale.",
    avv:"Elevato potenziale di dipendenza: uso limitato a cicli brevi e supervisionati. Rischio di depressione respiratoria con alcol/oppioidi; NON somministrare se il paziente sta ancora bevendo.",
    note:"Alternativa alle benzodiazepine nell'astinenza alcolica, con impiego breve e sorvegliato per il rischio di abuso." },
  // ===== ANTIDEPRESSIVI (completamento) =====
  { id:"ademetionina", nome:"Ademetionina (SAMe)", cls:"ad", sub:"S-adenosil-L-metionina — donatore di metili",
    com:"Samyr · cpr gastroresistenti 200-400 mg, fl 200 mg im/ev",
    mecc:"Donatore fisiologico di gruppi metilici nelle reazioni di transmetilazione: favorisce la sintesi di neurotrasmettitori monoaminergici e di fosfolipidi di membrana, con effetto timolettico.",
    ind:"Stati depressivi (anche associati a epatopatia); sindromi depressive con componente somatica. Off-label: augmentation antidepressiva.",
    pos:"400–1600 mg/die per os; 200–400 mg/die im o ev nelle fasi iniziali.",
    emi:"≈ 80–100 minuti (via ev).", met:"Segue le vie metaboliche dell'ademetionina endogena (transmetilazione, transulfurazione, decarbossilazione); eliminazione prevalentemente epatica.",
    eff:"Disturbi gastrointestinali, insonnia se assunta la sera, ansia/attivazione; generalmente ben tollerata.",
    avv:"Possibile viraggio maniacale nel disturbo bipolare; cautela con altri serotoninergici (rischio teorico di sindrome serotoninergica). Assumere al mattino per l'effetto attivante.",
    note:"Attraversa la barriera ematoencefalica e si accumula nel liquor. Impiegata anche nelle epatopatie colestatiche." },
  { id:"iperico", nome:"Iperico (Hypericum perforatum)", cls:"ad", sub:"Fitoterapico ad azione antidepressiva",
    com:"Nervaxon, Quiens · cpr 300 mg di estratto standardizzato",
    mecc:"Inibizione debole e non selettiva del reuptake di serotonina, noradrenalina e dopamina (iperforina, ipericina); modulazione recettoriale multipla.",
    ind:"Depressione di grado lieve-moderato (impiego come integratore/fitoterapico).",
    pos:"300 mg tre volte al dì di estratto standardizzato (≈ 900 mg/die).",
    emi:"Variabile secondo il preparato.", met:"Potente INDUTTORE del CYP3A4 e della glicoproteina-P.",
    eff:"Fotosensibilizzazione, disturbi gastrointestinali, insonnia; generalmente ben tollerato.",
    avv:"INTERAZIONI MAGGIORI: da induzione del CYP3A4/P-gp riduce l'efficacia di contraccettivi orali, anticoagulanti, immunosoppressori, antiretrovirali e di molti psicofarmaci. Rischio di sindrome serotoninergica con SSRI/SNRI/triptani. Prodotto da banco: chiedere sempre al paziente se lo assume.",
    note:"Il caso più frequente di interazione 'nascosta' da prodotto naturale: va indagato attivamente in anamnesi farmacologica." },
  // ===== DIPENDENZE (completamento) =====
  { id:"oxibato", nome:"Sodio oxibato (GHB)", cls:"dip", sub:"Acido gamma-idrossibutirrico — analogo del GABA",
    com:"Alcover · soluzione orale 175 mg/ml (uso ospedaliero/specialistico)",
    mecc:"Agonista dei recettori GHB e, a dosi maggiori, GABA-B: metabolita naturale del GABA, riproduce parzialmente gli effetti dell'alcol sul SNC ('alcol sostitutivo') riducendo craving e sintomi astinenziali.",
    ind:"Sindrome da astinenza alcolica e mantenimento dell'astinenza (coadiuvante); narcolessia con cataplessia (indicazione distinta).",
    pos:"≈ 50–100 mg/kg/die suddivisi in 3–6 somministrazioni (da testo: 5 ml se 50 kg, 7,5 ml se 75 kg, 10 ml se 100 kg, tre volte al dì).",
    emi:"Molto breve (≈ 30–60 min): necessarie somministrazioni ravvicinate.", met:"Metabolismo endogeno via ciclo di Krebs; eliminazione come CO₂.",
    eff:"Sedazione, vertigini, cefalea; a dosi elevate depressione respiratoria e perdita di coscienza.",
    avv:"ELEVATO rischio di abuso e dipendenza (effetti simili all'alcol): erogazione controllata, affidamento a un referente, uso ospedaliero/specialistico. Pericoloso in associazione ad alcol, BDZ e oppioidi (depressione respiratoria). Non somministrare se il paziente sta ancora bevendo.",
    note:"Efficace sui sintomi astinenziali, ma il potenziale d'abuso ne ha limitato l'uso all'ambito controllato (da testo)." },
  { id:"baclofene", nome:"Baclofene", cls:"dip", sub:"Agonista GABA-B (uso anti-craving off-label)",
    com:"Lioresal e generici · cpr 10-25 mg",
    mecc:"Agonista selettivo dei recettori GABA-B pre- e post-sinaptici: riduce il rilascio di neurotrasmettitori eccitatori e modula il circuito della ricompensa, con effetto anti-craving oltre a quello miorilassante.",
    ind:"On-label: spasticità di origine spinale/cerebrale. Off-label: dipendenza da alcol (riduzione del craving), anche ad alte dosi.",
    pos:"Spasticità 15–75 mg/die. Nell'alcoldipendenza (off-label) titolazione progressiva, con dosi anche elevate sotto stretta supervisione.",
    emi:"≈ 3–4 h.", met:"Scarsamente metabolizzato; escrezione prevalentemente renale.",
    eff:"Sedazione, astenia, vertigini, nausea, confusione; a dosi elevate depressione del SNC.",
    avv:"NON sospendere bruscamente (rischio di sindrome da sospensione con confusione, allucinazioni, convulsioni). Aggiustare nell'insufficienza renale. L'uso ad alte dosi nell'alcoldipendenza resta off-label e discusso.",
    note:"L'impiego nell'alcoldipendenza nasce dall'esperienza di Ameisen; l'evidenza è controversa ma l'uso è diffuso in casi selezionati (da testo)." },
  // ===== CORRETTORI / ANTIDOTI =====
  { id:"biperidene", nome:"Biperidene", cls:"corr", sub:"Anticolinergico centrale (antimuscarinico)",
    com:"Akineton · cpr 2 mg, cpr RP 4 mg, fl 5 mg im/ev",
    mecc:"Antagonista dei recettori muscarinici centrali: riequilibra il rapporto dopamina/acetilcolina nello striato alterato dal blocco D2.",
    ind:"Sintomi extrapiramidali da neurolettici (distonia acuta, parkinsonismo, acatisia in parte); parkinsonismo.",
    pos:"Distonia acuta 2,5–5 mg im/ev lento, ripetibile. Orale 2–4 mg 1–3 volte/die (max ≈ 12 mg/die).",
    emi:"≈ 18–24 h.", met:"Epatico.",
    eff:"Secchezza delle fauci, visione offuscata, stipsi, ritenzione urinaria, confusione e deficit mnesici (spec. nell'anziano); potenziale d'abuso per l'effetto euforizzante.",
    avv:"Controindicato in glaucoma ad angolo chiuso, ileo, ipertrofia prostatica sintomatica. Peggiora la discinesia tardiva. Non usare in profilassi cronica non necessaria.",
    note:"Farmaco chiave dell'urgenza psichiatrica: nella distonia acuta la risposta è spettacolare, in pochi minuti." },
  { id:"triesifenidile", nome:"Triesifenidile", cls:"corr", sub:"Anticolinergico centrale (antimuscarinico)",
    com:"Artane · cpr 2-5 mg",
    mecc:"Antagonista muscarinico centrale; stesso principio del biperidene.",
    ind:"Parkinsonismo iatrogeno da neurolettici; parkinsonismo.",
    pos:"1 mg/die iniziale, titolare a 5–15 mg/die in dosi refratte.",
    emi:"≈ 3–6 h.", met:"Epatico.",
    eff:"Effetti anticolinergici periferici e centrali (confusione, deficit mnesici nell'anziano); potenziale d'abuso.",
    avv:"Come biperidene: controindicazioni anticolinergiche, peggioramento della discinesia tardiva, cautela nell'anziano (delirium).",
    note:"Solo via orale: nella distonia acuta si preferisce il biperidene parenterale." },
  { id:"amantadina", nome:"Amantadina", cls:"corr", sub:"Antagonista NMDA e dopamino-agonista indiretto",
    com:"Mantadan · cps 100 mg",
    mecc:"Antagonismo NMDA e aumento del rilascio di dopamina: migliora i sintomi extrapiramidali senza carico anticolinergico.",
    ind:"Parkinsonismo iatrogeno; discinesie. Off-label: fatica, apatia, iperprolattinemia da antipsicotici.",
    pos:"100 mg 1–2 volte/die (max 300 mg/die).",
    emi:"≈ 15 h.", met:"Scarsamente metabolizzata; escrezione renale (aggiustare in insufficienza renale).",
    eff:"Insonnia, livedo reticularis, edemi declivi, allucinazioni e confusione (spec. nell'anziano).",
    avv:"Può slatentizzare o peggiorare i sintomi psicotici (azione dopaminergica): cautela nello schizofrenico. Aggiustare nell'insufficienza renale; non sospendere bruscamente.",
    note:"Alternativa agli anticolinergici quando il carico anticolinergico è problematico (anziano, deficit cognitivo)." },
  { id:"propranololo", nome:"Propranololo", cls:"corr", sub:"Beta-bloccante non selettivo",
    com:"Inderal · cpr 40 mg",
    mecc:"Antagonista beta-adrenergico non selettivo: riduce le manifestazioni somatiche periferiche dell'ansia (tremore, tachicardia) e, per azione centrale, l'irrequietezza dell'acatisia.",
    ind:"On-label: ipertensione, tremore essenziale, profilassi dell'emicrania. Off-label in psichiatria: acatisia da neurolettici, ansia da prestazione, tremore da litio, aggressività.",
    pos:"Acatisia 10–20 mg 2–3 volte/die. Ansia da prestazione 10–40 mg 30–60 min prima dell'evento.",
    emi:"≈ 3–6 h.", met:"Epatico (CYP2D6, CYP1A2); elevato effetto di primo passaggio.",
    eff:"Bradicardia, ipotensione, astenia, estremità fredde, incubi; possibile mascheramento dei sintomi dell'ipoglicemia.",
    avv:"Controindicato in asma/BPCO (broncospasmo), blocchi AV, bradicardia, scompenso non compensato. Non sospendere bruscamente (rimbalzo adrenergico). Cautela nel diabetico.",
    note:"Prima scelta per l'acatisia: da preferire all'aumento dell'antipsicotico, che la peggiorerebbe." },
  { id:"clonidina", nome:"Clonidina", cls:"corr", sub:"Agonista α2-adrenergico centrale",
    com:"Catapresan · cpr 150 mcg, fl",
    mecc:"Agonista degli autorecettori α2 presinaptici: riduce il tono noradrenergico centrale (locus coeruleus), attenuando iperarousal e sintomi autonomici dell'astinenza.",
    ind:"On-label: ipertensione. Off-label in psichiatria: astinenza da oppioidi (sintomi autonomici), ADHD e tic, iperarousal nel PTSD, acatisia.",
    pos:"Astinenza da oppioidi 0,1–0,3 mg 2–4 volte/die secondo pressione. In psichiatria dosi basse titolate.",
    emi:"≈ 12–16 h.", met:"Epatico e renale.",
    eff:"Ipotensione, sedazione, secchezza delle fauci, bradicardia.",
    avv:"NON sospendere bruscamente: crisi ipertensiva da rimbalzo. Monitorare pressione e frequenza; cautela con altri ipotensivi e sedativi.",
    note:"Utile per la componente autonomica dell'astinenza (sudorazione, crampi, tachicardia), su cui gli oppioidi sostitutivi non sono l'unica opzione." },
  { id:"naloxone", nome:"Naloxone", cls:"corr", sub:"Antagonista oppioide puro (antidoto)",
    com:"Narcan e generici · fl 0,4 mg im/ev/sc; spray nasale",
    mecc:"Antagonista competitivo dei recettori oppioidi μ, κ e δ: spiazza l'agonista e riverte rapidamente la depressione respiratoria.",
    ind:"Overdose da oppioidi (antidoto); diagnosi differenziale del coma da oppioidi.",
    pos:"0,4–2 mg im/ev/intranasale, ripetibile ogni 2–3 minuti fino alla ripresa del respiro; nei casi refrattari infusione continua.",
    emi:"≈ 60–90 minuti (più breve di molti oppioidi).", met:"Epatico (glicuronazione).",
    eff:"Sindrome da astinenza acuta (agitazione, dolore, vomito, ipertensione) nei consumatori cronici.",
    avv:"RI-NARCOTIZZAZIONE: con oppioidi a lunga durata (metadone, buprenorfina) l'effetto del naloxone svanisce prima → sorveglianza prolungata e dosi ripetute. Titolare sul respiro, non sulla coscienza.",
    note:"Disponibile in formulazione intranasale per l'uso extraospedaliero nei programmi di riduzione del danno." },
  { id:"flumazenil", nome:"Flumazenil", cls:"corr", sub:"Antagonista benzodiazepinico (antidoto)",
    com:"Anexate e generici · fl 0,5 mg ev",
    mecc:"Antagonista competitivo del sito benzodiazepinico del recettore GABA-A: riverte sedazione e depressione respiratoria da benzodiazepine.",
    ind:"Reversione della sedazione da benzodiazepine (anestesia, procedure); intossicazione da benzodiazepine in casi selezionati.",
    pos:"0,2 mg ev in 15 secondi, ripetibile di 0,1–0,2 mg ogni minuto secondo risposta (dose totale secondo protocollo).",
    emi:"≈ 40–80 minuti (breve: possibile ri-sedazione).", met:"Epatico.",
    eff:"Ansia, agitazione, nausea; nei BDZ-dipendenti sindrome da astinenza acuta.",
    avv:"USO CAUTO: può precipitare CONVULSIONI se dipendenza da benzodiazepine o co-ingestione di proconvulsivanti (triciclici, bupropione). Non impiegare di routine nelle intossicazioni miste. Emivita breve: rischio di ri-sedazione, sorvegliare.",
    note:"Nelle intossicazioni pure da BDZ il supporto respiratorio è spesso sufficiente e più sicuro dell'antidoto." },
  { id:"tiamina", nome:"Tiamina (vitamina B1)", cls:"corr", sub:"Vitamina — profilassi dell'encefalopatia di Wernicke",
    com:"Benerva e formulazioni parenterali · cpr, fl im/ev",
    mecc:"Cofattore essenziale del metabolismo glucidico (piruvato deidrogenasi, transchetolasi): la carenza, frequente nell'alcolista, compromette il metabolismo energetico cerebrale.",
    ind:"Prevenzione e trattamento dell'encefalopatia di Wernicke e della sindrome di Korsakoff; carenza vitaminica nell'alcolismo e nella malnutrizione.",
    pos:"Profilassi 100–300 mg/die im/ev; encefalopatia di Wernicke conclamata dosi elevate parenterali secondo protocollo.",
    emi:"Breve; deposito corporeo limitato.", met:"Idrosolubile; escrezione renale.",
    eff:"Ben tollerata; rare reazioni di ipersensibilità con la via parenterale.",
    avv:"REGOLA CRITICA: somministrare la tiamina PRIMA di qualsiasi carico di glucosio nell'alcolista — il glucosio senza tiamina può precipitare l'encefalopatia di Wernicke.",
    note:"Triade di Wernicke (oftalmoplegia, atassia, confusione) spesso incompleta: nel dubbio, trattare." },
  { id:"ciproeptadina", nome:"Ciproeptadina", cls:"corr", sub:"Antistaminico con antagonismo 5-HT2 (antidoto)",
    com:"Periactin · cpr 4 mg, sciroppo",
    mecc:"Antagonista dei recettori H1 e 5-HT2: blocca l'eccesso di trasmissione serotoninergica.",
    ind:"Sindrome serotoninergica (casi moderati-gravi, come antidoto); allergie; stimolazione dell'appetito. Off-label: disfunzione sessuale da SSRI.",
    pos:"Sindrome serotoninergica: 12 mg os iniziali, poi 2 mg ogni 2 ore secondo risposta (max ≈ 32 mg/24h).",
    emi:"≈ 8 h.", met:"Epatico.",
    eff:"Sedazione marcata, secchezza delle fauci, aumento dell'appetito.",
    avv:"Solo per via orale/sondino (non esiste formulazione parenterale): nei casi gravi il cardine restano sospensione dei serotoninergici e terapia di supporto.",
    note:"Antagonismo 5-HT2A: razionale dell'impiego sia nella sindrome serotoninergica sia nella disfunzione sessuale da SSRI." },
];

/* ---- COMPLETAMENTI: campi mancanti o segnaposto nelle schede base (indicazioni, posologia, note, avvertenze).
   Uniti a DATA in fase di costruzione, senza modificare gli array originali. ---- */
const COMPLETAMENTI = {
  // ===== BENZODIAZEPINE: indicazioni e posologie reali =====
  bromazepam:{ ind:"Ansia e tensione emotiva; disturbi psicosomatici su base ansiosa.",
    pos:"1,5–3 mg due o tre volte al dì (gtt Lexotan: 10 gtt = 1 mg); fino a ≈ 9 mg/die in ambito ambulatoriale.",
    note:"Emivita medio-lunga: copertura stabile ma accumulo nell'anziano. Le gocce facilitano lo scalaggio graduale in fase di sospensione." },
  clordiazepossido:{ ind:"Ansia; sindrome da astinenza alcolica.",
    pos:"Ansia 15–40 mg/die in dosi refratte; astinenza alcolica 25–50 mg ogni 6 h con schema a scalare in 5–7 giorni." },
  delorazepam:{ ind:"Ansia e tensione emotiva; insonnia; sindrome da astinenza alcolica.",
    pos:"0,5–2 mg due volte al dì (gtt EN: 26 gtt = 1 mg)." },
  diazepam:{ ind:"Ansia e agitazione; spasmi muscolari; convulsioni e stato epilettico; sindrome da astinenza alcolica; premedicazione anestesiologica." },
  flurazepam:{ ind:"Insonnia.", pos:"15–30 mg alla sera.",
    note:"Metaboliti attivi a lunghissima durata: hangover e accumulo — sconsigliato nell'anziano." },
  clonazepam:{ ind:"Epilessia (varie forme); disturbo di panico; mioclono. Off-label: ansia, acatisia, disturbo comportamentale del sonno REM." },
  flunitrazepam:{ ind:"Insonnia grave (uso ristretto).", pos:"0,5–1 mg alla sera.",
    note:"Elevatissimo potenziale d'abuso e uso improprio: prescrizione molto ristretta e sorvegliata." },
  nitrazepam:{ ind:"Insonnia; alcune forme di epilessia.", pos:"5 mg alla sera (max 10 mg).",
    note:"Lunga durata d'azione: sedazione residua diurna, cautela nell'anziano." },
  lorazepam:{ ind:"Ansia; insonnia associata ad ansia; premedicazione; stato epilettico (ev). Off-label: astinenza alcolica, catatonia, agitazione acuta.",
    pos:"Ansia 1–2,5 mg due o tre volte al dì (gtt: 10 gtt = 0,5 mg); stato epilettico 4 mg ev lento." },
  lormetazepam:{ ind:"Insonnia.", pos:"0,5–1 mg alla sera (gtt Minias 0,25%: 10 gtt = 1 mg).",
    note:"Sola glicuronazione: sicuro nell'epatopatico e nell'anziano; le gocce facilitano lo scalaggio." },
  oxazepam:{ ind:"Ansia; insonnia; sindrome da astinenza alcolica (utile nell'epatopatico).",
    pos:"15–30 mg due o tre volte al dì." },
  temazepam:{ ind:"Insonnia (mantenimento del sonno).", pos:"10–20 mg alla sera.",
    note:"Sola glicuronazione: nessun metabolita attivo, sicuro nell'epatopatico e nell'anziano." },
  alprazolam:{ ind:"Ansia; disturbo di panico.",
    pos:"0,25–0,5 mg due o tre volte al dì (gtt: 10 gtt = 0,25 mg); nel panico fino a 4–6 mg/die con schema fisso." },
  etizolam:{ ind:"Ansia e insonnia; disturbi d'ansia con sintomi somatici.",
    pos:"0,5–1 mg due volte al dì (gtt Depas: 10 gtt = 0,25 mg).",
    note:"Tienodiazepina a insorgenza rapida: efficace ma con potenziale d'abuso più marcato — uso breve e uscita programmata." },
  estazolam:{ ind:"Insonnia.", pos:"1–2 mg alla sera.",
    note:"Durata intermedia: dose serale unica, uso breve." },
  triazolam:{ ind:"Insonnia da difficoltà di addormentamento (breve termine).",
    pos:"0,125–0,25 mg alla sera (gtt: 10 gtt = 0,125 mg).",
    note:"Emivita ultrabreve: ottimo sull'addormentamento ma rischio di amnesia anterograda e insonnia da rimbalzo." },
  brotizolam:{ ind:"Insonnia (breve termine).", pos:"0,25 mg alla sera.",
    note:"Durata breve: dose serale unica, uso limitato nel tempo." },
  clotiazepam:{ ind:"Ansia.", pos:"5 mg due o tre volte al dì (gtt Rizen: 10 gtt = 4 mg).",
    note:"Emivita breve-intermedia: dose minima efficace e durata limitata." },
  midazolam:{ ind:"Sedazione procedurale e anestesia; stato epilettico (buccale o im, anche nel bambino).",
    pos:"Sedazione: titolare all'effetto in setting monitorato; stato epilettico 10 mg im o buccale." },
  // ===== IPNOTICI NON-BDZ =====
  zolpidem:{ note:"Agonista selettivo ω1: profilo prevalentemente ipnotico con minor effetto miorilassante. Assumere subito prima di coricarsi con ≥ 7–8 h di sonno disponibili; possibili comportamenti automatici notturni in amnesia." },
  zaleplon:{ note:"Emivita ultrabreve (≈ 1 h): minimo effetto residuo al risveglio, utile anche per i risvegli precoci se restano ≥ 4 h di sonno." },
  zopiclone:{ note:"Ciclopirrolone: efficacia simile alle benzodiazepine ipnotiche; sapore metallico molto frequente e caratteristico." },
  // ===== ANTIPSICOTICI =====
  promazina:{ note:"Fenotiazina a bassa potenza, molto sedativa e poco incisiva sui sintomi positivi: impiegata soprattutto per agitazione e stati confusionali, con attenzione all'ipotensione ortostatica." },
  zuclopentixolo:{ note:"Disponibile in tre forme distinte: orale, ACETATO (Acutard, azione 2–3 giorni per l'acuzie) e DECANOATO (depot di mantenimento). Non confonderle nella prescrizione." },
  clotiapina:{ avv:"Sedazione profonda con rischio respiratorio se associata ad altri depressori del SNC; abbassa la soglia convulsiva; ipotensione ortostatica. Cautela nell'anziano (cadute, delirium).",
    note:"Molto sedativa: usata anche per l'insonnia grave in ambito specialistico, con la cautela di un antipsicotico e non di un ipnotico." },
  paliperidone:{ note:"Metabolita attivo del risperidone in formulazione OROS a rilascio osmotico: cinetica molto stabile. Le formulazioni LAI mensile, trimestrale e semestrale ne fanno un cardine del mantenimento." },
  asenapina:{ note:"Solo per via sublinguale: se deglutita è inefficace (biodisponibilità orale nulla). Non mangiare né bere per 10 minuti dopo l'assunzione." },
  levosulpiride:{ note:"Enantiomero levogiro della sulpiride: a basse dosi impiegato come procinetico e antiemetico, a dosi maggiori come antipsicotico. Iperprolattinemia molto frequente." },
  brexpiprazolo:{ note:"Agonista parziale D2 come l'aripiprazolo ma con maggiore affinità 5-HT1A/5-HT2A: minore acatisia e attivazione, leggermente più sedativo." },
  // ===== STABILIZZANTI =====
  oxcarbazepina:{ avv:"Iponatriemia frequente (controllare la sodiemia, specie nell'anziano e con diuretici); reazioni cutanee gravi con cross-reattività ~25–30% con la carbamazepina; riduce l'efficacia dei contraccettivi orali. Ridurre nell'insufficienza renale.",
    note:"Analogo della carbamazepina con minore auto-induzione e meno interazioni, ma maggior rischio di iponatriemia. Nel disturbo bipolare l'uso è off-label." },
  // ===== ANTIDEPRESSIVI =====
  imipramina:{ note:"Capostipite dei triciclici (Kuhn, 1957): la sua scoperta ha inaugurato la moderna farmacoterapia della depressione. Ancora indicato nell'enuresi notturna del bambino." },
  trimipramina:{ note:"Il triciclico più sedativo, con scarsa alterazione dell'architettura del sonno REM: utile nella depressione con insonnia marcata, al prezzo di un carico anticolinergico elevato." },
  dotiepina:{ note:"Triciclico sedativo con buona efficacia ansiolitica, ma tra i più cardiotossici in sovradosaggio: valutare con attenzione il rischio suicidario prima di prescriverlo." },
  maprotilina:{ note:"Tetraciclico prevalentemente noradrenergico: il rischio convulsivo più alto tra gli antidepressivi impone titolazione lenta e cautela nei pazienti a rischio." },
  citalopram:{ note:"Racemo di cui l'escitalopram è l'enantiomero attivo. Tetto di dose abbassato per motivi cardiologici (QT): 40 mg/die, 20 mg se >65 anni o epatopatia." },
  fluvoxamina:{ note:"Storico farmaco di riferimento nel DOC. Potente inibitore del CYP1A2: è l'SSRI con il maggior numero di interazioni rilevanti (clozapina, olanzapina, agomelatina, teofillina, caffeina, melatonina)." },
  mianserina:{ note:"Tetraciclico sedativo con blocco α2 presinaptico: poco cardiotossico rispetto ai triciclici, ma richiede attenzione all'emocromo per il rischio di agranulocitosi." },
  reboxetina:{ note:"Inibitore selettivo del reuptake della noradrenalina: profilo utile quando dominano apatia, calo di iniziativa ed energia; effetti simpaticomimetici (insonnia, sudorazione, disuria) il limite principale." },
};

const DATA = [...FARMACI, ...BDZ, ...IPNOTICI, ...AGGIUNTE].map((d) => COMPLETAMENTI[d.id] ? { ...d, ...COMPLETAMENTI[d.id] } : d);

/* =========================================================================
   DATI CLINICI AGGIUNTIVI (arricchimento)
   Tracciabilità:
   - GOCCE: rapporti gtt↔mg presi dalle formulazioni citate negli appunti.
   - EQ_AP: equivalenti clorpromazina — stime orientative da consenso
     internazionale (Gardner 2010 / Leucht-DDD). Metodo controverso.
   - EQ_BZD: equivalenti diazepam — Ashton Manual (+ voci italiane orientative).
   - RISK: profili comparativi ORDINALI (0–3), sintesi orientativa da appunti
     + letteratura consolidata. Non prescrittivi.
   ========================================================================= */

// --- Conversione gocce ↔ mg (rapporti dalle formulazioni del testo) ---
const GOCCE = {
  promazina:    { prod: "Talofen gtt",           ratio: "1 gtt = 2 mg",     mgGtt: 2 },
  amitriptilina:{ prod: "Laroxyl gtt",           ratio: "1 gtt = 2 mg",     mgGtt: 2 },
  trazodone:    { prod: "Trittico gtt",          ratio: "1 gtt = 2 mg",     mgGtt: 2 },
  trimipramina: { prod: "Surmontil gtt",         ratio: "1 gtt = 1 mg",     mgGtt: 1 },
  mianserina:   { prod: "Lantanon gtt",          ratio: "1 gtt = 2 mg",     mgGtt: 2 },
  citalopram:   { prod: "Elopram/Seropram gtt",  ratio: "10 gtt = 20 mg",   mgGtt: 2 },
  escitalopram: { prod: "Cipralex/Entact gtt",   ratio: "10 gtt = 10 mg",   mgGtt: 1 },
  bromazepam:   { prod: "Lexotan gtt",           ratio: "10 gtt = 1 mg",    mgGtt: 0.1 },
  delorazepam:  { prod: "EN gtt",                ratio: "26 gtt = 1 mg",    mgGtt: 0.03846 },
  clonazepam:   { prod: "Rivotril gtt",          ratio: "10 gtt = 1 mg",    mgGtt: 0.1 },
  lorazepam:    { prod: "Tavor gtt",             ratio: "10 gtt = 0,5 mg",  mgGtt: 0.05 },
  lormetazepam: { prod: "Minias gtt 0,25%",      ratio: "10 gtt = 1 mg",    mgGtt: 0.1 },
  alprazolam:   { prod: "Xanax gtt",             ratio: "10 gtt = 0,25 mg", mgGtt: 0.025 },
  etizolam:     { prod: "Depas gtt",             ratio: "10 gtt = 0,25 mg", mgGtt: 0.025 },
  clotiazepam:  { prod: "Rizen gtt",             ratio: "10 gtt = 4 mg",    mgGtt: 0.4 },
  zolpidem:     { prod: "Sonirem gtt",           ratio: "25 gtt = 10 mg",   mgGtt: 0.4 },
  aloperidolo:  { prod: "Serenase/Haldol gtt 2 mg/ml (0,2%)", ratio: "10 gtt = 1 mg", mgGtt: 0.1 },
  bromperidolo: { prod: "Impromen gtt 1% (10 mg/ml)",         ratio: "≈ 1 gtt = 0,5 mg", mgGtt: 0.5 },
  clotiapina:   { prod: "Entumin gtt 100 mg/ml", ratio: "3 gtt = 10 mg",    mgGtt: 3.333 },
  zuclopentixolo:{ prod: "Clopixol gtt 20 mg/ml", ratio: "10 gtt = 10 mg",  mgGtt: 1 },
  diazepam:     { prod: "Valium/Tranquirit gtt 0,5%", ratio: "10 gtt = 2 mg", mgGtt: 0.2 },
  prazepam:     { prod: "Prazene gtt",           ratio: "10 gtt = 5 mg",    mgGtt: 0.5 },
  triazolam:    { prod: "Halcion gtt",           ratio: "10 gtt = 0,125 mg", mgGtt: 0.0125 },
  periciazina:  { prod: "Neuleptil gtt 4% (40 mg/ml)", ratio: "1 gtt = 1 mg",  mgGtt: 1 },
};

// --- Equivalenti clorpromazina (mg ≈ 100 mg CPZ). Orientativi. ---
const EQ_AP = {
  clorpromazina: 100, perfenazina: 10, aloperidolo: 2, pimozide: 2, zuclopentixolo: 25,
  clozapina: 50, olanzapina: 5, risperidone: 2, paliperidone: 3, quetiapina: 150,
  ziprasidone: 60, asenapina: 10, lurasidone: 40, amisulpride: 100, aripiprazolo: 7.5,
};

// --- Equivalenti diazepam (mg ≈ 10 mg diazepam). Ashton + orientativi IT. ---
const EQ_BZD = {
  diazepam:        { v: 10,   fonte: "Ashton" },
  alprazolam:      { v: 0.5,  fonte: "Ashton" },
  bromazepam:      { v: 6,    fonte: "Ashton (5-6)" },
  clordiazepossido:{ v: 25,   fonte: "Ashton" },
  clonazepam:      { v: 0.5,  fonte: "Ashton" },
  flurazepam:      { v: 15,   fonte: "Ashton (15-30)" },
  flunitrazepam:   { v: 1,    fonte: "Ashton" },
  nitrazepam:      { v: 10,   fonte: "Ashton" },
  lorazepam:       { v: 1,    fonte: "Ashton" },
  lormetazepam:    { v: 1,    fonte: "Ashton (1-2)" },
  oxazepam:        { v: 20,   fonte: "Ashton" },
  temazepam:       { v: 20,   fonte: "Ashton" },
  triazolam:       { v: 0.5,  fonte: "Ashton" },
  estazolam:       { v: 1.5,  fonte: "Ashton (1-2)" },
  delorazepam:     { v: 1,    fonte: "orientativo" },
  etizolam:        { v: 1,    fonte: "orientativo" },
  clotiazepam:     { v: 5,    fonte: "orientativo" },
  brotizolam:      { v: 0.25, fonte: "orientativo" },
};

// --- Litio: carbonato 300 mg = 8,1 mEq (dal testo) ---
const LITIO = { mgPerMEq: 300 / 8.1 }; // ≈ 37,04 mg carbonato per mEq di Li+

// --- Dimensioni dei profili di rischio (ordinali 0–3) ---
const RISK_DIMS = [
  { key: "eps",  label: "Sintomi extrapiramidali", short: "EPS" },
  { key: "peso", label: "Impatto metabolico / ponderale", short: "↑peso/metab." },
  { key: "qt",   label: "Prolungamento del QTc", short: "QTc" },
  { key: "sed",  label: "Sedazione", short: "Sedazione" },
  { key: "ach",  label: "Carico anticolinergico", short: "Anticolinergico" },
  { key: "pro",  label: "Iperprolattinemia", short: "Prolattina" },
  { key: "sosp", label: "Sindrome da sospensione", short: "Sospensione" },
  { key: "conv", label: "Rischio convulsivo", short: "Convulsioni" },
  { key: "dip",  label: "Potenziale di dipendenza", short: "Dipendenza" },
];
const RISK_LIV = ["trascurabile", "basso", "moderato", "alto"];

/* ---- Profili di rischio: scala ordinale 0-3 su 9 dimensioni, completa per tutti i farmaci.
   0 trascurabile · 1 basso · 2 moderato · 3 alto. Valutazioni comparative orientative
   (Maudsley, Stahl, RCP): servono al confronto relativo tra molecole, non come valori assoluti. ---- */
const RISK = {
  // ===== ANTIPSICOTICI TIPICI =====
  clorpromazina:  { eps:2, peso:2, qt:2, sed:3, ach:2, pro:3, sosp:1, conv:2, dip:0 },
  levomepromazina:{ eps:2, peso:2, qt:2, sed:3, ach:3, pro:3, sosp:1, conv:2, dip:0 },
  promazina:      { eps:1, peso:2, qt:2, sed:3, ach:2, pro:2, sosp:1, conv:2, dip:0 },
  perfenazina:    { eps:3, peso:1, qt:1, sed:1, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  aloperidolo:    { eps:3, peso:1, qt:2, sed:1, ach:0, pro:3, sosp:1, conv:1, dip:0 },
  pimozide:       { eps:3, peso:1, qt:3, sed:1, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  zuclopentixolo: { eps:3, peso:2, qt:1, sed:2, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  tiapride:       { eps:1, peso:1, qt:1, sed:1, ach:0, pro:3, sosp:0, conv:0, dip:0 },
  clotiapina:     { eps:2, peso:2, qt:2, sed:3, ach:2, pro:2, sosp:1, conv:2, dip:0 },
  loxapina:       { eps:2, peso:1, qt:1, sed:2, ach:1, pro:2, sosp:1, conv:2, dip:0 },
  flufenazina:    { eps:3, peso:1, qt:1, sed:1, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  flupentixolo:   { eps:3, peso:1, qt:1, sed:1, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  bromperidolo:   { eps:3, peso:1, qt:2, sed:1, ach:0, pro:3, sosp:1, conv:1, dip:0 },
  // ===== ANTIPSICOTICI ATIPICI =====
  clozapina:      { eps:0, peso:3, qt:2, sed:3, ach:3, pro:0, sosp:2, conv:3, dip:0 },
  olanzapina:     { eps:1, peso:3, qt:1, sed:2, ach:2, pro:1, sosp:1, conv:1, dip:0 },
  quetiapina:     { eps:0, peso:2, qt:2, sed:3, ach:1, pro:0, sosp:1, conv:1, dip:0 },
  risperidone:    { eps:2, peso:2, qt:1, sed:1, ach:0, pro:3, sosp:1, conv:1, dip:0 },
  paliperidone:   { eps:2, peso:2, qt:1, sed:1, ach:0, pro:3, sosp:1, conv:1, dip:0 },
  ziprasidone:    { eps:1, peso:0, qt:3, sed:1, ach:0, pro:1, sosp:1, conv:1, dip:0 },
  asenapina:      { eps:1, peso:1, qt:1, sed:2, ach:0, pro:1, sosp:1, conv:1, dip:0 },
  lurasidone:     { eps:2, peso:0, qt:0, sed:1, ach:0, pro:1, sosp:1, conv:0, dip:0 },
  amisulpride:    { eps:2, peso:1, qt:2, sed:0, ach:0, pro:3, sosp:0, conv:0, dip:0 },
  levosulpiride:  { eps:2, peso:1, qt:1, sed:1, ach:0, pro:3, sosp:0, conv:0, dip:0 },
  aripiprazolo:   { eps:1, peso:1, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  cariprazina:    { eps:2, peso:1, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  brexpiprazolo:  { eps:1, peso:1, qt:0, sed:1, ach:0, pro:1, sosp:1, conv:0, dip:0 },
  sulpiride:      { eps:1, peso:1, qt:1, sed:0, ach:0, pro:3, sosp:0, conv:0, dip:0 },
  sertindolo:     { eps:0, peso:1, qt:3, sed:1, ach:0, pro:0, sosp:1, conv:1, dip:0 },
  // ===== STABILIZZANTI =====
  litio:          { eps:1, peso:2, qt:1, sed:1, ach:0, pro:0, sosp:2, conv:0, dip:0 },
  valproato:      { eps:1, peso:2, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  carbamazepina:  { eps:0, peso:1, qt:1, sed:2, ach:1, pro:0, sosp:1, conv:0, dip:0 },
  oxcarbazepina:  { eps:0, peso:1, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  lamotrigina:    { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  topiramato:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  // ===== ANTIDEPRESSIVI — triciclici e tetraciclici =====
  amitriptilina:  { eps:0, peso:3, qt:2, sed:3, ach:3, pro:1, sosp:2, conv:2, dip:0 },
  clomipramina:   { eps:0, peso:2, qt:2, sed:2, ach:2, pro:1, sosp:2, conv:2, dip:0 },
  nortriptilina:  { eps:0, peso:1, qt:2, sed:1, ach:1, pro:0, sosp:2, conv:1, dip:0 },
  imipramina:     { eps:0, peso:2, qt:2, sed:2, ach:2, pro:1, sosp:2, conv:2, dip:0 },
  desipramina:    { eps:0, peso:1, qt:2, sed:1, ach:1, pro:0, sosp:2, conv:1, dip:0 },
  trimipramina:   { eps:0, peso:2, qt:2, sed:3, ach:3, pro:1, sosp:2, conv:2, dip:0 },
  dotiepina:      { eps:0, peso:2, qt:3, sed:3, ach:2, pro:1, sosp:2, conv:2, dip:0 },
  maprotilina:    { eps:0, peso:2, qt:2, sed:2, ach:1, pro:0, sosp:2, conv:3, dip:0 },
  // ===== ANTIDEPRESSIVI — SARI / SSRI / SNRI / altri =====
  trazodone:      { eps:0, peso:1, qt:2, sed:3, ach:0, pro:0, sosp:1, conv:1, dip:0 },
  citalopram:     { eps:0, peso:1, qt:2, sed:1, ach:0, pro:1, sosp:2, conv:0, dip:0 },
  escitalopram:   { eps:0, peso:1, qt:2, sed:1, ach:0, pro:1, sosp:2, conv:0, dip:0 },
  fluoxetina:     { eps:1, peso:0, qt:1, sed:0, ach:0, pro:1, sosp:0, conv:0, dip:0 },
  fluvoxamina:    { eps:0, peso:0, qt:1, sed:1, ach:0, pro:1, sosp:2, conv:0, dip:0 },
  paroxetina:     { eps:0, peso:2, qt:1, sed:1, ach:1, pro:2, sosp:3, conv:0, dip:0 },
  sertralina:     { eps:0, peso:0, qt:1, sed:0, ach:0, pro:1, sosp:2, conv:0, dip:0 },
  venlafaxina:    { eps:0, peso:0, qt:1, sed:0, ach:0, pro:1, sosp:3, conv:1, dip:0 },
  duloxetina:     { eps:0, peso:0, qt:1, sed:1, ach:0, pro:1, sosp:2, conv:0, dip:0 },
  desvenlafaxina: { eps:0, peso:0, qt:1, sed:0, ach:0, pro:1, sosp:3, conv:1, dip:0 },
  mirtazapina:    { eps:0, peso:3, qt:1, sed:3, ach:1, pro:0, sosp:1, conv:0, dip:0 },
  mianserina:     { eps:0, peso:2, qt:1, sed:3, ach:1, pro:0, sosp:1, conv:1, dip:0 },
  reboxetina:     { eps:0, peso:0, qt:1, sed:0, ach:1, pro:0, sosp:1, conv:0, dip:0 },
  bupropione:     { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:2, dip:0 },
  agomelatina:    { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  vortioxetina:   { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  tianeptina:     { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:1 },
  esketamina:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  imao:           { eps:0, peso:2, qt:1, sed:1, ach:1, pro:0, sosp:2, conv:1, dip:0 },
  fenelzina:      { eps:0, peso:2, qt:1, sed:1, ach:1, pro:0, sosp:2, conv:1, dip:0 },
  tranilcipromina:{ eps:0, peso:1, qt:1, sed:0, ach:1, pro:0, sosp:2, conv:1, dip:1 },
  moclobemide:    { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  // ===== BENZODIAZEPINE =====
  bromazepam:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  clordiazepossido:{ eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  delorazepam:    { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  diazepam:       { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  flurazepam:     { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  clonazepam:     { eps:0, peso:1, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  flunitrazepam:  { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:3, conv:0, dip:3 },
  nitrazepam:     { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  lorazepam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:3, conv:0, dip:3 },
  lormetazepam:   { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  oxazepam:       { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  temazepam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  alprazolam:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:3, conv:0, dip:3 },
  etizolam:       { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:3, conv:0, dip:3 },
  estazolam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  triazolam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:3, conv:0, dip:3 },
  brotizolam:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  clotiazepam:    { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  midazolam:      { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  prazepam:       { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  pinazepam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  nordazepam:     { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  ketazolam:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  // ===== IPNOTICI NON-BDZ E ALTRI ANSIOLITICI =====
  zolpidem:       { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  zaleplon:       { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  zopiclone:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  daridorexant:   { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  melatonina:     { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  pregabalin:     { eps:0, peso:2, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  gabapentin:     { eps:0, peso:1, qt:0, sed:2, ach:0, pro:0, sosp:1, conv:0, dip:2 },
  buspirone:      { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  idrossizina:    { eps:0, peso:0, qt:1, sed:2, ach:1, pro:0, sosp:0, conv:0, dip:0 },
  prometazina:    { eps:1, peso:1, qt:1, sed:3, ach:2, pro:1, sosp:0, conv:1, dip:0 },
  // ===== ADHD / STIMOLANTI =====
  metilfenidato:  { eps:0, peso:0, qt:1, sed:0, ach:0, pro:0, sosp:1, conv:1, dip:3 },
  lisdexamfetamina:{ eps:0, peso:0, qt:1, sed:0, ach:0, pro:0, sosp:1, conv:1, dip:3 },
  atomoxetina:    { eps:0, peso:0, qt:1, sed:1, ach:0, pro:0, sosp:0, conv:1, dip:0 },
  guanfacina:     { eps:0, peso:1, qt:1, sed:2, ach:0, pro:0, sosp:2, conv:0, dip:0 },
  modafinil:      { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:1 },
  // ===== DIPENDENZE =====
  naltrexone:     { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  acamprosato:    { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  disulfiram:     { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  nalmefene:      { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  vareniclina:    { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  metadone:       { eps:0, peso:2, qt:2, sed:2, ach:0, pro:1, sosp:3, conv:1, dip:3 },
  buprenorfina:   { eps:0, peso:1, qt:1, sed:1, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  // ===== COGNITIVI / ANTIDEMENZA =====
  donepezil:      { eps:0, peso:0, qt:1, sed:1, ach:0, pro:0, sosp:1, conv:1, dip:0 },
  rivastigmina:   { eps:0, peso:0, qt:1, sed:1, ach:0, pro:0, sosp:1, conv:1, dip:0 },
  galantamina:    { eps:0, peso:0, qt:1, sed:1, ach:0, pro:0, sosp:1, conv:1, dip:0 },
  memantina:      { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  // ===== COMPLETAMENTI =====
  penfluridolo:   { eps:3, peso:1, qt:1, sed:1, ach:1, pro:3, sosp:1, conv:1, dip:0 },
  periciazina:    { eps:2, peso:2, qt:1, sed:3, ach:2, pro:2, sosp:1, conv:2, dip:0 },
  tioridazina:    { eps:1, peso:2, qt:3, sed:3, ach:3, pro:2, sosp:1, conv:2, dip:0 },
  droperidolo:    { eps:2, peso:0, qt:3, sed:2, ach:0, pro:2, sosp:0, conv:1, dip:0 },
  clobazam:       { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  quazepam:       { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:2, conv:0, dip:2 },
  clometiazolo:   { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  ademetionina:   { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  iperico:        { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:1, conv:0, dip:0 },
  oxibato:        { eps:0, peso:0, qt:0, sed:3, ach:0, pro:0, sosp:2, conv:0, dip:3 },
  baclofene:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:2, conv:1, dip:1 },
  biperidene:     { eps:0, peso:0, qt:0, sed:1, ach:3, pro:0, sosp:1, conv:0, dip:1 },
  triesifenidile: { eps:0, peso:0, qt:0, sed:1, ach:3, pro:0, sosp:1, conv:0, dip:1 },
  amantadina:     { eps:0, peso:0, qt:1, sed:0, ach:1, pro:0, sosp:1, conv:1, dip:0 },
  propranololo:   { eps:0, peso:0, qt:0, sed:1, ach:0, pro:0, sosp:2, conv:0, dip:0 },
  clonidina:      { eps:0, peso:0, qt:0, sed:2, ach:0, pro:0, sosp:3, conv:0, dip:0 },
  naloxone:       { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  flumazenil:     { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:1, dip:0 },
  tiamina:        { eps:0, peso:0, qt:0, sed:0, ach:0, pro:0, sosp:0, conv:0, dip:0 },
  ciproeptadina:  { eps:0, peso:1, qt:0, sed:2, ach:1, pro:0, sosp:0, conv:0, dip:0 },
};

// --- Profilo CYP450 per farmaco (dal testo) ---
// sub: substrato · inib: inibitore {e,f} · ind: induttore
const CYP = {
  clorpromazina:{ sub:["2D6","1A2"], inib:[{e:"2D6"},{e:"3A4"}] },
  aloperidolo:{ sub:["1A2","2D6","3A4"], inib:[{e:"2D6"}] },
  clozapina:{ sub:["1A2","2D6","3A4"], nota:"Nicotina/fumo inducono il CYP1A2 (↓livelli); caffeina e fluvoxamina ↑livelli. Sospensione del fumo → rischio di tossicità." },
  olanzapina:{ sub:["1A2","2D6"] },
  quetiapina:{ sub:["3A4"] },
  risperidone:{ sub:["2D6","3A4"] },
  paliperidone:{ sub:[], nota:"Scarsa metabolizzazione epatica; prevalente escrezione renale." },
  ziprasidone:{ sub:["3A4","1A2"] },
  asenapina:{ sub:["1A2"], nota:"+ glucuronidazione diretta." },
  lurasidone:{ sub:["3A4"], nota:"Evitare inibitori/induttori forti del CYP3A4." },
  amisulpride:{ sub:[], nota:"Scarsa metabolizzazione; escrezione renale — poche interazioni metaboliche." },
  aripiprazolo:{ sub:["2D6","3A4"] },
  cariprazina:{ sub:["3A4"], nota:"Controindicati induttori (carbamazepina) e inibitori forti del CYP3A4." },
  brexpiprazolo:{ sub:["3A4","2D6"] },
  amitriptilina:{ sub:["1A2","2D6"] },
  clomipramina:{ sub:["2D6","1A2"] },
  imipramina:{ sub:["1A2","2D6"] },
  nortriptilina:{ sub:["2D6"] },
  desipramina:{ sub:["2D6"] },
  citalopram:{ sub:["2C19","3A4","2D6"] },
  escitalopram:{ sub:["2C19","3A4","2D6"] },
  fluoxetina:{ sub:["2D6"], inib:[{e:"2D6",f:"++"},{e:"2C9",f:"++"}] },
  fluvoxamina:{ sub:["2D6"], inib:[{e:"1A2",f:"++++"},{e:"3A4",f:"+++"},{e:"2C19"}], nota:"Interazioni maggiori: ↑clozapina, olanzapina, TCA, teofillina. Controindicata con agomelatina." },
  paroxetina:{ sub:["2D6"], inib:[{e:"2D6",f:"++++"}] },
  sertralina:{ sub:["3A4","2C19","2C9","2D6","2B6"], inib:[{e:"2D6",f:"+"}] },
  venlafaxina:{ sub:["2D6"], inib:[{e:"2D6",f:"+"}] },
  duloxetina:{ sub:["2D6","1A2"], inib:[{e:"2D6",f:"+"}], nota:"Cautela con inibitori del CYP1A2 (fluvoxamina)." },
  mirtazapina:{ sub:["1A2","3A4","2D6"] },
  mianserina:{ sub:["2D6"] },
  reboxetina:{ sub:["3A4"], nota:"Interazioni con inibitori/induttori del CYP3A4 (ketoconazolo, carbamazepina)." },
  bupropione:{ sub:["2B6"], inib:[{e:"2D6"}], nota:"Autoinduttore; ↑ livelli con valproato." },
  agomelatina:{ sub:["1A2","2C9","2C19"], nota:"Controindicata con inibitori forti del CYP1A2 (fluvoxamina, ciprofloxacina)." },
  vortioxetina:{ sub:["2D6","2C9","3A4","2A6","2C19"], nota:"Via principale CYP2D6; livelli poco condizionati da altri farmaci." },
  carbamazepina:{ sub:["3A4","2C9"], ind:["3A4"], nota:"Forte induttore e autoinduttore: ↓ efficacia dei farmaci associati (contraccettivi, AP, AD, ecc.)." },
  valproato:{ inib:[{e:"2C9"}], nota:"Inibisce la glicuronidazione → ↑ lamotrigina." },
  topiramato:{ inib:[{e:"2C19"}], nota:"Fenitoina/carbamazepina ↓ i suoi livelli. Monitorare la litiemia se associato." },
  oxcarbazepina:{ ind:["3A4"], nota:"Induttore debole; minore impegno epatico rispetto alla carbamazepina." },
  lamotrigina:{ sub:[], nota:"Glicuronoconiugazione; valproato ↑ livelli (dimezzare la titolazione), carbamazepina ↓." },
  litio:{ sub:[], nota:"Non metabolizzato. Interazioni farmacodinamiche/renali: tiazidici, ACE-i, sartani e FANS ↑ la litiemia." },
  alprazolam:{ sub:["3A4"] }, triazolam:{ sub:["3A4"] }, midazolam:{ sub:["3A4"] }, brotizolam:{ sub:["3A4"] },
  lorazepam:{ sub:[], nota:"Glicuronoconiugazione diretta: nessun coinvolgimento CYP significativo (utile in epatopatia)." },
  oxazepam:{ sub:[], nota:"Glicuronoconiugazione diretta: nessun coinvolgimento CYP significativo." },
  temazepam:{ sub:[], nota:"Glicuronoconiugazione diretta." },
  zolpidem:{ sub:["3A4"] }, zopiclone:{ sub:["3A4"] }, zaleplon:{ sub:["3A4"] },
  daridorexant:{ sub:["3A4"], ind:["2C9"], nota:"Dimezzare la dose con inibitori del CYP3A4 o succo di pompelmo." },
  pregabalin:{ sub:[], nota:"Non metabolizzato dai CYP; escrezione renale — nessuna interazione metabolica significativa." },
  // Antipsicotici aggiuntivi
  flufenazina:{ sub:["2D6"] },
  flupentixolo:{ sub:["2D6"] },
  bromperidolo:{ sub:["3A4","2D6"] },
  sulpiride:{ sub:[], nota:"Scarsa metabolizzazione epatica; eliminazione renale — poche interazioni metaboliche." },
  sertindolo:{ sub:["2D6","3A4"], nota:"Attenzione al QT: gli inibitori potenti del 2D6/3A4 ne aumentano i livelli." },
  // Antidepressivi aggiuntivi
  desvenlafaxina:{ sub:["3A4"], nota:"Prevalente coniugazione (glicuronazione); scarsa dipendenza dal CYP2D6 (vantaggio sulla venlafaxina)." },
  esketamina:{ sub:["2B6","3A4"] },
  moclobemide:{ sub:["2C19"], nota:"Il topiramato (inibitore del 2C19) può aumentarne i livelli; cautela con serotoninergici." },
  fenelzina:{ sub:[], nota:"IMAO irreversibile: interazioni prevalentemente farmacodinamiche (tiramina, serotoninergici, simpaticomimetici)." },
  tranilcipromina:{ sub:[], nota:"IMAO irreversibile: interazioni farmacodinamiche (tiramina, serotoninergici, simpaticomimetici)." },
  // Ansiolitici aggiuntivi
  buspirone:{ sub:["3A4"], nota:"Livelli ↑ da inibitori del CYP3A4 (pompelmo, azoli, macrolidi); ↓ da induttori (carbamazepina)." },
  idrossizina:{ sub:[], nota:"Metabolismo epatico; attenzione al QT con altri farmaci QT-prolunganti." },
  gabapentin:{ sub:[], nota:"Non metabolizzato dai CYP; escrezione renale — nessuna interazione metabolica significativa." },
  // ADHD / stimolanti
  metilfenidato:{ sub:[], nota:"Metabolizzato dalle esterasi (acido ritalinico), non dai CYP; controindicato con IMAO (crisi ipertensiva)." },
  lisdexamfetamina:{ sub:[], nota:"Idrolisi ematica a destroanfetamina; controindicata con IMAO." },
  atomoxetina:{ sub:["2D6"], nota:"Substrato del CYP2D6: metabolizzatori lenti e inibitori del 2D6 (paroxetina, fluoxetina, bupropione) ne aumentano l'esposizione." },
  guanfacina:{ sub:["3A4"], nota:"Substrato del CYP3A4: aggiustare con inibitori/induttori potenti del 3A4." },
  modafinil:{ sub:["3A4"], ind:["3A4"], nota:"Induttore del CYP3A4 (↓ efficacia dei contraccettivi orali); inibisce il CYP2C19." },
  // Dipendenze
  disulfiram:{ sub:[], nota:"Inibisce diversi CYP (spec. CYP2E1); prolunga l'emivita di caffeina, fenitoina, warfarin. Gli SSRI ne inibiscono a loro volta il metabolismo." },
  naltrexone:{ sub:[], nota:"Interazione principale farmacodinamica: blocca gli oppioidi (precipita l'astinenza, annulla l'analgesia)." },
  nalmefene:{ sub:[], nota:"Glicuronazione; interazione principale farmacodinamica con gli oppioidi." },
  acamprosato:{ sub:[], nota:"Non metabolizzato; escrezione renale — nessuna interazione metabolica significativa." },
  vareniclina:{ sub:[], nota:"Scarso metabolismo; escrezione renale — poche interazioni metaboliche." },
  // Antidemenza
  donepezil:{ sub:["2D6","3A4"], nota:"Substrato di CYP2D6/3A4: gli inibitori potenti ne aumentano i livelli." },
  rivastigmina:{ sub:[], nota:"Idrolisi da colinesterasi, non CYP-dipendente: poche interazioni metaboliche (utile in politerapia)." },
  galantamina:{ sub:["2D6","3A4"], nota:"Substrato di CYP2D6/3A4." },
  memantina:{ sub:[], nota:"Scarsamente metabolizzata; escrezione renale — attenzione con altri antagonisti NMDA (amantadina, ketamina)." },
  metadone:{ sub:["3A4","2B6","2D6"], nota:"Substrato di più CYP: gli induttori (carbamazepina, rifampicina, alcuni antiretrovirali) ne riducono i livelli precipitando l'astinenza; gli inibitori li aumentano. Sorvegliare il QTc." },
  buprenorfina:{ sub:["3A4"], nota:"Substrato del CYP3A4: gli inibitori ne aumentano i livelli, gli induttori li riducono." },
  penfluridolo:{ sub:["3A4"] },
  periciazina:{ sub:["2D6"] },
  tioridazina:{ sub:["2D6"], nota:"Substrato del CYP2D6: gli inibitori potenti (fluoxetina, paroxetina) ne aumentano i livelli con grave rischio di QT — associazione storicamente controindicata." },
  droperidolo:{ sub:["3A4"], nota:"Attenzione al QT: ECG e correzione degli elettroliti prima della somministrazione." },
  clobazam:{ sub:["3A4","2C19"], nota:"Il metabolita attivo N-desmetilclobazam si accumula nei metabolizzatori lenti del CYP2C19." },
  quazepam:{ sub:["3A4","2C9"] },
  clometiazolo:{ sub:[], nota:"Elevato effetto di primo passaggio epatico: biodisponibilità molto aumentata nell'epatopatico (ridurre la dose)." },
  ademetionina:{ sub:[], nota:"Segue le vie metaboliche endogene (transmetilazione): non impegna i CYP." },
  iperico:{ sub:[], ind:["3A4","1A2","2C9"], nota:"INDUTTORE potente del CYP3A4 e della glicoproteina-P: riduce l'efficacia di contraccettivi, anticoagulanti, immunosoppressori, antiretrovirali e di molti psicofarmaci. Prodotto da banco: indagarlo sempre in anamnesi." },
  oxibato:{ sub:[], nota:"Metabolismo endogeno (ciclo di Krebs): interazioni prevalentemente farmacodinamiche (alcol, benzodiazepine, oppioidi → depressione respiratoria)." },
  baclofene:{ sub:[], nota:"Scarsamente metabolizzato; escrezione renale — aggiustare nell'insufficienza renale." },
  biperidene:{ sub:[], nota:"Interazione principale farmacodinamica: somma del carico anticolinergico con triciclici, antipsicotici a bassa potenza e antistaminici." },
  triesifenidile:{ sub:[], nota:"Somma del carico anticolinergico con altri antimuscarinici (rischio di delirium nell'anziano)." },
  amantadina:{ sub:[], nota:"Escrezione renale; cautela con altri antagonisti NMDA (memantina, ketamina)." },
  propranololo:{ sub:["2D6","1A2"], nota:"Substrato di CYP2D6/1A2: gli inibitori (fluoxetina, paroxetina, fluvoxamina) ne aumentano i livelli con rischio di bradicardia e ipotensione." },
  clonidina:{ sub:[], nota:"Interazioni farmacodinamiche: i triciclici possono antagonizzarne l'effetto antipertensivo; somma di sedazione e ipotensione con altri depressori." },
  naloxone:{ sub:[], nota:"Antagonismo farmacodinamico puro sui recettori oppioidi." },
  flumazenil:{ sub:[], nota:"Antagonismo farmacodinamico sul sito benzodiazepinico del recettore GABA-A." },
  tiamina:{ sub:[], nota:"Vitamina idrosolubile: nessuna interazione metabolica rilevante." },
  ciproeptadina:{ sub:[], nota:"Antagonismo 5-HT2: se somministrata cronicamente può ridurre l'efficacia degli antidepressivi serotoninergici." },
  // ===== COMPLETAMENTO CYP =====
  levomepromazina:{ sub:["2D6"], nota:"Somma marcata del carico anticolinergico, sedativo e ipotensivo con altri depressori." },
  promazina:{ sub:["2D6"] },
  perfenazina:{ sub:["2D6"], nota:"Gli inibitori del CYP2D6 (fluoxetina, paroxetina, bupropione) ne aumentano i livelli e gli EPS." },
  pimozide:{ sub:["3A4","2D6"], nota:"ATTENZIONE AL QT: gli inibitori del 3A4 (azoli, macrolidi, succo di pompelmo) ne aumentano i livelli con rischio di torsione di punta — associazioni controindicate." },
  zuclopentixolo:{ sub:["2D6"] },
  tiapride:{ sub:[], nota:"Eliminazione prevalentemente renale: poche interazioni metaboliche; aggiustare nell'insufficienza renale." },
  clotiapina:{ sub:[], nota:"Metabolismo epatico; forte sedazione additiva con altri depressori del SNC." },
  loxapina:{ sub:["1A2"], nota:"Substrato del CYP1A2: il fumo (induttore) ne riduce i livelli." },
  levosulpiride:{ sub:[], nota:"Eliminazione renale: poche interazioni metaboliche; aggiustare nell'insufficienza renale. Iperprolattinemia frequente." },
  trimipramina:{ sub:["2D6","2C19"], nota:"Marcato carico anticolinergico e sedativo; ECG alle dosi piene." },
  dotiepina:{ sub:["2D6"], nota:"Particolarmente cardiotossica in sovradosaggio (QT): cautela nel paziente a rischio suicidario." },
  maprotilina:{ sub:["2D6"], nota:"Abbassa la soglia convulsiva più degli altri: cautela nell'epilessia e alle dosi alte." },
  trazodone:{ sub:["3A4"], nota:"Substrato del CYP3A4: gli inibitori (azoli, macrolidi, ritonavir) ne aumentano i livelli (sedazione, ipotensione)." },
  imao:{ sub:[], nota:"Interazioni prevalentemente FARMACODINAMICHE: crisi ipertensiva da tiramina/simpaticomimetici, sindrome serotoninergica con SSRI/SNRI/triptani/tramadolo. Wash-out di 2 settimane in entrata e in uscita." },
  tianeptina:{ sub:[], nota:"Metabolizzata per β-ossidazione (non CYP-dipendente): poche interazioni metaboliche." },
  bromazepam:{ sub:["3A4"], nota:"Metabolismo ossidativo: ridotto nell'anziano e nell'epatopatico." },
  clordiazepossido:{ sub:["3A4","2C19"], nota:"Metaboliti attivi a lunga durata; metabolismo ossidativo ridotto nell'anziano e nell'epatopatico." },
  delorazepam:{ sub:["3A4"], nota:"Metabolismo ossidativo a lunga durata: accumulo nell'anziano." },
  diazepam:{ sub:["2C19","3A4"], nota:"Metabolismo ossidativo (CYP2C19/3A4) a nordazepam a lunga durata: ridotto dall'età, dall'epatopatia e dagli inibitori (omeprazolo, fluvoxamina, isoniazide)." },
  flurazepam:{ sub:["3A4"], nota:"Metaboliti attivi a lunga durata: hangover e accumulo, sconsigliato nell'anziano." },
  clonazepam:{ sub:["3A4"], nota:"Nitroriduzione ed ossidazione; livelli aumentati dagli inibitori del 3A4." },
  flunitrazepam:{ sub:["3A4","2C19"], nota:"Metabolismo ossidativo; uso ristretto per l'elevato potenziale d'abuso." },
  nitrazepam:{ sub:[], nota:"Nitroriduzione ed acetilazione (non ossidazione classica): sedazione residua diurna." },
  lormetazepam:{ sub:[], nota:"GLICURONAZIONE diretta (come lorazepam, oxazepam, temazepam): nessun metabolita attivo, sicuro nell'epatopatico e nell'anziano." },
  etizolam:{ sub:["3A4","2C9"], nota:"Tienodiazepina; insorgenza rapida e potenziale d'abuso." },
  estazolam:{ sub:["3A4"], nota:"Livelli aumentati dagli inibitori del 3A4." },
  clotiazepam:{ sub:["3A4"], nota:"Tienodiazepina a emivita breve-intermedia." },
  melatonina:{ sub:["1A2"], nota:"Metabolizzata dal CYP1A2: la FLUVOXAMINA (potente inibitore) ne aumenta molto i livelli — associazione da evitare; il fumo li riduce." },
  prazepam:{ sub:["3A4"], nota:"Profarmaco: attivo via nordazepam a lunga durata." },
  pinazepam:{ sub:["3A4"], nota:"Attivo via nordazepam a lunga durata." },
  nordazepam:{ sub:["3A4"], nota:"Metabolita attivo comune a molte benzodiazepine a lunga durata." },
  ketazolam:{ sub:["3A4"], nota:"Profarmaco a lunga durata (via diazepam/nordazepam)." },
  prometazina:{ sub:["2D6"], nota:"Somma del carico anticolinergico e sedativo con altri depressori del SNC." },
};

const CYP_META = {
  "1A2":  "Indotto dal fumo di sigaretta; inibito potentemente dalla fluvoxamina. Substrati chiave: clozapina, olanzapina, agomelatina, TCA.",
  "2B6":  "Via principale del bupropione.",
  "2C9":  "Inibito dal valproato; indotto dalla carbamazepina.",
  "2C19": "Coinvolto nel metabolismo di citalopram/escitalopram e sertralina.",
  "2D6":  "Polimorfico (metabolizzatori lenti/rapidi). Inibito potentemente da paroxetina e fluoxetina. Substrati: molti AP e TCA, venlafaxina, vortioxetina.",
  "3A4":  "Il CYP più abbondante. Indotto (forte) dalla carbamazepina; inibito da pompelmo e antimicotici azolici. Substrati: quetiapina, lurasidone, ziprasidone, aripiprazolo, alprazolam, triazolam, midazolam.",
};

// --- Alert di interazione clinicamente rilevanti (dal testo) ---
const INTER_ALERT = [
  { a: "Fluvoxamina", b: "Clozapina", eff: "↑ marcato dei livelli di clozapina (inibizione CYP1A2) → rischio di tossicità/convulsioni.", tipo: "grave" },
  { a: "Fluvoxamina", b: "Agomelatina", eff: "Controindicazione: inibizione del CYP1A2 → aumento importante dell’esposizione all’agomelatina.", tipo: "controindicato" },
  { a: "Sospensione del fumo", b: "Clozapina / Olanzapina", eff: "Perdita dell’induzione del CYP1A2 → ↑ livelli plasmatici; rivalutare la dose.", tipo: "grave" },
  { a: "Carbamazepina", b: "Farmaci CYP3A4-dipendenti", eff: "Forte induzione → ↓ efficacia (contraccettivi orali, molti AP e AD, ecc.).", tipo: "attenzione" },
  { a: "Valproato", b: "Lamotrigina", eff: "Inibizione della glicuronidazione → ↑ lamotrigina: dimezzare la titolazione (rischio cutaneo).", tipo: "attenzione" },
  { a: "IMAO", b: "Serotoninergici (SSRI/SNRI/TCA/triptani)", eff: "Rischio di sindrome serotoninergica. Rispettare i wash-out (in genere 2 settimane).", tipo: "controindicato" },
  { a: "Venlafaxina / Duloxetina", b: "IMAO", eff: "Controindicati: rispettare l’intervallo (7-14 gg dopo SNRI, 14 gg dopo IMAO).", tipo: "controindicato" },
  { a: "Litio", b: "Tiazidici / ACE-i / sartani / FANS", eff: "↑ litiemia (ridotta escrezione renale) → rischio di intossicazione.", tipo: "grave" },
  { a: "Litio", b: "Disidratazione / dieta iposodica", eff: "↑ litiemia. Attenzione a diarrea, vomito, sudorazione profusa, sport intenso.", tipo: "grave" },
  { a: "Bupropione", b: "Fluoxetina / Litio", eff: "↑ rischio convulsivo (abbassamento della soglia).", tipo: "attenzione" },
];

// --- Monitoraggio & TDM (dal testo) ---
const MONIT = {
  clozapina: "Emocromo settimanale nelle prime 18 settimane, poi mensile. Sospendere se leucociti <2000 o granulociti <1000. Livelli terapeutici 350-420 ng/ml (tossicità >750). Sorveglianza per miocardite nei primi mesi.",
  litio: "Litiemia a 12 h dalla dose: giorni 7-14-21-30, poi mensile per 6 mesi, poi trimestrale. Inoltre: creatinina, TSH/fT3/fT4, ECG, ecografia renale. Efficace 0,5-1,2 mEq/l; tossico >1,5 (letale >2,5).",
  valproato: "Livelli 50-100 mcg/ml (>125 tossico). Emocromo (piastrine), transaminasi, ammoniemia. Test di gravidanza obbligatorio (teratogeno).",
  carbamazepina: "Livelli 4-10 mcg/ml. Emocromo (leucopenia/piastrinopenia), sodiemia (SIADH), transaminasi. Forte induttore: rivalutare i farmaci associati.",
  lamotrigina: "Nessun livello di routine. Sorveglianza cutanea intensiva nelle prime 8 settimane (rash → Stevens-Johnson); titolazione lenta obbligatoria.",
  topiramato: "Nessun monitoraggio ematico di routine. Valutare bicarbonati (acidosi metabolica) e funzione renale (calcoli). Monitorare la litiemia se associato.",
  agomelatina: "Transaminasi a 0, 6, 12 e 24 settimane e a ogni aumento di dose; sospendere se >3x ULN.",
  mianserina: "Emocromo nelle prime 6 settimane (rischio di agranulocitosi).",
  mirtazapina: "Emocromo se compaiono febbre/faringite/segni di infezione (rara neutropenia).",
  amitriptilina: "Livelli plasmatici 75-200 ng/ml (tossico >1000). ECG basale (QTc) nel cardiopatico e alle dosi elevate.",
  clomipramina: "Livelli plasmatici 75-300 ng/ml. ECG basale nel cardiopatico; DOC a dosi piene (225-300 mg).",
  nortriptilina: "Livelli plasmatici 50-200 ng/ml (finestra terapeutica). ECG nel cardiopatico.",
  citalopram: "ECG (QTc) se cardiopatia, squilibri elettrolitici o dosi elevate (effetto dose-dipendente sul QT).",
  escitalopram: "ECG (QTc) nei soggetti a rischio; effetto sul QT minore del citalopram.",
  olanzapina: "Monitoraggio metabolico: peso/BMI, circonferenza vita, glicemia, profilo lipidico (baseline, 12 settimane, poi annuale).",
  quetiapina: "Monitoraggio metabolico (peso, glicemia, lipidi). ↑QT dose-dipendente: cautela nei soggetti a rischio.",
  risperidone: "Prolattinemia se sintomi (galattorrea, amenorrea, disfunzioni sessuali). Monitoraggio metabolico.",
  ziprasidone: "ECG (QTc): non superare 160 mg/die. Assumere sempre ai pasti.",
  aloperidolo: "ECG (QTc), sptt. per via parenterale (ev non più autorizzata dal 2007). Sorveglianza per EPS e discinesia tardiva.",
};

// --- Glossario (sigle ricorrenti) ---
const GLOSSARIO = [
  { s: "AIFA", d: "Agenzia Italiana del Farmaco" },
  { s: "RCP", d: "Riassunto delle Caratteristiche del Prodotto (scheda tecnica)" },
  { s: "EMA / FDA", d: "Agenzia regolatoria europea / statunitense" },
  { s: "TDM", d: "Therapeutic Drug Monitoring (dosaggio plasmatico terapeutico)" },
  { s: "EPS", d: "Sintomi extrapiramidali (distonia, acatisia, parkinsonismo, discinesia)" },
  { s: "LAI", d: "Long-Acting Injectable (antipsicotico depot)" },
  { s: "RI / RP / RM", d: "Rilascio Immediato / Prolungato / Modificato" },
  { s: "MARTA", d: "Multi-Acting Receptor Targeted Antipsychotic (clozapina, olanzapina, quetiapina, ecc.)" },
  { s: "SSRI / SNRI", d: "Inibitori selettivi del reuptake della serotonina / della serotonina-noradrenalina" },
  { s: "TCA", d: "Antidepressivi triciclici" },
  { s: "IMAO", d: "Inibitori delle monoaminossidasi" },
  { s: "NaSSA", d: "Noradrenergic and Specific Serotonergic Antidepressant (mirtazapina)" },
  { s: "SARI", d: "Serotonin Antagonist and Reuptake Inhibitor (trazodone)" },
  { s: "NARI", d: "Inibitore selettivo del reuptake della noradrenalina (reboxetina)" },
  { s: "DOC", d: "Disturbo ossessivo-compulsivo" },
  { s: "DAP", d: "Disturbo da attacchi di panico" },
  { s: "GAD", d: "Disturbo d’ansia generalizzato" },
  { s: "DPTS", d: "Disturbo post-traumatico da stress" },
  { s: "SIADH", d: "Sindrome da inappropriata secrezione di ADH (iponatriemia)" },
  { s: "PDSS", d: "Post-injection Delirium/Sedation Syndrome (olanzapina depot)" },
  { s: "s. serotoninergica", d: "Sindrome da eccesso serotoninergico (ipertermia, mioclono, agitazione)" },
  { s: "s. maligna", d: "Sindrome maligna da neurolettici (rigidità, ipertermia, ↑CK)" },
  { s: "CYP", d: "Citocromo P450 (enzimi del metabolismo epatico)" },
  { s: "QTc", d: "Intervallo QT corretto per la frequenza cardiaca (ECG)" },
  { s: "mEq / mmol", d: "Milliequivalenti / millimoli (per il litio: 1 mEq Li+ = 1 mmol)" },
  { s: "ng/ml · mcg/ml", d: "Unità dei livelli plasmatici (1 mcg/ml = 1000 ng/ml)" },
  { s: "ULN", d: "Upper Limit of Normal (limite superiore di norma)" },
  { s: "ODV", d: "O-demetilvenlafaxina (metabolita attivo della venlafaxina)" },
  { s: "m-CPP", d: "meta-clorofenilpiperazina (metabolita del trazodone)" },
];

// --- Righe della tabella di confronto ---
const RIGHE = [
  { key: "clsLabel", label: "Classe · sottoclasse" },
  { key: "com", label: "Nomi commerciali / formulazioni", mono: true },
  { key: "mecc", label: "Meccanismo d’azione" },
  { key: "rec", label: "Profilo recettoriale", rec: true },
  { key: "risk", label: "Profili di rischio", risk: true },
  { key: "ind", label: "Indicazioni (da testo)" },
  { key: "pos", label: "Posologia / range", mono: true },
  { key: "emi", label: "Emivita · cinetica", mono: true },
  { key: "met", label: "Metabolismo (CYP)" },
  { key: "eff", label: "Effetti collaterali" },
  { key: "avv", label: "Avvertenze / controindicazioni" },
  { key: "note", label: "Note cliniche" },
];

/* =========================================================================
   COMPONENTI GRAFICI
   ========================================================================= */

// Formattazione numerica in stile italiano, con troncamento intelligente
function fmt(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  let s;
  if (n === 0) s = "0";
  else if (Math.abs(n) < 0.01) s = n.toPrecision(2);
  else if (Math.abs(n) < 1) s = (Math.round(n * 1000) / 1000).toString();
  else s = (Math.round(n * 100) / 100).toString();
  return s.replace(".", ",");
}

// Colore sequenziale per livello di rischio ordinale (0–3)
const RISK_SCALA = ["#7C9093", "#6FA39B", "#D2963A", "#C0472E"];
function riskColor(v) {
  return RISK_SCALA[v] || "#7C9093";
}
// Riempimento progressivo: la barra attraversa la scala cromatica fino al livello raggiunto,
// così livelli diversi si distinguono sia per lunghezza sia per colore.
function riskGradient(v) {
  if (!v) return RISK_SCALA[0];
  const stops = RISK_SCALA.slice(0, v + 1).join(", ");
  return "linear-gradient(90deg, " + stops + ")";
}

function polarXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

// Radar recettoriale — accetta una o più serie {rec, color, label}
function Radar({ series, size = 200 }) {
  const clean = (series || []).filter((s) => s.rec && Object.keys(s.rec).length);
  if (clean.length === 0) return null;
  const sites = [...new Set(clean.flatMap((s) => Object.keys(s.rec)))];
  const N = sites.length;
  if (N < 3) {
    // Con meno di 3 assi il radar non è leggibile: barrette orizzontali
    return (
      <div className="cpf-minirec">
        {sites.map((site) => (
          <div key={site} className="cpf-mrrow">
            <span className="cpf-mrlabel">{site}</span>
            {clean.map((s, i) => (
              <span key={i} className="cpf-mrbar" style={{ background: s.color, width: `${((s.rec[site] || 0) / 4) * 60 + 4}px` }} />
            ))}
          </div>
        ))}
      </div>
    );
  }
  const cx = size / 2, cy = size / 2, R = size / 2 - 30;
  const grid = [1, 2, 3, 4];
  const axisPts = sites.map((_, i) => polarXY(cx, cy, R, (i * 360) / N));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="cpf-radar" role="img" aria-label="Profilo recettoriale">
      {grid.map((g) => {
        const pts = sites.map((_, i) => polarXY(cx, cy, (R * g) / 4, (i * 360) / N).join(",")).join(" ");
        return <polygon key={g} points={pts} className="cpf-radar-grid" />;
      })}
      {axisPts.map((p, i) => (
        <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} className="cpf-radar-axis" />
      ))}
      {clean.map((s, si) => {
        const pts = sites.map((site, i) => polarXY(cx, cy, (R * (s.rec[site] || 0)) / 4, (i * 360) / N).join(",")).join(" ");
        return (
          <polygon key={si} points={pts} fill={s.color} fillOpacity={clean.length > 1 ? 0.14 : 0.22} stroke={s.color} strokeWidth="1.8" />
        );
      })}
      {clean.map((s, si) =>
        sites.map((site, i) => {
          const [x, y] = polarXY(cx, cy, (R * (s.rec[site] || 0)) / 4, (i * 360) / N);
          return <circle key={si + "-" + i} cx={x} cy={y} r="2.1" fill={s.color} />;
        })
      )}
      {sites.map((site, i) => {
        const [x, y] = polarXY(cx, cy, R + 14, (i * 360) / N);
        return (
          <text key={site} x={x} y={y} className="cpf-radar-label"
            textAnchor={Math.abs(x - cx) < 6 ? "middle" : x > cx ? "start" : "end"}
            dominantBaseline="middle">
            {site}
          </text>
        );
      })}
    </svg>
  );
}

// Barre di rischio segmentate (ordinali 0–3)
function RiskBars({ risk, dims, compact = false }) {
  if (!risk) return <span className="cpf-dash">—</span>;
  let entries = (dims || RISK_DIMS).filter((d) => risk[d.key] !== undefined);
  if (entries.length === 0) return <span className="cpf-dash">—</span>;
  if (compact) entries = [...entries].sort((a, b) => risk[b.key] - risk[a.key]).slice(0, 3);
  return (
    <div className={"cpf-riskbars" + (compact ? " cpf-riskbars-c" : "")}>
      {entries.map((d) => {
        const v = risk[d.key];
        return (
          <div key={d.key} className="cpf-rbrow" title={`${d.label}: ${RISK_LIV[v]}`}>
            <span className="cpf-rblabel">{d.short}</span>
            <span className="cpf-rbseg">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={"cpf-seg" + (i <= v ? " cpf-seg-on" : "")} style={{ background: i <= v ? riskColor(i) : "var(--seg-empty)" }} />
              ))}
            </span>
            {!compact && <span className="cpf-rbval" style={{ color: riskColor(v) }}>{RISK_LIV[v]}</span>}
          </div>
        );
      })}
    </div>
  );
}

// Barra orizzontale generica (classifiche / scala di equivalenza)
function Bar({ frac, color, children, valore }) {
  return (
    <div className="cpf-barrow">
      <div className="cpf-barlabel">{children}</div>
      <div className="cpf-bartrack">
        <div className="cpf-barfill" style={{ width: `${Math.max(2, Math.min(100, frac * 100))}%`, background: color }} />
      </div>
      {valore !== undefined && <div className="cpf-barval">{valore}</div>}
    </div>
  );
}

// Dot-strip recettoriale (compatto, per la tabella di confronto)
function DotStrip({ rec, color }) {
  if (!rec || Object.keys(rec).length === 0) return <span className="cpf-dash">—</span>;
  return (
    <div className="cpf-recwrap">
      {Object.entries(rec).map(([sito, v]) => (
        <div key={sito} className="cpf-recrow">
          <span className="cpf-reclabel">{sito}</span>
          <span className="cpf-dots">
            {[0, 1, 2, 3].map((i) => {
              const full = v >= i + 1, half = !full && v >= i + 0.5;
              return <span key={i} className="cpf-dot" style={{ background: full || half ? color : "transparent", borderColor: color, opacity: half ? 0.4 : 1 }} />;
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================================================================
   APP PRINCIPALE
   ========================================================================= */

/* ---- Indicazioni on-label (registrate, tipica autorizzazione AIFA/RCP) e off-label (usi consolidati) ---- */
const INDICAZIONI = {
  // ===== ANTIPSICOTICI TIPICI =====
  clorpromazina:{ on:["Schizofrenia e stati psicotici","Stati di agitazione psicomotoria","Singhiozzo intrattabile","Nausea e vomito"], off:["Delirium iperattivo (uso ospedaliero)"] },
  levomepromazina:{ on:["Psicosi con agitazione","Dolore severo e sedazione in cure palliative"], off:["Nausea/agitazione nella fase terminale (palliazione)"] },
  promazina:{ on:["Agitazione psicomotoria","Stati confusionali dell'anziano"], off:[] },
  perfenazina:{ on:["Schizofrenia e stati psicotici","Nausea e vomito severi"], off:[] },
  aloperidolo:{ on:["Schizofrenia e psicosi acute e croniche","Agitazione psicomotoria","Deliri e allucinazioni","Tic e sindrome di Tourette","Nausea e vomito"], off:["Delirium (basse dosi)","Nausea in cure palliative"] },
  pimozide:{ on:["Schizofrenia cronica","Disturbo delirante","Sindrome di Tourette"], off:[] },
  zuclopentixolo:{ on:["Schizofrenia e psicosi acute/croniche (orale, acetato, depot)"], off:["Agitazione acuta (acetato)"] },
  tiapride:{ on:["Discinesie","Agitazione e aggressività (anziano, alcolista)","Corea"], off:["Sindrome da astinenza alcolica"] },
  clotiapina:{ on:["Stati psicotici acuti e cronici","Agitazione","Insonnia in ambito psichiatrico"], off:["Insonnia grave (uso specialistico)"] },
  loxapina:{ on:["Schizofrenia","Agitazione acuta nella schizofrenia/bipolare (formulazione inalatoria)"], off:[] },
  flufenazina:{ on:["Schizofrenia e psicosi (orale e depot decanoato)"], off:[] },
  flupentixolo:{ on:["Schizofrenia e psicosi croniche (orale e depot)","Stati ansioso-depressivi (basse dosi)"], off:[] },
  bromperidolo:{ on:["Psicosi schizofreniche","Deliri e allucinazioni"], off:[] },
  // ===== ANTIPSICOTICI ATIPICI =====
  clozapina:{ on:["Schizofrenia resistente al trattamento","Riduzione del rischio suicidario ricorrente nella schizofrenia","Psicosi nella malattia di Parkinson (dopo fallimento di altri)"], off:["Disturbo bipolare resistente","Aggressività resistente"] },
  olanzapina:{ on:["Schizofrenia","Episodio maniacale da moderato a grave","Prevenzione delle recidive nel disturbo bipolare"], off:["Nausea/vomito da chemioterapia","Anoressia nervosa (recupero ponderale)","Delirium","Insonnia (basse dosi)"] },
  quetiapina:{ on:["Schizofrenia","Disturbo bipolare (mania, depressione bipolare, mantenimento)","Terapia aggiuntiva negli episodi depressivi maggiori (RP)"], off:["Insonnia (basse dosi — uso controverso)","Disturbo d'ansia generalizzato","Delirium"] },
  risperidone:{ on:["Schizofrenia","Episodio maniacale","Irritabilità/aggressività persistente nel disturbo della condotta e nell'autismo (breve termine)"], off:["Delirium","Tic","DOC in augmentation","Aggressività nella demenza (breve termine, cautela)"] },
  paliperidone:{ on:["Schizofrenia","Disturbo schizoaffettivo","Mantenimento con formulazioni LAI (mensile, trimestrale, semestrale)"], off:[] },
  ziprasidone:{ on:["Schizofrenia","Episodio maniacale"], off:[] },
  asenapina:{ on:["Episodio maniacale da moderato a grave nel bipolare I"], off:["Schizofrenia (registrazione variabile)"] },
  lurasidone:{ on:["Schizofrenia","Depressione bipolare"], off:[] },
  amisulpride:{ on:["Schizofrenia (sintomi positivi e/o negativi)"], off:["Distimia/depressione (basse dosi)","Nausea (basse dosi)"] },
  levosulpiride:{ on:["Psicosi","Dispepsia funzionale e disturbi della motilità gastrica (basse dosi)","Cefalea"], off:["Somatizzazioni"] },
  sulpiride:{ on:["Psicosi","Stati depressivi con inibizione, vertigini (basse dosi)"], off:["Somatizzazioni","Dispepsia funzionale"] },
  aripiprazolo:{ on:["Schizofrenia","Disturbo bipolare I (mania e mantenimento)","Formulazione LAI mensile"], off:["Terapia aggiuntiva nella depressione maggiore","DOC in augmentation","Tic/Tourette","Irritabilità nell'autismo","Iperprolattinemia da altri antipsicotici"] },
  cariprazina:{ on:["Schizofrenia","Episodi maniacali/misti e depressivi del disturbo bipolare I"], off:["Depressione maggiore in augmentation"] },
  brexpiprazolo:{ on:["Schizofrenia","Terapia aggiuntiva nella depressione maggiore (dove registrato)"], off:["Agitazione nella demenza di Alzheimer"] },
  sertindolo:{ on:["Schizofrenia (in pazienti intolleranti ad almeno un altro antipsicotico)"], off:[] },
  // ===== STABILIZZANTI DELL'UMORE =====
  litio:{ on:["Disturbo bipolare: episodio maniacale e profilassi","Profilassi della depressione ricorrente"], off:["Augmentation antidepressiva nella depressione resistente","Riduzione del rischio suicidario","Cefalea a grappolo"] },
  valproato:{ on:["Epilessia","Episodio maniacale nel bipolare quando il litio è controindicato/non tollerato"], off:["Profilassi del disturbo bipolare","Profilassi dell'emicrania","Aggressività/discontrollo degli impulsi"] },
  carbamazepina:{ on:["Epilessia","Nevralgia del trigemino","Disturbo bipolare (mania e profilassi) in alternativa al litio","Sindrome da astinenza alcolica"], off:["Aggressività","Dolore neuropatico"] },
  oxcarbazepina:{ on:["Epilessia"], off:["Disturbo bipolare (mania/profilassi)","Dolore neuropatico"] },
  lamotrigina:{ on:["Epilessia","Prevenzione degli episodi depressivi nel disturbo bipolare I"], off:["Depressione bipolare (fase acuta)","Depressione unipolare resistente in augmentation"] },
  topiramato:{ on:["Epilessia","Profilassi dell'emicrania"], off:["Disturbo da alimentazione incontrollata/bulimia","Dipendenza da alcol","Controllo del peso indotto da antipsicotici"] },
  // ===== ANTIDEPRESSIVI =====
  amitriptilina:{ on:["Episodi depressivi maggiori","Dolore neuropatico (dove registrato)","Enuresi notturna nel bambino"], off:["Profilassi dell'emicrania","Cefalea tensiva","Fibromialgia","Insonnia (basse dosi)"] },
  clomipramina:{ on:["Depressione","Disturbo ossessivo-compulsivo","Fobie e attacchi di panico","Cataplessia associata a narcolessia"], off:["Dolore cronico"] },
  nortriptilina:{ on:["Depressione"], off:["Dolore neuropatico","Profilassi dell'emicrania","Cessazione del fumo"] },
  imipramina:{ on:["Depressione","Enuresi notturna nel bambino"], off:["Attacchi di panico","Dolore neuropatico"] },
  trimipramina:{ on:["Depressione (con insonnia/ansia)"], off:["Insonnia"] },
  trazodone:{ on:["Depressione con o senza componente ansiosa"], off:["Insonnia (uso molto diffuso, basse dosi)","Agitazione nella demenza"] },
  citalopram:{ on:["Depressione","Disturbo di panico"], off:["DOC","Disturbo d'ansia sociale"] },
  escitalopram:{ on:["Depressione","Disturbo di panico","Disturbo d'ansia generalizzato","Disturbo d'ansia sociale","DOC"], off:["PTSD","Disturbo disforico premestruale"] },
  fluoxetina:{ on:["Depressione","DOC","Bulimia nervosa"], off:["Disturbo disforico premestruale","Attacchi di panico","PTSD"] },
  fluvoxamina:{ on:["Depressione","DOC"], off:["Disturbo d'ansia sociale","Attacchi di panico","PTSD"] },
  paroxetina:{ on:["Depressione","DOC","Disturbo di panico","Disturbo d'ansia sociale","Disturbo d'ansia generalizzato","PTSD"], off:["Disturbo disforico premestruale","Vampate"] },
  sertralina:{ on:["Depressione","DOC","Disturbo di panico","PTSD","Disturbo d'ansia sociale","Disturbo disforico premestruale"], off:["Disturbo d'ansia generalizzato"] },
  venlafaxina:{ on:["Depressione","Disturbo d'ansia generalizzato","Disturbo d'ansia sociale","Disturbo di panico"], off:["Dolore neuropatico","Vampate","PTSD"] },
  duloxetina:{ on:["Depressione","Disturbo d'ansia generalizzato","Dolore neuropatico diabetico","Incontinenza urinaria da sforzo"], off:["Fibromialgia","Dolore cronico muscoloscheletrico"] },
  desvenlafaxina:{ on:["Depressione maggiore"], off:["Vampate"] },
  mirtazapina:{ on:["Episodi depressivi maggiori"], off:["Insonnia","Stimolazione dell'appetito","Nausea","Ansia (augmentation)"] },
  mianserina:{ on:["Depressione"], off:["Insonnia"] },
  reboxetina:{ on:["Depressione"], off:[] },
  desipramina:{ on:["Depressione"], off:["Dolore neuropatico","ADHD"] },
  dotiepina:{ on:["Depressione con ansia"], off:["Dolore cronico","Insonnia"] },
  maprotilina:{ on:["Depressione"], off:[] },
  bupropione:{ on:["Depressione","Cessazione del fumo (formulazione dedicata)"], off:["ADHD","Disfunzione sessuale da SSRI (augmentation)","Astenia/apatia"] },
  agomelatina:{ on:["Episodi depressivi maggiori"], off:[] },
  vortioxetina:{ on:["Episodi depressivi maggiori"], off:["Depressione con disfunzione cognitiva (profilo pro-cognitivo)"] },
  tianeptina:{ on:["Episodi depressivi maggiori (dove registrata)"], off:[] },
  esketamina:{ on:["Depressione resistente al trattamento (add-on a SSRI/SNRI)","Emergenza psichiatrica nella depressione maggiore"], off:[] },
  imao:{ on:["Depressione atipica/resistente","Fobia sociale (storicamente)"], off:[] },
  fenelzina:{ on:["Depressione (spec. atipica/resistente)","Fobia sociale (storicamente)"], off:[] },
  tranilcipromina:{ on:["Depressione resistente/atipica (storicamente)"], off:[] },
  moclobemide:{ on:["Depressione","Fobia sociale (storicamente)"], off:[] },
  // ===== ANSIOLITICI / IPNOTICI =====
  diazepam:{ on:["Ansia","Agitazione","Spasmi muscolari","Convulsioni e stato epilettico","Astinenza alcolica","Premedicazione anestesiologica"], off:["Vertigini"] },
  lorazepam:{ on:["Ansia","Insonnia associata ad ansia","Premedicazione","Stato epilettico (ev)"], off:["Astinenza alcolica","Catatonia","Agitazione acuta"] },
  alprazolam:{ on:["Ansia","Disturbo di panico"], off:[] },
  bromazepam:{ on:["Ansia"], off:[] },
  clonazepam:{ on:["Epilessia","Disturbo di panico (in alcune sedi)"], off:["Ansia","Acatisia","Disturbo comportamentale del sonno REM","Mioclono"] },
  delorazepam:{ on:["Ansia","Insonnia"], off:["Astinenza alcolica"] },
  clordiazepossido:{ on:["Ansia","Sindrome da astinenza alcolica"], off:[] },
  estazolam:{ on:["Insonnia"], off:[] },
  brotizolam:{ on:["Insonnia (breve termine)"], off:[] },
  prazepam:{ on:["Ansia e tensione emotiva"], off:[] },
  pinazepam:{ on:["Ansia","Insonnia"], off:[] },
  nordazepam:{ on:["Ansia e tensione emotiva"], off:[] },
  ketazolam:{ on:["Ansia"], off:[] },
  oxazepam:{ on:["Ansia","Insonnia","Astinenza alcolica (utile nell'epatopatico)"], off:[] },
  temazepam:{ on:["Insonnia"], off:[] },
  lormetazepam:{ on:["Insonnia"], off:[] },
  triazolam:{ on:["Insonnia (breve termine)"], off:[] },
  flurazepam:{ on:["Insonnia"], off:[] },
  nitrazepam:{ on:["Insonnia","Alcune forme di epilessia"], off:[] },
  flunitrazepam:{ on:["Insonnia grave (uso ristretto)"], off:[] },
  midazolam:{ on:["Sedazione procedurale e anestesia","Stato epilettico (buccale nel bambino)"], off:[] },
  etizolam:{ on:["Ansia e insonnia (disturbi d'ansia con sintomi somatici)"], off:[] },
  clotiazepam:{ on:["Ansia"], off:[] },
  buspirone:{ on:["Disturbo d'ansia generalizzato"], off:["Augmentation degli SSRI","Discinesia tardiva"] },
  idrossizina:{ on:["Ansia e tensione emotiva","Prurito/orticaria","Premedicazione"], off:["Insonnia"] },
  gabapentin:{ on:["Epilessia (add-on)","Dolore neuropatico"], off:["Ansia","Astinenza (alcol/benzodiazepine)","Insonnia","Vampate","Prurito"] },
  pregabalin:{ on:["Disturbo d'ansia generalizzato","Dolore neuropatico","Epilessia (add-on)"], off:["Astinenza","Insonnia"] },
  zolpidem:{ on:["Insonnia (breve termine)"], off:[] },
  zopiclone:{ on:["Insonnia (breve termine)"], off:[] },
  zaleplon:{ on:["Insonnia con difficoltà di addormentamento (breve termine)"], off:[] },
  daridorexant:{ on:["Insonnia nell'adulto"], off:[] },
  melatonina:{ on:["Insonnia (formulazione a rilascio prolungato, ≥55 anni)"], off:["Jet lag","Disturbi del ritmo circadiano","Insonnia nel bambino/neurosviluppo"] },
  // ===== ADHD / STIMOLANTI =====
  metilfenidato:{ on:["ADHD (≥6 anni, programma multimodale)","Narcolessia"], off:["Depressione resistente/apatia (anziano, cure palliative)"] },
  lisdexamfetamina:{ on:["ADHD (≥6 anni)"], off:["Disturbo da alimentazione incontrollata (on-label dove registrato)"] },
  atomoxetina:{ on:["ADHD (bambini ≥6 anni, adolescenti e adulti)"], off:[] },
  guanfacina:{ on:["ADHD (6-17 anni)"], off:["Tic","PTSD (iperarousal)"] },
  modafinil:{ on:["Narcolessia con eccessiva sonnolenza diurna"], off:["Sonnolenza da altre cause","Augmentation antidepressiva (fatica/ipersonnia)"] },
  // ===== DIPENDENZE / CRAVING =====
  naltrexone:{ on:["Dipendenza da alcol (mantenimento dell'astinenza)","Dipendenza da oppioidi (dopo disintossicazione)"], off:["Gioco d'azzardo patologico e altri comportamenti di dipendenza"] },
  acamprosato:{ on:["Mantenimento dell'astinenza da alcol"], off:[] },
  disulfiram:{ on:["Mantenimento dell'astinenza da alcol (deterrenza)"], off:["Dipendenza da cocaina (evidenze limitate)"] },
  nalmefene:{ on:["Riduzione del consumo di alcol (dipendenza ad alto rischio)"], off:[] },
  vareniclina:{ on:["Cessazione del fumo di tabacco"], off:[] },
  // ===== COGNITIVI / ANTIDEMENZA =====
  donepezil:{ on:["Malattia di Alzheimer di grado lieve-moderato-severo"], off:["Demenza vascolare","Demenza a corpi di Lewy","Demenza nella malattia di Parkinson"] },
  rivastigmina:{ on:["Alzheimer lieve-moderato","Demenza nella malattia di Parkinson"], off:["Demenza a corpi di Lewy"] },
  galantamina:{ on:["Malattia di Alzheimer di grado lieve-moderato"], off:["Demenza vascolare"] },
  memantina:{ on:["Malattia di Alzheimer di grado moderato-severo"], off:["Demenza vascolare","Agitazione nella demenza"] },
  prometazina:{ on:["Reazioni allergiche","Nausea e vomito","Sedazione/premedicazione","Insonnia occasionale"], off:["Tranquillizzazione rapida dell'agitazione (associata ad aloperidolo im)"] },
  metadone:{ on:["Terapia sostitutiva di mantenimento nella dipendenza da oppioidi","Dolore cronico severo"], off:["Disintossicazione da oppioidi (scalaggio)"] },
  buprenorfina:{ on:["Terapia sostitutiva della dipendenza da oppioidi","Dolore cronico (formulazioni dedicate)"], off:[] },
  penfluridolo:{ on:["Schizofrenia e psicosi croniche (mantenimento, dose settimanale)"], off:[] },
  periciazina:{ on:["Disturbi del comportamento con aggressività e impulsività","Stati psicotici","Agitazione"], off:["Disregolazione comportamentale nel disturbo di personalità"] },
  tioridazina:{ on:["Storicamente: psicosi e agitazione (ritirata dal commercio)"], off:[] },
  droperidolo:{ on:["Nausea e vomito postoperatori"], off:["Sedazione rapida dell'agitazione (uso ospedaliero)"] },
  clobazam:{ on:["Ansia","Epilessia (terapia aggiuntiva)"], off:["Insonnia","Catatonia"] },
  quazepam:{ on:["Insonnia"], off:[] },
  clometiazolo:{ on:["Sindrome da astinenza alcolica","Agitazione e insonnia nell'anziano"], off:[] },
  ademetionina:{ on:["Stati depressivi","Sindromi depressive con componente somatica","Epatopatie colestatiche"], off:["Augmentation antidepressiva"] },
  iperico:{ on:["Depressione lieve-moderata (fitoterapico/integratore)"], off:[] },
  oxibato:{ on:["Sindrome da astinenza alcolica e mantenimento dell'astinenza (coadiuvante)","Narcolessia con cataplessia"], off:[] },
  baclofene:{ on:["Spasticità di origine spinale o cerebrale"], off:["Dipendenza da alcol (riduzione del craving), anche ad alte dosi"] },
  biperidene:{ on:["Sintomi extrapiramidali da neurolettici (distonia acuta, parkinsonismo)","Parkinsonismo"], off:["Scialorrea da clozapina"] },
  triesifenidile:{ on:["Parkinsonismo iatrogeno","Parkinsonismo"], off:[] },
  amantadina:{ on:["Parkinsonismo","Discinesie"], off:["Fatica e apatia","Iperprolattinemia da antipsicotici","Sintomi extrapiramidali iatrogeni"] },
  propranololo:{ on:["Ipertensione","Tremore essenziale","Profilassi dell'emicrania"], off:["Acatisia da neurolettici","Ansia da prestazione","Tremore da litio","Aggressività"] },
  clonidina:{ on:["Ipertensione"], off:["Astinenza da oppioidi (sintomi autonomici)","ADHD e tic","Iperarousal nel PTSD","Acatisia"] },
  naloxone:{ on:["Overdose da oppioidi (antidoto)","Diagnosi differenziale del coma da oppioidi"], off:[] },
  flumazenil:{ on:["Reversione della sedazione da benzodiazepine","Intossicazione da benzodiazepine (casi selezionati)"], off:[] },
  tiamina:{ on:["Prevenzione e trattamento dell'encefalopatia di Wernicke","Carenza vitaminica nell'alcolismo e nella malnutrizione"], off:[] },
  ciproeptadina:{ on:["Allergie","Stimolazione dell'appetito"], off:["Sindrome serotoninergica (antidoto)","Disfunzione sessuale da SSRI","Incubi nel PTSD"] },
};

/* ---- Ri-somministrazione AL BISOGNO (PRN) ----
   Intervallo = tempo minimo prima di poter ripetere la dose.
   Valori orientativi da RCP e pratica clinica: la prescrizione PRN va sempre
   individualizzata (dose, intervallo, tetto/24h, rivalutazione). uso: agit|ansia|insonnia */
const PRN = {
  // ===== AGITAZIONE PSICOMOTORIA ACUTA =====
  aloperidolo:{ uso:"agit", via:"im (os in gocce)", dose:"2,5–5 mg im", intervallo:"ogni 4–6 h", max:"≈ 15–20 mg/24h (individualizzare)", note:"Spesso associato a lorazepam ± prometazina. Monitorare QTc e distonia acuta/EPS; nell'agitazione grave rivalutazione anche più ravvicinata solo in setting monitorato." },
  promazina:{ uso:"agit", via:"im / gocce os", dose:"25–50 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Sedativo; ipotensione ortostatica." },
  clorpromazina:{ uso:"agit", via:"im / os", dose:"25–50 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Marcata ipotensione ortostatica; controllare PA. Sedazione importante." },
  levomepromazina:{ uso:"agit", via:"im / os", dose:"25 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Molto sedativo; usato anche in cure palliative." },
  clotiapina:{ uso:"agit", via:"os / im", dose:"40 mg", intervallo:"ogni 8–12 h", max:"individualizzare", note:"Molto sedativo; impiegato anche per insonnia grave in ambito specialistico." },
  tiapride:{ uso:"agit", via:"im / os", dose:"100 mg", intervallo:"ogni 8 h", max:"≈ 300–400 mg/24h", note:"Agitazione/aggressività nell'anziano e nell'alcolista; migliore tollerabilità EPS." },
  olanzapina:{ uso:"agit", via:"im rapida / os orodispersibile", dose:"5–10 mg im", intervallo:"≥ 2 h alla 2ª dose, ≥ 4 h alla 3ª", max:"3 iniezioni o ≤ 20 mg/24h (incluse le dosi orali)", note:"NON associare l'olanzapina im a benzodiazepine parenterali entro 1 h: rischio di depressione cardiorespiratoria e ipotensione." },
  aripiprazolo:{ uso:"agit", via:"im ad azione rapida", dose:"5,25–9,75 mg", intervallo:"≥ 2 h", max:"≈ 30 mg/24h", note:"Meno sedativo: utile quando si vuole evitare eccessiva sedazione." },
  ziprasidone:{ uso:"agit", via:"im", dose:"10–20 mg", intervallo:"10 mg ogni 2 h oppure 20 mg ogni 4 h", max:"40 mg/24h", note:"Monitorare QTc; durata massima consigliata 3 giorni consecutivi." },
  loxapina:{ uso:"agit", via:"inalatoria (Adasuve)", dose:"9,1 mg", intervallo:"eventuale 2ª dose dopo ≥ 2 h", max:"2 somministrazioni/24h", note:"Solo agitazione lieve-moderata nel paziente collaborante; broncodilatatore disponibile (rischio di broncospasmo)." },
  // ===== ANSIA ACUTA =====
  lorazepam:{ uso:"ansia", via:"os / im (ev in setting monitorato)", dose:"1–2,5 mg", intervallo:"ogni 4–6 h", max:"≈ 7,5–10 mg/24h (individualizzare)", note:"Benzodiazepina di scelta al bisogno: emivita intermedia, nessun metabolita attivo, assorbimento im affidabile." },
  diazepam:{ uso:"ansia", via:"os / ev (im sconsigliato: assorbimento erratico)", dose:"5–10 mg", intervallo:"ogni 4–6 h", max:"individualizzare", note:"Emivita lunga con metaboliti attivi (nordazepam): rischio di accumulo con dosi ripetute, cautela nell'anziano." },
  delorazepam:{ uso:"ansia", via:"os / gocce", dose:"0,5–2 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Lunga durata d'azione: accumulo con somministrazioni ripetute." },
  bromazepam:{ uso:"ansia", via:"os / gocce", dose:"1,5–3 mg", intervallo:"ogni 8 h", max:"individualizzare", note:"Ansia acuta; sedazione." },
  alprazolam:{ uso:"ansia", via:"os", dose:"0,25–0,5 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Insorgenza rapida ma emivita breve → possibile ansia/rimbalzo interdose; nel panico è preferibile lo schema fisso." },
  clotiazepam:{ uso:"ansia", via:"os", dose:"5 mg", intervallo:"ogni 8 h", max:"individualizzare", note:"Emivita breve-intermedia." },
  etizolam:{ uso:"ansia", via:"os", dose:"0,5 mg", intervallo:"ogni 8 h", max:"individualizzare", note:"Insorgenza rapida; potenziale d'abuso." },
  oxazepam:{ uso:"ansia", via:"os", dose:"15 mg", intervallo:"ogni 6–8 h", max:"individualizzare", note:"Solo glicuronazione: utile nell'epatopatico e nell'anziano." },
  idrossizina:{ uso:"ansia", via:"os / im", dose:"25–50 mg", intervallo:"ogni 6–8 h", max:"100 mg/24h", note:"Ansiolitico non benzodiazepinico (antistaminico): nessuna dipendenza; attenzione al QT ad alte dosi." },
  midazolam:{ uso:"ansia", via:"im / buccale", dose:"secondo peso e indicazione", intervallo:"solo in setting monitorato (sedazione/convulsioni)", max:"individualizzare", note:"Emivita ultrabreve; uso in ambiente controllato (sedazione procedurale, stato epilettico)." },
  // ===== INSONNIA (dose serale, non ripetibile nella stessa notte) =====
  zolpidem:{ uso:"insonnia", via:"os", dose:"10 mg (5 mg anziano/donna)", intervallo:"1 dose serale — NON ripetere nella stessa notte", max:"10 mg/24h", note:"Assumere subito prima di coricarsi; rischio di comportamenti automatici notturni." },
  zopiclone:{ uso:"insonnia", via:"os", dose:"7,5 mg (3,75 mg anziano)", intervallo:"1 dose serale — non ripetere", max:"7,5 mg/24h", note:"Sapore metallico frequente." },
  zaleplon:{ uso:"insonnia", via:"os", dose:"10 mg", intervallo:"1 dose serale; per risvegli precoci solo se restano ≥ 4 h di sonno", max:"10 mg/24h", note:"Emivita ultrabreve: minimo hangover." },
  triazolam:{ uso:"insonnia", via:"os", dose:"0,125–0,25 mg", intervallo:"1 dose serale — non ripetere", max:"0,25 mg/24h", note:"Emivita molto breve; possibile amnesia anterograda e rimbalzo." },
  lormetazepam:{ uso:"insonnia", via:"os / gocce", dose:"1 mg (0,5 mg anziano)", intervallo:"1 dose serale — non ripetere", max:"1 mg/24h", note:"Ipnoinducente a durata intermedia." },
  temazepam:{ uso:"insonnia", via:"os", dose:"10–20 mg", intervallo:"1 dose serale — non ripetere", max:"20 mg/24h", note:"Buona opzione per il mantenimento del sonno." },
  flurazepam:{ uso:"insonnia", via:"os", dose:"15–30 mg", intervallo:"1 dose serale — non ripetere", max:"30 mg/24h", note:"Emivita lunga (metaboliti attivi): hangover e accumulo, sconsigliato nell'anziano." },
  nitrazepam:{ uso:"insonnia", via:"os", dose:"5 mg", intervallo:"1 dose serale — non ripetere", max:"individualizzare", note:"Lunga durata; sedazione residua diurna." },
  flunitrazepam:{ uso:"insonnia", via:"os", dose:"0,5–1 mg", intervallo:"1 dose serale — non ripetere", max:"individualizzare", note:"Uso ristretto; elevato potenziale d'abuso." },
  daridorexant:{ uso:"insonnia", via:"os", dose:"50 mg", intervallo:"1 dose serale — non ripetere", max:"50 mg/24h", note:"Antagonista dell'orexina; assumere ≥ 30 min prima di coricarsi con ≥ 7 h disponibili." },
  melatonina:{ uso:"insonnia", via:"os", dose:"2 mg (rilascio prolungato)", intervallo:"1 dose serale — non ripetere", max:"2 mg/24h", note:"Assumere 1–2 h prima di coricarsi; utile su ritmo/latenza più che come ipnotico potente." },
  quetiapina:{ uso:"insonnia", via:"os", dose:"—", intervallo:"uso off-label a basse dosi molto diffuso ma controverso", max:"—", note:"Non registrata per l'insonnia: rapporto rischi/benefici sfavorevole come ipnotico (effetti metabolici, ipotensione). Preferire opzioni dedicate." },
  prometazina:{ uso:"agit", via:"im / os", dose:"25–50 mg", intervallo:"ogni 6–8 h", max:"100 mg/24h", note:"Spesso associata all'aloperidolo im nella tranquillizzazione rapida; molto sedativa, marcati effetti anticolinergici." },
  periciazina:{ uso:"agit", via:"os (gocce)", dose:"5–10 mg (5–10 gtt di Neuleptil 4%)", intervallo:"ogni 8 h", max:"individualizzare (≈ 30–60 mg/24h)", note:"Utile su impulsività e disturbi del comportamento; titolazione fine in gocce. Attenzione all'ipotensione ortostatica." },
  droperidolo:{ uso:"agit", via:"im / ev (ospedaliero)", dose:"basse dosi secondo protocollo", intervallo:"solo in setting monitorato", max:"secondo protocollo", note:"Richiede ECG e monitoraggio continuo per il rischio di QT lungo." },
  biperidene:{ uso:"agit", via:"im / ev lento (os)", dose:"2,5–5 mg", intervallo:"ripetibile dopo 30 min", max:"secondo RCP (≈ 10–12 mg/24h)", note:"NON è un sedativo: è l'antidoto della DISTONIA ACUTA da neurolettici. Risposta in pochi minuti." },
  propranololo:{ uso:"ansia", via:"os", dose:"10–40 mg", intervallo:"30–60 min prima dell'evento; nell'acatisia 2–3 volte/die", max:"secondo pressione e frequenza", note:"Agisce sui sintomi somatici (tremore, tachicardia). Prima scelta nell'acatisia. Controindicato in asma/BPCO e bradicardia." },
  clobazam:{ uso:"ansia", via:"os", dose:"10 mg", intervallo:"ogni 8–12 h", max:"≈ 30 mg/24h nell'ansia", note:"Struttura 1,5-benzodiazepinica: meno sedativa a parità di effetto ansiolitico." },
  clometiazolo:{ uso:"insonnia", via:"os", dose:"1–2 cps (192–384 mg) alla sera", intervallo:"1 dose serale — non ripetere", max:"cicli brevi, secondo protocollo", note:"Nell'astinenza alcolica schema a scalare in 5–6 giorni. Elevato potenziale di dipendenza: mai uso cronico." },
  quazepam:{ uso:"insonnia", via:"os", dose:"7,5–15 mg", intervallo:"1 dose serale — non ripetere", max:"15 mg/24h", note:"Emivita lunga: sedazione residua diurna, sconsigliato nell'anziano." },
};

/* ---- EMERGENZE / EVENTI CLINICI: cosa dare, quanto, dopo quanto ripetere, dose max, e la RATIO.
   Protocolli orientativi (Maudsley / pratica clinica): individualizzare, monitorare, verificare l'RCP. ---- */
const EMERGENZE = [
  { id:"panico", evento:"Attacco di panico acuto", area:"Ansia", grav:"media",
    farmaci:[
      { nome:"Alprazolam", drugId:"alprazolam", dose:"0,25–0,5 mg os (10–20 gtt Xanax)", ripeti:"ripetibile dopo ~1 h se persiste", max:"≈ 2 mg/die al bisogno" },
      { nome:"Lorazepam", drugId:"lorazepam", dose:"1–2,5 mg os/sublinguale", ripeti:"dopo 4–6 h", max:"≈ 7,5–10 mg/die" },
    ],
    ratio:"Benzodiazepina ad assorbimento rapido per interrompere la crisi. La crisi si autolimita spesso in 20–30 min: la prima mossa è rassicurazione e respirazione lenta. Evitare l'uso cronico (dipendenza) e impostare un trattamento di fondo (SSRI/SNRI) per la prevenzione.",
    allerta:"Al primo episodio o se atipico, escludere cause organiche (aritmia, ipoglicemia, tireotossicosi, sindrome coronarica)." },

  { id:"agitazione", evento:"Agitazione psicomotoria acuta", area:"Comportamento", grav:"alta",
    farmaci:[
      { nome:"Lorazepam (forma lieve/non psicotica)", drugId:"lorazepam", dose:"1–2,5 mg os/im", ripeti:"dopo 4–6 h", max:"≈ 10 mg/die" },
      { nome:"Aloperidolo + Prometazina (forma psicotica/grave)", drugId:"aloperidolo", dose:"aloperidolo 2,5–5 mg im + prometazina 25–50 mg im", ripeti:"rivalutare dopo 30–60 min (setting monitorato)", max:"aloperidolo ≈ 15–20 mg/die; ECG" },
      { nome:"Olanzapina im", drugId:"olanzapina", dose:"5–10 mg im", ripeti:"2ª dose dopo ≥ 2 h", max:"≤ 20 mg/24h; NO benzodiazepine parenterali entro 1 h" },
    ],
    ratio:"Prima la de-escalation verbale. Se causa non psicotica → benzodiazepina da sola; se psicosi/mania → antipsicotico + benzodiazepina o prometazina (l'associazione riduce la dose di ciascuno). Evitare alte dosi di solo antipsicotico (EPS, QT).",
    allerta:"Escludere cause organiche/tossiche (ipoglicemia, ipossia, delirium, sostanze). Monitorare vie aeree, sedazione e QTc." },

  { id:"astinenza_alcol", evento:"Astinenza alcolica / delirium tremens", area:"Dipendenze", grav:"alta",
    farmaci:[
      { nome:"Diazepam", drugId:"diazepam", dose:"10–20 mg os (10 gtt = 2 mg)", ripeti:"ogni 1–2 h secondo scala CIWA-Ar fino a lieve sedazione", max:"individualizzare (dose scalare nei giorni)" },
      { nome:"Lorazepam (se epatopatia)", drugId:"lorazepam", dose:"1–2 mg os/im", ripeti:"ogni 1–2 h (CIWA-guidata)", max:"individualizzare" },
      { nome:"Tiamina (obbligatoria)", dose:"100–300 mg im/ev PRIMA del glucosio", ripeti:"secondo protocollo", max:"—" },
    ],
    ratio:"Le benzodiazepine (tolleranza crociata con l'alcol) prevengono convulsioni e delirium tremens; schema sintomo-guidato (CIWA-Ar) meglio di dosi fisse. Lorazepam nell'epatopatico (solo glicuronazione, niente metaboliti attivi). La tiamina va SEMPRE prima del glucosio per prevenire l'encefalopatia di Wernicke.",
    allerta:"Il DT è una emergenza medica (mortalità se non trattato): monitoraggio, idratazione, elettroliti." },

  { id:"convulsione", evento:"Crisi convulsiva / stato epilettico", area:"Neurologia", grav:"critica",
    farmaci:[
      { nome:"Lorazepam ev", drugId:"lorazepam", dose:"4 mg ev lento (0,1 mg/kg)", ripeti:"1 volta dopo 5–10 min se persiste", max:"8 mg" },
      { nome:"Diazepam", drugId:"diazepam", dose:"10 mg ev o rettale", ripeti:"dopo 5–10 min", max:"individualizzare" },
      { nome:"Midazolam (se no accesso venoso)", drugId:"midazolam", dose:"10 mg im o buccale", ripeti:"secondo risposta", max:"individualizzare" },
    ],
    ratio:"Le benzodiazepine sono la prima linea per fermare la crisi. Se non c'è accesso venoso, midazolam im/buccale è efficace e rapido. Oltre i 5 minuti si parla di stato epilettico → farmaco e setting di secondo livello.",
    allerta:"Proteggere le vie aeree; cercare la causa (sospensione di BDZ/alcol, iponatriemia, farmaci che abbassano la soglia)." },

  { id:"distonia", evento:"Distonia acuta da neurolettici (crisi oculogira, torcicollo)", area:"Effetti extrapiramidali", grav:"media",
    farmaci:[
      { nome:"Biperidene (anticolinergico)", dose:"2,5–5 mg im o ev lento", ripeti:"dopo 30 min se persiste", max:"secondo RCP" },
      { nome:"Difenidramina (alternativa)", dose:"25–50 mg im/ev", ripeti:"dopo 20–30 min", max:"secondo RCP" },
    ],
    ratio:"Squilibrio acuto dopamina/acetilcolina da blocco D2: l'anticolinergico centrale lo corregge, con risposta in pochi minuti. È spettacolare e spaventa il paziente, ma benigna e reversibile: rassicurare. Più frequente nei giovani e con antipsicotici ad alta potenza.",
    allerta:"Non confondere con crisi isterica o convulsiva. Rivalutare l'antipsicotico (dose/molecola) dopo l'episodio." },

  { id:"acatisia", evento:"Acatisia acuta (da antipsicotici)", area:"Effetti extrapiramidali", grav:"media",
    farmaci:[
      { nome:"Propranololo (beta-bloccante)", dose:"10–20 mg os", ripeti:"fino a 2–3 volte/die", max:"secondo tolleranza/PA" },
      { nome:"Lorazepam / Clonazepam", drugId:"lorazepam", dose:"lorazepam 1–2 mg os", ripeti:"secondo necessità", max:"breve termine" },
    ],
    ratio:"Irrequietezza motoria soggettiva, spesso scambiata per agitazione: aumentare l'antipsicotico la PEGGIORA. Prima ridurre la dose/rivedere la molecola; propranololo è l'opzione più efficace, benzodiazepine come alternativa. Considerare mianserina/mirtazapina.",
    allerta:"Legata a un aumentato rischio suicidario: riconoscerla è cruciale." },

  { id:"nms", evento:"Sindrome neurolettica maligna (NMS)", area:"Emergenza critica", grav:"critica",
    farmaci:[
      { nome:"Sospendere l'antipsicotico", dose:"stop immediato + terapia di supporto", ripeti:"—", max:"—" },
      { nome:"Dantrolene / Bromocriptina", dose:"opzioni in terapia intensiva (idratazione, raffreddamento)", ripeti:"—", max:"—" },
    ],
    ratio:"Non è un 'dai X mg': è un'emergenza da riconoscere e trattare in ambiente intensivo. Tetrade: iperpiressia, rigidità 'a tubo di piombo', disautonomia, alterazione della coscienza, con ↑CK e leucocitosi. Sospendere subito il neurolettico e supportare.",
    allerta:"Mortalità significativa. Differenziare dalla sindrome serotoninergica (qui rigidità e ipertermia dominano, insorgenza in giorni)." },

  { id:"serotoninergica", evento:"Sindrome serotoninergica", area:"Emergenza critica", grav:"critica",
    farmaci:[
      { nome:"Sospendere i serotoninergici", dose:"stop + supporto (idratazione, raffreddamento)", ripeti:"—", max:"—" },
      { nome:"Benzodiazepine", drugId:"lorazepam", dose:"per agitazione e mioclono", ripeti:"secondo necessità", max:"—" },
      { nome:"Ciproeptadina (casi moderati-gravi)", dose:"12 mg os, poi 2 mg ogni 2 h", ripeti:"secondo risposta", max:"32 mg/24h" },
    ],
    ratio:"Da eccesso serotoninergico (spesso associazioni: SSRI+IMAO, +tramadolo, +linezolid, +triptani). Triade: alterazione mentale, iperattività autonomica, anomalie neuromuscolari (clono, iperreflessia). Sospendere e supportare; la ciproeptadina è un antagonista 5-HT.",
    allerta:"Insorgenza rapida (ore) dopo aggiunta/aumento di un serotoninergico; il clono inducibile è il segno più utile per distinguerla dalla NMS." },

  { id:"litio_tox", evento:"Intossicazione da litio", area:"Emergenza critica", grav:"critica",
    farmaci:[
      { nome:"Sospendere il litio + idratazione", dose:"soluzione fisiologica ev, monitorare litiemia", ripeti:"—", max:"—" },
      { nome:"Emodialisi", dose:"se litiemia molto elevata o sintomi neurologici gravi", ripeti:"—", max:"—" },
    ],
    ratio:"Finestra terapeutica stretta: sintomi da tremore grossolano e atassia fino a confusione, convulsioni, coma. Sospendere, idratare (favorisce l'escrezione renale) e dializzare nei casi gravi. Cercare i fattori precipitanti (disidratazione, FANS, ACE-inibitori, diuretici, insufficienza renale).",
    allerta:"La litiemia può salire dopo l'ingestione: ripetere i dosaggi. I sintomi neurologici possono persistere." },

  { id:"oppioidi_od", evento:"Overdose da oppioidi", area:"Dipendenze", grav:"critica",
    farmaci:[
      { nome:"Naloxone", dose:"0,4–2 mg im/ev/intranasale", ripeti:"ogni 2–3 min fino a ripresa del respiro", max:"titolare alla risposta respiratoria" },
    ],
    ratio:"Antagonista competitivo μ: riverte la depressione respiratoria. Emivita breve → con oppioidi a lunga durata (metadone, buprenorfina) rischio di ri-narcotizzazione: sorvegliare a lungo, dosi ripetute o infusione. Titolare al respiro, non alla coscienza (evita astinenza acuta violenta).",
    allerta:"Può precipitare un'astinenza acuta; nei consumatori cronici puntare a ripristinare il respiro, non a risvegliare completamente." },

  { id:"bdz_od", evento:"Overdose da benzodiazepine", area:"Tossicologia", grav:"alta",
    farmaci:[
      { nome:"Supporto (spesso sufficiente)", dose:"monitoraggio respiratorio", ripeti:"—", max:"—" },
      { nome:"Flumazenil (con estrema cautela)", dose:"0,2 mg ev, titolabile", ripeti:"secondo risposta", max:"secondo protocollo" },
    ],
    ratio:"Le BDZ da sole raramente sono letali (pericolose in associazione a oppioidi/alcol). Il flumazenil (antagonista) va usato con cautela: può precipitare convulsioni se co-ingestione di proconvulsivanti (es. triciclici) o dipendenza da BDZ.",
    allerta:"Non usare il flumazenil di routine nelle intossicazioni miste o nei BDZ-dipendenti." },

  { id:"mania", evento:"Mania acuta", area:"Umore", grav:"alta",
    farmaci:[
      { nome:"Antipsicotico", drugId:"olanzapina", dose:"es. olanzapina 10 mg, aripiprazolo, quetiapina o risperidone", ripeti:"secondo schema", max:"secondo RCP" },
      { nome:"± Benzodiazepina", drugId:"lorazepam", dose:"lorazepam per il controllo rapido di agitazione/insonnia", ripeti:"secondo necessità", max:"breve termine" },
      { nome:"Stabilizzante di fondo", drugId:"litio", dose:"litio o valproato per la profilassi", ripeti:"titolazione con TDM", max:"secondo litiemia/valproatemia" },
    ],
    ratio:"Controllo rapido con antipsicotico (± benzodiazepina) e impostazione della profilassi con uno stabilizzante. Sospendere eventuali antidepressivi (rischio di viraggio/accelerazione dei cicli).",
    allerta:"Valutare il rischio per sé e per gli altri; spesso necessario il ricovero. Attenzione allo stato misto." },

  { id:"insonnia_acuta", evento:"Insonnia acuta / situazionale", area:"Sonno", grav:"media",
    farmaci:[
      { nome:"Zolpidem", drugId:"zolpidem", dose:"10 mg (5 mg anziano/donna)", ripeti:"1 dose serale — NON ripetere nella notte", max:"10 mg/24h" },
      { nome:"Trazodone (basse dosi)", drugId:"trazodone", dose:"25–100 mg alla sera (gtt: 1 gtt = 2 mg)", ripeti:"dose serale", max:"secondo tolleranza" },
    ],
    ratio:"Prima l'igiene del sonno. Se serve un farmaco: uso breve per rompere il circolo, evitando la cronicizzazione. Trazodone a basse dosi utile se è opportuno evitare le benzodiazepine/Z-drug (no dipendenza).",
    allerta:"Cercare e trattare la causa (depressione, ansia, dolore, sostanze, apnee); rivalutare l'uso cronico degli ipnotici." },
];

/* ---- TITOLAZIONE per indicazione: come si imposta, quanto si mette, dopo quanto si sale, e la RATIO.
   Schemi orientativi (RCP, Maudsley, Stahl): individualizzare per età, comorbilità, tollerabilità. ---- */
const TITOLAZIONE = {
  // ===================== ANTIDEPRESSIVI: SSRI =====================
  sertralina:{ schemi:[
      { ind:"Depressione maggiore", start:"50 mg/die al mattino (25 mg se ansia marcata o paziente sensibile)", step:"+50 mg", ogni:"ogni 2–4 settimane", target:"50–150 mg/die", max:"200 mg/die",
        ratio:"50 mg è già dose efficace nella depressione: si sale solo se dopo 3–4 settimane la risposta è parziale. Partire da 25 mg riduce nausea e attivazione iniziale nei pazienti ansiosi." },
      { ind:"DOC", start:"50 mg/die", step:"+50 mg", ogni:"ogni 1–2 settimane", target:"150–200 mg/die", max:"200 mg/die (in casi selezionati oltre, specialistico)",
        ratio:"Il DOC richiede dosi più alte e tempi più lunghi della depressione: valutare l'efficacia solo dopo 10–12 settimane a dose piena, non dopo 3–4." },
      { ind:"Disturbo di panico / PTSD / ansia sociale", start:"25 mg/die per 1 settimana", step:"+25–50 mg", ogni:"ogni 1–2 settimane", target:"50–150 mg/die", max:"200 mg/die",
        ratio:"Start low obbligato: nei disturbi d'ansia l'attivazione iniziale può scatenare un attacco di panico e far abbandonare la terapia. Coprire le prime 1–2 settimane con una benzodiazepina se necessario." } ],
    generale:"Assorbimento migliore con il cibo. Effetto pieno in 4–6 settimane (più a lungo nel DOC).",
    sospensione:"Ridurre del 25–50% ogni 2–4 settimane; sindrome da sospensione di grado moderato." },

  escitalopram:{ schemi:[
      { ind:"Depressione maggiore", start:"10 mg/die", step:"+5–10 mg", ogni:"dopo almeno 2–4 settimane", target:"10–20 mg/die", max:"20 mg/die (10 mg nell'anziano)",
        ratio:"10 mg è la dose efficace nella maggior parte dei casi: salire a 20 mg dà un guadagno modesto a fronte di maggiore rischio di QT. Nell'anziano il tetto è 10 mg." },
      { ind:"Disturbo di panico", start:"5 mg/die per 1 settimana", step:"+5 mg", ogni:"ogni 1–2 settimane", target:"10–20 mg/die", max:"20 mg/die",
        ratio:"Metà dose iniziale per evitare il peggioramento paradosso dell'ansia nei primi giorni, tipico del panico." },
      { ind:"DOC / ansia generalizzata / ansia sociale", start:"10 mg/die", step:"+10 mg", ogni:"dopo 2–4 settimane", target:"10–20 mg/die", max:"20 mg/die",
        ratio:"Nel DOC si tende alla dose massima tollerata e si attende più a lungo (10–12 settimane) prima di dichiarare il fallimento." } ],
    generale:"Enantiomero attivo del citalopram: metà dei mg a parità di effetto. Sorvegliare il QTc alle dosi piene.",
    sospensione:"Ridurre gradualmente in 4 settimane o più; sindrome da sospensione moderata." },

  citalopram:{ schemi:[
      { ind:"Depressione maggiore", start:"20 mg/die", step:"+20 mg", ogni:"dopo 2–4 settimane", target:"20–40 mg/die", max:"40 mg/die (20 mg se >65 anni o epatopatia)",
        ratio:"Tetto abbassato per motivi cardiologici: il prolungamento del QT è dose-dipendente. Oltre i 40 mg non c'è guadagno di efficacia ma solo rischio." },
      { ind:"Disturbo di panico", start:"10 mg/die per 1 settimana", step:"+10 mg", ogni:"ogni 1–2 settimane", target:"20–40 mg/die", max:"40 mg/die",
        ratio:"Titolazione lenta per l'attivazione iniziale; nel panico la dose efficace è spesso più bassa che nella depressione." } ],
    generale:"ECG basale se fattori di rischio cardiaco, elettroliti alterati o associazioni QT-prolunganti.",
    sospensione:"Riduzione graduale in 4 settimane." },

  paroxetina:{ schemi:[
      { ind:"Depressione maggiore", start:"20 mg/die", step:"+10 mg", ogni:"ogni 2–4 settimane", target:"20–40 mg/die", max:"50 mg/die",
        ratio:"20 mg è già efficace; l'aumento serve nei non responder. Attenzione: è l'SSRI con più aumento ponderale ed effetti anticolinergici." },
      { ind:"DOC", start:"20 mg/die", step:"+10–20 mg", ogni:"ogni 1–2 settimane", target:"40–60 mg/die", max:"60 mg/die",
        ratio:"Come per gli altri SSRI il DOC richiede il tetto alto della finestra e attese lunghe." },
      { ind:"Disturbo di panico", start:"10 mg/die", step:"+10 mg", ogni:"ogni 1–2 settimane", target:"20–40 mg/die", max:"60 mg/die",
        ratio:"Start dimezzato per l'attivazione. Nel panico la paroxetina è storicamente molto usata ma la sospensione è la più difficile." } ],
    generale:"Potente inibitore del CYP2D6 (interazioni) e la più anticolinergica degli SSRI.",
    sospensione:"LA PIÙ PROBLEMATICA: emivita breve e nessun metabolita attivo. Scalare molto lentamente (mesi), eventualmente passando a fluoxetina." },

  fluoxetina:{ schemi:[
      { ind:"Depressione maggiore", start:"20 mg/die al mattino", step:"+20 mg", ogni:"dopo almeno 3–4 settimane", target:"20–40 mg/die", max:"60 mg/die",
        ratio:"Emivita lunghissima (con norfluoxetina fino a settimane): lo stato stazionario si raggiunge in 4–5 settimane, quindi non ha senso salire prima. Attivante: dare al mattino." },
      { ind:"DOC", start:"20 mg/die", step:"+20 mg", ogni:"ogni 2–4 settimane", target:"40–60 mg/die", max:"80 mg/die",
        ratio:"Dosi elevate necessarie nel DOC; l'emivita lunga rende la titolazione più lenta ma la sospensione più facile." },
      { ind:"Bulimia nervosa", start:"60 mg/die (spesso direttamente)", step:"—", ogni:"—", target:"60 mg/die", max:"60 mg/die",
        ratio:"Nella bulimia la dose efficace è alta fin da subito: 60 mg è la dose registrata, non un obiettivo da raggiungere lentamente." } ],
    generale:"Attivante: utile nella depressione con rallentamento, sconsigliata se insonnia/agitazione dominano.",
    sospensione:"La più facile: l'emivita lunga produce un auto-scalaggio. Spesso sospendibile senza titolazione." },

  fluvoxamina:{ schemi:[
      { ind:"Depressione maggiore", start:"50 mg alla sera", step:"+50 mg", ogni:"ogni 1–2 settimane", target:"100–200 mg/die", max:"300 mg/die (>150 mg in 2 dosi)",
        ratio:"Sedativa: si dà la sera. Sopra i 150 mg si frazionano le somministrazioni per la tollerabilità gastrica." },
      { ind:"DOC", start:"50 mg alla sera", step:"+50 mg", ogni:"ogni 4–7 giorni", target:"200–300 mg/die", max:"300 mg/die",
        ratio:"Storico farmaco di riferimento del DOC: si punta al tetto alto, frazionato in 2 dosi, con attesa di 10–12 settimane." } ],
    generale:"POTENTE inibitore del CYP1A2 e 2C19: attenzione a clozapina, olanzapina, agomelatina, caffeina, teofillina.",
    sospensione:"Riduzione graduale in 4 settimane." },

  // ===================== ANTIDEPRESSIVI: SNRI e altri =====================
  venlafaxina:{ schemi:[
      { ind:"Depressione maggiore", start:"75 mg/die (RP, con il cibo)", step:"+75 mg", ogni:"non prima di 2 settimane", target:"75–225 mg/die", max:"375 mg/die (ospedaliero)",
        ratio:"A dosi basse è di fatto un SSRI; l'azione noradrenergica compare sopra i 150 mg. Se la risposta serotoninergica è insufficiente, salire ha un razionale farmacologico preciso." },
      { ind:"Ansia generalizzata / ansia sociale", start:"75 mg/die", step:"+75 mg", ogni:"dopo 2–4 settimane", target:"75–150 mg/die", max:"225 mg/die",
        ratio:"Nell'ansia la dose efficace è di solito quella bassa: salire aumenta soprattutto pressione e sudorazione." },
      { ind:"Disturbo di panico", start:"37,5 mg/die per 1 settimana", step:"+37,5–75 mg", ogni:"ogni 1–2 settimane", target:"75–150 mg/die", max:"225 mg/die",
        ratio:"Start dimezzato: nel panico l'attivazione noradrenergica iniziale è particolarmente mal tollerata." } ],
    generale:"Monitorare la pressione arteriosa sopra i 150 mg/die. Preferire sempre la formulazione a rilascio prolungato.",
    sospensione:"LA PIÙ DIFFICILE con la paroxetina: scalare molto lentamente (anche 25% al mese); sintomi da sospensione intensi (scosse elettriche, vertigini)." },

  duloxetina:{ schemi:[
      { ind:"Depressione maggiore", start:"60 mg/die (30 mg per 1 settimana se sensibile)", step:"+30 mg", ogni:"dopo 2–4 settimane", target:"60 mg/die", max:"120 mg/die",
        ratio:"60 mg è la dose efficace: oltre non c'è chiaro guadagno nella depressione. Partire da 30 mg riduce la nausea iniziale, che è l'effetto che fa abbandonare la terapia." },
      { ind:"Ansia generalizzata", start:"30 mg/die per 1–2 settimane", step:"+30 mg", ogni:"ogni 2 settimane", target:"60 mg/die", max:"120 mg/die",
        ratio:"Nell'ansia la titolazione più lenta migliora l'aderenza; il beneficio compare in 2–4 settimane." },
      { ind:"Dolore neuropatico diabetico", start:"60 mg/die", step:"—", ogni:"—", target:"60 mg/die", max:"120 mg/die",
        ratio:"Sul dolore l'effetto è più precoce (1–2 settimane) e passa dalle vie noradrenergiche discendenti: la dose analgesica coincide con quella antidepressiva." } ],
    generale:"Controllare transaminasi e pressione; evitare in epatopatia e con alcol.",
    sospensione:"Riduzione graduale in 2–4 settimane; sindrome da sospensione moderata-marcata." },

  desvenlafaxina:{ schemi:[
      { ind:"Depressione maggiore", start:"50 mg/die", step:"generalmente non necessario", ogni:"—", target:"50 mg/die", max:"100 mg/die (oltre non aumenta l'efficacia)",
        ratio:"Dose fissa: è il metabolita già attivo della venlafaxina, quindi la cinetica è lineare e non serve titolare. Aumentare aggiunge effetti avversi senza efficacia." } ],
    generale:"Poco dipendente dal CYP2D6: utile nei metabolizzatori variabili o in politerapia.",
    sospensione:"Come venlafaxina: scalare molto lentamente." },

  mirtazapina:{ schemi:[
      { ind:"Depressione maggiore", start:"15 mg alla sera", step:"+15 mg", ogni:"ogni 1–2 settimane", target:"30–45 mg/die", max:"45 mg/die",
        ratio:"PARADOSSO DELLA DOSE: a 7,5–15 mg il blocco H1 domina e il farmaco è massimamente sedativo; salendo emerge l'azione noradrenergica che riduce la sedazione. Se il paziente è troppo sedato, spesso si SALE di dose, non si scende." },
      { ind:"Insonnia / augmentation (off-label)", start:"7,5–15 mg alla sera", step:"—", ogni:"—", target:"7,5–15 mg/die", max:"15 mg per questo scopo",
        ratio:"Si sfrutta proprio l'effetto ipnotico delle basse dosi; salire ridurrebbe l'effetto sul sonno." } ],
    generale:"Aumento di appetito e peso marcati: utile nel depresso anoressico/insonne, problematico negli altri.",
    sospensione:"Riduzione graduale in 2–4 settimane." },

  trazodone:{ schemi:[
      { ind:"Depressione maggiore", start:"50–100 mg/die alla sera (gtt: 1 gtt = 2 mg)", step:"+50 mg", ogni:"ogni 3–4 giorni", target:"150–300 mg/die", max:"600 mg/die (ospedaliero)",
        ratio:"Effetto antidepressivo pieno solo a dosi ≥150 mg: sotto si ha solo sedazione. Errore frequente: usarlo a 50 mg e considerarlo un antidepressivo inefficace, quando è semplicemente sottodosato." },
      { ind:"Insonnia (off-label)", start:"25–50 mg alla sera", step:"+25 mg", ogni:"secondo risposta", target:"50–100 mg alla sera", max:"150 mg per questo scopo",
        ratio:"A basse dosi prevale il blocco H1/5-HT2A/α1: effetto ipnotico senza dipendenza, motivo del suo largo impiego. La titolazione in gocce consente aggiustamenti fini." } ],
    generale:"Formulazione a rilascio prolungato per la dose unica serale. Avvertire del rischio (raro) di priapismo.",
    sospensione:"Riduzione graduale; sindrome da sospensione lieve." },

  bupropione:{ schemi:[
      { ind:"Depressione maggiore", start:"150 mg/die al mattino (RP)", step:"+150 mg", ogni:"dopo almeno 1 settimana", target:"300 mg/die", max:"300 mg/die (450 in casi selezionati)",
        ratio:"Salire solo dopo una settimana perché il rischio convulsivo è dose- e velocità-dipendente. Dare al mattino: è attivante e causa insonnia." },
      { ind:"Cessazione del fumo", start:"150 mg/die per 3 giorni", step:"→ 150 mg x2", ogni:"dal 4º giorno", target:"300 mg/die", max:"300 mg/die",
        ratio:"Iniziare 1–2 settimane PRIMA della data di cessazione, mentre il paziente fuma ancora, per avere livelli stabili al momento dello stop." } ],
    generale:"Nessun effetto sessuale né aumento di peso: utile come switch o augmentation per questi motivi.",
    sospensione:"Riduzione graduale non sempre necessaria; sindrome da sospensione lieve." },

  vortioxetina:{ schemi:[
      { ind:"Depressione maggiore", start:"10 mg/die (5 mg nell'anziano)", step:"+5–10 mg", ogni:"dopo 2–4 settimane", target:"10–20 mg/die", max:"20 mg/die",
        ratio:"Titolazione semplice e buona tollerabilità; le dosi alte danno più nausea ma anche maggiore effetto pro-cognitivo. Utile quando la disfunzione cognitiva è prominente." } ],
    generale:"Basso impatto sessuale e ponderale; profilo multimodale.",
    sospensione:"Riduzione graduale; sindrome da sospensione lieve." },

  agomelatina:{ schemi:[
      { ind:"Depressione maggiore", start:"25 mg alla sera", step:"+25 mg", ogni:"dopo 2 settimane", target:"25–50 mg alla sera", max:"50 mg/die",
        ratio:"Somministrazione serale obbligata: agisce risincronizzando il ritmo circadiano tramite i recettori melatoninergici. Nessun effetto sessuale né sospensione." } ],
    generale:"OBBLIGO di monitoraggio delle transaminasi (basale, 3–6–12–24 settimane e a ogni aumento di dose).",
    sospensione:"Sospendibile senza scalaggio: nessuna sindrome da sospensione." },

  // ===================== ANTIDEPRESSIVI: TRICICLICI =====================
  amitriptilina:{ schemi:[
      { ind:"Depressione maggiore", start:"25 mg alla sera (10 mg nell'anziano)", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"75–150 mg/die", max:"200 mg/die (300 ospedaliero)",
        ratio:"START LOW GO SLOW per anticolinergici e ipotensione ortostatica. La dose antidepressiva piena è ≥75 mg: sotto si ottiene solo sedazione. Dose serale unica per sfruttare la sedazione." },
      { ind:"Dolore neuropatico / emicrania (off-label o registrato)", start:"10–25 mg alla sera", step:"+10–25 mg", ogni:"ogni 7 giorni", target:"25–75 mg alla sera", max:"75–100 mg",
        ratio:"L'effetto analgesico è indipendente da quello antidepressivo e si ottiene a dosi molto più basse: la titolazione si ferma appena il dolore migliora." },
      { ind:"Insonnia (off-label)", start:"10–25 mg alla sera", step:"—", ogni:"—", target:"10–25 mg", max:"non salire per questo scopo",
        ratio:"Si usa solo la componente antistaminica; salire aggiungerebbe carico anticolinergico senza benefici sul sonno." } ],
    generale:"ECG basale sopra i 100 mg o con fattori di rischio. Molto pericolosa in sovradosaggio.",
    sospensione:"Ridurre del 25% ogni 1–2 settimane: la sospensione brusca dà rimbalzo colinergico (nausea, diarrea, insonnia)." },

  clomipramina:{ schemi:[
      { ind:"Depressione maggiore", start:"25 mg/die", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"75–150 mg/die", max:"250 mg/die",
        ratio:"Titolazione graduale per la tollerabilità anticolinergica e cardiaca." },
      { ind:"Disturbo ossessivo-compulsivo", start:"25 mg/die", step:"+25 mg", ogni:"ogni 4–7 giorni", target:"150–250 mg/die", max:"250 mg/die",
        ratio:"Nel DOC è il triciclico di riferimento (potente inibitore SERT) e servono dosi alte con attesa di 10–12 settimane. Rimane l'alternativa quando gli SSRI falliscono, al prezzo di più effetti collaterali." },
      { ind:"Disturbo di panico", start:"10–25 mg/die", step:"+10–25 mg", ogni:"ogni 4–7 giorni", target:"50–150 mg/die", max:"250 mg/die",
        ratio:"Nel panico si parte con dosi molto basse: l'ipersensibilità iniziale ai serotoninergici è marcata e può peggiorare le crisi." } ],
    generale:"TDM utile (clomipramina + desmetilclomipramina). Attenzione alla soglia convulsiva alle dosi alte.",
    sospensione:"Riduzione graduale del 25% ogni 1–2 settimane." },

  nortriptilina:{ schemi:[
      { ind:"Depressione maggiore", start:"25 mg/die", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"75–100 mg/die", max:"150 mg/die",
        ratio:"FINESTRA TERAPEUTICA: l'efficacia si perde sia sotto sia SOPRA il range plasmatico (50–150 ng/ml) — è l'unico antidepressivo con una vera finestra, quindi il TDM guida la dose." } ],
    generale:"Il triciclico meglio tollerato (meno anticolinergico e ipotensivo): preferibile nell'anziano.",
    sospensione:"Riduzione graduale del 25% ogni 1–2 settimane." },

  imipramina:{ schemi:[
      { ind:"Depressione maggiore", start:"25 mg/die", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"75–200 mg/die", max:"200 mg/die (300 ospedaliero)",
        ratio:"Capostipite dei triciclici; titolazione graduale per tollerabilità cardiovascolare e anticolinergica." },
      { ind:"Enuresi notturna nel bambino", start:"25 mg alla sera", step:"+25 mg", ogni:"dopo 1 settimana", target:"25–50 mg alla sera", max:"secondo età e peso",
        ratio:"Dose bassa e ciclo breve: si sfruttano l'effetto anticolinergico sul detrusore e l'alleggerimento del sonno profondo." } ],
    generale:"ECG basale come per gli altri triciclici.",
    sospensione:"Riduzione graduale." },

  // ===================== STABILIZZANTI =====================
  litio:{ schemi:[
      { ind:"Mania acuta", start:"300 mg x2–3/die (600–900 mg/die)", step:"+300 mg", ogni:"ogni 3–5 giorni con litiemia", target:"litiemia 0,8–1,2 mEq/l", max:"secondo litiemia",
        ratio:"Nella fase acuta si punta al tetto alto della finestra. La dose NON si stabilisce in mg ma sul livello plasmatico: prelievo 12 h dopo l'ultima dose, allo stato stazionario (5 giorni)." },
      { ind:"Profilassi del disturbo bipolare", start:"300 mg/die (sera)", step:"+300 mg", ogni:"ogni 5–7 giorni con litiemia", target:"litiemia 0,6–0,8 mEq/l", max:"secondo litiemia e tollerabilità",
        ratio:"In mantenimento si accetta un livello più basso per ridurre tremore, poliuria e impatto renale a lungo termine, mantenendo la protezione dalle ricadute." },
      { ind:"Augmentation antidepressiva (off-label)", start:"300 mg/die", step:"+300 mg", ogni:"ogni 7 giorni", target:"litiemia 0,4–0,8 mEq/l", max:"secondo litiemia",
        ratio:"Nella depressione resistente basta un livello inferiore a quello della profilassi bipolare; la risposta compare in 2–6 settimane." } ],
    generale:"Prima di iniziare: funzione renale, TSH, calcemia, ECG, test di gravidanza. Poi litiemia ogni 3–6 mesi, TSH e creatinina ogni 6–12 mesi.",
    sospensione:"MAI bruscamente: rischio di mania da rimbalzo. Scalare in almeno 3 mesi." },

  valproato:{ schemi:[
      { ind:"Mania acuta", start:"20 mg/kg/die (o 500 mg x2)", step:"+250–500 mg", ogni:"ogni 2–3 giorni", target:"valproatemia 50–125 µg/ml", max:"60 mg/kg/die",
        ratio:"Nella mania si può fare un carico rapido (20 mg/kg) perché l'effetto antimaniacale è dose-dipendente e serve rapidità; la tollerabilità gastrica lo consente meglio del litio." },
      { ind:"Profilassi bipolare", start:"500 mg/die (sera)", step:"+250–500 mg", ogni:"ogni 5–7 giorni", target:"500–1500 mg/die", max:"secondo valproatemia",
        ratio:"In mantenimento si sale più lentamente cercando la dose minima efficace, per limitare aumento di peso, tremore e impatto epatico." } ],
    generale:"CONTROINDICATO nella donna in età fertile senza contraccezione efficace (teratogenicità e deficit cognitivi nel nascituro). Emocromo, transaminasi, ammoniemia se confusione.",
    sospensione:"Riduzione graduale." },

  lamotrigina:{ schemi:[
      { ind:"Profilassi della depressione bipolare", start:"25 mg/die per 2 settimane", step:"25→50 mg (sett. 3–4), poi 100 mg (sett. 5), poi 200 mg", ogni:"secondo lo schema fisso settimanale", target:"200 mg/die", max:"400 mg/die",
        ratio:"TITOLAZIONE LENTISSIMA NON NEGOZIABILE: la velocità di salita è il principale fattore di rischio per la sindrome di Stevens-Johnson. Lo schema è rigido, non accelerabile per fretta clinica." },
      { ind:"Con valproato in terapia", start:"25 mg a giorni alterni per 2 settimane", step:"metà dei normali incrementi", ogni:"schema dimezzato", target:"100 mg/die", max:"200 mg/die",
        ratio:"Il valproato inibisce la glicuronazione della lamotrigina raddoppiandone i livelli: la titolazione va DIMEZZATA, altrimenti il rischio cutaneo si moltiplica." },
      { ind:"Con carbamazepina o altri induttori", start:"50 mg/die", step:"incrementi raddoppiati", ogni:"schema accelerato", target:"400 mg/die", max:"700 mg/die",
        ratio:"Gli induttori dimezzano i livelli: serve il doppio della dose per lo stesso effetto." } ],
    generale:"Se compare qualsiasi rash: SOSPENDERE immediatamente e valutare. Se si interrompe più di 5 giorni, ricominciare la titolazione da capo.",
    sospensione:"Riduzione graduale in almeno 2 settimane (rischio convulsivo)." },

  carbamazepina:{ schemi:[
      { ind:"Disturbo bipolare / mania", start:"200 mg x2/die", step:"+200 mg", ogni:"ogni 3–7 giorni", target:"600–1200 mg/die", max:"1600 mg/die",
        ratio:"AUTO-INDUZIONE: dopo 2–4 settimane la carbamazepina accelera il proprio metabolismo, quindi i livelli calano e spesso serve ri-aumentare la dose. Va spiegato al paziente per non interpretarlo come perdita di efficacia." },
      { ind:"Nevralgia del trigemino", start:"100 mg x2/die", step:"+100–200 mg", ogni:"ogni 3 giorni", target:"400–800 mg/die", max:"1200 mg/die",
        ratio:"Nella nevralgia si titola rapidamente fino alla scomparsa del dolore, poi si cerca la dose minima efficace." } ],
    generale:"Emocromo e transaminasi (agranulocitosi, iponatriemia). Screening HLA-B*1502 nelle popolazioni asiatiche.",
    sospensione:"Riduzione graduale; attenzione al ritorno dei livelli dei farmaci associati (induzione che cessa)." },

  topiramato:{ schemi:[
      { ind:"Profilassi dell'emicrania", start:"25 mg alla sera", step:"+25 mg", ogni:"ogni settimana", target:"100 mg/die (50 x2)", max:"200 mg/die",
        ratio:"Titolazione lenta per limitare parestesie e soprattutto il rallentamento cognitivo ('effetto dopey'), che è il motivo principale di abbandono." },
      { ind:"Controllo del peso da antipsicotici (off-label)", start:"25 mg/die", step:"+25 mg", ogni:"ogni 1–2 settimane", target:"100–200 mg/die", max:"200 mg/die",
        ratio:"Si sfrutta l'effetto anoressizzante; salire lentamente permette di trovare la dose minima che riduce il peso senza compromettere la cognizione." } ],
    generale:"Rischio di calcolosi renale (idratazione), glaucoma acuto, acidosi metabolica.",
    sospensione:"Riduzione graduale." },
  // ===================== ANTIPSICOTICI =====================
  aloperidolo:{ schemi:[
      { ind:"Psicosi / schizofrenia", start:"1–2 mg x2/die (0,5 mg nell'anziano)", step:"+1–2 mg", ogni:"ogni 2–3 giorni", target:"5–10 mg/die", max:"20 mg/die",
        ratio:"Oltre i 10–12 mg/die l'occupazione D2 supera l'80% e si guadagnano solo EPS, non efficacia: è l'errore classico del 'più dose = più antipsicotico'. Restare nella finestra 65–80% di occupazione." },
      { ind:"Agitazione acuta", start:"2,5–5 mg im", step:"ripetere secondo risposta", ogni:"ogni 4–6 h", target:"controllo dell'agitazione", max:"≈ 15–20 mg/24h",
        ratio:"In acuto si associa a lorazepam o prometazina: l'associazione controlla l'agitazione con meno antipsicotico e meno EPS rispetto alla monoterapia ad alte dosi." },
      { ind:"Delirium (off-label)", start:"0,5–1 mg", step:"+0,5 mg", ogni:"secondo necessità", target:"1–3 mg/die", max:"basse dosi nell'anziano",
        ratio:"Nel delirium si usano dosi molto più basse: l'obiettivo è ridurre l'agitazione senza sedare né peggiorare la confusione." } ],
    generale:"ECG basale (QTc). Sorvegliare distonia acuta nei giovani nelle prime 48–72 h.",
    sospensione:"Riduzione graduale; possibile discinesia da sospensione." },

  olanzapina:{ schemi:[
      { ind:"Schizofrenia", start:"5–10 mg/die (sera)", step:"+5 mg", ogni:"ogni 5–7 giorni", target:"10–20 mg/die", max:"20 mg/die",
        ratio:"Titolazione semplice grazie alla buona tollerabilità neurologica. Dose serale unica per sfruttare la sedazione; il prezzo è l'impatto metabolico, da monitorare fin dall'inizio." },
      { ind:"Episodio maniacale", start:"10–15 mg/die", step:"+5 mg", ogni:"ogni 24 h se necessario", target:"15–20 mg/die", max:"20 mg/die",
        ratio:"Nella mania si parte più alti e si sale più rapidamente: serve il controllo veloce dell'eccitamento." } ],
    generale:"Peso, circonferenza vita, glicemia/HbA1c e lipidi al basale, a 3 mesi, poi annualmente.",
    sospensione:"Riduzione graduale; rimbalzo colinergico se brusca." },

  quetiapina:{ schemi:[
      { ind:"Schizofrenia", start:"25 mg x2 il giorno 1, poi 50 mg x2, 100 mg x2, 150 mg x2", step:"secondo schema rapido", ogni:"ogni giorno nei primi 4 giorni", target:"300–600 mg/die", max:"750–800 mg/die",
        ratio:"Titolazione obbligata per l'ipotensione ortostatica da blocco α1. L'effetto antipsicotico richiede ≥300 mg: sotto si ha solo sedazione (blocco H1)." },
      { ind:"Depressione bipolare", start:"50 mg alla sera", step:"→100, →200, →300 mg", ogni:"ogni giorno fino al 4º", target:"300 mg/die", max:"300 mg/die",
        ratio:"Nella depressione bipolare la dose efficace è 300 mg: agisce il metabolita norquetiapina (inibitore NET), non il blocco D2. Salire oltre non aggiunge effetto antidepressivo." },
      { ind:"Ansia generalizzata / insonnia (off-label)", start:"25–50 mg alla sera", step:"—", ogni:"—", target:"25–100 mg", max:"non salire per questo scopo",
        ratio:"A basse dosi è di fatto un antistaminico. Uso molto diffuso ma discutibile: espone a rischio metabolico un paziente che potrebbe usare farmaci più sicuri." } ],
    generale:"Monitoraggio metabolico; attenzione all'ipotensione nell'anziano.",
    sospensione:"Riduzione graduale; insonnia da rimbalzo frequente se brusca." },

  risperidone:{ schemi:[
      { ind:"Schizofrenia", start:"1–2 mg/die", step:"+1 mg", ogni:"ogni 1–2 giorni", target:"4–6 mg/die", max:"8–10 mg/die",
        ratio:"FINESTRA STRETTA: sopra i 6 mg il risperidone perde l'atipicità e si comporta come un tipico (EPS marcati, prolattina). Il target 4–6 mg è il compromesso ottimale." },
      { ind:"Irritabilità nell'autismo / disturbo della condotta", start:"0,25–0,5 mg/die", step:"+0,25–0,5 mg", ogni:"ogni 7 giorni", target:"0,5–2 mg/die secondo peso", max:"secondo peso",
        ratio:"Dosi di un ordine di grandezza inferiori a quelle antipsicotiche: l'obiettivo è il controllo comportamentale, non la psicosi." },
      { ind:"Delirium / agitazione nella demenza (off-label, breve termine)", start:"0,25–0,5 mg/die", step:"+0,25 mg", ogni:"ogni 3–7 giorni", target:"0,5–1 mg/die", max:"2 mg/die, per il minor tempo possibile",
        ratio:"Nella demenza c'è aumento di mortalità e rischio cerebrovascolare: dose minima, durata minima, rivalutazione programmata." } ],
    generale:"Prolattina se sintomi (amenorrea, galattorrea, disfunzione sessuale).",
    sospensione:"Riduzione graduale." },

  aripiprazolo:{ schemi:[
      { ind:"Schizofrenia", start:"10–15 mg/die", step:"+5 mg", ogni:"non prima di 2 settimane", target:"10–15 mg/die", max:"30 mg/die",
        ratio:"Emivita di 75 ore: lo stato stazionario arriva in circa 2 settimane, quindi salire prima significa titolare al buio. Spesso 10–15 mg bastano." },
      { ind:"Augmentation nella depressione (off-label)", start:"2–5 mg/die", step:"+2–5 mg", ogni:"ogni 1–2 settimane", target:"5–10 mg/die", max:"15 mg/die",
        ratio:"Dosi molto basse: si sfrutta l'agonismo parziale D2/5-HT1A senza il blocco antipsicotico. L'acatisia è l'effetto limitante e compare proprio a queste dosi." },
      { ind:"Iperprolattinemia da altri antipsicotici (off-label)", start:"2,5–5 mg/die", step:"—", ogni:"—", target:"5 mg/die", max:"10 mg/die",
        ratio:"L'agonismo parziale D2 sulla via tuberoinfundibolare riduce la prolattina senza togliere l'effetto antipsicotico del farmaco principale." } ],
    generale:"Sorvegliare l'acatisia, effetto avverso caratteristico e spesso scambiato per ansia o peggioramento.",
    sospensione:"Riduzione graduale (l'emivita lunga aiuta)." },

  clozapina:{ schemi:[
      { ind:"Schizofrenia resistente", start:"12,5 mg (mezza cpr) la sera del giorno 1", step:"+25 mg/die, poi +50 mg", ogni:"quotidianamente se tollerata", target:"300–450 mg/die", max:"900 mg/die",
        ratio:"TITOLAZIONE LENTISSIMA per ipotensione, tachicardia, sedazione e rischio (raro) di miocardite. Si parte da 12,5 mg e si sale con incrementi minimi: la fretta qui è pericolosa. Se si saltano più di 48 h, RICOMINCIARE dalla dose iniziale." } ],
    generale:"Emocromo settimanale per 18 settimane, poi ogni 2 settimane fino a 1 anno, poi mensile. Troponina/PCR nelle prime 4 settimane (miocardite). Il fumo induce il CYP1A2: se il paziente smette, i livelli salgono.",
    sospensione:"Riduzione molto graduale: la sospensione brusca dà psicosi da rimbalzo e rimbalzo colinergico severi." },

  amisulpride:{ schemi:[
      { ind:"Sintomi positivi (psicosi)", start:"400 mg/die in 2 dosi", step:"+200 mg", ogni:"ogni 5–7 giorni", target:"400–800 mg/die", max:"1200 mg/die",
        ratio:"Alle dosi alte prevale il blocco D2/D3 postsinaptico: è l'effetto antipsicotico classico." },
      { ind:"Sintomi negativi / distimia (basse dosi)", start:"50 mg/die", step:"+50 mg", ogni:"ogni 1–2 settimane", target:"50–300 mg/die", max:"300 mg per questo scopo",
        ratio:"EFFETTO BIFASICO: a basse dosi il blocco è preferenzialmente sui recettori D2 PREsinaptici, che aumenta il rilascio di dopamina — effetto disinibente/attivante, opposto a quello delle dosi alte. Salire annullerebbe il beneficio." } ],
    generale:"Eliminazione renale: aggiustare nell'insufficienza renale. Iperprolattinemia molto frequente.",
    sospensione:"Riduzione graduale." },

  paliperidone:{ schemi:[
      { ind:"Schizofrenia (orale)", start:"6 mg/die al mattino", step:"+3 mg", ogni:"non prima di 5 giorni", target:"6–9 mg/die", max:"12 mg/die",
        ratio:"Formulazione OROS a rilascio osmotico: cinetica stabile, titolazione minima necessaria." },
      { ind:"Mantenimento con LAI", start:"150 mg im giorno 1, 100 mg im giorno 8 (deltoide)", step:"poi dose mensile", ogni:"mensile dal giorno 36", target:"75–150 mg/mese", max:"150 mg/mese",
        ratio:"Le due dosi di carico ravvicinate evitano la copertura orale supplementare: è il vantaggio pratico di questo LAI." } ],
    generale:"Prolattina; eliminazione renale.",
    sospensione:"Con il LAI la copertura persiste per mesi dopo l'ultima somministrazione." },

  cariprazina:{ schemi:[
      { ind:"Schizofrenia (spec. sintomi negativi)", start:"1,5 mg/die", step:"+1,5 mg", ogni:"ogni 1–2 settimane", target:"1,5–4,5 mg/die", max:"6 mg/die",
        ratio:"Emivita lunghissima (metaboliti fino a 3 settimane): gli effetti di un aumento si vedono con molto ritardo, quindi la titolazione va lenta e paziente. L'acatisia è l'effetto limitante." } ],
    generale:"Alta affinità D3: razionale sui sintomi negativi e sull'anedonia.",
    sospensione:"L'emivita lunghissima produce un auto-scalaggio." },

  lurasidone:{ schemi:[
      { ind:"Schizofrenia", start:"37 mg/die con il cibo", step:"+37 mg", ogni:"secondo risposta, dopo alcuni giorni", target:"37–74 mg/die", max:"148 mg/die",
        ratio:"ASSUNZIONE CON ALMENO 350 kcal: a digiuno la biodisponibilità si dimezza. È l'errore più frequente e la causa più comune di apparente inefficacia." },
      { ind:"Depressione bipolare", start:"18,5–37 mg/die", step:"+18,5 mg", ogni:"ogni 1–2 settimane", target:"37–74 mg/die", max:"111 mg/die",
        ratio:"Nella depressione bipolare bastano dosi inferiori a quelle antipsicotiche; profilo metabolico favorevole, utile nel lungo termine." } ],
    generale:"Il migliore profilo metabolico tra gli antipsicotici; sorvegliare acatisia.",
    sospensione:"Riduzione graduale." },

  // ===================== ADHD / STIMOLANTI =====================
  metilfenidato:{ schemi:[
      { ind:"ADHD", start:"5 mg x1–2/die (RI) o 18 mg/die (RP)", step:"+5–10 mg (RI) o +18 mg (RP)", ogni:"ogni 7 giorni", target:"0,3–1 mg/kg/die", max:"60 mg/die (adulti fino a 80 in casi selezionati)",
        ratio:"Titolazione settimanale guidata dalla risposta comportamentale e dagli effetti su appetito, sonno e cardiovascolari. L'effetto è immediato (non servono settimane): si valuta subito e si aggiusta." } ],
    generale:"Screening cardiovascolare basale; peso, altezza, PA e frequenza a ogni controllo. Prescrizione con piano terapeutico.",
    sospensione:"Sospendibile senza scalaggio; possibili 'rebound' pomeridiani a fine copertura." },

  atomoxetina:{ schemi:[
      { ind:"ADHD", start:"0,5 mg/kg/die (adulti 40 mg)", step:"→ 1,2 mg/kg/die (adulti 80 mg)", ogni:"dopo almeno 7 giorni", target:"1,2 mg/kg/die (80 mg)", max:"1,4 mg/kg o 100 mg/die",
        ratio:"A differenza degli stimolanti l'effetto NON è immediato: servono 4–6 settimane a dose piena prima di giudicare. Errore frequente: dichiararla inefficace dopo 2 settimane." } ],
    generale:"Sorvegliare umore e ideazione suicidaria nei giovani; funzione epatica se sintomi.",
    sospensione:"Sospendibile senza scalaggio." },

  guanfacina:{ schemi:[
      { ind:"ADHD", start:"1 mg/die", step:"+1 mg", ogni:"non più di una volta a settimana", target:"0,05–0,12 mg/kg/die", max:"7 mg/die secondo peso",
        ratio:"Salita di 1 mg alla settimana per limitare sedazione e ipotensione, che sono massime all'inizio e tendono a ridursi. Somministrazione serale se la sedazione è marcata." } ],
    generale:"Pressione e frequenza a ogni aumento di dose.",
    sospensione:"NON bruscamente: ipertensione da rimbalzo. Scalare di 1 mg ogni 3–7 giorni." },

  // ===================== ANSIOLITICI E IPNOTICI =====================
  pregabalin:{ schemi:[
      { ind:"Disturbo d'ansia generalizzato", start:"75 mg x2/die", step:"+150 mg/die", ogni:"dopo 7 giorni", target:"150–450 mg/die", max:"600 mg/die",
        ratio:"Effetto ansiolitico rapido (giorni, non settimane) senza dipendenza benzodiazepinica: utile come ponte o alternativa. La sedazione iniziale si attenua e giustifica la titolazione." },
      { ind:"Dolore neuropatico", start:"75 mg x2/die", step:"+150 mg/die", ogni:"dopo 3–7 giorni", target:"300–600 mg/die", max:"600 mg/die",
        ratio:"Sul dolore si sale più rapidamente cercando la dose efficace; ridurre nell'insufficienza renale." } ],
    generale:"Aggiustare secondo clearance renale. Potenziale di abuso non trascurabile.",
    sospensione:"Riduzione graduale in almeno 1 settimana (sindrome da sospensione)." },

  buspirone:{ schemi:[
      { ind:"Disturbo d'ansia generalizzato", start:"5 mg x2–3/die", step:"+5 mg", ogni:"ogni 2–3 giorni", target:"20–30 mg/die in 2–3 dosi", max:"60 mg/die",
        ratio:"NON funziona al bisogno: l'effetto compare in 1–2 settimane tramite desensibilizzazione degli autorecettori 5-HT1A. Va spiegato al paziente, altrimenti lo giudica inefficace e lo abbandona." } ],
    generale:"Nessuna dipendenza né sedazione; livelli aumentati da inibitori del CYP3A4 (pompelmo, azoli).",
    sospensione:"Sospendibile senza scalaggio." },

  alprazolam:{ schemi:[
      { ind:"Disturbo di panico (schema fisso)", start:"0,25 mg x2–3/die", step:"+0,25–0,5 mg", ogni:"ogni 3–4 giorni", target:"1,5–4 mg/die in 3–4 dosi", max:"4–6 mg/die (specialistico)",
        ratio:"Nel panico serve lo schema FISSO, non il bisogno: l'emivita breve crea ansia interdose e rinforza il comportamento di ricerca del farmaco. Preferire la formulazione a rilascio prolungato." },
      { ind:"Ansia acuta (al bisogno)", start:"0,25–0,5 mg (10–20 gtt)", step:"—", ogni:"ripetibile dopo ~1 h", target:"dose minima efficace", max:"≈ 2 mg/die al bisogno",
        ratio:"Uso limitato nel tempo: definire dall'inizio quante dosi al giorno e per quante settimane, con un piano di uscita concordato." } ],
    generale:"Tra le benzodiazepine più difficili da sospendere per l'emivita breve.",
    sospensione:"Ridurre del 10–25% ogni 1–2 settimane; considerare il passaggio a diazepam per lo scalaggio finale." },

  lorazepam:{ schemi:[
      { ind:"Ansia", start:"0,5–1 mg x2–3/die", step:"+0,5 mg", ogni:"ogni 2–3 giorni", target:"1–4 mg/die", max:"7,5–10 mg/die",
        ratio:"Emivita intermedia e nessun metabolita attivo: prevedibile e maneggevole, ideale nell'anziano e nell'epatopatico. Impostare dall'inizio la durata prevista del trattamento." },
      { ind:"Catatonia (off-label)", start:"1–2 mg (anche ev)", step:"+1–2 mg", ogni:"ogni 3 ore secondo risposta", target:"6–16 mg/die", max:"anche oltre, in ambito specialistico",
        ratio:"Nella catatonia si usano dosi molto superiori a quelle ansiolitiche e la risposta al test con lorazepam ha valore diagnostico oltre che terapeutico." } ],
    generale:"Solo glicuronazione: nessun accumulo nell'insufficienza epatica.",
    sospensione:"Ridurre del 10–25% ogni 1–2 settimane." },

  // ===================== DIPENDENZE =====================
  metadone:{ schemi:[
      { ind:"Mantenimento nella dipendenza da oppioidi", start:"20–30 mg/die (max 40 il primo giorno)", step:"+5–10 mg", ogni:"non più di ogni 3–5 giorni", target:"60–120 mg/die", max:"individualizzato",
        ratio:"LA FASE PIÙ PERICOLOSA È L'INDUZIONE: l'emivita è lunga (fino a 60 h) e i livelli continuano a salire per giorni a dose costante — la morte per overdose avviene tipicamente nella prima settimana. 'Start low, go slow' è letteralmente salvavita." } ],
    generale:"ECG se dose >100 mg/die o fattori di rischio per QT. Attenzione alle associazioni con benzodiazepine e alcol.",
    sospensione:"Scalaggio molto lento (5–10% ogni 1–2 settimane) e concordato." },

  buprenorfina:{ schemi:[
      { ind:"Dipendenza da oppioidi", start:"2–4 mg sublinguale ad astinenza iniziata", step:"+2–4 mg", ogni:"anche nella stessa giornata, poi quotidiano", target:"8–24 mg/die", max:"32 mg/die",
        ratio:"Iniziare SOLO quando l'astinenza è già iniziata (COWS ≥ 8–12): l'alta affinità μ spiazza gli agonisti pieni e può precipitare un'astinenza acuta violenta. È l'errore clinico più comune." } ],
    generale:"Effetto tetto sulla depressione respiratoria: profilo di sicurezza migliore del metadone.",
    sospensione:"Scalaggio graduale; possibile passaggio a giorni alterni per la lunga durata d'azione." },

  naltrexone:{ schemi:[
      { ind:"Dipendenza da alcol", start:"25 mg/die per 3–7 giorni", step:"→ 50 mg/die", ogni:"dopo la prima settimana", target:"50 mg/die", max:"50 mg/die (100 in casi selezionati)",
        ratio:"Mezza dose iniziale per limitare la nausea, principale causa di abbandono. Riduce il rinforzo positivo dell'alcol: efficace soprattutto sul bere pesante, non necessariamente sull'astinenza totale." },
      { ind:"Dipendenza da oppioidi", start:"50 mg/die dopo 7–10 giorni di astinenza", step:"—", ogni:"—", target:"50 mg/die", max:"50 mg/die",
        ratio:"Verificare l'astinenza (eventualmente con test al naloxone) prima di iniziare: in presenza di oppioidi precipita un'astinenza acuta." } ],
    generale:"Transaminasi prima e durante; controindicato in epatite acuta.",
    sospensione:"Sospendibile senza scalaggio (attenzione alla ritrovata sensibilità agli oppioidi: rischio di overdose)." },

  // ===================== ANTIDEMENZA =====================
  donepezil:{ schemi:[
      { ind:"Malattia di Alzheimer", start:"5 mg alla sera", step:"→ 10 mg", ogni:"dopo 4–6 settimane", target:"10 mg/die", max:"10 mg/die (23 mg dove registrato)",
        ratio:"L'attesa di 4–6 settimane prima di salire serve a far sviluppare tolleranza agli effetti colinergici gastrointestinali. Salire prima significa quasi sempre far interrompere la terapia per nausea e diarrea." } ],
    generale:"Piano Terapeutico AIFA. Attenzione a bradicardia e sincope (ECG se sintomi).",
    sospensione:"Riduzione graduale; possibile peggioramento cognitivo alla sospensione." },

  rivastigmina:{ schemi:[
      { ind:"Alzheimer / demenza nel Parkinson", start:"1,5 mg x2/die (orale) o cerotto 4,6 mg/24h", step:"+1,5 mg x2 (orale) o al cerotto successivo", ogni:"non prima di 4 settimane", target:"3–6 mg x2 o cerotto 9,5 mg/24h", max:"6 mg x2 o cerotto 13,3 mg/24h",
        ratio:"La via TRANSDERMICA riduce nettamente nausea e vomito rispetto all'orale, a parità di efficacia: nella pratica è la scelta preferibile per la tollerabilità e l'aderenza." } ],
    generale:"Piano Terapeutico AIFA. Non impegna i CYP: utile in politerapia.",
    sospensione:"Se si interrompe più di 3 giorni, ricominciare la titolazione dalla dose iniziale." },

  memantina:{ schemi:[
      { ind:"Alzheimer moderato-severo", start:"5 mg/die", step:"+5 mg", ogni:"ogni settimana", target:"20 mg/die", max:"20 mg/die",
        ratio:"Salita di 5 mg a settimana in 4 settimane per limitare capogiro e confusione iniziali. Agisce sul glutammato: si può associare a un inibitore delle colinesterasi, con meccanismi complementari." } ],
    generale:"Ridurre nell'insufficienza renale. Piano Terapeutico AIFA.",
    sospensione:"Riduzione graduale." },

  // ===================== CORRETTORI =====================
  biperidene:{ schemi:[
      { ind:"Distonia acuta (urgenza)", start:"2,5–5 mg im o ev lento", step:"ripetere", ogni:"dopo 30 minuti se persiste", target:"risoluzione della crisi", max:"≈ 10–12 mg/24h",
        ratio:"Non è una titolazione ma un antidoto: si somministra e si valuta in pochi minuti. Dopo la crisi, rivalutare l'antipsicotico invece di cronicizzare l'anticolinergico." },
      { ind:"Parkinsonismo iatrogeno", start:"1–2 mg x2/die", step:"+2 mg", ogni:"ogni 3–7 giorni", target:"4–8 mg/die", max:"12 mg/die",
        ratio:"Cercare la dose minima efficace e riverificarla periodicamente: il carico anticolinergico peggiora cognizione e discinesia tardiva, e la profilassi cronica non giustificata va evitata." } ],
    generale:"Controindicato in glaucoma ad angolo chiuso e ritenzione urinaria. Potenziale d'abuso.",
    sospensione:"Riduzione graduale (possibile rimbalzo colinergico e ricomparsa degli EPS)." },

  propranololo:{ schemi:[
      { ind:"Acatisia da neurolettici", start:"10 mg x2/die", step:"+10–20 mg/die", ogni:"ogni 2–3 giorni", target:"30–60 mg/die", max:"secondo pressione e frequenza",
        ratio:"Prima scelta nell'acatisia. Attenzione clinica fondamentale: l'acatisia viene spesso scambiata per agitazione e trattata aumentando l'antipsicotico, che la PEGGIORA." },
      { ind:"Ansia da prestazione (off-label)", start:"10–40 mg singola dose", step:"—", ogni:"30–60 min prima dell'evento", target:"dose minima efficace", max:"secondo tolleranza",
        ratio:"Blocca le manifestazioni somatiche periferiche (tremore, tachicardia, voce incrinata) senza sedare né agire sulla cognizione: per questo è preferito alle benzodiazepine in questo contesto." } ],
    generale:"Controindicato in asma/BPCO, bradicardia, blocchi AV.",
    sospensione:"NON bruscamente: rimbalzo adrenergico (tachicardia, ipertensione)." },

  clonidina:{ schemi:[
      { ind:"Astinenza da oppioidi (off-label)", start:"0,1 mg x2–3/die", step:"+0,1 mg", ogni:"secondo pressione", target:"0,3–1,2 mg/die", max:"secondo pressione",
        ratio:"Titolazione guidata dalla pressione arteriosa: sospendere o ridurre se sistolica < 90 mmHg. Agisce sui sintomi autonomici (sudorazione, crampi, tachicardia), non sul craving." } ],
    generale:"Monitorare pressione e frequenza a ogni aumento.",
    sospensione:"NON bruscamente: crisi ipertensiva da rimbalzo. Scalare in 2–4 giorni." },

  clorpromazina:{ schemi:[
      { ind:"Psicosi / agitazione", start:"25–50 mg x2–3/die (o im in acuto)", step:"+25–50 mg", ogni:"ogni 2–3 giorni", target:"200–600 mg/die", max:"1000 mg/die (ospedaliero)",
        ratio:"Bassa potenza: servono molti mg. La titolazione è limitata dall'IPOTENSIONE ORTOSTATICA (blocco α1) e dalla sedazione: salire piano e controllare la pressione, specie nell'anziano." } ],
    generale:"ECG, pressione. Fotosensibilizzazione: proteggersi dal sole.", sospensione:"Riduzione graduale (rimbalzo colinergico)." },
  flufenazina:{ schemi:[
      { ind:"Schizofrenia (orale)", start:"2,5–5 mg/die", step:"+2,5 mg", ogni:"ogni 3–7 giorni", target:"5–15 mg/die", max:"20 mg/die",
        ratio:"Alta potenza: pochi mg, ma alto rischio di EPS — titolare lentamente sorvegliando distonia e acatisia." },
      { ind:"Mantenimento con depot (decanoato)", start:"12,5 mg im di prova", step:"aggiustare dose/intervallo", ogni:"ogni 2–3 settimane", target:"12,5–50 mg/2–3 sett.", max:"secondo risposta",
        ratio:"Dose test iniziale per la tollerabilità; poi si regola su dose e intervallo. Gli EPS da decanoato persistono a lungo." } ],
    generale:"Sorvegliare EPS e discinesia tardiva.", sospensione:"Con il depot la copertura persiste settimane." },
  flupentixolo:{ schemi:[
      { ind:"Schizofrenia (orale)", start:"3–9 mg/die", step:"+3 mg", ogni:"ogni 3–7 giorni", target:"3–18 mg/die", max:"18 mg/die (orale)",
        ratio:"A basse dosi ha effetto attivante/antidepressivo, a dosi piene antipsicotico: non superare la sera per non peggiorare l'insonnia iniziale." } ],
    generale:"Sorvegliare EPS.", sospensione:"Graduale; depot persiste settimane." },
  ziprasidone:{ schemi:[
      { ind:"Schizofrenia / mania", start:"40 mg x2/die CON IL CIBO", step:"+20 mg x2", ogni:"ogni 1–2 giorni (acuto) o settimanale", target:"120–160 mg/die", max:"160 mg/die",
        ratio:"ASSUNZIONE CON PASTO ≥500 kcal: a digiuno l'assorbimento si dimezza (causa comune di finta inefficacia). Profilo metabolico favorevole, ma sorvegliare il QT." } ],
    generale:"ECG (QT); assumere sempre con cibo.", sospensione:"Riduzione graduale." },
  asenapina:{ schemi:[
      { ind:"Mania (bipolare I)", start:"5–10 mg x2/die SUBLINGUALE", step:"secondo tollerabilità", ogni:"—", target:"10–20 mg/die", max:"20 mg/die",
        ratio:"Solo sublinguale (a digiuno la biodisponibilità orale è nulla): non mangiare né bere per 10 minuti dopo. Ipoestesia orale transitoria frequente." } ],
    generale:"Profilo metabolico intermedio.", sospensione:"Riduzione graduale." },
  brexpiprazolo:{ schemi:[
      { ind:"Schizofrenia", start:"1 mg/die per 4 giorni, poi 2 mg", step:"→ 4 mg", ogni:"dopo ≥ 1 settimana", target:"2–4 mg/die", max:"4 mg/die",
        ratio:"Agonista parziale come l'aripiprazolo ma con MENO acatisia e attivazione: titolazione lenta comunque utile per la tollerabilità." } ],
    generale:"Emivita lunga (≈ 91 h): effetti degli aumenti ritardati.", sospensione:"Graduale (emivita lunga)." },
  sulpiride:{ schemi:[
      { ind:"Psicosi", start:"400 mg/die in 2 dosi", step:"+200 mg", ogni:"ogni 5–7 giorni", target:"400–800 mg/die", max:"1600 mg/die",
        ratio:"Come l'amisulpride, alle dosi alte prevale il blocco D2 postsinaptico (antipsicotico)." },
      { ind:"Distimia / somatizzazioni (basse dosi)", start:"50 mg/die", step:"+50 mg", ogni:"ogni 1–2 settimane", target:"50–150 mg/die", max:"150 mg per questo scopo",
        ratio:"Effetto bifasico: basse dosi disinibenti/attivanti (blocco presinaptico). Salire annulla il beneficio timico." } ],
    generale:"Eliminazione renale; iperprolattinemia frequente.", sospensione:"Riduzione graduale." },
  sertindolo:{ schemi:[
      { ind:"Schizofrenia (2ª linea)", start:"4 mg/die", step:"+4 mg", ogni:"ogni 4–5 giorni", target:"12–20 mg/die", max:"24 mg/die",
        ratio:"Titolazione lenta OBBLIGATA per il QT: ECG basale, durante la titolazione e a regime. Uso ristretto agli intolleranti ad altri antipsicotici." } ],
    generale:"ECG ripetuti (QT); controindicato con altri farmaci QT-prolunganti.", sospensione:"Riduzione graduale." },
  pimozide:{ schemi:[
      { ind:"Disturbo delirante / Tourette", start:"1–2 mg/die", step:"+1–2 mg", ogni:"ogni 7 giorni", target:"2–8 mg/die", max:"16 mg/die (con ECG)",
        ratio:"Titolazione molto lenta con ECG per il rischio di QT lungo/torsione di punta: evitare del tutto gli inibitori del CYP3A4." } ],
    generale:"ECG basale e periodico; interazioni CYP3A4 pericolose.", sospensione:"Riduzione graduale." },
  zuclopentixolo:{ schemi:[
      { ind:"Schizofrenia (orale)", start:"10–20 mg/die", step:"+10–20 mg", ogni:"ogni 2–3 giorni", target:"20–60 mg/die", max:"75 mg/die (orale)",
        ratio:"Esiste anche l'acetato (Acutard) ad azione di 2–3 giorni per l'agitazione acuta, distinto dal decanoato depot: non confonderli." } ],
    generale:"Sorvegliare EPS.", sospensione:"Graduale." },
  loxapina:{ schemi:[
      { ind:"Schizofrenia (orale)", start:"10 mg x2/die", step:"+10–25 mg", ogni:"ogni 2–3 giorni", target:"60–100 mg/die", max:"250 mg/die",
        ratio:"La formulazione INALATORIA (Adasuve) è solo per l'agitazione acuta in dose singola, non per il mantenimento." } ],
    generale:"Abbassa la soglia convulsiva.", sospensione:"Graduale." },
  tiapride:{ schemi:[
      { ind:"Agitazione/aggressività (anziano, alcolista)", start:"100 mg x2–3/die", step:"+100 mg", ogni:"ogni 2–3 giorni", target:"200–400 mg/die", max:"secondo funzione renale",
        ratio:"Benzamide a basso rischio di EPS: adatta all'anziano. Aggiustare nell'insufficienza renale (eliminazione renale)." } ],
    generale:"Iperprolattinemia; ridurre nell'insufficienza renale.", sospensione:"Graduale." },
  levosulpiride:{ schemi:[
      { ind:"Psicosi", start:"25–50 mg x2–3/die", step:"+50 mg", ogni:"ogni 5–7 giorni", target:"100–300 mg/die", max:"secondo risposta",
        ratio:"A basse dosi (25–75 mg) è usata come procinetico/antiemetico; l'effetto antipsicotico richiede dosi maggiori." } ],
    generale:"Iperprolattinemia molto frequente; eliminazione renale.", sospensione:"Graduale." },
  periciazina:{ schemi:[
      { ind:"Disturbi del comportamento / impulsività", start:"5–10 mg/die (gtt)", step:"+5–10 mg", ogni:"ogni 3–7 giorni", target:"10–30 mg/die", max:"secondo risposta",
        ratio:"Fenotiazina 'comportamentale': titolazione fine in gocce (1 gtt = 1 mg) per l'aggressività/impulsività. Ipotensione ortostatica il limite." } ],
    generale:"Sedazione e ipotensione; effetti anticolinergici.", sospensione:"Graduale." },
  penfluridolo:{ schemi:[
      { ind:"Schizofrenia (mantenimento)", start:"20 mg/settimana", step:"+20 mg/settimana", ogni:"ogni 1–2 settimane", target:"20–60 mg/settimana", max:"secondo risposta",
        ratio:"UNICA somministrazione orale SETTIMANALE: utile per l'aderenza senza depot. Per la durata lunghissima gli effetti avversi persistono giorni dopo la sospensione." } ],
    generale:"EPS; sorvegliare la discinesia tardiva.", sospensione:"L'effetto persiste giorni." },
  desipramina:{ schemi:[
      { ind:"Depressione", start:"25 mg/die", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"100–200 mg/die", max:"300 mg/die",
        ratio:"Il triciclico più noradrenergico e meno sedativo/anticolinergico: dare al mattino se attiva. TDM utile." } ],
    generale:"ECG basale come per gli altri triciclici.", sospensione:"Riduzione graduale (rimbalzo colinergico)." },
  mianserina:{ schemi:[
      { ind:"Depressione (con insonnia)", start:"30 mg alla sera", step:"+30 mg", ogni:"ogni 1–2 settimane", target:"30–90 mg/die", max:"90 mg/die",
        ratio:"Tetraciclico sedativo, dose serale unica. Emocromo se febbre/infezione (raro rischio di agranulocitosi)." } ],
    generale:"Meno cardiotossica dei triciclici classici.", sospensione:"Riduzione graduale." },
  reboxetina:{ schemi:[
      { ind:"Depressione", start:"4 mg x2/die", step:"→ 10 mg/die", ogni:"dopo 3–4 settimane se risposta parziale", target:"8 mg/die in 2 dosi", max:"12 mg/die",
        ratio:"Noradrenergico puro: utile su iniziativa/energia. Effetti simpaticomimetici (insonnia, sudorazione, disuria) il limite." } ],
    generale:"Cautela nella ritenzione urinaria e nella cardiopatia.", sospensione:"Riduzione graduale." },
  esketamina:{ schemi:[
      { ind:"Depressione resistente (add-on)", start:"56 mg intranasale (2 dispositivi)", step:"→ 56 o 84 mg", ogni:"2 volte/settimana per 4 settimane, poi diradamento", target:"56–84 mg/somministrazione", max:"84 mg/somministrazione",
        ratio:"Somministrazione SOLO in ambiente sanitario con osservazione ≥ 2 h (dissociazione, rialzo pressorio). Non guidare nel giorno della dose. Prosegue il SSRI/SNRI di fondo." } ],
    generale:"Monitorare PA prima e dopo; potenziale d'abuso.", sospensione:"Diradamento progressivo delle somministrazioni." },
  moclobemide:{ schemi:[
      { ind:"Depressione", start:"300 mg/die in 2 dosi dopo i pasti", step:"+150 mg", ogni:"dopo 1 settimana", target:"300–600 mg/die", max:"600 mg/die",
        ratio:"RIMA reversibile: minor rischio di crisi da tiramina rispetto agli IMAO irreversibili, ma cautela con serotoninergici. (In Italia non più in commercio.)" } ],
    generale:"Assumere dopo i pasti; evitare associazioni serotoninergiche.", sospensione:"Riduzione graduale." },
  ademetionina:{ schemi:[
      { ind:"Depressione", start:"400 mg/die (o 200–400 mg im/ev)", step:"+400 mg", ogni:"ogni 1–2 settimane", target:"800–1600 mg/die", max:"1600 mg/die",
        ratio:"Assumere al MATTINO (attivante). Nelle fasi iniziali si può usare la via parenterale, poi passare all'orale a stomaco vuoto." } ],
    generale:"Possibile viraggio maniacale nel bipolare.", sospensione:"Sospendibile senza scalaggio." },
  iperico:{ schemi:[
      { ind:"Depressione lieve-moderata", start:"300 mg x3/die (estratto standardizzato)", step:"—", ogni:"—", target:"900 mg/die", max:"900 mg/die",
        ratio:"Prima di iniziare: verificare TUTTE le terapie in corso — da potente induttore del CYP3A4 riduce l'efficacia di contraccettivi, anticoagulanti e molti farmaci. Effetto in 4–6 settimane." } ],
    generale:"Fotosensibilizzazione; interazioni maggiori.", sospensione:"Riduzione graduale (rischio teorico)." },
  oxcarbazepina:{ schemi:[
      { ind:"Disturbo bipolare (off-label) / epilessia", start:"300 mg x2/die", step:"+300–600 mg", ogni:"ogni 3–7 giorni", target:"900–1800 mg/die", max:"2400 mg/die",
        ratio:"Meno auto-induzione e meno interazioni della carbamazepina, ma maggior rischio di IPONATRIEMIA: controllare il sodio, specie nell'anziano." } ],
    generale:"Sodiemia (iponatriemia); induttore più debole della carbamazepina.", sospensione:"Riduzione graduale." },
  lisdexamfetamina:{ schemi:[
      { ind:"ADHD", start:"30 mg/die al mattino", step:"+10–20 mg", ogni:"ogni 7 giorni", target:"30–70 mg/die", max:"70 mg/die",
        ratio:"Profarmaco a copertura lunga e uniforme: titolare sulla risposta e sugli effetti (appetito, sonno, cardiovascolari). Assumere al mattino per non compromettere il sonno." } ],
    generale:"Screening cardiovascolare; peso e crescita.", sospensione:"Sospendibile senza scalaggio." },
  modafinil:{ schemi:[
      { ind:"Narcolessia", start:"200 mg/die al mattino", step:"→ 400 mg", ogni:"secondo risposta", target:"200–400 mg/die", max:"400 mg/die",
        ratio:"Induttore del CYP3A4: riduce l'efficacia dei contraccettivi orali (avvisare). Dose al mattino/mezzogiorno per non causare insonnia." } ],
    generale:"Rara reazione cutanea grave; potenziale d'abuso.", sospensione:"Sospendibile senza scalaggio." },
  acamprosato:{ schemi:[
      { ind:"Mantenimento dell'astinenza da alcol", start:"666 mg x3/die (≥60 kg)", step:"—", ogni:"—", target:"2 g/die (1,3 g se <60 kg)", max:"2 g/die",
        ratio:"Dose fissa da subito (non si titola): iniziare appena raggiunta l'astinenza e proseguire anche in caso di ricaduta. Ben tollerato, principale effetto la diarrea." } ],
    generale:"Ridurre/controindicare nell'insufficienza renale grave.", sospensione:"Sospendibile senza scalaggio." },
  disulfiram:{ schemi:[
      { ind:"Deterrenza nella dipendenza da alcol", start:"400 mg/die (o a giorni alterni)", step:"—", ogni:"—", target:"200–400 mg/die", max:"secondo tollerabilità",
        ratio:"Iniziare solo dopo ≥ 24 h di astinenza. Efficacia legata alla SUPERVISIONE dell'assunzione. Informare il paziente della reazione (anche con alcol 'nascosto' in colluttori, salse, farmaci)." } ],
    generale:"Transaminasi (epatotossicità); inibitore di più CYP.", sospensione:"L'effetto persiste giorni dopo la sospensione." },
  nalmefene:{ schemi:[
      { ind:"Riduzione del consumo di alcol", start:"18 mg AL BISOGNO", step:"—", ogni:"nei giorni a rischio di bere, 1–2 h prima", target:"18 mg nei giorni a rischio", max:"18 mg/die",
        ratio:"Non è una terapia fissa: si assume solo quando si prevede il rischio di bere. Approccio della 'riduzione del consumo', non necessariamente astinenza." } ],
    generale:"Controindicato con oppioidi in atto.", sospensione:"Sospendibile senza scalaggio." },
  vareniclina:{ schemi:[
      { ind:"Cessazione del fumo", start:"0,5 mg/die (gg 1–3), 0,5 mg x2 (gg 4–7)", step:"→ 1 mg x2", ogni:"dal giorno 8", target:"1 mg x2/die", max:"1 mg x2/die",
        ratio:"Iniziare 1–2 settimane PRIMA della data di cessazione, mentre si fuma ancora. La titolazione degli 8 giorni riduce la nausea. Sorvegliare umore e comportamento." } ],
    generale:"Aggiustare nell'insufficienza renale.", sospensione:"Ciclo di 12 settimane; sospendibile." },
  oxibato:{ schemi:[
      { ind:"Astinenza/mantenimento nell'alcolismo", start:"≈ 50 mg/kg/die in 3–6 dosi", step:"secondo protocollo", ogni:"—", target:"50–100 mg/kg/die frazionati", max:"secondo protocollo",
        ratio:"Emivita brevissima: dosi ravvicinate. ELEVATO potenziale d'abuso → erogazione controllata, affidamento a un referente. Pericoloso con alcol, BDZ, oppioidi." } ],
    generale:"Uso ospedaliero/specialistico; non se il paziente sta ancora bevendo.", sospensione:"Scalaggio controllato." },
  baclofene:{ schemi:[
      { ind:"Spasticità", start:"5 mg x3/die", step:"+5 mg x3", ogni:"ogni 3 giorni", target:"30–75 mg/die", max:"75–80 mg/die (spasticità)",
        ratio:"Titolazione graduale per la sedazione. Aggiustare nell'insufficienza renale." },
      { ind:"Dipendenza da alcol (off-label, anti-craving)", start:"5 mg x3/die", step:"aumenti progressivi", ogni:"settimanali, sotto supervisione", target:"dose individuale (anche elevata)", max:"specialistico",
        ratio:"L'uso ad alte dosi resta off-label e controverso: solo sotto stretta supervisione. Non sospendere mai bruscamente (convulsioni, confusione)." } ],
    generale:"Escrezione renale; sedazione.", sospensione:"MAI bruscamente: sindrome da sospensione grave." },
  galantamina:{ schemi:[
      { ind:"Malattia di Alzheimer", start:"8 mg/die (RP) al mattino", step:"→ 16 mg", ogni:"dopo ≥ 4 settimane", target:"16–24 mg/die", max:"24 mg/die",
        ratio:"Attesa di 4 settimane tra gli aumenti per la tollerabilità gastrointestinale colinergica (nausea, vomito, calo ponderale). Assumere con il cibo." } ],
    generale:"Piano Terapeutico AIFA; cautela in bradiaritmie.", sospensione:"Riduzione graduale." },
  triesifenidile:{ schemi:[
      { ind:"Parkinsonismo iatrogeno", start:"1 mg/die", step:"+2 mg", ogni:"ogni 3–5 giorni", target:"5–15 mg/die in dosi refratte", max:"15 mg/die",
        ratio:"Cercare la dose minima efficace: il carico anticolinergico peggiora cognizione e discinesia tardiva. Solo orale (nella distonia acuta si usa il biperidene parenterale)." } ],
    generale:"Controindicazioni anticolinergiche; cautela nell'anziano.", sospensione:"Riduzione graduale." },
  amantadina:{ schemi:[
      { ind:"Parkinsonismo / discinesie", start:"100 mg/die", step:"→ 100 mg x2", ogni:"dopo 1 settimana", target:"200 mg/die", max:"300 mg/die",
        ratio:"Alternativa agli anticolinergici (nessun carico anticolinergico), utile nell'anziano. Può slatentizzare psicosi (azione dopaminergica): cautela nello schizofrenico. Non dare la sera (insonnia)." } ],
    generale:"Escrezione renale; livedo reticularis, edemi.", sospensione:"NON bruscamente." },
  diazepam:{ schemi:[
      { ind:"Ansia", start:"2–5 mg x2–3/die", step:"di norma NON si titola al rialzo", ogni:"—", target:"5–20 mg/die (dose minima efficace)", max:"secondo indicazione",
        ratio:"Le benzodiazepine non si titolano come gli antidepressivi: si sceglie la dose minima efficace e si limita la durata (2–4 settimane). Emivita lunga con metaboliti attivi → accumulo nell'anziano." } ],
    generale:"Definire dall'inizio durata e piano di sospensione.", sospensione:"Scalare del 10–25% ogni 1–2 settimane; l'emivita lunga facilita lo scalaggio (usato come 'ponte' per sospendere BDZ a emivita breve)." },
  clonazepam:{ schemi:[
      { ind:"Disturbo di panico / ansia", start:"0,25–0,5 mg x2/die", step:"+0,25–0,5 mg", ogni:"ogni 3–7 giorni (se necessario)", target:"1–2 mg/die", max:"4 mg/die",
        ratio:"Emivita lunga: copertura stabile senza ansia interdose (vantaggio sull'alprazolam nel panico). Comunque a rischio di dipendenza: durata limitata e uscita programmata." } ],
    generale:"Nell'epilessia dosi maggiori (specialistico).", sospensione:"Scalare lentamente (emivita lunga aiuta)." },
  bromazepam:{ schemi:[
      { ind:"Ansia", start:"1,5–3 mg x2–3/die (gtt: 10 gtt = 1 mg)", step:"NON titolare al rialzo", ogni:"—", target:"3–9 mg/die", max:"secondo tollerabilità",
        ratio:"Dose minima efficace e uso breve. La formulazione in gocce consente titolazioni fini in fase di sospensione." } ],
    generale:"Durata limitata; piano di uscita.", sospensione:"Scalaggio graduale." },
  delorazepam:{ schemi:[
      { ind:"Ansia / insonnia", start:"0,5–1 mg x2/die", step:"NON titolare al rialzo", ogni:"—", target:"1–3 mg/die", max:"secondo tollerabilità",
        ratio:"Emivita lunga (accumulo nell'anziano): dose minima e durata breve. Utile anche nell'astinenza alcolica." } ],
    generale:"Accumulo nell'anziano.", sospensione:"Scalaggio graduale." },
  clordiazepossido:{ schemi:[
      { ind:"Astinenza alcolica", start:"25–50 mg ogni 6 h (schema a scalare)", step:"riduzione progressiva", ogni:"nei giorni successivi", target:"scalaggio in 5–7 giorni", max:"secondo protocollo/CIWA",
        ratio:"Emivita lunga con metaboliti attivi: 'auto-scalaggio' utile nell'astinenza. Ridurre le dosi nell'epatopatico (preferire lorazepam/oxazepam se epatopatia grave)." } ],
    generale:"Schema sintomo-guidato (CIWA-Ar).", sospensione:"Scalaggio programmato." },
  oxazepam:{ schemi:[
      { ind:"Ansia / insonnia", start:"15 mg x2–3/die", step:"NON titolare al rialzo", ogni:"—", target:"30–60 mg/die", max:"secondo tollerabilità",
        ratio:"Solo GLICURONAZIONE (nessun metabolita attivo): il più sicuro nell'epatopatico e nell'anziano. Insorgenza lenta → poco 'gratificante', minor abuso." } ],
    generale:"Sicuro nell'insufficienza epatica.", sospensione:"Scalaggio graduale." },
  temazepam:{ schemi:[
      { ind:"Insonnia", start:"10–20 mg alla sera", step:"NON aumentare oltre 20 mg", ogni:"—", target:"10–20 mg", max:"20 mg/24h",
        ratio:"Ipnotico glicuronato (sicuro nell'epatopatico), durata intermedia: buono per il MANTENIMENTO del sonno. Uso breve, non ripetere nella notte." } ],
    generale:"Sicuro nell'insufficienza epatica.", sospensione:"Scalaggio graduale se uso prolungato." },
  lormetazepam:{ schemi:[
      { ind:"Insonnia", start:"1 mg alla sera (0,5 mg anziano)", step:"NON aumentare", ogni:"—", target:"0,5–1 mg", max:"1 mg/24h",
        ratio:"Ipnotico glicuronato a durata intermedia: dose serale unica, uso breve. La formulazione in gocce facilita la riduzione in fase di sospensione." } ],
    generale:"Sicuro nell'epatopatico.", sospensione:"Scalaggio graduale." },
  zolpidem:{ schemi:[
      { ind:"Insonnia", start:"10 mg alla sera (5 mg anziano/donna)", step:"NON superare 10 mg", ogni:"—", target:"5–10 mg", max:"10 mg/24h",
        ratio:"Uso breve (max 2–4 settimane): assumere subito prima di coricarsi, con ≥ 7–8 h di sonno disponibili. Rischio di comportamenti automatici notturni (guida, alimentazione in amnesia)." } ],
    generale:"Non associare ad alcol; cautela nell'anziano (cadute).", sospensione:"Insonnia da rimbalzo se sospensione brusca dopo uso prolungato." },
  zopiclone:{ schemi:[
      { ind:"Insonnia", start:"7,5 mg alla sera (3,75 mg anziano)", step:"NON superare 7,5 mg", ogni:"—", target:"3,75–7,5 mg", max:"7,5 mg/24h",
        ratio:"Uso breve; sapore metallico frequente. Come tutti gli ipnotici, definire durata e strategia di uscita per evitare la cronicizzazione." } ],
    generale:"Cautela nell'anziano.", sospensione:"Riduzione graduale se uso prolungato." },
  gabapentin:{ schemi:[
      { ind:"Dolore neuropatico / ansia (off-label)", start:"300 mg il giorno 1, 300 mg x2 il gg 2, 300 mg x3 il gg 3", step:"+300 mg/die", ogni:"ogni 1–3 giorni", target:"900–3600 mg/die in 3 dosi", max:"3600 mg/die",
        ratio:"Titolazione classica '300-300-300': assorbimento SATURABILE (biodisponibilità cala salendo di dose) → si frazionano le somministrazioni. Ridurre nell'insufficienza renale." } ],
    generale:"Escrezione renale; potenziale d'abuso, cautela con oppioidi.", sospensione:"Riduzione graduale." },
  idrossizina:{ schemi:[
      { ind:"Ansia", start:"25 mg x2–3/die", step:"secondo necessità", ogni:"—", target:"25–100 mg/die", max:"100 mg/die",
        ratio:"Ansiolitico antistaminico SENZA dipendenza: utile quando le benzodiazepine sono da evitare. Attenzione al QT ad alte dosi." } ],
    generale:"Effetti anticolinergici nell'anziano; QT.", sospensione:"Sospendibile senza scalaggio." },
  clobazam:{ schemi:[
      { ind:"Ansia", start:"10 mg/die", step:"+10 mg", ogni:"secondo necessità", target:"10–30 mg/die", max:"30 mg/die (ansia)",
        ratio:"1,5-benzodiazepina: meno sedativa a parità di effetto. Nell'epilessia dosi maggiori (fino a 40–80 mg, specialistico)." } ],
    generale:"Metabolita attivo accumulato nei lenti del CYP2C19.", sospensione:"Scalaggio graduale." },
  quazepam:{ schemi:[
      { ind:"Insonnia", start:"7,5–15 mg alla sera", step:"NON aumentare oltre 15 mg", ogni:"—", target:"7,5–15 mg", max:"15 mg/24h",
        ratio:"Selettivo ω1 (meno miorilassante) ma emivita LUNGA: sedazione residua diurna e accumulo, sconsigliato nell'anziano. Uso breve." } ],
    generale:"Accumulo; sconsigliato nell'anziano.", sospensione:"Scalaggio graduale." },
  clometiazolo:{ schemi:[
      { ind:"Astinenza alcolica", start:"2–4 cps iniziali (schema a scalare)", step:"riduzione progressiva", ogni:"in 5–6 giorni", target:"scalaggio completo in <9 giorni", max:"secondo protocollo",
        ratio:"Solo cicli BREVI e supervisionati per l'elevato potenziale di dipendenza. Mai se il paziente sta ancora bevendo (depressione respiratoria con l'alcol)." } ],
    generale:"Biodisponibilità aumentata nell'epatopatico (ridurre).", sospensione:"Scalaggio in pochi giorni; non cronicizzare." },
  levomepromazina:{ schemi:[{ ind:"Psicosi con agitazione / palliazione", start:"25 mg x2–3/die (o im)", step:"+25 mg", ogni:"ogni 2–3 giorni", target:"75–200 mg/die", max:"secondo risposta", ratio:"Molto sedativa e ipotensiva: titolare piano controllando la pressione. Utile in cure palliative per sedazione e dolore." }], generale:"Ipotensione ortostatica marcata; ECG.", sospensione:"Riduzione graduale." },
  promazina:{ schemi:[{ ind:"Agitazione / stati confusionali", start:"25–50 mg x2–3/die (gtt: 1 gtt = 2 mg)", step:"+25–50 mg", ogni:"ogni 2–3 giorni", target:"100–300 mg/die", max:"secondo risposta", ratio:"Bassa potenza, sedativa: adatta all'agitazione dell'anziano. Titolazione fine possibile in gocce." }], generale:"Ipotensione; sedazione.", sospensione:"Riduzione graduale." },
  perfenazina:{ schemi:[{ ind:"Psicosi", start:"4–8 mg x2–3/die", step:"+4–8 mg", ogni:"ogni 3–5 giorni", target:"12–24 mg/die", max:"64 mg/die", ratio:"Media potenza: compromesso tra EPS (meno dell'aloperidolo) e sedazione/ipotensione (meno della clorpromazina)." }], generale:"Sorvegliare EPS.", sospensione:"Riduzione graduale." },
  clotiapina:{ schemi:[{ ind:"Psicosi acuta / agitazione / insonnia grave", start:"40 mg/die", step:"+40 mg", ogni:"ogni 2–3 giorni", target:"80–120 mg/die", max:"360 mg/die", ratio:"Molto sedativa: usata anche per insonnia grave in ambito specialistico. Titolare sulla sedazione desiderata." }], generale:"Sedazione marcata.", sospensione:"Riduzione graduale." },
  bromperidolo:{ schemi:[{ ind:"Psicosi", start:"1–3 mg/die (gtt 1%)", step:"+1–3 mg", ogni:"ogni 3–5 giorni", target:"5–10 mg/die", max:"15 mg/die", ratio:"Analogo dell'aloperidolo: alta potenza, alto rischio di EPS. Titolazione fine in gocce." }], generale:"EPS; QT ad alte dosi.", sospensione:"Riduzione graduale." },
  trimipramina:{ schemi:[{ ind:"Depressione con insonnia/ansia", start:"25 mg alla sera", step:"+25 mg", ogni:"ogni 3–7 giorni", target:"75–150 mg/die", max:"200 mg/die", ratio:"Il triciclico più sedativo (poco effetto sul sonno REM): dose serale unica. Marcato carico anticolinergico." }], generale:"ECG basale; sedazione.", sospensione:"Riduzione graduale (rimbalzo colinergico)." },
  dotiepina:{ schemi:[{ ind:"Depressione con ansia", start:"25–75 mg alla sera", step:"+25–75 mg", ogni:"ogni 3–7 giorni", target:"75–150 mg/die", max:"150 mg/die (225 ospedaliero)", ratio:"Sedativa; particolarmente CARDIOTOSSICA in overdose: prudenza nel paziente a rischio suicidario (prescrivere quantità limitate)." }], generale:"ECG; molto pericolosa in sovradosaggio.", sospensione:"Riduzione graduale." },
  maprotilina:{ schemi:[{ ind:"Depressione", start:"25 mg/die", step:"+25 mg", ogni:"ogni 7 giorni (lenta)", target:"75–150 mg/die", max:"150 mg/die", ratio:"Tetraciclico noradrenergico: abbassa la soglia convulsiva più degli altri → titolazione lenta e cautela nell'epilessia." }], generale:"Rischio convulsivo dose-dipendente.", sospensione:"Riduzione graduale." },
  fenelzina:{ schemi:[{ ind:"Depressione atipica/resistente", start:"15 mg x3/die", step:"+15 mg", ogni:"ogni 1–2 settimane", target:"45–60 mg/die", max:"90 mg/die (ospedaliero)", ratio:"IMAO irreversibile: dieta priva di tiramina, wash-out di 2 settimane da/verso serotoninergici. Effetto in 2–4 settimane. (In Italia non più in commercio.)" }], generale:"Dieta senza tiramina; interazioni gravi.", sospensione:"Riduzione graduale; l'inibizione enzimatica recupera in 1–2 settimane." },
  tranilcipromina:{ schemi:[{ ind:"Depressione resistente", start:"10 mg x2/die", step:"+10 mg", ogni:"ogni 1–2 settimane", target:"20–30 mg/die", max:"secondo risposta", ratio:"IMAO con componente attivante (struttura anfetamino-simile): dieta senza tiramina, wash-out di 2 settimane. (In Italia non più in commercio.)" }], generale:"Dieta senza tiramina; potenziale attivante.", sospensione:"Riduzione graduale." },
  tianeptina:{ schemi:[{ ind:"Depressione", start:"12,5 mg x3/die", step:"dose fissa", ogni:"—", target:"37,5 mg/die", max:"37,5 mg/die", ratio:"Dose fissa (non si titola). Attenzione al potenziale d'abuso ad alte dosi (agonismo μ-oppioide): non aumentare oltre lo schema." }], generale:"Metabolismo non CYP; abuso ad alte dosi.", sospensione:"Riduzione graduale." },
  prometazina:{ schemi:[{ ind:"Sedazione / ansia (adiuvante)", start:"25 mg (os o im)", step:"secondo necessità", ogni:"—", target:"25–50 mg per dose", max:"100 mg/24h", ratio:"Antistaminico sedativo senza dipendenza; in psichiatria soprattutto in associazione all'aloperidolo im per l'agitazione. Effetti anticolinergici." }], generale:"Sedazione; effetti anticolinergici.", sospensione:"Sospendibile senza scalaggio." },
  prazepam:{ schemi:[{ ind:"Ansia", start:"10–20 mg/die (gtt: 10 gtt = 5 mg)", step:"NON titolare al rialzo", ogni:"—", target:"20–60 mg/die", max:"secondo tollerabilità", ratio:"Profarmaco a lunga durata (via nordazepam): dose minima efficace, durata limitata, accumulo nell'anziano." }], generale:"Accumulo nell'anziano.", sospensione:"Scalaggio graduale." },
  pinazepam:{ schemi:[{ ind:"Ansia / insonnia", start:"5 mg/die", step:"NON titolare al rialzo", ogni:"—", target:"5–20 mg/die", max:"secondo tollerabilità", ratio:"Lunga durata: dose minima, uso breve, piano di uscita." }], generale:"Accumulo nell'anziano.", sospensione:"Scalaggio graduale." },
  nordazepam:{ schemi:[{ ind:"Ansia", start:"5 mg x1–2/die", step:"NON titolare al rialzo", ogni:"—", target:"5–15 mg/die", max:"secondo tollerabilità", ratio:"Metabolita attivo comune a molte BDZ, emivita molto lunga: dose minima e durata breve." }], generale:"Accumulo nell'anziano.", sospensione:"Scalaggio graduale." },
  ketazolam:{ schemi:[{ ind:"Ansia", start:"15 mg/die (serale)", step:"NON titolare al rialzo", ogni:"—", target:"15–45 mg/die", max:"secondo tollerabilità", ratio:"Profarmaco a lunga durata: spesso dose unica serale, uso breve." }], generale:"Accumulo nell'anziano.", sospensione:"Scalaggio graduale." },
  etizolam:{ schemi:[{ ind:"Ansia / insonnia", start:"0,5 mg x2/die", step:"NON titolare al rialzo", ogni:"—", target:"0,5–3 mg/die", max:"secondo tollerabilità", ratio:"Tienodiazepina a insorgenza rapida: efficace ma con potenziale d'abuso — uso breve e uscita programmata." }], generale:"Potenziale d'abuso.", sospensione:"Scalaggio graduale." },
  clotiazepam:{ schemi:[{ ind:"Ansia", start:"5 mg x2/die", step:"NON titolare al rialzo", ogni:"—", target:"5–15 mg/die", max:"secondo tollerabilità", ratio:"Emivita breve-intermedia: dose minima, durata limitata." }], generale:"Uso breve.", sospensione:"Scalaggio graduale." },
  flurazepam:{ schemi:[{ ind:"Insonnia", start:"15–30 mg alla sera", step:"NON aumentare oltre 30 mg", ogni:"—", target:"15–30 mg", max:"30 mg/24h", ratio:"Emivita lunga con metaboliti attivi: hangover e accumulo → sconsigliato nell'anziano. Uso breve." }], generale:"Sedazione residua diurna.", sospensione:"Scalaggio se uso prolungato." },
  flunitrazepam:{ schemi:[{ ind:"Insonnia grave", start:"0,5–1 mg alla sera", step:"NON aumentare", ogni:"—", target:"0,5–1 mg", max:"1 mg/24h", ratio:"Uso ristretto per l'ELEVATO potenziale d'abuso: solo casi selezionati, cicli brevi, sorveglianza." }], generale:"Alto potenziale d'abuso.", sospensione:"Scalaggio graduale." },
  nitrazepam:{ schemi:[{ ind:"Insonnia", start:"5 mg alla sera", step:"NON aumentare", ogni:"—", target:"5 mg", max:"10 mg/24h", ratio:"Lunga durata: sedazione residua diurna, cautela nell'anziano. Uso breve." }], generale:"Sedazione residua.", sospensione:"Scalaggio graduale." },
  estazolam:{ schemi:[{ ind:"Insonnia", start:"1–2 mg alla sera", step:"NON aumentare", ogni:"—", target:"1–2 mg", max:"2 mg/24h", ratio:"Durata intermedia: dose serale unica, uso breve, uscita programmata." }], generale:"Uso breve.", sospensione:"Scalaggio graduale." },
  triazolam:{ schemi:[{ ind:"Insonnia (addormentamento)", start:"0,125–0,25 mg alla sera", step:"NON superare 0,25 mg", ogni:"—", target:"0,125–0,25 mg", max:"0,25 mg/24h", ratio:"Emivita ultrabreve: ottimo per l'addormentamento ma rischio di amnesia anterograda e ansia/insonnia da rimbalzo. Uso brevissimo." }], generale:"Amnesia e rimbalzo.", sospensione:"Rimbalzo se sospensione brusca." },
  brotizolam:{ schemi:[{ ind:"Insonnia", start:"0,25 mg alla sera", step:"NON aumentare", ogni:"—", target:"0,25 mg", max:"0,25 mg/24h", ratio:"Durata breve: dose serale unica, uso breve." }], generale:"Uso breve.", sospensione:"Scalaggio se prolungato." },
  midazolam:{ schemi:[{ ind:"Sedazione procedurale / emergenza (setting monitorato)", start:"secondo peso e indicazione", step:"titolare all'effetto", ogni:"—", target:"sedazione desiderata", max:"secondo protocollo", ratio:"Emivita ultrabreve: si titola all'effetto in ambiente con monitoraggio e presidi per le vie aeree. Non per uso ambulatoriale cronico." }], generale:"Solo setting controllato.", sospensione:"—" },
  zaleplon:{ schemi:[{ ind:"Insonnia (addormentamento)", start:"10 mg alla sera", step:"NON superare 10 mg", ogni:"—", target:"10 mg", max:"10 mg/24h", ratio:"Emivita ultrabreve (≈ 1 h): minimo hangover, si può assumere anche per risvegli precoci se restano ≥ 4 h di sonno. Uso breve." }], generale:"Minimo effetto residuo.", sospensione:"Sospendibile." },
  daridorexant:{ schemi:[{ ind:"Insonnia", start:"50 mg alla sera", step:"dose fissa", ogni:"—", target:"50 mg", max:"50 mg/24h", ratio:"Antagonista dell'orexina (meccanismo diverso dalle BDZ): dose fissa, assumere ≥ 30 min prima di coricarsi con ≥ 7 h disponibili. Minor rischio di dipendenza." }], generale:"Sonnolenza residua se sonno insufficiente.", sospensione:"Sospendibile senza scalaggio." },
  melatonina:{ schemi:[{ ind:"Insonnia (≥55 anni) / ritmo circadiano", start:"2 mg (rilascio prolungato) alla sera", step:"dose fissa", ogni:"—", target:"2 mg", max:"2 mg/24h", ratio:"Non è un ipnotico potente: agisce su latenza e ritmo. Assumere 1–2 h prima di coricarsi, a orario costante. La fluvoxamina ne aumenta molto i livelli (inibizione 1A2)." }], generale:"Ben tollerata.", sospensione:"Sospendibile senza scalaggio." },
};

/* ---- SOSTANZE D'ABUSO: da conoscere per gestirle. Intossicazione, overdose, astinenza e GESTIONE clinica.
   Riferimenti tossicologici standard (Maudsley, Goldfrank, testo): la gestione va individualizzata e in setting adeguato. ---- */
const SOSTANZE = [
  { id:"alcol", nome:"Alcol (etanolo)", cat:"depressore",
    mecc:"Potenziamento GABA-A e inibizione NMDA: depressione progressiva del SNC. Tolleranza e dipendenza fisica marcate.",
    intox:"Disinibizione → euforia → atassia, disartria, sedazione → stupor/coma. Nistagmo, ipoglicemia, ipotermia.",
    overdose:"Depressione respiratoria e coma (spec. con altri depressori); rischio di ab ingestis. Alcolemia molto elevata.",
    astinenza:"PERICOLOSA: tremore e ansia (6–12 h) → allucinazioni e convulsioni (12–48 h) → delirium tremens (48–72 h, mortalità se non trattato).",
    gestione:"Astinenza: benzodiazepine sintomo-guidate (CIWA-Ar) — diazepam/clordiazepossido, lorazepam se epatopatia; TIAMINA 100–300 mg PRIMA del glucosio (Wernicke); idratazione ed elettroliti. Intossicazione grave: supporto respiratorio.",
    note:"Farmaci per il mantenimento dell'astinenza: naltrexone, acamprosato, disulfiram, nalmefene, sodio oxibato (nel catalogo)." },

  { id:"oppioidi", nome:"Oppioidi (eroina, morfina, fentanil)", cat:"depressore",
    mecc:"Agonisti dei recettori oppioidi μ: analgesia, euforia, depressione respiratoria. Il fentanil è ~100x la morfina (rischio di overdose elevatissimo).",
    intox:"TRIADE: miosi puntiforme + depressione respiratoria + sedazione/coma. Bradicardia, ipotensione, ipotermia.",
    overdose:"Arresto respiratorio (causa di morte). Con il fentanil e gli analoghi l'overdose è rapidissima.",
    astinenza:"SGRADEVOLE ma NON letale: midriasi, lacrimazione, rinorrea, sbadigli, piloerezione, crampi addominali, diarrea, mialgie, ansia. Picco 36–72 h (eroina).",
    gestione:"Overdose: NALOXONE 0,4–2 mg im/ev/intranasale, ripetibile ogni 2–3 min; attenzione alla ri-narcotizzazione con oppioidi a lunga durata. Astinenza/mantenimento: metadone o buprenorfina (sostitutivi); clonidina/lofexidina per i sintomi autonomici.",
    note:"Naloxone intranasale nei programmi di riduzione del danno (uso extraospedaliero)." },

  { id:"cocaina", nome:"Cocaina", cat:"stimolante",
    mecc:"Inibizione del reuptake di dopamina, noradrenalina e serotonina + blocco dei canali del sodio (effetto anestetico locale/proaritmico).",
    intox:"Euforia, iperattività, logorrea, midriasi, ipertensione, tachicardia, ipertermia. Aggressività, ansia, psicosi paranoide.",
    overdose:"Emergenze cardiovascolari (infarto, aritmie, dissezione aortica), ictus, convulsioni, ipertermia maligna, rabdomiolisi.",
    astinenza:"NON fisica grave: 'crash' con disforia, astenia, ipersonnia, iperfagia, craving intenso, anedonia. Rischio depressivo/suicidario.",
    gestione:"BENZODIAZEPINE come cardine (agitazione, ipertensione, convulsioni, protezione cardiaca). Raffreddamento attivo. Nitrati/calcio-antagonisti per l'ischemia. NON beta-bloccanti da soli (ipertensione da stimolazione α non contrastata).",
    note:"Nessun farmaco sostitutivo approvato; il disulfiram è studiato off-label." },

  { id:"amfetamine", nome:"Amfetamine / Metamfetamina", cat:"stimolante",
    mecc:"Rilascio e blocco del reuptake di dopamina e noradrenalina. Effetto più prolungato della cocaina; la metamfetamina è marcatamente neurotossica.",
    intox:"Come la cocaina ma più duraturo: agitazione, psicosi (indistinguibile dalla schizofrenia paranoide), ipertermia, ipertensione, bruxismo, movimenti stereotipati.",
    overdose:"Ipertermia, crisi ipertensiva, convulsioni, aritmie, rabdomiolisi, insufficienza renale.",
    astinenza:"'Crash' prolungato: ipersonnia, iperfagia, disforia, anedonia, craving; depressione che può durare settimane.",
    gestione:"Benzodiazepine per agitazione e convulsioni; antipsicotici per la psicosi persistente; raffreddamento; idratazione (rabdomiolisi). Ambiente povero di stimoli.",
    note:"La psicosi da metamfetamina può persistere a lungo dopo l'astinenza." },

  { id:"mdma", nome:"MDMA (ecstasy)", cat:"stimolante",
    mecc:"Massiccio rilascio di serotonina (ed effetto su DA/NA): 'empatogeno'. Neurotossicità serotoninergica.",
    intox:"Euforia, empatia, aumento dell'energia, bruxismo, midriasi, ipertermia. Trisma, sudorazione.",
    overdose:"IPERTERMIA maligna (spesso legata al contesto: ballo, ambiente caldo), IPONATRIEMIA (SIADH + iperidratazione compensatoria → edema cerebrale, convulsioni), sindrome serotoninergica, insufficienza epatica fulminante.",
    astinenza:"Calo dell'umore ('blue Monday/midweek blues'), astenia, difficoltà di concentrazione nei giorni successivi.",
    gestione:"RAFFREDDAMENTO aggressivo per l'ipertermia; gestione dell'IPONATRIEMIA (restrizione idrica, salina ipertonica se grave — non semplice reidratazione); benzodiazepine; supporto epatico. Attenzione alla sindrome serotoninergica.",
    note:"L'iponatriemia da MDMA è una trappola: la sete e l'iperidratazione la peggiorano." },

  { id:"catinoni", nome:"Catinoni sintetici ('sali da bagno', mefedrone)", cat:"stimolante",
    mecc:"Stimolanti simil-amfetaminici/cocaina (rilascio e blocco reuptake di monoamine); potenza e imprevedibilità elevate (NPS).",
    intox:"Agitazione grave, psicosi paranoide, allucinazioni, ipertermia, ipertensione, tachicardia; quadri di 'delirium eccitato' con violenza.",
    overdose:"Ipertermia maligna, rabdomiolisi, insufficienza renale, convulsioni, aritmie, morte.",
    astinenza:"Craving intenso, disforia, astenia, ansia.",
    gestione:"Sedazione precoce e generosa con benzodiazepine; raffreddamento; antipsicotici per la psicosi; idratazione. Sicurezza dell'operatore (comportamento imprevedibile).",
    note:"Categoria in continua evoluzione (nuove sostanze psicoattive): quadri spesso più severi degli stimolanti classici." },

  { id:"cannabis", nome:"Cannabis / THC", cat:"cannabinoide",
    mecc:"Δ9-THC: agonista parziale dei recettori cannabinoidi CB1. Effetti su memoria, percezione, umore, appetito.",
    intox:"Euforia/rilassamento, alterazione della percezione del tempo, iperemia congiuntivale, tachicardia, aumento dell'appetito. Possibili ansia acuta, attacchi di panico, sintomi psicotici transitori.",
    overdose:"Non fatale di per sé; nel bambino ingestione accidentale → sedazione marcata. Sindrome da iperemesi cannabinoide nell'uso cronico.",
    astinenza:"LIEVE: irritabilità, ansia, insonnia, calo dell'appetito, umore depresso, craving. Picco nella prima settimana.",
    gestione:"Ansia/panico acuti: rassicurazione, ambiente calmo, eventuale benzodiazepina. Sintomi psicotici: benzodiazepine ± antipsicotico. Iperemesi: idratazione, la capsaicina topica può aiutare.",
    note:"Fattore di rischio per esordio psicotico nei soggetti vulnerabili, specie con uso precoce e ad alta potenza." },

  { id:"cannabinoidi_sint", nome:"Cannabinoidi sintetici (Spice, K2)", cat:"cannabinoide",
    mecc:"Agonisti CB1 COMPLETI (non parziali come il THC) e molto più potenti: effetti imprevedibili e sproporzionati.",
    intox:"Agitazione grave, psicosi, convulsioni, tachicardia/aritmie, ipertensione, tossicità renale acuta; molto più severi del THC.",
    overdose:"Convulsioni, eventi cardiovascolari, danno renale acuto, decessi segnalati.",
    astinenza:"Più marcata di quella da cannabis: ansia, tremore, tachicardia, irritabilità.",
    gestione:"Supporto, benzodiazepine per agitazione e convulsioni, antipsicotici per la psicosi, monitoraggio cardiaco e renale.",
    note:"Non rilevati dai test standard per il THC: sospettarli in quadri gravi con test cannabinoidi negativi." },

  { id:"allucinogeni", nome:"Allucinogeni (LSD, psilocibina)", cat:"allucinogeno",
    mecc:"Agonisti dei recettori serotoninergici 5-HT2A: alterazioni percettive, sinestesie, modifiche del pensiero.",
    intox:"Allucinazioni visive, dispercezioni, alterazione del tempo e dell'io, midriasi, tachicardia. 'Bad trip': ansia intensa, panico, paranoia.",
    overdose:"Raramente pericolosa fisicamente; rischi legati al comportamento (traumi, condotte pericolose) durante il 'bad trip'.",
    astinenza:"Nessuna sindrome fisica. Possibili flashback (disturbo persistente da percezione da allucinogeni).",
    gestione:"'TALKING DOWN': ambiente tranquillo, poco illuminato, rassicurazione. Benzodiazepine se agitazione/ansia grave. Antipsicotici solo se necessario (possono abbassare la soglia e prolungare).",
    note:"Tolleranza rapida (tachifilassi); non danno dipendenza fisica." },

  { id:"dissociativi", nome:"Ketamina / PCP (dissociativi)", cat:"dissociativo",
    mecc:"Antagonisti del recettore NMDA del glutammato: anestesia dissociativa, analgesia, allucinazioni.",
    intox:"Dissociazione, analgesia, nistagmo, ipertensione, tachicardia; a dosi alte 'K-hole' (immobilità catatonica). PCP: violenza, insensibilità al dolore, rigidità, forza abnorme.",
    overdose:"Depressione respiratoria (dosi alte), convulsioni, ipertermia, crisi ipertensiva; con il PCP rischio per sé e per gli altri.",
    astinenza:"Craving e disforia nell'uso cronico; cistite dolorosa da ketamina (uso ripetuto).",
    gestione:"Ambiente povero di stimoli, sicurezza; benzodiazepine per agitazione/convulsioni; contenzione se pericoloso; controllo di pressione e temperatura. Evitare la sovrastimolazione.",
    note:"L'esketamina intranasale (catalogo) è l'uso terapeutico controllato del meccanismo NMDA." },

  { id:"ghb", nome:"GHB / GBL", cat:"depressore",
    mecc:"Agonista dei recettori GHB e GABA-B: euforia e sedazione. Finestra dose-effetto STRETTA (dalla disinibizione al coma).",
    intox:"Euforia, disinibizione, sonnolenza → sedazione profonda e coma, tipicamente con risveglio brusco e spontaneo dopo alcune ore. Bradicardia, ipotermia, vomito.",
    overdose:"Depressione respiratoria e coma, potenziati enormemente dall'alcol e dagli altri depressori.",
    astinenza:"GRAVE (simil-alcol/BDZ): ansia, insonnia, tremore, tachicardia, sudorazione → delirium e convulsioni. Insorgenza rapida (poche ore) nell'uso frequente.",
    gestione:"Intossicazione: supporto respiratorio (il coma spesso si risolve da sé). Astinenza: benzodiazepine ad ALTE dosi, eventualmente baclofene; può richiedere la terapia intensiva.",
    note:"Il sodio oxibato (Alcover, catalogo) è il GHB a uso medico controllato." },

  { id:"inalanti", nome:"Inalanti / solventi volatili", cat:"depressore",
    mecc:"Solventi (colle, gas, aerosol): depressione del SNC aspecifica; sensibilizzano il miocardio alle catecolamine.",
    intox:"Euforia rapida e breve, atassia, disartria, allucinazioni; poi sedazione. Odore caratteristico, dermatite periorale ('glue sniffer's rash').",
    overdose:"'SUDDEN SNIFFING DEATH': aritmia fatale da sensibilizzazione catecolaminica (spesso dopo sforzo/spavento); asfissia; depressione respiratoria.",
    astinenza:"Lieve nella maggior parte dei casi (cefalea, irritabilità, tremore).",
    gestione:"Ambiente calmo, EVITARE stimoli e catecolamine (adrenalina, beta-agonisti) per il rischio aritmico; ossigeno, monitoraggio cardiaco; benzodiazepine per l'agitazione.",
    note:"Tossicità cronica d'organo grave: neurologica, epatica, renale, midollare. Frequente negli adolescenti (basso costo, facile reperibilità)." },

  { id:"nicotina", nome:"Nicotina (tabacco)", cat:"stimolante",
    mecc:"Agonista dei recettori nicotinici dell'acetilcolina: rilascio di dopamina nel circuito della ricompensa. Dipendenza molto forte.",
    intox:"Uso: attivazione, riduzione dell'ansia, aumento della concentrazione. Intossicazione acuta (rara, es. ingestione): nausea, vomito, tachicardia, poi bradicardia e debolezza.",
    overdose:"Ingestione (bambini, e-liquid): salivazione, vomito, convulsioni, depressione respiratoria.",
    astinenza:"Irritabilità, ansia, difficoltà di concentrazione, umore depresso, insonnia, aumento dell'appetito, craving intenso. Picco nei primi giorni.",
    gestione:"Cessazione: sostituti nicotinici (cerotto + formulazioni rapide), vareniclina o bupropione (catalogo). Supporto comportamentale. Nota CYP1A2: smettere di fumare aumenta i livelli di clozapina/olanzapina.",
    note:"È l'induzione del CYP1A2 (idrocarburi del fumo, non la nicotina) a ridurre clozapina e olanzapina." },

  { id:"caffeina", nome:"Caffeina", cat:"stimolante",
    mecc:"Antagonista dei recettori dell'adenosina: stimolazione del SNC, aumento della vigilanza.",
    intox:"Ansia, irrequietezza, insonnia, tremore, tachicardia, diuresi, disturbi gastrici. 'Caffeinismo' con l'uso eccessivo.",
    overdose:"Dosi molto elevate (integratori, energy drink): agitazione, aritmie, convulsioni, ipokaliemia, vomito.",
    astinenza:"Cefalea (tipica), affaticamento, sonnolenza, irritabilità, difficoltà di concentrazione. Insorgenza 12–24 h, durata alcuni giorni.",
    gestione:"Riduzione graduale per limitare la cefalea da sospensione; idratazione e benzodiazepine nell'intossicazione grave; correzione dell'ipokaliemia.",
    note:"Interazione clinica: la fluvoxamina (inibitore del CYP1A2) aumenta molto i livelli di caffeina." },
];

const SOST_CAT = {
  depressore:{ label:"Depressore SNC", color:"#3E6B8A", soft:"#E5EDF3" },
  stimolante:{ label:"Stimolante", color:"#B2543A", soft:"#F6E9E2" },
  cannabinoide:{ label:"Cannabinoide", color:"#4A7C59", soft:"#E6F0E9" },
  allucinogeno:{ label:"Allucinogeno", color:"#7A4EA8", soft:"#F0EAF7" },
  dissociativo:{ label:"Dissociativo", color:"#566B7A", soft:"#E9EEF2" },
};

/* ---- SICUREZZA: allerte salvavita (red flag), gravidanza e allattamento, popolazioni speciali, sovradosaggio.
   Livelli: salvavita (da riconoscere subito, potenzialmente fatale), grave, nota.
   Riferimenti: RCP/AIFA, Maudsley, Stahl. Individualizzare e verificare sempre l'RCP vigente. ---- */
const SICUREZZA = {
  clorpromazina:{ red:[["salvavita", "Sindrome neurolettica maligna: iperpiressia + rigidità 'a tubo di piombo' + disautonomia + ↑CK → sospendere subito e trattare in intensiva."], ["grave", "Ipotensione ortostatica marcata (blocco α1): rischio di cadute e sincope, specie nell'anziano e nelle prime dosi."], ["grave", "Abbassa la soglia convulsiva: cautela in epilessia e astinenza alcolica."]],
    grav:"Evitare se possibile; se necessario preferire molecole più studiate. Sintomi extrapiramidali e da sospensione nel neonato se usata nel 3º trimestre.", allatt:"Passa nel latte: sedazione del lattante. Sconsigliata.", anz:"Alto rischio: ipotensione, cadute, delirium, ↑mortalità nella demenza. Dosi molto ridotte.",
    rene:"Ridurre nell'insufficienza renale.", fegato:"Metabolismo epatico: ridurre; monitorare le transaminasi (colestasi).", od:"Sedazione profonda, ipotensione, aritmie, convulsioni, coma. Supporto; evitare adrenalina (inversione dell'effetto pressorio)." },
  levomepromazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Ipotensione ortostatica severa: la più marcata tra le fenotiazine."], ["grave", "Carico anticolinergico elevato: delirium nell'anziano."]],
    grav:"Evitare; usare solo se indispensabile.", allatt:"Sconsigliata (sedazione del lattante).", anz:"Molto rischiosa: ipotensione, cadute, delirium.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione profonda, ipotensione grave, coma." },
  promazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Ipotensione ortostatica e cadute nell'anziano."]],
    grav:"Evitare se possibile.", allatt:"Sconsigliata.", anz:"Dosi ridotte; rischio di cadute e delirium.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, ipotensione, aritmie." },
  perfenazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "EPS marcati: distonia acuta nelle prime 48–72 h, soprattutto nei giovani."], ["nota", "Discinesia tardiva con l'uso prolungato: rivalutare periodicamente."]],
    grav:"Evitare se possibile; EPS neonatali se usata nel 3º trimestre.", allatt:"Sconsigliata.", anz:"↑mortalità nella demenza; dosi ridotte.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS gravi, sedazione, ipotensione, aritmie." },
  aloperidolo:{ red:[["salvavita", "Sindrome neurolettica maligna: più frequente con gli antipsicotici ad alta potenza e con la somministrazione parenterale rapida."], ["salvavita", "Prolungamento del QTc e torsione di punta, soprattutto ev e ad alte dosi: ECG ed elettroliti (K, Mg)."], ["grave", "Distonia acuta nelle prime 48–72 h (crisi oculogira, torcicollo): antidoto biperidene 2,5–5 mg im/ev."], ["grave", "Acatisia: spesso scambiata per agitazione — aumentare la dose la PEGGIORA."]],
    grav:"Tra gli antipsicotici più usati in gravidanza per l'ampia esperienza; EPS e sintomi da sospensione nel neonato (3º trimestre).", allatt:"Compatibile con cautela (monitorare sedazione ed EPS del lattante).", anz:"Dosi molto basse (0,5–1 mg) nel delirium; ↑mortalità nella demenza.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS severi, ipotensione, aritmie ventricolari, sedazione. ECG e monitoraggio." },
  pimozide:{ red:[["salvavita", "QT lungo e torsione di punta: il rischio cardiaco più alto tra i tipici. ECG basale, in titolazione e a regime."], ["salvavita", "CONTROINDICATE le associazioni con inibitori del CYP3A4 (azoli, macrolidi, pompelmo) e con altri farmaci QT-prolunganti."], ["grave", "Sindrome neurolettica maligna; EPS marcati."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Evitare (rischio cardiaco).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Aritmie ventricolari gravi, EPS, convulsioni." },
  zuclopentixolo:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "EPS marcati; con il decanoato persistono per settimane dopo la sospensione."], ["nota", "Non confondere l'acetato (azione 2–3 giorni, per l'acuzie) con il decanoato (depot di mantenimento)."]],
    grav:"Evitare se possibile.", allatt:"Sconsigliato.", anz:"Dosi ridotte; ↑mortalità nella demenza.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, EPS, ipotensione." },
  tiapride:{ red:[["salvavita", "Sindrome neurolettica maligna (rara ma possibile)."], ["grave", "Prolungamento del QT ad alte dosi; iperprolattinemia marcata."]],
    grav:"Dati limitati: evitare se possibile.", allatt:"Sconsigliata.", anz:"Meglio tollerata di altri antipsicotici (pochi EPS): utile nell'agitazione, ma ridurre per la funzione renale.",
    rene:"RIDURRE secondo clearance (eliminazione renale).", fegato:"Poco impatto.", od:"Sedazione, EPS, ipotensione." },
  clotiapina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Sedazione profonda con rischio respiratorio se associata ad altri depressori."], ["grave", "Abbassa la soglia convulsiva."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Molto sedativa: rischio di cadute e delirium.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione profonda, ipotensione, depressione respiratoria." },
  loxapina:{ red:[["salvavita", "Formulazione INALATORIA: broncospasmo grave — controindicata in asma/BPCO; avere sempre un broncodilatatore disponibile."], ["salvavita", "Sindrome neurolettica maligna."], ["grave", "Abbassa la soglia convulsiva."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Cautela (sedazione, EPS).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, EPS, convulsioni." },
  flufenazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "EPS severi; con il decanoato persistono settimane: non somministrare il depot senza aver testato la tollerabilità orale."], ["nota", "Discinesia tardiva con l'uso prolungato."]],
    grav:"Evitare se possibile.", allatt:"Sconsigliata.", anz:"Alto rischio di EPS; ↑mortalità nella demenza.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS gravi, sedazione, ipotensione." },
  flupentixolo:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "EPS marcati; a basse dosi può attivare e peggiorare ansia/agitazione."]],
    grav:"Evitare se possibile.", allatt:"Sconsigliato.", anz:"Dosi ridotte.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS, sedazione, ipotensione." },
  bromperidolo:{ red:[["salvavita", "Sindrome neurolettica maligna; prolungamento del QT ad alte dosi."], ["grave", "EPS marcati (analogo dell'aloperidolo): distonia acuta nei giovani."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Dosi ridotte.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS severi, aritmie, sedazione." },
  penfluridolo:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "DURATA LUNGHISSIMA: gli effetti avversi (EPS) persistono per giorni dopo la sospensione — non si può 'togliere' rapidamente."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Sconsigliato (impossibilità di rapida sospensione).",
    rene:"Cautela.", fegato:"Ridurre.", od:"EPS prolungati, sedazione." },
  periciazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Ipotensione ortostatica; carico anticolinergico."], ["grave", "Abbassa la soglia convulsiva."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Cautela (ipotensione, delirium).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, ipotensione, EPS." },
  tioridazina:{ red:[["salvavita", "RITIRATA dal commercio per torsione di punta: valore solo storico. Non prescrivere."], ["grave", "Retinopatia pigmentaria ad alte dosi."]],
    grav:"Non in commercio.", allatt:"Non in commercio.", anz:"Non in commercio.",
    rene:"—", fegato:"—", od:"Aritmie ventricolari fatali." },
  droperidolo:{ red:[["salvavita", "Prolungamento del QT con torsione di punta: ECG obbligatorio, correggere K e Mg; uso solo ospedaliero monitorato."], ["grave", "Sindrome neurolettica maligna; ipotensione."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Cautela (QT, ipotensione).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Aritmie, ipotensione, sedazione." },
  clozapina:{ red:[["salvavita", "AGRANULOCITOSI: emocromo secondo schema obbligatorio (settimanale x18 sett., poi ogni 2 sett. fino a 1 anno, poi mensile). Febbre o mal di gola → emocromo URGENTE e sospensione se neutropenia."], ["salvavita", "MIOCARDITE/cardiomiopatia, tipicamente nelle prime 4–8 settimane: tachicardia persistente, dispnea, febbre, dolore toracico → troponina, PCR, ecocardiogramma e sospensione."], ["salvavita", "ILEO PARALITICO da stipsi grave (ipomotilità intestinale): causa di morte sottovalutata — profilassi lassativa e sorveglianza attiva dell'alvo."], ["salvavita", "SOSPENSIONE DEL FUMO → perdita dell'induzione del CYP1A2 e rialzo dei livelli fino alla tossicità (convulsioni, sedazione): ridurre la dose e dosare la clozapinemia."], ["grave", "Convulsioni dose-dipendenti (soglia più bassa di tutti gli antipsicotici)."], ["grave", "Interruzione >48 h → RICOMINCIARE la titolazione da 12,5 mg (rischio di ipotensione e collasso)."]],
    grav:"Non aumenta il rischio malformativo noto; possibile agranulocitosi neonatale — monitorare l'emocromo del neonato. Non sospendere impulsivamente nella resistente.", allatt:"Controindicata (agranulocitosi e sedazione del lattante).", anz:"Cautela estrema: ipotensione, sedazione, stipsi, delirium.",
    rene:"Cautela.", fegato:"Ridurre; sospendere se epatite.", od:"Sedazione profonda, ipersalivazione, tachicardia, convulsioni, coma. Non esiste antidoto: supporto." },
  olanzapina:{ red:[["salvavita", "Olanzapina IM: NON associare a benzodiazepine parenterali entro 1 ora (depressione cardiorespiratoria e ipotensione, decessi segnalati)."], ["salvavita", "Sindrome neurolettica maligna."], ["grave", "Sindrome metabolica marcata: peso, glicemia/HbA1c e lipidi al basale, a 3 mesi, poi annualmente. Rischio di chetoacidosi diabetica."], ["grave", "Sospensione del fumo → ↑ livelli (CYP1A2)."]],
    grav:"Tra gli antipsicotici con più dati; attenzione al diabete gestazionale e alla macrosomia. EPS/sospensione neonatali (3º trimestre).", allatt:"Compatibile con cautela (monitorare sedazione del lattante).", anz:"↑mortalità nella demenza; sedazione e cadute. Dosi ridotte.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, tachicardia, agitazione paradossa, delirium anticolinergico, coma." },
  quetiapina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Ipotensione ortostatica in titolazione (blocco α1): rispettare lo schema di salita."], ["grave", "Impatto metabolico; prolungamento del QT ad alte dosi."], ["nota", "Uso off-label a basse dosi per l'insonnia molto diffuso: rapporto rischi/benefici sfavorevole."]],
    grav:"Dati rassicuranti relativi; monitorare glicemia. EPS/sospensione neonatali (3º trimestre).", allatt:"Compatibile con cautela.", anz:"↑mortalità nella demenza; ipotensione e cadute.",
    rene:"Cautela.", fegato:"Ridurre (metabolismo epatico).", od:"Sedazione profonda, tachicardia, ipotensione, QT lungo, coma." },
  risperidone:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "EPS dose-dipendenti: sopra i 6 mg/die si comporta come un tipico."], ["grave", "Iperprolattinemia marcata: amenorrea, galattorrea, disfunzione sessuale, osteoporosi a lungo termine."], ["grave", "Nella demenza: ↑eventi cerebrovascolari e mortalità — durata minima possibile."]],
    grav:"Dati discreti; EPS/sospensione neonatali (3º trimestre).", allatt:"Cautela (passa nel latte).", anz:"Dosi molto basse; ↑eventi cerebrovascolari nella demenza.",
    rene:"RIDURRE (eliminazione renale del metabolita attivo).", fegato:"Ridurre.", od:"EPS, sedazione, ipotensione, QT lungo." },
  paliperidone:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Iperprolattinemia marcata; EPS dose-dipendenti."], ["nota", "Con il LAI la copertura (e gli effetti avversi) persiste per mesi dopo l'ultima somministrazione."]],
    grav:"Come risperidone (ne è il metabolita).", allatt:"Cautela.", anz:"Dosi ridotte; ↑mortalità nella demenza.",
    rene:"RIDURRE secondo clearance (eliminazione renale).", fegato:"Poco impatto.", od:"EPS, sedazione, QT lungo." },
  ziprasidone:{ red:[["salvavita", "Prolungamento del QT tra i più marcati: ECG, correggere K e Mg, evitare associazioni QT-prolunganti."], ["salvavita", "Sindrome neurolettica maligna."], ["grave", "ASSUMERE CON PASTO ≥500 kcal: a digiuno l'assorbimento si dimezza (finta inefficacia)."]],
    grav:"Dati limitati.", allatt:"Sconsigliato.", anz:"Cautela (QT).",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"Aritmie, sedazione, EPS." },
  asenapina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Solo SUBLINGUALE: se deglutita è inefficace (biodisponibilità orale nulla). Non mangiare né bere per 10 minuti."], ["nota", "Ipoestesia orale transitoria frequente."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Cautela; ↑mortalità nella demenza.",
    rene:"Poco impatto.", fegato:"CONTROINDICATA nell'insufficienza epatica grave (Child-Pugh C).", od:"Sedazione, agitazione, EPS." },
  lurasidone:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "ASSUMERE CON ALMENO 350 kcal: a digiuno la biodisponibilità si dimezza — errore più frequente e causa di apparente inefficacia."], ["grave", "Acatisia dose-dipendente."]],
    grav:"Dati limitati ma profilo metabolico favorevole.", allatt:"Sconsigliato.", anz:"Buon profilo metabolico; ↑mortalità nella demenza.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, EPS, ipotensione." },
  amisulpride:{ red:[["salvavita", "Prolungamento del QT dose-dipendente: ECG alle dosi alte; attenzione all'insufficienza renale (accumulo)."], ["salvavita", "Sindrome neurolettica maligna."], ["grave", "Iperprolattinemia molto marcata."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Ridurre (funzione renale); ↑mortalità nella demenza.",
    rene:"RIDURRE secondo clearance — accumulo con rischio di QT.", fegato:"Poco impatto.", od:"Sedazione, EPS, aritmie ventricolari." },
  levosulpiride:{ red:[["grave", "Iperprolattinemia molto frequente; EPS a dosi elevate."], ["grave", "Sindrome neurolettica maligna (rara)."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Ridurre (funzione renale).",
    rene:"RIDURRE (eliminazione renale).", fegato:"Poco impatto.", od:"Sedazione, EPS." },
  sulpiride:{ red:[["grave", "Iperprolattinemia marcata; EPS a dosi elevate."], ["grave", "Sindrome neurolettica maligna (rara)."]],
    grav:"Evitare se possibile.", allatt:"Sconsigliata.", anz:"Ridurre (funzione renale).",
    rene:"RIDURRE (eliminazione renale).", fegato:"Poco impatto.", od:"Sedazione, EPS, agitazione." },
  aripiprazolo:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "ACATISIA caratteristica, spesso scambiata per ansia o peggioramento clinico: riconoscerla evita aumenti di dose controproducenti."], ["nota", "Disturbi del controllo degli impulsi (gioco d'azzardo, ipersessualità, shopping compulsivo): chiedere attivamente."], ["nota", "Emivita 75 h: gli effetti di ogni variazione si vedono dopo ~2 settimane."]],
    grav:"Dati crescenti e rassicuranti.", allatt:"Cautela.", anz:"Buon profilo metabolico; ↑mortalità nella demenza.",
    rene:"Poco impatto.", fegato:"Ridurre con inibitori del 2D6/3A4.", od:"Sedazione, vomito, tremore; generalmente benigno." },
  cariprazina:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "ACATISIA: effetto limitante principale."], ["nota", "Emivita dei metaboliti fino a 3 settimane: variazioni di dose con effetti molto ritardati."]],
    grav:"Dati limitati; l'emivita lunghissima implica esposizione fetale prolungata anche dopo la sospensione.", allatt:"Sconsigliata.", anz:"Cautela; ↑mortalità nella demenza.",
    rene:"Evitare nell'insufficienza renale grave.", fegato:"Evitare nell'insufficienza epatica grave.", od:"Sedazione, EPS; effetti prolungati." },
  brexpiprazolo:{ red:[["salvavita", "Sindrome neurolettica maligna."], ["grave", "Acatisia (minore rispetto all'aripiprazolo)."], ["nota", "Disturbi del controllo degli impulsi come per l'aripiprazolo."]],
    grav:"Dati limitati.", allatt:"Sconsigliato.", anz:"↑mortalità nella demenza.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, EPS." },
  sertindolo:{ red:[["salvavita", "QT lungo dose-dipendente marcato: ECG basale, in titolazione e a regime; CONTROINDICATO con squilibri elettrolitici e farmaci QT-prolunganti."], ["grave", "Sindrome neurolettica maligna."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Evitare (rischio cardiaco).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Aritmie ventricolari, ipotensione." },
  litio:{ red:[["salvavita", "INTOSSICAZIONE: finestra terapeutica strettissima. Tremore grossolano, atassia, vomito, confusione → litiemia urgente, sospensione, idratazione; emodialisi nei casi gravi."], ["salvavita", "Fattori precipitanti da conoscere: DISIDRATAZIONE (febbre, diarrea, caldo, diuretici), FANS, ACE-inibitori/sartani, insufficienza renale, dieta iposodica. Educare il paziente."], ["salvavita", "MAI sospendere bruscamente: mania da rimbalzo e ↑rischio suicidario. Scalare in ≥3 mesi."], ["grave", "Ipotiroidismo e iperparatiroidismo; nefropatia tubulo-interstiziale a lungo termine."], ["grave", "Teratogeno (anomalia di Ebstein): contraccezione e counselling."]],
    grav:"Rischio malformativo cardiaco (Ebstein) nel 1º trimestre: valutare rischio/beneficio, ecocardiografia fetale, litiemia frequente; il fabbisogno cambia in gravidanza e nel post-partum.", allatt:"Passa nel latte in quantità rilevante: generalmente sconsigliato; se usato, monitorare la litiemia del lattante.", anz:"Finestra ancora più stretta: dosi ridotte, litiemia più frequente, attenzione a disidratazione e farmaci.",
    rene:"CRITICO: eliminazione renale pura. Ridurre e monitorare; controindicato nell'insufficienza grave.", fegato:"Nessun impatto (non metabolizzato).", od:"Vomito, diarrea, tremore grossolano, atassia, disartria, convulsioni, coma. Emodialisi se litiemia elevata o sintomi neurologici." },
  valproato:{ red:[["salvavita", "TERATOGENICITÀ MAGGIORE: difetti del tubo neurale e deficit cognitivi/autismo. CONTROINDICATO nella donna in età fertile senza programma di prevenzione della gravidanza e contraccezione efficace."], ["salvavita", "Epatotossicità fulminante (soprattutto <2 anni e in politerapia): vomito, letargia, ittero → transaminasi urgenti e sospensione."], ["salvavita", "Pancreatite acuta emorragica: dolore addominale intenso → amilasi/lipasi."], ["grave", "Encefalopatia iperammoniemica: confusione e letargia con valproatemia normale → dosare l'AMMONIEMIA."], ["grave", "Trombocitopenia e disfunzione piastrinica."]],
    grav:"CONTROINDICATO (salvo epilessia refrattaria senza alternative, con programma di prevenzione). Rischio malformativo ~10% e deficit neurocognitivi.", allatt:"Basso passaggio nel latte: generalmente compatibile.", anz:"Ridurre; maggiore sensibilità a sedazione e tremore.",
    rene:"Cautela.", fegato:"CONTROINDICATO nell'epatopatia; monitorare le transaminasi.", od:"Sedazione, coma, depressione respiratoria, edema cerebrale, iperammoniemia. La L-carnitina può essere utile." },
  carbamazepina:{ red:[["salvavita", "Sindrome di Stevens-Johnson / necrolisi epidermica tossica: QUALSIASI rash → sospendere subito. Screening HLA-B*1502 nelle popolazioni asiatiche."], ["salvavita", "Agranulocitosi e anemia aplastica: febbre, mal di gola, ecchimosi → emocromo urgente."], ["salvavita", "Potente INDUTTORE enzimatico: fallimento dei contraccettivi orali (gravidanze indesiderate), degli anticoagulanti e di molti psicofarmaci."], ["grave", "Iponatriemia (SIADH), spesso nell'anziano: confusione e convulsioni."], ["grave", "Auto-induzione: i livelli calano dopo 2–4 settimane — non è perdita di efficacia."]],
    grav:"Rischio di difetti del tubo neurale: supplementazione con folati, valutare alternative.", allatt:"Generalmente compatibile con monitoraggio del lattante.", anz:"Iponatriemia e atassia più frequenti; ridurre.",
    rene:"Cautela.", fegato:"Ridurre; monitorare le transaminasi.", od:"Atassia, nistagmo, convulsioni, coma, aritmie, depressione respiratoria." },
  oxcarbazepina:{ red:[["salvavita", "Reazioni cutanee gravi (cross-reattività ~25–30% con la carbamazepina): qualsiasi rash → sospendere."], ["grave", "IPONATRIEMIA più frequente della carbamazepina: sodiemia periodica, specie nell'anziano e con diuretici."], ["grave", "Riduce l'efficacia dei contraccettivi orali (induzione, seppur minore)."]],
    grav:"Rischio malformativo; folati e valutazione delle alternative.", allatt:"Cautela.", anz:"Iponatriemia frequente: controllare il sodio.",
    rene:"Ridurre secondo clearance.", fegato:"Cautela.", od:"Sedazione, atassia, iponatriemia, convulsioni." },
  lamotrigina:{ red:[["salvavita", "SINDROME DI STEVENS-JOHNSON / NET: rischio legato alla VELOCITÀ di titolazione. Qualsiasi rash (specie con febbre, mucose, malessere) → SOSPENDERE IMMEDIATAMENTE."], ["salvavita", "Con VALPROATO: dimezzare la titolazione (il valproato raddoppia i livelli inibendo la glicuronazione)."], ["salvavita", "Interruzione >5 giorni → RICOMINCIARE la titolazione da capo (si perde la tolleranza cutanea)."], ["grave", "Linfoistiocitosi emofagocitica (rara): febbre e rash con alterazioni ematologiche."]],
    grav:"Tra gli stabilizzanti più sicuri in gravidanza; i livelli CALANO marcatamente (↑clearance) — monitorare e riaggiustare, poi ridurre nel post-partum.", allatt:"Passaggio significativo nel latte: monitorare il lattante (sedazione, rash).", anz:"Generalmente ben tollerata.",
    rene:"Ridurre nell'insufficienza grave.", fegato:"Ridurre.", od:"Atassia, nistagmo, convulsioni, coma; possibile aritmia." },
  topiramato:{ red:[["salvavita", "Glaucoma acuto ad angolo chiuso (nelle prime settimane): dolore oculare e calo visivo → urgenza oftalmologica e sospensione."], ["grave", "Acidosi metabolica ipercloremica; calcolosi renale (idratazione)."], ["grave", "Oligoidrosi e ipertermia (soprattutto nel bambino, con il caldo)."], ["grave", "Rallentamento cognitivo e disturbi del linguaggio: principale causa di abbandono."], ["grave", "Teratogeno (schisi orofacciali); riduce l'efficacia dei contraccettivi ad alte dosi."]],
    grav:"Rischio di labiopalatoschisi e ipotrofia fetale: evitare, contraccezione efficace.", allatt:"Cautela.", anz:"Ridurre; rallentamento cognitivo più marcato.",
    rene:"Ridurre secondo clearance.", fegato:"Cautela.", od:"Sedazione, atassia, acidosi metabolica grave, convulsioni." },
  amitriptilina:{ red:[["salvavita", "LETALE IN SOVRADOSAGGIO: cardiotossicità (QRS largo, aritmie), convulsioni, coma. Nel paziente a rischio suicidario prescrivere quantità limitate."], ["salvavita", "Sindrome serotoninergica se associata a IMAO (controindicata), SSRI/SNRI, tramadolo, linezolid."], ["grave", "Carico anticolinergico massimo: delirium nell'anziano, ritenzione urinaria, glaucoma acuto ad angolo chiuso, ileo."], ["grave", "Ipotensione ortostatica e cadute; prolungamento del QT."], ["nota", "Viraggio maniacale nel bipolare non protetto da stabilizzante."]],
    grav:"Dati relativamente ampi; sintomi da sospensione neonatali (3º trimestre). Valutare rischio/beneficio.", allatt:"Basso passaggio: generalmente compatibile con monitoraggio.", anz:"DA EVITARE se possibile (criteri di Beers): anticolinergico, ipotensione, cadute, delirium.",
    rene:"Cautela.", fegato:"Ridurre.", od:"EMERGENZA: QRS >100 ms → bicarbonato di sodio; convulsioni → benzodiazepine; monitoraggio ECG prolungato. Evitare antiaritmici di classe Ia." },
  clomipramina:{ red:[["salvavita", "Letale in sovradosaggio (cardiotossicità, convulsioni)."], ["salvavita", "Sindrome serotoninergica: il più serotoninergico dei triciclici — CONTROINDICATA con IMAO."], ["grave", "Abbassa la soglia convulsiva alle dosi alte (>250 mg)."], ["grave", "Effetti anticolinergici e ipotensione ortostatica."]],
    grav:"Dati discreti; sintomi da sospensione neonatali.", allatt:"Cautela (monitorare il lattante).", anz:"Evitare se possibile; ridurre.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Come amitriptilina: bicarbonato se QRS largo, ECG, benzodiazepine." },
  nortriptilina:{ red:[["salvavita", "Letale in sovradosaggio."], ["grave", "FINESTRA TERAPEUTICA: efficacia persa sopra 150 ng/ml — il TDM guida la dose."], ["grave", "Cardiotossicità e QT; carico anticolinergico (minore degli altri triciclici)."]],
    grav:"Dati discreti.", allatt:"Basso passaggio: tra i triciclici preferibile.", anz:"Il triciclico meglio tollerato, ma sempre cautela.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Cardiotossicità: ECG, bicarbonato se QRS largo." },
  imipramina:{ red:[["salvavita", "Letale in sovradosaggio; controindicata con IMAO."], ["grave", "Anticolinergico, ipotensione ortostatica, QT."]],
    grav:"Dati ampi; sospensione neonatale.", allatt:"Cautela.", anz:"Evitare se possibile.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Cardiotossicità: ECG, bicarbonato." },
  desipramina:{ red:[["salvavita", "Letale in sovradosaggio; tra i triciclici il più aritmogeno segnalato."], ["grave", "Attivazione, insonnia; ipotensione."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Evitare se possibile.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Cardiotossicità marcata: ECG, bicarbonato." },
  trimipramina:{ red:[["salvavita", "Letale in sovradosaggio."], ["grave", "Carico anticolinergico e sedazione massimi: delirium nell'anziano."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Evitare (anticolinergico).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione profonda, cardiotossicità." },
  dotiepina:{ red:[["salvavita", "PARTICOLARMENTE letale in sovradosaggio (tra i triciclici più cardiotossici): prescrivere quantità limitate nel paziente a rischio."], ["grave", "Sedazione marcata; anticolinergico."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Evitare.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Alta letalità: aritmie, convulsioni, coma. ECG, bicarbonato, terapia intensiva." },
  maprotilina:{ red:[["salvavita", "RISCHIO CONVULSIVO il più alto tra gli antidepressivi: titolazione lenta, evitare nell'epilessia e con altri farmaci proconvulsivanti."], ["salvavita", "Letale in sovradosaggio."], ["grave", "Reazioni cutanee; sedazione."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Evitare.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Convulsioni prolungate, cardiotossicità." },
  trazodone:{ red:[["salvavita", "PRIAPISMO (raro ma urgenza urologica): erezione dolorosa >4 h → pronto soccorso immediato, rischio di danno permanente. Informare sempre il paziente maschio."], ["grave", "Ipotensione ortostatica e cadute (blocco α1), specie nell'anziano."], ["grave", "Prolungamento del QT; sindrome serotoninergica in associazione."], ["nota", "Antidepressivo solo ≥150 mg: sotto è un ipnotico."]],
    grav:"Dati discreti.", allatt:"Cautela.", anz:"Cadute per ipotensione: dosi basse.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, ipotensione, QT lungo, priapismo; relativamente benigno rispetto ai triciclici." },
  citalopram:{ red:[["salvavita", "QT DOSE-DIPENDENTE: tetto 40 mg/die (20 mg se >65 anni o epatopatia o inibitori del 2C19). ECG se fattori di rischio."], ["salvavita", "Sindrome serotoninergica in associazione; controindicato con IMAO (wash-out 2 settimane)."], ["grave", "IPONATRIEMIA (SIADH), soprattutto nell'anziano e con diuretici: confusione e cadute → sodiemia."], ["grave", "↑rischio di sanguinamento con FANS/antiaggreganti/anticoagulanti (protezione gastrica)."], ["nota", "Sorvegliare l'ideazione suicidaria nelle prime settimane, specie nei giovani."]],
    grav:"Generalmente compatibile; sindrome da adattamento neonatale e (raro) ipertensione polmonare persistente se usato tardivamente.", allatt:"Compatibile con monitoraggio.", anz:"Iponatriemia e cadute; tetto 20 mg.",
    rene:"Cautela.", fegato:"RIDURRE (tetto 20 mg).", od:"QT lungo, sedazione, convulsioni; ECG e monitoraggio." },
  escitalopram:{ red:[["salvavita", "QT dose-dipendente: tetto 20 mg (10 mg nell'anziano). ECG se fattori di rischio."], ["salvavita", "Sindrome serotoninergica; controindicato con IMAO."], ["grave", "Iponatriemia nell'anziano; ↑rischio emorragico con FANS/antiaggreganti."]],
    grav:"Compatibile con valutazione; adattamento neonatale.", allatt:"Compatibile con monitoraggio.", anz:"Tetto 10 mg; sodiemia.",
    rene:"Cautela.", fegato:"Ridurre.", od:"QT lungo, convulsioni; ECG." },
  fluoxetina:{ red:[["salvavita", "Sindrome serotoninergica; CONTROINDICATA con IMAO — wash-out di 5 SETTIMANE per l'emivita lunghissima (non 2 come per gli altri)."], ["grave", "Potente inibitore del CYP2D6: ↑triciclici, risperidone, atomoxetina, metoprololo; rende inefficace il tamoxifene."], ["grave", "Attivazione, insonnia, acatisia; ↑rischio emorragico."], ["nota", "Emivita lunghissima: la sospensione è facile ma le interazioni persistono per settimane."]],
    grav:"Tra gli SSRI più studiati; adattamento neonatale.", allatt:"Passaggio maggiore di altri SSRI: preferire sertralina.", anz:"Iponatriemia; attivazione.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Generalmente benigno; convulsioni e QT alle dosi molto alte." },
  fluvoxamina:{ red:[["salvavita", "POTENTE inibitore del CYP1A2: ↑↑ clozapina (tossicità, convulsioni), olanzapina, teofillina, caffeina, melatonina; CONTROINDICATA con agomelatina."], ["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["grave", "Iponatriemia; ↑rischio emorragico."]],
    grav:"Dati discreti.", allatt:"Compatibile con monitoraggio.", anz:"Iponatriemia; interazioni.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, convulsioni, bradicardia." },
  paroxetina:{ red:[["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["salvavita", "SINDROME DA SOSPENSIONE la più severa: emivita breve, nessun metabolita attivo. Scalare in mesi; mai brusca."], ["grave", "Potente inibitore del CYP2D6 (come fluoxetina); la più anticolinergica degli SSRI."], ["grave", "Iponatriemia; ↑rischio emorragico; aumento ponderale."]],
    grav:"Segnalato ↑rischio di malformazioni cardiache nel 1º trimestre: preferire alternative.", allatt:"Basso passaggio: compatibile.", anz:"Anticolinergica e iponatriemia: preferire altri SSRI.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, tremore, nausea; relativamente benigno." },
  sertralina:{ red:[["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["grave", "Iponatriemia nell'anziano; ↑rischio emorragico con FANS/antiaggreganti."], ["nota", "Assorbimento migliore con il cibo; sorvegliare l'ideazione suicidaria in avvio nei giovani."]],
    grav:"SSRI di prima scelta in gravidanza (dati più ampi e rassicuranti).", allatt:"PREFERITO in allattamento (passaggio minimo nel latte).", anz:"Buona scelta; sorvegliare la sodiemia.",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"Generalmente benigno: nausea, sedazione, tremore." },
  venlafaxina:{ red:[["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["salvavita", "SINDROME DA SOSPENSIONE severissima (scosse elettriche, vertigini): scalare del 25% al mese; mai brusca."], ["grave", "IPERTENSIONE dose-dipendente >150 mg: monitorare la pressione."], ["grave", "Più cardiotossica degli SSRI in sovradosaggio; iponatriemia."]],
    grav:"Dati discreti; adattamento neonatale.", allatt:"Cautela.", anz:"Pressione e sodiemia.",
    rene:"RIDURRE del 25–50%.", fegato:"Ridurre del 50%.", od:"Convulsioni, aritmie, cardiotossicità: più pericolosa degli SSRI." },
  duloxetina:{ red:[["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["salvavita", "EPATOTOSSICITÀ: controindicata nell'epatopatia e con l'abuso alcolico — transaminasi se sintomi."], ["grave", "Ipertensione; iponatriemia; sindrome da sospensione."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Pressione e sodiemia.",
    rene:"CONTROINDICATA se clearance <30 ml/min.", fegato:"CONTROINDICATA nell'epatopatia.", od:"Sindrome serotoninergica, convulsioni, epatotossicità." },
  desvenlafaxina:{ red:[["salvavita", "Sindrome serotoninergica; controindicata con IMAO."], ["salvavita", "Sindrome da sospensione severa come la venlafaxina."], ["grave", "Ipertensione dose-dipendente."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Pressione.",
    rene:"RIDURRE secondo clearance.", fegato:"Ridurre.", od:"Come venlafaxina." },
  mirtazapina:{ red:[["grave", "Agranulocitosi/neutropenia (rara): febbre, mal di gola, stomatite → EMOCROMO urgente."], ["grave", "Aumento di peso e sedazione marcati; sindrome serotoninergica in associazione."], ["nota", "A dosi basse è più sedativa: se il paziente è troppo sedato spesso si SALE di dose."]],
    grav:"Dati discreti.", allatt:"Cautela.", anz:"Utile se insonnia/calo ponderale; attenzione a sedazione e cadute.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, tachicardia, disorientamento; benigno in monoassunzione." },
  mianserina:{ red:[["salvavita", "AGRANULOCITOSI (più frequente che con altri antidepressivi): febbre/infezione → emocromo urgente e sospensione."], ["grave", "Sedazione marcata; ipotensione."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Sedazione e cadute; emocromo.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione; meno cardiotossica dei triciclici." },
  reboxetina:{ red:[["grave", "Ritenzione urinaria e disuria (effetto noradrenergico): cautela nell'ipertrofia prostatica."], ["grave", "Ipertensione, tachicardia, insonnia, sudorazione."], ["nota", "Ipokaliemia nell'anziano con uso prolungato."]],
    grav:"Dati limitati: evitare.", allatt:"Sconsigliata.", anz:"Cautela (ritenzione, ipokaliemia).",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Ipertensione, tachicardia, sedazione." },
  bupropione:{ red:[["salvavita", "CONVULSIONI dose-dipendenti: CONTROINDICATO in epilessia, disturbi del comportamento alimentare (bulimia/anoressia) e nell'astinenza brusca da alcol o benzodiazepine."], ["salvavita", "Controindicato con IMAO."], ["grave", "Inibitore del CYP2D6; ipertensione; insonnia e agitazione."], ["nota", "Sorvegliare umore e comportamento nella cessazione del fumo."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Cautela (convulsioni, ipertensione).",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Convulsioni, tachicardia, agitazione, aritmie." },
  agomelatina:{ red:[["salvavita", "EPATOTOSSICITÀ: transaminasi OBBLIGATORIE al basale, a 3, 6, 12 e 24 settimane e a ogni aumento di dose. Se >3x il limite → sospendere. CONTROINDICATA nell'epatopatia."], ["salvavita", "CONTROINDICATA con fluvoxamina e ciprofloxacina (inibitori potenti del CYP1A2)."], ["nota", "Nessuna sindrome da sospensione né effetti sessuali."]],
    grav:"Dati limitati: evitare.", allatt:"Sconsigliata.", anz:"Evitare >75 anni (efficacia non dimostrata).",
    rene:"Cautela.", fegato:"CONTROINDICATA.", od:"Sedazione, dolore epigastrico; epatotossicità." },
  vortioxetina:{ red:[["grave", "Sindrome serotoninergica; controindicata con IMAO."], ["grave", "Iponatriemia; ↑rischio emorragico."], ["nota", "Nausea dose-dipendente, principale effetto limitante."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Buon profilo; sodiemia.",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"Nausea, sedazione; generalmente benigno." },
  tianeptina:{ red:[["salvavita", "POTENZIALE D'ABUSO ad alte dosi (agonismo μ-oppioide): depressione respiratoria e dipendenza. Non superare lo schema; sorvegliare le richieste di aumento."], ["nota", "Verificare lo stato regolatorio locale."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Ridurre.",
    rene:"Ridurre.", fegato:"Cautela.", od:"Sedazione, depressione respiratoria (effetto oppioide): naloxone può essere utile." },
  esketamina:{ red:[["salvavita", "Somministrazione SOLO in ambiente sanitario con osservazione ≥2 h: sedazione, dissociazione, rialzo pressorio."], ["salvavita", "Controindicata in aneurisma, malformazioni vascolari, emorragia intracerebrale (rialzo pressorio)."], ["grave", "Potenziale d'abuso; non guidare nel giorno della somministrazione."]],
    grav:"Controindicata.", allatt:"Controindicata.", anz:"Monitorare pressione; cautela.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Dissociazione marcata, sedazione, ipertensione." },
  fenelzina:{ red:[["salvavita", "CRISI IPERTENSIVA DA TIRAMINA: formaggi stagionati, insaccati, vino, birra, estratti di lievito, soia fermentata. Cefalea occipitale improvvisa → emergenza."], ["salvavita", "SINDROME SEROTONINERGICA: wash-out di 2 settimane in entrata/uscita (5 settimane dalla fluoxetina). Controindicati SSRI/SNRI, triciclici, tramadolo, triptani, linezolid, destrometorfano, petidina."], ["grave", "Ipotensione ortostatica marcata; epatotossicità."]],
    grav:"Evitare.", allatt:"Controindicata.", anz:"Evitare (ipotensione, interazioni).",
    rene:"Cautela.", fegato:"Cautela (epatotossicità).", od:"Agitazione, ipertermia, instabilità pressoria, rabdomiolisi: esordio ritardato (fino a 12 h), osservazione prolungata." },
  tranilcipromina:{ red:[["salvavita", "Crisi ipertensiva da tiramina (come fenelzina): dieta obbligatoria."], ["salvavita", "Sindrome serotoninergica: wash-out di 2 settimane."], ["grave", "Struttura anfetamino-simile: attivazione, insonnia, potenziale d'abuso."]],
    grav:"Evitare.", allatt:"Controindicata.", anz:"Evitare.",
    rene:"Cautela.", fegato:"Cautela.", od:"Ipertermia, instabilità pressoria, convulsioni; esordio ritardato." },
  moclobemide:{ red:[["grave", "Minor rischio di crisi da tiramina (reversibile), ma cautela con dosi elevate di tiramina."], ["salvavita", "Sindrome serotoninergica con SSRI/SNRI/triptani/tramadolo: associazioni da evitare."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Ridurre.",
    rene:"Poco impatto.", fegato:"RIDURRE del 50% (metabolismo epatico).", od:"Agitazione, ipertensione; più benigno degli IMAO irreversibili." },
  imao:{ red:[["salvavita", "Crisi ipertensiva da tiramina e simpaticomimetici."], ["salvavita", "Sindrome serotoninergica: wash-out di 2 settimane (5 dalla fluoxetina)."]],
    grav:"Evitare.", allatt:"Controindicati.", anz:"Evitare.",
    rene:"Cautela.", fegato:"Cautela.", od:"Ipertermia, instabilità pressoria; osservazione prolungata." },
  ademetionina:{ red:[["grave", "Possibile viraggio maniacale nel disturbo bipolare non protetto."], ["nota", "Assumere al mattino (attivante); ansia e insonnia se serale."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Ben tollerata.",
    rene:"Cautela.", fegato:"Impiegata anche nelle epatopatie colestatiche.", od:"Disturbi gastrointestinali, insonnia; tossicità bassa." },
  iperico:{ red:[["salvavita", "INDUTTORE del CYP3A4 e della glicoproteina-P: FALLIMENTO di contraccettivi orali (gravidanze indesiderate), anticoagulanti, immunosoppressori (rigetto di trapianto), antiretrovirali, ciclosporina."], ["salvavita", "Sindrome serotoninergica con SSRI/SNRI/triptani."], ["grave", "Prodotto DA BANCO: chiedere sempre attivamente se il paziente lo assume."], ["nota", "Fotosensibilizzazione."]],
    grav:"Evitare (dati insufficienti).", allatt:"Sconsigliato.", anz:"Attenzione alle interazioni in politerapia.",
    rene:"Cautela.", fegato:"Cautela.", od:"Fotosensibilità, agitazione; tossicità diretta bassa." },
  buspirone:{ red:[["grave", "Sindrome serotoninergica con IMAO (controindicato) e serotoninergici."], ["nota", "NON funziona al bisogno: effetto in 1–2 settimane. Spiegarlo evita l'abbandono."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Ben tollerato (nessuna sedazione né cadute).",
    rene:"Ridurre.", fegato:"Ridurre; ↑ da inibitori del 3A4 (pompelmo, azoli).", od:"Nausea, vertigini, miosi; tossicità bassa." },
  idrossizina:{ red:[["salvavita", "Prolungamento del QT: controindicata con altri farmaci QT-prolunganti, squilibri elettrolitici, bradicardia."], ["grave", "Effetti anticolinergici e sedazione nell'anziano."]],
    grav:"Controindicata (segnalazioni di malformazioni).", allatt:"Sconsigliata.", anz:"Ridurre a metà dose; rischio anticolinergico e QT.",
    rene:"Ridurre.", fegato:"Ridurre.", od:"Sedazione, effetti anticolinergici, QT lungo, convulsioni." },
  prometazina:{ red:[["salvavita", "CONTROINDICATA sotto i 2 anni (depressione respiratoria fatale)."], ["salvavita", "Somministrazione ev: rischio di necrosi tissutale grave in caso di stravaso — preferire im profonda."], ["grave", "Sedazione profonda additiva con oppioidi e alcol; effetti anticolinergici."]],
    grav:"Usata anche come antiemetico; valutare rischio/beneficio.", allatt:"Cautela.", anz:"Anticolinergica e sedativa: evitare se possibile.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione profonda, effetti anticolinergici, convulsioni, QT." },
  pregabalin:{ red:[["salvavita", "Depressione respiratoria in associazione a OPPIOIDI: rischio sottovalutato, decessi segnalati."], ["grave", "Potenziale d'abuso e dipendenza; sindrome da sospensione (ansia, insonnia, sudorazione)."], ["grave", "Aumento di peso ed edemi; sedazione e cadute."]],
    grav:"Dati limitati: evitare.", allatt:"Sconsigliato.", anz:"Ridurre; cadute.",
    rene:"RIDURRE secondo clearance (eliminazione renale pura).", fegato:"Poco impatto.", od:"Sedazione, atassia, confusione; dializzabile." },
  gabapentin:{ red:[["salvavita", "Depressione respiratoria con OPPIOIDI (come pregabalin)."], ["grave", "Potenziale d'abuso; sedazione e cadute."], ["nota", "Assorbimento saturabile: frazionare le somministrazioni."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Ridurre; cadute.",
    rene:"RIDURRE secondo clearance.", fegato:"Poco impatto.", od:"Sedazione, atassia, diplopia; dializzabile." },
  zolpidem:{ red:[["salvavita", "Depressione respiratoria con alcol e oppioidi."], ["grave", "COMPORTAMENTI AUTOMATICI NOTTURNI in amnesia (guida, alimentazione, telefonate): sospendere se compaiono."], ["grave", "Cadute e fratture nell'anziano; dipendenza con l'uso prolungato."]],
    grav:"Evitare (sedazione neonatale se usato a termine).", allatt:"Cautela.", anz:"Metà dose (5 mg); alto rischio di cadute.",
    rene:"Cautela.", fegato:"RIDURRE (metabolismo epatico).", od:"Sedazione, coma; pericoloso con altri depressori." },
  zopiclone:{ red:[["salvavita", "Depressione respiratoria con alcol e oppioidi."], ["grave", "Cadute nell'anziano; dipendenza; comportamenti automatici."]],
    grav:"Evitare.", allatt:"Cautela.", anz:"Metà dose (3,75 mg).",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, coma con altri depressori." },
  zaleplon:{ red:[["grave", "Depressione respiratoria con alcol e oppioidi; dipendenza."], ["nota", "Emivita ultrabreve: minimo hangover, ma copertura solo sull'addormentamento."]],
    grav:"Evitare.", allatt:"Cautela.", anz:"Ridurre.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione; relativamente benigno da solo." },
  daridorexant:{ red:[["grave", "Sonnolenza residua se il tempo di sonno è insufficiente: non guidare se <7 h."], ["grave", "Controindicato nella narcolessia; cautela con inibitori potenti del CYP3A4."], ["nota", "Minor rischio di dipendenza rispetto a benzodiazepine e Z-drug."]],
    grav:"Evitare (dati limitati).", allatt:"Sconsigliato.", anz:"Ben tollerato; sorvegliare la sonnolenza.",
    rene:"Poco impatto.", fegato:"Evitare nell'insufficienza grave.", od:"Sonnolenza prolungata; tossicità bassa." },
  melatonina:{ red:[["nota", "Molto sicura; la fluvoxamina (inibitore del CYP1A2) ne aumenta marcatamente i livelli."], ["nota", "Sonnolenza: non guidare dopo l'assunzione."]],
    grav:"Dati limitati: evitare per prudenza.", allatt:"Cautela.", anz:"Indicata (formulazione RP ≥55 anni).",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"Sonnolenza; tossicità molto bassa." },
  clometiazolo:{ red:[["salvavita", "Depressione respiratoria se associato ad alcol ancora in circolo o ad altri depressori: NON somministrare se il paziente sta ancora bevendo."], ["salvavita", "Elevato potenziale di dipendenza: solo cicli brevi e supervisionati (<9 giorni)."], ["grave", "Ipersecrezione bronchiale: cautela nell'insufficienza respiratoria."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Ridurre; sedazione e cadute.",
    rene:"Cautela.", fegato:"RIDURRE marcatamente (biodisponibilità molto aumentata nell'epatopatico).", od:"Sedazione profonda, depressione respiratoria, ipersecrezione bronchiale." },
  metilfenidato:{ red:[["salvavita", "CONTROINDICATO con IMAO e nei 14 giorni successivi (crisi ipertensiva)."], ["salvavita", "Screening cardiovascolare PRIMA di iniziare: anamnesi di cardiopatia strutturale, aritmie, morte improvvisa in famiglia. Sincope o dolore toracico sotto terapia → valutazione cardiologica."], ["grave", "Stupefacente: rischio di abuso e diversione — verificare l'aderenza e le richieste anticipate."], ["grave", "Può slatentizzare o peggiorare psicosi, mania, tic; priapismo (raro)."], ["nota", "Rallentamento della crescita nel bambino: peso e altezza a ogni controllo."]],
    grav:"Dati limitati: valutare rischio/beneficio, spesso sospeso.", allatt:"Cautela (passa nel latte).", anz:"Uso raro; monitorare pressione e frequenza.",
    rene:"Poco impatto.", fegato:"Cautela.", od:"Agitazione, tachicardia, ipertensione, ipertermia, convulsioni. Benzodiazepine; evitare antipsicotici come prima scelta." },
  lisdexamfetamina:{ red:[["salvavita", "Controindicata con IMAO (crisi ipertensiva)."], ["salvavita", "Screening cardiovascolare basale; sincope o dolore toracico → cardiologia."], ["grave", "Stupefacente: potenziale d'abuso (ridotto ma non nullo per la natura di profarmaco)."], ["grave", "Psicosi, mania, aggressività; rallentamento della crescita."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Uso raro.",
    rene:"RIDURRE nell'insufficienza grave.", fegato:"Cautela.", od:"Agitazione, ipertermia, aritmie, rabdomiolisi, convulsioni." },
  atomoxetina:{ red:[["salvavita", "EPATOTOSSICITÀ (rara ma grave): ittero, urine scure, prurito, dolore addominale → transaminasi urgenti e sospensione definitiva."], ["salvavita", "Controindicata con IMAO; cautela nel glaucoma ad angolo chiuso e nel feocromocitoma."], ["grave", "Sorvegliare ideazione e comportamento suicidario nei giovani, specie in avvio."], ["nota", "Effetto pieno solo dopo 4–6 settimane: non dichiararla inefficace prima."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Pressione e frequenza.",
    rene:"Poco impatto.", fegato:"RIDURRE (50% se Child-Pugh B, 25% se C).", od:"Sonnolenza, agitazione, tachicardia, convulsioni." },
  guanfacina:{ red:[["salvavita", "NON sospendere bruscamente: ipertensione da rimbalzo e tachicardia. Scalare di 1 mg ogni 3–7 giorni."], ["grave", "Ipotensione, bradicardia, sincope: pressione e frequenza a ogni aumento."], ["grave", "Sedazione marcata in avvio: attenzione alla guida e alla scuola."]],
    grav:"Dati limitati.", allatt:"Sconsigliata.", anz:"Ipotensione e bradicardia.",
    rene:"Ridurre nell'insufficienza grave.", fegato:"Ridurre.", od:"Bradicardia, ipotensione, sedazione profonda, depressione respiratoria." },
  modafinil:{ red:[["salvavita", "Reazioni cutanee gravi (Stevens-Johnson, DRESS): qualsiasi rash → sospendere immediatamente."], ["salvavita", "INDUTTORE del CYP3A4: riduce l'efficacia dei CONTRACCETTIVI ORALI — informare e usare metodi alternativi."], ["grave", "Potenziale d'abuso; ansia, insonnia, ipertensione."]],
    grav:"Evitare (segnalazioni di malformazioni).", allatt:"Sconsigliato.", anz:"Ridurre.",
    rene:"Cautela.", fegato:"RIDURRE del 50%.", od:"Agitazione, insonnia, tachicardia, ipertensione." },
  naltrexone:{ red:[["salvavita", "PRECIPITA L'ASTINENZA se sono presenti oppioidi: verificare almeno 7–10 giorni di astinenza (eventualmente test al naloxone)."], ["salvavita", "Dopo la sospensione la SENSIBILITÀ AGLI OPPIOIDI è ripristinata: rischio di overdose fatale se il paziente ricade con le dosi precedenti — informarlo esplicitamente."], ["salvavita", "In emergenza l'analgesia con oppioidi è bloccata: prevedere alternative (segnalarlo sui documenti sanitari)."], ["grave", "Epatotossicità dose-dipendente: transaminasi prima e durante."]],
    grav:"Dati limitati: valutare rischio/beneficio.", allatt:"Sconsigliato.", anz:"Cautela.",
    rene:"Cautela.", fegato:"CONTROINDICATO nell'epatite acuta e nell'insufficienza epatica.", od:"Generalmente benigno; epatotossicità ad altissime dosi." },
  acamprosato:{ red:[["grave", "Controindicato nell'insufficienza renale grave (clearance <30 ml/min)."], ["nota", "Non agisce sull'intossicazione acuta: serve al mantenimento dell'astinenza. Proseguire anche dopo una ricaduta."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Ridurre secondo funzione renale.",
    rene:"RIDURRE/controindicato secondo clearance.", fegato:"Utilizzabile (non metabolizzato).", od:"Diarrea, ipercalcemia; tossicità bassa." },
  disulfiram:{ red:[["salvavita", "REAZIONE DISULFIRAM-ALCOL potenzialmente fatale (flushing, vomito, ipotensione, aritmie, collasso): astensione assoluta anche da alcol 'nascosto' — colluttori, sciroppi, salse, aceto, profumi. L'effetto persiste fino a 14 giorni dopo la sospensione."], ["salvavita", "Epatotossicità grave/fulminante: transaminasi prima e periodicamente; ittero o astenia → sospendere."], ["salvavita", "Controindicato in cardiopatia grave, psicosi, gravidanza."], ["grave", "Neuropatia periferica e neurite ottica; inibisce vari CYP (↑ fenitoina, warfarin, caffeina)."]],
    grav:"CONTROINDICATO.", allatt:"Controindicato.", anz:"Cautela estrema (rischio della reazione).",
    rene:"Cautela.", fegato:"CONTROINDICATO nell'epatopatia.", od:"Reazione grave con alcol; neurotossicità, psicosi, epatite." },
  nalmefene:{ red:[["salvavita", "Precipita l'astinenza da oppioidi; blocca l'analgesia oppioide in emergenza."], ["grave", "Non iniziare se il paziente ha assunto oppioidi di recente."]],
    grav:"Evitare.", allatt:"Sconsigliato.", anz:"Cautela.",
    rene:"Cautela.", fegato:"Ridurre; evitare nell'insufficienza grave.", od:"Nausea, vertigini; tossicità bassa." },
  vareniclina:{ red:[["grave", "Sorvegliare umore e comportamento: segnalazioni di alterazioni neuropsichiatriche (rivalutate come poco frequenti, ma da monitorare nel paziente psichiatrico)."], ["grave", "Nausea molto frequente: la titolazione degli 8 giorni la riduce."], ["nota", "Iniziare 1–2 settimane prima della data di cessazione."]],
    grav:"Evitare.", allatt:"Sconsigliata.", anz:"Ridurre secondo funzione renale.",
    rene:"RIDURRE secondo clearance.", fegato:"Poco impatto.", od:"Nausea, vomito; tossicità bassa." },
  metadone:{ red:[["salvavita", "INDUZIONE = FASE PIÙ PERICOLOSA: emivita fino a 60 h, i livelli salgono per giorni a dose costante — la morte per overdose avviene tipicamente nella prima settimana. Massimo 30–40 mg il primo giorno, aumenti non più frequenti di 3–5 giorni."], ["salvavita", "Depressione respiratoria potenziata da BENZODIAZEPINE, alcol, altri sedativi: associazione a rischio di morte."], ["salvavita", "Prolungamento del QT dose-dipendente (torsione di punta >100 mg/die): ECG."], ["salvavita", "Gli INDUTTORI (carbamazepina, rifampicina, antiretrovirali) riducono i livelli e precipitano l'astinenza; gli inibitori li aumentano."], ["grave", "Rischio di ingestione accidentale letale nel bambino: custodia sicura."]],
    grav:"Il mantenimento è indicato in gravidanza (meglio dell'astinenza); sindrome da astinenza neonatale attesa e trattabile. Il fabbisogno aumenta nel 3º trimestre.", allatt:"Compatibile (basso passaggio), può attenuare l'astinenza neonatale.", anz:"Ridurre; maggiore rischio respiratorio.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Miosi, depressione respiratoria, coma: NALOXONE con osservazione PROLUNGATA (emivita del metadone molto più lunga: rischio di ri-narcotizzazione)." },
  buprenorfina:{ red:[["salvavita", "ASTINENZA PRECIPITATA se somministrata troppo presto: l'alta affinità μ spiazza gli agonisti pieni. Iniziare solo con astinenza già in corso (COWS ≥8–12)."], ["salvavita", "Depressione respiratoria con benzodiazepine/alcol (l'effetto tetto non protegge dalle associazioni)."], ["grave", "In overdose il naloxone è meno efficace (alta affinità): possono servire dosi elevate e ripetute."]],
    grav:"Indicata in gravidanza (astinenza neonatale spesso più lieve che con metadone).", allatt:"Compatibile.", anz:"Ridurre.",
    rene:"Poco impatto.", fegato:"RIDURRE; monitorare le transaminasi.", od:"Depressione respiratoria (effetto tetto): naloxone ad alte dosi, supporto ventilatorio." },
  oxibato:{ red:[["salvavita", "Finestra STRETTISSIMA tra effetto e coma; depressione respiratoria letale con alcol, benzodiazepine e oppioidi."], ["salvavita", "ELEVATO potenziale d'abuso: erogazione controllata e affidamento a un referente; rischio di uso improprio (sostanza da 'sottomissione chimica')."], ["salvavita", "Astinenza GRAVE (simil-alcol): delirium e convulsioni, può richiedere terapia intensiva."]],
    grav:"Controindicato.", allatt:"Controindicato.", anz:"Cautela estrema.",
    rene:"Cautela.", fegato:"RIDURRE della metà (metabolismo epatico).", od:"Coma con risveglio brusco spontaneo, bradicardia, vomito, depressione respiratoria: supporto ventilatorio (nessun antidoto)." },
  baclofene:{ red:[["salvavita", "SOSPENSIONE BRUSCA: sindrome da astinenza grave con confusione, allucinazioni, convulsioni, ipertermia, rabdomiolisi (potenzialmente fatale). Mai interrompere di colpo."], ["grave", "Sedazione e confusione, soprattutto nell'insufficienza renale (accumulo)."], ["grave", "L'uso ad alte dosi nell'alcoldipendenza è off-label e discusso: solo sotto stretta supervisione."]],
    grav:"Dati limitati.", allatt:"Cautela.", anz:"Ridurre (sedazione, confusione).",
    rene:"RIDURRE marcatamente (escrezione renale): rischio di encefalopatia.", fegato:"Poco impatto.", od:"Coma, depressione respiratoria, ipotonia, convulsioni; può essere necessaria l'emodialisi." },
  donepezil:{ red:[["salvavita", "BRADICARDIA, blocchi AV e sincope: cadute e traumi nell'anziano. ECG se sincope o bradicardia; cautela con beta-bloccanti e digossina."], ["grave", "Effetto colinergico: ulcera e sanguinamenti gastrointestinali (attenzione con FANS), broncospasmo nell'asma/BPCO, convulsioni."], ["grave", "In caso di anestesia informare l'anestesista (potenzia i miorilassanti depolarizzanti)."]],
    grav:"Non pertinente.", allatt:"Non pertinente.", anz:"Popolazione di elezione: sorvegliare bradicardia, cadute, calo ponderale.",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"CRISI COLINERGICA: nausea, vomito, salivazione, bradicardia, convulsioni, debolezza dei muscoli respiratori. Antidoto: ATROPINA." },
  rivastigmina:{ red:[["salvavita", "Crisi colinergica in caso di sovradosaggio (anche per applicazione di PIÙ CEROTTI contemporaneamente: errore frequente — rimuovere il precedente)."], ["grave", "Effetti gastrointestinali marcati per via orale (nausea, vomito, calo ponderale): la via transdermica li riduce."], ["grave", "Bradicardia; ulcera; broncospasmo."], ["nota", "Interruzione >3 giorni → ricominciare dalla dose iniziale."]],
    grav:"Non pertinente.", allatt:"Non pertinente.", anz:"Popolazione di elezione: sorvegliare peso e bradicardia.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Crisi colinergica: atropina; rimuovere il cerotto." },
  galantamina:{ red:[["salvavita", "Bradicardia e blocchi AV; crisi colinergica in sovradosaggio."], ["grave", "Reazioni cutanee gravi segnalate (Stevens-Johnson): rash → sospendere."], ["grave", "Effetti gastrointestinali; ulcera; broncospasmo."]],
    grav:"Non pertinente.", allatt:"Non pertinente.", anz:"Popolazione di elezione.",
    rene:"Ridurre; evitare nell'insufficienza grave.", fegato:"Ridurre; evitare nella grave.", od:"Crisi colinergica: atropina." },
  memantina:{ red:[["grave", "Accumulo nell'insufficienza renale: confusione e allucinazioni — ridurre la dose."], ["grave", "Cautela con altri antagonisti NMDA (amantadina, ketamina) e in epilessia."], ["nota", "Generalmente ben tollerata; si associa agli inibitori delle colinesterasi (meccanismi complementari)."]],
    grav:"Non pertinente.", allatt:"Non pertinente.", anz:"Popolazione di elezione; sorvegliare confusione.",
    rene:"RIDURRE secondo clearance.", fegato:"Cautela.", od:"Agitazione, allucinazioni, sonnolenza, atassia." },
  biperidene:{ red:[["salvavita", "Controindicato in GLAUCOMA AD ANGOLO CHIUSO (crisi acuta), ileo paralitico, ritenzione urinaria."], ["grave", "DELIRIUM anticolinergico nell'anziano; peggiora la discinesia tardiva e la cognizione."], ["grave", "Potenziale d'abuso (effetto euforizzante): sorvegliare le richieste."], ["nota", "Non usare in profilassi cronica non necessaria: rivalutare periodicamente."]],
    grav:"Cautela.", allatt:"Sconsigliato.", anz:"Rischio elevato di delirium: preferire l'amantadina.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sindrome anticolinergica (delirium, midriasi, cute calda e secca, ritenzione, ipertermia, tachicardia). Antidoto in casi gravi: fisostigmina." },
  triesifenidile:{ red:[["salvavita", "Controindicato in glaucoma ad angolo chiuso e ritenzione urinaria."], ["grave", "Delirium e deficit mnesici nell'anziano; peggiora la discinesia tardiva."], ["grave", "Potenziale d'abuso."]],
    grav:"Cautela.", allatt:"Sconsigliato.", anz:"Evitare se possibile.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sindrome anticolinergica; fisostigmina nei casi gravi." },
  amantadina:{ red:[["salvavita", "Accumulo con rischio di delirium, allucinazioni e convulsioni nell'INSUFFICIENZA RENALE: ridurre secondo clearance."], ["grave", "Può slatentizzare o peggiorare la PSICOSI (azione dopaminergica): cautela nello schizofrenico."], ["grave", "Non sospendere bruscamente (rischio di sindrome simil-neurolettica maligna)."], ["nota", "Livedo reticularis ed edemi declivi; insonnia se assunta la sera."]],
    grav:"Evitare (teratogenicità segnalata).", allatt:"Sconsigliata.", anz:"Delirium e allucinazioni: ridurre.",
    rene:"RIDURRE secondo clearance.", fegato:"Poco impatto.", od:"Agitazione, allucinazioni, convulsioni, aritmie; poco dializzabile." },
  propranololo:{ red:[["salvavita", "CONTROINDICATO in asma e BPCO (broncospasmo grave), blocchi AV, bradicardia marcata, scompenso non compensato."], ["salvavita", "NON sospendere bruscamente: rimbalzo adrenergico con tachicardia, ipertensione e rischio ischemico."], ["grave", "Maschera i sintomi dell'IPOGLICEMIA nel diabetico (tranne la sudorazione)."], ["nota", "Nell'acatisia è la prima scelta: non aumentare l'antipsicotico, che la peggiora."]],
    grav:"Cautela (ritardo di crescita, bradicardia neonatale).", allatt:"Compatibile con monitoraggio.", anz:"Bradicardia e ipotensione: ridurre.",
    rene:"Cautela.", fegato:"RIDURRE (elevato primo passaggio).", od:"Bradicardia, ipotensione, broncospasmo, convulsioni, ipoglicemia. Antidoto: GLUCAGONE." },
  clonidina:{ red:[["salvavita", "SOSPENSIONE BRUSCA: crisi ipertensiva da rimbalzo — scalare in 2–4 giorni."], ["grave", "Ipotensione e bradicardia: titolare sulla pressione (sospendere se sistolica <90 mmHg)."], ["grave", "Sedazione additiva con altri depressori."]],
    grav:"Cautela.", allatt:"Cautela.", anz:"Ipotensione e sedazione: ridurre.",
    rene:"Ridurre.", fegato:"Cautela.", od:"Bradicardia, ipotensione, sedazione profonda, miosi, depressione respiratoria (quadro simil-oppioide, risponde parzialmente al naloxone)." },
  naloxone:{ red:[["salvavita", "RI-NARCOTIZZAZIONE: emivita (60–90 min) più breve di metadone, buprenorfina e oppioidi a lento rilascio — sorveglianza prolungata e dosi ripetute o infusione."], ["salvavita", "Titolare sul RESPIRO, non sulla coscienza: il risveglio completo precipita un'astinenza acuta violenta nei consumatori cronici."], ["grave", "Edema polmonare acuto e aritmie segnalati dopo reversione brusca."]],
    grav:"Utilizzabile in emergenza (l'ipossia materna è più pericolosa).", allatt:"Utilizzabile.", anz:"Utilizzabile.",
    rene:"Poco impatto.", fegato:"Poco impatto.", od:"Praticamente privo di tossicità propria: il problema è l'astinenza precipitata." },
  flumazenil:{ red:[["salvavita", "CONVULSIONI: può precipitarle se dipendenza da benzodiazepine o co-ingestione di proconvulsivanti (triciclici, bupropione). NON usare di routine nelle intossicazioni miste."], ["salvavita", "RI-SEDAZIONE: emivita breve (40–80 min), più corta di molte benzodiazepine — sorveglianza prolungata."], ["grave", "Nelle intossicazioni pure da benzodiazepine il supporto respiratorio è spesso più sicuro dell'antidoto."]],
    grav:"Solo se indispensabile.", allatt:"Cautela.", anz:"Cautela.",
    rene:"Poco impatto.", fegato:"Ridurre.", od:"Ansia, agitazione, convulsioni." },
  tiamina:{ red:[["salvavita", "REGOLA ASSOLUTA: somministrare la tiamina PRIMA di qualsiasi carico di glucosio nell'alcolista — il glucosio senza tiamina può precipitare l'encefalopatia di Wernicke."], ["grave", "Nel dubbio TRATTARE: la triade di Wernicke (oftalmoplegia, atassia, confusione) è spesso incompleta e la diagnosi mancata esita in sindrome di Korsakoff irreversibile."], ["nota", "Rare reazioni anafilattoidi con la via endovenosa rapida: somministrare lentamente."]],
    grav:"Sicura e spesso indicata.", allatt:"Sicura.", anz:"Sicura.",
    rene:"Poco impatto.", fegato:"Poco impatto.", od:"Praticamente atossica (idrosolubile)." },
  ciproeptadina:{ red:[["grave", "Sedazione marcata ed effetti anticolinergici; aumento dell'appetito e del peso."], ["grave", "Solo per via orale/sondino: nei casi gravi di sindrome serotoninergica il cardine restano sospensione e supporto."], ["nota", "Se usata cronicamente può ridurre l'efficacia degli antidepressivi serotoninergici (antagonismo 5-HT2)."]],
    grav:"Cautela.", allatt:"Sconsigliata (inibisce la lattazione).", anz:"Anticolinergica: evitare se possibile.",
    rene:"Cautela.", fegato:"Ridurre.", od:"Sedazione, sindrome anticolinergica, convulsioni nel bambino." },
  alprazolam:{ red:[["salvavita", "Sindrome da sospensione tra le PIÙ SEVERE (emivita breve): convulsioni se brusca. Scalare del 10% ogni 1–2 settimane, eventualmente passando a diazepam."], ["grave", "Ansia interdose per l'emivita breve: nel panico preferire lo schema fisso o la formulazione a rilascio prolungato."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  triazolam:{ red:[["grave", "AMNESIA ANTEROGRADA e comportamenti automatici; ansia e insonnia da rimbalzo marcate per l'emivita ultrabreve."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  flunitrazepam:{ red:[["salvavita", "ELEVATISSIMO potenziale d'abuso e uso improprio come sostanza da sottomissione chimica: prescrizione molto ristretta e sorvegliata."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  midazolam:{ red:[["salvavita", "Solo in setting MONITORATO con presidi per le vie aeree: depressione respiratoria rapida."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  diazepam:{ red:[["grave", "Emivita lunga con metaboliti attivi (nordazepam): accumulo e cadute nell'anziano."], ["nota", "Proprio l'emivita lunga lo rende utile come ponte per sospendere benzodiazepine a emivita breve."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  clordiazepossido:{ red:[["nota", "Emivita lunga con auto-scalaggio: utile nell'astinenza alcolica; ridurre nell'epatopatia."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  lorazepam:{ red:[["salvavita", "Sindrome da sospensione severa (emivita intermedia, nessun metabolita attivo): scalare lentamente."], ["nota", "Sola glicuronazione: di scelta nell'epatopatico e nell'anziano. Nella catatonia si usano dosi molto superiori a quelle ansiolitiche."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  oxazepam:{ red:[["nota", "Sola glicuronazione e insorgenza lenta: il più sicuro nell'epatopatico e con minor potenziale d'abuso."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  temazepam:{ red:[["nota", "Sola glicuronazione: sicuro nell'epatopatico."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  lormetazepam:{ red:[["nota", "Sola glicuronazione: sicuro nell'epatopatico; le gocce facilitano lo scalaggio."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  clonazepam:{ red:[["nota", "Emivita lunga: copertura stabile senza ansia interdose (vantaggio sull'alprazolam nel panico)."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  clobazam:{ red:[["nota", "Struttura 1,5: meno sedativa a parità di effetto; il metabolita attivo si accumula nei metabolizzatori lenti del CYP2C19."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  quazepam:{ red:[["grave", "Emivita lunga: sedazione residua diurna e accumulo — sconsigliato nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  flurazepam:{ red:[["grave", "Metaboliti attivi a lunghissima durata: hangover e accumulo — sconsigliato nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  nitrazepam:{ red:[["grave", "Sedazione residua diurna; cautela nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  prazepam:{ red:[["nota", "Profarmaco a lunga durata (via nordazepam): accumulo nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  pinazepam:{ red:[["nota", "Lunga durata: accumulo nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  nordazepam:{ red:[["nota", "Metabolita attivo comune a molte benzodiazepine, emivita molto lunga: accumulo."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  ketazolam:{ red:[["nota", "Profarmaco a lunga durata: accumulo nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  etizolam:{ red:[["grave", "Tienodiazepina a insorgenza rapida: potenziale d'abuso più marcato."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  clotiazepam:{ red:[["nota", "Emivita breve-intermedia: uso breve."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  estazolam:{ red:[["nota", "Durata intermedia: uso breve."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  brotizolam:{ red:[["nota", "Durata breve: uso breve."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  bromazepam:{ red:[["nota", "Le gocce (10 gtt = 1 mg) facilitano lo scalaggio graduale."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
  delorazepam:{ red:[["grave", "Emivita lunga: accumulo nell'anziano."], ["salvavita", "DEPRESSIONE RESPIRATORIA in associazione a OPPIOIDI, alcol o altri depressori: causa principale di morte da benzodiazepine."], ["salvavita", "SOSPENSIONE BRUSCA dopo uso prolungato: convulsioni e delirium — mai interrompere di colpo, scalare del 10–25% ogni 1–2 settimane."], ["grave", "Dipendenza e tolleranza: definire durata e piano di uscita fin dalla prescrizione (2–4 settimane)."], ["grave", "Nell'anziano: cadute, fratture, delirium, deterioramento cognitivo (criteri di Beers)."], ["nota", "Reazioni paradosse (disinibizione, agitazione) nel bambino, nell'anziano e nel disturbo di personalità."]],
    grav:"Uso nel 3º trimestre: 'floppy infant syndrome' (ipotonia, ipotermia, difficoltà di suzione) e sindrome da astinenza neonatale. Evitare o usare alla dose minima.", allatt:"Passaggio nel latte: sedazione e scarsa suzione. Preferire molecole a emivita breve e dosi singole.", anz:"DA EVITARE se possibile: cadute e fratture, delirium, deterioramento cognitivo. Se indispensabili, metà dose e preferire lorazepam/oxazepam.",
    rene:"Generalmente cautela; preferire le glicuronate.", fegato:"Preferire lorazepam, oxazepam, temazepam, lormetazepam (sola glicuronazione, nessun metabolita attivo).", od:"Sedazione, atassia, coma. Raramente letale da sole; pericolose con oppioidi/alcol. Flumazenil SOLO con estrema cautela (convulsioni se dipendenza o co-ingestione di proconvulsivanti)." },
};

const TABS = [
  { k: "catalogo", label: "Catalogo" },
  { k: "confronto", label: "Confronto" },
  { k: "convertitori", label: "Convertitori" },
  { k: "rischio", label: "Profili di rischio" },
  { k: "cyp", label: "Interazioni CYP" },
  { k: "monitoraggio", label: "Monitoraggio & TDM" },
  { k: "titolazione", label: "Titolazioni & ratio" },
  { k: "prn", label: "Al bisogno (PRN)" },
  { k: "emergenze", label: "Emergenze / eventi" },
  { k: "sostanze", label: "Sostanze d'abuso" },
  { k: "sicurezza", label: "Allerte & sicurezza" },
  { k: "indicazioni", label: "Indicazioni on/off-label" },
  { k: "glossario", label: "Glossario & fonti" },
];
const MAX_SEL = 4;
const drugById = Object.fromEntries(DATA.map((d) => [d.id, d]));
const byNome = (a, b) => drugById[a].nome.localeCompare(drugById[b].nome, "it");
const GOCCE_IDS = Object.keys(GOCCE).sort(byNome);
const EQ_AP_IDS = Object.keys(EQ_AP).sort(byNome);
const EQ_BZD_IDS = Object.keys(EQ_BZD).sort(byNome);
const MONIT_IDS = Object.keys(MONIT).sort((a, b) => (ORDINE_CLASSI.indexOf(drugById[a].cls) - ORDINE_CLASSI.indexOf(drugById[b].cls)) || byNome(a, b));

export default function ComparatorePsicofarmaci() {
  const [tab, setTab] = useState("catalogo");
  const [query, setQuery] = useState("");
  const [attiva, setAttiva] = useState("tutte");
  const [ordina, setOrdina] = useState("classe");
  const [scelti, setScelti] = useState([]);
  const [dettaglio, setDettaglio] = useState(null);
  const [infoAperta, setInfoAperta] = useState(false);
  const [convTab, setConvTab] = useState("gocce");
  const [gttDrug, setGttDrug] = useState("trazodone");
  const [gttVal, setGttVal] = useState("20");
  const [gttDir, setGttDir] = useState("g2m");
  const [apDrug, setApDrug] = useState("olanzapina");
  const [apVal, setApVal] = useState("10");
  const [bzdDrug, setBzdDrug] = useState("alprazolam");
  const [bzdVal, setBzdVal] = useState("1");
  const [liMode, setLiMode] = useState("mg2meq");
  const [liVal, setLiVal] = useState("300");
  const [riskDim, setRiskDim] = useState("eps");
  const [riskCls, setRiskCls] = useState("tutte");
  const [indQ, setIndQ] = useState("");
  const [indCls, setIndCls] = useState("tutte");
  const [titQ, setTitQ] = useState("");
  const [sicQ, setSicQ] = useState("");
  const [sicSolo, setSicSolo] = useState(false);

  // Valori "differiti": la digitazione resta immediata mentre le liste pesanti
  // si aggiornano senza bloccare l'input (navigazione più fluida).
  const dq = useDeferredValue(query);
  const diq = useDeferredValue(indQ);
  const dtq = useDeferredValue(titQ);
  const dsq = useDeferredValue(sicQ);

  const conteggi = useMemo(() => {
    const c = {};
    DATA.forEach((d) => (c[d.cls] = (c[d.cls] || 0) + 1));
    return c;
  }, []);

  const filtrati = useMemo(() => {
    const q = dq.trim().toLowerCase();
    let arr = DATA.filter((d) => {
      if (attiva !== "tutte" && d.cls !== attiva) return false;
      if (!q) return true;
      return (
        d.nome.toLowerCase().includes(q) ||
        (d.sub || "").toLowerCase().includes(q) ||
        (d.com || "").toLowerCase().includes(q) ||
        (d.ind || "").toLowerCase().includes(q)
      );
    });
    if (ordina === "nome") arr = [...arr].sort((a, b) => a.nome.localeCompare(b.nome, "it"));
    else arr = [...arr].sort((a, b) => (ORDINE_CLASSI.indexOf(a.cls) - ORDINE_CLASSI.indexOf(b.cls)) || a.nome.localeCompare(b.nome, "it"));
    return arr;
  }, [dq, attiva, ordina]);

  const rankRows = useMemo(() =>
    DATA.filter((d) => RISK[d.id] && RISK[d.id][riskDim] !== undefined && (riskCls === "tutte" || d.cls === riskCls))
      .map((d) => ({ d, v: RISK[d.id][riskDim] }))
      .sort((a, b) => (b.v - a.v) || a.d.nome.localeCompare(b.d.nome, "it")),
  [riskDim, riskCls]);

  const titList = useMemo(() => {
    const q = dtq.trim().toLowerCase();
    return DATA.filter((d) => TITOLAZIONE[d.id] && (!q ||
      d.nome.toLowerCase().includes(q) ||
      TITOLAZIONE[d.id].schemi.some((s) => s.ind.toLowerCase().includes(q))));
  }, [dtq]);

  const sicList = useMemo(() => {
    const q = dsq.trim().toLowerCase();
    return DATA.filter((d) => {
      const s = SICUREZZA[d.id];
      if (!s) return false;
      if (sicSolo && !s.red.some((r) => r[0] === "salvavita")) return false;
      if (!q) return true;
      return d.nome.toLowerCase().includes(q) ||
        s.red.some((r) => r[1].toLowerCase().includes(q)) ||
        (s.grav + s.allatt + s.anz + s.rene + s.fegato + s.od).toLowerCase().includes(q);
    });
  }, [dsq, sicSolo]);

  const indGroups = useMemo(() => {
    const q = diq.trim().toLowerCase();
    return ORDINE_CLASSI
      .filter((k) => indCls === "tutte" || indCls === k)
      .map((cls) => ({ cls, items: DATA.filter((d) => d.cls === cls && (!q || d.nome.toLowerCase().includes(q))) }))
      .filter((g) => g.items.length);
  }, [diq, indCls]);

  const drugsScelti = scelti.map((id) => drugById[id]).filter(Boolean);

  function toggle(id) {
    setScelti((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_SEL) return prev;
      return [...prev, id];
    });
  }

  const det = dettaglio ? drugById[dettaglio] : null;

  return (
    <div className="cpf-root">
      <style>{CSS}</style>

      <header className="cpf-header">
        <div className="cpf-headtop">
          <div className="cpf-brand">
            <div className="cpf-eyebrow">Strumento didattico · psicofarmacologia clinica</div>
            <h1 className="cpf-title">Comparatore psicofarmaci</h1>
            <p className="cpf-source">
              {DATA.length} molecole · 5 classi · dataset dagli <em>«Appunti di Psicofarmacologia»</em> (R. Di Lorenzo, UNIMORE AA 2024-2025),
              arricchito con riferimenti standard (equivalenze, CYP, monitoraggio).
            </p>
          </div>
          <button className="cpf-infobtn" onClick={() => setInfoAperta((v) => !v)} aria-expanded={infoAperta}>
            {infoAperta ? "Nascondi avvertenze" : "Avvertenze d’uso"}
          </button>
        </div>
        {infoAperta && (
          <div className="cpf-disclaimer">
            Strumento <strong>didattico e non prescrittivo</strong>. Le equivalenze di dose (antipsicotici, benzodiazepine)
            e i profili di rischio ordinali sono <strong>orientativi</strong> e soggetti ad ampia variabilità individuale;
            la conversione tra farmaci va sempre personalizzata. Verificare dosaggi, indicazioni e controindicazioni
            sull’RCP vigente e sulle determine AIFA. Dove il dato non è disponibile compare <span className="cpf-nd">ND</span>.
          </div>
        )}
        <nav className="cpf-tabs">
          {TABS.map((t) => (
            <button key={t.k} className={"cpf-tab" + (tab === t.k ? " cpf-tab-on" : "")} onClick={() => setTab(t.k)}>
              {t.label}
              {t.k === "confronto" && scelti.length > 0 && <span className="cpf-tabbadge">{scelti.length}</span>}
            </button>
          ))}
        </nav>
      </header>

      {/* ---------------- CATALOGO ---------------- */}
      {tab === "catalogo" && (
        <section className="cpf-panel">
          <div className="cpf-toolbar">
            <input className="cpf-search" type="text" placeholder="Cerca per principio attivo, sottoclasse, nome commerciale o indicazione…"
              value={query} onChange={(e) => setQuery(e.target.value)} />
            <div className="cpf-toolrow">
              <div className="cpf-chips">
                <button className={"cpf-chip" + (attiva === "tutte" ? " cpf-chip-on" : "")} onClick={() => setAttiva("tutte")}>
                  Tutte <span className="cpf-chipn">{DATA.length}</span>
                </button>
                {ORDINE_CLASSI.map((k) => (
                  <button key={k} className={"cpf-chip" + (attiva === k ? " cpf-chip-on" : "")} onClick={() => setAttiva(k)}
                    style={attiva === k ? { background: CLASSI[k].color, borderColor: CLASSI[k].color, color: "#fff" } : { borderColor: CLASSI[k].color, color: CLASSI[k].color }}>
                    {CLASSI[k].short} <span className="cpf-chipn">{conteggi[k] || 0}</span>
                  </button>
                ))}
              </div>
              <label className="cpf-sort">
                Ordina
                <select value={ordina} onChange={(e) => setOrdina(e.target.value)}>
                  <option value="classe">per classe</option>
                  <option value="nome">per nome</option>
                </select>
              </label>
            </div>
          </div>

          {scelti.length > 0 && (
            <div className="cpf-selbar">
              <span className="cpf-selinfo"><strong>{scelti.length}</strong> / {MAX_SEL} selezionati per il confronto</span>
              <div className="cpf-selactions">
                <button className="cpf-ghost" onClick={() => setScelti([])}>Azzera</button>
                <button className="cpf-cta" disabled={scelti.length < 2} onClick={() => setTab("confronto")}>Vai al confronto →</button>
              </div>
            </div>
          )}

          <div className="cpf-grid">
            {filtrati.length === 0 && (
              <div className="cpf-empty">Nessun farmaco corrisponde alla ricerca. Modifica i filtri o il termine cercato.</div>
            )}
            {filtrati.map((d) => {
              const sel = scelti.includes(d.id);
              const c = CLASSI[d.cls];
              const maxed = !sel && scelti.length >= MAX_SEL;
              return (
                <div key={d.id} className={"cpf-card" + (sel ? " cpf-card-sel" : "")}
                  style={sel ? { borderColor: c.color, boxShadow: `0 0 0 2px ${c.color}` } : undefined}
                  onClick={() => setDettaglio(d.id)} role="button" tabIndex={0}>
                  <div className="cpf-cardhead">
                    <span className="cpf-tag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                    <button className={"cpf-check" + (maxed ? " cpf-check-dis" : "")}
                      style={sel ? { background: c.color, borderColor: c.color, color: "#fff" } : undefined}
                      onClick={(e) => { e.stopPropagation(); toggle(d.id); }} disabled={maxed}
                      title={sel ? "Rimuovi dal confronto" : "Aggiungi al confronto"}>
                      {sel ? "✓" : "+"}
                    </button>
                  </div>
                  <div className="cpf-dname">{d.nome}</div>
                  <div className="cpf-dsub">{d.sub}</div>
                  <div className="cpf-brands">{d.com}</div>
                  {GOCCE[d.id] && <div className="cpf-cardgtt"><span className="cpf-cardgtticon">gtt</span>{GOCCE[d.id].ratio}</div>}
                  {RISK[d.id] && <div className="cpf-cardrisk"><RiskBars risk={RISK[d.id]} compact /></div>}
                  <div className="cpf-cardfoot">Scheda completa →</div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ---------------- CONFRONTO ---------------- */}
      {tab === "confronto" && (
        <section className="cpf-panel">
          <div className="cpf-selbar">
            <span className="cpf-selinfo">
              {scelti.length === 0
                ? <span className="cpf-muted">Nessun farmaco selezionato</span>
                : <span><strong>{scelti.length}</strong> / {MAX_SEL} a confronto</span>}
            </span>
            <div className="cpf-selactions">
              {scelti.length > 0 && <button className="cpf-ghost" onClick={() => setScelti([])}>Azzera</button>}
              <button className="cpf-cta cpf-cta-alt" onClick={() => setTab("catalogo")}>+ Aggiungi dal catalogo</button>
            </div>
          </div>

          {drugsScelti.length < 2 ? (
            <div className="cpf-empty">Seleziona almeno 2 farmaci dal catalogo (pulsante «+») per attivare il confronto affiancato.</div>
          ) : (
            <>
              <div className="cpf-scroll">
                <table className="cpf-table">
                  <thead>
                    <tr>
                      <th className="cpf-attrhead">Parametro</th>
                      {drugsScelti.map((d) => {
                        const c = CLASSI[d.cls];
                        return (
                          <th key={d.id} className="cpf-colhead" style={{ borderTopColor: c.color }}>
                            <button className="cpf-colname cpf-colname-btn" onClick={() => setDettaglio(d.id)} title="Apri la scheda">{d.nome}</button>
                            <span className="cpf-tag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                            <button className="cpf-remove" onClick={() => toggle(d.id)} title="Rimuovi">×</button>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {RIGHE.map((r) => (
                      <tr key={r.key}>
                        <th className="cpf-attrcell">{r.label}</th>
                        {drugsScelti.map((d) => (
                          <td key={d.id} className={"cpf-cell" + (r.mono ? " cpf-mono" : "")}>
                            {r.rec ? <DotStrip rec={d.rec} color={CLASSI[d.cls].color} />
                              : r.risk ? <RiskBars risk={RISK[d.id]} />
                              : r.key === "clsLabel" ? `${CLASSI[d.cls].label} · ${d.sub || "—"}`
                              : (d[r.key] || "—")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {drugsScelti.some((d) => d.rec) && (
                <div className="cpf-radarbox">
                  <div className="cpf-radartitle">Profilo recettoriale sovrapposto</div>
                  <div className="cpf-radarwrap">
                    <Radar series={drugsScelti.filter((d) => d.rec).map((d) => ({ rec: d.rec, color: CLASSI[d.cls].color, label: d.nome }))} size={300} />
                    <div className="cpf-radarleg">
                      {drugsScelti.filter((d) => d.rec).map((d) => (
                        <span key={d.id} className="cpf-legitem"><span className="cpf-legdot" style={{ background: CLASSI[d.cls].color }} />{d.nome}</span>
                      ))}
                      <div className="cpf-radarnote">Scala 0–4 per asse (affinità/potenza dalle tabelle del testo). «re-NA/re-5HT» = inibizione del reuptake (triciclici).</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ---------------- CONVERTITORI ---------------- */}
      {tab === "convertitori" && (
        <section className="cpf-panel">
          <div className="cpf-subtabs">
            {[["gocce", "Gocce ↔ mg"], ["ap", "Equivalenti antipsicotici"], ["bzd", "Equivalenti benzodiazepine"], ["litio", "Litio mg ↔ mEq"]].map(([k, l]) => (
              <button key={k} className={"cpf-subtab" + (convTab === k ? " cpf-subtab-on" : "")} onClick={() => setConvTab(k)}>{l}</button>
            ))}
          </div>

          {/* Gocce <-> mg */}
          {convTab === "gocce" && (
            <div className="cpf-conv">
              <div className="cpf-convcard">
                <div className="cpf-fieldrow">
                  <label className="cpf-field">
                    Prodotto
                    <select value={gttDrug} onChange={(e) => setGttDrug(e.target.value)}>
                      {GOCCE_IDS.map((id) => (
                        <option key={id} value={id}>{drugById[id].nome} — {GOCCE[id].prod}</option>
                      ))}
                    </select>
                  </label>
                  <label className="cpf-field">
                    Direzione
                    <select value={gttDir} onChange={(e) => setGttDir(e.target.value)}>
                      <option value="g2m">gocce → mg</option>
                      <option value="m2g">mg → gocce</option>
                    </select>
                  </label>
                  <label className="cpf-field cpf-field-sm">
                    {gttDir === "g2m" ? "Gocce" : "mg"}
                    <input type="number" min="0" step="any" value={gttVal} onChange={(e) => setGttVal(e.target.value)} />
                  </label>
                </div>
                {(() => {
                  const g = GOCCE[gttDrug]; const v = parseFloat(String(gttVal).replace(",", ".")) || 0;
                  const out = gttDir === "g2m" ? v * g.mgGtt : v / g.mgGtt;
                  return (
                    <div className="cpf-readout">
                      <span className="cpf-readnum">{fmt(out)}</span>
                      <span className="cpf-readunit">{gttDir === "g2m" ? "mg" : "gocce"}</span>
                      <span className="cpf-readnote">{g.ratio} · {g.prod}</span>
                    </div>
                  );
                })()}
              </div>
              <div className="cpf-reftable">
                <div className="cpf-reftitle">Rapporti gtt↔mg dalle formulazioni del testo</div>
                <table className="cpf-mini">
                  <thead><tr><th>Farmaco</th><th>Prodotto</th><th>Rapporto</th><th>mg/goccia</th></tr></thead>
                  <tbody>
                    {GOCCE_IDS.map((id) => (
                      <tr key={id} className={id === gttDrug ? "cpf-mini-on" : undefined} onClick={() => setGttDrug(id)}>
                        <td>{drugById[id].nome}</td><td>{GOCCE[id].prod}</td>
                        <td className="cpf-mono">{GOCCE[id].ratio}</td><td className="cpf-mono">{fmt(GOCCE[id].mgGtt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Equivalenti antipsicotici */}
          {convTab === "ap" && (
            <div className="cpf-conv">
              <div className="cpf-convcard">
                <div className="cpf-fieldrow">
                  <label className="cpf-field">
                    Antipsicotico di partenza
                    <select value={apDrug} onChange={(e) => setApDrug(e.target.value)}>
                      {EQ_AP_IDS.map((id) => (
                        <option key={id} value={id}>{drugById[id].nome}</option>
                      ))}
                    </select>
                  </label>
                  <label className="cpf-field cpf-field-sm">
                    Dose (mg/die)
                    <input type="number" min="0" step="any" value={apVal} onChange={(e) => setApVal(e.target.value)} />
                  </label>
                </div>
                {(() => {
                  const base = EQ_AP[apDrug]; const dose = parseFloat(String(apVal).replace(",", ".")) || 0;
                  return (
                    <div className="cpf-readout">
                      <span className="cpf-readnum">{fmt(dose / base * 100)}</span>
                      <span className="cpf-readunit">mg clorpromazina-eq</span>
                    </div>
                  );
                })()}
              </div>
              <div className="cpf-warn2">Equivalenze orientative (consenso internazionale, Gardner 2010 / metodo DDD). La conversione tra antipsicotici è controversa e va individualizzata: usare come guida di massima, non come dose da prescrivere.</div>
              <div className="cpf-ladder">
                <div className="cpf-laddertitle">Dosi equivalenti approssimative</div>
                {(() => {
                  const base = EQ_AP[apDrug]; const dose = parseFloat(String(apVal).replace(",", ".")) || 0;
                  const rows = Object.keys(EQ_AP).map((id) => ({ id, dose: dose / base * EQ_AP[id] }));
                  const max = Math.max(...rows.map((r) => r.dose), 0.0001);
                  rows.sort((a, b) => a.dose - b.dose);
                  return rows.map((r) => {
                    const d = drugById[r.id]; const c = CLASSI[d.cls];
                    return <Bar key={r.id} frac={r.dose / max} color={c.color} valore={<span className="cpf-mono">{fmt(r.dose)} mg</span>}>
                      <span className={r.id === apDrug ? "cpf-barname cpf-barname-on" : "cpf-barname"}>{d.nome}</span></Bar>;
                  });
                })()}
              </div>
            </div>
          )}

          {/* Equivalenti benzodiazepine */}
          {convTab === "bzd" && (
            <div className="cpf-conv">
              <div className="cpf-convcard">
                <div className="cpf-fieldrow">
                  <label className="cpf-field">
                    Benzodiazepina di partenza
                    <select value={bzdDrug} onChange={(e) => setBzdDrug(e.target.value)}>
                      {EQ_BZD_IDS.map((id) => (
                        <option key={id} value={id}>{drugById[id].nome}</option>
                      ))}
                    </select>
                  </label>
                  <label className="cpf-field cpf-field-sm">
                    Dose (mg)
                    <input type="number" min="0" step="any" value={bzdVal} onChange={(e) => setBzdVal(e.target.value)} />
                  </label>
                </div>
                {(() => {
                  const base = EQ_BZD[bzdDrug].v; const dose = parseFloat(String(bzdVal).replace(",", ".")) || 0;
                  return (
                    <div className="cpf-readout">
                      <span className="cpf-readnum">{fmt(dose / base * 10)}</span>
                      <span className="cpf-readunit">mg diazepam-eq</span>
                    </div>
                  );
                })()}
              </div>
              <div className="cpf-warn2">Equivalenze secondo il Ashton Manual (voci italiane contrassegnate come «orientativo»). Utili per pianificare uno switch o una sospensione graduale; sempre da adattare alla risposta clinica.</div>
              <div className="cpf-ladder">
                <div className="cpf-laddertitle">Dosi equivalenti approssimative</div>
                {(() => {
                  const base = EQ_BZD[bzdDrug].v; const dose = parseFloat(String(bzdVal).replace(",", ".")) || 0;
                  const rows = Object.keys(EQ_BZD).map((id) => ({ id, dose: dose / base * EQ_BZD[id].v, fonte: EQ_BZD[id].fonte }));
                  const max = Math.max(...rows.map((r) => r.dose), 0.0001);
                  rows.sort((a, b) => a.dose - b.dose);
                  return rows.map((r) => {
                    const d = drugById[r.id]; const c = CLASSI[d.cls];
                    return <Bar key={r.id} frac={r.dose / max} color={c.color} valore={<span className="cpf-mono">{fmt(r.dose)} mg</span>}>
                      <span className={r.id === bzdDrug ? "cpf-barname cpf-barname-on" : "cpf-barname"}>{d.nome}</span>
                      {r.fonte !== "Ashton" && <span className="cpf-barfonte">{r.fonte}</span>}</Bar>;
                  });
                })()}
              </div>
            </div>
          )}

          {/* Litio mg <-> mEq */}
          {convTab === "litio" && (
            <div className="cpf-conv">
              <div className="cpf-convcard">
                <div className="cpf-fieldrow">
                  <label className="cpf-field">
                    Direzione
                    <select value={liMode} onChange={(e) => setLiMode(e.target.value)}>
                      <option value="mg2meq">mg carbonato → mEq</option>
                      <option value="meq2mg">mEq → mg carbonato</option>
                    </select>
                  </label>
                  <label className="cpf-field cpf-field-sm">
                    {liMode === "mg2meq" ? "mg (Li₂CO₃)" : "mEq di Li⁺"}
                    <input type="number" min="0" step="any" value={liVal} onChange={(e) => setLiVal(e.target.value)} />
                  </label>
                </div>
                {(() => {
                  const v = parseFloat(String(liVal).replace(",", ".")) || 0;
                  if (liMode === "mg2meq") {
                    const meq = v / LITIO.mgPerMEq;
                    return <div className="cpf-readout"><span className="cpf-readnum">{fmt(meq)}</span><span className="cpf-readunit">mEq Li⁺ (= {fmt(meq)} mmol)</span><span className="cpf-readnote">carbonato 300 mg = 8,1 mEq (dal testo)</span></div>;
                  }
                  const mg = v * LITIO.mgPerMEq;
                  return <div className="cpf-readout"><span className="cpf-readnum">{fmt(mg)}</span><span className="cpf-readunit">mg di carbonato di litio</span><span className="cpf-readnote">carbonato 300 mg = 8,1 mEq (dal testo)</span></div>;
                })()}
              </div>
              <div className="cpf-reftable">
                <div className="cpf-reftitle">Riferimenti rapidi (carbonato di litio)</div>
                <table className="cpf-mini">
                  <thead><tr><th>Compressa</th><th>mEq di Li⁺</th></tr></thead>
                  <tbody>
                    <tr><td className="cpf-mono">150 mg</td><td className="cpf-mono">{fmt(150 / LITIO.mgPerMEq)} mEq</td></tr>
                    <tr><td className="cpf-mono">300 mg</td><td className="cpf-mono">8,1 mEq</td></tr>
                    <tr><td className="cpf-mono">600 mg</td><td className="cpf-mono">{fmt(600 / LITIO.mgPerMEq)} mEq</td></tr>
                    <tr><td className="cpf-mono">900 mg</td><td className="cpf-mono">{fmt(900 / LITIO.mgPerMEq)} mEq</td></tr>
                  </tbody>
                </table>
                <div className="cpf-reffoot">Litiemia efficace 0,5–1,2 mEq/l · tossica &gt;1,5 mEq/l. 1 mEq di Li⁺ = 1 mmol.</div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ---------------- PROFILI DI RISCHIO ---------------- */}
      {tab === "rischio" && (
        <section className="cpf-panel">
          <div className="cpf-riskhead">
            <div className="cpf-chips cpf-chips-dim">
              {RISK_DIMS.map((d) => (
                <button key={d.key} className={"cpf-chip" + (riskDim === d.key ? " cpf-chip-on cpf-chip-dim-on" : "")} onClick={() => setRiskDim(d.key)}>{d.short}</button>
              ))}
            </div>
            <div className="cpf-chips">
              <button className={"cpf-chip" + (riskCls === "tutte" ? " cpf-chip-on" : "")} onClick={() => setRiskCls("tutte")}>Tutte le classi</button>
              {ORDINE_CLASSI.map((k) => (
                <button key={k} className={"cpf-chip" + (riskCls === k ? " cpf-chip-on" : "")} onClick={() => setRiskCls(k)}
                  style={riskCls === k ? { background: CLASSI[k].color, borderColor: CLASSI[k].color, color: "#fff" } : { borderColor: CLASSI[k].color, color: CLASSI[k].color }}>{CLASSI[k].short}</button>
              ))}
            </div>
          </div>

          <div className="cpf-rankwrap">
            <div className="cpf-ranktitle">
              {RISK_DIMS.find((d) => d.key === riskDim).label}
              <span className="cpf-scalelegend">
                {RISK_LIV.map((l, i) => (<span key={i} className="cpf-scaledot"><span className="cpf-sd" style={{ background: riskColor(i) }} />{l}</span>))}
              </span>
            </div>
            {rankRows.length === 0
              ? <div className="cpf-empty">Nessun dato per questa dimensione nella classe selezionata.</div>
              : rankRows.map(({ d, v }) => {
                  const c = CLASSI[d.cls];
                  return (
                    <div key={d.id} className="cpf-rankrow" onClick={() => setDettaglio(d.id)}>
                      <span className="cpf-ranktag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                      <span className="cpf-rankname">{d.nome}</span>
                      <span className="cpf-ranktrack"><span className="cpf-rankfill" style={{ width: `${v === 0 ? 7 : (v / 3) * 100}%`, background: riskGradient(v) }} /></span>
                      <span className="cpf-ranklev" style={{ color: riskColor(v) }}>{RISK_LIV[v]}</span>
                    </div>
                  );
                })}
          </div>
          <div className="cpf-methodnote">Profili <strong>comparativi ordinali</strong> (0 = trascurabile → 3 = alto): sintesi orientativa dagli appunti e dalla letteratura consolidata. Non sostituiscono la valutazione del singolo caso né l’RCP. Le dimensioni non applicabili a un farmaco non compaiono nella relativa classifica.</div>
        </section>
      )}

      {/* ---------------- INTERAZIONI CYP ---------------- */}
      {tab === "cyp" && (
        <section className="cpf-panel">
          <div className="cpf-cypedu">
            <div className="cpf-blocktitle">Citocromi P450: come leggerli</div>
            <p className="cpf-cyplead">Un farmaco può essere <strong>substrato</strong> (metabolizzato da un enzima), <strong>inibitore</strong> (ne blocca l’attività → ↑ livelli dei substrati) o <strong>induttore</strong> (ne aumenta la sintesi → ↓ livelli dei substrati). L’inibizione è rapida (ore–giorni); l’induzione è lenta a instaurarsi e a risolversi (1–3 settimane). Per i <em>profarmaci</em> il rapporto si inverte: se richiedono l’enzima per attivarsi, un inibitore li rende inefficaci.</p>
            <div className="cpf-cypcols">
              <div className="cpf-cypecol cpf-cypecol-inh">
                <div className="cpf-cypcoltit">Inibitori importanti (↑ substrati)</div>
                <ul className="cpf-cyplist">
                  <li><strong>Fluvoxamina</strong> — 1A2 e 2C19 (potente): ↑ clozapina, olanzapina, agomelatina, caffeina.</li>
                  <li><strong>Fluoxetina · Paroxetina</strong> — 2D6 (potente): ↑ triciclici, risperidone, atomoxetina; rendono inefficace il tamoxifene.</li>
                  <li><strong>Bupropione · Duloxetina</strong> — 2D6 (moderato).</li>
                  <li><strong>Azoli</strong> (keto-/itra-/fluconazolo), <strong>macrolidi</strong> (claritro-/eritromicina), <strong>ritonavir</strong> — 3A4: ↑ molti AP/AD, midazolam, quetiapina.</li>
                  <li><strong>Succo di pompelmo</strong> — 3A4 intestinale: ↑ substrati orali (buspirone, quetiapina, midazolam).</li>
                  <li><strong>Valproato</strong> — inibisce la glicuronazione: ↑ lamotrigina (dimezzare la titolazione), ↑ lorazepam.</li>
                </ul>
              </div>
              <div className="cpf-cypecol cpf-cypecol-ind">
                <div className="cpf-cypcoltit">Induttori importanti (↓ substrati)</div>
                <ul className="cpf-cyplist">
                  <li><strong>Carbamazepina</strong> — 3A4/1A2/2C (potente, con auto-induzione): ↓ molti AP/AD e i contraccettivi orali, ↓ sé stessa.</li>
                  <li><strong>Fenitoina · Fenobarbital · Primidone</strong> — induttori ad ampio spettro.</li>
                  <li><strong>Rifampicina</strong> — induttore potente 3A4/2C.</li>
                  <li><strong>Iperico</strong> (Erba di San Giovanni) — 3A4/glicoproteina-P: ↓ molti farmaci, rischio di fallimento terapeutico.</li>
                  <li><strong>Fumo di tabacco</strong> — 1A2 (idrocarburi policiclici, <em>non</em> la nicotina): ↓ clozapina e olanzapina. Alla <strong>sospensione del fumo</strong> i livelli risalgono in ~1 settimana → ridurre la dose.</li>
                </ul>
              </div>
            </div>
            <div className="cpf-cypenote">Polimorfismo del <strong>CYP2D6</strong>: i metabolizzatori lenti hanno esposizione più elevata ai substrati (es. atomoxetina, risperidone, triciclici), gli ultrarapidi rischiano l’inefficacia. La <strong>funzione renale</strong> è determinante per litio, amisulpride, gabapentin, pregabalin e memantina; la <strong>funzione epatica</strong> per la maggior parte degli altri.</div>
          </div>
          <div className="cpf-alerts">
            <div className="cpf-blocktitle">Interazioni rilevanti</div>
            {INTER_ALERT.map((al, i) => (
              <div key={i} className={"cpf-alert cpf-alert-" + al.tipo}>
                <div className="cpf-alerthead">
                  <span className="cpf-alertpair">{al.a} <span className="cpf-alertx">+</span> {al.b}</span>
                  <span className="cpf-alertbadge">{al.tipo}</span>
                </div>
                <div className="cpf-alerteff">{al.eff}</div>
              </div>
            ))}
          </div>

          <div className="cpf-blocktitle cpf-blocktitle-sp">Matrice per isoenzima</div>
          <div className="cpf-cypgrid">
            {["1A2", "2B6", "2C9", "2C19", "2D6", "3A4"].map((enz) => {
              const sub = Object.keys(CYP).filter((id) => (CYP[id].sub || []).includes(enz));
              const inh = Object.keys(CYP).filter((id) => (CYP[id].inib || []).some((x) => x.e === enz));
              const ind = Object.keys(CYP).filter((id) => (CYP[id].ind || []).includes(enz));
              return (
                <div key={enz} className="cpf-cypcard">
                  <div className="cpf-cyphead">CYP{enz}</div>
                  <div className="cpf-cypnote">{CYP_META[enz]}</div>
                  <div className="cpf-cypcol">
                    <span className="cpf-cyplab cpf-cyplab-sub">Substrati</span>
                    <div className="cpf-cypchips">
                      {sub.length ? sub.map((id) => <button key={id} className="cpf-cchip cpf-cchip-sub" onClick={() => setDettaglio(id)}>{drugById[id].nome}</button>) : <span className="cpf-dash">—</span>}
                    </div>
                  </div>
                  <div className="cpf-cypcol">
                    <span className="cpf-cyplab cpf-cyplab-inh">Inibitori</span>
                    <div className="cpf-cypchips">
                      {inh.length ? inh.map((id) => {
                        const f = (CYP[id].inib.find((x) => x.e === enz) || {}).f;
                        return <button key={id} className="cpf-cchip cpf-cchip-inh" onClick={() => setDettaglio(id)}>{drugById[id].nome}{f ? <span className="cpf-cforce">{f}</span> : null}</button>;
                      }) : <span className="cpf-dash">—</span>}
                    </div>
                  </div>
                  <div className="cpf-cypcol">
                    <span className="cpf-cyplab cpf-cyplab-ind">Induttori</span>
                    <div className="cpf-cypchips">
                      {ind.length ? ind.map((id) => <button key={id} className="cpf-cchip cpf-cchip-ind" onClick={() => setDettaglio(id)}>{drugById[id].nome}</button>) : <span className="cpf-dash">—</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="cpf-methodnote">Profili CYP tratti dal testo. «+…++++» indica la potenza relativa di inibizione. Toccare un farmaco per aprirne la scheda.</div>
        </section>
      )}

      {/* ---------------- MONITORAGGIO & TDM ---------------- */}
      {tab === "monitoraggio" && (
        <section className="cpf-panel">
          <div className="cpf-blocktitle">Monitoraggio ematico e livelli plasmatici</div>
          <div className="cpf-monitgrid">
            {MONIT_IDS.map((id) => {
              const d = drugById[id]; const c = CLASSI[d.cls];
              return (
                <div key={id} className="cpf-monitcard" onClick={() => setDettaglio(id)}>
                  <div className="cpf-monithead">
                    <span className="cpf-tag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                    <span className="cpf-monitname">{d.nome}</span>
                  </div>
                  <div className="cpf-monittext">{MONIT[id]}</div>
                </div>
              );
            })}
          </div>
          <div className="cpf-methodnote">Schemi di monitoraggio e intervalli terapeutici dagli appunti; confrontare sempre con l’RCP vigente per posologia, controlli e soglie di sospensione.</div>
        </section>
      )}

      {/* ---------------- GLOSSARIO & FONTI ---------------- */}
      {tab === "titolazione" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Titolazioni per indicazione — con la ratio</div>
            <p className="cpf-indlead">Per ogni farmaco e per <strong>ciascuna indicazione</strong> (on e off-label): da dove si parte, di quanto si sale, <strong>dopo quanto tempo</strong>, il target, il massimo — e soprattutto <strong>perché</strong> si titola così. La stessa molecola richiede spesso schemi diversi a seconda dell’indicazione.</p>
          </div>
          <input className="cpf-search cpf-titsearch" placeholder="Cerca farmaco o indicazione (es. DOC, panico, mania)…" value={titQ} onChange={(e) => setTitQ(e.target.value)} />
          {titList.length === 0
            ? <div className="cpf-empty">Nessun farmaco corrisponde alla ricerca.</div>
            : titList.map((d) => {
                const t = TITOLAZIONE[d.id];
                const c = CLASSI[d.cls];
                return (
                  <div key={d.id} className="cpf-tit" style={{ borderLeftColor: c.color }}>
                    <div className="cpf-tithead">
                      <button className="cpf-titname" onClick={() => setDettaglio(d.id)} style={{ color: c.color }}>{d.nome}</button>
                      <span className="cpf-tittag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                    </div>
                    {t.schemi.map((s, i) => (
                      <div key={i} className="cpf-titschema">
                        <div className="cpf-titind">{s.ind}</div>
                        <div className="cpf-titgrid">
                          <div className="cpf-titcell"><span className="cpf-titlab">Avvio</span><span className="cpf-mono">{s.start}</span></div>
                          <div className="cpf-titcell"><span className="cpf-titlab">Incremento</span><span className="cpf-mono">{s.step}</span></div>
                          <div className="cpf-titcell"><span className="cpf-titlab">Ogni</span><span className="cpf-mono">{s.ogni}</span></div>
                          <div className="cpf-titcell"><span className="cpf-titlab">Target</span><span className="cpf-mono cpf-tittarget">{s.target}</span></div>
                          <div className="cpf-titcell"><span className="cpf-titlab">Massimo</span><span className="cpf-mono">{s.max}</span></div>
                        </div>
                        <div className="cpf-titratio"><span className="cpf-emgratiolab">Ratio</span>{s.ratio}</div>
                      </div>
                    ))}
                    <div className="cpf-titfoot">
                      <div className="cpf-titfootrow"><span className="cpf-titfootlab">In pratica</span>{t.generale}</div>
                      <div className="cpf-titfootrow"><span className="cpf-titfootlab">Sospensione</span>{t.sospensione}</div>
                    </div>
                  </div>
                );
              })}
          <div className="cpf-methodnote">Schemi orientativi da RCP, Maudsley Prescribing Guidelines e Stahl: vanno individualizzati per età, funzione epatica e renale, comorbilità, interazioni e tollerabilità. Le indicazioni contrassegnate come off-label seguono le regole italiane sulla prescrizione off-label (Legge 94/1998, Legge 648/1996). Verificare sempre l’RCP vigente.</div>
        </section>
      )}

      {tab === "prn" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Ri-somministrazione al bisogno (PRN)</div>
            <p className="cpf-indlead">Per ogni molecola in cui è pertinente: via, dose singola, <strong>intervallo minimo prima di poter ripetere la dose</strong> e tetto indicativo nelle 24 ore. Il «al bisogno» riguarda soprattutto agitazione, ansia acuta e insonnia; antidepressivi, stabilizzanti, antidemenza, farmaci per le dipendenze e stimolanti si somministrano <strong>a orario fisso</strong>, non al bisogno.</p>
          </div>
          <div className="cpf-prnwarn">La prescrizione al bisogno va sempre individualizzata e deve specificare dose, intervallo minimo e dose massima/24h, con rivalutazione clinica dopo ogni somministrazione. Gli intervalli sono orientativi (RCP e pratica clinica): verificare l’RCP vigente. Attenzione alle associazioni (sedazione, depressione respiratoria, prolungamento del QT).</div>
          {[["agit", "Agitazione psicomotoria acuta", "#B25B3A"], ["ansia", "Ansia acuta", "#7A4EA8"], ["insonnia", "Insonnia (dose serale)", "#0E7C86"]].map(([u, titolo, col]) => {
            const items = DATA.filter((d) => PRN[d.id] && PRN[d.id].uso === u);
            if (!items.length) return null;
            return (
              <div key={u} className="cpf-prngroup">
                <div className="cpf-prnclass" style={{ color: col, borderColor: col }}>{titolo}</div>
                <div className="cpf-prncards">
                  {items.map((d) => {
                    const p = PRN[d.id];
                    return (
                      <div key={d.id} className="cpf-prncard">
                        <button className="cpf-prnname" onClick={() => setDettaglio(d.id)} style={{ color: col }}>{d.nome}</button>
                        <div className="cpf-prnfields">
                          <div className="cpf-prnf"><span className="cpf-prnlab">Via</span><span className="cpf-mono">{p.via}</span></div>
                          <div className="cpf-prnf"><span className="cpf-prnlab">Dose</span><span className="cpf-mono">{p.dose}</span></div>
                          <div className="cpf-prnf cpf-prnf-hi"><span className="cpf-prnlab">Intervallo minimo</span><span className="cpf-mono">{p.intervallo}</span></div>
                          <div className="cpf-prnf"><span className="cpf-prnlab">Max / 24h</span><span className="cpf-mono">{p.max}</span></div>
                        </div>
                        <div className="cpf-prnnote">{p.note}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div className="cpf-methodnote">Gli intervalli indicano il tempo minimo prima di ripetere la dose, non uno schema a orario fisso. Per l’olanzapina im e per gli altri antipsicotici parenterali valgono le specifiche restrizioni di associazione e di numero di somministrazioni/24h riportate in scheda tecnica. Fonti: RCP/AIFA e pratica clinica consolidata.</div>
        </section>
      )}

      {tab === "emergenze" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Emergenze ed eventi clinici — guida operativa</div>
            <p className="cpf-indlead">Per ogni scenario: cosa dare, <strong>quanto</strong> (anche in gocce), <strong>dopo quanto ripetere</strong>, la dose massima e la <strong>ratio</strong>. Protocolli orientativi (Maudsley / pratica clinica) per il clinico: individualizzare, monitorare, verificare l’RCP. Non sostituiscono il giudizio clinico né i protocolli locali.</p>
          </div>
          {EMERGENZE.map((e) => (
            <div key={e.id} className={"cpf-emg cpf-emg-" + e.grav}>
              <div className="cpf-emghead">
                <span className="cpf-emgtitle">{e.evento}</span>
                <span className="cpf-emgtags">
                  <span className="cpf-emgarea">{e.area}</span>
                  <span className={"cpf-emggrav cpf-emggrav-" + e.grav}>{e.grav === "critica" ? "critica" : e.grav === "alta" ? "alta urgenza" : "media"}</span>
                </span>
              </div>
              <div className="cpf-emgdrugs">
                {e.farmaci.map((f, i) => (
                  <div key={i} className="cpf-emgdrug">
                    {f.drugId
                      ? <button className="cpf-emgname cpf-emgname-link" onClick={() => setDettaglio(f.drugId)}>{f.nome}</button>
                      : <span className="cpf-emgname">{f.nome}</span>}
                    <span className="cpf-emgdoseval cpf-mono">{f.dose}</span>
                    <span className="cpf-emgmeta">
                      <span className="cpf-emgrepeat">↻ {f.ripeti}</span>
                      {f.max && f.max !== "—" && <span className="cpf-emgmax">max {f.max}</span>}
                    </span>
                  </div>
                ))}
              </div>
              <div className="cpf-emgratio"><span className="cpf-emgratiolab">Ratio</span>{e.ratio}</div>
              {e.allerta && <div className="cpf-emgallerta">{e.allerta}</div>}
            </div>
          ))}
          <div className="cpf-methodnote">Guida operativa di riferimento per professionisti: le dosi sono orientative e vanno individualizzate secondo paziente, contesto e protocolli locali. Alcuni antidoti (biperidene, naloxone, flumazenil, tiamina, propranololo, ciproeptadina) non fanno parte del catalogo psicofarmaci ma sono citati per completezza del protocollo. Verificare sempre l’RCP vigente.</div>
        </section>
      )}

      {tab === "sostanze" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Sostanze d’abuso — riconoscere e gestire</div>
            <p className="cpf-indlead">Per ogni sostanza: meccanismo, <strong>intossicazione</strong>, <strong>overdose</strong>, <strong>astinenza</strong> e soprattutto la <strong>gestione clinica</strong>. Finalità di riconoscimento e trattamento (tossicologia/urgenza), non di facilitazione. Protocolli orientativi da individualizzare in setting adeguato.</p>
          </div>
          {SOSTANZE.map((s) => {
            const c = SOST_CAT[s.cat];
            return (
              <div key={s.id} className="cpf-sost" style={{ borderLeftColor: c.color }}>
                <div className="cpf-sosthead">
                  <span className="cpf-sostname">{s.nome}</span>
                  <span className="cpf-sosttag" style={{ background: c.soft, color: c.color }}>{c.label}</span>
                </div>
                <div className="cpf-sostmecc">{s.mecc}</div>
                <div className="cpf-sostgrid">
                  <div className="cpf-sostblock cpf-sostblock-intox"><span className="cpf-sostlab">Intossicazione</span><span className="cpf-sosttxt">{s.intox}</span></div>
                  <div className="cpf-sostblock cpf-sostblock-od"><span className="cpf-sostlab">Overdose / pericolo</span><span className="cpf-sosttxt">{s.overdose}</span></div>
                  <div className="cpf-sostblock cpf-sostblock-ast"><span className="cpf-sostlab">Astinenza</span><span className="cpf-sosttxt">{s.astinenza}</span></div>
                </div>
                <div className="cpf-sostgest"><span className="cpf-sostgestlab">Gestione clinica</span>{s.gestione}</div>
                {s.note && <div className="cpf-sostnote">{s.note}</div>}
              </div>
            );
          })}
          <div className="cpf-methodnote">Riferimenti tossicologici standard (Maudsley, Goldfrank e testo di riferimento). La gestione delle intossicazioni e delle astinenze va condotta in ambiente adeguato e individualizzata; i farmaci per il trattamento delle dipendenze (metadone, buprenorfina, naltrexone, acamprosato, disulfiram, nalmefene, sodio oxibato, vareniclina) e gli antidoti (naloxone, flumazenil) sono nel catalogo. Verificare sempre i protocolli locali.</div>
        </section>
      )}

      {tab === "sicurezza" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Allerte salvavita e popolazioni speciali</div>
            <p className="cpf-indlead">Per ogni farmaco: le <strong>cose da ricordare che salvano la vita</strong> (red flag), più gravidanza, allattamento, anziano, insufficienza renale ed epatica e il quadro di <strong>sovradosaggio</strong>. Ricercabile per farmaco o per parola chiave (es. «QT», «agranulocitosi», «gravidanza»).</p>
          </div>
          <div className="cpf-indtools">
            <input className="cpf-search cpf-titsearch" placeholder="Cerca farmaco o allerta (es. QT, agranulocitosi, iponatriemia)…" value={sicQ} onChange={(e) => setSicQ(e.target.value)} />
            <button className={"cpf-chip" + (sicSolo ? " cpf-chip-on" : "")} onClick={() => setSicSolo(!sicSolo)}
              style={sicSolo ? { background: "#C0472E", borderColor: "#C0472E", color: "#fff" } : { borderColor: "#C0472E", color: "#C0472E" }}>
              Solo allerte salvavita
            </button>
            <span className="cpf-siccount">{sicList.length} farmaci</span>
          </div>
          {sicList.length === 0
            ? <div className="cpf-empty">Nessun farmaco corrisponde alla ricerca.</div>
            : sicList.map((d) => {
                const s = SICUREZZA[d.id];
                const c = CLASSI[d.cls];
                return (
                  <div key={d.id} className="cpf-sic" style={{ borderLeftColor: c.color }}>
                    <div className="cpf-tithead">
                      <button className="cpf-titname" onClick={() => setDettaglio(d.id)} style={{ color: c.color }}>{d.nome}</button>
                      <span className="cpf-tittag" style={{ background: c.soft, color: c.color }}>{c.short}</span>
                    </div>
                    <div className="cpf-sicred">
                      {s.red.map((r, i) => (
                        <div key={i} className={"cpf-sicrow cpf-sicrow-" + r[0]}>
                          <span className={"cpf-sicbadge cpf-sicbadge-" + r[0]}>{r[0]}</span>
                          <span className="cpf-sictxt">{r[1]}</span>
                        </div>
                      ))}
                    </div>
                    <div className="cpf-sicpop">
                      <div className="cpf-sicpopcell"><span className="cpf-titlab">Gravidanza</span><span className="cpf-sicpoptxt">{s.grav}</span></div>
                      <div className="cpf-sicpopcell"><span className="cpf-titlab">Allattamento</span><span className="cpf-sicpoptxt">{s.allatt}</span></div>
                      <div className="cpf-sicpopcell"><span className="cpf-titlab">Anziano</span><span className="cpf-sicpoptxt">{s.anz}</span></div>
                      <div className="cpf-sicpopcell"><span className="cpf-titlab">Insuff. renale</span><span className="cpf-sicpoptxt">{s.rene}</span></div>
                      <div className="cpf-sicpopcell"><span className="cpf-titlab">Insuff. epatica</span><span className="cpf-sicpoptxt">{s.fegato}</span></div>
                    </div>
                    <div className="cpf-sicod"><span className="cpf-sicodlab">Sovradosaggio</span>{s.od}</div>
                  </div>
                );
              })}
          <div className="cpf-methodnote">Le allerte contrassegnate come <strong>salvavita</strong> indicano eventi potenzialmente fatali da riconoscere e gestire subito. Informazioni orientative da RCP/AIFA, Maudsley e Stahl: non sostituiscono il giudizio clinico né la consultazione dell’RCP vigente. Per gravidanza e allattamento la decisione va sempre individualizzata considerando anche il rischio del <em>non</em> trattare.</div>
        </section>
      )}

      {tab === "indicazioni" && (
        <section className="cpf-panel">
          <div className="cpf-indintro">
            <div className="cpf-blocktitle">Indicazioni on-label e off-label</div>
            <p className="cpf-indlead">Per ogni molecola: indicazioni <strong>registrate</strong> (on-label, secondo la tipica autorizzazione AIFA/RCP) e principali usi <strong>off-label</strong> supportati da evidenze o dalla pratica clinica. Lo stato di registrazione varia per formulazione e nel tempo: verificare sempre l’RCP vigente.</p>
          </div>
          <div className="cpf-indtools">
            <input className="cpf-search cpf-indsearch" placeholder="Cerca farmaco…" value={indQ} onChange={(e) => setIndQ(e.target.value)} />
            <div className="cpf-chips">
              <button className={"cpf-chip" + (indCls === "tutte" ? " cpf-chip-on" : "")} onClick={() => setIndCls("tutte")}>Tutte</button>
              {ORDINE_CLASSI.map((k) => (
                <button key={k} className={"cpf-chip" + (indCls === k ? " cpf-chip-on" : "")} onClick={() => setIndCls(k)}
                  style={indCls === k ? { background: CLASSI[k].color, borderColor: CLASSI[k].color, color: "#fff" } : { borderColor: CLASSI[k].color, color: CLASSI[k].color }}>{CLASSI[k].short}</button>
              ))}
            </div>
          </div>
          {indGroups.length === 0
            ? <div className="cpf-empty">Nessun farmaco corrisponde alla ricerca.</div>
            : indGroups.map(({ cls, items }) => {
                const c = CLASSI[cls];
                return (
                  <div key={cls} className="cpf-indgroup">
                    <div className="cpf-indclass" style={{ color: c.color, borderColor: c.color }}>{c.label}</div>
                    {items.map((d) => {
                      const ix = INDICAZIONI[d.id] || { on: [d.ind], off: [] };
                      return (
                        <div key={d.id} className="cpf-indrow">
                          <button className="cpf-indname" onClick={() => setDettaglio(d.id)} style={{ color: c.color }}>{d.nome}</button>
                          <div className="cpf-indcols">
                            <div className="cpf-indcol">
                              <span className="cpf-indlab cpf-indlab-on">On-label</span>
                              <ul className="cpf-indlist">{ix.on.map((t, i) => <li key={i}>{t}</li>)}</ul>
                            </div>
                            <div className="cpf-indcol">
                              <span className="cpf-indlab cpf-indlab-off">Off-label</span>
                              {ix.off.length ? <ul className="cpf-indlist">{ix.off.map((t, i) => <li key={i}>{t}</li>)}</ul> : <span className="cpf-dash">—</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          <div className="cpf-methodnote cpf-indnote">
            <strong>Uso off-label in Italia.</strong> La prescrizione off-label è ammessa in casi selezionati, sotto la responsabilità del medico, con <em>consenso informato</em> del paziente e in assenza di valida alternativa autorizzata (Legge 94/1998 art. 3, «legge Di Bella»; Legge 648/1996 per i medicinali erogabili a carico del SSN negli elenchi AIFA). Le voci off-label qui riportate hanno finalità informativa e non costituiscono raccomandazione prescrittiva; l’on-label riflette la tipica registrazione e va verificato sull’RCP e sulle determine AIFA vigenti.
          </div>
        </section>
      )}

      {tab === "glossario" && (
        <section className="cpf-panel">
          <div className="cpf-fonti">
            <div className="cpf-blocktitle">Metodologia e fonti</div>
            <ul className="cpf-fontilist">
              <li><strong>Dataset clinico</strong> (meccanismi, indicazioni, posologie, effetti, avvertenze, profili recettoriali): <em>«Appunti di Psicofarmacologia»</em>, R. Di Lorenzo, Scuola di Specializzazione in Psichiatria, UNIMORE, AA 2024-2025.</li>
              <li><strong>Equivalenti antipsicotici</strong> (clorpromazina-eq): stime orientative da consenso internazionale (Gardner et al., 2010) e metodo delle dosi definite giornaliere. Metodo controverso, ampia variabilità.</li>
              <li><strong>Equivalenti benzodiazepine</strong> (diazepam-eq): Ashton Manual; alcune voci italiane (etizolam, delorazepam, clotiazepam, brotizolam) sono indicate come «orientativo».</li>
              <li><strong>Profili CYP450 e monitoraggio/TDM</strong>: dagli appunti, coerenti con le schede tecniche AIFA.</li>
              <li><strong>Profili di rischio ordinali</strong> (0–3): sintesi orientativa dagli appunti e dalla letteratura consolidata, a fini di confronto didattico.</li>
            </ul>
            <div className="cpf-fontifoot">Strumento didattico e non prescrittivo. Non sostituisce l’RCP, le determine AIFA né il giudizio clinico.</div>
          </div>
          <div className="cpf-blocktitle cpf-blocktitle-sp">Glossario</div>
          <div className="cpf-glossgrid">
            {GLOSSARIO.map((g) => (
              <div key={g.s} className="cpf-glossrow"><span className="cpf-glosss">{g.s}</span><span className="cpf-glossd">{g.d}</span></div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- SCHEDA DETTAGLIO (modale) ---------------- */}
      {det && (() => {
        const c = CLASSI[det.cls];
        const cy = CYP[det.id];
        return (
          <div className="cpf-modal" onClick={() => setDettaglio(null)}>
            <div className="cpf-modalcard" onClick={(e) => e.stopPropagation()}>
              <button className="cpf-modalclose" onClick={() => setDettaglio(null)} aria-label="Chiudi">×</button>
              <div className="cpf-modalhead" style={{ borderTopColor: c.color }}>
                <span className="cpf-tag" style={{ background: c.soft, color: c.color }}>{c.label} · {det.sub}</span>
                <h2 className="cpf-modalname">{det.nome}</h2>
              </div>
              <div className="cpf-modalbody">
                <div className="cpf-modalviz">
                  {det.rec && (
                    <div className="cpf-modalvizbox">
                      <div className="cpf-vizlabel">Profilo recettoriale</div>
                      <Radar series={[{ rec: det.rec, color: c.color, label: det.nome }]} size={220} />
                    </div>
                  )}
                  {RISK[det.id] && (
                    <div className="cpf-modalvizbox">
                      <div className="cpf-vizlabel">Profili di rischio</div>
                      <RiskBars risk={RISK[det.id]} />
                    </div>
                  )}
                </div>
                <div className="cpf-modalfields">
                  {[["Nomi commerciali / formulazioni", det.com, true], ["Meccanismo d’azione", det.mecc], ["Indicazioni (da testo)", det.ind], ["Posologia / range", det.pos, true], ["Emivita · cinetica", det.emi, true], ["Metabolismo", det.met], ["Effetti collaterali", det.eff], ["Avvertenze / controindicazioni", det.avv], ["Note cliniche", det.note]].map(([l, v, m], i) =>
                    v ? (<div key={i} className="cpf-mfield"><span className="cpf-mflabel">{l}</span><span className={"cpf-mfval" + (m ? " cpf-mono" : "")}>{v}</span></div>) : null
                  )}
                  {INDICAZIONI[det.id] && (
                    <div className="cpf-mfield cpf-mfhi">
                      <span className="cpf-mflabel">Indicazioni on/off-label</span>
                      <div className="cpf-mfval">
                        <div className="cpf-mfind">
                          <span className="cpf-indlab cpf-indlab-on">On-label</span>
                          <span className="cpf-mfindtxt">{INDICAZIONI[det.id].on.join(" · ")}</span>
                        </div>
                        {INDICAZIONI[det.id].off.length ? (
                          <div className="cpf-mfind">
                            <span className="cpf-indlab cpf-indlab-off">Off-label</span>
                            <span className="cpf-mfindtxt">{INDICAZIONI[det.id].off.join(" · ")}</span>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}
                  {SICUREZZA[det.id] && (
                    <>
                      <div className="cpf-mfield cpf-mfhi">
                        <span className="cpf-mflabel">Allerte da ricordare</span>
                        <div className="cpf-mfval">
                          {SICUREZZA[det.id].red.map((r, i) => (
                            <div key={i} className={"cpf-sicrow cpf-sicrow-" + r[0]}>
                              <span className={"cpf-sicbadge cpf-sicbadge-" + r[0]}>{r[0]}</span>
                              <span className="cpf-sictxt">{r[1]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="cpf-mfield">
                        <span className="cpf-mflabel">Popolazioni speciali</span>
                        <div className="cpf-mfval cpf-mfpop">
                          <div><strong>Gravidanza:</strong> {SICUREZZA[det.id].grav}</div>
                          <div><strong>Allattamento:</strong> {SICUREZZA[det.id].allatt}</div>
                          <div><strong>Anziano:</strong> {SICUREZZA[det.id].anz}</div>
                          <div><strong>Insuff. renale:</strong> {SICUREZZA[det.id].rene}</div>
                          <div><strong>Insuff. epatica:</strong> {SICUREZZA[det.id].fegato}</div>
                        </div>
                      </div>
                      <div className="cpf-mfield">
                        <span className="cpf-mflabel">Sovradosaggio</span>
                        <span className="cpf-mfval">{SICUREZZA[det.id].od}</span>
                      </div>
                    </>
                  )}
                  {TITOLAZIONE[det.id] && (
                    <div className="cpf-mfield cpf-mfhi">
                      <span className="cpf-mflabel">Titolazione per indicazione</span>
                      <div className="cpf-mfval">
                        {TITOLAZIONE[det.id].schemi.map((s, i) => (
                          <div key={i} className="cpf-mftit">
                            <span className="cpf-mftitind">{s.ind}</span>
                            <span className="cpf-mfindtxt"><span className="cpf-mono">{s.start}</span> → {s.step} {s.ogni} → target <span className="cpf-mono">{s.target}</span> (max {s.max}). {s.ratio}</span>
                          </div>
                        ))}
                        <div className="cpf-mftit"><span className="cpf-mftitind">Sospensione</span><span className="cpf-mfindtxt">{TITOLAZIONE[det.id].sospensione}</span></div>
                      </div>
                    </div>
                  )}
                  <div className="cpf-mfield">
                    <span className="cpf-mflabel">Al bisogno (PRN)</span>
                    <div className="cpf-mfval">
                      {PRN[det.id]
                        ? <span className="cpf-mfindtxt"><span className="cpf-mono">{PRN[det.id].dose}</span> {PRN[det.id].via} · ripetibile <strong>{PRN[det.id].intervallo}</strong> · max {PRN[det.id].max}. {PRN[det.id].note}</span>
                        : <span className="cpf-mfindtxt">Non indicato al bisogno: terapia a orario fisso.</span>}
                    </div>
                  </div>
                  {cy && (
                    <div className="cpf-mfield">
                      <span className="cpf-mflabel">Profilo CYP450</span>
                      <div className="cpf-mfval">
                        <div className="cpf-mfcyp">
                          {cy.sub && cy.sub.length ? <span className="cpf-cchip cpf-cchip-sub">substrato: {cy.sub.map((e) => "CYP" + e).join(", ")}</span> : null}
                          {cy.inib && cy.inib.length ? <span className="cpf-cchip cpf-cchip-inh">inibitore: {cy.inib.map((x) => "CYP" + x.e + (x.f ? " " + x.f : "")).join(", ")}</span> : null}
                          {cy.ind && cy.ind.length ? <span className="cpf-cchip cpf-cchip-ind">induttore: {cy.ind.map((e) => "CYP" + e).join(", ")}</span> : null}
                        </div>
                        {cy.nota ? <div className="cpf-mfnote">{cy.nota}</div> : null}
                      </div>
                    </div>
                  )}
                  {MONIT[det.id] && (
                    <div className="cpf-mfield cpf-mfhi"><span className="cpf-mflabel">Monitoraggio / TDM</span><span className="cpf-mfval">{MONIT[det.id]}</span></div>
                  )}
                  {GOCCE[det.id] && (
                    <div className="cpf-mfield"><span className="cpf-mflabel">Conversione gocce</span><span className="cpf-mfval cpf-mono">{GOCCE[det.id].ratio} · {GOCCE[det.id].prod}</span></div>
                  )}
                  {(EQ_AP[det.id] !== undefined || EQ_BZD[det.id] !== undefined) && (
                    <div className="cpf-mfield"><span className="cpf-mflabel">Equivalenza di dose</span><span className="cpf-mfval cpf-mono">
                      {EQ_AP[det.id] !== undefined ? `${fmt(EQ_AP[det.id])} mg ≈ 100 mg clorpromazina` : ""}
                      {EQ_BZD[det.id] !== undefined ? `${fmt(EQ_BZD[det.id].v)} mg ≈ 10 mg diazepam (${EQ_BZD[det.id].fonte})` : ""}
                    </span></div>
                  )}
                </div>
              </div>
              <div className="cpf-modalfoot">Dati a scopo didattico · verificare su RCP/AIFA. <span className="cpf-nd">ND</span> = non disponibile nella fonte.</div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

/* =========================================================================
   STILE — strumento clinico di precisione (IBM Plex)
   ========================================================================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@500;600;700&display=swap');

.cpf-root{
  --ink:#16262d; --ink-soft:#3f545d; --muted:#5f777f;
  --line:#d8e1e3; --line-soft:#e8eeef; --canvas:#eef2f3; --surface:#ffffff; --surface-2:#f5f9f9;
  --accent:#0e5c6b; --accent-ink:#093f4a; --accent-soft:#dbebed; --seg-empty:#dae2e3;
  --serif:'IBM Plex Serif',Georgia,serif; --sans:'IBM Plex Sans',system-ui,-apple-system,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
  --radius:12px; --radius-sm:8px;
  --sh-sm:0 1px 2px rgba(20,40,48,.05),0 1px 3px rgba(20,40,48,.05);
  --sh:0 6px 22px rgba(20,40,48,.09); --sh-lg:0 24px 70px rgba(12,36,44,.30);
  font-family:var(--sans); color:var(--ink); background:var(--canvas);
  min-height:100%; line-height:1.5; -webkit-font-smoothing:antialiased; padding:0 0 64px;
}
.cpf-root *{box-sizing:border-box;}
.cpf-root button{font-family:inherit; cursor:pointer;}

/* ---- Header ---- */
.cpf-header{position:sticky; top:0; z-index:20; background:rgba(255,255,255,.94); backdrop-filter:blur(10px); border-bottom:1px solid var(--line); padding:20px clamp(16px,4vw,40px) 0;}
.cpf-headtop{display:flex; justify-content:space-between; align-items:flex-start; gap:16px; max-width:1240px; margin:0 auto;}
.cpf-brand{flex:1; min-width:0;}
.cpf-eyebrow{font-family:var(--mono); font-size:11px; letter-spacing:.16em; text-transform:uppercase; color:var(--accent); font-weight:500;}
.cpf-title{font-family:var(--serif); font-weight:700; font-size:clamp(24px,4vw,34px); margin:4px 0 6px; letter-spacing:-.01em; color:var(--ink);}
.cpf-source{font-size:13px; color:var(--muted); max-width:70ch; margin:0;}
.cpf-source em{font-style:italic; color:var(--ink-soft);}
.cpf-infobtn{flex-shrink:0; border:1px solid var(--line); background:var(--surface); color:var(--accent-ink); font-size:12.5px; font-weight:600; padding:8px 14px; border-radius:999px; transition:.16s;}
.cpf-infobtn:hover{border-color:var(--accent); background:var(--accent-soft);}
.cpf-disclaimer{max-width:1240px; margin:14px auto 0; background:var(--surface-2); border:1px solid var(--line); border-left:3px solid var(--accent); border-radius:var(--radius-sm); padding:12px 16px; font-size:12.5px; color:var(--ink-soft); line-height:1.6;}
.cpf-nd{font-family:var(--mono); font-size:.82em; background:#eef1ec; color:#7a6a3a; padding:1px 5px; border-radius:4px; letter-spacing:.02em;}

.cpf-tabs{display:flex; gap:2px; max-width:1240px; margin:16px auto 0; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; scroll-behavior:smooth;}
.cpf-tabs::-webkit-scrollbar{display:none;}
.cpf-tab{position:relative; white-space:nowrap; border:none; background:none; color:var(--muted); font-size:13.5px; font-weight:600; padding:11px 15px 13px; border-bottom:2px solid transparent; transition:.16s; display:flex; align-items:center; gap:7px;}
.cpf-tab:hover{color:var(--ink);}
.cpf-tab-on{color:var(--accent-ink); border-bottom-color:var(--accent);}
.cpf-tabbadge{font-family:var(--mono); font-size:10.5px; background:var(--accent); color:#fff; min-width:17px; height:17px; border-radius:9px; display:inline-flex; align-items:center; justify-content:center; padding:0 4px; font-weight:600;}

/* ---- Panel ---- */
.cpf-panel{max-width:1240px; margin:0 auto; padding:26px clamp(16px,4vw,40px) 0; animation:cpf-fade .28s ease;}
@keyframes cpf-fade{from{opacity:0; transform:translateY(6px);} to{opacity:1; transform:none;}}

/* ---- Toolbar / chips ---- */
.cpf-toolbar{margin-bottom:18px;}
.cpf-search{width:100%; border:1px solid var(--line); background:var(--surface); border-radius:var(--radius); padding:13px 16px; font-size:14.5px; font-family:inherit; color:var(--ink); box-shadow:var(--sh-sm); transition:.16s;}
.cpf-search:focus{outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft);}
.cpf-search::placeholder{color:#9fb2b8;}
.cpf-toolrow{display:flex; justify-content:space-between; align-items:center; gap:14px; margin-top:12px; flex-wrap:wrap;}
.cpf-chips{display:flex; gap:7px; flex-wrap:wrap;}
.cpf-chip{border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); font-size:12.5px; font-weight:600; padding:6px 12px; border-radius:999px; transition:.14s; display:inline-flex; align-items:center; gap:6px;}
.cpf-chip:hover{border-color:var(--accent);}
.cpf-chip-on{background:var(--accent); border-color:var(--accent); color:#fff;}
.cpf-chipn{font-family:var(--mono); font-size:10.5px; opacity:.72; font-weight:500;}
.cpf-sort{font-size:12.5px; color:var(--muted); display:inline-flex; align-items:center; gap:8px; font-weight:600;}
.cpf-sort select,.cpf-field select,.cpf-field input{font-family:inherit; font-size:13.5px; color:var(--ink); border:1px solid var(--line); background:var(--surface); border-radius:var(--radius-sm); padding:8px 11px; transition:.14s;}
.cpf-sort select:focus,.cpf-field select:focus,.cpf-field input:focus{outline:none; border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-soft);}

/* ---- Selection bar ---- */
.cpf-selbar{display:flex; justify-content:space-between; align-items:center; gap:12px; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:11px 16px; margin-bottom:18px; box-shadow:var(--sh-sm); flex-wrap:wrap;}
.cpf-selinfo{font-size:13px; color:var(--ink-soft);}
.cpf-muted{color:var(--muted);}
.cpf-selactions{display:flex; gap:9px;}
.cpf-ghost{border:1px solid var(--line); background:none; color:var(--ink-soft); font-size:12.5px; font-weight:600; padding:7px 13px; border-radius:999px; transition:.14s;}
.cpf-ghost:hover{border-color:var(--accent); color:var(--accent-ink);}
.cpf-cta{border:none; background:var(--accent); color:#fff; font-size:12.5px; font-weight:600; padding:7px 15px; border-radius:999px; transition:.14s;}
.cpf-cta:hover{background:var(--accent-ink);}
.cpf-cta:disabled{opacity:.45; cursor:not-allowed;}
.cpf-cta-alt{background:var(--surface); color:var(--accent-ink); border:1px solid var(--accent);}
.cpf-cta-alt:hover{background:var(--accent-soft);}

/* ---- Card grid ---- */
.cpf-grid{display:grid; grid-template-columns:repeat(auto-fill,minmax(248px,1fr)); gap:14px;}
.cpf-empty{grid-column:1/-1; text-align:center; color:var(--muted); font-size:14px; padding:48px 20px; border:1px dashed var(--line); border-radius:var(--radius); background:var(--surface-2);}
.cpf-card{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:15px 15px 13px; box-shadow:var(--sh-sm); transition:transform .16s,box-shadow .16s,border-color .16s; display:flex; flex-direction:column; content-visibility:auto; contain-intrinsic-size:auto 190px;}
.cpf-card:hover{transform:translateY(-2px); box-shadow:var(--sh); border-color:#c5d2d5;}
.cpf-card:focus-visible{outline:2px solid var(--accent); outline-offset:2px;}
.cpf-cardhead{display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px;}
.cpf-tag{font-size:11px; font-weight:600; padding:3px 9px; border-radius:999px; letter-spacing:.01em; white-space:nowrap;}
.cpf-check{width:28px; height:28px; flex-shrink:0; border:1px solid var(--line); background:var(--surface); color:var(--accent-ink); border-radius:8px; font-size:16px; line-height:1; font-weight:600; transition:.14s; display:flex; align-items:center; justify-content:center;}
.cpf-check:hover{border-color:var(--accent); background:var(--accent-soft);}
.cpf-check-dis{opacity:.35; cursor:not-allowed;}
.cpf-dname{font-family:var(--serif); font-weight:600; font-size:18px; color:var(--ink); line-height:1.2;}
.cpf-dsub{font-size:12px; color:var(--accent-ink); font-weight:600; margin-top:2px;}
.cpf-brands{font-family:var(--mono); font-size:11px; color:var(--muted); margin-top:7px; line-height:1.45; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;}
.cpf-cardrisk{margin-top:11px;}
.cpf-cardfoot{margin-top:12px; padding-top:10px; border-top:1px solid var(--line-soft); font-size:12px; font-weight:600; color:var(--accent); }

/* ---- Comparison table ---- */
.cpf-scroll{overflow-x:auto; border:1px solid var(--line); border-radius:var(--radius); background:var(--surface); box-shadow:var(--sh-sm); -webkit-overflow-scrolling:touch;}
.cpf-table{border-collapse:collapse; width:100%; min-width:520px;}
.cpf-attrhead,.cpf-attrcell{position:sticky; left:0; z-index:2; background:var(--surface-2); text-align:left; font-size:12px; font-weight:600; color:var(--ink-soft); padding:12px 14px; border-bottom:1px solid var(--line-soft); border-right:1px solid var(--line); width:150px; min-width:150px; vertical-align:top;}
.cpf-attrhead{z-index:3; background:#eef3f3;}
.cpf-colhead{border-top:3px solid var(--accent); border-bottom:1px solid var(--line); border-left:1px solid var(--line-soft); padding:12px 14px 10px; vertical-align:top; min-width:210px; background:var(--surface); position:relative;}
.cpf-colname{font-family:var(--serif); font-weight:600; font-size:16px; color:var(--ink); display:block; margin-bottom:5px;}
.cpf-colname-btn{border:none; background:none; padding:0; text-align:left; color:var(--ink); transition:.14s;}
.cpf-colname-btn:hover{color:var(--accent);}
.cpf-remove{position:absolute; top:10px; right:10px; width:20px; height:20px; border:none; background:var(--surface-2); color:var(--muted); border-radius:6px; font-size:14px; line-height:1; transition:.14s;}
.cpf-remove:hover{background:#f3dede; color:#b3462f;}
.cpf-cell{padding:11px 14px; font-size:12.5px; color:var(--ink-soft); border-bottom:1px solid var(--line-soft); border-left:1px solid var(--line-soft); vertical-align:top; line-height:1.5; min-width:210px;}
.cpf-mono,.cpf-cell.cpf-mono{font-family:var(--mono); font-size:11.5px; color:var(--ink);}
.cpf-dash{color:#b9c6c9;}

/* ---- Radar ---- */
.cpf-radar{width:100%; max-width:320px; height:auto; display:block; margin:0 auto; overflow:visible;}
.cpf-radar-grid{fill:none; stroke:var(--line); stroke-width:1;}
.cpf-radar-axis{stroke:var(--line-soft); stroke-width:1;}
.cpf-radar-label{font-family:var(--mono); font-size:9px; fill:var(--muted);}
.cpf-radarbox{margin-top:20px; background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:18px; box-shadow:var(--sh-sm);}
.cpf-radartitle{font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:var(--accent-ink); margin-bottom:12px;}
.cpf-radarwrap{display:flex; gap:22px; align-items:center; flex-wrap:wrap; justify-content:center;}
.cpf-radarleg{display:flex; flex-direction:column; gap:7px; min-width:180px;}
.cpf-legitem{display:flex; align-items:center; gap:8px; font-size:13px; color:var(--ink-soft); font-weight:500;}
.cpf-legdot{width:11px; height:11px; border-radius:3px; flex-shrink:0;}
.cpf-radarnote{font-size:11px; color:var(--muted); margin-top:6px; line-height:1.5;}
.cpf-minirec{display:flex; flex-direction:column; gap:5px;}
.cpf-mrrow{display:flex; align-items:center; gap:7px;}
.cpf-mrlabel{font-family:var(--mono); font-size:10px; color:var(--muted); width:64px;}
.cpf-mrbar{height:7px; border-radius:4px;}

/* ---- Risk bars ---- */
.cpf-riskbars{display:flex; flex-direction:column; gap:6px;}
.cpf-riskbars-c{gap:4px;}
.cpf-rbrow{display:flex; align-items:center; gap:8px;}
.cpf-rblabel{font-size:11px; color:var(--ink-soft); width:96px; flex-shrink:0; font-weight:500;}
.cpf-riskbars-c .cpf-rblabel{font-size:10.5px; width:84px;}
.cpf-rbseg{display:flex; gap:2px; flex-shrink:0;}
.cpf-seg{width:15px; height:8px; border-radius:2px; transition:background .2s;}
.cpf-seg-on{box-shadow:inset 0 0 0 1px rgba(0,0,0,.07);}
.cpf-riskbars-c .cpf-seg{width:12px; height:6px;}
.cpf-rbval{font-family:var(--mono); font-size:10.5px; font-weight:500; letter-spacing:.01em;}

/* ---- Generic bar / dots ---- */
.cpf-barrow{display:flex; align-items:center; gap:12px; padding:5px 0;}
.cpf-barlabel{width:150px; flex-shrink:0; font-size:13px;}
.cpf-bartrack{flex:1; height:16px; background:var(--seg-empty); border-radius:8px; overflow:hidden;}
.cpf-barfill{height:100%; border-radius:8px; transition:width .35s cubic-bezier(.4,0,.2,1);}
.cpf-barval{width:88px; flex-shrink:0; text-align:right;}
.cpf-recwrap{display:flex; flex-direction:column; gap:4px;}
.cpf-recrow{display:flex; align-items:center; gap:8px;}
.cpf-reclabel{font-family:var(--mono); font-size:10px; color:var(--muted); width:58px; flex-shrink:0;}
.cpf-dots{display:flex; gap:3px;}
.cpf-dot{width:9px; height:9px; border-radius:50%; border:1.4px solid; box-sizing:border-box;}

/* ---- Converters ---- */
.cpf-subtabs{display:flex; gap:6px; margin-bottom:20px; flex-wrap:wrap; border-bottom:1px solid var(--line); padding-bottom:0;}
.cpf-subtab{border:none; background:none; color:var(--muted); font-size:13.5px; font-weight:600; padding:9px 4px; margin-right:14px; border-bottom:2px solid transparent; transition:.14s;}
.cpf-subtab:hover{color:var(--ink);}
.cpf-subtab-on{color:var(--accent-ink); border-bottom-color:var(--accent);}
.cpf-conv{display:grid; grid-template-columns:minmax(0,1fr); gap:18px;}
.cpf-convcard{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:20px; box-shadow:var(--sh-sm);}
.cpf-fieldrow{display:flex; gap:14px; flex-wrap:wrap; margin-bottom:18px;}
.cpf-field{display:flex; flex-direction:column; gap:6px; font-size:12px; font-weight:600; color:var(--ink-soft); flex:1; min-width:150px;}
.cpf-field-sm{max-width:150px; flex:0 1 150px;}
.cpf-readout{background:linear-gradient(180deg,#f6fafa,#eef4f4); border:1px solid var(--line); border-left:3px solid var(--accent); border-radius:var(--radius-sm); padding:18px 20px; display:flex; flex-direction:column; gap:2px;}
.cpf-readnum{font-family:var(--mono); font-size:44px; font-weight:600; color:var(--accent-ink); line-height:1; letter-spacing:-.02em;}
.cpf-readunit{font-family:var(--mono); font-size:13px; color:var(--ink-soft); font-weight:500; margin-top:4px;}
.cpf-readnote{font-size:11.5px; color:var(--muted); margin-top:8px;}
.cpf-warn2{background:#fbf3e6; border:1px solid #efdcb8; border-left:3px solid #c9932f; border-radius:var(--radius-sm); padding:12px 15px; font-size:12.5px; color:#7d6221; line-height:1.55;}
.cpf-ladder,.cpf-reftable,.cpf-rankwrap{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:18px 20px; box-shadow:var(--sh-sm);}
.cpf-laddertitle,.cpf-reftitle{font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--accent-ink); margin-bottom:14px;}
.cpf-barname{font-size:13.5px; color:var(--ink-soft);}
.cpf-barname-on{font-weight:700; color:var(--ink);}
.cpf-barfonte{font-family:var(--mono); font-size:9.5px; color:var(--muted); margin-left:6px; background:var(--surface-2); padding:1px 5px; border-radius:4px;}
.cpf-mini{width:100%; border-collapse:collapse; font-size:12.5px;}
.cpf-mini th{text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--muted); padding:6px 10px; border-bottom:1px solid var(--line); font-weight:600;}
.cpf-mini td{padding:8px 10px; border-bottom:1px solid var(--line-soft); color:var(--ink-soft);}
.cpf-mini tr{cursor:pointer; transition:.12s;}
.cpf-mini tbody tr:hover{background:var(--surface-2);}
.cpf-mini-on{background:var(--accent-soft) !important;}
.cpf-reffoot{font-size:11.5px; color:var(--muted); margin-top:12px; line-height:1.5;}

/* ---- Rankings ---- */
.cpf-riskhead{display:flex; flex-direction:column; gap:12px; margin-bottom:18px;}
.cpf-chips-dim .cpf-chip-dim-on{background:var(--accent-ink); border-color:var(--accent-ink);}
.cpf-ranktitle{font-size:14px; font-weight:700; color:var(--ink); margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;}
.cpf-scalelegend{display:flex; gap:12px; flex-wrap:wrap;}
.cpf-scaledot{font-size:11px; color:var(--muted); display:flex; align-items:center; gap:5px; font-weight:500;}
.cpf-sd{width:10px; height:10px; border-radius:3px;}
.cpf-rankrow{display:flex; align-items:center; gap:11px; padding:7px 0; cursor:pointer; border-radius:6px; transition:.12s;}
.cpf-rankrow:hover{background:var(--surface-2);}
.cpf-ranktag{font-size:10.5px; font-weight:600; padding:2px 8px; border-radius:999px; width:56px; text-align:center; flex-shrink:0;}
.cpf-rankname{width:132px; flex-shrink:0; font-size:13.5px; color:var(--ink);}
.cpf-ranktrack{flex:1; height:14px; background:var(--seg-empty); border-radius:7px; overflow:hidden; min-width:60px;}
.cpf-rankfill{height:100%; border-radius:7px; transition:width .35s cubic-bezier(.4,0,.2,1);}
.cpf-ranklev{width:92px; flex-shrink:0; text-align:right; font-family:var(--mono); font-size:11px; font-weight:500;}
.cpf-methodnote{font-size:12px; color:var(--muted); line-height:1.6; margin-top:16px; padding:12px 15px; background:var(--surface-2); border:1px solid var(--line-soft); border-radius:var(--radius-sm);}
.cpf-indintro{margin-bottom:14px;}
.cpf-indlead{font-size:13px; color:var(--ink-soft); line-height:1.6; margin:8px 0 0; max-width:920px;}
.cpf-indtools{display:flex; flex-wrap:wrap; gap:12px; align-items:center; margin-bottom:20px;}
.cpf-indsearch{max-width:280px;}
.cpf-indgroup{margin-bottom:26px;}
.cpf-indclass{font-family:var(--font-sans); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; padding-bottom:6px; margin-bottom:10px; border-bottom:2px solid;}
.cpf-indrow{display:grid; grid-template-columns:180px 1fr; gap:16px; padding:12px 2px; border-bottom:1px solid var(--line-soft); align-items:start; content-visibility:auto; contain-intrinsic-size:auto 88px;}
.cpf-indname{font-family:var(--font-serif); font-size:15px; font-weight:600; text-align:left; background:none; border:none; padding:0; cursor:pointer; line-height:1.35;}
.cpf-indname:hover{text-decoration:underline;}
.cpf-indcols{display:grid; grid-template-columns:1fr 1fr; gap:18px;}
.cpf-indcol{min-width:0;}
.cpf-indlab{display:inline-block; font-family:var(--font-mono); font-size:10px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; padding:2px 8px; border-radius:999px; margin-bottom:6px;}
.cpf-indlab-on{background:#e4f1ea; color:#256b4a;}
.cpf-indlab-off{background:#f3ecd9; color:#8a6a1c;}
.cpf-indlist{margin:0; padding-left:16px; font-size:12.5px; color:var(--ink-soft); line-height:1.55;}
.cpf-indlist li{margin-bottom:2px;}
.cpf-indnote{margin-top:22px;}
.cpf-mfind{display:flex; gap:8px; align-items:baseline; margin-bottom:6px; flex-wrap:wrap;}
.cpf-mfindtxt{font-size:12.5px; color:var(--ink-soft); line-height:1.5;}
.cpf-card-sel{border-width:1.5px;}
.cpf-cardgtt{display:inline-flex; align-items:center; gap:6px; align-self:flex-start; font-family:var(--font-mono); font-size:11.5px; font-weight:600; color:var(--accent-ink); background:var(--accent-soft); border-radius:999px; padding:3px 10px 3px 4px; margin:2px 0 4px;}
.cpf-cardgtticon{font-family:var(--font-sans); font-size:9px; font-weight:700; letter-spacing:.03em; text-transform:uppercase; background:var(--accent); color:#fff; border-radius:999px; padding:2px 6px;}
.cpf-prnwarn{font-size:12.5px; color:#8a3d1c; background:#f8ece4; border:1px solid #e7c9b6; border-left:3px solid #B25B3A; border-radius:var(--radius-sm); padding:11px 14px; line-height:1.55; margin-bottom:22px;}
.cpf-prngroup{margin-bottom:24px;}
.cpf-prnclass{font-family:var(--font-sans); font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; padding-bottom:6px; margin-bottom:12px; border-bottom:2px solid;}
.cpf-prncards{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:12px;}
.cpf-prncard{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:14px 15px; box-shadow:var(--sh-sm); display:flex; flex-direction:column; gap:10px; content-visibility:auto; contain-intrinsic-size:auto 210px;}
.cpf-prnname{font-family:var(--font-serif); font-size:15px; font-weight:600; text-align:left; background:none; border:none; padding:0; cursor:pointer;}
.cpf-prnname:hover{text-decoration:underline;}
.cpf-prnfields{display:grid; grid-template-columns:1fr 1fr; gap:8px 14px;}
.cpf-prnf{display:flex; flex-direction:column; gap:2px; min-width:0;}
.cpf-prnf-hi{grid-column:1/-1; background:var(--surface-2); border-radius:var(--radius-sm); padding:6px 9px; margin:2px 0;}
.cpf-prnlab{font-family:var(--font-sans); font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted);}
.cpf-prnf .cpf-mono{font-size:12.5px; color:var(--ink);}
.cpf-prnf-hi .cpf-mono{font-size:13.5px; font-weight:600; color:var(--accent-ink);}
.cpf-prnnote{font-size:12px; color:var(--ink-soft); line-height:1.5; border-top:1px solid var(--line-soft); padding-top:9px;}
.cpf-cypedu{background:var(--surface-2); border:1px solid var(--line-soft); border-radius:var(--radius); padding:18px 20px; margin-bottom:22px;}
.cpf-cyplead{font-size:13px; color:var(--ink-soft); line-height:1.6; margin:8px 0 16px; max-width:940px;}
.cpf-cypcols{display:grid; grid-template-columns:1fr 1fr; gap:16px;}
.cpf-cypecol{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius-sm); padding:13px 15px;}
.cpf-cypecol-inh{border-top:3px solid #C0472E;}
.cpf-cypecol-ind{border-top:3px solid #A9761B;}
.cpf-cypcoltit{font-family:var(--font-sans); font-size:11.5px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; margin-bottom:9px; color:var(--ink);}
.cpf-cyplist{margin:0; padding-left:16px; font-size:12.5px; color:var(--ink-soft); line-height:1.6;}
.cpf-cyplist li{margin-bottom:6px;}
.cpf-cypenote{font-size:12px; color:var(--muted); line-height:1.6; margin-top:14px; padding-top:12px; border-top:1px solid var(--line);}
.cpf-titsearch{max-width:420px; margin-bottom:20px;}
.cpf-sic{background:var(--surface); border:1px solid var(--line); border-left-width:4px; border-radius:var(--radius); padding:16px 18px; margin-bottom:14px; box-shadow:var(--sh-sm); content-visibility:auto; contain-intrinsic-size:auto 420px;}
.cpf-sicred{display:flex; flex-direction:column; gap:7px; margin-bottom:12px;}
.cpf-sicrow{display:flex; gap:9px; align-items:flex-start; padding:8px 11px; border-radius:var(--radius-sm); background:var(--surface-2);}
.cpf-sicrow-salvavita{background:#fbeee9; border-left:3px solid #C0472E;}
.cpf-sicrow-grave{background:#f8f1e2; border-left:3px solid #A9761B;}
.cpf-sicrow-nota{background:var(--surface-2); border-left:3px solid var(--line);}
.cpf-sicbadge{flex-shrink:0; font-family:var(--font-mono); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; padding:3px 8px; border-radius:999px; margin-top:1px;}
.cpf-sicbadge-salvavita{background:#C0472E; color:#fff;}
.cpf-sicbadge-grave{background:#e6d0a4; color:#7a5511;}
.cpf-sicbadge-nota{background:var(--line); color:var(--ink-soft);}
.cpf-sictxt{font-size:12.5px; color:var(--ink-soft); line-height:1.55;}
.cpf-sicpop{display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:8px 12px; margin-bottom:11px;}
.cpf-sicpopcell{background:var(--surface-2); border-radius:var(--radius-sm); padding:8px 11px; min-width:0;}
.cpf-sicpoptxt{display:block; font-size:11.5px; color:var(--ink-soft); line-height:1.5; margin-top:3px;}
.cpf-sicod{font-size:12.5px; color:var(--ink-soft); line-height:1.6; padding:10px 12px; background:var(--accent-soft); border-radius:var(--radius-sm);}
.cpf-sicodlab{display:inline-block; font-family:var(--font-sans); font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--accent-ink); margin-right:8px; vertical-align:1px;}
.cpf-siccount{font-family:var(--font-mono); font-size:12px; color:var(--muted);}
.cpf-mfpop{display:flex; flex-direction:column; gap:4px; font-size:12.5px; line-height:1.5;}
.cpf-sost{background:var(--surface); border:1px solid var(--line); border-left-width:4px; border-radius:var(--radius); padding:16px 18px; margin-bottom:14px; box-shadow:var(--sh-sm); content-visibility:auto; contain-intrinsic-size:auto 320px;}
.cpf-sosthead{display:flex; align-items:baseline; gap:10px; margin-bottom:8px; flex-wrap:wrap;}
.cpf-sostname{font-family:var(--font-serif); font-size:17px; font-weight:600; color:var(--ink);}
.cpf-sosttag{font-family:var(--font-sans); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; padding:2px 9px; border-radius:999px;}
.cpf-sostmecc{font-size:12.5px; color:var(--ink-soft); line-height:1.55; margin-bottom:12px;}
.cpf-sostgrid{display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:10px; margin-bottom:11px;}
.cpf-sostblock{background:var(--surface-2); border-radius:var(--radius-sm); padding:9px 12px; border-top:2px solid transparent;}
.cpf-sostblock-intox{border-top-color:#B2543A;}
.cpf-sostblock-od{border-top-color:#C0472E;}
.cpf-sostblock-ast{border-top-color:#A9761B;}
.cpf-sostlab{display:block; font-family:var(--font-sans); font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); margin-bottom:4px;}
.cpf-sosttxt{font-size:12px; color:var(--ink-soft); line-height:1.5;}
.cpf-sostgest{font-size:12.5px; color:var(--ink-soft); line-height:1.6; padding:11px 13px; background:var(--accent-soft); border-radius:var(--radius-sm);}
.cpf-sostgestlab{display:inline-block; font-family:var(--font-sans); font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--accent-ink); margin-right:8px; vertical-align:1px;}
.cpf-sostnote{font-size:11.5px; color:var(--muted); line-height:1.55; margin-top:9px; padding-top:9px; border-top:1px solid var(--line-soft);}
.cpf-tit{background:var(--surface); border:1px solid var(--line); border-left-width:4px; border-radius:var(--radius); padding:16px 18px; margin-bottom:14px; box-shadow:var(--sh-sm); content-visibility:auto; contain-intrinsic-size:auto 380px;}
.cpf-tithead{display:flex; align-items:baseline; gap:10px; margin-bottom:12px; flex-wrap:wrap;}
.cpf-titname{font-family:var(--font-serif); font-size:17px; font-weight:600; text-align:left; background:none; border:none; padding:0; cursor:pointer;}
.cpf-titname:hover{text-decoration:underline;}
.cpf-tittag{font-family:var(--font-sans); font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.04em; padding:2px 8px; border-radius:999px;}
.cpf-titschema{border-top:1px solid var(--line-soft); padding-top:11px; margin-bottom:12px;}
.cpf-titind{font-family:var(--font-sans); font-size:12.5px; font-weight:700; color:var(--ink); margin-bottom:8px;}
.cpf-titgrid{display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:8px 12px; margin-bottom:9px;}
.cpf-titcell{display:flex; flex-direction:column; gap:2px; background:var(--surface-2); border-radius:var(--radius-sm); padding:7px 10px; min-width:0;}
.cpf-titlab{font-family:var(--font-sans); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted);}
.cpf-titcell .cpf-mono{font-size:12px; color:var(--ink); line-height:1.4;}
.cpf-tittarget{font-weight:600; color:var(--accent-ink);}
.cpf-titratio{font-size:12.5px; color:var(--ink-soft); line-height:1.6; padding:9px 12px; background:var(--accent-soft); border-radius:var(--radius-sm);}
.cpf-titfoot{border-top:1px solid var(--line-soft); padding-top:10px; display:flex; flex-direction:column; gap:6px;}
.cpf-titfootrow{font-size:12px; color:var(--ink-soft); line-height:1.55;}
.cpf-titfootlab{display:inline-block; font-family:var(--font-sans); font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--muted); margin-right:8px;}
.cpf-mftit{margin-bottom:8px;}
.cpf-mftitind{display:block; font-family:var(--font-sans); font-size:11px; font-weight:700; color:var(--ink); margin-bottom:2px;}
.cpf-emg{background:var(--surface); border:1px solid var(--line); border-left-width:4px; border-radius:var(--radius); padding:16px 18px; margin-bottom:14px; box-shadow:var(--sh-sm); content-visibility:auto; contain-intrinsic-size:auto 240px;}
.cpf-emg-critica{border-left-color:#C0472E;}
.cpf-emg-alta{border-left-color:#B25B3A;}
.cpf-emg-media{border-left-color:#0E7C86;}
.cpf-emghead{display:flex; justify-content:space-between; align-items:baseline; gap:12px; flex-wrap:wrap; margin-bottom:12px;}
.cpf-emgtitle{font-family:var(--font-serif); font-size:17px; font-weight:600; color:var(--ink); line-height:1.3;}
.cpf-emgtags{display:inline-flex; gap:8px; align-items:center; flex-shrink:0;}
.cpf-emgarea{font-family:var(--font-sans); font-size:10.5px; font-weight:600; color:var(--muted); text-transform:uppercase; letter-spacing:.04em;}
.cpf-emggrav{font-family:var(--font-mono); font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; padding:3px 9px; border-radius:999px;}
.cpf-emggrav-critica{background:#f6e0db; color:#a5391f;}
.cpf-emggrav-alta{background:#f6e9e2; color:#8a4a2a;}
.cpf-emggrav-media{background:#e0eff0; color:#0b5560;}
.cpf-emgdrugs{display:flex; flex-direction:column; gap:8px; margin-bottom:12px;}
.cpf-emgdrug{display:grid; grid-template-columns:minmax(150px,1fr) minmax(180px,1.4fr) minmax(150px,1.1fr); gap:6px 14px; align-items:baseline; padding:9px 11px; background:var(--surface-2); border-radius:var(--radius-sm);}
.cpf-emgname{font-family:var(--font-serif); font-size:13.5px; font-weight:600; color:var(--ink);}
.cpf-emgname-link{text-align:left; background:none; border:none; padding:0; cursor:pointer; color:var(--accent-ink);}
.cpf-emgname-link:hover{text-decoration:underline;}
.cpf-emgdoseval{font-size:13px; color:var(--ink); font-weight:600;}
.cpf-emgmeta{display:flex; flex-direction:column; gap:3px;}
.cpf-emgrepeat{font-size:11.5px; color:var(--accent-ink);}
.cpf-emgmax{font-size:11px; color:var(--muted);}
.cpf-emgratio{font-size:12.5px; color:var(--ink-soft); line-height:1.6; padding:10px 12px; background:var(--accent-soft); border-radius:var(--radius-sm);}
.cpf-emgratiolab{display:inline-block; font-family:var(--font-sans); font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; color:var(--accent-ink); margin-right:8px; vertical-align:1px;}
.cpf-emgallerta{font-size:12px; color:#8a3d1c; background:#f8ece4; border-radius:var(--radius-sm); padding:8px 11px; margin-top:8px; line-height:1.5;}
@media (max-width:640px){
  .cpf-cypcols{grid-template-columns:1fr;}
  .cpf-prnfields{grid-template-columns:1fr;}
  .cpf-emgdrug{grid-template-columns:1fr; gap:4px;}
}
.cpf-modalvizbox{min-width:200px; flex:1;}
@media (max-width:640px){
  .cpf-indrow{grid-template-columns:1fr; gap:8px;}
  .cpf-indcols{grid-template-columns:1fr; gap:10px;}
}

/* ---- CYP ---- */
.cpf-blocktitle{font-family:var(--serif); font-size:19px; font-weight:600; color:var(--ink); margin-bottom:14px;}
.cpf-blocktitle-sp{margin-top:30px;}
.cpf-alerts{display:flex; flex-direction:column; gap:10px;}
.cpf-alert{background:var(--surface); border:1px solid var(--line); border-left:3px solid var(--muted); border-radius:var(--radius-sm); padding:13px 16px; box-shadow:var(--sh-sm);}
.cpf-alert-grave{border-left-color:#c0472e; background:#fdf4f2;}
.cpf-alert-controindicato{border-left-color:#8f2d1a; background:#fbf0ed;}
.cpf-alert-attenzione{border-left-color:#c9932f; background:#fbf6ec;}
.cpf-alerthead{display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:5px; flex-wrap:wrap;}
.cpf-alertpair{font-weight:700; font-size:14px; color:var(--ink);}
.cpf-alertx{color:var(--muted); font-weight:400; margin:0 3px;}
.cpf-alertbadge{font-family:var(--mono); font-size:10px; text-transform:uppercase; letter-spacing:.05em; padding:2px 8px; border-radius:999px; background:rgba(0,0,0,.05); color:var(--ink-soft); font-weight:500;}
.cpf-alert-grave .cpf-alertbadge{background:#f3d9d2; color:#a13a24;}
.cpf-alert-controindicato .cpf-alertbadge{background:#ecccc4; color:#7d2815;}
.cpf-alert-attenzione .cpf-alertbadge{background:#efe0c0; color:#8a6420;}
.cpf-alerteff{font-size:12.5px; color:var(--ink-soft); line-height:1.55;}
.cpf-cypgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:14px;}
.cpf-cypcard{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:16px 18px; box-shadow:var(--sh-sm);}
.cpf-cyphead{font-family:var(--mono); font-size:16px; font-weight:600; color:var(--accent-ink); letter-spacing:.02em;}
.cpf-cypnote{font-size:11.5px; color:var(--muted); line-height:1.5; margin:6px 0 12px; padding-bottom:12px; border-bottom:1px solid var(--line-soft);}
.cpf-cypcol{margin-bottom:10px;}
.cpf-cyplab{font-size:10.5px; font-weight:700; text-transform:uppercase; letter-spacing:.05em; display:block; margin-bottom:6px;}
.cpf-cyplab-sub{color:var(--ink-soft);} .cpf-cyplab-inh{color:#a13a24;} .cpf-cyplab-ind{color:#0e5c6b;}
.cpf-cypchips{display:flex; flex-wrap:wrap; gap:5px;}
.cpf-cchip{font-size:11.5px; font-weight:500; padding:3px 9px; border-radius:999px; border:1px solid; transition:.12s; display:inline-flex; align-items:center; gap:5px;}
.cpf-cchip-sub{background:var(--surface-2); border-color:var(--line); color:var(--ink-soft);}
.cpf-cchip-inh{background:#fbf0ed; border-color:#ecccc4; color:#8f2d1a;}
.cpf-cchip-ind{background:#e6f1f2; border-color:#c4dee1; color:#0a4451;}
button.cpf-cchip:hover{filter:brightness(.96); transform:translateY(-1px);}
.cpf-cforce{font-family:var(--mono); font-size:9.5px; opacity:.8;}

/* ---- Monitoring ---- */
.cpf-monitgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:14px;}
.cpf-monitcard{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:16px 18px; box-shadow:var(--sh-sm); cursor:pointer; transition:transform .16s,box-shadow .16s; content-visibility:auto; contain-intrinsic-size:auto 130px;}
.cpf-monitcard:hover{transform:translateY(-2px); box-shadow:var(--sh);}
.cpf-monithead{display:flex; align-items:center; gap:9px; margin-bottom:9px;}
.cpf-monitname{font-family:var(--serif); font-size:17px; font-weight:600; color:var(--ink);}
.cpf-monittext{font-size:12.5px; color:var(--ink-soft); line-height:1.6;}

/* ---- Glossary / fonti ---- */
.cpf-fonti{background:var(--surface); border:1px solid var(--line); border-radius:var(--radius); padding:20px 22px; box-shadow:var(--sh-sm);}
.cpf-fontilist{margin:0; padding-left:20px; font-size:13px; color:var(--ink-soft); line-height:1.7;}
.cpf-fontilist li{margin-bottom:8px;}
.cpf-fontilist em{font-style:italic;}
.cpf-fontifoot{margin-top:14px; padding-top:14px; border-top:1px solid var(--line-soft); font-size:12px; color:var(--muted); font-weight:600;}
.cpf-glossgrid{display:grid; grid-template-columns:repeat(auto-fill,minmax(340px,1fr)); gap:2px; background:var(--line-soft); border:1px solid var(--line); border-radius:var(--radius); overflow:hidden;}
.cpf-glossrow{display:flex; gap:12px; background:var(--surface); padding:11px 16px;}
.cpf-glosss{font-family:var(--mono); font-size:12px; font-weight:600; color:var(--accent-ink); min-width:104px; flex-shrink:0;}
.cpf-glossd{font-size:12.5px; color:var(--ink-soft); line-height:1.5;}

/* ---- Modal ---- */
.cpf-modal{position:fixed; inset:0; z-index:50; background:rgba(15,32,38,.5); backdrop-filter:blur(3px); display:flex; align-items:flex-start; justify-content:center; padding:clamp(12px,4vw,44px); overflow-y:auto; animation:cpf-fade .2s ease;}
.cpf-modalcard{position:relative; background:var(--surface); border-radius:16px; box-shadow:var(--sh-lg); max-width:920px; width:100%; overflow:hidden; animation:cpf-pop .24s cubic-bezier(.34,1.2,.5,1);}
@keyframes cpf-pop{from{opacity:0; transform:scale(.97) translateY(8px);} to{opacity:1; transform:none;}}
.cpf-modalclose{position:absolute; top:14px; right:16px; z-index:2; width:32px; height:32px; border:1px solid var(--line); background:var(--surface); color:var(--ink-soft); border-radius:8px; font-size:19px; line-height:1; transition:.14s;}
.cpf-modalclose:hover{background:#f3dede; color:#b3462f; border-color:#e6c3bb;}
.cpf-modalhead{padding:24px 28px 20px; border-top:4px solid var(--accent); border-bottom:1px solid var(--line-soft); background:var(--surface-2);}
.cpf-modalname{font-family:var(--serif); font-size:28px; font-weight:700; color:var(--ink); margin:10px 0 0; letter-spacing:-.01em;}
.cpf-modalbody{display:grid; grid-template-columns:236px minmax(0,1fr); gap:0;}
.cpf-modalviz{padding:22px; border-right:1px solid var(--line-soft); background:#fbfdfd; display:flex; flex-direction:column; gap:20px;}
.cpf-vizlabel{font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--accent-ink); margin-bottom:10px;}
.cpf-modalfields{padding:22px 26px; display:flex; flex-direction:column;}
.cpf-mfield{padding:11px 0; border-bottom:1px solid var(--line-soft); display:flex; flex-direction:column; gap:4px;}
.cpf-mfield:last-child{border-bottom:none;}
.cpf-mfhi{background:var(--accent-soft); margin:6px -12px; padding:12px; border-radius:var(--radius-sm); border-bottom:none;}
.cpf-mflabel{font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em; color:var(--muted);}
.cpf-mfval{font-size:13px; color:var(--ink-soft); line-height:1.6;}
.cpf-mfval.cpf-mono{font-family:var(--mono); font-size:11.5px; color:var(--ink);}
.cpf-mfcyp{display:flex; flex-wrap:wrap; gap:6px;}
.cpf-mfnote{font-size:12px; color:var(--muted); margin-top:7px; line-height:1.55; font-style:italic;}
.cpf-modalfoot{padding:14px 26px; background:var(--surface-2); border-top:1px solid var(--line-soft); font-size:11.5px; color:var(--muted);}

/* ---- Responsive ---- */
@media (max-width:720px){
  .cpf-headtop{flex-direction:column;}
  .cpf-infobtn{align-self:flex-start;}
  .cpf-toolrow{flex-direction:column; align-items:stretch; gap:12px;}
  .cpf-grid{grid-template-columns:1fr;}
  .cpf-conv{grid-template-columns:1fr;}
  .cpf-fieldrow{flex-direction:column;}
  .cpf-field-sm{max-width:none; flex:1;}
  .cpf-readnum{font-size:38px;}
  .cpf-barlabel{width:118px; font-size:12px;}
  .cpf-barval{width:74px; font-size:12px;}
  .cpf-rankname{width:100px; font-size:12.5px;}
  .cpf-ranklev{width:74px;}
  .cpf-cypgrid,.cpf-monitgrid,.cpf-glossgrid{grid-template-columns:1fr;}
  .cpf-modalbody{grid-template-columns:1fr;}
  .cpf-modalviz{border-right:none; border-bottom:1px solid var(--line-soft); flex-direction:row; flex-wrap:wrap;}
  .cpf-modalvizbox{flex:1; min-width:160px;}
  .cpf-radarwrap{flex-direction:column;}
}
@media (prefers-reduced-motion:reduce){
  .cpf-root *,.cpf-panel,.cpf-modal,.cpf-modalcard{animation:none !important; transition:none !important;}
}
`;
