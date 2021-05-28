/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
const articles = [ "det", "en" ];

const cardinalNumerals = [ "en", "to", "tre", "fire", "fem", "seks", "syv", "åtte", "ni", "ti", "elleve", "tolv",
	"tretten", "fjorten", "femten", "seksten", "sytten", "atten", "nitten", "tjue", "hundre", "tusen", "million", "milliarder" ];

const ordinalNumerals = [ "første", "først", "sekund", "tredje", "fjerde", "femte", "sjette", "syvende", "åttende", "niende", "tiende" ];

const pronouns = [
	// Personal pronouns.
	"jeg", "du", "den", "vi", "de", "han", "hun", "henne", "oss", "meg", "ham", "dem",
	// Possessive pronouns.
	"vår", "deres", "ditt", "mitt", "våre", "vårt", "hans", "hennes", "dens", "egen", "egne",
	// Demonstrative pronouns.
	"denne", "dette", "disse",
	// Reciprocal pronouns.
	"hverandre", "hvert" ];

const interrogatives = [ "hvem", "hvordan", "hvorfor", "hvor", "hva", "hvilken", "hvilket" ];

const quantifiers = [ "mange", "hele", "mer", "ingen", "alle", "noen", "flere", "hver", "begge", "sov", "mest", "fleste" ];

const reflexivePronouns = [  ];

const indefinitePronouns = [ "ingenting" ];

const prepositions = [ "sånn", "ved", "mot", "ned", "enn", "over", "inn", "sa", "opp", "der", "fra", "din", "nei", "mellom", "di", "oppe",
	"av", "om", "den", "de", "at", "med", "til", "å", "på", "du", "uten", "én", "under", "hos", "inne", "gjennom", "unna", "del", "nede",
	"kun", "innen", "blant" ];

const conjunctions = [ "eller", "hvis", "ja", "et", "som", "i", "og" ];

const interviewVerbs = [ "tror", "fortelle", "fortell", "fortalte", "tenkte", "tenk" ];

const intensifiers = [ "virkelig", "akkurat", "visst" ];

const auxiliariesAndDelexicalizedVerbs = [ ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"helt", "andre", "litt", "lenge", "siste", "fint", "annet", "stor", "neste", "lenger", "annen", "nye", "alene", "flott",
	"klart", "liten", "langt", "gamle", "dårlig", "hyggelig", "gode", "sånt", "nytt", "best", "lang", "små", "lot", "større",
	"høyt", "største", "slikt",
	// General adverbs.
	"alltid", "godt", "sammen", "tilbake", "etter", "igjen", "bare", "så", "veldig", "bedre", "samme", "far", "eneste", "enig",
	"borte", "snart", "rundt", "beste", "bort", "vekk", "nesten", "ganske", "senere", "videre", "mindre", "straks", "svært" ];

const interjections = [ "hei" ];

const recipeWords = [  ];

const timeWords = [ "år", "dag", "nå", "tid", "tiden", "morgen", "dager", "minutter", "dagen", "uke", "uker", "måneder", "stund" ];

const vagueNouns = [ "ting", "tingene" ];

const miscellaneous = [ "ok", "okay", "ja", "jaså", "nei", "ikke", "unnskyld", "beklager", "herr", "altså" ];

export const all = [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous );

export default all;
