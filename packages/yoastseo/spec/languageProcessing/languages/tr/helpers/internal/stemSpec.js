import stem from "../../../../../../src/languageProcessing/languages/tr/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataTR = getMorphologyData( "tr" ).tr;

const wordsToStem = [
	// Stem words end in suffixes in step a_0
	[ "tulkarem", "tulkare" ],
	[ "gözüken", "gözüke" ],
	[ "tüketimimiz", "tüketim" ],
	[ "ulaşandeniz", "ulaşande" ],
	[ "ulusumuz", "ulus" ],
	[ "umduğunuz", "umduk" ],
	[ "yürüttüğümüz", "yürüttük" ],
	[ "henüz", "he" ],
	[ "tutmamız", "tutma" ],
	[ "numaranız", "numara" ],
	// Stem words end in suffixes in step a_1
	[ "görüşleri", "görüş" ],
	[ "gözyaşları", "gözyaş" ],
	// Stem words end in suffixes in step a_2
	[ "nikotini", "nikot" ],
	[ "notunu", "not" ],
	[ "prosedürünü", "prosedür" ],
	[ "puanını", "puan" ],
	// Stem words end in suffixes in step a_3
	[ "pêkirin", "pêkir" ],
	[ "reflektörün", "reflektör" ],
	[ "reforların", "refor" ],
	// Stem words end in suffixes in step a_4
	[ "rekora", "rekor" ],
	[ "resmiyette", "resmiyet" ],
	// Stem words end in suffixes in step a_5
	[ "aktarımına", "aktarım" ],
	[ "akıbetine", "akıbet" ],
	// Stem words end in suffixes in step a_6
	[ "almakta", "almak" ],
	[ "amatörde", "amatör" ],
	[ "alışverişte", "alışveriş" ],
	// Stem words end in suffixes in step a_7
	[ "sinavinda", "sinav" ],
	[ "tehdidinde", "tehdidi" ],
	// Stem words end in suffixes in step a_8
	[ "baradan", "bara" ],
	[ "bardaktan", "bardak" ],
	[ "doğaseverden", "doğasever" ],
	[ "döndükten", "döndük" ],
	// Stem words end in suffixes in step a_9
	[ "edebiyatından", "edebiyat" ],
	[ "edildiğinden", "edildik" ],
	// Stem words end in suffixes in step a_10
	[ "enfazla", "enfaz" ],
	[ "engellemekle", "engellemek" ],
	// Stem words end in suffixes in step a_11
	[ "harca", "har" ],
	[ "işknece", "işkneç" ],
	// Stem words end in suffixes in step a_12
	[ "işletim", "işlet" ],
	[ "kaldırıyorum", "kaldırıyor" ],
	[ "kostüm", "kost" ],
	[ "kullanalım", "kullanal" ],
	// Stem words end in suffixes in step a_13
	[ "meclisin", "mecli" ],
	[ "namusun", "namu" ],
	[ "sürülsün", "sürül" ],
	[ "gömeceksin", "gömecek" ],
	// Stem words end in suffixes in step a_14
	[ "göndeririz", "gönderir" ],
	[ "görebiliyoruz", "görebiliyor" ],
	[ "görürüz", "görür" ],
	[ "gıdasız", "gıdas" ],
	// Stem words end in suffixes in step a_15
	[ "hafifletebilirsiniz", "hafifletebilir" ],
	[ "hallediyorsunuz", "hallediyor" ],
	[ "meşgulsünüz", "meşgul" ],
	[ "okuyabilirsiniz", "okuyabilir" ],
	// Stem words end in suffixes in step a_16
	[ "olacaklar", "olacak" ],
	[ "gruptakiler", "gruptaki" ],
	// Stem words end in suffixes in step a_17
	[ "göreceğiniz", "görecek" ],
	[ "korkunuz", "kork" ],
	[ "göreceksınız", "görecek" ],
	[ "tahammülünüz", "tahammül" ],
	// Stem words end in suffixes in step a_18
	[ "tahlikelidir", "tahlikel" ],
	[ "taktiktir", "taktik" ],
	[ "umuttur", "umut" ],
	[ "yiyordur", "yiyor" ],
	[ "çürüktür", "çürük" ],
	[ "özgüdür", "özgü" ],
	[ "duyacaktır", "duyacak" ],
	[ "durdurulmalıdır", "durdurulmal" ],
	// Stem words end in suffixes in step a_19
	[ "yaparcasına", "yaparca" ],
	[ "derecesine", "derece" ],
	// Stem words end in suffixes in step a_20
	[ "öğretmendi", "öğretme" ],
	[ "öğretmişti", "öğretmiş" ],
	[ "verdik", "ver" ],
	[ "vazgeçtik", "vazgeç" ],
	[ "alabiliyorduk", "alabiliyor" ],
	[ "bulunmuştuk", "bulunmuş" ],
	[ "bölüştürdük", "bölüştür" ],
	[ "görüştük", "görüş" ],
	[ "ındırdık", "ındır" ],
	[ "ıktık", "ık" ],
	[ "bildirdim", "bildir" ],
	[ "beklentim", "bekle" ],
	[ "koşturdum", "koştur" ],
	[ "konuştum", "konuş" ],
	[ "sürdürürdüm", "sürdürür" ],
	[ "sürmüştüm", "sürmüş" ],
	[ "uyardım", "uyar" ],
	[ "uğramıştım", "uğramış" ],
	[ "öğrendin", "öğre" ],
	[ "temizleyemeyecektin", "temizleyemeyecek" ],
	[ "yurdun", "yur" ],
	[ "sustun", "sus" ],
	[ "ürdün", "ür" ],
	[ "örtün", "ör" ],
	[ "tüsıadın", "tüsıa" ],
	[ "ınşaatın", "ınşaa" ],
	[ "sızdırıyordu", "sızdırıyor" ],
	[ "tavuktu", "tavuk" ],
	[ "sömürüldü", "sömürül" ],
	[ "suçüstü", "suçüs" ],
	[ "sorardı", "sorar" ],
	[ "sorgulamıştı", "sorgulamış" ],
	// Stem words end in suffixes in step a_21
	[ "gidiyorsa", "gidiyor" ],
	[ "girerse", "girer" ],
	[ "konuşursak", "konuşur" ],
	[ "gönderemezsek", "gönderemez" ],
	[ "hatırlamıyorsam", "hatırlamıyor" ],
	[ "meğersem", "meğer" ],
	[ "seyretsem", "seyret" ],
	[ "seversen", "sever" ],
	// Stem words end in suffixes in step a_22
	[ "borçlanmış", "borçla" ],
	[ "gerekiyormuş", "gerekiyor" ],
	[ "dökmüş", "dök" ],
	[ "dzenlenmiş", "dzenle" ],
	// Stem words end in suffixes in step a_23
	[ "ediyorb", "ediyorp" ],
	[ "gazetec", "gazeteç" ],
	[ "getirildid", "getirildidi" ],
	[ "samandağ", "samandak" ],
	// A word with multiple suffixes.
	[ "kedileriyle", "kedi" ],
	// A word where the suffix is attached with an apostrophe
	[ "universitesi'ne", "universite" ],
	[ "radyosu'nun", "radyo" ],
	[ "aliağa'mızda", "aliağa" ],
	[ "Istanbul'da", "istanbul" ],
	[ "Istanbul'dan", "istanbul" ],
	[ "Istanbul'dayım", "istanbul" ],
];
describe( "Test for stemming Turkish words", () => {
	it( "stems Turkish words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataTR ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
