/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */
const articles = [ "a", "az", "egy" ];

const cardinalNumerals = [ "egy", "kettő", "három", "négy", "öt", "hat", "hét", "nyolc", "kilenc", "tíz", "tizenegy",
	"tizenkettő", "tizenhárom", "tizennégy", "tizenöt", "tizenhat", "tizenhét", "tizennyolc", "tizenkilenc", "húsz",
	"száz", "ezer", "tízezer", "százezer", "millió", "félmillió", "egymillió" ];

const ordinalNumerals = [ "első", "második", "harmadik", "negyedik", "ötödik", "hatodik", "hetedik", "nyolcadik",
	"kilencedik", "tizedik", "tizenegyedik", "tizenkettedik", "tizenharmadik", "tizennegyedik", "tizenötödik",
	"tizenhatodik", "tizenhetedik", "tizennyolcadik", "tizenkilencedik", "huszadik", "századik", "ezredik", "tízezredik",
	"százezredik", "milliomodik", "egymilliomodik" ];

const pronouns = [ "én", "engem", "enyém", "nekem", "velem", "értem", "bennem", "belém", "belőlem", "nálam", "hozzám", "tőlem",
	"rajtam", "rám", "rólam", "te", "téged", "tiéd", "neked", "veled", "érted", "benned", "beléd", "belőled", "nálad", "hozzád",
	"tőled", "rajtad", "rád", "rólad", "ő", "őt", "övé", "neki", "vele", "érte", "benne", "bele", "belé", "nála", "hozzá", "tőle",
	"rajta", "rá", "róla", "mi", "minket", "mienk", "nekünk", "velünk", "értünk", "bennünk", "belénk", "nálunk", "hozzánk", "tőlünk",
	"rajtunk", "ránk", "rólunk", "ti", "titeket", "tiétek", "nektek", "veletek", "értetek",  "bennetek", "belétek", "nálatok",
	"hozzátok", "tőletek", "rajtatok", "rátok", "rólatok", "ők", "őket", "övék", "nekik", "velük", "értük", "bennük", "beléjük",
	"náluk", "hozzájuk", "tőlük", "rajtuk", "rájuk", "róluk", "Ön", "Önt", "Öné", "Önnek", "Önnel", "Önért", "Önben", "Önbe",
	// Formal pronouns.
	"Ön", "Önt", "Öné", "Önnek", "Önnel", "Önért", "Önben", "Önbe", "Önből", "Önnél", "Önhöz", "Öntől", "Önön", "Önre",
	"Önről", "Önök", "Önöket", "Önöké", "Önöknek", "Önökkel", "Önökért", "Önökben", "Önökbe", "Önökből", "Önöknél", "Önökhöz",
	"Önöktől", "Önökön", "Önökre", "Önökről",
	// Demonstrative pronouns.
	"ez", "emez", "ugyanez", "ezt", "emezt", "ugyanezt", "ezé", "emezé", "ugyanezé", "ennek", "emennek", "ugyanennek", "ezzel",
	"emezzel", "ugyanezzel", "ezért", "emezért", "ugyanezért", "ebben", "emebben", "ugyanebben", "ebbe", "emebbe", "ugyanebbe",
	"ebből", "emebből", "ugyanebből", "ennél", "emennél", "ugyanennél", "ehhez", "emehhez", "ugyanehhez", "ettől", "emettől",
	"ugyanettől", "ezen", "emezen", "ugyanezen", "erre", "emerre", "ugyanerre", "erről", "emerről", "ugyanerről", "eddig",
	"emeddig", "ugyaneddig", "ekkor", "emekkor", "ugyanekkor", "ezzé", "emezzé", "ugyanezzé", "ekként", "emekként", "ugyanekként",
	"az", "amaz", "ugyanaz", "azt", "amazt", "ugyanazt", "azé", "amazé", "ugyanazé", "annak", "amannak", "ugyanannak", "azzal",
	"amazzal", "ugyanazzal", "azért", "amazért", "ugyanazért", "abban", "amabban", "ugyanabban", "abba", "amabba", "ugyanabba",
	"abból", "amabból", "ugyanabból", "annál", "amannál", "ugyanannál", "ahhoz", "amahhoz", "ugyanahhoz", "attól", "amattól",
	"ugyanattól", "azon", "amazon", "ugyanazon", "arra", "amarra", "ugyanarra", "arról", "amarról", "ugyanarról", "addig",
	"amaddig", "ugyanaddig", "akkor", "amakkor", "ugyanakkor", "azzá", "amazzá", "ugyanazzá", "akként", "amakként", "ugyanakként",
	"ilyen", "emilyen", "ugyanilyen", "ilyet", "emilyet", "ugyanilyet", "ilyennek", "emilyennek", "ugyanilyennek", "ilyennel",
	"emilyennel", "ugyanilyennel", "ilyenért", "emilyenért", "ugyanilyenért", "ilyenben", "emilyenben", "ugyanilyenben", "ilyenbe",
	"emilyenbe", "ugyanilyenbe", "ilyenből", "emilyenből", "ugyanilyenből", "ilyennél", "emilyennél", "ugyanilyennél", "ilyenhez",
	"emilyenhez", "ugyanilyenhez", "ilyentől", "emilyentől", "ugyanilyentől", "ilyenen", "emilyenen", "ugyanilyenen", "ilyenre",
	"emilyenre", "ugyanilyenre", "ilyenről", "emilyenről", "ugyanilyenről", "ilyenkor", "emilyenkor", "ugyanilyenkor", "ilyenné",
	"emilyenné", "ugyanilyenné", "olyan", "amolyan", "ugyanolyan", "olyat", "amolyat", "ugyanolyat", "olyannak", "amolyannak",
	"ugyanolyannak", "olyannal", "amolyannal", "ugyanolyannal", "olyanért", "amolyanért", "ugyanolyanért", "olyanban", "amolyanban",
	"ugyanolyanban", "olyanba", "amolyanba", "ugyanolyanba", "olyanból", "amolyanból", "ugyanolyanból", "olyannál", "amolyannál",
	"ugyanolyannál", "olyanhoz", "amolyanhoz", "ugyanolyanhoz", "olyantól", "amolyantól", "ugyanolyantól", "olyanon", "amolyanon",
	"ugyanolyanon", "olyanra", "amolyanra", "ugyanolyanra", "olyanról", "amolyanról", "ugyanolyanról", "olyankor", "amolyankor",
	"ugyanolyankor", "olyanná", "amolyanná", "ugyanolyanná", "ennyi", "emennyi", "ugyanennyi", "ennyit", "emennyit", "ugyanennyit",
	"ennyinek", "emennyinek", "ugyanennyinek", "ennyivel", "emennyivel", "ugyanennyivel", "ennyiért", "emennyiért", "ugyanennyiért",
	"ennyiben", "emennyiben", "ugyanennyiben", "ennyibe", "emennyibe", "ugyanennyibe", "ennyiből", "emennyiből", "ugyanennyiből",
	"ennyinél", "emennyinél", "ugyanennyinél", "ennyihez", "emennyihez", "ugyanennyihez", "ennyitől", "emennyitől", "ugyanennyitől",
	"ennyin", "emennyin", "ugyanennyin", "ennyire", "emennyire", "ugyenennyire", "ennyiről", "emennyiről", "ugyanennyiről",
	"ennyivé", "emennyivé", "ugyanennyivé", "annyi", "amannyi", "ugyanannyi", "annyit", "amannyit", "ugyanannyit", "annyinak",
	"amannyinak", "ugyanannyinak", "annyival", "amannyival", "ugyanannyival", "annyiért", "amannyiért", "ugyanannyiért", "annyiban",
	"amannyiban", "ugyanannyiban", "annyiba", "amannyiba", "ugyanannyiba", "annyiból", "amannyiból", "ugyanannyiból", "annyinál",
	"amannyinál", "ugyanannyinál", "annyihoz", "amannyihoz", "ugyanannyihoz", "annyitól", "amannyitól", "ugyananyitól", "annyin",
	"amannyin", "ugyanannyin", "annyira", "amannyira", "ugyanannyira", "annyiról", "amannyiról", "ugyanannyiról", "annyivá",
	"amannyivá", "ugyanannyivá", "így", "emígy", "ugyanígy", "úgy", "amúgy", "ugyanúgy", "itt", "ott", "ugyanitt", "ogyanott",
	"ide", "oda", "ugyanide", "ugyanoda", "amoda", "emide", "innen", "onnan", "ugyaninnen", "ogyanonnan", "amonnan", "eminnen",
	"eddig", "addig", "ezután", "azután", "ezelőtt", "azelőtt", "ugyaneddig", "ugyanaddig", "emeddig", "amaddig", "ekkora",
	"ekkorát", "ekkorának", "ekkorával", "ekkoráért", "ekkorában", "ekkorába", "ekkorából", "ekkoránál", "ekkorához", "ekkorától",
	"ekkorán", "ekkorára", "ekkoráról", "ekkorává", "akkora", "akkorát", "akkorának", "akkorával", "akkoráért", "akkorában",
	"akkorába", "akkorából", "akkoránál", "akkorához", "akkorától", "akkorán", "akkorára", "akkoráról", "akkorává",
	"ekképpen", "akképpen", "ezek", "emezek", "ugyanezek", "ezeket", "emezeket", "ugyanezeket", "ezeké", "emezeké", "ugyanezeké",
	"ezeknek", "emezeknek", "ugyanezeknek", "ezekkel", "emezekkel", "ugyanezekkel", "ezekért", "emezekért", "ugyanezekért",
	"ezekben", "emezekben", "ugyanezekben", "ezekbe", "emezekbe", "ugyanezekbe", "ezekből", "emezekből", "ugyanezekből",
	"ezeknél", "emezeknél", "ugyanezeknél", "ezekhez", "emezekhez", "ugyanezekhez", "ezektől", "emezektől", "ugyanezektől",
	"ezekre", "emezekre", "ugyanezekre", "ezekről", "emezekről", "ugyanezekről", "ezekig", "emezekig", "ugyanezekig", "ezekké",
	"emezekké", "ugyanezekké", "ezekként", "emezekként", "ugyanezekként", "azok", "amazok", "ugyanazok", "azokat", "amazokat",
	"ugyanazokat", "azoké", "amazoké", "ugyanazoké", "azoknak", "amazoknak", "ugyanazoknak", "azokkal", "amazokkal", "ugyanazokkal",
	"azokért", "amazokért", "ugyanazokért", "azokban", "amazokban", "ugyanazokban", "azokba", "amazokba", "ugyanazokba", "azokból",
	"amazokból", "ugyanazokból", "azoknál", "amazoknál", "ugyanazoknál", "azokhoz", "amazokhoz", "ugyanazokhoz", "azoktól",
	"amazoktól", "ugyanazoktól", "azokra", "amazokra", "ugyanazokra", "azokról", "amazokról", "ugyanazokról", "azokig", "amazokig",
	"ugyanazokig", "azokká", "amazokká", "ugyanazokká", "ilyenek", "emilyenek", "ugyanilyenek", "ilyeneket", "emilyeneket",
	"ugyanilyeneket", "ilyeneknek", "emilyeneknek", "ugyanilyeneknek", "ilyenekkel", "emilyenekkel", "ugyanilyenekkel", "ilyenekért",
	"emilyenekért", "ugyanilyenekért", "ilyenekben", "emilyenekben", "ugyanilyenekben", "ilyenekbe", "emilyenekbe", "ugyanilyenekbe",
	"ilyenekből", "emilyenekből", "ugyanilyenekből", "ilyeneknél", "emilyeneknél", "ugyanilyeneknél", "ilyenekhez", "emilyenekhez",
	"ugyanilyenekhez", "ilyenektől", "emilyenektől", "ugyanilyenektől", "ilyeneken", "emilyeneken", "ugyanilyeneken", "ilyenekre",
	"emilyenekre", "ugyanilyenekre", "ilyenekről", "emilyenekről", "ugyanilyenekről", "ilyenekké", "emilyenekké", "ugyanilyenekké",
	"olyanok", "amolyanok", "ugyanolyanok", "olyanokat", "amolyanokat", "ugyanolyanokat", "olyanoknak", "amolyanoknak", "ugyanolyanoknak",
	"olyanokkal", "amolyanokkal", "ugyanolyanokkal", "olyanokért", "amolyanokért", "ugyanolyanokért", "olyanokban", "amolyanokban",
	"ugyanolyanokban", "olyanokba", "amolyanokba", "ugyanolyanokba", "olyanokból", "amolyanokból", "ugyanolyanokból", "olyanoknál",
	"amolyanoknál", "ugyanolyanoknál", "olyanokhoz", "amolyanokhoz", "ugyanolyanokhoz", "olyanoktól", "amolyanoktól", "ugyanolyanoktól",
	"olyanokon", "amolyanokon", "ugyanolyanokon", "olyanokra", "amolyanokra", "ugyanolyanokra", "olyanokról", "amolyanokról", "ugyanolyanokról",
	"olyanokká", "amolyanokká", "ugyanolyanokká" ];

