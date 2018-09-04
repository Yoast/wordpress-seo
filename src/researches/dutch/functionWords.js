let transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the prominent words researcher.
 * @returns {Array} The array filled with exceptions.
 */

let articles = [ "de", "het", "een", "der", "des", "den" ];

let cardinalNumerals = [ "eén", "één", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien", "elf", "twaalf", "dertien",
	"veertien", "vijftien", "zestien", "zeventien", "achttien", "negentien", "twintig", "honderd", "honderden", "duizend", "duizenden", "miljoen",
	"miljoenen", "biljoen", "biljoenen" ];

let ordinalNumerals = [ "eerste", "tweede", "derde", "vierde", "vijfde", "zesde", "zevende", "achtste", "negende",
	"tiende", "elfde", "twaalfde", "dertiende", "veertiende", "vijftiende", "zestiende", "zeventiende",
	"achttiende", "negentiende", "twinstigste" ];

// 'Het' is already included in the list of articles.
let personalPronounsNominative = [ "ik", "je", "jij", "hij", "ze", "we", "wij", "jullie", "zij", "u", "ge", "gij", "men" ];
let personalPronounsAccusative = [ "mij", "jou", "hem", "haar", "hen", "hun", "uw" ];
let demonstrativePronouns = [ "dit", "dat", "deze", "die", "zelf" ];

// What to do with 'zijn', since it is also a verb?
let possessivePronouns = [ "mijn", "mijne", "jouw", "jouwe", "zijne", "hare", "ons", "onze", "hunne", "uwe", "elkaars", "elkanders" ];
let quantifiers = [ "alle", "sommige", "sommigen", "weinig", "weinige", "weinigen", "veel", "vele", "velen", "geen", "beetje",
	"elke", "elk", "genoeg", "meer", "meest", "meeste", "meesten", "paar", "zoveel", "enkele", "enkelen", "zoveelste", "hoeveelste",
	"laatste", "laatsten", "iedere", "allemaal", "zekere", "ander", "andere", "gene", "enig", "enige", "verscheidene",
	"verschillende", "voldoende", "allerlei", "allerhande", "enerlei", "enerhande", "beiderlei", "beiderhande", "tweeërlei", "tweeërhande",
	"drieërlei", "drieërhande", "velerlei", "velerhande", "menigerlei", "menigerhande", "enigerlei", "enigerhande", "generlei", "generhande" ];

let reflexivePronouns = [ "mezelf", "mijzelf", "jezelf", "jouzelf", "zichzelf", "haarzelf", "hemzelf", "onszelf", "julliezelf",
	"henzelf", "hunzelf", "uzelf", "zich" ];

let reciprocalPronouns = [ "mekaar", "elkaar", "elkander", "mekander" ];

let indefinitePronouns = [ "iedereen", "ieder", "eenieder", "alleman", "allen", "alles", "iemand", "niemand", "iets", "niets", "menigeen" ];

let indefinitePronounsPossessive  = [ "ieders", "aller", "iedereens", "eenieders" ];

let relativePronouns = [ "welke", "welk", "wat", "wie", "wiens", "wier" ];

let interrogativeProAdverbs = [ "hoe", "waarom", "waar", "hoezo", "hoeveel" ];

