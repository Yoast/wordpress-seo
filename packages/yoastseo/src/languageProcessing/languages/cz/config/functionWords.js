import { singleWords as transitionWords } from "./transitionWords";

/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
const articles = [ "ten", "ta" ];

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
	"něho", "ho", "jej", "něj", "ji", "jí", "ní", "je", "ně", "jim", "nim", "jimi", "nimi", "jich", "nich", "jemu", "němu",
	"něm", "mém", "mým", "mých", "mou", "mými", "ním", "mu", "nás", "nám", "námi", "vás", "vám", "mnou", "námi", "tebou", "vámi",
	// Possessive pronouns.
	"můj", "má", "mé", "mí", "moje", "mého", "mojí", "mých", "mému", "mým", "moji", "tvůj", "tvoje", "tvá", "tvé", "tví", "tvoji",
	"tvého", "tvojí", "tvých", "tvojích", "tvému", "tvým", "tvou", "tvém", "tvých", "tvými", "jeho", "její", "náš", "naše", "váš",
	"vaše", "jejich",
	// Demonstrative pronouns.
	"ten", "tento", "ta" , "tato", "to", "toto", "ti", "ty", "tito", "tyto", "ty", "tyto", "ta", "tato", "tohle", "toho", "abych",
	// Relative pronouns.
	"který", "která", "které", "kterého", "kterému", "kterého", "kterou", "kterém", "kterým", "kteří", "kterých", "kterými",
	"jenž", "jež", "jehož", "jejž", "něhož", "nějž", "jíž", "níž", "jemuž", "němuž", "jež", "něž", "němž", "jímž", "nímž",
	"již", "jichž", "nichž", "jimž", "nimž", "jimiž", "nimiž", "kdo", "co", "koho", "čeho", "komu", "čemu", "koho", "kom",
	"čem", "kým", "čím",
	 ];

const interrogatives = [ "co", "čí", "jak", "jaký", "kde", "kdo", "kdý", "kolik", "který", "jenž", "proč" ];

const quantifiers = [ "nějaký", "nějaká", "nějaké", "žádný", "nijaký", "lecjaký", "ledajaký", "ledasjaký", "kdejaký", "kdekterý", "všelijaký", "veškerý" ];

const reflexivePronouns = [ "se", "si", "sebe", "sobě", "sebou",
	// Reflexive possessive.
	"svůj", "svoje", "svá", "své", "svého", "svojí", "svému", "svoji", "svou", "svém", "svým", "sví", "svých", "svými" ];

const indefinitePronouns = [ "někdo", "někoho", "někomu", "někoho", "někom", "někým", "něco", "nic", "něčeho", "něčemu", "něco",
	"cokoli", "cokoliv", "něčem", "něčím", "některá", "některé", "některého", "některému", "některý", "některou", "některém",
	"některým", "někteří", "některých", "některými", "nějaký", "nějaká", "nějaké", "nějakého", "nějakému",
	"nějaký", "nějakou", "nějakém", "nějakým", "nějací", "nějakých", "nějakými", "něčí", "něčího", "něčímu", "něčím",
	"něčí", "ničí", "něčích", "něčími", "ledakdo", "ledaco", "ledajaký", "ledakterý", "kdokoliv", "kdokoli", "kohokoli",
	"komukoli", "kohokoli", "komkoli", "kýmkoli", "cokoli", "jakýkoli", "jakýkoliv", "kterýkoli", "číkoli", "kdos", "kdosi", "cosi",
	"kterýsi", "jakýsi", "nikdo", "čísi", "leckdo", "leckdos", "ledakdo", "ledaskdo", "kdekdo", "lecco", "leccos", "ledaco",
	"ledacos", "ledaco", "ledasco", "leckterý", "kdekdo", "kdečí", "kdeco", "lecčí", "ledačí", "ledasčí", "někde", "nikde",
	"kdekoliv", "kdekoli", "všude", "leckde", "ledaskde", "ledakde", "někudy", "kudysi", "nikudy", "kdekudy", "odněkud",
	"odkudsi", "odnikud", "odevšad", "kdesi", "všechen", "málokdo", "máloco", "málokterý", "zřídkakdo", "zřídkaco", "sotvakdo",
	"sotvaco", "sotva který", "každý", "každá", "každé", "každého", "každému", "každému", "každou", "každém", "každým", "každí",
	"každých", "každým", "každými", "všechen", "všechna", "všechno", "vše", "všeho", "vší", "všemu", "všechnu", "vším",
	"všichni", "všechny", "všech", "všem", "všemi" ];

const prepositions = [ "během", "bez", "blízko", "do", "od", "okolo", "kolem", "u", "vedle", "z", "ze", "k", "ke", "kvůli",
	"navzdor", "navzdory", "krom, vedle", "kromě, vedle", "místo", "namísto", "ohledně", "podél", "pomocí", "oproti", "naproti",
	"proti", "prostřednictvím", "s", "u", "vlivem", "vyjma", "využitím", "stran", "díky", "kvůli", "podle", "vůči", "na",
	"o", "pro", "přes", "za", "po", "v", "ve", "mezi", "s", "se", "nad", "pod", "před", "mimo", "skrz", "při", "jako", "asi" ];

const conjunctions = [ "a", "i", "aby", "ale", "že", "protože", "neboť", "když", "až", "jestli", "jestliže", "pokud", "kdyby",
	"nebo", "anebo", "či", "proto", "který", "jenž", "aniž", "než", "tak", "takže", "kvůli" ];

const interviewVerbs = [ "řekl" ];

const intensifiers = [  ];

const auxiliariesAndDelexicalizedVerbs = [  ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"dobře", "dobrý", "dost",
	// General adverbs.
	"všelijak", "nějak", "jaksi", "tak nějak", "ijak", "nikterak", "akkoli","akkoliv", "kdejak", "už", "jen", "tady", "teď",
	"ještě", "možná", "nikdy", "ani", "taky", "pak", "opravdu", "trochu", "prostě", "víc", "jenom", "další"
	 ];

const interjections = [ "jo", "hej" ];

const recipeWords = [  ];

const timeWords = [ "den" ];

const vagueNouns = [  ];

const miscellaneous = [
	"atd.", "bůhvíkdo", "bůhvíjaký", "bůhvíčí", "nevímco", "nevímkdo a podobně", "si", "ne", "pane", "prosím", "ahoj", "pořádku"
	// Fractions.
	 ];


export const all = [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous, transitionWords );

export default all;
