import { singleWords as transitionWords } from "./transitionWords";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
const articles = [];

const cardinalNumerals = [ "nula", "jeden", "jedné", "jedna", "jedno", "dva", "dvě", "dvou", "tři", "čtyři", "pět", "šest", "sedm", "osm",
	"devět", "deset", "jedenáct", "dvanáct", "třináct", "čtrnáct", "patnáct", "šestnáct", "sedmnáct", "osmnáct", "devatenáct",
	"dvacet", "dvacet jedna", "dvacet dva", "dvacet tři", "třicet", "čtyřicet", "padesát", "šedesát", "sedmdesát", "osmdesát",
	"devadesát", "sto", "dvě stě", "tři sta", "čtyři sta", "pět set", "šest set", "sedm set", "osm set", "devět set", "tisíc",
	"dva tisíce", "jedenáct tisíc", "dvacet pět tisíc", "sto třicet osm tisíc", "milión", "dva milióny", "pět miliónů",
	"šest miliónů", "sedm miliónů", "miliarda" ];

const ordinalNumerals = [ "první", "druhý", "druhé", "třetí", "čtvrtý", "pátý", "šestý", "sedmý", "osmý", "devátý", "desátý" ];

const pronouns = [
	// Personal pronouns.
	"já", "ty", "on", "ona", "ono", "my", "mě", "mne", "mi", "mně", "vy", "oni", "ony", "tě", "ti", "tebe", "tobě", "jeho",
	"něho", "ho", "jej", "něj", "ji", "jí", "ní", "je", "ně", "jim", "nim", "jimi", "nimi", "jich", "nich", "jemu", "němu",
	"něm", "mém", "mým", "mých", "mou", "mými", "ním", "mu", "nás", "nám", "námi", "vás", "vám", "mnou", "námi", "tebou", "vámi",
	"našich", "tys", "naši",
	// Possessive pronouns.
	"můj", "má", "mé", "mí", "moje", "mého", "mojí", "mých", "mému", "moji", "tvůj", "tvoje", "tvá", "tvé", "tví", "tvoji",
	"tvého", "tvojí", "tvých", "tvojích", "tvému", "tvým", "tvou", "tvém", "tvých", "tvými", "jeho", "její", "náš", "naše", "váš",
	"vaše", "jejich", "vaší", "naší",
	// Demonstrative pronouns.
	"ten", "tento", "ta", "tato", "to", "toto", "ti", "tito", "tyto", "ty", "tato", "tohle", "toho", "abych",
	"těch", "tenhle", "abyste", "abychom", "tyhle", "tuhle", "tohoto", "čeho", "čemu", "téhle", "těmi", "této", "tomhle",
	"tou", "tahle", "žes", "tímhle", "těm", "těchto", "tomu", "tu", "ten", "tom", "tím",
	// Relative pronouns.
	"který", "která", "které", "kterého", "kterému", "kterou", "kterém", "kterým", "kteří", "kterých", "kterými",
	"jenž", "jež", "jehož", "jejž", "něhož", "nějž", "jíž", "níž", "jemuž", "němuž", "jež", "něž", "němž", "jímž", "nímž",
	"již", "jichž", "nichž", "jimž", "nimž", "jimiž", "nimiž", "kdo", "co", "koho", "čeho", "komu", "čemu", "koho", "kom",
	"čem", "kým", "čím", "cože", "což", "koho", "jakou" ];

const interrogatives = [ "co", "čí", "čím", "jak", "jaký", "jaké", "kde", "kdo", "kdý", "kolik", "který", "jenž", "proč" ];

const quantifiers = [ "nějaký", "nějaká", "nějaké", "žádný", "nijaký", "lecjaký", "ledajaký", "ledasjaký", "kdejaký",
	"kdekterý", "všelijaký", "veškerý", "pár", "hodně", "celý", "tolik", "celou", "celé", "oba", "buď", "zbytek", "žádná",
	"nějakou", "spoustu", "několik" ];

