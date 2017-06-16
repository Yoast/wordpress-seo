let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher.
 * @returns {Array} The array filled with exceptions.
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
    "glie", "glielo", "gliela", "glieli", "gliele", "gliene", "ce", "ve"];

let demonstrativePronouns = [ "ciò", "codesto", "codesta", "codesti", "codeste", "colei", "colui", "coloro",
    "costei", "costui", "costoro", "medesimo", "medesima", "medesimi", "medesime", "questo", "questa",
    "questi", "queste", "quello", "quella", "quelli", "quelle", "quel", "quei", "quegli" ];

let possessivePronouns = [ "mio", "mia", "tuo", "tua", "suo", "sua", "nostro", "nostra", "vostro", "vostra", "loro" ];

let quantifiers = [ "abbastanza", "affatto", "assai", "alcun", "alcuna", "alcune", "alcuni", "alcuno", "alquanto", "appena", "bastantemente",
    "grandemente", "massimamente", "meno", "minimamente", "molta", "molte", "molti", "moltissimo",
    "molto", "nessun", "nessuna", "nessuno", "niente", "nulla", "ogni", "più", "po'", "poca", "poche", "pochi", "poco", "pochissime",
    "pochissimi", "qualche", "qualsiasi", "qualunque", "quintali", "rara", "rarissima", "rarissimo", "raro", "spesso", "spessissimo", "sufficientemente",
    "taluno", "taluna", "taluni", "talune","tanta", "tante", "tanti", "tantissime", "tantissimi", "tanto", "tonnellate",
    "troppa", "troppe", "troppi", "troppo", "tutta", "tutte", "tutti", "tutto" ];

// Only includes intensifiers, because the normal forms are the same as the accusative pronouns.
let reflexivePronouns = [ "stesso", "stessa", "stessi", "stesse" ];


// Already in the quantifier list: alcuno, molto, nessuno, poco, taluno tanto, troppo, tutto, nulla, niente
let indefinitePronouns = [ "alcunché", "altro", "altra", "altri", "altre", "certo", "certa", "certi", "certe", "checché", "chicchessia",
    "chiunque", "ciascuno", "ciascuna", "ciascun", "diverso", "diversa", "diversi", "diverse", "parecchio", "parecchia", "parecchi", "parecchie",
    "qualcosa", "qualcuno", "qualcuna", "vario", "varia", "vari", "varie" ];

let interrogativeDeterminers = [ "che", "cosa", "cui", "qual", "quale"];

let interrogativePronouns = [ "chi", "quali", "quanta", "quante", "quanti", "quanto" ];

let interrogativeAdjectives = [ "quanto", "quanta", "quanti", "quante" ];

let interrogativeAdverbs = [ "come", "com'è", "com'era", "com'erano", "donde", "d'onde", "dove", "dov'è", "dov'era", "dov'erano",
    "onde", "ove", "perché", "quando" ];


// 'Ci' and 'vi' are already part of the list of personal pronouns.
let pronominalAdverbs = [ "ne" ];

let locativeAdverbs = [ "accanto", "lì", "là", "laggiù", "lassù", "giù", "ovunque", "qui", "qua"  ];

let filteredPassiveAuxiliaries = [  ];

let infinitivePassiveAuxiliaries = [  ];