let pronominalAdverbs = [ "daaraan", "daarachter", "daaraf", "daarbij", "daarbinnen", "daarboven", "daarbuiten", "daardoorheen",
	"daarheen", "daarin", "daarjegens", "daarmede", "daarnaar", "daarnaartoe", "daaromtrent", "daaronder", "daarop", "daarover",
	"daaroverheen", "daarrond", "daartegen",  "daartussen", "daartussenuit", "daaruit", "daarvan", "daarvandaan", "eraan", "erachter",
	"erachteraan", "eraf", "erbij", "erbinnen", "erboven", "erbuiten", "erdoor", "erdoorheen", "erheen", "erin", "erjegens", "ermede",
	"ermee", "erna", "ernaar", "ernaartoe", "ernaast", "erom", "eromtrent", "eronder", "eronderdoor", "erop", "eropaf", "eropuit", "erover",
	"eroverheen", "errond", "ertegen", "ertegenaan", "ertoe", "ertussen", "ertussenuit", "eruit", "ervan", "ervandaan", "ervandoor", "ervoor",
	"hieraan", "hierachter", "hieraf", "hierbij", "hierbinnen", "hierboven", "hierbuiten", "hierdoor", "hierdoorheen", "hierheen", "hierin",
	"hierjegens", "hierlangs", "hiermede", "hiermee", "hierna", "hiernaar", "hiernaartoe", "hiernaast", "hieromheen", "hieromtrent",
	"hieronder", "hierop", "hierover", "hieroverheen", "hierrond", "hiertegen", "hiertoe", "hiertussen", "hiertussenuit", "hieruit", "hiervan",
	"hiervandaan", "hiervoor", "vandaan", "waaraan", "waarachter", "waaraf", "waarbij", "waarboven", "waarbuiten", "waardoorheen",
	"waarheen", "waarin", "waarjegens", "waarmede", "waarna", "waarnaar", "waarnaartoe", "waarnaast", "waarop", "waarover", "waaroverheen",
	"waarrond", "waartegen", "waartegenin", "waartoe", "waartussen", "waartussenuit", "waaruit", "waarvan", "waarvandaan", "waarvoor" ];

let locativeAdverbs = [ "daar", "hier", "ginder", "daarginds", "ginds", "ver", "veraf", "ergens", "nergens", "overal", "dichtbij",
	"kortbij" ];

let filteredPassiveAuxiliaries = [ "word", "wordt", "werd", "werden", "ben", "bent", "is", "was", "waren" ];

let passiveAuxiliariesInfinitive = [ "worden", "zijn" ];

let otherAuxiliaries = [ "heb", "hebt", "heeft", "hadden", "had", "kun", "kan", "kunt", "kon", "konden", "mag",
	"mocht", "mochten", "dien", "dient", "diende", "dienden", "moet", "moest", "moesten", "ga", "gaat",
	"ging", "gingen" ];

let otherAuxiliariesInfinitive = [ "hebben", "kunnen", "mogen", "dienen", "moeten", "gaan" ];

// 'Vóórkomen' (appear) is not included, because we don't want to filter out 'voorkómen' (prevent).
let copula = [ "blijkt", "blijk", "bleek", "bleken", "gebleken", "dunkt", "dunk", "dunkte", "dunkten",
	"gedunkt", "heet", "heette", "heetten", "geheten", "lijkt", "lijk", "geleken", "leek", "leken",
	"schijn", "schijnt", "scheen", "schenen", "toescheen", "toeschijnt", "toeschijn", "toeschenen" ];

let copulaInfinitive = [ "blijken", "dunken", "heten", "lijken", "schijnen", "toeschijnen" ];

let prepositions = [ "à", "aan", "aangaande", "achter", "behalve", "behoudens", "beneden", "benevens", "benoorden", "benoordoosten", "benoordwesten",
	"beoosten", "betreffende", "bewesten", "bezijden", "bezuiden", "bezuidoosten", "bezuidwesten", "bij", "binnen", "blijkens", "boven", "bovenaan",
	"buiten", "circa", "conform", "contra", "cum", "dankzij", "door", "gedurende", "gezien", "in", "ingevolge", "inzake", "jegens", "krachtens",
	"langs", "luidens", "met", "middels", "na", "naar", "naast", "nabij", "namens", "nevens", "niettegenstaande", "nopens", "om",
	"omstreeks", "omtrent", "onder", "onderaan", "ongeacht", "onverminderd", "op", "over", "overeenkomstig", "per", "plus", "post",
	"richting", "rond", "rondom", "spijts", "staande", "te", "tegen", "tegenover", "ten", "ter", "tijdens", "tot", "tussen",
	"uit", "van", "vanaf", "vanuit", "versus", "via", "vis-à-vis", "volgens", "voor", "voorbij", "wegens", "zijdens",
	"zonder" ];

// Many prepositional adverbs are already listed as preposition.
let prepositionalAdverbs = [ "af", "heen", "mee", "toe", "achterop", "onderin", "voorin", "bovenop",
	"buitenop", "achteraan", "onderop", "binnenin", "tevoren" ];

