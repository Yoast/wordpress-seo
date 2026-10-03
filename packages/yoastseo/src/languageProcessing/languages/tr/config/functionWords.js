import { singleWords as transitionWords } from "./transitionWords";
import transformWordsWithHyphens from "../../../helpers/transform/transformWordsWithHyphens";

/**
 * Returns an object with function words.
 *
 * @returns {Object} The object filled with various categories of function word arrays.
 */

const articles = [ "bir" ];

const cardinalNumerals = [ "i̇ki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on", "on bir", "on i̇ki", "on üç", "on dört", "on beş",
	"on altı", "on yedi", "on sekiz", "on dokuz", "yirmi", "yirmi bir", "yirmi i̇ki", "yirmi üç", "yirmi dört", "yirmi beş", "yirmi altı",
	"yirmi yedi", "yirmi sekiz", "yirmi dokuz", "otuz", "kırk", "elli", "altmış", "yetmiş", "seksen", "doksan", "yüz", "bin", "milyon", "milyar" ];

const ordinalNumerals = [ "birinci", "i̇kinci", "üçüncü", "dördüncü", "beşinci", "altıncı", "yedinci", "sekizinci", "dokuzuncu", "onuncu" ];

const fractions = [ "tam", "yarım", "çeyrek", "üçte biri", "üçte ikisi", "tamamı", "yarısı", "çeyreği", "üçte biri", "üçte ikisi" ];

const pronouns = [
	// Personal pronouns.
	"ben", "sen", "o", "biz", "siz", "onlar", "beni", "seni", "onu", "bizi", "sizi", "onları", "bizleri", "sizleri", "bana", "sana", "ona", "bize",
	"size", "onlara", "bizlere", "sizlere", "bende", "sende", "onda", "bizde", "sizde", "onlarda", "bizlerde", "sizlerde", "benden", "senden",
	"ondan", "bizden", "sizden", "onlardan", "bizlerden", "sizlerden",
	// Possessive pronouns.
	"benim", "senin", "onun", "bizim", "sizin", "onların", "bizlerin", "sizlerin",
	// Demonstrative pronouns.
	"bu", "şu", "o", "öteki", "beriki", "bura", "şura", "ora", "burası", "şurası", "orası", "böylesi", "şöylesi", "öylesi", "bunlar", "şunlar",
	"onlar", "ötekiler", "berikiler", "buralar", "şuralar", "oralar",
	// Reciprocal pronouns.
	"birbiri", "birbirimiz", "birbiriniz", "birbirleri", "birbirimizi", "birbirinizi", "birbirlerini", "birbirimize", "birbirinize", "birbirlerine",
	"birbirimizde", "birbirinizde", "birbirlerinde", "birbirimizden", "birbirinizden", "birbirlerinden", "birbirimizle", "birbirinizle",
	"birbirleriyle",
];

const interrogatives = [ "kim", "kimi", "kime", "kimde", "kimden", "kimin", "kiminle", "ne", "neyi", "neyde", "neyden", "neyle", "ne için", "niçin",
	"niye", "ne diye", "nere", "nereyi", "nereye", "nerede", "nereden", "neresi", "neden", "hangi", "hangisi", "kaç", "kaçı", "kaçıncı", "kaçta",
	"nasıl", "ne kadar", "ne zaman", "mı", "hangi", "hangisi", "kimler", "kimleri", "kimlere", "kimlerde", "kimlerden", "neler", "neleri", "nelere",
	"nelerde", "nelerden", "hangiler", "hangileri", "hangilere" ];

const quantifiers = [ "hepsi", "bazısı", "çoğu", "birçoğu", "birazı", "hepsi", "bütünü", "yeteri kadarı", "birkaçı", "biri", "her ikisi",
	"i̇kisinden biri", "hiç biri", "diğeri", "tümü", "bir kısmı", "pek çoğu", "her biri", "bazı", "çok", "çoğu", "birçok", "biraz", "bütün",
	"yeteri kadar", "birkaç", "bir", "her iki", "hiç bir", "diğer", "tüm", "bir kısım", "pek çok", "her bir" ];

const reflexivePronouns = [ "kendi", "kendim", "kendimi", "kendime", "kendimde", "kendimden", "kendin", "kendini", "kendine", "kendinde", "kendinden",
	"kendisi", "kendiyle", "kendileri", "kendilerine", "kendilerinde", "kendilerinden", "kendileriyle" ];

