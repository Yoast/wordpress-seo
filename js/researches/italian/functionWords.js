let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher.
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "il", "i", "la", "le", "lo", "gli", "un", "uno", "una", "dei", "degli", "delle" ];

let numerals = [ "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici",
	"tredici", "quattordici", "quindici", "sedici", "diciassette", "diciotto", "diciannove", "venti", "primo", "prima",
	"secondo", "seconda", "terzo", "terza", "quarto", "quarta", "quinto", "quinta", "sesto", "sesta", "settimo", "settima",
	"ottavo", "ottava", "nono", "nona", "decimo", "decima", "undicesimo", "undicesima", "dodicesimo", "dodicesima",
	"tredicesimo", "tredicesima", "quattordicesimo", "quattordicesima", "quindicesimo", "quindicesima",
	"sedicesimo", "sedicesima", "diciassettesimo", "diciassettesima", "diciannovesimo", "diciannovesima", "ventesimo", "ventesima",
	"cento", "mille", "mila", "duemila", "tremila", "quattromila", "cinquemila", "seimila", "settemila", "ottomila", "novemila",
	"diecimila", "milione", "milioni", "miliardo", "miliardi" ];

let personalPronounsNominative = [ "io", "tu", "egli", "esso", "lui", "ella", "essa", "lei", "noi", "voi",
	"essi", "esse", "loro" ];

// 'La' and 'le' are already included in the list of articles.
let personalPronounsAccusative = [ "mi", "ti", "lo", "si", "ci", "vi", "li", "me", "te", "se",
	"glie", "glielo", "gliela", "glieli", "gliele", "gliene", "ce", "ve" ];

let demonstrativePronouns = [ "ciò", "codesto", "codesta", "codesti", "codeste", "colei", "colui", "coloro",
	"costei", "costui", "costoro", "medesimo", "medesima", "medesimi", "medesime", "questo", "questa",
	"questi", "queste", "quello", "quella", "quelli", "quelle", "quel", "quei", "quegli" ];

let possessivePronouns = [ "mio", "mia", "miei", "mie", "tuo", "tua", "tuoi", "tue", "suo", "sua", "suoi", "sue",
	"nostro", "nostra", "nostri", "nostre", "vostro", "vostra", "vostro", "vostre" ];

// Already in the list of transition words: appena.
let quantifiers = [ "abbastanza", "affatto", "assai", "alcun", "alcuna", "alcune", "alcuni", "alcuno", "alquanto", "bastantemente",
	"grandemente", "massimamente", "meno", "minimamente", "molta", "molte", "molti", "moltissimo",
	"molto", "nessun", "nessuna", "nessuno", "niente", "nulla", "ogni", "più", "po'", "poca", "poche", "pochi", "poco", "pochissime",
	"pochissimi", "qualche", "qualsiasi", "qualunque", "quintali", "rara", "rarissima", "rarissimo", "raro", "spesso", "spessissimo",
	"sufficientemente",	"taluno", "taluna", "taluni", "talune", "tanta", "tante", "tanti", "tantissime", "tantissimi",
	"tanto", "tonnellate", "troppa", "troppe", "troppi", "troppo", "tutta", "tutte", "tutti", "tutto" ];

// Only includes intensifiers, because the normal forms are the same as the accusative pronouns.
let reflexivePronouns = [ "stesso", "stessa", "stessi", "stesse" ];

// Already in the quantifier list: alcuno, molto, nessuno, poco, taluno tanto, troppo, tutto, nulla, niente.
let indefinitePronouns = [ "alcunché", "alcunchè", "altro", "altra", "altri", "altre", "certo", "certa", "certi", "certe",
	"checché", "checchè", "chicchessia", "chiunque", "ciascuno", "ciascuna", "ciascun", "diverso", "diversa", "diversi",
	"diverse", "parecchio", "parecchia", "parecchi", "parecchie", "qualcosa", "qualcuno", "qualcuna", "vario", "varia",
	"vari", "varie" ];

let interrogativeDeterminers = [ "che", "cosa", "cui", "qual", "quale", "quali" ];

let interrogativePronouns = [ "chi", "quali", "quanta", "quante", "quanti", "quanto" ];

let interrogativeAdjectives = [ "quanto", "quanta", "quanti", "quante" ];

let interrogativeAdverbs = [ "come", "com'è", "com'era", "com'erano", "donde", "d'onde", "dove", "dov'è", "dov'era", "dov'erano", "dovunque",
	"onde", "ove", "quando" ];

// 'Ci' and 'vi' are already part of the list of personal pronouns.
let pronominalAdverbs = [ "ne" ];

// 'Via' not included because of primary meaning 'street'.
let locativeAdverbs = [ "accanto", "altrove", "attorno", "dappertutto", "giù", "là", "laggiù", "lassù", "lì",  "ovunque",
	"qua", "quaggiù", "quassù", "qui" ];

