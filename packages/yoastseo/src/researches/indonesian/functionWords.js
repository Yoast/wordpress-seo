/**
 * Returns an object with exceptions for the prominent words researcher
 * @returns {Object} The object filled with exception arrays.
 */

const articles = [ "si", "sang", "kaum", "sri", "hang", "dang", "para" ];
const cardinalNumerals = [ "nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan",
	"sepuluh", "sebelas", "seratus", "seribu", "sejuta", "semiliar", "setriliun" ];

const ordinalNumerals = [ "kesatu", "pertama", "kedua", "ketiga", "keempat", "kelima", "keenam", "ketujuh", "kedelapan",
	"kesembilan", "kesepuluh", "kesebelas", "keseratus", "keseribu" ];

const otherParticles = [ "lah", "pun", "dong", "kan", "sih", "toh", "nah", "lho", "kok", "ding" ];

const classifiers = [ "sebuah", "seorang", "seekor", "sebiji", "selembar", "secarik", "sehelai", "sebutir",
	"sebatang", "sebidang", "sebentuk", "sebilah", "sekuntum", "sepatah", "sepucuk", "setangkai", "seutas",
	"sebelah", "segenggam", "segugus", "sepiring", "sejenis", "semacam", "sepotong", "setetes", "suatu" ];

const personalPronounsNominative = [ "aku", "saya", "engkau", "kau", "kamu", "anda", "kita", "kami", "kalian", "ia", "dia",
	"beliau", "mereka", "dikau", "daku", "beta", "sayalah", "engkaulah", "kaulah", "kamulah", "andalah", "kitalah",
	"kamilah", "kalianlah", "dialah", "kamu-kamu", "saya-saya", "mereka-mereka", "beliau-beliau", "anda-anda",
	"mereka-merekalah", "beliau-beliaulah", "kamu-kamulah", "anda-andalah" ];

const relativePronoun = [ "yang" ];

const demonstrativePronouns = [ "ini", "itu", "tersebut", "tadi", "inilah", "itulah" ];

const possessivePronouns = [ "milikku", "milikmu", "miliknya", "punyanya", "punyaku", "punyamu", "kepunyaannya",
	"kepunyaanmu", "kepunyaanku" ];

const pronounSubstitutes = [ "bu", "pak", "bang", "nak", "kak", "dik" ];

const quantifiers = [ "belasan", "puluhan", "ribuan", "miliaran", "triliunan", "setengah", "seperdua", "sepertiga",
	"seperempat", "seperlima", "seperenam", "sepertujuh", "seperdelapan", "sepersembilan", "sepersepuluh", "sedikit",
	"setiap", "banyak", "semua", "lebih", "kurang", "sebagian", "cukup", "beberapa", "berpuluh-puluh", "beratus-ratus",
	"beribu-ribu", "berjuta-juta", "ratusan", "paling", "tiap-tiap" ];

const reflexivePronouns = [ "diriku", "dirinya", "dirimu" ];

const indefinitePronouns = [ "lain", "lainnya", "seseorang", "sesuatu", "siapa-siapa", "apa-apa", "semuanya", "segalanya",
	"seluruhnya", "keduanya", "ketiganya", "ketiga-tiganya", "kedua-duanya", "dua-duanya", "tiga-tiganya", "masing-masing",
	"apapun", "siapapun", "manapun", "sedemikian", "demikian" ];

const interrogativeDeterminers = [ "apa", "manakah", "mana", "apanya", "inikah", "itukah", "manalagi" ];

const interrogativePronouns = [ "siapa", "siapakah", "kamukah", "andakah", "sayakah", "akukah", "diakah", "merekakah",
	"engkaukah", "kamikah", "kitakah", "beliaukah", "iakah", "dirinyakah", "dirikukah", "siapatah", "siapalah", "siapanya" ];

