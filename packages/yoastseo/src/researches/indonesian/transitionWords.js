/** @module config/transitionWords */

var singleWords = [ "adakalanya", "agak", "agar", "akhirnya", "alhasil", "andaikan", "bahkan",
	"bahwasannya", "berikut", "betapapun", "biarpun", "biasanya", "contohnya", "dahulunya", "diantaranya", "dikarenakan",
	"disebabkan", "dulunya", "faktanya", "hasilnya", "intinya", "jadi", "jua", "juga", "kadang-kadang", "kapanpun",
	"karena", "karenanya", "kedua", "kelak", "kemudian", "kesimpulannya", "khususnya", "langsung",
	"lantaran", "maka", "makanya", "masih", "memang", "meski", "meskipun", "misalnya", "mulanya", "nantinya", "nyatanya",
	"pendeknya", "pertama", "ringkasnya", "rupanya", "seakan-akan", "sebaliknya", "sebelum", "sebetulnya",
	"sedangkan", "segera", "sehingga", "sekali-sekali", "sekalipun", "sekiranya", "selagi", "selain", "selama",
	"selanjutnya", "semasa", "semasih", "semenjak", "sementara", "semula", "sepanjang", "serasa", "seraya",
	"seringkali", "sesungguhnya", "setelahnya", "seterusnya", "setidak-tidaknya", "setidaknya", "sewaktu-waktu", "sewaktu",
	"tadinya", "tentunya", "terakhir", "terdahulu", "terlebih", "ternyata", "terpenting",
	"terutama", "terutamanya", "tetapi", "umpamanya", "umumnya", "utamanya", "walau", "walaupun", "yaitu", "yakni",
	"akibatnya", "hingga", "kadang", "kendatipun", "ketiga", "lainnya", "manakala", "namun", "pastinya", "pertama-tama",
	"sampai-sampai", "sebaliknya", "sebelumnya", "sebetulnya", "sesekali" ];
var multipleWords = [  "agar supaya", "akan tetapi", "apa lagi", "asal saja", "bagaimanapun juga", "bahkan jika",
	"bahkan lebih", "begitu juga", "berbeda dari", "biarpun begitu", "biarpun demikian", "bilamana saja", "cepat atau lambat",
	"dalam hal ini", "dalam jangka panjang", "dalam kasus ini", "dalam kasus lain", "dalam kedua kasus", "dalam kenyataannya",
	"dalam pandangan", "dalam situasi ini", "dalam situasi seperti itu", "dan lagi", "dari awal", "dari pada", "dari waktu ke waktu",
	"demikian juga", "demikian pula", "dengan serentak", "dengan cara yang sama", "dengan jelas", "dengan kata lain",
	"dengan ketentuan", "dengan nyata", "dengan panjang lebar", "dengan pemikiran ini", "dengan syarat bahwa", "dengan terang",
	"di pihak lain", "di sisi lain", "dibandingkan dengan", "disebabkan oleh", "ditambah dengan", "hanya jika", "harus diingat",
	"hasil dari", "hingga kini", "kalau tidak", "kalau-kalau", "kali ini", "kapan saja", "karena alasan itulah",
	"karena alasan tersebut", "kecuali kalau", "kendatipun begitu", "kendatipun demikian", "lebih jauh", "lebih lanjut",
	"maka dari itu", "meskipun demikian", "oleh karena itu", "oleh karenanya", "oleh sebab itu", "pada akhirnya", "pada awalnya",
	"pada dasarnya", "pada intinya", "pada kenyataannya", "pada kesempatan ini", "pada mulanya", "pada saat ini", "pada saat",
	"pada situasi ini", "pada umumnya", "pada waktu yang sama", "pada waktunya", "paling tidak", "pendek kata",
	"penting untuk disadari", "poin penting lainnya", "saat ini", "sama halnya", "sama pentingnya", "sama sekali",
	"sampai sekarang", "sebab itu", "sebagai akibatnya", "sebagai contoh", "sebagai gambaran", "sebagai gantinya",
	"sebagai hasilnya", "sebagai tambahan", "sebelum itu", "secara bersamaan", "secara eksplisit", "secara keseluruhan",
	"secara keseluruhan", "secara khusus", "secara menyeluruh", "secara signifikan", "secara singkat", "secara umum",
	"sejalan dengan ini", "sejalan dengan itu", "sejauh ini", "sekali lagi", "sekalipun begitu", "sekalipun demikian",
	"sementara itu", "seperti yang bisa dilihat", "seperti yang sudah saya katakan", "seperti yang sudah saya tunjukkan",
	"sesudah itu", "setelah ini", "setelah itu", "tak pelak lagi", "tanpa menunda-nunda lagi", "tentu saja", "terutama sekali",
	"tidak perlu dipertanyakan lagi", "tidak sama", "tidak seperti", "untuk alasan ini", "untuk alasan yang sama",
	"untuk memperjelas", "untuk menekankan", "untuk menyimpulkan", "untuk satu hal", "untuk sebagian besar", "untuk selanjutnya",
	"untuk tujuan ini", "walaupun demikian", "yang lain", "yang terakhir", "yang terpenting", "begitu pula", "berbeda dengan",
	"betapapun juga", "dalam hal itu", "di samping itu", "hal pertama yang perlu diingat", "kadang kala", "karena itu",
	"lagi pula", "lambat laun", "mengingat bahwa", "meskipun begitu", "pada umumnya", "pada waktu", "saat ini juga",
	"sampai saat ini", "sebagian besar", "secara terperinci", "selain itu", "seperti yang sudah dijelaskan",
	"seperti yang tertera di", "tak seperti", "tanpa memperhatikan", "tentu saja", "untuk memastikan", "untuk menggambarkan",
	"walaupun begitu" ];

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
