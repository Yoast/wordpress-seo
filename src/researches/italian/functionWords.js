import transitionWordsFactory from "./transitionWords.js";
let transitionWords = transitionWordsFactory().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher.
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "il", "i", "la", "le", "lo", "gli", "un", "uno", "una" ];

let cardinalNumerals = [ "due", "tre", "quattro", "cinque", "sette", "otto", "nove", "dieci", "undici", "dodici",
	"tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove", "venti", "cento", "mille", "mila",
	"duemila", "tremila", "quattromila", "cinquemila", "seimila", "settemila", "ottomila", "novemila",
	"diecimila", "milione", "milioni", "miliardo", "miliardi" ];

let ordinalNumerals = [ "prima", "primi", "prime", "secondo", "seconda", "secondi", "seconde", "terzo", "terza",
	"terzi", "terze", "quarto", "quarta", "quarti", "quarte", "quinto", "quinta", "quinti", "quinte", "sesto", "sesta",
	"sesti", "seste", "settimo", "settima", "settimi", "settime", "ottavo", "ottava", "ottavi", "ottave", "nono", "nona",
	"noni", "none", "decimo", "decima", "decimi", "decime", "undicesimo", "undicesima", "undicesimi", "undicesime",
	"dodicesimo", "dodicesima", "dodicesimi", "dodicesime", "tredicesimo", "tredicesima", "tredicesimi", "tredicesime",
	"quattordicesimo", "quattordicesima", "quattordicesimi", "quattordicesime", "quindicesimo", "quindicesima",
	"quindicesimi", "quindicesime", "sedicesimo", "sedicesima", "sedicesimi", "sedicesime", "diciassettesimo",
	"diciassettesima", "diciassettesimi", "diciassettesime", "diciannovesimo", "diciannovesima", "diciannovesimi",
	"diciannovesime", "ventesimo", "ventesima", "ventesimi", "ventesime" ];

let personalPronounsNominative = [ "io", "tu", "egli", "esso", "lui", "ella", "essa", "lei", "noi", "voi",
	"essi", "esse", "loro" ];

// 'La' and 'le' are already included in the list of articles.
let personalPronounsAccusative = [ "mi", "ti", "si", "ci", "vi", "li", "me", "te", "se",
	"glie", "glielo", "gliela", "glieli", "gliele", "gliene", "ce", "ve" ];

let personalPronounsPrepositional = [ "sé" ];

let demonstrativePronouns = [ "ciò", "codesto", "codesta", "codesti", "codeste", "colei", "colui", "coloro",
	"costei", "costui", "costoro", "medesimo", "medesima", "medesimi", "medesime", "questo", "questa",
	"questi", "queste", "quello", "quella", "quelli", "quelle", "quel", "quei", "quegli" ];

let possessivePronouns = [ "mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue", "suo", "sua", "suoi", "sue",
	"nostro", "nostra", "nostri", "nostre", "vostro", "vostra", "vostri", "vostre" ];

// Already in the list of transition words: appena.
let quantifiers = [ "affatto", "alcun", "alcuna", "alcune", "alcuni", "alcuno", "bastantemente",
	"grandemente", "massimamente", "meno", "minimamente", "molta", "molte", "molti", "moltissimo",
	"molto", "nessun", "nessuna", "nessuno", "niente", "nulla", "ogni", "più", "po'", "poca", "poche", "pochi", "poco",
	"pochissime", "pochissimi", "qualche", "qualsiasi", "qualunque", "quintali", "rara", "rarissima", "rarissimo", "raro",
	"spesso", "spessissimo", "sufficientemente", "taluno", "taluna", "taluni", "talune", "tanta", "tante", "tanti",
	"tantissime", "tantissimi", "tanto", "tonnellate", "troppa", "troppe", "troppi", "troppo", "tutta", "tutte", "tutti",
	"tutto" ];

// Already in the quantifier list: alcuno, molto, nessuno, poco, taluno tanto, troppo, tutto, nulla, niente.
let indefinitePronouns = [ "alcunché", "alcunchè", "altro", "altra", "altri", "altre", "certa", "certi", "certe",
	"checché", "checchè", "chicchessia", "chiunque", "ciascuno", "ciascuna", "ciascun", "diverso", "diversa", "diversi",
	"diverse", "parecchio", "parecchia", "parecchi", "parecchie", "qualcosa", "qualcuno", "qualcuna", "vario", "varia",
	"vari", "varie" ];