const interrogativeAdverbs = [ "bagaimana", "mengapa", "kenapa", "kapan", "berapa", "kapankah", "berapakah",
	"bagaimanakah", "apakah", "kapanpun", "apatah", "apalah", "berapatah", "berapalah", "mengapakah", "mengapatah",
	"mengapalah", "kenapakah", "kenapatah", "kenapalah", "kapantah", "kapanlah", "manatah", "mananya", "manalah",
	"bagaimanatah", "bagaimanalah", "bilamana", "bilamanakah", "bilamanatah", "bilamananya", "bilamanalah", "keberapa", "mampukah",
	"beginikah", "begitukah" ];

const adverbialGenitives = [ "selalu", "sekali", "berkali-kali" ];

const auxiliaries = [ "dapat", "dapatkah", "bisa", "bisakah", "boleh", "bolehkah", "akan", "akankah", "bukan",
	"dapatlah", "bisatah", "bisanya", "bisalah", "bolehtah", "bolehnya", "bolehlah", "akantah", "akannya", "akanlah",
	"harus", "haruskah", "harustah", "harusnya", "haruslah", "bukankah", "bukantah", "bukannya", "bukanlah", "mungkin",
	"mungkinkah", "mungkintah", "mungkinlah", "belum", "belumkah", "belumlah", "sudah", "sudahkah", "sudahlah", "takkan",
	"masih", "masihkah", "pernah", "pernahkah" ];

const copula = [ "adalah", "ialah", "merupakan", "ada", "berada" ];

const prepositions = [ "antara", "seantero", "bagai", "bagaikan", "bagi", "buat", "dari", "demi", "dengan", "di", "terhadap",
	"menjelang", "ke", "kecuali", "sekeliling", "mengenai", "sekitar", "melalui", "selama", "lepas", "lewat", "oleh", "selewat",
	"pada", "sepanjang", "per", "seputar", "bersama", "sejak", "semenjak", "seperti", "serta", "tentang", "menuju", "menurut",
	"untuk", "tanpa", "adapun", "antar", "diantara", "silam", "lalu", "selaku", "melalui", "sebagai", "bahwasanya" ];

// These prepositional adverbs are all preceded by locative preposition "di", e.g. "di atas".
const locativeAdverbs = [ "atas", "bawah", "dalam", "luar", "depan", "belakang", "sebelah", "samping" ];

const coordinatingConjunctions = [ "dan", "atau", "lalu", "kemudian", "serta", "sedangkan", "sementara",
	"sambil", "seraya", "ataupun", "ataukah" ];

const correlativeConjunctions = [ "maupun", "bukan", "begitu", "baru", "hanya" ];

const subordinatingConjunctions = [ "setelah", "sehabis", "sejak", "sampai", "ketika", "waktu", "tatkala", "saat", "kalau",
	"jika", "jikalau", "bila", "bilamana", "apabila", "asal", "asalkan", "seandainya", "andaikata", "sekiranya", "karena",
	"sebab", "lantaran", "gara-gara", "mentang-mentang", "kalau-kalau", "supaya", "agar", "guna", "sehingga", "hingga",
	"sampai", "sebelum", "sesudah", "meski", "meskipun", "kendati", "kendatipun", "walau", "walaupun", "sekalipun", "biarpun",
	"sungguhpun", "padahal", "seakan-akan", "seolah-olah", "daripada", "alih-alih", "melainkan", "apalagi", "bahwa", "saja" ];


const interviewVerbs = [ "kata", "bilang", "berkata", "mengeklaim", "bertanya", "menayakan", "menyatakan", "tanya", "klaim",
	"jelas", "jelaskan", "menjelaskan", "dijelaskan", "ditanya", "pikir", "berpikir", "berbicara", "membicarakan", "mengumumkan",
	"diumumkan", "dibicarakan", "mendiskusikan", "menyarankan", "disarankan", "mengerti" ];

const additionalTransitionWords = [ "yakni", "yaitu", "artinya", "awalnya", "akhirnya", "makanya", "malahan", "malah", "memang",
	"nantinya", "nanti", "pula", "seketika", "sekarang", "benar-benar", "kadang", "justru", "tetapi", "tapi" ];

