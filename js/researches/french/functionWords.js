let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

let articles = [ "le", "la", "les", "un", "une", "des", "aux", "du", "au" ];

let numerals = [ "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze",
	"quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix",
	"quatre-vingt", "quatre-vingt-dix", "cent", "mille", "million", "milliard", "premier", "première", "deuxième", "troisième",
	"quatrième", "cinquième", "sixième", "septième", "huitième", "neuvième", "dixième", "onzième", "douzième", "treizième",
	"quatorzième", "quinzième", "seizième", "dix-septième", "dix-huitième", "dix-neuvième", "vingtième", ];

let personalPronounsNominative = [ "je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles" ];

let personalPronounsStressed = [ "moi", "toi", "lui", "soi", "eux", "elles" ];

// le, la, les are already included in the articles list.
let personalPronounsAccusative = [ "me", "te", "en" ];

// The remaining dative personal pronouns are already included in other pronoun lists.
let personalPronounsDative = [ "leur" ];

let demonstrativePronouns = [ "celui", "celle", "ceux", "celles", "ce", "celui-ci", "celui-là", "celle-ci", "celle-là", "ceux-ci",
	"ceux-là", "celles-ci", "celles-là", "ceci", "cela", "ça" ];

let possessivePronouns = [ "mon", "ton", "son", "ma", "ta", "sa", "mes", "tes", "ses", "notre", "votre", "leur", "nos", "vos", "leurs" ];

let quantifiers = [ "beaucoup", "peu", "bien", "quelque", "quelques", "tous", "tout", "toute", "toutes", "plusieurs", "plein", "chaque",
	"suffisant", "suffisante", "suffisantes", "suffisants", "faible", "moins", "tant", "plus", "plusieurs", "divers", "diverse", "diverses" ];

// The remaining reflexive personal pronouns are already included in other pronoun lists.
let reflexivePronouns = [ "se" ];

let indefinitePronouns = [ "aucun", "aucune", "autre", "autres", "certain", "certaine", "certaines", "certains", "chacun", "chacune", "même", "mêmes",
	"quelqu'un", "quelqu'une", "quelques'uns", "quelques'unes", "autrui", "nul", "personne", "quiconque", "rien", "d'aucunes", "d'aucuns", "nuls", "nules",
	"l'autre", "l'autres", "autrui", "tel", "telle", "tels", "telles" ];

let relativePronouns = [ "qui", "que", "lequel", "laquelle", "auquel", "auxquels", "auxquelles", "duquel", "desquels", "desquelles", "dont", "où", "quoi" ];

let interrogativeProAdverbs =  [ "combien", "comment", "pourquoi", "quand", "d'où"  ];

let interrogativeAdjectives =  [ "quel", "quels", "quelle", "quels"  ];

let pronominalAdverbs = [ "en", "y" ];

let locativeAdverbs = [ "là", "ici", "voici" ];

