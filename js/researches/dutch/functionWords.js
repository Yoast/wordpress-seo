let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

let articles = [ "de", "het", "een" ];
let numerals = [ "eén", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien",
	"veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien", "twintig", "eerste", "tweede", "derde", "vierde",
	"vijfde", "zesde", "zevende", "achtste", "negende", "tiende", "elfde", "twaalfde", "dertiende", "veertiende", "vijftiende",
	"zestiende", "zeventiende", "achttiende", "negentiende", "twinstigste", "honderd", "honderden", "duizend", "duizenden", "miljoen",
	"miljoenen", "biljoen", "biljoenen" ];

// 'Het' is already included in the list of articles.
let personalPronounsNominative = [ "ik", "jij", "hij", "ze", "we", "wij", "jullie", "zij" ];
let personalPronounsAccusative = [ "mij", "jou", "hem", "haar", "hen", "hun" ];
let demonstrativePronouns = [ "dit", "dat", "deze", "die" ];

// What to do with 'zijn', since it is also a verb?
let possessivePronouns = [ "mijn", "mijne", "jouw", "jouwe", "zijne", "hare", "ons", "onze", "hunne" ];
let quantifiers = [ "alle", "sommige", "sommigen", "allen", "weinig", "weinige", "weinigen", "veel", "vele", "velen", "geen", "beetje",
	"elke", "elk", "genoeg", "meer", "meest", "meeste", "meesten", "paar", "zoveel", "enkele", "enkelen", "zoveelste", "hoeveelste",
	"laatste", "laatsten", "ieder", "iedere", "allemaal", "alles", "al", "zekere", "ander", "andere", "gene", "enig", "enige", "verscheidene",
	"verschillende", "voldoende", "wat", "allerlei", "allerhande", "enerlei", "enerhande", "beiderlei", "beiderhande", "tweeërlei", "tweeërhande",
	"drieërlei", "drieërhande", "velerlei", "velerhande", "menigerlei", "menigerhande", "enigerlei", "enigerhande", "generlei", "generhande" ];
let reflexivePronouns = [ "mezelf", "mijzelf", "jezelf", "jouzelf", "zichzelf", "haarzelf", "hemzelf", "onszelf", "julliezelf",
	"henzelf", "hunzelf", "zich" ];
let reciprocalPronouns = [ "mekaar", "elkaar", "elkander", "mekander" ];
let indefinitePronouns = [ "iedereen", "ieder", "eenieder", "alleman", "allen", "alles", "iemand", "niemand", "iets",
	"niets", "menigeen" ];
let indefinitePronounsPossessive  = [ "ieders", "aller", "iedereens", "eenieders" ];

let interrogativePronouns = [ "welke", "welk", "wat", "wie", "wiens", "wier" ];
let interrogativeAdverbs = [ "hoe", "waarom", "waar", "hoezo", "wanneer", "hoeveel" ];
let pronominalAdverbs = [ "daaraan", "daarachter", "daaraf", "daarbij", "daarbinnen", "daarboven", "daarbuiten", "daardoor", "daardoorheen",
	"daarheen", "daarin", "daarjegens", "daarmede", "daarmee", "daarna", "daarnaar", "daarnaartoe", "daarnaast", "daarom", "daaromtrent",
	"daaronder", "daarop", "daarover", "daaroverheen", "daarrond", "daartegen", "daartoe", "daartussen", "daartussenuit", "daaruit", "daarvan",
	"daarvandaan", "daarvoor", "eraan", "erachter", "erachteraan", "eraf", "erbij", "erbinnen", "erboven", "erbuiten", "erdoor", "erdoorheen",
	"erheen", "erin", "erjegens", "ermede", "ermee", "erna", "ernaar", "ernaartoe", "ernaast", "erom", "eromtrent", "eronder", "eronderdoor",
	"erop", "eropaf", "eropuit", "erover", "eroverheen", "errond", "ertegen", "ertegenaan", "ertoe", "ertussen", "ertussenuit", "eruit", "ervan",
	"ervandaan", "ervandoor", "ervoor", "hieraan", "hierachter", "hieraf", "hierbij", "hierbinnen", "hierboven", "hierbuiten", "hierdoor",
	"hierdoorheen", "hierheen", "hierin", "hierjegens", "hierlangs", "hiermede", "hiermee", "hierna", "hiernaar", "hiernaartoe", "hiernaast",
	"hierom", "hieromheen", "hieromtrent", "hieronder", "hierop", "hierover", "hieroverheen", "hierrond", "hiertegen", "hiertoe", "hiertussen",
	"hiertussenuit", "hieruit", "hiervan", "hiervandaan", "hiervoor", "vandaan", "waaraan", "waarachter", "waaraf", "waarbij", "waarboven",
	"waarbuiten", "waardoor", "waardoorheen", "waarheen", "waarin", "waarjegens", "waarmede", "waarmee", "waarna", "waarnaar", "waarnaartoe",
	"waarnaast", "waaronder", "waarop", "waarover", "waaroverheen", "waarrond", "waartegen", "waartegenin", "waartoe", "waartussen",
	"waartussenuit", "waaruit", "waarvan", "waarvandaan", "waarvoor" ];
