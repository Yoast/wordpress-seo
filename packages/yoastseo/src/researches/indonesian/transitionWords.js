/** @module config/transitionWords */

var singleWords = [ "accordingly", "setelahnya", "walaupun", "juga", "meskipun", "walaupun",
	"lainnya", "karena", "sebelum", "selain", "tetapi", "tapi", "walau", "meski", "tentunya", "utamanya",
	"pastinya", "terutama", "terutamanya", "agak",
	"akibatnya", "karenanya", "alhasil", "maka", "makanya", "sebaliknya", "kendati", "sekalipun",
	"kendatipun", "selama", "semasa", "sementara", "selagi", "misalnya", "contohnya", "umpamanya",
	"sebelumnya", "terdahulu", "khususnya", "terlebih", "akhirnya", "nantinya", "ternyata", "rupanya",
	"pertama-tama", "berikut", "dahulunya", "dulunya", "semula", "mulanya", "selanjutnya", "umumnya", "biasanya", "seterusnya",
	"namun", "biarpun", "memang", "sesungguhnya", "bahwasannya", "terakhir", "kemudian", "kelak", "jua", "bahkan",
	"kadang", "adakalanya", "sekali-sekali", "kadang-kadang" ];
var multipleWords = [ "selain itu", "setelah itu", "setelah ini", "sama sekali", "yang lain", "pada dasarnya", "secara bersamaan",
	"karena itu", "oleh karena itu", "maka dari itu", "oleh sebab itu", "sebab itu", "sebagai akibatnya", "sejalan dengan itu", "sejalan dengan ini",
	"pada waktu", "sebagai contoh", "pada akhirnya", "dengan jelas", "secara eksplisit", "lebih lanjut", "lebih jauh",
	"lagi pula", "sebagai tambahan", "dan lagi", "apa lagi", "pada umumnya", "untuk selanjutnya", "akan tetapi", "meskipun demikian",
	"meskipun begitu", "dengan kata lain", "sebagai gantinya", "yang terakhir", "kalau-kalau", "demikian juga", "demikian pula", "begitu juga",
	"begitu pula", "sementara itu", "pada waktu yang sama", "kendatipun demikian", "kendatipun begitu", "sekalipun demikian", "sekalipun begitu",
	"walaupun begitu", "walaupun demikian", "biarpun demikian", "biarpun begitu", "tak pelak lagi", "dengan terang", "dengan nyata",
	"kadang kala" ];

/**
 * Returns lists with transition words to be used by the assessments.
 * @returns {Object} The object with transition word lists.
 */
export default function() {
	return {
		singleWords: singleWords,
		multipleWords: multipleWords,
		allWords: singleWords.concat( multipleWords ),
	};
}
