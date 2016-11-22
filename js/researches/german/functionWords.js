var passiveAuxiliaries = require( "./passivevoice-german/auxiliaries.js" )();
var transitionWords = require( "./transitionWords.js" )().singleWords;

/**
 * Returns an array with exceptions for the keyword suggestion researcher.
 * @returns {Array} The array filled with exceptions.
 */

var articles = [ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines" ];

var numerals = [ "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf",
	"zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn",
	"zwanzig", "erste", "zweite", "dritte", "vierte", "fünfte", "fuenfte", "sechste", "siebte", "achte", "neunte",
	"zehnte", "elfte", "zwölfte", "zwoelfte", "dreizehnte", "vierzehnte", "fünfzehnte", "sechzehnte", "siebzehnte",
	"achtzehnte", "nehnzehnte", "zwanzigste", "hundert", "einhundert", "zweihundert", "zweihundert", "dreihundert",
	"vierhundert", "fünfhundert", "fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert",
	"tausend", "million", "milliarde", "billion", "billiarde" ];

var personalPronounsNominative = [ "ich", "du", "er", "sie", "es", "wir", "ihr", "sie" ];

var personalPronounsAccusative = [ "mich", "dich", "ihn", "sie", "es", "uns", "euch" ];

var personalPronounsDative = [ "mir", "dir", "ihm", "ihr", "uns", "euch", "ihnen" ];

var demonstrativePronouns = [ "denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses",
	"jene",	"jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches" ];

var possessivePronouns = [ "mein", "meine", "meinem", "meiner", "meines", "dein", "deine", "deinem", "deiner",
	"deines", "sein", "seine", "seinem", "seiner", "seines", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres",
	"unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer",
	"eures" ];

var quantifiers = [ "manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "alle", "aller", "alles",
	"allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "manch", "wenige", "weniger", "wenigen",
	"wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig",
	"bisschen", "paar", "kein", "keines", "keinem", "keinen", "keine", "mehrere", "nichts",
	"genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene", "verschiedener",
	"verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen", "verschiednem",
	"verschiednes", "art", "arten", "sorte", "sorten" ];

var reflexivePronouns = [ "mich", "mir", "dich", "dir", "sich", "uns", "euch" ];

// "Welch", "welcher", and "welches" are already included in the demonstrativePronouns.
var indefinitePronouns = [ "andere", "anderer", "anderem", "anderen", "anderes", "andren", "andern", "andrem",
	"anderm", "andre", "andrer", "andres", "beide", "beides", "beidem", "beider", "beiden", "etwas", "irgendetwas",
	"irgendein", "irgendeinen", "irgendeinem", "irgendeines", "irgendeine", "irgendeiner", "irgendwas", "irgendwessen",
	"irgendwer", "irgendwen", "irgendwem", "irgendwessen", "irgendwelche", "irgendwelcher", "irgendwelchem",
	"irgendwelchen", "irgendwelches", "irgendjemand", "irgendjemanden", "irgendjemandem", "irgendjemandes",
	"wer", "wen", "wem", "wessen", "was", "wessen", "welchen", "welchem", "jeder", "jedes", "jedem", "jeden",
	"jede", "jedweder", "jedweden", "jedwedem", "jedwedes", "jedwede", "jeglicher", "jeglichen", "jeglichem",
	"jegliches", "jegliche", "jedermann", "jedermanns", "jemand", "jemanden", "jemandem", "jemands",  "jemandes",
	"man", "meinesgleichen", "niemanden", "niemandem", "niemands", "niemandes", "niemand", "sämtlich", "saemtlich",
	"sämtlicher", "saemtlicher", "sämtlichen", "saemtlichen", "sämtlichem",	"saemtlichem", "sämtliches",
	"saemtliches", "sämtliche", "saemtliche", "solche", "solcher", "solchen", "solchem", "solches", "niemand",
	"niemanden", "niemandem", "niemandes", "niemands", "nichts", "jeglicher", "jeglichen", 	"jeglichem", "jegliches",
	"jegliche", "zweiter" ];

var relativePronouns = [ "dessen", "deren", "derer", "denen", "wes" ];

var interrogativeProAdverbs =  [ "warum", "wie", "wo", "woher", "wohin" ];

var pronominalAdverbs = [ "dabei", "dadurch", "dafür", "dafuer", "dagegen", "dahinter", "damit", "danach", "daneben",
	"daran", "darauf", "daraus", "darin", "darum", "darunter", "darüber", "darueber", "davon", "davor", "dazu",
	"dazwischen", "hieran",	"hierauf", "hieraus", "hierbei", "hierdurch", "hierfuer", "hierfür", "hiergegen",
	"hierhinter", "hierin",	"hiermit", "hiernach", "hierum", "hierunter", "hierueber", "hierüber", "hiervor",
	"hierzu", "hierzwischen", "hierneben", "hiervon", "wobei", "wodurch", "worin", "worauf", "wobei", "wofür", "wofuer",
	"wogegen", "wohinter", "womit", "wonach", "woneben", "woran", "worauf", "woraus", "worin",	"worum", "worunter",
	"worüber", "worueber", "wovon", "wovor", "wozu", "wozwischen" ];

var locativeAdverbs = [ "da", "hier", "dorthin", "hierher", "whence", "dorther", "daher" ];

var adverbialGenitives = [ "allenfalls", "keinesfalls", "anderenfalls", "andernfalls", "andrenfalls",
	"äußerstenfalls", "bejahendenfalls", "bestenfalls", "ebenfalls", "eintretendenfalls", "entgegengesetztenfalls",
	"erforderlichenfalls", "gegebenenfalls", "geringstenfalls", "gleichfalls", "günstigenfalls", "günstigstenfalls",
	"höchstenfalls", "jedenfalls", "möglichenfalls", "notfalls", "nötigenfalls", "notwendigenfalls",
	"schlimmstenfalls", "vorkommendenfalls", "widrigenfalls", "zutreffendenfalls", "angesichts", "morgens", "mittags",
	"abends", "nachts", "keineswegs", "durchwegs", "geradenwegs", "geradeswegs", "geradewegs", "gradenwegs",
	"halbwegs", "mittwegs", "unterwegs" ];

var otherAuxiliaries = [ "habe", "hast", "hat", "haben", "habt", "habest", "habet", "hatte", "hattest", "hatten",
	"hätte", "haette", "hättest", "haettest", "hätten", "haetten", "haettet", "hättet", "hab", "bin", "bist", "ist", "sind",
	"sein", "sei", "seiest", "seien", "seiet", "war", "warst", "waren", "wart", "wäre", "waere", "wärest", "waerest",
	"wärst", "waerst", "wären", "waeren", "wäret", "waeret", "wärt", "waert", "seid", "darf",  "darfst", "dürfen", "duerfen",
	"dürft", "duerft", "dürfe", "duerfe", "dürfest", "duerfest", "dürfet", "duerfet", "durfte", "durftest", "durften",
	"durftet", "dürfte", "duerfte", "dürftest", "duerftest", "dürften", "duerften", "dürftet", "duerftet", "kann", "kannst",
	"können", "koennen", "könnt", "koennt", "könne", "koenne", "könnest", "koennest", "könnet", "koennet", "konnte",
	"konntest", "konnten", "konntet", "könnte", "koennte", "könntest", "koenntest", "könnten", "koennten", "könntet",
	"koenntet", "mag", "magst", "mögen", "moegen", "mögt", "moegt", "möge", "moege", "mögest", "moegest", "möget", "moeget",
	"mochte", "mochtest", "mochten", "mochtet", "möchte", "moechte", "möchtest", "moechtest", "möchten", "moechten",
	"möchtet", "moechtet", "muss", "muß", "musst", "mußt", "müssen", "muessen", "müsst", "muesst", "müßt", "mueßt", "müsse",
	"muesse", "müssest", "muessest", "müsset", "muesset", "musste", "mußte", "musstest", "mußtest", "mussten", "mußten",
	"musstet", "mußtet", "müsste", "muesste", "müßte", "mueßte", "müsstest", "muesstest", "müßtest", "mueßtest", "müssten",
	"muessten", "müßten", "mueßten", "müsstet", "muesstet", "müßtet", "mueßtet", "soll", "sollst", "sollen", "sollt",
	"solle", "sollest", "sollet", "sollte", "solltest", "sollten", "solltet", "will", "willst", "wollen", "wollt", "wolle",
	"wollest", "wollet", "wollte", "wolltest", "wollten", "wolltet", "lasse", "lässt", "laesst", "läßt", "laeßt", "lassen",
	"lasst", "laßt", "lassest", "lasset", "ließ", "ließest", "ließt", "ließen", "ließe", "ließet", "liess", "liessest",
	"liesst", "liessen", "liesse", "liesset" ];

// Forms from 'aussehen' with two parts, like 'sehe aus', are not included, because we remove words on an single word basis.
var copula = [ "bleibe", "bleibst", "bleibt", "bleiben", "bleibest", "bleibet", "blieb", "bliebst", "bliebt", "blieben",
	"bliebe", "bliebest", "bliebet", "heiße", "heißt", "heißen", "heißest", "heißet", "heisse", "heisst", "heissen",
	"heissest", "heisset", "hieß", "hießest", "hießt", "hießen", "hieße", "hießet", "hiess", "hiessest", "hiesst", "hiessen",
	"hiesse", "hiesset", "gelte", "giltst", "gilt", "gelten", "geltet", "gelte", "geltest", "galt", "galtest", "galtst",
	"galten", "galtet", "gälte", "gaelte", "gölte", "goelte", "gältest", "gaeltest", "göltest", "goeltest", "gälten",
	"gaelten", "gölten", "goelten", "gältet", "gaeltet", "göltet", "goeltet", "aussehe", "aussiehst", "aussieht", "aussehen",
	"ausseht", "aussehest", "aussehet", "aussah", "aussahst", "aussah", "aussahen", "aussaht", "aussähe", "aussaehe",
	"aussähest", "aussaehest", "aussähst", "aussaehst", "aussähet", "aussaehet", "aussäht", "aussaeht", "aussähen",
	"aussaehen", "scheine", "scheinst", "scheint", "scheinen", "scheinest", "scheinet", "schien", "schienst", "schienen",
	"schient", "schiene", "schienest", "schienet", "erscheine", "erscheinst", "erscheint", "erscheinen", "erscheinest",
	"erscheinet", "erschien", "erschienst", "erschienen", "erschient", "erschiene", "erschienest", "erschienet" ];

var prepositions = [ "a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "an", "anfangs", "angelegentlich",
	"angesichts", "anhand", "anlässlich", "anlaesslich", "anstatt", "anstelle", "auf", "aufgrund", "aus", "ausgenommen",
	"ausschließlich", "ausschliesslich", "ausser", "außer", "außerhalb", "ausserhalb", "bar", "behufs", "bei", "betreffs",
	"bezüglich", "bezueglich", "binnen", "bis", "dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingedenk",
	"einschließlich", "einschliesslich", "entgegen", "entlang", "entsprechend", "exklusive", "fern", "fernab", "frei",
	"fuer", "für", "gegen", "gegenüber", "gegenueber", "gelegentlich", "gemäß", "gemaeß", "getreu", "gleich", "halber",
	"hinsichtlich", "hinter", "in", "infolge", "inklusive", "inmitten", "innerhalb", "je", "jenseits", "kontra", "kraft",
	"lang", "längs", "laengs", "laut", "links", "mangels", "minus", "mit", "mitsamt", "mittels", "nach", "nächst", "naechst",
	"nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich", "ob",
	"oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich",
	"samt", "seit", "seitens", "seitlich", "statt", "südlich", "suedlich", "südöstlich", "suedoestlich", "südwestlich",
	"suedwestlich", "trotz", "über", "ueber", "um", "unbeschadet", "unfern", "ungeachtet", "unter", "unterhalb", "unweit",
	"vermittels", "vermöge", "vermoege", "voll", "von", "vor", "vorbehaltlich", "wegen", "wider", "während", "waehrend",
	"zeit", "zu", "zufolge", "zugunsten", "zuliebe", "zusätzlich", "zusaetzlich", "zuungunsten", "zuwider", "zuzüglich",
	"zuzueglich", "zwecks", "zwischen" ];

// Many prepositional adverbs are already listed as preposition.
var prepositionalAdverbs = [ "back", "within", "forward", "backward", "ahead" ];

var coordinatingConjunctions = [ "so", "and", "nor", "but", "or", "yet", "for" ];

// 'Rather' is part of 'rather...than', 'sooner' is part of 'no sooner...than', 'just' is part of 'just as...so',
// 'Only' is part of 'not only...but also'.
var correlativeConjunctions = [ "rather", "sooner", "just", "only" ];
var subordinatingConjunctions = [ "after", "although", "when", "as", "if", "though", "because", "before", "even", "since", "unless",
	"whereas", "while" ];

// These verbs are frequently used in interviews to indicate questions and answers.
// 'Claim','claims', 'state' and 'stated' are not included, because these words are also nouns.
var interviewVerbs = [ "say", "says", "said", "saying", "claimed", "ask", "asks", "asked", "asking", "stated", "stating",
	"explain", "explains", "explained", "think", "thinks" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = [ "and", "or", "about", "absolutely", "again", "definitely", "eternally", "expressively",
	"expressly", "extremely", "immediately", "including", "instantly", "namely", "naturally", "next", "notably", "now", "nowadays",
	"ordinarily", "positively", "truly", "ultimately", "uniquely", "usually", "almost", "first", "second", "third", "maybe",
	"probably", "granted", "initially", "overall", "too", "actually", "already", "e.g", "i.e", "often", "regularly", "simply",
	"optionally", "perhaps", "sometimes", "likely", "never", "ever", "else", "inasmuch", "provided", "currently", "incidentally",
	"elsewhere", "following", "particular", "recently", "relatively", "f.i", "clearly", "apparently" ];

var intensifiers = [ "highly", "very", "really", "extremely", "absolutely", "completely", "totally", "utterly", "quite",
	"somewhat", "seriously", "fairly", "fully", "amazingly" ];

// These verbs convey little meaning. 'Show', 'shows', 'uses', "meaning" are not included, because these words could be relevant nouns.
var delexicalisedVerbs = [ "seem", "seems", "seemed", "seeming", "let", "let's", "lets", "letting", "make", "making", "makes",
	"made", "want", "showing", "showed", "shown", "go", "goes", "going", "went", "gone", "take", "takes", "took", "taken", "set", "sets",
	"setting", "put", "puts", "putting", "use", "using", "used", "try", "tries", "tried", "trying", "mean", "means", "meant",
	"called", "based", "add", "adds", "adding", "added", "contain", "contains", "containing", "contained" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Key word combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = [ "new", "newer", "newest", "old", "older", "oldest", "previous", "good", "well", "better", "best",
	"big", "bigger", "biggest", "easy", "easier", "easiest", "fast", "faster", "fastest", "far", "hard", "harder", "hardest",
	"least", "own", "large", "larger", "largest", "long", "longer", "longest", "low", "lower", "lowest", "high", "higher",
	"highest", "regular", "simple", "simpler", "simplest", "small", "smaller", "smallest", "tiny", "tinier", "tiniest",
	"short", "shorter", "shortest", "main", "actual", "nice", "nicer", "nicest", "real", "same", "able", "certain", "usual",
	"so-called", "mainly", "mostly", "recent", "anymore", "complete", "lately", "possible", "commonly", "constantly",
	"continually", "directly", "easily", "nearly", "slightly", "somewhere", "estimated", "latest", "different", "similar",
	"widely", "bad", "worse", "worst", "great" ];

var generalAdjectivesAdverbs = [ "einerlei", "egal" ]

var interjections = [ "oh", "wow", "tut-tut", "tsk-tsk", "ugh", "whew", "phew", "yeah", "yea", "shh", "oops", "ouch", "aha",
	"yikes" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = [ "tbs", "tbsp", "spk", "lb", "qt", "pk", "bu", "oz", "pt", "mod", "doz", "hr", "f.g", "ml", "dl", "cl",
	"l", "mg", "g", "kg", "quart" ];

// 'People' should only be removed in combination with 'some', 'many' and 'few' (and is therefore not yet included in the list below).
var vagueNouns = [ "thing", "things", "way", "ways", "matter", "case", "likelihood", "ones", "piece", "pieces", "stuff", "times",
	"part", "parts", "percent", "instance", "instances", "aspect", "aspects", "item", "items", "people", "idea", "theme",
	"person", "percent" ];

// 'No' is already included in the quantifier list.
var miscellaneous = [ "not", "yes", "rid", "sure", "top", "bottom", "ok", "okay", "amen", "aka", "%" ];

var miscellaneous = [ "nix", "nixe", "nixes", "nixen" ];


module.exports = function() {
	return {
		articles: articles,
		personalPronouns: personalPronounsNominative.concat( personalPronounsAccusative, personalPronounsDative,
			possessivePronouns ),
		prepositions: prepositions,
		demonstrativePronouns: demonstrativePronouns,
		conjunctions: coordinatingConjunctions.concat( subordinatingConjunctions ),
		verbs: passiveAuxiliaries.concat( otherAuxiliaries, copula, interviewVerbs, delexicalisedVerbs ),
		quantifiers: quantifiers,
		relativePronouns: interrogativeDeterminers.concat( interrogativePronouns, interrogativeProAdverbs ),
		passiveAuxiliaries: passiveAuxiliaries,
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns,
			interrogativeDeterminers, interrogativePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, prepositionalAdverbs, passiveAuxiliaries,
			otherAuxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs,
			transitionWords, additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs,
			recipeWords, vagueNouns, miscellaneous ),
	};
};
