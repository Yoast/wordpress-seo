import passiveVoiceAuxiliaries, { infinitiveAuxiliaries as passiveAuxiliariesInfinitive } from "./internal/passiveVoiceAuxiliaries.js";
const filteredPassiveAuxiliaries = passiveVoiceAuxiliaries.filteredAuxiliaries;
import { singleWords as transitionWords } from "./transitionWords.js";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

const articles = [ "das", "dem", "den", "der", "des", "die", "ein", "eine", "einem", "einen", "einer", "eines" ];

const cardinalNumerals = [ "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf",
	"zwoelf", "dreizehn", "vierzehn", "fünfzehn", "fuenfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn",
	"zwanzig", "hundert", "einhundert", "zweihundert", "dreihundert", "vierhundert", "fünfhundert",
	"fuenfhundert", "sechshundert", "siebenhundert", "achthundert", "neunhundert", "tausend",
	"million", "milliarde", "billion", "billiarde" ];

const ordinalNumerals = [ "erste", "erster", "ersten", "erstem", "erstes", "zweite", "zweites", "zweiter", "zweitem", "zweiten",
	"dritte", "dritter", "drittes", "dritten", "drittem", "vierter", "vierten", "viertem", "viertes", "vierte",
	"fünfte", "fünfter", "fünftes", "fünften", "fünftem", "fuenfte", "fuenfter", "fuenftem", "fuenften", "fuenftes",
	"sechste", "sechster", "sechstes", "sechsten", "sechstem", "siebte", "siebter", "siebten", "siebtem", "siebtes",
	"achte", "achter", "achten", "achtem", "achtes", "neunte", "neunter", "neuntes", "neunten", "neuntem", "zehnte",
	"zehnter", "zehnten", "zehntem", "zehntes", "elfte", "elfter", "elftes", "elften", "elftem", "zwölfte", "zwölfter",
	"zwölften", "zwölftem", "zwölftes", "zwoelfte", "zwoelfter", "zwoelften", "zwoelftem", "zwoelftes", "dreizehnte",
	"dreizehnter", "dreizehntes", "dreizehnten", "dreizehntem", "vierzehnte", "vierzehnter", "vierzehntes", "vierzehnten",
	"vierzehntem", "fünfzehnte", "fünfzehnten", "fünfzehntem", "fünfzehnter", "fünfzehntes", "fuenfzehnte", "fuenfzehnten",
	"fuenfzehntem", "fuenfzehnter", "fuenfzehntes", "sechzehnte", "sechzehnter", "sechzehnten", "sechzehntes", "sechzehntem",
	"siebzehnte", "siebzehnter", "siebzehntes", "siebzehntem", "siebzehnten", "achtzehnter", "achtzehnten", "achtzehntem",
	"achtzehntes", "achtzehnte", "nehnzehnte", "nehnzehnter", "nehnzehntem", "nehnzehnten", "nehnzehntes", "zwanzigste",
	"zwanzigster", "zwanzigstem", "zwanzigsten", "zwanzigstes" ];

const personalPronounsNominative = [ "ich", "du", "er", "sie", "es", "wir", "ihr" ];

const personalPronounsAccusative = [ "mich", "dich", "ihn", "uns", "euch" ];

const personalPronounsDative = [ "mir", "dir", "ihm", "ihnen" ];

const demonstrativePronouns = [ "denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses",
	"jene", "jenem", "jenen", "jener", "jenes", "welch", "welcher", "welches", "derjenige", "desjenigen", "demjenigen",
	"denjenigen", "diejenige", "derjenigen", "dasjenige", "diejenigen" ];

const possessivePronouns = [ "mein", "meine", "meinem", "meiner", "meines", "meinen", "dein", "deine", "deinem", "deiner",
	"deines", "deinen", "sein", "seine", "seinem", "seiner", "seines", "ihre", "ihrem", "ihren", "ihrer", "ihres",
	"unser", "unsere", "unserem", "unseren", "unserer", "unseres", "euer", "eure", "eurem", "euren", "eurer",
	"eures", "einanders" ];