const reflexivePronouns = [ "se", "si", "sebe", "sobě", "sebou",
	// Reflexive possessive.
	"svůj", "svoje", "svá", "své", "svého", "svojí", "svému", "svoji", "svou", "svém", "svým", "sví", "svých", "svými" ];

const indefinitePronouns = [ "někdo", "někoho", "někomu", "někom", "někým", "něco", "nic", "něčeho", "něčemu", "něco",
	"cokoli", "cokoliv", "něčem", "něčím", "některá", "některé", "některého", "některému", "některý", "některou", "některém",
	"některým", "někteří", "některých", "některými", "nějaká", "nějaké", "nějakého", "nějakému",
	"nějaký", "nějakou", "nějakém", "nějakým", "nějací", "nějakých", "nějakými", "něčí", "něčího", "něčímu", "něčím",
	"něčí", "ničí", "něčích", "něčími", "ledakdo", "ledaco", "ledajaký", "ledakterý", "kdokoliv", "kdokoli", "kohokoli",
	"komukoli", "kohokoli", "komkoli", "kýmkoli", "cokoli", "jakýkoli", "jakýkoliv", "kterýkoli", "číkoli", "kdos", "kdosi", "cosi",
	"kterýsi", "jakýsi", "nikdo", "čísi", "leckdo", "leckdos", "ledakdo", "ledaskdo", "kdekdo", "lecco", "leccos", "ledaco",
	"ledacos", "ledaco", "ledasco", "leckterý", "kdekdo", "kdečí", "kdeco", "lecčí", "ledačí", "ledasčí", "někde", "nikde",
	"kdekoliv", "kdekoli", "všude", "leckde", "ledaskde", "ledakde", "někudy", "kudysi", "nikudy", "kdekudy", "odněkud",
	"odkudsi", "odnikud", "odevšad", "kdesi", "všechen", "málokdo", "máloco", "málokterý", "zřídkakdo", "zřídkaco", "sotvakdo",
	"sotvaco", "sotva který", "každý", "každá", "každé", "každého", "každému", "každému", "každou", "každém", "každým", "každí",
	"každých", "každým", "každými", "všechen", "všechna", "všechno", "vše", "všeho", "vší", "všemu", "všechnu", "vším",
	"všichni", "všechny", "všech", "všem", "všemi", "takový", "takové ", "takového", "takovou", "cokoliv", "jiného", "jiný",
	"taková", "jiné", "odtud" ];

const prepositions = [ "během", "bez", "blízko", "do", "od", "okolo", "kolem", "u", "vedle", "z", "ze", "k", "ke", "kvůli",
	"navzdor", "navzdory", "krom, vedle", "kromě, vedle", "místo", "namísto", "ohledně", "podél", "pomocí", "oproti", "naproti",
	"proti", "prostřednictvím", "s", "u", "vlivem", "vyjma", "využitím", "stran", "díky", "kvůli", "podle", "vůči", "na", "té",
	"o", "pro", "přes", "za", "po", "v", "ve", "mezi", "s", "se", "nad", "pod", "před", "mimo", "skrz", "při", "jako", "asi",
	"dokud", "ven", "běž", "odkud", "ode", "nahoře", "nahoru", "dovnitř", "dne", "beze", "napříč", "versus", "via",
	"vně", "dovnitř", "vpředu", "vůkol", "vespod", "opodál", "vepředu", "svrchu", "vnitř", "zprostřed", "naspodu", "zdéli",
	"okol", "podál", "naspod", "kontra", "vespodu", "zponad", "ponad", "nadtož", "kolkolem", "zdélí", "veskrz", "popod",
	"daleko", "vůkolem" ];

