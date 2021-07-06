import { singleWords as transitionWords } from "./transitionWords";
/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
// "En" is already listed among the cardinal numbers, "de", "det" and "den" among the personal pronouns.
const articles = [ "ei", "et" ];

const cardinalNumerals = [ "null", "en", "ett", "ene", "to", "tre", "fire", "fem", "seks", "syv", "åtte", "ni", "ti", "elleve", "tolv",
	"tretten", "fjorten", "femten", "seksten", "sytten", "atten", "nitten", "tjue", "tyve", "tjueen", "enogtyve", "tretti", "tredve",
	"førti", "førr", "femti", "seksti", "sytti", "åtti", "nitti", "hundre", "hundreogen", "etthundreogen", "tohundre", "tusen",
	"tusenogen", "million", "millioner", "milliard", "milliarder" ];

const ordinalNumerals = [ "nullte", "første", "først", "sekund", "tredje", "fjerde", "femte", "sjette", "syvende", "åttende", "niende", "tiende",
	"ellevte", "tolvte", "trettende", "fjortende", "femtende", "sekstende", "syttende", "åttende", "nittende", "tjuende", "tjueførst", "tjueførste",
	"trettiende", "førtiende", "femtiende", "sekstiende", "syttiende", "åttiende", "nittiende", "hundrede", "hundreogfemtiende", "to hundrede",
	"tusende", "millionte", "millardte" ];

const pronouns = [
	// Personal pronouns.
	"jeg", "du", "den", "det", "vi", "de", "han", "hun", "dere", "henne", "oss", "meg", "deg", "ham", "dem",
	// Possessive pronouns.
	"min", "din", "deres", "vår", "deres", "ditt", "mitt", "våre", "vårt", "hans", "hennes", "dens", "dets", "egen",
	"egne", "mi", "di", "sin", "si", "sitt", "sine", "mine", "dine",
	// Demonstrative pronouns. "De", "det" and "den" are among the personal pronouns.
	"denne", "dette", "disse", "slik", "slikt", "slike", "sånn", "sånt", "sånne", "samme",
	// Reciprocal pronouns.
	"hverandre", "hvert",
	// Relative pronouns.
	"som" ];

const interrogatives = [ "hvem", "hvordan", "hvorfor", "hvor", "hva", "hvilken", "hvilket", "hvilke" ];

const quantifiers = [ "mange", "mye", "mang en", "mangt et", "hele", "mer", "ingen", "ingenting", "ikke noen", "ikke noe",
	"alle", "all", "alt", "allting", "noen", "noe", "flere", "hver", "hvert", "annenhver", "ammethvert", "begge", "sov", "mest", "fleste",
	"få", "fæst", "færrest", "flere", "flest" ];

const reflexivePronouns = [ "seg", "selv" ];

const indefinitePronouns = [ "ingenting", "annen", "annet", "andre" ];

const prepositions = [ "sånn", "ved", "mot", "ned", "enn", "over", "inn", "i", "sa", "opp", "der", "fra", "din", "nei", "mellom", "di", "oppe",
	"av", "med", "til", "å", "på", "du", "uten", "én", "under", "hos", "inne", "gjennom", "unna", "del", "nede", "til", "over", "under", "etter",
	"kun", "blant", "for", "mellom", "blant" ];

const conjunctions = [ "eller", "hvis", "ja", "et", "som", "i", "og", "både", "men", "mens", "enten", "verken", "at", "om", "da", "når", "før",
	"idet", "etter at", "siden", "innen", "med det samme", "til", "inntil", "hver gang", "etter hvert som", "så lenge", "så lenge som", "så ofte",
	"så ofte som", "så snart", "så snart som", "etter", "etterpå", "foran", "tidligere", "fordi", "ettersom", "derfor", "dersom", "hvis", "så fremt",
	"så sant", "i fall", "i tilfelle", "med mindre", "uten at", "bare", "for så vidt som", "uten at", "uten å", "enda", "fordi om", "enda om",
	"skjønt", "om enn", "hva så", "trass i at", "hvor så", "samme", "selv om", "hva enn", "til tross for at", "hvor enn", "uansett", "for at", "så",
	"så at", "slik at", "sånn at", "for at, så", "slik som", "så som", "som om", "enn", "dess", "jo", "desto" ];

const interviewVerbs = [ "tror", "fortelle", "fortell", "fortalte", "tenkte", "tenk" ];