let interrogativeDeterminers = [ "che", "cosa", "cui", "qual", "quale", "quali" ];

let interrogativePronouns = [ "chi", "quanta", "quante", "quanti", "quanto" ];

let interrogativeAdverbs = [ "com'è", "com'era", "com'erano", "donde", "d'onde", "dove", "dov'è", "dov'era", "dov'erano",
	"dovunque" ];

// 'Ci' and 'vi' are already part of the list of personal pronouns.
let pronominalAdverbs = [ "ne" ];

// 'Via' not included because of primary meaning 'street'.
let locativeAdverbs = [ "accanto", "altrove", "attorno", "dappertutto", "giù", "là", "laggiù", "lassù", "lì",  "ovunque",
	"qua", "quaggiù", "quassù", "qui" ];

// 'Essere' is already part of the otherAuxiliaries list.
let filteredPassiveAuxiliaries = [ "vengano", "vengo", "vengono", "veniamo", "veniate", "venimmo", "venisse", "venissero",
	"venissi", "venissimo", "veniste", "venisti", "venite", "veniva", "venivamo", "venivano", "venivate", "venivi",
	"venivo", "venne", "vennero", "venni", "verrà", "verrai", "verranno", "verrebbe", "verrebbero", "verrei", "verremmo",
	"verremo", "verreste", "verresti", "verrete", "verrò", "viene", "vieni" ];

let passiveAuxiliariesInfinitive = [ "venire", "venir" ];

let otherAuxiliaries = [ "abbi", "abbia", "abbiamo", "abbiano", "abbiate", "abbiente", "avemmo", "avendo", "avente",
	"avesse", "avessero", "avessi", "avessimo", "aveste", "avesti", "avete", "aveva", "avevamo", "avevano", "avevate",
	"avevi", "avevo", "avrà", "avrai", "avranno", "avrebbe", "avrebbero", "avrei", "avremmo", "avremo", "avreste",
	"avresti", "avrete", "avrò", "avuto", "ebbe", "ebbero", "ebbi", "ha", "hai", "hanno", "ho", "l'abbi", "l'abbia",
	"l'abbiamo", "l'abbiano", "l'abbiate", "l'abbiente", "l'avemmo", "l'avendo", "l'avente", "l'avesse", "l'avessero",
	"l'avessi", "l'avessimo", "l'aveste", "l'avesti", "l'avete", "l'aveva", "l'avevamo", "l'avevano", "l'avevate",
	"l'avevi", "l'avevo", "l'avrà", "l'avrai", "l'avranno", "l'avrebbe", "l'avrebbero", "l'avrei", "l'avremmo", "l'avremo",
	"l'avreste", "l'avresti", "l'avrete", "l'avrò", "l'avuto", "l'ebbe", "l'ebbero", "l'ebbi", "l'ha", "l'hai", "l'hanno",
	"l'ho", "possa", "possano", "possiamo", "possiate", "posso", "possono", "poté", "potei", "potemmo", "potendo", "potente",
	"poterono", "potesse", "potessero", "potessi", "potessimo", "poteste", "potesti", "potete", "potette", "potettero",
	"potetti", "poteva", "potevamo", "potevano", "potevate", "potevi", "potevo", "potrà", "potrai", "potranno", "potrebbe",
	"potrebbero", "potrei", "potremmo", "potremo", "potreste", "potresti", "potrete", "potrò", "potuto", "può", "puoi",
	"voglia", "vogliamo", "vogliano", "vogliate", "voglio", "vogliono", "volemmo", "volendo", "volente", "volesse",
	"volessero", "volessi", "volessimo", "voleste", "volesti", "volete", "voleva", "volevamo", "volevano", "volevate",
	"volevi", "volevo", "volle", "vollero", "volli", "voluto", "vorrà", "vorrai", "vorranno", "vorrebbe", "vorrebbero",
	"vorrei", "vorremmo", "vorremo", "vorreste", "vorresti", "vorrete", "vorrò", "vuoi", "vuole", "debba", "debbano",
	"debbono", "deva", "deve", "devi", "devo", "devono", "dobbiamo", "dobbiate", "dové", "dovei", "dovemmo", "dovendo",
	"doverono", "dovesse", "dovessero", "dovessi", "dovessimo", "doveste", "dovesti", "dovete", "dovette", "dovettero",
	"dovetti", "doveva", "dovevamo", "dovevano", "dovevate", "dovevi", "dovevo", "dovrà", "dovrai", "dovranno", "dovrebbe",
	"dovrebbero", "dovrei", "dovremmo", "dovremo", "dovreste", "dovresti", "dovrete", "dovrò", "dovuto", "sa", "sai", "sanno",
	"sapemmo", "sapendo", "sapesse", "sapessero", "sapessi", "sapessimo", "sapeste", "sapesti", "sapete", "sapeva",
	"sapevamo", "sapevano", "sapevate", "sapevi", "sapevo", "sappi", "sappia", "sappiamo", "sappiano", "sappiate", "saprà",
	"saprai", "sapranno", "saprebbe", "saprebbero", "saprei", "sapremmo", "sapremo", "sapreste", "sapresti", "saprete",
	"saprò", "saputo", "seppe", "seppero", "seppi", "so", "soglia", "sogliamo", "sogliano", "sogliate", "soglio",
	"sogliono", "solesse", "solessero", "solessi", "solessimo", "soleste", "solete", "soleva", "solevamo", "solevano",
	"solevate", "solevi", "solevo", "suoli", "sta", "stai", "stando", "stanno", "stante", "starà", "starai", "staranno",
	"staremo", "starete", "starò", "stava", "stavamo", "stavano", "stavate", "stavi", "stavo", "stemmo", "stessero",
	"stessimo", "steste", "stesti", "stette", "stettero", "stetti", "stia", "stiamo", "stiano", "stiate", "sto" ];