let locativeAdverbs = [ "daar", "hier", "ginder", "daarginds", "ginds", "ver", "veraf", "ergens", "nergens", "overal", "dichtbij",
	"nabij", "kortbij" ];
let filteredPassiveAuxiliaries = [ "word", "wordt", "werd", "werden", "ben", "bent", "is", "was", "waren" ];
let infinitivePassiveAuxiliaries = [ "worden", "zijn" ];
let otherAuxiliaries = [ "heb", "hebt", "heeft", "hebben", "hadden", "had", "kun", "kan", "kunt", "kunnen", "kon", "konden", "mag",
	"mogen", "mocht", "mochten", "dien", "dient", "dienen", "diende", "dienden", "moet", "moeten", "moest", "moesten", "ga", "gaat",
	"gaan", "ging", "gingen" ];

// 'Vóórkomen' (appear) is not included, because we don't want to filter out 'voorkómen' (prevent).
let copula = [ "blijken", "blijkt", "blijk", "bleek", "bleken", "gebleken", "dunken", "dunkt", "dunk", "dunkte", "dunkten",
	"gedunkt", "heet", "heten", "heette", "heetten", "geheten", "lijkt", "lijk", "lijken", "geleken", "leek", "leken", "schijnen",
	"schijn", "schijnt", "scheen", "schenen", "toescheen", "toeschijnt", "toeschijnen", "toeschijn", "toeschenen" ];

let prepositions = [ "à", "aan", "aangaande", "achter", "behalve", "behoudens", "beneden", "benevens", "benoorden", "benoordoosten", "benoordwesten",
	"beoosten", "betreffende", "bewesten", "bezijden", "bezuiden", "bezuidoosten", "bezuidwesten", "bij", "binnen", "blijkens", "boven", "bovenaan",
	"buiten", "circa", "conform", "contra", "cum", "dankzij", "door", "gedurende", "gezien", "in", "ingevolge", "inzake", "jegens", "krachtens",
	"langs", "luidens", "met", "middels", "mits", "na", "naar", "naast", "nabij", "namens", "nevens", "niettegenstaande", "nopens", "om",
	"omstreeks", "omtrent", "ondanks", "onder", "onderaan", "ongeacht", "onverminderd", "op", "over", "overeenkomstig", "per", "plus", "post",
	"richting", "rond", "rondom", "sedert", "sinds", "spijts", "staande", "te", "tegen", "tegenover", "ten", "ter", "tijdens", "tot", "tussen",
	"uit", "uitgezonderd", "van", "vanaf", "vanuit", "vanwege", "versus", "via", "vis-à-vis", "volgens", "voor", "voorbij", "wegens", "zijdens",
	"zonder" ];

// Many prepositional adverbs are already listed as preposition.
let prepositionalAdverbs = [ "af", "buiten", "door", "heen", "mee", "toe", "vandaan", "achterop", "onderin", "voorin", "bovenaan", "bovenop",
	"buitenop", "onderaan", "achteraan", "onderop", "binnenin", "tevoren", "erin", "daarnaast" ];

let coordinatingConjunctions = [ "en", "noch", "alsmede", "alsook", "maar", "doch", "of", "ofwel", "dan", "want", "dus" ];

/* 'Zowel' and 'als' are part of 'zowel...als', 'evenmin' is part of 'evenmin...als', 'zomin' is part of 'zomin...als',
 'hetzij' is part of 'hetzij...hetzij'. */