const intensifiers = [ "sangat", "amat", "terlalu", "terlampau", "sungguh", "serba", "agak", "begitu", "demikian",
	"makin", "semakin", "kian", "tambah", "bertambah", "begini", "amatlah" ];

const delexicalizedVerbs = [ "ada", "punya", "milik", "terlihat", "kelihatan", "mari", "marilah", "membuat", "dibuat",
	"menunjukkan", "ditunjukkan", "pergi", "ambil", "diambil", "meletkakkan", "letakkan", "ambilkan", "mencoba", "dicoba",
	"bermakna", "berarti", "terdiri", "memastikan", "dipastikan", "mengandung", "termasuk", "maknanya", "artinya", "ingin", "inginkan" ];

// These adjectives and adverbs are so general, they should never be suggested as a (single) keyword.
// Keyword combinations containing these adjectives/adverbs are fine.
const generalAdjectivesAndAdverbs = [ "terbesar", "besar", "terkecil", "kecil", "terbaru", "baru", "tertua", "tua", "lalu",
	"semudah", "termudah", "mudah", "cepat", "jauh", "susah", "keras", "panjang", "rendah", "pendek", "tinggi", "biasa",
	"simpel", "kebanyakan", "baru-baru", "lagi", "selesai", "mungkin", "umum", "baik", "buruk", "bagus", "utama", "sama",
	"tertentu", "biasanya", "spesifik", "langsung", "dekat", "terbaru", "berbeda", "beda", "sibuk", "terkini", "penting",
	"terpenting", "sebesar", "sekecil", "setua", "termuda", "semuda", "muda", "tercepat", "secepat", "termudah", "semudah",
	"terjauh", "sejauh", "tersusah", "sesusah", "terkeras", "sekeras", "sepanjang", "terpanjang", "terpendek", "sependek",
	"terbiasa", "tersimpel", "sesimpel", "terbaik", "sebaik", "terburuk", "seburuk", "sebagus", "terbagus", "terutama",
	"terdekat", "sedekat", "tersibuk", "sepenting", "lambat", "terlambat", "luas", "terluas", "seluas", "keren", "tersedia",
	"cepat-cepat", "erat-erat", "betul-betul", "diam-diam", "keras-keras", "jauh-jauh", "secepat-cepatnya", "baik-baik",
	"sebaik-baiknya", "sekeras-kerasnya", "lekas-lekas", "selekas-lekasnya", "tinggi-tinggi", "setinggi-tingginya",
	"seberat-beratnya", "sejauh-jauhnya", "sedikit-dikitnya", "sekurang-kurangnya", "setidak-tidaknya", "sedapat-dapatnya",
	"seenak-enaknya", "seenaknya", "seadanya", "sekenanya", "selambat-lambatnya", "selebih-lebihnya",
	"sedikitnya", "sepenuhnya", "besar-besaran", "kecil-kecilan", "habis-habisan", "mati-matian", "terang-terangan", "terus-terusan",
	"untung-untungan", "kesekian", "berdua-dua", "bertiga-tiga", "berdua", "bertiga", "berempat", "berlima", "berenam", "bertujuh",
	"berdelapan", "bersembilan", "bersepuluh", "bersebelas", "berseratus", "berseribu", "berduaan", "agaknya", "sepenting-pentingnya",
	"sepanjang-panjangnya", "spesifik", "spesial", "semuda-mudanya", "setua-tuanya", "seburuk-buruknya", "seluas-luasnya", "terlebih",
	"selamanya", "selama-lamanya", "mampu", "begini", "beginilah", "begitu", "begitulah", "sebegini", "sebegitu", "semula", "pasti",
	"pastilah", "pastinya", "dini", "sedini", "sering", "seringnya", "jarang", "terbanyak" ];

// These adverbs are all preceded by a negative, i.e. tak, tidak, or belum. Example: tak puas-puasnya.
const otherAdverbs = [ "putus-putusnya", "jemu-jemunya", "jera-jeranya", "puas-puasnya", "bosan-bosannya", "henti-hentinya",
	"berhenti-hentinya" ];