// 'Essere' is already part of the otherAuxiliaries list.
let filteredPassiveAuxiliaries = [ "vengano", "vengo", "vengono", "veniamo", "veniate", "venimmo", "venisse", "venissero", "venissi", "venissimo",
	"veniste", "venisti", "venite", "veniva", "venivamo", "venivano", "venivate", "venivi", "venivo", "venne",
	"vennero", "venni", "verrà", "verrai", "verranno", "verrebbe", "verrebbero", "verrei", "verremmo",
	"verremo", "verreste", "verresti", "verrete", "verrò", "viene", "vieni" ];

let infinitivePassiveAuxiliaries = [ "venire", "venir" ];

let otherAuxiliaries = [ "abbi", "abbia", "abbiamo", "abbiano", "abbiate", "abbiente", "avemmo", "avendo", "avente", "avesse", "avessero", "avessi",
	"avessimo", "aveste", "avesti", "avete", "aveva", "avevamo", "avevano", "avevate", "avevi", "avevo", "avrà", "avrai",
	"avranno", "avrebbe", "avrebbero", "avrei", "avremmo", "avremo", "avreste", "avresti", "avrete", "avrò", "avuto", "ebbe",
	"ebbero", "ebbi", "ha", "hai", "hanno", "ho", "possa", "possano", "possiamo", "possiate", "posso", "possono", "poté",
	"potei", "potemmo", "potendo", "potente", "poterono", "potesse", "potessero", "potessi", "potessimo", "poteste", "potesti",
	"potete", "potette", "potettero", "potetti", "poteva", "potevamo", "potevano", "potevate", "potevi", "potevo", "potrà",
	"potrai", "potranno", "potrebbe", "potrebbero", "potrei", "potremmo", "potremo", "potreste", "potresti", "potrete", "potrò",
	"potuto", "può", "puoi", "voglia", "vogliamo", "vogliano", "vogliate", "voglio", "vogliono", "volemmo", "volendo", "volente",
	"volesse", "volessero", "volessi", "volessimo", "voleste", "volesti", "volete", "voleva", "volevamo", "volevano", "volevate",
	"volevi", "volevo", "volle", "vollero", "volli", "voluto", "vorrà", "vorrai", "vorranno", "vorrebbe", "vorrebbero",
	"vorrei", "vorremmo", "vorremo", "vorreste", "vorresti", "vorrete", "vorrò", "vuoi", "vuole",
	"debba", "debbano", "debbono", "deva", "deve", "devi", "devo", "devono", "dobbiamo", "dobbiate", "dové", "dovei",
	"dovemmo", "dovendo", "doverono", "dovesse", "dovessero", "dovessi", "dovessimo", "doveste", "dovesti", "dovete",
	"dovette", "dovettero", "dovetti", "doveva", "dovevamo", "dovevano", "dovevate", "dovevi", "dovevo", "dovrà",
	"dovrai", "dovranno", "dovrebbe", "dovrebbero", "dovrei", "dovremmo", "dovremo", "dovreste", "dovresti", "dovrete",
	"dovrò", "dovuto", "sa", "sai", "sanno", "sapemmo", "sapendo", "sapesse", "sapessero", "sapessi", "sapessimo", "sapeste",
	"sapesti", "sapete", "sapeva", "sapevamo", "sapevano", "sapevate", "sapevi", "sapevo", "sappi", "sappia", "sappiamo", "sappiano",
	"sappiate", "saprà", "saprai", "sapranno", "saprebbe", "saprebbero", "saprei", "sapremmo", "sapremo", "sapreste",
	"sapresti", "saprete", "saprò", "saputo", "seppe", "seppero", "seppi", "so", "soglia", "sogliamo", "sogliano", "sogliate",
	"soglio", "sogliono", "solesse", "solessero", "solessi", "solessimo", "soleste", "solete", "soleva", "solevamo", "solevano",
	"solevate", "solevi", "solevo", "solito", "suoli", "sta", "stai", "stando", "stanno", "stante", "starà", "starai",
	"staranno", "staremo", "starete", "starò", "stata", "state", "stati", "stato", "stava", "stavamo", "stavano", "stavate",
	"stavi", "stavo", "stemmo", "stesse", "stessero", "stessi", "stessimo", "steste", "stesti", "stette", "stettero", "stetti", "stia",
	"stiamo", "stiano", "stiate", "sto" ];

let otherAuxiliariesInfinitive = [ "avere", "aver", "potere", "poter", "volere", "poter", "dovere", "dover", "sapere", "saper", "solere",
	"stare", "star" ];