let otherAuxiliariesInfinitive = [ "avere", "l'avere", "aver", "l'aver", "potere", "poter", "volere", "voler", "dovere",
	"dover", "sapere", "saper", "solere", "stare", "star" ];

let copula = [ "è", "e'", "era", "erano", "eravamo", "eravate", "eri", "ero", "essendo", "essente", "fosse", "fossero",
	"fossi", "fossimo", "foste", "fosti", "fu", "fui", "fummo", "furono", "sarà", "sarai", "saranno", "sarebbe", "sarebbero",
	"sarei", "saremmo", "saremo", "sareste", "saresti", "sarete", "sarò", "sei", "sia", "siamo", "siano", "siate", "siete",
	"sii", "sono", "stata", "state", "stati", "stato" ];

let copulaInfinitive = [ "essere", "esser" ];

/*
'Verso' ('towards') not included because it can also mean 'verse'.
Already in other lists: malgrado, nonostante.
 */
let prepositions = [ "di", "del", "dello", "della", "dei", "degli", "delle", "a", "ad", "al", "allo", "alla", "ai", "agli",
	"alle", "da", "dal", "dallo", "dalla", "dai", "dagli", "dalle", "in", "nel", "nello", "nella", "nei", "negli", "nelle",
	"con", "col", "collo", "colla", "coi", "cogli", "colle", "su", "sul", "sullo", "sulla", "sui", "sugli", "sulle",
	"per", "pel", "pello", "pella", "pei", "pegli", "tra", "fra", "attraverso", "circa", "contro", "davanti", "dentro",
	"dietro", "entro", "escluso", "fuori", "insieme", "intorno", "lontano", "lungo", "mediante", "oltre", "presso", "rasente",
	"riguardo", "senza", "sopra", "sotto", "tramite", "vicino" ];

let coordinatingConjunctions = [ "e", "ed", "o", "oppure" ];

/* '
Tale' from 'tale ... quale'.
'Dall'altra' from 'da una parte... dall'altra'.
Already in other lists: vuoi...vuoi, tanto...quanto, quanto...quanto, ora...ora, non solo...ma anche, sia...sia, o...o,
più...meno, né...né, altrettanto...così, così...come.
 */
let correlativeConjunctions = [ "tale", "l'uno", "l'altro", "tali", "dall'altra" ];

/*
Already in another list (transition words, interrogative adverbs, numerals, prepositions):
perché, quando, mentre, appena [che], sebbene, fino, affinché, finché, dato [che], visto [che], benché,
come, prima [che], dopo, per, senza [che], di, sempre, nonostante, malgrado, così [che], in modo...da,
tanto...da, con, dove, quanto, più...che, meno, peggio...che, meglio...di, se, che, di, a meno che, siccome,
ogni volta [che], anche se, cosicché, invece, bensì, [al] punto [che].
'Modo' from 'in modgiacché o che'.
'Volta' from 'una volta che.
Excluded because of primary meaning: dal momento che, allo scopo di, a furia di ('fury', 'haste', 'rage'),
a forza di ('force'), a condizione che ('condition').
*/
let subordinatingConjunctions = [ "anziché", "anzichè", "fuorché", "fuorchè", "giacché", "giacchè", "laddove", "modo",
	"ove", "qualora", "quantunque", "volta" ];

