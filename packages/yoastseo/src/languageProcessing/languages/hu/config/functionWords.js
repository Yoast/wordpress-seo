import { singleWords as transitionWords } from "./transitionWords";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

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

const pronouns = [
	// Personal pronouns.
	"én", "engem", "enyém", "nekem", "velem", "értem", "bennem", "belém", "belőlem", "nálam", "hozzám", "tőlem",
	"rajtam", "rám", "rólam", "te", "téged", "tiéd", "neked", "veled", "érted", "benned", "beléd", "belőled", "nálad", "hozzád",
	"tőled", "rajtad", "rád", "rólad", "ő", "őt", "övé", "neki", "vele", "érte", "benne", "bele", "belé", "nála", "hozzá", "tőle",
	"rajta", "rá", "róla", "mi", "minket", "mienk", "nekünk", "velünk", "értünk", "bennünk", "belénk", "nálunk", "hozzánk", "tőlünk",
	"rajtunk", "ránk", "rólunk", "ti", "titeket", "tiétek", "nektek", "veletek", "értetek", "bennetek", "belétek", "nálatok",
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
	"olyanokká", "amolyanokká", "ugyanolyanokká",
	// Relative pronouns.
	"aki", "akit", "akié", "akinek", "akivel", "akiért", "akiben", "akibe", "akiből", "akinél", "akihez", "akitől", "akin",
	"akire", "akiről", "akivé", "ami", "amit", "amié", "aminek", "amivel", "amiért", "amiben", "amibe", "amiből", "aminél",
	"amihez", "amitől", "amin", "amire", "amiről", "amivé", "amilyen", "amilyet", "amilyennek", "amilyennel", "amilyenért",
	"amilyenben", "amilyenbe", "amilyenből", "amilyennél", "amilyenhez", "amilyentől", "amilyenen", "amilyenre", "amilyenről",
	"amilyenné", "amekkora", "amekkorát", "amekkorának", "amekkorával", "amekkoráért", "amekkorában", "amekkorába", "amekkorából",
	"amekkoránál", "amekkorához", "amekkorától", "amekkorán", "amekkorára", "amekkoráról", "amekkorává", "amely", "amelyet",
	"amelynek", "amellyel", "amelyért", "amelyben", "amelybe", "amelyből", "amelynél", "amelyhez", "amelytől", "amelyen", "amelyre",
	"amelyről", "amellyé", "ahány", "ahányat", "ahánynak", "ahánnyal", "ahányért", "ahányban", "ahányba", "ahányból", "ahánynál",
	"ahányhoz", "ahánytól", "ahányan", "ahányra", "ahányról", "ahánnyá", "amennyi", "amennyit", "amennyinek", "amennyivel",
	"amennyiért", "amennyiben", "amennyibe", "amennyiből", "amennyinél", "amennyihez", "amennyitől", "amennyin", "amennyire",
	"amennyiről", "amennyivé", "ahányadik", "ahányadikat", "ahányadiknak", "ahányadika", "ahányadikért", "ahányadikban",
	"ahányadikba", "ahányadikból", "ahányadiknál", "ahányadikhoz", "ahányadiktól", "ahányadikon", "ahányadikra", "ahányadikról",
	"ahányadikká", "ahová", "ahonnan", "ahonnantól", "amerre", "amerről", "ahogy", "ahogyan", "amiért", "amikor", "amikortól",
	"amikorra", "akik", "akiket", "akiké", "akiknek", "akikkel", "akikért", "akikben", "akikbe", "akikból", "akiknél", "akikhez",
	"akiktől", "akiken", "akikre", "akikről", "akikké", "amik", "amiket", "amiké", "amiknek", "amikkel", "amikért", "amikben",
	"amikbe", "amikból", "amiknél", "amikhez", "amiktől", "amiken", "amikre", "amikről", "amikké", "amilyenek", "amilyeneket",
	"amilyeneknek", "amilyenekkel", "amilyenekért", "amilyenekben", "amilyenekbe", "amilyenekből", "amilyeneknél", "amilyenekhez",
	"amilyenektől", "amilyeneken", "amilyenekre", "amilyenekről", "amekkorák", "amekkorákat", "amekkoráknak", "amekkorákkal",
	"amekkorákért", "amekkorákban", "amekkorákba", "amekkorákból", "amekkoráknál", "amekkorákhoz", "amekkoráktól", "amekkorákon",
	"amekkorákra", "amekkorákról", "amekkorákká", "amelyek", "amelyeket", "amelyeknek", "amelyekkel", "amelyekért", "amelyekben",
	"amelyekbe", "amelyekből", "amelyeknél", "amelyekhez", "amelyektől", "amelyeken", "amelyekre", "amelyekről", "ahányak", "ahányakat",
	"ahányaknak", "ahányakkal", "ahányakért", "ahányakban", "ahányakba", "ahányakból", "ahányaknál", "ahányakhoz", "ahányaktól", "ahányakon",
	"ahányakra", "ahányakról", "ahányakká", "amennyik", "amennyiket", "amennyiknek", "amennyikkel", "amennyikért", "amennyikben", "amennyikbe",
	"amennyikből", "amennyiknél", "amennyikhez", "amennyiktől", "amennyiken", "amennyikre", "amennyikről", "amennyikké", "ahányadikak",
	"ahányadikat", "ahányadiknak", "ahányadikkal", "ahányadikért", "ahányadikban", "ahányadikba", "ahányadikból", "ahányadiknál",
	"ahányadikhoz", "ahányadiktól", "ahányadikon", "ahányadikra", "ahányadikról", "ahányadikká", "amikért",
	// Reciprocal pronouns.
	"egymás", "egymást", "egymásé", "egymásnak", "egymással", "egymásért", "egymásban", "egymásba", "egymásból", "egymásnál",
	"egymáshoz", "egymástól", "egymáson", "egymásra", "egymásról", "egymássá" ];


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

