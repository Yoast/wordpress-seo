import { singleWords as transitionWords } from "./transitionWords";

/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
const articles = [];

const cardinalNumerals = [ "nula", "jeden", "jedna", "jedno", "dva", "dvě", "tři", "čtyři", "pět", "šest", "sedm", "osm",
	"devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct",
	"dvacet", "dvacet jedna", "dvacet dva", "dvacet tři", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát",
	"devadesát", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set", "tisíc",
	"dva tisíce", "jedenáct tisíc", "dvacet pět tisíc", "sto třicet osm tisíc", "milión", "dva milióny", "pět miliónů",
	"šest miliónů", "sedm miliónů", "miliarda" ];

const ordinalNumerals = [ "první", "druhý", "třetí", "čtvrtý", "pátý", "šestý", "sedmý", "osmý", "devátý", "desátý" ];

const pronouns = [
	// Personal pronouns.
	"já", "ty", "on", "ona", "ono", "my", "mě", "mne", "mi", "mně", "vy", "oni", "ony", "tě", "ti", "tebe", "tobě", "jeho",
	"ho", "jej", "ji", "jí", "ní", "je", "jim", "jimi", "jemu", "němu", "ním", "mu", "nás", "nám", "námi", "vás", "vám",
	// Possessive pronouns and adjectives.
	"můj", "má", "mé", "mí", "moje", "tvůj", "tvoje", "tvá", "tvé", "jeho", "její", "náš", "naše", "váš", "vaše", "jejich",
	// Demonstrative pronouns.
	"ten", "tento", "ta" , "tato", "to", "toto", "ti", "ty", "tito", "tyto", "ty", "tyto", "ta", "tato",
	// Relative pronouns.

	// Reciprocal pronouns.
	 ];


const interrogatives = [ ];

const quantifiers = [ "nějaký", "nějaká", "nějaké" ];

const reflexivePronouns = [  ];

const indefinitePronouns = [  ];

const prepositions = [ "bez", "blízko", "do", "od", "okolo", "kolem", "u", "vedle", "z", "ze", "k", "ke", "kvůli", "navzdor",
	"navzdory", "proti", "vůči", "na", "o", "pro", "přes", "za", "po", "v", "ve", "mezi", "s", "se", "nad", "pod", "před" ];

const conjunctions = [ "a", "i", "aby", "ale", "že", "protože", "neboť", "když", "až", "jestli", "jestliže", "pokud", "kdyby",
	"nebo", "anebo", "či", "proto", "který", "jenž", "aniž", "než" ];

const interviewVerbs = [  ];

const intensifiers = [  ];

const auxiliariesAndDelexicalizedVerbs = [  ];

const generalAdjectivesAdverbs = [
	// General adjective.

	// General adverbs.
	 ];

const interjections = [  ];

const recipeWords = [  ];

const timeWords = [  ];

const vagueNouns = [  ];

const miscellaneous = [
	// Fractions.
	 ];


export const all = [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous, transitionWords );

export default all;
