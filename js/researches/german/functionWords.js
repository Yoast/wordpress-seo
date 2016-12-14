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
	"deines", "deinen", "sein", "seine", "seinem", "seiner", "seines", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres",
	"unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer",
	"eures" ];

var quantifiers = [ "manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "alle", "aller", "alles",
	"allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "manch", "wenige", "weniger", "wenigen",
	"wenigem", "weniges", "wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig",
	"bisschen", "paar", "kein", "keines", "keinem", "keinen", "keine", "mehr", "mehrere", "nichts",
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

var prepositions = [ "a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "anfangs", "angelegentlich",
	"angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufgrund", "aufs", "aufseiten",
	"aus", "ausgangs", "ausgenommen", "ausschließlich", "ausschliesslich", "ausser", "außer", "außerhalb", "ausserhalb", "ausweislich",
	"bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra",
	"dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich",
	"entgegen", "entlang", "entsprechend", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber",
	"gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters",
	"im", "in", "infolge", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft",
	"lang", "längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels",
	"nach",	"nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich",
	"ob", "oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich",
	"samt", "seit", "seitens", "seitlich", "seitwärts", "seitwaerts", "statt", "südlich", "suedlich", "südöstlich", "suedoestlich",
	"südwestlich", "suedwestlich", "trotz", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers", "uebers", "um", "ums",
	"unbeschadet", "unerachtet", "unfern", "ungeachtet", "unter", "unterhalb", "unterm", "untern", "unters", "unweit", "vermittels",
	"vermittelst", "vermöge", "vermoege", "via", "voll", "vom", "von", "vonseiten", "vor", "vorbehaltlich", "wegen", "wider", "während",
	"waehrend", "zeit", "zu", "zufolge", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten",
	"zuwider", "zuzüglich",	"zuzueglich", "zwecks", "zwischen" ];

// Many coordinating conjunctions are already included in the transition words list.
var coordinatingConjunctions = [ "und", "oder", "als", "wie" ];

/*
'Entweder' is part of 'wntweder...oder', 'sowohl', 'auch' is part of 'sowohl als...auch', 'weder' and 'noch' are part of 'weder...noch',
 'nur' is part of 'nicht nur...sondern auch'.
 */
var correlativeConjunctions = [ "entweder", "sowohl", "auch", "weder", "noch", "nur" ];

// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
var subordinatingConjunctions = [ "nun", "so", "gleichwohl" ];

/*
These verbs are frequently used in interviews to indicate questions and answers. 'Frage' and 'fragen' are not included,
because those words are also nouns.
 */
var interviewVerbs = [ "sage", "sagst", "sagt", "sagen", "sagest", "saget", "sagte", "sagtest", "sagte", "sagten", "sagtet", "gesagt",
	"fragst", "fragt", "fragest", "fraget", "fragte", "fragtest", "fragten", "fragtet", "gefragt", "erkläre", "erklärst", "erklärt",
	"erklären", "erklaere", "erklaerst", "erklaert", "erklaeren", "erklärte", "erklärtest", "erklärte",	"erklärtet", "erklärten",
	"erklaerte", "erklaertest", "erklaerte", "erklaertet", "erklaerten", "denke", "denkst", "denkt", "denken", "denkest", "denket",
	"dachte", "dachtest", "dachten", "dachtet", "dächte", "dächtest", "dächten", "dächtet", "daechte", "daechtest", "daechten",
	"daechtet", "finde", "findest", "findet", "finden", "gefunden" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
var additionalTransitionWords = [ "etwa", "absolut", "unbedingt", "wieder", "definitiv", "bestimmt", "immer", "äußerst", "aeußerst",
	"höchst", "hoechst", "sofort", "augenblicklich", "umgehend", "direkt", "unmittelbar", "nämlich", "naemlich", "natürlich", "natuerlich",
	"besonders", "hauptsächlich", "hauptsaechlich", "jetzt", "eben", "heute", "heutzutage", "positiv", "eindeutig", "wirklich", "echt",
	"wahrhaft", "ehrlich", "aufrichtig", "wahrhaft", "wahrheitsgemäß", "treu", "letztlich", "einmalig", "unübertrefflich", "normalerweise",
	"gewöhnlich", "gewoehnlich", "üblicherweise", "ueblicherweise", "sonst", "fast", "nahezu", "beinahe", "knapp", "annähernd", "annaehernd",
	"geradezu", "ziemlich", "bald", "vielleicht", "wahrscheinlich", "wohl", "voraussichtlich",  "zugegeben", "ursprünglich", "insgesamt",
	"tatsächlich", "eigentlich", "wahrhaftig", "bereits", "schon", "oft", "häufig", "haeufig", "regelmäßig", "regelmaeßig", "gleichmäßig",
	"gleichmaeßig", "einfach", "einfach", "nur", "lediglich", "bloß", "bloss", "eben", "halt", "wahlweise", "eventuell", "manchmal",
	"teilweise", "nie", "niemals", "nimmer", "jemals", "allzeit", "irgendeinmal", "anders", "vorausgesetzt", "momentan", "gegenwärtig",
	"gegenwärtig", "nebenbei", "übrigens", "uebrigens", "anderswo", "woanders", "anderswohin", "anderorts", "besonders", "insbesondere",
	"namentlich", "sonderlich", "ausdrücklich", "ausdruecklich", "vollends", "kürzlich", "kuerzlich", "jüngst", "juengst", "unlängst",
	"unlaengst", "neuerdings", "neulich", "letztens", "neuerlich", "relativ", "verhältnismäßig", "verhaeltnismaessig", "deutlich", "klar",
	"eindeutig", "offenbar", "anscheinend", "genau" ];

var intensifiers = [ "sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz", "schampar",
	"schwer", "stief", "tierisch", "ungleich", "voll", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus" ];

// These verbs convey little meaning.
var delexicalisedVerbs = [ "geschienen", "meine", "meinst", "meint", "meinen", "meinest", "meinet", "meinte", "meintest", "meinten", "meintet",
	"gemeint", "tun", "machen" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
var generalAdjectivesAdverbs = [ "einerlei", "egal", "neu", "neue", "neuer", "neuen", "neues", "neuem", "neuerer", "neueren", "neuerem", "neueres",
	"neuere", "neuester", "neuster", "neuesten", "neusten", "neuestem", "neustem", "neuestes", "neustes", "neueste", "neuste", "alt",
	"alter", "alten", "altem", "altes", "alte", "ältere", "älteren", "älterer", "älteres", "ältester", "ältesten", "ältestem", "ältestes",
	"älteste", "aeltere", "aelteren", "aelterer", "aelteres", "aeltester", "aeltesten", "aeltestem", "aeltestes", "aelteste", "gut", "guter",
	"gutem", "guten", "gutes", "gute", "besserer", "besseren", "besserem", "besseres", "bester", "besten", "bestem", "bestes", "beste", "groß",
	"großer", "großen", "großem", "großes", "große", "großerer", "großerem", "großeren", "großeres", "großere", "großter", "großten",
	"großtem", "großtes", "großte", "gross", "grosser", "grossen", "grossem", "grosses", "grosse", "grosserer", "grosserem", "grosseren",
	"grosseres", "grossere", "grosster", "grossten", "grosstem", "grosstes", "grosste", "einfach", "einfacher", "einfachen", "einfachem",
	"einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachste", "einfachster",
	"einfachsten", "einfachstes", "einfachstem", "schnell", "schneller", "schnellen", "schnellem", "schnelles", "schnelle", "schnellere",
	"schnellerer", "schnelleren", "schnelleres", "schnellerem", "schnellster", "schnellste", "schnellsten", "schnellstem", "schnellstes",
	"weiter", "weit", "weiten", "weitem", "weites", "weiterer", "weiteren", "weiterem", "weiteres", "weitere", "weitester", "weitesten",
	"weitestem", "weitestes", "weiteste", "eigen", "eigener", "eigenen", "eigenes", "eigenem", "eigene", "eigenerer", "eignerer", "eigeneren",
	"eigneren", "eigenerem", "eignerem", "eigeneres", "eigneres", "eigenere", "eignere", "eigenster", "eigensten", "eigenstem", "eigenstes",
	"eigenste", "wenig", "weniger", "wenigen", "wenigem", "weniges", "wenigerer", "wenigeres", "wenigerem", "wenigeren", "wenigere",
	"wenigster", "wenigsten", "wenigstem", "wenigstes", "wenigste", "minderer", "minderen", "minderem", "mindere", "minderes", "mindester",
	"mindesten", "mindestes", "mindestem", "mindeste", "lang", "langer", "langen", "langem", "langes", "längerer", "längeren", "längerem",
	"längeres", "längere", "längster", "längsten", "längstem", "längstes", "längste", "laengerer", "laengeren", "laengerem",
	"laengeres", "laengere", "laengster", "laengsten", "laengstem", "laengstes", "laengste", "tief", "tiefer", "tiefen", "tiefem", "tiefes",
	"tiefe", "tieferer", "tieferen", "tieferem", "tieferes", "tiefere", "tiefster", "tiefsten", "tiefstem", "tiefste", "tiefstes", "hoch",
	"hoher", "hohen", "hohem", "hohes", "hohe", "höherer", "höhere", "höheren", "höherem", "höheres", "hoeherer", "hoehere", "hoeheren",
	"hoeherem", "hoeheres", "höchster", "höchste", "höchsten", "höchstem", "höchstes", "hoechster", "hoechste", "hoechsten", "hoechstem",
	"hoechstes", "regulär", "regulärer", "regulären", "regulärem", "reguläres", "reguläre", "regulaer", "regulaerer", "regulaeren",
	"regulaerem", "regulaeres", "regulaere", "regulärerer", "reguläreren", "regulärerem", "reguläreres", "regulärere", "regulaererer",
	"regulaereren", "regulaererem", "regulaereres", "regulaerere", "regulärster", "regulärsten", "regulärstem", "regulärstes", "regulärste",
	"regulaerster", "regulaersten", "regulaerstem", "regulaerstes", "regulaerste", "normal", "normaler", "normalen", "normalem", "normales",
	"normale", "normalerer", "normaleren", "normalerem", "normaleres", "normalere", "normalster", "normalsten", "normalstem", "normalstes",
	"normalste", "einfach", "einfacher", "einfachen", "einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem",
	"einfacheres", "einfachere", "einfachster", "einfachsten", "einfachstem", "einfachstes", "einfachste", "klein", "kleiner", "kleinen",
	"kleinem", "kleines", "kleine", "kleinerer", "kleineres", "kleineren", "kleinerem", "kleinere", "kleinster", "kleinsten", "kleinstem",
	"kleinstes", "kleinste", "winzig", "winziger", "winzigen", "winzigem", "winziges", "winzigerer", "winzigeren", "winzigerem", "winzigeres",
	"winzigere", "winzigster", "winzigsten", "winzigstem", "winzigste", "winzigstes", "sogenannt", "sogenannter", "sogenannten",
	"sogenanntem", "sogenanntes", "sogenannte", "kurz", "kurzer", "kurzen", "kurzem", "kurzes", "kurze", "kürzerer", "kürzeres", "kürzeren",
	"kürzerem", "kürzere", "kuerzerer", "kuerzeres", "kuerzeren", "kuerzerem", "kuerzere", "kürzester", "kürzesten", "kürzestem", "kürzestes",
	"kürzeste", "kuerzester", "kuerzesten", "kuerzestem", "kuerzestes", "kuerzeste", "wirklicher", "wirklichen", "wirklichem", "wirkliches",
	"wirkliche", "wirklicherer", "wirklicheren", "wirklicherem", "wirklicheres", "wirklichere", "wirklichster", "wirklichsten",
	"wirklichstes", "wirklichstem", "wirklichste", "eigentlich", "eigentlicher", "eigentlichen", "eigentlichem", "eigentliches", "eigentliche",
	"schön", "schöner", "schönen", "schönem", "schönes", "schöne", "schönerer", "schöneren", "schönerem", "schöneres", "schönere", "schönster",
	"schönsten", "schönstem", "schönstes", "schönste", "real", "realer", "realen", "realem", "reales", "realerer", "realeren", "realerem",
	"realeres", "realere", "realster", "realsten", "realstem", "realstes", "realste", "derselbe", "denselben", "demselben", "desselben",
	"dasselbe", "dieselbe", "derselben", "dieselben", "gleich", "gleicher", "gleichen", "gleichem", "gleiches", "gleiche", "gleicherer",
	"gleicheren", "gleicherem", "gleicheres", "gleichere", "gleichster", "gleichsten", "gleichstem", "gleichstes", "gleichste", "bestimmter",
	"bestimmten", "bestimmtem", "bestimmtes", "bestimmte", "bestimmtere", "bestimmterer", "bestimmterem", "bestimmteren", "bestimmteres",
	"bestimmtester", "bestimmtesten", "bestimmtestem", "bestimmtestes", "bestimmteste", "hauptsächlich", "hauptsaechlich", "überwiegend",
	"ueberwiegend", "zumeist", "meistens", "kürzlich", "kuerzlich", "großenteils", "grossenteils", "meistenteils", "gewöhnlich",
	"gewoehnlich", "häufig", "haeufig", "weithin", "ständig", "staendig", "laufend", "dauernd", "andauernd", "immerfort", "irgendwo",
	"ähnlicher", "ähnlichen", "ähnlichem", "ähnliches", "ähnliche", "ähnlich", "ähnlicherer", "ähnlicheren", "ähnlicherem", "ähnlicheres",
	"ähnlichere", "ähnlichster", "ähnlichsten", "ähnlichstem", "ähnlichstes", "ähnlichste", "schlecht", "schlechter", "schlechten",
	"schlechtem", "schlechtes", "schlechte", "schlechterer", "schlechteren", "schlechterem", "schlechteres", "schlechtere", "schlechtester",
	"schlechtesten", "schlechtestem", "schlechtestes", "schlechteste", "schlimm", "schlimmer", "schlimmen", "schlimmem", "schlimmes",
	"schlimme", "schlimmerer", "schlimmeren", "schlimmerem", "schlimmeres", "schlimmere", "schlimmster", "schlimmsten", "schlimmstem",
	"schlimmstes", "schlimmste", "toll", "toller", "tollen", "tollem", "tolles", "tolle", "tollerer", "tolleren", "tollerem", "tollere",
	"tolleres", "tollster", "tollsten", "tollstem", "tollstes", "tollste", "super", "mögliche", "möglicher", "mögliches", "möglichen",
	"möglichem", "möglich", "moegliche", "moeglicher", "moegliches", "moeglichen", "moeglichem", "moeglich", "nächsten" ];

var interjections = [  "ach", "aha", "oh", "au", "bäh", "baeh", "igitt", "huch", "hurra", "hoppla", "nanu", "oha", "olala", "pfui", "tja",
	"uups", "wow", "grr", "äh", "aeh", "ähm", "aeh", "öhm", "oehm", "hm", "mei", "nun", "tja", "mhm", "okay", "richtig", "eijeijeijei" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
var recipeWords = [ "g", "el", "es", "tl", "wg", "be", "bd", "cl", "dl", "dag", "do", "gl", "gr", "kg", "kl", "cb", "ccm", "l", "ms", "mg",
	"ml", "mi", "pk", "pr", "pp", "sc", "sp", "st", "sk", "ta", "tr", "cm", "mass" ];

var vagueNouns = [ "ding", "dinge", "dinges", "dinger", "dingern", "dingen", "sache", "sachen", "weise", "weisen", "wahrscheinlichkeit",
	"zeug", "zeuge", "zeuges", "zeugen", "mal", "einmal", "teil", "teile", "teiles", "teilen", "prozent", "prozents", "prozentes", "prozente",
	"prozenten", "beispiel", "beispiele", "beispieles", "beispiels", "beispielen", "aspekt", "aspekte", "aspektes", "aspekts", "aspekten",
	"idee", "ideen", "ahnung", "ahnungen", "thema", "themas", "themata", "themen", "fall", "falle", "falles", "falls", "fälle", "fällen",
	"faelle", "faellen" ];

var miscellaneous = [ "nix", "nixe", "nixes", "nixen", "usw.", "%", "nicht", "amen", "ja", "nein" ];

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
		relativePronouns: relativePronouns.concat( interrogativeProAdverbs ),
		passiveAuxiliaries: passiveAuxiliaries,
		transitionWords: transitionWords.concat( additionalTransitionWords ),
		all: articles.concat( numerals, demonstrativePronouns, possessivePronouns, reflexivePronouns, personalPronounsNominative,
			personalPronounsAccusative, relativePronouns, quantifiers, indefinitePronouns, interrogativeProAdverbs,
			pronominalAdverbs, locativeAdverbs, adverbialGenitives, passiveAuxiliaries, otherAuxiliaries, copula, prepositions,
			coordinatingConjunctions, correlativeConjunctions, subordinatingConjunctions, interviewVerbs, transitionWords,
			additionalTransitionWords, intensifiers, delexicalisedVerbs, interjections, generalAdjectivesAdverbs, recipeWords,
			vagueNouns, miscellaneous ),
	};
};