const intensifiers = [ "virkelig", "akkurat", "visst" ];

const auxiliariesAndDelexicalizedVerbs = [ "ha", "har", "hadde", "gjør", "gjøre", "gjorde", "kaller", "kalte", "kalle",
	"kalla", "virker", "virka", "virke", "virka", "går", "gikk", "gå", "leges", "lages", "legges", "lages", "består",
	"bestod", "bestå", "bestått", "bety", "betyr" ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"helt", "andre", "litt", "lenge", "siste", "fint", "annet", "stor", "stort", "store", "neste", "lenger", "annen", "nye",
	"alene", "flott", "gammel", "gammelt", "gamle", "klart", "liten", "langt", "gamle", "dårlig", "hyggelig", "gode", "sånt",
	"nytt", "best", "lang", "små", "lot", "større", "vakker", "vakkert", "vakre", "ny", "bra", "bedre", "grei", "greit", "greie",
	"høyt", "største", "størst", "slikt", "liten", "lita", "lite", "små", "mindre", "minst", "kort", "glad", "dårlig", "ille", "ond",
	"vond", "verre", "verst", "eldre", "eldst", "lang", "lengre", "lengst", "nær", "næmerere", "nærere", "nærmest",
	"nærest", "tung", "tyngre", "tyngst", "ung", "yngre", "yngst", "pen",
	// General adverbs.
	"alltid", "godt", "sammen", "tilbake", "etter", "igjen", "bare", "så", "veldig", "bedre", "samme", "far", "eneste", "enig",
	"borte", "snart", "rundt", "beste", "bort", "vekk", "nesten", "ganske", "senere", "videre", "straks", "svært", "neste",
	"bak", "bakre", "bakerst", "borte", "bortre", "bortest", "fremme", "fremre", "fremst", "foran", "forrest", "inne", "indre", "innerst",
	"midt", "midtre", "midterst", "nede", "nedre", "nederst", "nord", "nordre", "nordligst", "øvre", "øverst", "sør", "søndre", "sørligst",
	"vest", "vestre", "vestligst", "øst", "østre", "østligst", "ute", "ytre", "ytterst", "underst", "langt", "fram", "her", "der", "nok", "aldri",
	"ut", "ned", "nede", "bort", "innom", "ingensteds", "sjelden", "sjeldnere", "sjeldnest", "raskt", "raskere", "raskest", "gjerne", "heller",
	"helst", "dårligere", "dårligst", "vondt", "vondere", "vondest", "meget", "øverst", "enda", "neppe", "nokså", "nesten", "helt", "bitende",
	"aller", "ganske", "aldeles", "derfra", "herfra", "utenlands", "noensteds", "oppå", "hjemme", "hit", "dit", "vekk", "fram", "fort", "hyggelig",
	"hvorledes", "sånn", "således", "slik", "pent", "morsomt", "akkurat", "alt", "ofte", "nettopp", "bestandig", "noen gang", "noen ganger",
	"fremdeles", "ennå", "da", "sjeldent" ];

const interjections = [ "hei", "fy", "au", "hurra", "uff", "takk", "hm", "fanden", "pokker", "fillern", "åh", "isj", "hallo", "æsj" ];

const recipeWords = [ "g" ];

const timeWords = [ "år", "året", "går", "dag", "nå", "tid", "tiden", "morgen", "dager", "minutt", "minutter", "dagen", "uke",
	"uker", "måneder", "stund", "timer", "time", "morges", "ettermiddag", "tidlig", "fjor", "kveld", "natt", "fogårs", "vinter",
	"sommer", "vår", "høst"  ];

const vagueNouns = [ "ting", "tingene" ];

const miscellaneous = [ "ok", "okay", "ja", "jo", "jaså", "nei", "ikke", "unnskyld", "beklager", "herr", "altså", "grader", "grad", "kr",
	// Fractions.
	"en halvdel", "en halv", "to halve", "en tredel", "tredjedel", "to tredeler", "tredjedeler", "en firedel", "fjerdedel",
	"kvart", "en trettendedel", "en fjortendedel", "en promille", "en tusendel", "halvannen", "en og en halv" ];

export const cannotBeBetweenPassiveAuxiliaryAndParticiple = [].concat( auxiliariesAndDelexicalizedVerbs, interviewVerbs );

export const all = [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous, cannotBeBetweenPassiveAuxiliaryAndParticiple, transitionWords );

export default all;