const indefinitePronouns = [ "kimi", "kimse", "biri", "birisi", "başkası", "bazısı", "bir çoğu", "bir takımı", "birkaçı", "birazı", "herkes", "hepsi",
	"hepimiz", "hiçbiri", "herhangi biri", "her biri", "şey", "falan", "filan", "falanca", "öteberi", "tümü", "bütünü", "kimileri", "kimseler",
	"birileri", "başkaları", "bazıları", "bir çokları", "herkesler" ];

const prepositions = [ "i̇çin", "gibi", "kadar", "ancak", "yalnız", "i̇le", "sadece", "sanki", "değil", "üzere", "dair", "karşın", "rağmen", "özgü",
	"doğru", "dek", "değin", "ait", "beri", "başka", "itibaren", "dolayı", "ötürü", "adeta", "sırf", "diye", "tek", "karşı" ];

const conjunctions = [ "ve", "i̇le", "veya", "ya da", "yahut", "veyahut", "ama", "fakat", "lakin", "yalnız", "ancak", "oysa", "oysaki", "halbu ki",
	"ne var ki", "çünkü", "zira", "de", "da", "ki", "meğer", "madem", "mademki", "demek", "demek ki", "üstelik", "hatta", "yani", "hem...hem",
	"hem de", "ne", "kah", "i̇ster", "ister", "açıkcası", "bile", "ya", "da", "ise", "öyleyse", "kim bilir", "gerek", "gerekse de", "ta ki",
	"zati" ];

const interviewVerbs = [ "demek", "dedim", "dedin", "dedi", "dedik", "dediniz", "dediler", "der", "söylemek", "söyledim", "söyledin", "söyledi",
	"söyledik", "söylediniz", "söylediler", "söyler", "söylerler", "sormak", "sordum", "sordun", "sordu", "sorduk", "sordunuz", "sordular",
	"sorar", "sorarlar", "belirtmek", "belirttim", "belirttin", "belirtti", "belirttik", "belirttiniz", "belirttiler", "belirtir", "belirtirler",
	"açıklamak", "açıkladım", "açıkladın", "açıkladı", "açıkladık", "açıkladınız", "açıkladılar", "açıklar", "açıklarlar", "düşünmek", "düşündüm",
	"düşündün", "düşündü", "düşündük", "düşündünüz", "düşündüler", "düşünür", "düşünürler", "konuşmak", "konuşdum", "konuştun", "konuştu",
	"konuştuk", "konuştunuz", "konuştular", "konuşur", "konuşurlar", "bildirmek", "bildirdim", "bildirdin", "bildirdi", "bildirdik", "bildirdiniz",
	"bildirdiler", "birdirir", "bildirirler", "ele", "almak", "aldım", "aldın", "aldı", "aldık", "aldınız", "aldılar", "önermek", "önerdim",
	"önerdin", "önerdi", "önerdik", "önerdiniz", "önerdiler", "önerir", "önerirler", "anlamak", "anladım", "anladın", "anladı", "anladık",
	"anladınız", "anladılar", "anlar", "anlarlar" ];

const intensifiers = [ "en", "daha", "pek çok", "en çok", "fazla", "epey", "epeyce", "bayağı", "oldukça", "pek", "gayet", "fazlaca", "fevkalede",
	"tamamen", "fena halde", "fena şekilde", "gerçekten", "zerre kadar", "biraz", "son derece", "deli gibi", "en", "çok", "azıcık" ];

const auxiliariesAndDelexicalizedVerbs = [ "etmek", "olmak", "yapmak", "kalmak", "gelmek", "kalmak", "bulunmak", "demek", "dilemek", "söylemek",
	"durmak", "eylemek", "yazmak", "durmak", "vermek", "kabul", "teşekkür", "memnun", "seyir", "zan", "bilmek" ];