const quantifiers = [ "manche", "manch", "viele", "viel", "vieler", "vielen", "vielem", "all", "alle", "aller", "alles",
	"allen", "allem", "allerlei", "solcherlei", "einige", "etliche", "wenige", "weniger", "wenigen", "wenigem", "weniges",
	"wenig", "wenigerer", "wenigeren", "wenigerem", "wenigere", "wenigeres", "wenig", "bisschen", "paar", "kein", "keines",
	"keinem", "keinen", "keine", "mehr", "genug", "mehrere", "mehrerer", "mehreren", "mehrerem", "mehreres", "verschiedene",
	"verschiedener", "verschiedenen", "verschiedenem", "verschiedenes", "verschiedne", "verschiedner", "verschiednen",
	"verschiednem", "verschiednes", "art", "arten", "sorte", "sorten" ];

const reflexivePronouns = [ "sich" ];

const reciprocalPronouns = [ "einander" ];

// "Welch", "welcher", and "welches" are already included in the demonstrativePronouns.
const indefinitePronouns = [ "andere", "anderer", "anderem", "anderen", "anderes", "andren", "andern", "andrem",
	"anderm", "andre", "andrer", "andres", "beide", "beides", "beidem", "beider", "beiden", "etwas", "irgendetwas",
	"irgendein", "irgendeinen", "irgendeinem", "irgendeines", "irgendeine", "irgendeiner", "irgendwas", "irgendwessen",
	"irgendwer", "irgendwen", "irgendwem", "irgendwelche", "irgendwelcher", "irgendwelchem", "irgendwelchen", "irgendwelches",
	"irgendjemand", "irgendjemanden", "irgendjemandem", "irgendjemandes", "irgendwie", "wer", "wen", "wem", "wessen", "was",
	"welchen", "welchem", "welche", "jeder", "jedes", "jedem", "jeden", "jede", "jedweder", "jedweden", "jedwedem",
	"jedwedes", "jedwede", "jeglicher", "jeglichen", "jeglichem", "jegliches", "jegliche", "jedermann", "jedermanns", "jemand",
	"jemanden", "jemandem", "jemands", "jemandes", "man", "meinesgleichen", "sämtlich", "saemtlich", "sämtlicher", "saemtlicher",
	"sämtlichen", "saemtlichen", "sämtlichem", "saemtlichem", "sämtliches", "saemtliches", "sämtliche", "saemtliche", "solche",
	"solcher", "solchen", "solchem", "solches", "niemand", "niemanden", "niemandem", "niemandes", "niemands", "nichts", "zweiter" ];

const interrogativeProAdverbs = [ "warum", "wie", "wo", "woher", "wohin", "wann" ];

const pronominalAdverbs = [ "dahinter", "damit", "daneben", "daran", "daraus", "darin", "darunter", "darüber", "darueber",
	"davon", "dazwischen", "hieran", "hierauf", "hieraus", "hierbei", "hierfuer", "hierfür", "hiergegen", "hierhinter",
	"hierin", "hiermit", "hiernach", "hierum", "hierunter", "hierueber", "hierüber", "hiervor", "hierzwischen", "hierneben",
	"hiervon", "wodurch", "wofür", "wofuer", "wogegen", "wohinter", "womit", "wonach", "woneben", "woran", "worauf", "woraus",
	"worin", "worum", "worunter", "worüber", "worueber", "wovon", "wovor", "wozu", "wozwischen" ];

const locativeAdverbs = [ "hier", "dorthin", "hierher", "dorther" ];

const adverbialGenitives = [ "allenfalls", "keinesfalls", "anderenfalls", "andernfalls", "andrenfalls",
	"äußerstenfalls", "bejahendenfalls", "bestenfalls", "eintretendenfalls", "entgegengesetztenfalls",
	"erforderlichenfalls", "gegebenenfalls", "geringstenfalls", "gleichfalls", "günstigenfalls", "günstigstenfalls",
	"höchstenfalls", "möglichenfalls", "notfalls", "nötigenfalls", "notwendigenfalls",
	"schlimmstenfalls", "vorkommendenfalls", "zutreffendenfalls", "keineswegs", "durchwegs", "geradenwegs", "geradeswegs",
	"geradewegs", "gradenwegs", "halbwegs", "mittwegs", "unterwegs" ];