let correlativeConjunctions = [ "zowel", "als", "evenmin", "zomin", "hetzij" ];
let subordinatingConjunctions = [ "omdat", "doordat", "aangezien", "vermits", "dewijl", "dorodien", "naardien", "nademaal", "overmits",
	"wijl", "voordat", "eer", "eerdat", "aleer", "vooraleer", "alvorens", "tot", "totdat", "terwijl", "zolang", "zodra", "sinds", "sedert",
	"toen", "nu", "nadat", "zodat", "opdat", "teneinde", "indien", "ingeval", "tenware", "hoewel", "alhoewel", "ofschoon", "hoezeer",
	"behalve", "uitgezonderd", "zoverre", "zover", "naargelang", "naarmate", "alsof", "zoals", "evenals" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'states' are not included, because these words are also nouns.
let interviewVerbs = [ "zegt", "zei", "aldus", "vraagt", "vroeg", "denkt", "dacht", "stelt", "pleit", "pleitte" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [ "absoluut", "zeker", "ongetwijfeld", "sowieso", "onmiddelijk", "meteen", "inclusief",
	"direct", "ogenblikkelijk", "terstond", "namelijk", "natuurlijk", "vanzelfsprekend", "tegenwoordig", "gewoonlijk", "normaliter",
	"doorgaans", "werkelijk", "daadwerkelijk", "inderdaad", "uiteindelijk", "waarachtig", "oprecht", "bijna", "meestal", "misschien",
	"waarschijnlijk", "wellicht", "mogelijk", "vermoedelijk", "ongetwijfeld", "allicht", "aannemelijk", "oorspronkelijk", "aanvankelijk",
	"allereerst", "initieel", "eigenlijk", "feitelijk", "wezenlijk", "juist", "reeds", "alvast", "bijv.", "vaak", "dikwijls", "veelal",
	"geregeld", "menigmaal", "regelmatig", "veelvuldig", "eenvoudigweg", "simpelweg", "louter", "kortweg", "stomweg", "domweg", "zomaar",
	"eventueel", "mogelijkerwijs", "eens", "weleens", "nooit", "ooit", "anders", "momenteel", "thans", "incidenteel", "trouwens", "elders",
	"volgend", "recent", "onlangs", "recentelijk", "laatst", "zojuist", "relatief", "duidelijk", "overduidelijk", "klaarblijkelijk",
	"nadrukkelijk", "ogenschijnlijk", "duidelijk", "kennelijk", "schijnbaar", "alweer", "continu", "herhaaldelijk" ];

let intensifiers = [ "zeer", "erg", "redelijk", "flink", "beetje", "tikkeltje", "bijzonder", "ernstig", "enigszins",
	"hoe", "zo", "wat", "tamelijk", "nogal", "vrij", "genoeg", "behoorlijk", "hard", "zwaar", "heel", "reuze", "buitengewoon",
	"ontzettend", "vreselijk" ];

// These verbs convey little meaning.
let delexicalisedVerbs = [ "laten", "laat", "liet", "lieten", "komen", "kom", "komt", "kwam", "kwamen", "maken", "maakt",
	"maak", "maakte", "maakten", "doen", "doe", "doet", "deed", "deden" ];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
Keyword combinations containing these adjectives/adverbs are fine. */
let generalAdjectivesAdverbs = [ "nieuw", "nieuwe", "nieuwer", "nieuwere", "nieuwst", "nieuwste", "oud", "oude", "ouder", "oudere",
	"oudst", "oudste", "vorig", "vorige", "goed", "goede", "beter", "betere", "best", "beste", "groot", "grote", "groter", "grotere",
	"grootst", "grootste", "makkelijk", "makkelijke", "makkelijker", "makkelijkere", "makkelijkst", "makkelijste", "gemakkelijk",
	"gemakkelijke", "gemakkelijker", "gemakkelijkere", "gemakkelijkst", "gemakkelijste", "simpel", "simpele", "simpeler", "simpeler",
	"simpelst", "simpelste", "snel", "snelle", "sneller", "snellere", "snelst", "snelste", "ver", "verre", "verder", "verdere", "verst",
	"verste", "lang", "lange", "langer", "langere", "langst", "langste", "hard", "harde", "harder", "hardere", "hardst", "hardste",
	"weinig", "weinige", "minder", "mindere", "minst", "minste", "eigen", "laag", "lage", "lager", "lagere", "laagst", "laagste",
	"hoog", "hoge", "hoger", "hogere", "hoogst", "hoogste", "klein", "kleine", "kleiner", "kleinere", "kleinst", "kleinste", "kort",
	"korte", "korter", "kortere", "kortst", "kortste", "zekere", "herhaaldelijke", "directe", "ongeveer", "slecht", "slechte", "slechter",
	"slechtere", "slechtst", "slechtste", "zulke", "zulk", "zo'n", "zulks", "er", "extreem" ];

let interjections = [ "oh", "wauw", "hèhè", "hè", "hé", "au", "ai", "jaja", "welja", "jawel", "ssst", "heremijntijd", "hemeltjelief", "aha",
	"er", "foei", "hmm", "nou", "nee", "tja", "nja", "okido", "ho", "halt", "komaan", "komop", "verrek", "nietwaar", "brr", "oef",
	"ach", "och", "bah", "enfin", "afijn", "haha", "hihi", "hatsjie", "hatsjoe", "hm", "tring", "vroem", "boem", "hopla" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "ml", "cl", "dl", "l", "tl", "el", "mg", "g", "gr", "kg", "ca", "theel", "min", "sec", "uur"  ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
let vagueNouns = [ "ding", "dingen", "manier", "manieren", "item", "items", "keer", "maal", "procent", "geval", "aspect", "persoon",
	"personen", "deel" ];

// 'No' is already included in the quantifier list.
let miscellaneous = [ "niet", "wel", "ja", "nee", "neen", "oké", "oke", "okee", "ok", "niets", "zoiets", "%", "€" ];

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
		reciprocalPronouns: reciprocalPronouns,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, reciprocalPronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns,
			indefinitePronounsPossessive, interrogativePronouns, interrogativeAdverbs,
			pronominalAdverbs, locativeAdverbs, prepositionalAdverbs, filteredPassiveAuxiliaries, infinitivePassiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous ),
	};
};