/*
These verbs are frequently used in interviews to indicate questions and answers.
Not included: 'legge' ('reads', but also: 'law'), 'letto' ('(has) read', but also: bed), 'precisa' ('states', but also: 'precise').
 */
let interviewVerbs = [ "dice", "dicono", "diceva", "dicevano", "disse", "dissero", "detto", "domanda", "domandano", "domandava",
	"domandavano", "domandò", "domandarono", "domandato", "afferma", "affermato", "aggiunge", "aggiunto", "ammette", "ammesso",
	"annuncia", "annunciato", "assicura", "assicurato", "chiede", "chiesto", "commentato", "conclude", "concluso", "continua", "continuato",
	"denuncia", "denunciato", "dichiara", "dichiarato", "esordisce", "esordito", "inizia", "iniziato", "precisato", "prosegue",
	"proseguito", "racconta", "raccontato", "recita", "recitato", "replica", "replicato", "risponde", "risposto", "rimarca",
	"rimarcato", "rivela", "rivelato", "scandisce", "scandito", "scrive", "scritto", "segnala", "segnalato", "sottolinea", "sottolineato",
	"spiega", "spiegato" ];

let interviewVerbsInfinitive = [ "affermare", "aggiungere", "ammettere", "annunciare", "assicurare", "chiedere",
	"commentare", "concludere", "continuare", "denunciare", "dichiarare", "esordire", "iniziare", "precisare", "proseguire",
	"raccontare", "recitare", "replicare", "rispondere", "rimarcare", "rivelare", "scandire", "scrivere", "segnalare",
	"sottolineare", "spiegare" ];


/*
These transition words were not included in the list for the transition word assessment for various reasons.
'Appunto' ('just', 'exactly') not included for the second meaning of 'note'.
*/
let additionalTransitionWords = [ "eventualmente", "forse", "mai", "probabilmente" ];

let intensifiers = [ "addirittura", "assolutamente", "ben", "estremamente", "mica", "nemmeno", "quasi" ];

// These verbs convey little meaning.
let delexicalizedVerbs = [ "fa", "fa'", "faccia", "facciamo", "facciano", "facciate", "faccio", "facemmo", "facendo", "facente", "facesse",
	"facessero", "facessi", "facessimo", "faceste", "facesti", "faceva", "facevamo", "facevano", "facevate", "facevi",
	"facevo", "fai", "fanno", "farà", "farai", "faranno", "farebbe", "farebbero", "farei", "faremmo", "faremo",
	"fareste", "faresti", "farete", "farò", "fate", "fatto", "fece", "fecero", "feci", "fo" ];

let delexicalizedVerbsInfinitive = [ "fare" ];

/*
These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 */
let generalAdjectivesAdverbs = [ "anteriore",  "anteriori", "precedente", "precedenti", "facile", "facili", "facilissimo",
	"facilissima", "facilissimi", "facilissime", "semplice", "semplici", "semplicissima", "semplicissimo",
	"semplicissimi", "semplicissime", "semplicemente", "rapido", "rapida", "rapidi", "rapide", "veloce", "veloci", "differente",
	"difficile", "difficili", "difficilissimo", "difficilissima", "difficilissimi", "difficilissime", "basso", "bassa", "bassi", "basse",
	"alto", "alta", "alti", "alte", "normale", "normali", "normalmente", "corto", "corta", "corti", "corte", "breve", "brevi",
	"recente", "recenti", "totale", "totali", "completo", "completa", "completi", "complete", "possibile", "possibili", "ultimo",
	"ultima", "ultimi", "ultime", "differenti", "simile", "simili", "prossimo", "prossima", "prossimi", "prossime", "giusto",
	"giusta", "giusti", "giuste", "giustamente", "cosiddetto", "bene", "meglio", "benissimo", "male", "peggio", "malissimo",
	"comunemente", "constantemente", "direttamente", "esattamente", "facilmente", "generalmente", "leggermente", "personalmente",
	"recentemente", "sinceramente", "solamente", "avanti", "indietro" ];