const otherAuxiliaries = [ "habe", "hast", "hat", "habt", "habest", "habet", "hatte", "hattest", "hatten", "hätte", "haette",
	"hättest", "haettest", "hätten", "haetten", "haettet", "hättet", "hab", "bin", "bist", "ist", "sind", "sei", "seiest",
	"seien", "seiet", "war", "warst", "waren", "wart", "wäre", "waere", "wärest", "waerest", "wärst", "waerst", "wären",
	"waeren", "wäret", "waeret", "wärt", "waert", "seid", "darf", "darfst", "dürft", "duerft", "dürfe", "duerfe", "dürfest",
	"duerfest", "dürfet", "duerfet", "durfte", "durftest", "durften", "durftet", "dürfte", "duerfte", "dürftest", "duerftest",
	"dürften", "duerften", "dürftet", "duerftet", "kann", "kannst", "könnt", "koennt", "könne", "koenne", "könnest", "koennest",
	"könnet", "koennet", "konnte", "konntest", "konnten", "konntet", "könnte", "koennte", "könntest", "koenntest", "könnten",
	"koennten", "könntet", "koenntet", "mag", "magst", "mögt", "moegt", "möge", "moege", "mögest", "moegest", "möget", "moeget",
	"mochte", "mochtest", "mochten", "mochtet", "möchte", "moechte", "möchtest", "moechtest", "möchten", "moechten", "möchtet",
	"moechtet", "muss", "muß", "musst", "mußt", "müsst", "muesst", "müßt", "mueßt", "müsse", "muesse", "müssest", "muessest",
	"müsset", "muesset", "musste", "mußte", "musstest", "mußtest", "mussten", "mußten", "musstet", "mußtet", "müsste", "muesste",
	"müßte", "mueßte", "müsstest", "muesstest", "müßtest", "mueßtest", "müssten", "muessten", "müßten", "mueßten", "müsstet",
	"muesstet", "müßtet", "mueßtet", "soll", "sollst", "sollt", "solle", "sollest", "sollet", "sollte", "solltest", "sollten",
	"solltet", "will", "willst", "wollt", "wolle", "wollest", "wollet", "wollte", "wolltest", "wollten", "wolltet", "lasse",
	"lässt", "laesst", "läßt", "laeßt", "lasst", "laßt", "lassest", "lasset", "ließ", "ließest", "ließt", "ließen", "ließe",
	"ließet", "liess", "liessest", "liesst", "liessen", "liesse", "liesset" ];

const otherAuxiliariesInfinitive = [ "haben", "dürfen", "duerfen", "können", "koennen", "mögen", "moegen", "müssen", "muessen",
	"sollen", "wollen", "lassen" ];

// Forms from 'aussehen' with two parts, like 'sehe aus', are not included, because we remove words on a single word basis.
const copula = [ "bleibe", "bleibst", "bleibt", "bleibest", "bleibet", "blieb", "bliebst", "bliebt", "blieben", "bliebe",
	"bliebest", "bliebet", "heiße", "heißt", "heißest", "heißet", "heisse", "heisst", "heissest", "heisset", "hieß", "hießest",
	"hießt", "hießen", "hieße", "hießet", "hiess", "hiessest", "hiesst", "hiessen", "hiesse", "hiesset", "giltst",
	"gilt", "geltet", "gelte", "geltest", "galt", "galtest", "galtst", "galten", "galtet", "gälte", "gaelte", "gölte", "goelte",
	"gältest", "gaeltest", "göltest", "goeltest", "gälten", "gaelten", "gölten", "goelten", "gältet", "gaeltet", "göltet",
	"goeltet", "aussehe", "aussiehst", "aussieht", "ausseht", "aussehest", "aussehet", "aussah", "aussahst", "aussahen",
	"aussaht", "aussähe", "aussaehe", "aussähest", "aussaehest", "aussähst", "aussaehst", "aussähet", "aussaehet", "aussäht",
	"aussaeht", "aussähen", "aussaehen", "scheine", "scheinst", "scheint", "scheinest", "scheinet", "schien", "schienst", "schienen",
	"schient", "schiene", "schienest", "schienet", "erscheine", "erscheinst", "erscheint", "erscheinest",
	"erscheinet", "erschien", "erschienst", "erschienen", "erschient", "erschiene", "erschienest", "erschienet" ];