let coordinatingConjunctions = [ "en", "alsmede", "of", "ofwel", "en/of" ];

/* 'Zowel' and 'als' are part of 'zowel...als', 'evenmin' is part of 'evenmin...als', 'zomin' is part of 'zomin...als',
 'hetzij' is part of 'hetzij...hetzij'. */
let correlativeConjunctions = [ "zowel", "evenmin", "zomin", "hetzij" ];

let subordinatingConjunctions = [ "vermits", "dewijl", "dorodien", "naardien", "nademaal", "overmits", "wijl", "eer",
	"eerdat", "aleer", "vooraleer", "alvorens", "totdat", "zolang", "sinds", "sedert", "ingeval", "tenware", "alhoewel",
	"hoezeer", "uitgezonderd", "zoverre", "zover", "naargelang", "naarmate", "alsof" ];

// These verbs are frequently used in interviews to indicate questions and answers.
let interviewVerbs = [ "zegt", "zei", "vraagt", "vroeg", "denkt", "dacht", "stelt", "pleit", "pleitte" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
let additionalTransitionWords = [ "absoluut", "zeker", "ongetwijfeld", "sowieso", "onmiddelijk", "meteen", "inclusief",
	"direct", "ogenblikkelijk", "terstond", "natuurlijk", "vanzelfsprekend", "gewoonlijk", "normaliter",
	"doorgaans", "werkelijk", "daadwerkelijk", "inderdaad", "waarachtig", "oprecht", "bijna", "meestal", "misschien",
	"waarschijnlijk", "wellicht", "mogelijk", "vermoedelijk", "allicht", "aannemelijk", "oorspronkelijk", "aanvankelijk",
	"initieel", "eigenlijk", "feitelijk", "wezenlijk", "juist", "reeds", "alvast", "bijv.", "vaak", "dikwijls", "veelal",
	"geregeld", "menigmaal", "regelmatig", "veelvuldig", "eenvoudigweg", "simpelweg", "louter", "kortweg", "stomweg", "domweg", "zomaar",
	"eventueel", "mogelijkerwijs", "eens", "weleens", "nooit", "ooit", "anders", "momenteel", "thans", "incidenteel", "trouwens", "elders",
	"volgend", "recent", "onlangs", "recentelijk", "laatst", "zojuist", "relatief", "duidelijk", "overduidelijk", "klaarblijkelijk",
	"nadrukkelijk", "ogenschijnlijk", "kennelijk", "schijnbaar", "alweer", "continu", "herhaaldelijk", "nog", "steeds", "nu" ];

// 'vrij' is not included because it also means 'free'.
let intensifiers = [ "zeer", "erg", "redelijk", "flink", "tikkeltje", "bijzonder", "ernstig", "enigszins",
	"zo", "tamelijk", "nogal", "behoorlijk", "zwaar", "heel", "hele", "reuze", "buitengewoon",
	"ontzettend", "vreselijk" ];

// These verbs convey little meaning.
let delexicalizedVerbs = [ "laat", "liet", "lieten", "kom", "komt", "kwam", "kwamen", "maakt",
	"maak", "maakte", "maakten", "doe", "doet", "deed", "deden", "vindt", "vind", "vond", "vonden" ];

let delexicalizedVerbsInfinitive = [ "laten", "komen", "maken", "doen", "vinden" ];

/* These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
Keyword combinations containing these adjectives/adverbs are fine. */
let generalAdjectivesAdverbs = [ "nieuw", "nieuwe", "nieuwer", "nieuwere", "nieuwst", "nieuwste", "oud", "oude", "ouder", "oudere",
	"oudst", "oudste", "vorig", "vorige", "goed", "goede", "beter", "betere", "best", "beste", "groot", "grote", "groter", "grotere",
	"grootst", "grootste", "makkelijk", "makkelijke", "makkelijker", "makkelijkere", "makkelijkst", "makkelijste", "gemakkelijk",
	"gemakkelijke", "gemakkelijker", "gemakkelijkere", "gemakkelijkst", "gemakkelijste", "simpel", "simpele", "simpeler", "simpelere",
	"simpelst", "simpelste", "snel", "snelle", "sneller", "snellere", "snelst", "snelste", "verre", "verder", "verdere", "verst",
	"verste", "lang", "lange", "langer", "langere", "langst", "langste", "hard", "harde", "harder", "hardere", "hardst", "hardste",
	"minder", "mindere", "minst", "minste", "eigen", "laag", "lage", "lager", "lagere", "laagst", "laagste", "hoog", "hoge", "hoger",
	"hogere", "hoogst", "hoogste", "klein", "kleine", "kleiner", "kleinere", "kleinst", "kleinste", "kort", "korte", "korter", "kortere",
	"kortst", "kortste", "herhaaldelijke", "directe", "ongeveer", "slecht", "slechte", "slechter", "slechtere", "slechtst",
	"slechtste", "zulke", "zulk", "zo'n", "zulks", "er", "extreem", "extreme", "bijbehorende", "bijbehorend", "niet" ];

let interjections = [ "oh", "wauw", "hèhè", "hè", "hé", "au", "ai", "jaja", "welja", "jawel", "ssst", "heremijntijd", "hemeltjelief", "aha",
	"foei", "hmm", "nou", "nee", "tja", "nja", "okido", "ho", "halt", "komaan", "komop", "verrek", "nietwaar", "brr", "oef",
	"ach", "och", "bah", "enfin", "afijn", "haha", "hihi", "hatsjie", "hatsjoe", "hm", "tring", "vroem", "boem", "hopla" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
let recipeWords = [ "ml", "cl", "dl", "l", "tl", "el", "mg", "g", "gr", "kg", "ca", "theel", "min", "sec", "uur" ];

let timeWords = [ "seconde", "secondes", "seconden", "minuut", "minuten", "uur", "uren", "dag", "dagen", "week", "weken",
	"maand", "maanden", "jaar", "jaren", "vandaag", "morgen", "overmorgen", "gisteren", "eergisteren",
	"'s", "morgens", "avonds", "middags", "nachts" ];

let vagueNouns = [ "ding", "dingen", "manier", "manieren", "item", "items", "keer", "maal", "procent", "geval", "aspect", "persoon",
	"personen", "deel" ];

let miscellaneous = [ "wel", "ja", "neen", "oké", "oke", "okee", "ok", "zoiets", "€", "euro" ];

let titlesPreceding = [ "mevr", "dhr", "mr", "dr", "prof" ];

let titlesFollowing = [ "jr", "sr" ];

/**
 * Exports all function words concatenated, and specific word categories and category combinations
 * to be used as filters for the prominent words.
 *
 * @returns {Object} Dutch function words.
 */
export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtBeginning: [].concat( passiveAuxiliariesInfinitive, otherAuxiliariesInfinitive, copulaInfinitive, delexicalizedVerbsInfinitive ),

		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( ordinalNumerals, generalAdjectivesAdverbs ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, prepositions, coordinatingConjunctions, demonstrativePronouns, intensifiers, quantifiers ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( transitionWords, personalPronounsNominative, personalPronounsAccusative, reflexivePronouns, interjections,
			cardinalNumerals, filteredPassiveAuxiliaries, otherAuxiliaries, copula, interviewVerbs, delexicalizedVerbs, indefinitePronouns,
			correlativeConjunctions, subordinatingConjunctions, interrogativeProAdverbs, relativePronouns, locativeAdverbs, miscellaneous,
			prepositionalAdverbs, pronominalAdverbs, recipeWords, timeWords, vagueNouns, reciprocalPronouns, possessivePronouns ),

		cannotDirectlyPrecedePassiveParticiple: [].concat( articles, interrogativeProAdverbs, cardinalNumerals, possessivePronouns,
			reflexivePronouns, indefinitePronounsPossessive, copula, copulaInfinitive, prepositions ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, reciprocalPronouns,
			personalPronounsNominative, personalPronounsAccusative, quantifiers, indefinitePronouns,
			indefinitePronounsPossessive, relativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, prepositionalAdverbs, filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive,
			otherAuxiliaries, otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions,
			correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalizedVerbs, delexicalizedVerbsInfinitive,
			interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, titlesFollowing ),
	};
}