const quantifiers = [ "sok", "kevés", "elég", "jónéhány", "néhány", "rengeteg", "töredék", "temérdek", "tengernyi", "számtalan",
	"számos", "elegendő", "kevéske", "egy csomó", "egy rakás", "egy halom" ];

const reflexivePronouns = [ "magam", "magamat", "magamé", "magamnak", "magammal", "magamért", "magamban", "magamba", "magamból",
	"magamnál", "magamhoz", "magamtól", "magamon", "magamra", "magamról", "magammá", "magad", "magadat", "magadé", "magadnak",
	"magaddal", "magadért", "magadban", "magadba", "magadból", "magadnál", "magadhoz", "magadtól", "magadon", "magadra", "magadról",
	"magaddá", "maga", "magát", "magáé", "magának", "magával", "magáért", "magában", "magába", "magából", "magánál", "magához",
	"magától", "magán", "magára", "magáról", "magává", "magunk", "magunkat", "magunké", "magunknak", "magunkkal", "magunkért",
	"magunkban", "magunkba", "magunkból", "magunknál", "magunkhoz", "magunktól", "magunkon", "magunkra", "magunkról", "magunkká",
	"magatok", "magatokat", "magatoké", "magatoknak", "magatokkal", "magatokért", "magatokban", "magatokba", "magatokból",
	"magatoknál", "magatokhoz", "magatoktól", "magatokon", "magatokra", "magatokról", "magatokká", "maguk", "magukat", "maguké",
	"maguknak", "magukkal", "magukért", "magukban", "magukba", "magukból", "maguknál", "magukhoz", "maguktól", "magukon",
	"magukra", "magukról", "magukká" ];