const conjunctions = [ "a", "i", "aby", "ale", "že", "protože", "neboť", "když", "až", "jestli", "jestliže", "pokud", "kdyby",
	"nebo", "anebo", "či", "proto", "který", "jenž", "aniž", "než", "tak", "takže", "kvůli", "kdybych", "ach", "zdá", "zatím",
	"během", "kdybyste", "jakožto", "jakož", "neb" ];

const interviewVerbs = [ "řekl", "říkala", "řekla", "řekne", "říkal", "říká", "podle", "neřekl", "říkat", "chtějí", "neviděl",
	"vypadáš", "mluvil", "rozumím", "znám", "cítím", "nemyslím", "víme", "nevěřím", "myslíte" ];

const intensifiers = [ "jasně", "velmi", "vůbec", "přesně", "určitě", "úplně", "samozřejmě", "docela", "skutečně", "rozhodně",
	"vážně", "spolu", "jistě", "naprosto", "velice", "hrozně", "strašně", "opravdu" ];

const auxiliariesAndDelexicalizedVerbs = [ "mělo", "přijít", "podívat", "dělej", "dá", "dala", "přijde", "stojí",
	"udělám", "mohlo", "nechte", "nemáme", "dám", "přišla", "dělal", "dejte" ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"dobře", "dobrý", "dobrá", "dobré", "dost", "dlouho", "dlouha", "nejlepší", "poslední", "rychle", "lepší", "vlastní",
	"ostatní", "velký", "starý", "líp", "malé", "špatný", "lépe", "hlavní", "právo", "úžasné", "pěkný", "stejné", "spousta",
	"skvělá", "dobrej", "horší", "novou", "stará", "nového", "nejdřív", "druhou", "naposledy", "hezký", "dlouhý", "dobrý",
	"malý", "těžký", "velký", "zlý", "delší", "lepší", "menší", "těžší", "větší", "horší", "nejdelší", "nejlepší", "nejmenší",
	"nejtěžší", "největší", "nejhorší", "pěkně",
	// General adverbs.
	"všelijak", "nějak", "jaksi", "tak nějak", "ijak", "nikterak", "akkoli", "akkoliv", "kdejak", "už", "jen", "tady",
	"teď", "ještě", "možná", "nikdy", "ani", "taky", "pak", "trochu", "prostě", "víc", "jenom", "další", "právě", "zpátky",
	"vždycky", "pryč", "zase", "někdy", "také", "chvíli", "znovu", "snad", "třeba", "stále", "zrovna", "příliš", "nějak",
	"vždy", "skoro", "kolem", "později", "zpět", "najednou", "támhle", "někam", "hlavně", "často", "občas", "společně",
	"dokonce", "zde", "aspoň", "jediný", "pouze", "stačí", "mnohem", "zas", "nikam", "dávno", "již", "dvakrát", "vzhůru",
	"pomalu", "bohužel", "raději", "nejspíš", "náhodou", "okamžitě" ];

const interjections = [ "jo", "hej", "oh", "uh ", "hele", "fajn", "ok", "proboha", "ah", "okay" ];

const recipeWords = [];

const timeWords = [ "den", "dnes", "čas", "ráno", "zítra", "dneska", "minut", "včera", "času", "dní", "dni", "dny",
	"hodinu", "hodin", "týdny", "měsíce", "roku", "měsíců" ];

const vagueNouns = [ "věc", "věci", "můžeš", "člověk", "lidi", "člověka", "člověku", "člověče", "člověku", "člověkovi",
	"lidech", "lidem", "lidé", "lidí", "člověkem", "lidmi", "chlap", "místa" ];

const miscellaneous = [ "atd.", "bůhvíkdo", "bůhvíjaký", "bůhvíčí", "nevímco", "nevímkdo a podobně", "si", "ne", "ně",
	"pan", "pane", "pana", "paní", "prosím", "pořádku", "líto", "chlape", "slečno", "mimochodem" ];


export const all = transformWordsWithHyphens( [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous, transitionWords ) );

export default all;