let generalAdjectivesAdverbsPreceding = [ "nuovo", "nuova", "nuovi", "nuove", "vecchio", "vecchia", "vecchi", "vecchie",
	"bello", "bella", "belli", "belle", "bellissimo", "bellissima", "bellissimi", "bellissime",
	"buono", "buona", "buoni", "buone", "buonissimo", "buonissima", "buonissimi", "buonissime", "grande", "grandi",
	"grandissimo", "grandissima", "grandissimi", "grandissime", "lunga", "lunghi", "lunghe", "piccolo", "piccola", "piccoli",
	"piccole", "piccolissimo", "piccolissima", "piccolissimi", "piccolissime", "proprio", "propria", "propri", "proprie",
	"solito", "solita", "soliti", "solite", "stesso", "stessa", "stessi", "stesse" ];

let interjections = [ "accidenti", "acciderba", "ah", "aah", "ahi", "ahia", "ahimé", "bah", "beh", "boh", "ca", "caspita",
	"chissà", "de'", "diamine", "ecco", "eh", "ehi", "eeh", "ehilà", "ehm", "gna", "ih", "magari", "macché", "macchè",
	"mah", "mhm", "nca", "neh", "oibò", "oh", "ohe", "ohé", "ohilá", "ohibò", "ohimé", "okay", "ok", "olà", "poh",
	"pota", "puah", "sorbole", "to'", "toh", "ts", "uff", "uffa", "uh", "uhi" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "cc", "g", "hg", "hl", "kg", "l", "prs", "pz", "q.b.", "qb", "ta", "tz" ];

let timeWords = [ "minuto", "minuti", "ora", "ore", "giorno", "giorni", "giornata", "giornate",
	"settimana", "settimane", "mese", "mesi", "anno", "anni", "oggi", "domani", "ieri", "stamattina", "stanotte",
	"stasera", "tardi" ];

// Already included in other lists.
let vagueNouns = [ "aspetto", "aspetti", "caso", "casi", "cose", "idea", "idee", "istanza", "maniera", "oggetto", "oggetti", "parte",
	"parti", "persona", "persone", "pezzo", "pezzi", "punto", "punti", "sorta", "sorte", "tema", "temi", "volte" ];

let miscellaneous = [ "sì", "no", "non", "€", "euro", "euros", "ecc", "eccetera" ];

let titlesPreceding = [ "sig.na", "sig.ra", "sig", "sigg", "dr", "dr.ssa", "dott", "dott.ssa", "prof", "prof.ssa", "gent", "gent.mo",
	"gent.mi", "gent.ma", "gent.me", "egr", "egr.i", "egr.ia", "egr.ie", "preg.mo", "preg.mo", "preg.ma", "preg.me", "ill", "ill.mo",
	"ill.mi", "ill.ma", "ill.me", "cav", "on", "spett" ];

/**
 * Exports all function words concatenated, and specific word categories and category combinations
 * to be used as filters for the prominent words.
 *
 * @returns {Object} Italian function words.
 */
export default function() {
	return {
		// These word categories are filtered at the beginning of word combinations.
		filteredAtBeginning: generalAdjectivesAdverbs,

		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, interviewVerbsInfinitive, passiveAuxiliariesInfinitive, otherAuxiliariesInfinitive,
			copulaInfinitive, delexicalizedVerbsInfinitive, generalAdjectivesAdverbsPreceding ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers,
			possessivePronouns ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, personalPronounsNominative, personalPronounsAccusative, personalPronounsPrepositional,
			interjections, cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs,
			indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers, interrogativePronouns,
			interrogativeAdverbs, locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns ),

		// These word categories cannot directly precede a passive participle.
		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, prepositions, personalPronounsAccusative, possessivePronouns,
			indefinitePronouns, cardinalNumerals, ordinalNumerals, delexicalizedVerbs, delexicalizedVerbsInfinitive,
			interviewVerbs, interrogativeDeterminers, interrogativePronouns, personalPronounsPrepositional, interrogativeAdverbs ),

		// These word categories cannot intervene between an auxiliary and a corresponding passive participle.
		cannotBeBetweenPassiveAuxiliaryAndParticiple: [].concat( otherAuxiliaries, otherAuxiliariesInfinitive ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns,
			personalPronounsNominative, personalPronounsAccusative, personalPronounsPrepositional, quantifiers,
			indefinitePronouns, interrogativePronouns, interrogativeAdverbs, interrogativeDeterminers,
			pronominalAdverbs, locativeAdverbs, filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive,
			otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions,
			subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive,
			interjections, generalAdjectivesAdverbs, generalAdjectivesAdverbsPreceding, recipeWords, vagueNouns, miscellaneous, timeWords,
			titlesPreceding ),
	};
}