let copula = [ "è", "e'", "era", "erano", "eravamo", "eravate", "eri", "ero", "essendo", "essente", "fosse", "fossero", "fossi", "fossimo",
	"foste", "fosti", "fu", "fui", "fummo", "furono", "sarà", "sarai", "saranno", "sarebbe", "sarebbero", "sarei",
	"saremmo", "saremo", "sareste", "saresti", "sarete", "sarò", "sei", "sia", "siamo", "siano", "siate", "siete",
	"sii", "sono", "stata", "state", "stati", "stato" ];

let copulaInfinitive = [ "essere", "esser" ];

/*
'Verso' ('towards') not included because it can also mean 'verse'.
Already in other lists: malgrado, nonostante.
 */
let prepositions = [ "di", "del", "dello", "della", "dei", "degli", "delle", "a", "ad", "al", "allo", "alla", "ai", "agli", "alle",
	"da", "dal", "dallo", "dalla", "dai", "dagli", "dalle", "in", "nel", "nello", "nella", "nei", "negli", "nelle",
	"con", "col", "collo", "colla", "coi", "cogli", "colle", "su", "sul", "sullo", "sulla", "sui", "sugli", "sulle",
	"per", "pel", "pello", "pella", "pei", "pegli", "tra", "fra", "attraverso", "circa", "contro", "davanti", "dentro", "dietro",
	"dopo", "durante", "eccetto", "entro", "escluso", "fuori", "insieme", "intorno", "lontano", "lungo",
	"mediante", "oltre", "presso", "rasente", "riguardo", "senza", "sopra", "sotto", "tramite", "tranne", "vicino" ];

let coordinatingConjunctions = [ "e", "ed", "ma", "o", "oppure" ];

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
let interviewVerbs = [ "dice", "dicono", "diceva", "dicevano", "disse", "dissero", "detto",
	"domanda", "domandano", "domandava", "domandavano", "domandò", "domandarono", "domandato",
	"afferma", "affermato", "aggiunge", "aggiunto", "ammette", "ammesso", "annuncia", "annunciato",
	"assicura", "assicurato", "chiede", "chiesto", "commentare", "commentato", "conclude", "concluso",
	"continua", "continuato", "denuncia", "denunciato", "dichiara", "dichiarato", "denuncia", "denunciato",
	"esordisce", "esordito", "inizia", "iniziato", "precisato", "prosegue", "proseguito", "racconta", "raccontato",
	"recita", "recitato", "replica", "replicato", "risponde", "risposto", "rimarca", "rimarcato", "rivela", "rivelato",
	"scandisce", "scandito", "scrive", "scritto", "segnala", "segnalato", "sottolinea", "sottolineato", "spiega", "spiegato" ];

let interviewVerbsInfinitive = [ "affermare", "aggiungere", "ammettere", "annunciare", "assicurare", "chiedere",
	"commentare", "concludere", "continuare", "denunciare", "dichiarare", "esordire", "iniziare", "precisare", "proseguire",
	"raccontare", "recitare", "replicare", "rispondere", "rimarcare", "rivelare", "scandire", "scrivere", "segnalare",
	"sottolineare", "spiegare" ];


/*
These transition words were not included in the list for the transition word assessment for various reasons.
'Appunto' ('just', 'exactly') not included for the second meaning of 'note'.
*/
let additionalTransitionWords = [ "eventualmente", "forse", "mai", "particolarmente", "probabilmente", "sempre" ];

let intensifiers = [ "addirittura", "assolutamente", "ben", "completamente", "estremamente", "mica", "nemmeno",
	"neppure", "quasi", "sicuramente", "veramente", "totalmente" ];

// These verbs convey little meaning.
let delexicalisedVerbs = [ "fa", "fa’", "faccia", "facciamo", "facciano", "facciate", "faccio", "facemmo", "facendo", "facente", "facesse",
	"facessero", "facessi", "facessimo", "faceste", "facesti", "faceva", "facevamo", "facevano", "facevate", "facevi",
	"facevo", "fai", "fanno", "farà", "farai", "faranno", "fare", "farebbe", "farebbero", "farei", "faremmo", "faremo",
	"fareste", "faresti", "farete", "farò", "fate", "fatto", "fece", "fecero", "feci", "fo" ];

let delexicalisedVerbsInfinitive = [ "fare" ];

/*
These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine.
 */
