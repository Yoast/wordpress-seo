/** @module config/transitionWords */

const singleWords = [ "ahányszor", "ahelyett", "ahelyt", "ahogy", "ahol", "ahonnan", "ahová", "akár", "akárcsak",
	"akkor", "alapvetően", "alighogy", "ám", "ámbár", "ámde", "ameddig", "amennyiben", "amennyire", "amennyiszer",
	"amíg", "amikor", "amikorra", "aminthogy", "amióta", "amire", "annálfogva", "annyira", "avagy", "azaz", "azazhogy",
	"azért", "azonban", "azonkívül", "azután", "bár", "befejezésül", "bizony", "csakhogy", "de", "dehát", "dehogy", "egybehangzóan", "egyidejűleg",
	"egyöntetűen", "egyöntetűleg", "ekképpen", "ellenben", "először", "előzőleg", "elsősorban", "ennélfogva", "eredményeképp", "eredményeképpen",
	"és", "eszerint", "ezért", "feltétlenül", "főként", "főleg", "függetlenül", "ha", "habár", "hanem", "hányszor", "harmadjára", "harmadszor",
	"hasonlóan", "hasonlóképpen", "hát", "hirtelen", "hirtelenjében", "hiszen", "hogy", "hogyha", "hol", "holott", "honnan",
	"hová", "így", "illetőleg", "illetve", "immár", "is", "jóllehet", "kár", "kétségtelenül", "kifejezetten", "kiváltképp",
	"következésképpen", "legalábbis", "legfőképp", "maga", "máskülönben", "másodsorban", "másodszor", "meg", "mégis", "megkérdőjelezhetetlenül",
	"megkérdőjelezhetően", "mégpedig", "mégsem", "mennél", "mennyiszer", "merre", "mert", "merthogy", "midőn",
	"mielőtt", "míg", "mihelyt", "miként", "miképp", "mikor", "mikorra", "mindamellett", "mindazáltal", "mindazonáltal", "mindenekelőtt",
	"minél", "mint", "mintha", "minthogy", "mióta", "mire", "miután", "mivel", "mivelhogy", "nahát", "nehogy", "noha",
	"nos", "nyilvánvalóan", "óh", "összefoglalva", "összehasonlításképp", "összehasonlításképpen", "pedig", "például", "plusz", "s", "sajna",
	"satöbbi", "se", "sem", "sőt", "szintén", "tagadhatatlanul", "tehát", "továbbá", "tudniillik", "úgy", "ugyan", "ugyanis",
	"úgyhogy", "vagy", "vagyis", "valamennyi", "valamint", "valóban", "végezetül", "végül", "végülis", "viszont" ];

const multipleWords =  [ "abba hogy", "abban hogy", "abból hogy", "addig amíg", "addig hogy", "addig míg", "afelé hogy",
	"ahelyett hogy", "ahhoz hogy", "akként hogy", "akkorra hogy", "amiatt hogy", "amellett hogy", "amint csak",
	"anélkül hogy", "annak okáért", "annyi hogy", "annyi mint", "annyira hogy", "annyira mint", "arra hogy",
	"arra hogy", "arról hogy", "attól fogva hogy", "attól hogy", "avégett hogy", "avégre hogy", "az ellen hogy",
	"az iránt hogy", "azelőtt hogy", "azért hogy", "azért hogy", "azok után", "azon hogy", "azonkívül hogy",
	"azóta hogy", "aztán pedig", "azután hogy", "azzal a feltétellel, hogy", "azzal hogy", "ennek folytán", "ha csak", "ha egyébként", "ha egyszer",
	"ha egyszer", "ha is", "ha különben", "ha ugyan", "hogy sem", "hogy sem mint", "hol hol", "holott pedig",
	"igaz hogy", "így tehát", "még akkor is", "még ha", "mert különben", "mert tény hogy", "mind mind", "mindenek előtt",
	"mindezek után", "mint sem", "mint sem hogy", "nem úgy mint", "oda hogy", "oly módon hogy", "sem hogy", "tény hogy",
	"úgy hogy", "úgy mint" ];

/**
 * Returns an list with transition words to be used by the assessments.
 * @returns {Object} The list filled with transition word lists.
 */
module.exports = function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
};