const copulaInfinitive = [ "bleiben", "heißen", "heissen", "gelten", "aussehen", "scheinen", "erscheinen" ];

const prepositions = [ "a", "à", "ab", "abseits", "abzüglich", "abzueglich", "als", "am", "an", "angelegentlich",
	"angesichts", "anhand", "anlässlich", "anlaesslich", "ans", "anstatt", "anstelle", "auf", "aufs", "aufseiten",
	"aus", "ausgangs", "ausschließlich", "ausschliesslich", "außerhalb", "ausserhalb", "ausweislich",
	"bar", "behufs", "bei", "beidseits", "beiderseits", "beim", "betreffs", "bezüglich", "bezueglich", "binnen", "bis", "contra",
	"dank", "diesseits", "durch", "einbezüglich", "einbezueglich", "eingangs", "eingedenk", "einschließlich", "einschliesslich",
	"entgegen", "entlang", "exklusive", "fern", "fernab", "fuer", "für", "fuers", "fürs", "gegen", "gegenüber",
	"gegenueber", "gelegentlich", "gemäß", "gemaeß", "gen", "getreu", "gleich", "halber", "hinsichtlich", "hinter", "hinterm", "hinters",
	"im", "in", "inklusive", "inmitten", "innerhalb", "innert", "ins", "je", "jenseits", "kontra", "kraft",
	"längs", "laengs", "längsseits", "laengsseits", "laut", "links", "mangels", "minus", "mit", "mithilfe", "mitsamt", "mittels",
	"nach", "nächst", "naechst", "nah", "namens", "neben", "nebst", "nördlich", "noerdlich", "nordöstlich", "nordoestlich", "nordwestlich",
	"oberhalb", "ohne", "östlich", "oestlich", "per", "plus", "pro", "quer", "rechts", "rücksichtlich", "ruecksichtlich",
	"samt", "seitens", "seitlich", "seitwärts", "seitwaerts", "südlich", "suedlich", "südöstlich", "suedoestlich",
	"südwestlich", "suedwestlich", "über", "ueber", "überm", "ueberm", "übern", "uebern", "übers", "uebers", "um", "ums",
	"unbeschadet", "unerachtet", "unfern", "unter", "unterhalb", "unterm", "untern", "unters", "unweit", "vermittels",
	"vermittelst", "vermöge", "vermoege", "via", "vom", "von", "vonseiten", "vor", "vorbehaltlich", "wegen", "wider",
	"zeit", "zu", "zugunsten", "zulieb", "zuliebe", "zum", "zur", "zusätzlich", "zusaetzlich", "zuungunsten",
	"zuwider", "zuzüglich", "zuzueglich", "zwecks", "zwischen" ];

// Many coordinating conjunctions are already included in the transition words list.
const coordinatingConjunctions = [ "und", "oder", "umso" ];

// 'noch' is part of 'weder...noch', 'nur' is part of 'nicht nur...sondern auch'.
const correlativeConjunctions = [ "auch", "noch", "nur" ];

// Many subordinating conjunctions are already included in the prepositions list, transition words list or pronominal adverbs list.
const subordinatingConjunctions = [ "nun", "so", "gleichwohl" ];

/*
These verbs are frequently used in interviews to indicate questions and answers. 'Frage' and 'fragen' are not included,
because those words are also nouns.
 */
const interviewVerbs = [ "sage", "sagst", "sagt", "sagest", "saget", "sagte", "sagtest", "sagten", "sagtet", "gesagt",
	"fragst", "fragt", "fragest", "fraget", "fragte", "fragtest", "fragten", "fragtet", "gefragt", "erkläre", "erklärst", "erklärt",
	"erklaere", "erklaerst", "erklaert", "erklärte", "erklärtest", "erklärtet", "erklärten", "erklaerte", "erklaertest", "erklaertet",
	"erklaerten", "denke", "denkst", "denkt", "denkest", "denket", "dachte", "dachtest", "dachten", "dachtet", "dächte", "dächtest",
	"dächten", "dächtet", "daechte", "daechtest", "daechten", "daechtet", "finde", "findest", "findet", "gefunden" ];