let otherAuxiliaries = [

    "è", "era", "erano", "eravamo", "eravate", "eri", "ero", "essendo", "essente", "fosse", "fossero", "fossi", "fossimo",
    "foste", "fosti", "fu", "fui", "fummo", "furono", "sarà", "sarai", "saranno", "sarebbe", "sarebbero", "sarei",
    "saremmo", "saremo", "sareste", "saresti", "sarete", "sarò", "sei", "sia", "siamo", "siano", "siate", "siete",
    "sii", "sono", "stata", "state", "stati", "stato",

    "abbi", "abbia", "abbiamo", "abbiano", "abbiate", "abbiente", "avemmo", "avendo", "avente", "avesse", "avessero", "avessi",
    "avessimo", "aveste", "avesti", "avete", "aveva", "avevamo", "avevano", "avevate", "avevi", "avevo", "avrà", "avrai",
    "avranno", "avrebbe", "avrebbero", "avrei", "avremmo", "avremo", "avreste", "avresti", "avrete", "avrò", "avuto", "ebbe",
    "ebbero", "ebbi", "ha", "hai", "hanno", "ho",

    "possa", "possano", "possiamo", "possiate", "posso", "possono", "poté", "potei", "potemmo", "potendo", "potente", "poterono",
    "potesse", "potessero", "potessi", "potessimo", "poteste", "potesti", "potete", "potette", "potettero", "potetti",
    "poteva", "potevamo", "potevano", "potevate", "potevi", "potevo", "potrà", "potrai", "potranno", "potrebbe",
    "potrebbero", "potrei", "potremmo", "potremo", "potreste", "potresti", "potrete", "potrò", "potuto", "può", "puoi",

    "voglia", "vogliamo", "vogliano", "vogliate", "voglio", "vogliono", "volemmo", "volendo", "volente", "volesse",
    "volessero", "volessi", "volessimo", "voleste", "volesti", "volete", "voleva", "volevamo", "volevano", "volevate",
    "volevi", "volevo", "volle", "vollero", "volli", "voluto", "vorrà", "vorrai", "vorranno", "vorrebbe", "vorrebbero",
    "vorrei", "vorremmo", "vorremo", "vorreste", "vorresti", "vorrete", "vorrò", "vuoi", "vuole",

    "debba", "debbano", "debbono", "deva", "deve", "devi", "devo", "devono", "dobbiamo", "dobbiate", "dové", "dovei",
    "dovemmo", "dovendo", "doverono", "dovesse", "dovessero", "dovessi", "dovessimo", "doveste", "dovesti", "dovete",
    "dovette", "dovettero", "dovetti", "doveva", "dovevamo", "dovevano", "dovevate", "dovevi", "dovevo", "dovrà",
    "dovrai", "dovranno", "dovrebbe", "dovrebbero", "dovrei", "dovremmo", "dovremo", "dovreste", "dovresti", "dovrete",
    "dovrò", "dovuto",

    "sa", "sai", "sanno", "sapemmo", "sapendo", "sapesse", "sapessero", "sapessi", "sapessimo", "sapeste", "sapesti",
    "sapete", "sapeva", "sapevamo", "sapevano", "sapevate", "sapevi", "sapevo", "sappi", "sappia", "sappiamo", "sappiano",
    "sappiate", "saprà", "saprai", "sapranno", "saprebbe", "saprebbero", "saprei", "sapremmo", "sapremo", "sapreste",
    "sapresti", "saprete", "saprò", "saputo", "seppe", "seppero", "seppi", "so"

    "soglia",
    "sogliamo",
    "sogliano",
    "sogliate",
    "soglio",
    "sogliono",
    "solesse",
    "solessero",
    "solessi",
    "solessimo",
    "soleste",
    "solete",
    "soleva",
    "solevamo",
    "solevano",
    "solevate",
    "solevi",
    "solevo",
    "solito",
    "suoli"

    ];

    let otherAuxiliariesInfinitive = [ "essere", "avere", "potere", "volere", "dovere", "sapere", "solere" ];

// 'Vóórkomen' (appear) is not included, because we don't want to filter out 'voorkómen' (prevent).
let copula = [  ];

let prepositions = [ "di", "del", "dello", "della", "dei", "degli", "delle", "a", "al", "allo", "alla", "ai", "agli", "alle",
    "da", "dal", "dallo", "dalla", "dai", "dagli", "dalle", "in", "nel", "nello", "nella", "nei", "negli", "nelle",
    "con", "col", "collo", "colla", "coi", "cogli", "colle", "su", "sul", "sullo", "sulla", "sui", "sugli", "sulle",
    "per", "pel", "pello", "pella", "pei", "pegli", "tra", "fra", "attraverso", "circa", "contro", "davanti", "dentro", "dietro",
    "dopo", "durante", "eccetto", "entro", "escluso", "fuori", "insieme", "intorno", "lontano", "lungo", "malgrado",
    "mediante", "nonostante", "oltre", "presso", "rasente", "riguardo", "senza", "sopra", "sotto", "tramite", "tranne", "vicino" ];

// Many prepositional adverbs are already listed as preposition.
let prepositionalAdverbs = [  ];

let coordinatingConjunctions = [  ];

/* 'Zowel' and 'als' are part of 'zowel...als', 'evenmin' is part of 'evenmin...als', 'zomin' is part of 'zomin...als',
 'hetzij' is part of 'hetzij...hetzij'. */
let correlativeConjunctions = [  ];

let subordinatingConjunctions = [  ];

// These verbs are frequently used in interviews to indicate questions and answers.
let interviewVerbs = [  ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [  ];

let intensifiers = [  ];

// These verbs convey little meaning.
let delexicalisedVerbs = [  ];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
 Keyword combinations containing these adjectives/adverbs are fine. */
let generalAdjectivesAdverbs = [  ];

let interjections = [  ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "cc", "g", "hg", "hl", "kg", "l", "prs", "pz", "q.b.", "qb", "ta", "tz" ];

let vagueNouns = [  ];

let miscellaneous = [  ];

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
        relativePronouns: interrogativePronouns.concat( interrogativeAdverbs ),
        passiveAuxiliaries: filteredPassiveAuxiliaries,
        transitionWords: transitionWords.concat( additionalTransitionWords ),
        miscellaneous: miscellaneous,
        pronominalAdverbs: pronominalAdverbs,
        interjections: interjections,
        reflexivePronouns: reflexivePronouns,
        all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
            personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns,
            interrogativePronouns, interrogativeAdverbs,
            pronominalAdverbs, locativeAdverbs, prepositionalAdverbs, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries,
            otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
            transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
            recipeWords, vagueNouns, miscellaneous ),
    };
};