let generalAdjectivesAdverbs = [ "nuovo", "nuova", "nuovi", "nuove", "vecchio", "vecchia", "vecchi", "vecchie", "anteriore",
	"anteriori", "precedente", "precedenti", "bello", "bella", "belli", "belle", "bellissimo", "bellissima", "bellissimi", "bellissime",
	"buono", "buona", "buoni", "buone", "buonissimo", "buonissima", "buonissimi", "buonissime", "grande", "grandi",
	"grandissimo", "grandissima", "grandissimi", "grandissime", "facile", "facili", "facilissimo", "facilissima", "facilissimi",
	"facilissime", "semplice", "semplici", "semplicissimo", "semplicissima", "semplicissimo", "semplicissimi", "semplicissime",
	"semplicemente", "rapido", "rapida", "rapidi", "rapide", "veloce", "veloci",    "difficile", "difficili",
	"difficilissimo", "difficilissima", "difficilissimi", "difficilissime", "proprio", "propria",
	"propri", "proprie",    "lungo", "lunga", "lunghi", "lunghe", "basso", "bassa", "bassi", "basse",
	"alto", "alta", "alti", "alte", "normale", "normali", "normalmente", "piccolo", "piccola", "piccoli",
	"piccole", "piccolissimo", "piccolissima", "piccolissimi", "piccolissime",
	"corto", "corta", "corti", "corte", "breve", "brevi", "certo", "certa", "certi", "certe", "solita",
	"soliti", "solite", "recente", "recenti", "totale", "totali", "completo", "completa", "completi", "complete",
	"possibile", "possibili", "ultimo", "ultima", "ultimi", "ultime", "differente", "differenti", "simile", "simili",
	"parecchio", "parecchia", "parecchi", "parecchie", "prossimo", "prossima", "prossimi", "prossime",
	"giusto", "giusta", "giusti", "giuste", "giustamente", "cosiddetto", "bene", "meglio", "benissimo", "male", "peggio",
	"malissimo", "certamente", "comunemente", "constantemente", "continuamente", "direttamente", "effettivamente", "esattamente",
	"evidentemente", "facilmente", "finalmente", "generalmente", "leggermente", "naturalmente", "personalmente",
	"ovviamente", "praticamente", "recentemente", "sinceramente", "specialmente", "solamente", "avanti", "indietro",
	"soltanto", "presto", "soprattutto"	];

let interjections = [ "accidenti", "acciderba", "ah", "aah", "ahi", "ahia", "ahimé", "bah", "beh", "boh", "ca", "caspita",
	"chissà", "de'", "diamine", "ecco", "eh", "ehi", "eeh", "ehilà", "ehm", "gna", "ha", "ih", "magari", "macché", "macchè",
	"mah", "mhm", "nca", "neh",	"oibò", "oh", "ohe", "ohé", "ohilá", "ohibò", "ohimé", "okay", "ok", "olà", "poh",
	"pota", "puah", "sorbole", "to'", "toh", "ts", "uff", "uffa", "uh", "uhi" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "cc", "g", "hg", "hl", "kg", "l", "prs", "pz", "q.b.", "qb", "ta", "tz" ];

let timeWords = [ "secondi", "minuto", "minuti", "ora", "ore", "giorno", "giorni", "giornata", "giornate",
	"settimana", "settimane", "mese", "mesi", "anno", "anni", "oggi", "domani", "ieri", "stamattina", "stamattina",
	"stasera", "tardi", "immediatamente" ];

// Already included in other lists.
let vagueNouns = [ "aspetto", "aspetti", "caso", "casi", "cose", "idea", "idee", "istanza", "maniera", "modo", "oggetto", "oggetti", "parte",
	"parti", "persona", "persone", "pezzo", "pezzi", "punto", "punti", "sorta", "sorte", "tema", "temi", "volta", "volte" ];

let miscellaneous = [ "sì", "no", "non", "€", "euro", "euros", "ecc.", "eccetera" ];

/*
 Exports all function words concatenated, and specific word categories and category combinations
 to be used as filters for the prominent words.
 */

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, possessivePronouns ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions ),
		verbs: filteredPassiveAuxiliaries.concat( infinitivePassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs ),
		quantifiers: quantifiers,
		interrogatives: interrogativePronouns.concat( interrogativeAdverbs, interrogativeDeterminers, interrogativeAdjectives ),
		passiveAuxiliaries: filteredPassiveAuxiliaries,
		relativePronouns: interrogativeDeterminers.concat( interrogativePronouns, interrogativeAdjectives, interrogativeAdverbs ),
		transitionWords: transitionWords.concat( additionalTransitionWords ),
		miscellaneous: miscellaneous,
		pronominalAdverbs: pronominalAdverbs,
		interjections: interjections,
		reflexivePronouns: reflexivePronouns,
		beginningVerbs: interviewVerbsInfinitive.concat( infinitivePassiveAuxiliaries, otherAuxiliariesInfinitive, copulaInfinitive,
			delexicalisedVerbsInfinitive ),
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns,
			interrogativePronouns, interrogativeAdverbs, interrogativeDeterminers, interrogativeAdjectives,
			pronominalAdverbs, locativeAdverbs, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries,
			otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions,
			subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive,
			transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, delexicalisedVerbsInfinitive,
			interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, timeWords ),
	};
};