const interviewVerbsInfinitive = [ "sagen", "erklären", "erklaeren", "denken", "finden" ];

// These transition words were not included in the list for the transition word assessment for various reasons.
const additionalTransitionWords = [ "etwa", "absolut", "unbedingt", "wieder", "definitiv", "bestimmt", "immer", "äußerst", "aeußerst",
	"höchst", "hoechst", "sofort", "augenblicklich", "umgehend", "direkt", "unmittelbar", "nämlich", "naemlich", "natürlich", "natuerlich",
	"besonders", "hauptsächlich", "hauptsaechlich", "jetzt", "eben", "heutzutage", "eindeutig", "wirklich", "echt",
	"wahrhaft", "ehrlich", "aufrichtig", "wahrheitsgemäß", "letztlich", "einmalig", "unübertrefflich", "normalerweise",
	"gewöhnlich", "gewoehnlich", "üblicherweise", "ueblicherweise", "sonst", "fast", "nahezu", "beinahe", "knapp", "annähernd", "annaehernd",
	"geradezu", "bald", "vielleicht", "wahrscheinlich", "wohl", "voraussichtlich", "zugegeben", "ursprünglich", "insgesamt",
	"tatsächlich", "eigentlich", "wahrhaftig", "bereits", "schon", "oft", "häufig", "haeufig", "regelmäßig", "regelmaeßig", "gleichmäßig",
	"gleichmaeßig", "einfach", "lediglich", "bloß", "bloss", "halt", "wahlweise", "eventuell", "manchmal",
	"teilweise", "nie", "niemals", "nimmer", "jemals", "allzeit", "irgendeinmal", "anders", "momentan", "gegenwärtig",
	"gegenwaertig", "nebenbei", "anderswo", "woanders", "anderswohin", "anderorts", "insbesondere",
	"namentlich", "sonderlich", "ausdrücklich", "ausdruecklich", "vollends", "kürzlich", "kuerzlich", "jüngst", "juengst", "unlängst",
	"unlaengst", "neuerdings", "neulich", "letztens", "neuerlich", "verhältnismäßig", "verhaeltnismaessig", "deutlich", "klar",
	"offenbar", "anscheinend", "genau", "u.a", "damals", "zumindest" ];

const intensifiers = [ "sehr", "recht", "überaus", "ueberaus", "ungemein", "weitaus", "einigermaßen", "einigermassen", "ganz",
	"schwer", "tierisch", "ungleich", "ziemlich", "übelst", "uebelst", "stark", "volkommen", "durchaus", "gar" ];

// These verbs convey little meaning.
const delexicalizedVerbs = [ "geschienen", "meinst", "meint", "meinest", "meinet", "meinte", "meintest", "meinten", "meintet",
	"gemeint", "stehe", "stehst", "steht", "gehe", "gehst", "geht", "gegangen", "ging", "gingst", "gingen", "gingt" ];