const generalAdjectivesAdverbs = [
	// General adjective.
	"yeni", "eski", "önceki", "i̇yi", "büyük", "küçük", "kolay", "zor", "hızlı", "yavaş", "yüksek", "alçak", "kısa", "uzun", "i̇nce", "kalın",
	"gerçek", "yalan", "yanlış", "basit", "zor", "aynı", "farklı", "belli", "belirsiz", "modern", "geleneksel", "muhtemel", "yaygın",
	"genç", "yaşlı", "zamansız", "acı", "tatlı", "tuzlu", "sıcak", "soğuk", "kalabalık", "sakin", "yalnız", "dar", "geniş", "siyah", "beyaz", "mavi",
	"kırmızı", "sarı", "temiz", "kirli", "muhteşem", "nazik", "kibar", "akıllı", "zeki", "gizli", "açık", "kapalı", "dikkatli", "gürültülü",
	"sevinçli",
	// General adverbs.
	"eski", "önce", "i̇yi", "büyük", "küçük", "kolay", "zor", "hızlı", "yavaş", "yüksek", "alçak", "kısa", "uzun", "i̇nce", "kalın", "gerçek",
	"yanlış", "basit", "zor", "aynı", "farklı", "belli", "belirsiz", "modern", "geleneksel", "muhtemel", "yaygın", "nadir", "genç", "yaşlı",
	"zamansız", "acı", "tatlı", "tuzlu", "sıcak", "soğuk", "kalabalık", "sakin", "yalnız", "dar", "geniş", "siyah", "beyaz", "mavi", "kırmızı",
	"sarı", "temiz", "kirli", "muhteşem", "nazik", "kibar", "akıllı", "zeki", "gizli", "açık", "kapalı", "dikkatle", "gürültülü", "uzun", "sevinçle",
	"aşağı", "yukarı", "sağa", "sola", "i̇çeri dışarı", "bugün", "yarın", "haftaya", "seneye", "ne zaman", "nereye", "neden", "niye", "ne kadar",
	"nasıl", "ne" ];

const interjections = [ "ey", "hey", "bre", "hişt", "şşt", "ah", "ahh", "ee", "vay", "i̇mdat", "hah", "ay", "aa", "aaa", "hay allah", "aman",
	"aman dikkat", "vah", "ya", "yaa", "ooo", "of", "tüh", "peh", "aman", "haydi", "sakın", "yuh" ];

const recipeWords = [ "çay kaşığı", "çay k.", "yemek kaşığı", "yemek k.", "tatlı kaşığı", "tatlı k.", "çay bardağı", "çay b.", "su bardağı",
	"su b.", "kahve fincanı", "kahve f.", "tepeleme", "tepeleme kaşık", "tepeleme bardak", "gr", "ml", "kg", "mg", "cl", "oz", "çeyrek", "tam",
	"yarım", "üçte biri", "üçte ikisi", "parmak" ];

const timeWords = [ "saniye", "saniyeler", "dakika", "dakikalar", "saat", "saatler", "gün", "günler", "hafta", "haftalar", "ay", "aylar", "yıl",
	"yıllar", "bugün", "yarın", "dün", "sabah", "öğlen", "akşam", "gece", "gündüz" ];

const vagueNouns = [ "şey", "şeyler", "olasılık", "çeşit", "kişi" ];

const reflectionWords = [ "hapşu", "hapşırık", "hapşurmak", "horr", "horultu", "horlamak", "şırıl", "şırıltı", "şırıldamak", "hışır", "hışırtı",
	"hışırdamak", "gıcır", "gıcırtı", "gıcırdamak", "çatır", "çatırtı", "çatırdamak", "pat", "patlamak", "vın", "vınlamak", "zırr", "zırıltı",
	"zırlamak", "tık", "tıkırtı", "tıkırdamak", "çıt", "çıtırtı", "çıtırdamak", "fokur", "fokurtu", "fokurdamak", "kıt", "kıtırtı", "kıtırdamak",
	"patırtı" ];

const titlesPrecedingOrFollowing = [ "bayan", "bay", "hanımefendi", "hanfendi", "hanım", "beyefendi", "beyfendi", "bey", "sayın", "profesör",
	"prof.", "doktor", "dr." ];

export const all = transformWordsWithHyphens( [].concat( articles, cardinalNumerals, ordinalNumerals, fractions, pronouns, interrogatives,
	quantifiers, reflexivePronouns, indefinitePronouns, prepositions, conjunctions, interviewVerbs,
	intensifiers, auxiliariesAndDelexicalizedVerbs, generalAdjectivesAdverbs, interjections, recipeWords,
	timeWords, vagueNouns, reflectionWords, titlesPrecedingOrFollowing, transitionWords ) );

export default all;