// 'Vins' is not included because it also means 'wines'.
let otherAuxiliaries = [ "j'ai", "ai", "as", "a", "avons", "avez", "ont", "eu", "avais", "avait", "avions", "aviez", "avaient", "aurai", "auras", "aura",
	"aurons", 'aurez', "auront", "aurais", "aurait", "auions", "auriez", "auraient", "aie", "ayons", "ayez", "vais", "vas", "va", "allons", "allez", "vont",
	"allé", "allés", "j'allai", "allai", "allas", "allas", "allâmes", "allâtes", "allèrent", "j'allais", "allais", "allait", "allions", "alliez", "allaient",
	"j'irai", "iras", "ira", "irons", "irez", "iront", "j'aille", "aille", "ailles", "allions", "alliez", "aillent", "j'allasse", "allasse", "allasses",
	"allât", "allassions", "allassiez", "allassent", "j'irais", "irais", "irait", "irions", "iriez", "iraient", "allant", "viens", "vient", "venons", "venez",
	"viennent", "vins", "vint", "vînmes", "vîntes", "vinrent", "venu", "venus", "vint", "vînmes", "vîntes", "vinrent", "venais", "venait", "venions",
	"veniez", "venaient", "viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront", "vienne", "viennes", "venions", "veniez", "viennent",
	"vinsse", "vinsses", "vînt", "vinssions", "vinssiez", "vinssent", "viendrais", "viendrait", "viendrions", "viendriez", "viendraient", "venant", "dois",
	"doit", "devons", "devez", "doivent", "dus", "dut", "dûmes", "dûtes", "durent", "dû", "devais", "devait", "devions", "deviez", "devaient", "devrai",
	"devras", "devra", "devrons", "devrez" , "devront", "doive", "doives", "devions" , "deviez", "doivent", "dusse", "dusses", "dût", "dussions", "dussiez",
	"dussent", "devrais", "devrait", "devrions", "devriez", "devraient", "devant", "peux", "peut", "pouvons", "pouvez", "peuvent", "pus", "put", "pûmes",
	"pûtes", "purent", "pu", "pouvais", "pouvait", "pouvions", "pouviez", "pouvaient", "pourrai", "pourras", "pourra", "pourrons", "pourrez", "pourront",
	"puisse", "puisses", "puisse", "puissions", "puissiez", "puissent", "pusse", "pusses", "pût", "pussions", "pussiez", "pussent", "pourrais", "pourrait",
	"pourrions", "pourriez", "pourraient", "pouvant", "semble", "sembles", "semblons", "semblez", "semblent", "semblai", "semblas", "sembla", "semblâmes",
	"semblâtes", "semblèrent", "semblais", "semblait", "semblions", "sembliez", "semblaient", "semblerai", "sembleras", "semblera", "semblerons",
	"semblerez", "sembleront", "semblé", "semblions", "sembliez", "semblent", "semblasse", "semblasses", "semblât", "semblassions", "semblassiez",
	"semblassent", "semblerais", "semblerait", "semblerions", "sembleriez", "sembleraient", "parais", "paraît", "ait", "paraissons", "paraissez",
	"paraissent", "parus", "parut", "parûmes", "parûtes", "parurent", "paraissais", "paraissait", "paraissions", "paraissiez", "paraissaient", "paraîtrai",
	"paraîtras", "paraîtra", "paraîtrons", "paraîtrez", "paraîtront", "aitrai", "aitras", "aitra", "aitrons", "aitrez", "aitront", "paru", "paraisse",
	"paraisses", "paraissions", "paraissiez", "paraissent", "parusse", "parusses", "parût", "parussions", "parussiez", "parussent", "paraîtrais",
	"paraîtrait", "paraîtrions", "paraîtriez", "paraîtraient", "aitrais", "aitrait", "aitrions", "aitriez", "aitraient", "paraissant", "mets", "met",
	"mettons", "mettez", "mettent", "mis", "mit", "mîmes", "mîtes", "mirent", "mettais", "mettait", "mettions", "mettiez", "mettaient", "mettrai", "mettras",
	"mettra", "mettrons", "mettrez", "mettront", "mette", "mettes", "mettions", "mettiez", "mettent", "misse", "misses", "mît", "missions", "missiez",
	"missent", "mettrais", "mettrais", "mettrait", "mettrions", "mettriez", "mettraient", "mettant", "finis", "finit", "finissons", "finissez", "finissent",
	"finîmes", "finîtes", "finirent", "finissais", "finissait", "finissions", "finissiez", "finissaient", "finirai", "finiras", "finira", "finirons",
	"finirez", "finiront", "fini", "finisse", "finisses", "finissions", "finissiez", "finissent", "finît", "finirais", "finirait", "finirions", "finiriez",
	"finiraient", "finissant" ];

let otherAuxiliariesInfinitive = [ "avoir", "aller", "venir", "devoir", "pouvoir", "sembler", "paraître", "paraitre", "mettre", "finir" ];

let copula = [ "suis", "es", "est", "est-ce", "sommes", "êtes", "sont", "étais", "était", "étions", "étiez", "étaient", "serai", "seras", "sera", "serons",
	"serez", "seront", "serais", "serait", "serions", "seriez", "seraient", "sois", "soit", "soyons", "soyez", "soient", "été" ];

let copulaInfinitive = [ "être" ];

let prepositions = [  ];

let coordinatingConjunctions = [  ];

/*
 'Entweder' is part of 'wntweder...oder', 'sowohl', 'auch' is part of 'sowohl als...auch', 'weder' and 'noch' are part of 'weder...noch',
 'nur' is part of 'nicht nur...sondern auch'.
 */
let correlativeConjunctions = [  ];

// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
let subordinatingConjunctions = [  ];

// These verbs are frequently used in interviews to indicate questions and answers.
let interviewVerbs = [  ];

let interviewVerbsInfinitive = [  ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [  ];

let intensifiers = [ "assez", "trop", "tellement", "presque", "extrêmement", "très" ];

// These verbs convey little meaning.
let delexicalisedVerbs = [  ];

let delexicalisedVerbsInfinitive = [  ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
let generalAdjectivesAdverbs = [  ];

let interjections = [  ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [  ];

let timeWords = [  ];

let vagueNouns = [  ];

let miscellaneous = [  ];

module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, personalPronounsDative,
			possessivePronouns, personalPronounsStressed ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions, correlativeConjunctions ),
		verbs: copula.concat( interviewVerbs, otherAuxiliaries, filteredPassiveAuxiliaries ),
		quantifiers: quantifiers,
		relativePronouns: relativePronouns,
		interrogatives: interrogativeProAdverbs.concat( interrogativeAdjectives ),
		transitionWords: transitionWords.concat( additionalTransitionWords ),
		// These verbs that should be filtered at the beginning of prominent word combinations.
		beginningVerbs: otherAuxiliariesInfinitive.concat( infinitivePassiveAuxiliaries,
			delexicalisedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive ),
		miscellaneous: miscellaneous,
		interjections: interjections,
		pronominalAdverbs: pronominalAdverbs,
		reflexivePronouns: reflexivePronouns,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative,
			personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs,	pronominalAdverbs,
			locativeAdverbs, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries, otherAuxiliaries, interrogativeAdjectives,
			otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions,
			subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers,
			delexicalisedVerbs, delexicalisedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous,
			timeWords ),
	};
};