const delexicalizedVerbsInfinitive = [ "tun", "machen", "stehen", "wissen", "gehen", "kommen" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAdverbs = [ "einerlei", "egal", "neu", "neue", "neuer", "neuen", "neues", "neuem", "neuerer", "neueren", "neuerem", "neueres",
	"neuere", "neuester", "neuster", "neuesten", "neusten", "neuestem", "neustem", "neuestes", "neustes", "neueste", "neuste", "alt",
	"alter", "alten", "altem", "altes", "alte", "ältere", "älteren", "älterer", "älteres", "ältester", "ältesten", "ältestem", "ältestes",
	"älteste", "aeltere", "aelteren", "aelterer", "aelteres", "aeltester", "aeltesten", "aeltestem", "aeltestes", "aelteste", "gut", "guter",
	"gutem", "guten", "gutes", "gute", "besser", "besserer", "besseren", "besserem", "besseres", "bester", "besten", "bestem", "bestes",
	"beste", "größte", "grösste", "groß", "großer", "großen", "großem", "großes", "große", "großerer", "großerem", "großeren", "großeres", "großere",
	"großter", "großten", "großtem", "großtes", "großte", "gross", "grosser", "grossen", "grossem", "grosses", "grosse", "grosserer", "grosserem",
	"grosseren", "grosseres", "grossere", "grosster", "grossten", "grosstem", "grosstes", "grosste", "einfacher", "einfachen",
	"einfachem", "einfaches", "einfache", "einfacherer", "einfacheren", "einfacherem", "einfacheres", "einfachere", "einfachste", "einfachster",
	"einfachsten", "einfachstes", "einfachstem", "schnell", "schneller", "schnellen", "schnellem", "schnelles", "schnelle", "schnellere",
	"schnellerer", "schnelleren", "schnelleres", "schnellerem", "schnellster", "schnellste", "schnellsten", "schnellstem", "schnellstes",
	"weit", "weiten", "weitem", "weites", "weiterer", "weiteren", "weiterem", "weiteres", "weitere", "weitester", "weitesten",
	"weitestem", "weitestes", "weiteste", "eigen", "eigener", "eigenen", "eigenes", "eigenem", "eigene", "eigenerer", "eignerer", "eigeneren",
	"eigneren", "eigenerem", "eignerem", "eigeneres", "eigneres", "eigenere", "eignere", "eigenster", "eigensten", "eigenstem", "eigenstes",
	"eigenste", "wenigster", "wenigsten", "wenigstem", "wenigstes", "wenigste", "minderer", "minderen", "minderem", "mindere", "minderes",
	"mindester", "mindesten", "mindestes", "mindestem", "mindeste", "lang", "langer", "langen", "langem", "langes", "längerer", "längeren",
	"längerem", "längeres", "längere", "längster", "längsten", "längstem", "längstes", "längste", "laengerer", "laengeren", "laengerem",
	"laengeres", "laengere", "laengster", "laengsten", "laengstem", "laengstes", "laengste", "tief", "tiefer", "tiefen", "tiefem", "tiefes",
	"tiefe", "tieferer", "tieferen", "tieferem", "tieferes", "tiefere", "tiefster", "tiefsten", "tiefstem", "tiefste", "tiefstes", "hoch",
	"hoher", "hohen", "hohem", "hohes", "hohe", "höher", "höherer", "höhere", "höheren", "höherem", "höheres", "hoeherer", "hoehere", "hoeheren",
	"hoeherem", "hoeheres", "höchster", "höchste", "höchsten", "höchstem", "höchstes", "hoechster", "hoechste", "hoechsten", "hoechstem",
	"hoechstes", "regulär", "regulärer", "regulären", "regulärem", "reguläres", "reguläre", "regulaer", "regulaerer", "regulaeren",
	"regulaerem", "regulaeres", "regulaere", "regulärerer", "reguläreren", "regulärerem", "reguläreres", "regulärere", "regulaererer",
	"regulaereren", "regulaererem", "regulaereres", "regulaerere", "regulärster", "regulärsten", "regulärstem", "regulärstes", "regulärste",
	"regulaerster", "regulaersten", "regulaerstem", "regulaerstes", "regulaerste", "normal", "normaler", "normalen", "normalem", "normales",
	"normale", "normalerer", "normaleren", "normalerem", "normaleres", "normalere", "normalster", "normalsten", "normalstem", "normalstes",
	"normalste", "klein", "kleiner", "kleinen",
	"kleinem", "kleines", "kleine", "kleinerer", "kleineres", "kleineren", "kleinerem", "kleinere", "kleinster", "kleinsten", "kleinstem",
	"kleinstes", "kleinste", "winzig", "winziger", "winzigen", "winzigem", "winziges", "winzigerer", "winzigeren", "winzigerem", "winzigeres",
	"winzigere", "winzigster", "winzigsten", "winzigstem", "winzigste", "winzigstes", "sogenannt", "sogenannter", "sogenannten",
	"sogenanntem", "sogenanntes", "sogenannte", "kurz", "kurzer", "kurzen", "kurzem", "kurzes", "kurze", "kürzerer", "kürzeres", "kürzeren",
	"kürzerem", "kürzere", "kuerzerer", "kuerzeres", "kuerzeren", "kuerzerem", "kuerzere", "kürzester", "kürzesten", "kürzestem", "kürzestes",
	"kürzeste", "kuerzester", "kuerzesten", "kuerzestem", "kuerzestes", "kuerzeste", "wirklicher", "wirklichen", "wirklichem", "wirkliches",
	"wirkliche", "wirklicherer", "wirklicheren", "wirklicherem", "wirklicheres", "wirklichere", "wirklichster", "wirklichsten",
	"wirklichstes", "wirklichstem", "wirklichste", "eigentlicher", "eigentlichen", "eigentlichem", "eigentliches", "eigentliche",
	"schön", "schöner", "schönen", "schönem", "schönes", "schöne", "schönerer", "schöneren", "schönerem", "schöneres", "schönere", "schönster",
	"schönsten", "schönstem", "schönstes", "schönste", "real", "realer", "realen", "realem", "reales", "realerer", "realeren", "realerem",
	"realeres", "realere", "realster", "realsten", "realstem", "realstes", "realste", "derselbe", "denselben", "demselben", "desselben",
	"dasselbe", "dieselbe", "derselben", "dieselben", "gleicher", "gleichen", "gleichem", "gleiches", "gleiche", "gleicherer",
	"gleicheren", "gleicherem", "gleicheres", "gleichere", "gleichster", "gleichsten", "gleichstem", "gleichstes", "gleichste", "bestimmter",
	"bestimmten", "bestimmtem", "bestimmtes", "bestimmte", "bestimmtere", "bestimmterer", "bestimmterem", "bestimmteren", "bestimmteres",
	"bestimmtester", "bestimmtesten", "bestimmtestem", "bestimmtestes", "bestimmteste", "überwiegend",
	"ueberwiegend", "zumeist", "meistens", "meisten", "meiste", "meistem", "meistes", "großenteils", "grossenteils", "meistenteils",
	"weithin", "ständig", "staendig", "laufend", "dauernd", "andauernd", "immerfort", "irgendwo", "irgendwann",
	"ähnlicher", "ähnlichen", "ähnlichem", "ähnliches", "ähnliche", "ähnlich", "ähnlicherer", "ähnlicheren", "ähnlicherem", "ähnlicheres",
	"ähnlichere", "ähnlichster", "ähnlichsten", "ähnlichstem", "ähnlichstes", "ähnlichste", "schlecht", "schlechter", "schlechten",
	"schlechtem", "schlechtes", "schlechte", "schlechterer", "schlechteren", "schlechterem", "schlechteres", "schlechtere", "schlechtester",
	"schlechtesten", "schlechtestem", "schlechtestes", "schlechteste", "schlimm", "schlimmer", "schlimmen", "schlimmem", "schlimmes",
	"schlimme", "schlimmerer", "schlimmeren", "schlimmerem", "schlimmeres", "schlimmere", "schlimmster", "schlimmsten", "schlimmstem",
	"schlimmstes", "schlimmste", "toll", "toller", "tollen", "tollem", "tolles", "tolle", "tollerer", "tolleren", "tollerem", "tollere",
	"tolleres", "tollster", "tollsten", "tollstem", "tollstes", "tollste", "super", "mögliche", "möglicher", "mögliches", "möglichen",
	"möglichem", "möglich", "moegliche", "moeglicher", "moegliches", "moeglichen", "moeglichem", "moeglich", "nächsten", "nächster",
	"nächstem", "nächste", "nächstes", "naechsten",	"voll", "voller", "vollen", "vollem", "volle", "volles", "vollerer", "volleren",
	"vollerem", "vollere", "volleres", "vollster", "vollsten", "vollstem", "vollste", "vollstes", "außen", "ganzer", "ganzen",
	"ganzem", "ganze", "ganzes", "gern", "gerne", "oben", "unten", "zurück", "zurueck", "nicht", "eher", "ehere", "eherem", "eheren",
	"eheres", "eheste", "ehestem", "ehensten", "ehesten" ];

const interjections = [ "ach", "aha", "oh", "au", "bäh", "baeh", "igitt", "huch", "hurra", "hoppla", "nanu", "oha", "olala", "pfui", "tja",
	"uups", "wow", "grr", "äh", "aeh", "ähm", "aehm", "öhm", "oehm", "hm", "mei", "mhm", "okay", "richtig", "eijeijeijei" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ "g", "el", "tl", "wg", "be", "bd", "cl", "dl", "dag", "do", "gl", "gr", "kg", "kl", "cb", "ccm", "l", "ms", "mg",
	"ml", "mi", "pk", "pr", "pp", "sc", "sp", "st", "sk", "ta", "tr", "cm", "mass" ];

const timeWords = [ "sekunde", "sekunden", "minute", "minuten", "stunde", "stunden", "uhr", "tag", "tages", "tags",
	"tage", "tagen", "woche", "wochen", "monat", "monate", "monates", "monats", "monaten", "jahr", "jahres", "jahrs",
	"jahre", "jahren", "morgens", "mittags", "abends", "nachts", "heute", "gestern", "morgen", "vorgestern", "übermorgen",
	"uebermorgen" ];

const vagueNouns = [ "ding", "dinge", "dinges", "dinger", "dingern", "dingen", "sache", "sachen", "weise", "weisen", "wahrscheinlichkeit",
	"zeug", "zeuge", "zeuges", "zeugen", "mal", "einmal", "teil", "teile", "teiles", "teilen", "prozent", "prozents", "prozentes", "prozente",
	"prozenten", "beispiel", "beispiele", "beispieles", "beispiels", "beispielen", "aspekt", "aspekte", "aspektes", "aspekts", "aspekten",
	"idee", "ideen", "ahnung", "ahnungen", "thema", "themas", "themata", "themen", "fall", "falle", "falles", "fälle", "fällen",
	"faelle", "faellen", "mensch", "menschen", "leute" ];

const miscellaneous = [ "nix", "nixe", "nixes", "nixen", "usw.", "amen", "ja", "nein", "euro" ];

const titlesPreceding = [ "fr", "hr", "dr", "prof" ];

const titlesFollowing = [ "jr", "jun", "sen", "sr" ];


// These word categories are filtered at the beginning of word combinations.
export const filteredAtBeginning = transformWordsWithHyphens( [].concat( otherAuxiliariesInfinitive, passiveAuxiliariesInfinitive,
	delexicalizedVerbsInfinitive, copulaInfinitive, interviewVerbsInfinitive ) );

// These word categories are filtered at the ending of word combinations.
export const filteredAtEnding = transformWordsWithHyphens( [].concat( ordinalNumerals, generalAdjectivesAdverbs ) );

// These word categories are filtered at the beginning and ending of word combinations.
export const filteredAtBeginningAndEnding = transformWordsWithHyphens( [].concat( articles, prepositions, coordinatingConjunctions,
	demonstrativePronouns, intensifiers, quantifiers ) );

// These word categories are filtered everywhere within word combinations.
export const filteredAnywhere = transformWordsWithHyphens( [].concat( transitionWords, adverbialGenitives, personalPronounsNominative,
	personalPronounsAccusative, personalPronounsDative,	reflexivePronouns, interjections, cardinalNumerals, copula, interviewVerbs, otherAuxiliaries,
	filteredPassiveAuxiliaries, delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions,
	interrogativeProAdverbs, locativeAdverbs, miscellaneous, pronominalAdverbs, recipeWords, timeWords, vagueNouns,
	reciprocalPronouns, possessivePronouns ) );

// This export contains all of the above words.
export const all = transformWordsWithHyphens( [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns,
	possessivePronouns, reflexivePronouns, reciprocalPronouns, personalPronounsNominative, personalPronounsAccusative, quantifiers,
	indefinitePronouns, interrogativeProAdverbs, pronominalAdverbs, locativeAdverbs, adverbialGenitives,
	filteredPassiveAuxiliaries, passiveAuxiliariesInfinitive, otherAuxiliaries,
	otherAuxiliariesInfinitive, copula, copulaInfinitive, prepositions, coordinatingConjunctions, correlativeConjunctions,
	subordinatingConjunctions, interviewVerbs, interviewVerbsInfinitive, transitionWords, additionalTransitionWords, intensifiers,
	delexicalizedVerbs, delexicalizedVerbsInfinitive, interjections, generalAdjectivesAdverbs, recipeWords, vagueNouns, miscellaneous,
	timeWords, titlesPreceding, titlesFollowing ) );

export default {
	filteredAtBeginning,
	filteredAtEnding,
	filteredAtBeginningAndEnding,
	filteredAnywhere,
	all,
};