const indefinitePronouns = [ "valaki", "valakit", "valakié", "valakinek", "valakivel", "valakiért", "valakiben", "valakibe", "valakiből", "valakinél",
	"valakihez", "valakitől", "valakin", "valakire", "valakiről", "valakivé", "valami", "valamit", "valamié", "valaminek",
	"valamivel", "valamiért", "valamiben", "valamibe", "valamiből", "valaminél", "valamihez", "valamitől", "valamin", "valamire",
	"valamiről", "valamivé", "valamilyen", "valamilyet", "valamilyennek", "valamilyennel", "valamilyenért", "valamilyenben",
	"valamilyenbe", "valamilyenből", "valamilyennél", "valamilyenhez", "valamilyentől", "valamilyenen", "valamilyenre", "valamilyenről",
	"valaminő", "valamelyes", "valamelyest", "valamekkora", "valamekkorát", "valamekkorának", "valamekkorával", "valamekkoráért",
	"valamekkorában", "valamekkorába", "valamekkorából", "valamekkoránál", "valamekkorához", "valamekkorától", "valamekkorán",
	"valamekkorára", "valamekkoráról", "valamekkorává", "valamely", "valamelyet", "valamelynek", "valamellyel", "valamelyért",
	"valamelyben", "valamelybe", "valamelyből", "valamelynél", "valamelyhez", "valamelytől", "valamelyen", "valamelyre",
	"valamelyről", "valamellyé", "valamelyik", "valamelyiket", "valemelyiknek", "valamelyikkel", "valamelyikért", "valamelyikben",
	"valamelyikbe", "valamelyikből", "valamelyiknél", "valamelyikhez", "valamelyiktől", "valamelyiken", "valamelyikre", "valamelyikről",
	"valamelyikké", "valamiféle", "valamifélét", "valamifélének", "valamifélével", "valamiféléért", "valamifélében", "valamifélébe",
	"valamiféléből", "valamifélénél", "valamiféléhez", "valamifélétől", "valamifélén", "valamifélére", "valamiféléről", "valamennyi",
	"valamennyit", "valamennyié", "valamennyinek", "valamennyivel", "valamennyiért", "valamennyiben", "valamennyibe", "valamennyiből",
	"valamennyinél", "valamennyihez", "valamennyitől", "valamennyin", "valamennyire", "valamennyiről", "valamennyivé", "valahány",
	"valahányat", "valahánynak", "valahánnyal", "valahányért", "valahányban", "valahányba", "valahányból", "valahánynál", "valahányhoz",
	"valahánytól", "valahányon", "valahányra", "valahányról", "valahánnyá", "némely", "némelyet", "némelynek", "némelynél", "némelyért",
	"némelyben", "némelybe", "némelyből", "némelynél", "némelyhez", "némelytől", "némelyen", "némelyre", "némelyről", "némi",
	"némelyik", "némelyiket", "némelyiknek", "némelyikkel", "némelyikért", "némelyikben", "némelyikbe", "némelyikből", "némelyiknél",
	"némelyikhez", "némelyiktől", "némelyiken", "némelyikre", "némelyikről", "néminemű", "néhány", "néhányat", "néhánynak", "néhánnyal",
	"néhányért", "néhányban", "néhányba", "néhányból", "néhánynál", "néhányhoz", "néhánytól", "néhányon", "néhányra", "néhányról",
	"valahol", "valahová", "valamerre", "valahonnan", "valamikor", "valaha", "valaha", "valahogyan", "valamiképpen", "valamiért",
	"néhol", "néha", "némelykor", "némiképpen", "némileg", "mindenki", "mindenféle", "mindegyik", "mindahány", "mindenhol", "mindenütt",
	"mindenhová", "mindenhonnan", "mindenkor", "mindenhogyan", "mindenképpen", "bárki", "bármi", "bármelyik", "bármilyen", "bármennyi",
	"bárhol", "bárhová", "bárhonnan", "bármikor", "bármeddig", "bárhogyan", "akárki", "akármi", "akármelyik", "akármilyen", "akármennyi",
	"akárhány", "akárhol", "akárhová", "akárhonnan", "akármikor", "akárhogyan", "senki", "semmi", "semmilyen", "semennyi", "sehány",
	"sehol", "sehová", "sehonnan", "semmikor", "sehogy", "semmiképp", "valakik", "valakiket", "valakiké", "valakiknek", "valakikkel",
	"valakikért", "valakikben", "valakikbe", "valakikből", "valakiknél", "valakikhez", "valakiktől", "valakiken", "valakikre",
	"valakikről", "valakikké", "valamik", "valamiket", "valamiké", "valamiknek", "valamikkel", "valamikért", "valamikben",
	"valamikbe", "valamikből", "valamiknél", "valamikhez", "valamiktől", "valamiken", "valamikre", "valamikről", "valamikké",
	"valamilyenek", "valamilyeneket", "valamilyeneknek", "valamilyenekkel", "valamilyenekért", "valamilyenekben", "valamilyenekbe",
	"valamilyenekből", "valamilyeneknél", "valamilyenekhez", "valamilyenektől", "valamilyeneken", "valamilyenekre", "valamilyenekről",
	"valamilyenekké", "valaminők", "valamekkorák", "valamekkorákat", "valamekkoráknak", "valamekkorákkal", "valamekkorákért",
	"valamekkorákban", "valamekkorákba", "valamekkorákból", "valamekkoráknál", "valamekkorákhoz", "valamekkoráktól", "valamekkorákon",
	"valamekkorákra", "valamekkorákról", "valamelyek", "valamelyeket", "valamelyeknek", "valamelyekkel", "valamelyekért",
	"valamelyekben", "valamelyekbe", "valamelyekből", "valamelyeknél", "valamelyekhez", "valamelyektől", "valamelyeken",
	"valamelyekre", "valamelyekről", "valamelyekké", "valamelyikek", "valamelyikeket", "valamelyikeknek", "valamelyikekkel",
	"valamelyikekért", "valamelyikekben", "valamelyikekbe", "valamelyikekből", "valamelyikeknél", "valamelyikekhez", "valamelyikektől",
	"valamelyikeken", "valamelyikekre", "valamelyikekről", "valamifélék", "valamiféléket", "valamiféléknek", "valamifélékkel",
	"valamifélékért", "valamifélékben", "valamifélékbe", "valamifélékből", "valamiféléknél", "valamifélékhez", "valamiféléktől",
	"valamiféléken", "valamifélékre", "valamifélékről", "valamennyik", "valamennyiket", "valamennyiknek", "valamennyikkel",
	"valamennyikért", "valamennyikben", "valamennyikbe", "valamennyikből", "valamennyiknél", "valamennyikhez", "valamennyiktől",
	"valamennyiken", "valamennyikre", "valamennyikről", "valahányak", "valahányakat", "valahányaknak", "valahányakkal",
	"valahányakért", "valahányakban", "valahányakba", "valahányakból", "valahányaknál", "valahányakhoz", "valahányaktól",
	"valahányakon", "valahányakra", "valahányakról", "némelyek", "némelyeket", "némelyeknek", "némelyekkel", "némelyekért",
	"némelyekben", "némelyekbe", "némelyekből", "némelyeknél", "némelyekhez", "némelyektől", "némelyeken", "némelyekre", "némelyekről",
	"némelyikek", "némelyikeket", "némelyikeknek", "némelyikekkel", "némelyikekért", "némelyikekben", "némelyikekbe", "némelyikekből",
	"némelyikeknél", "némelyikekhez", "némelyikektől", "némelyikeken", "némelyikekre", "némelyikekről", "néhányak", "néhányakat",
	"néhányaknak", "néhányakkal", "néhányakért", "néhányakban", "néhányakba", "néhányakból", "néhányaknál", "néhányakhoz",
	"néhányaktól", "néhányakon", "néhányakra", "néhányakról" ];