const interrogatives = [ "ki", "kit", "kié", "kinek", "kivel", "kiért", "kiben", "kibe", "kiből", "kinél", "kihez", "kitől",
	"kin", "kire", "kiről", "kicsoda", "kicsodát", "kicsodának", "kicsodával", "kicsodáért", "kicsodában", "kicsodába",
	"kicsodából", "kicsodánál", "kicsodához", "kicsodától", "kicsodán", "kicsodára", "kicsodáról", "mi", "mit", "minek",
	"mivel", "miért", "miben", "mibe", "miből", "minél", "mihez", "mitől", "min", "mire", "miről", "micsoda", "micsodát",
	"micsodának", "micsodával", "micsodáért", "micsodában", "micsodába", "micsodából", "micsodánál", "micsodához", "micsodától",
	"micsodán", "micsodára", "micsodáról", "milyen", "milyet", "milyennek", "milyennel", "milyenért", "milyenben", "milyenbe",
	"milyenből", "milyennél", "milyenhez", "milyentől", "milyenen", "milyenre", "milyenről", "mekkora", "mekkorát", "mekkorának",
	"mekkorával", "mekkoráért", "mekkorában", "mekkorába", "mekkorából", "mekkoránál", "mekkorához", "mekkorától", "mekkorán",
	"mekkorára", "mekkoráról", "miféle", "mifélét", "mifélének", "mifélével", "miféléért", "mifélében", "mifélébe", "miféléből",
	"mifélénél", "miféléhez", "mifélétől", "mifélén", "mifélére", "miféléről", "melyik", "melyiket", "melyiknek", "melyikkel",
	"melyikért", "melyikben", "melyikbe", "melyikből", "melyiknél", "melyikhez", "melyiktől", "melyiken", "melyikre", "melyikről",
	"hány", "hányat", "hánynak", "hánnyal", "hányért", "hányban", "hányba", "hányból", "hánynál", "hányhoz", "hánytól", "hányon",
	"hányra", "hányról", "mennyi", "mennyit", "mennyinek", "mennyivel", "mennyiért", "mennyiben", "mennyibe", "mennyiből",
	"mennyinél", "mennyihez", "mennyitől", "mennyin", "mennyire", "mennyiről", "hányadik", "hányadikat", "hányadiknak",
	"hányadikkal", "hányadikért", "hányadikban", "hányadikba", "hányadikból", "hányadiknál", "hányadikhoz", "hányadiktól",
	"hányadikon", "hányadikra", "hányadikról", "hol", "hová", "honnan", "honnantól", "honnanról", "merre", "mettől", "merről",
	"meddig", "meddigtől", "meddigről", "mióta", "hogyan", "miként", "kik", "kiket", "kiknek", "kikkel", "kikért", "kikben",
	"kikbe", "kikből", "kiknél", "kikhez", "kiktől", "kiken", "kikre", "kikről", "kicsodák", "kicsodákat", "kicsodáknak",
	"kicsodákkal", "kicsodákért", "kicsodákban", "kicsodákba", "kicsodákból", "kicsodáknál", "kicsodákhoz", "kicsodáktól",
	"kicsodákon", "kicsodákra", "kicsodáról", "mik", "miket", "miknek", "mikkel", "mikért", "mikben", "mikbe", "mikből", "miknél",
	"mikhez", "miktől", "miken", "mikre", "mikről", "micsodák", "micsodákat", "micsodáknak", "micsodákkal", "micsodákért",
	"micsodákban", "micsodákba", "micsodákból", "micsodáknál", "micsodákhoz", "micsodáktól", "micsodákon", "micsodákra", "micsodákról",
	"milyenek", "milyeneket", "milyeneknek", "milyenekkel", "milyenekért", "milyenekben", "milyenekbe", "milyenekből", "milyeneknél",
	"milyenekhez", "milyenektől", "milyeneken", "milyenekre", "milyenekről", "mekkorák", "mekkorákat", "mekkoráknak", "mekkorákkal",
	"mekkorákért", "mekkorákban", "mekkorákba", "mekkorákból", "mekkoráknál", "mekkorákhoz", "mekkoráktól", "mekkorákon", "mekkorákra",
	"mekkorákról", "mifélék", "miféléket", "miféléknek", "mifélékkel", "mifélékért", "mifélékben", "mifélékbe", "mifélékből", "miféléknél",
	"mifélékhez", "miféléktől", "miféléken", "mifélékre", "mifélékről", "melyikek", "melyikeket", "melyikeknek", "melyikekkel", "melyikekért",
	"melyikekben", "melyikekbe", "melyikekből", "melyikeknél", "melyikekhez", "melyikektől", "melyikeken", "melyikekre", "melyikekről",
	"hányak", "hányakat", "hányaknak", "hányakkal", "hányakért", "hányakban", "hányakba", "hányakból", "hányaknál", "hányakhoz", "hányaktól",
	"hányakon", "hányakra", "hányakról", "mennyik", "mennyiket", "mennyiknek", "mennyikkel", "mennyikért", "mennyikben", "mennyikbe",
	"mennyikből", "mennyiknél", "mennyikhez", "mennyiktől", "mennyiken", "mennyikre", "mennyikről", "hányadikak", "hányadikakat",
	"hányadikaknak", "hányadikakkal", "hányadikakért", "hányadikakban", "hányadikakba", "hányadikakból", "hányadikaknál",
	"hányadikakhoz", "hányadikaktól", "hányadikakon", "hányadikakra", "hányadikakról" ];

const quantifiers = [  ];

const reflexivePronouns = [  ];

const indefinitePronouns = [  ];

const prepositions = [  ];

const conjunctions = [  ];

const interviewVerbs = [  ];

const intensifiers = [  ];

const auxiliariesAndDelexicalizedVerbs = [ ];

const generalAdjectivesAdverbs = [ ];

const interjections = [  ];

const recipeWords = [  ];

const timeWords = [ ];

const vagueNouns = [  ];

const miscellaneous = [ ];

const transitionWords = [  ];

/**
 * Returns function words for Hungarian.
 *
 * @returns {Object} Hungarian function words.
 */
export default function() {
	return {
		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
			quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
			intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
			timeWords, vagueNouns, miscellaneous, transitionWords ),
	};
}