const interjections = [ "bah", "cis", "ih", "idih", "sialan", "buset", "aduh", "waduh", "duh", "aduhai", "amboi", "asyik",
	"wah", "syukur", "alhamdulillah", "untung", "aduh", "aih", "aih", "lo", "duilah", "eh", "oh", "ah", "astaga", "astagfirullah",
	"masyaallah", "masa", "alamak", "gila", "ayo", "yuk", "mari", "hai", "he", "hai", "halo" ];

// These words and abbreviations are frequently used in recipes in lists of ingredients.
const recipeWords = [ "sdm", "sdt", "gr", "kg", "cm", "mg", "ml", "l", "dl", "cl", "ons", "lbr", "cc", "bh", "ltr", "pon" ];

const timeWords = [ "detik", "menit", "jam", "detik-detik", "menit-menit", "jam-jam", "hari", "hari-hari", "minggu",
	"minggu-minggu", "bulan", "bulan-bulan", "tahun", "tahun-tahun", "besok", "kemarin", "lusa", "malam-malam", "siang-siang",
	"subuh", "bedug", "keesokan" ];

const vagueNouns = [ "cara", "barang", "masalah", "bagian", "bagian-bagian", "aspek", "aspek-aspek", "ide", "item",
	"tema", "hal", "perkara", "faktor", "faktor-faktor", "detil", "perbedaan", "adanya", "beginian", "rupanya", "diri" ];

const miscellaneous = [ "tidak", "iya", "tak", "tentu", "ok", "oke", "amin", "dll", "maaf", "tolong", "mohon", "jangan", "sebagainya",
	"hanya", "cuma", "jangankan", "janganlah", "tolonglah"  ];

const titlesPreceding = [ "tuan", "nyonya", "nona", "bang", "pak", "bu", "bang", "kak", "prof", "gus", "ning", "kyai",
	"ustad", "ustadzah", "nyai", "raden", "tengku" ];

/**
 * Returns function words for Indonesian.
 *
 * @returns {Object} Indonesian function words.
 */
export default function() {
	return {
		// These word categories are filtered at the ending of word combinations.
		filteredAtEnding: [].concat( otherParticles,  ),
		// These word categories are filtered at the ending of word combinations.
		filteredAtBeginning: [].concat( ordinalNumerals, classifiers ),

		// These word categories are filtered at the beginning and ending of word combinations.
		filteredAtBeginningAndEnding: [].concat( articles, coordinatingConjunctions, demonstrativePronouns, intensifiers,
			possessivePronouns, pronounSubstitutes ),

		// These word categories are filtered everywhere within word combinations.
		filteredAnywhere: [].concat( adverbialGenitives, personalPronounsNominative,
			reflexivePronouns, interjections, cardinalNumerals, auxiliaries, copula, interviewVerbs,
			delexicalizedVerbs, indefinitePronouns, correlativeConjunctions, subordinatingConjunctions, interrogativeDeterminers,
			interrogativePronouns, interrogativeAdverbs, otherAdverbs, miscellaneous, locativeAdverbs,
			recipeWords, timeWords, vagueNouns, generalAdjectivesAndAdverbs, relativePronoun, prepositions, quantifiers ),

		// This export contains all of the above words.
		all: [].concat( articles, cardinalNumerals, ordinalNumerals, demonstrativePronouns, possessivePronouns, reflexivePronouns,
			personalPronounsNominative, quantifiers, indefinitePronouns, interrogativeDeterminers, interrogativePronouns, interrogativeAdverbs,
			locativeAdverbs, adverbialGenitives, auxiliaries, copula, prepositions, coordinatingConjunctions, correlativeConjunctions,
			subordinatingConjunctions, interviewVerbs, additionalTransitionWords, intensifiers, delexicalizedVerbs, interjections,
			generalAdjectivesAndAdverbs, recipeWords, vagueNouns, miscellaneous, titlesPreceding, relativePronoun ),
	};
}