const postpositions = [ "előtt", "elé", "elől", "alatt", "alá", "alól", "túl", "alatt", "belül", "előtt", "fogva", "hosszat",
	"múlva", "óta", "tájt", "ellen", "helyett", "iránt", "miatt", "nélkül", "részére", "számára", "végett", "között" ];

const conjunctions = [ "és", "s", "se", "sem", "vagy", "is", "de" ];

const interviewVerbs = [ "mond", "bejelent", "megerősít", "kijelent", "javasol", "említ", "tájékoztat", "értesít", "kérdez",
	"beszél", "megkérdez", "állít", "elmagyaráz", "magyaráz", "gondol", "hisz", "megtárgyal", "tárgyal", "vitat", "megvitat",
	"ért", "megért", "elmond", "elmesél", "tud", "megtud", "megbeszél", "megmond", "megmagyaráz" ];

const intensifiers = [ "alig", "kissé", "különösen", "nagyon", "teljesen", "túl", "túlságosan", "kevésbé", "nagyrészt",
	"kicsit", "picit", "szörnyen", "borzasztóan", "iszonyatosan", "irtó", "irtózatosan", "komolyan", "súlyosan", "könnyedén",
	"nehezen" ];

const auxiliariesAndDelexicalizedVerbs = [ "fog", "volna", "akar", "bír", "kell", "kíván", "látszik", "lehet", "tud",
	"szabad", "tetszik", "méltóztatik", "szokott" ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"nagy", "kicsi", "gyors", "lassú", "jó", "rossz", "drága", "olcsó", "vastag", "vékony",
	"keskeny", "széles", "puha", "hangos", "halk", "intelligens", "buta", "nedves", "száraz", "nehéz", "könnyű", "kemény",
	"lágy", "sekély", "mély", "gyönge", "erős", "gazdag", "szegény", "fiatal", "öreg", "hosszú", "rövid", "magas", "alacsony",
	"bőkezű", "fukar", "igaz", "hamis", "gyönyörű", "csúnya", "új", "régi", "boldog", "szomorú", "idős", "gyenge", "biztonságos",
	"veszélyes", "korán", "későn", "világos", "sötét", "nyitva", "zárva", "szoros", "laza", "teli", "üres", "sok", "kevés", "élő",
	"halott", "meleg", "hideg", "érdekes", "unalmas", "szerencsés", "szerencsétlen", "fontos", "lényegtelen", "messze", "közel",
	"tiszta", "piszkos", "kedves", "gonosz", "kellemes", "kellemetlen", "kiváló", "borzalmas", "normális", "szép",
	// General adverbs.
	"nagyon", "kicsit", "gyorsan", "lassan", "jól", "rosszul", "drágán", "olcsón", "hangosan", "halkan", "nehezen", "könnyen",
	"gyengén", "erősen", "gazdagon", "fiatalon", "öreg", "hosszan", "röviden", "magasan", "alacsonyan", "bőkezűen", "gyönyörűen",
	"csúnyán", "boldogan", "szomorúan", "gyengéden", "biztonságosan", "veszélyesen", "világosan", "szorosan", "lazán", "sokan",
	"kevesen", "élve", "melegen", "hidegen", "érdekesen", "unalmasan", "szerencsésen", "szerencsétlenül", "tisztán", "piszkosan",
	"kedvesen", "gonoszan", "kellemesen", "kellemetlenül", "kiválóan", "borzalmasan", "normálisan", "szépen" ];

