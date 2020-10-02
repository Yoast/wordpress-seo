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


const multipleWords =  [ "a továbbiakban", "abba hogy", "abban hogy", "abból hogy", "addig amíg", "addig hogy", "addig míg", "afelé hogy",
	"ahelyett hogy", "ahhoz hogy", "ahogy fent látható", "ahogy írtam", "ahogy megmutattam", "ahogy megjegyeztem", "akként hogy",
	"akkorra hogy", "amiatt hogy", "amellett hogy", "amint azt megjegyeztük", "amint csak", "amint láthatjuk", "anélkül hogy",
	"annak érdekében, hogy", "annak okáért", "annyi hogy", "annyi mint", "annyira hogy", "annyira mint", "arra hogy", "arra hogy",
	"arról hogy", "attól fogva hogy", "attól hogy", "avégett hogy", "avégre hogy", "az ellen hogy", "az első dolog",
	"az első dolog, amit meg kell jegyezni", "az iránt hogy", "azelőtt hogy", "azért hogy", "azért hogy", "azonos módon",
	"azok után", "azon hogy", "azonkívül hogy", "azóta hogy", "azt követően", "aztán pedig", "azután hogy", "azzal a feltétellel, hogy",
	"azzal hogy", "bár igaz lehet", "ebből a célból", "ebből az okból", "előbb vagy utóbb", "ennek eredményeként", "ennek folytán",
	"ennek megfelelően", "éppen ellenkezőleg", "éppen úgy", "erre a célra", "ezen felül", "fenntartás nélkül", "ha csak",
	"ha egyébként", "ha egyszer", "ha egyszer", "ha is", "ha különben", "ha ugyan", "hasonló módon", "hogy sem", "hogy sem mint", "hol hol",
	"holott pedig", "időről időre", "igaz hogy", "így tehát", "ilyen körülmények között", "késedelem nélkül", "kétség nélkül",
	"más szóval", "más szavakkal", "másképpen fogalmazva", "még akkor is", "még ha", "mert különben", "mert tény hogy", "mind mind",
	"mindaddig, amíg", "mindenek előtt", "mindezek után", "mint sem", "mint sem hogy", "nem is beszélve", "nem különben", "nem úgy mint", "oda hogy",
	"oly módon hogy", "sem hogy", "szem előtt tartva", "tény hogy", "úgy hogy", "úgy mint", "ugyanazon okból", "ugyanolyan okból" ];

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