const interjections = [ "ó", "óh", "jaj", "a kutyafáját", "a fenébe", "a csudába", "a francba", "atyaég", "atyavilág", "azta",
	"aztamindenit", "juj", "juhú", "éljen", "jé", "hű", "hú", "ajjaj", "pszt", "csitt", "hess", "hé", "ej", "ejnye", "na",
	"nicsak", "nocsak", "natessék", "nahát", "rajta", "hajrá", "juhú", "teringettét", "nosza", "uccu", "csitt", "kuss",
	"dirr", "durr" ];

const recipeWords = [ "liter", "l", "deciliter", "dl", "milliliter", "gramm", "g", "dekagramm", "dkg", "kilogramm", "kg",
	"milligramm", "mg", "tucat", "centiliter", "cl", "méter", "m", "deciméter", "dm", "centiméter", "cm", "milliméter", "mm",
	"evőkanál", "ek.", "mokkáskanál", "mk.", "kávéskanál", "kk.", "gyermekkanál", "gyk.", "kávéscsésze", "kcs.", "teáscsésze",
	"tcs.", "csésze", "csé.", "bögre", "bgr.", "mélytányér", "ujjnyi", "csomag", "gerezd", "csokor" ];

const timeWords = [ "másodperc", "perc", "óra", "nap", "hét", "hónap", "év", "évtized", "évszázad", "évezred", "ma", "holnap",
	"tegnap", "jövő héten", "jövő hónapban", "jövő évben", "múlt héten", "múlt hónapban", "múlt évben", "tavaly", "jövőre",
	"reggel", "délben", "este", "éjszaka", "hajnalban", "délután", "délelőtt" ];

const vagueNouns = [ "dolog", "izé", "valami", "személy", "ember", "alkalom", "eset", "ügy", "tárgy", "valamicsoda",
	"téma", "ötlet" ];

const miscellaneous = [
	"stb.",
	// Fractions.
	"fél", "harmad", "negyed", "ötöd", "hatod", "heted", "nyolcad", "kilenced", "tized", "egyharmad", "egynegyed", "egyötöd",
	"egyhatod", "egyheted", "egynyolcad", "egykilenced", "egytized", "század", "ezred" ];


export const all = transformWordsWithHyphens( [].concat( articles, cardinalNumerals, ordinalNumerals, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, postpositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, miscellaneous, transitionWords ) );

export default all;
