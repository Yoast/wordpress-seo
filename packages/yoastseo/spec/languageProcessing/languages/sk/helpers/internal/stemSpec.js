import stem from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -atoch
	// [ "demokratoch", "demokrat" ],
	[ "sampionatoch", "sampio" ],
	// Input a word ending in case suffix -aťom
	[ "arcikniežaťom", "arcikniež" ],
	// Input a word ending in case suffix -aťom
	[ "arcikniežaťom", "arcikniež" ],
	// Input a word ending in case suffix -och
	[ "mesiacoch", "mesia" ],
	// Input a word ending in case suffix -ému
	[ "samotnému", "samot" ],
	// Input a word ending in case suffix -ých
	[ "ktorých", "ktor" ],
	// Input a word ending in case suffix -ých and a derivational suffix -č
	[ "zahraničných", "zahrani" ],
	// Input a word ending in case suffix -ata
	[ "zvierata", "zvier" ],
	// Input a word ending in case suffix -om and a derivational suffix -ob
	[ "spôsobom", "spôs" ],
	// Input a word ending in case suffix -om
	[ "ľuďom", "ľuď" ],
	// Input a word ending in case suffix -es
	[ "najdes", "naj" ],
	// Input a word ending in case suffix -ím
	[ "hovorím", "hovo" ],
	// Input a word ending in case suffix -úm
	[ "chartúm", "char" ],
	// Input a word ending in case suffix -ej
	[ "súčasnej", "súčas" ],
	// Input a word ending in possessive suffix -ov
	[ "problémov", "problém" ],
	// Input a word ending in possessive suffix -in
	[ "problémin", "problém" ],
	// Input a word ending in comparative suffix -ejš
	[ "mokrejš", "mokr" ],
	// Input a word ending in a case suffix -í and comparative suffix -ejš
	[ "skúpejší", "skúp" ],
	// Input a word ending in a case suffix -í and comparative suffix -ějš
	[ "nejkrásnější", "nejkrás" ],
	// Input a word ending in diminutive suffix -oušok (a made-up word)
	[ "prístroušok", "prístr" ],
	// Input a word ending in diminutive suffix -ečok
	[ "zrniečok", "zrni" ],
	// Input a word ending in diminutive suffix -ínok
	[ "blondínok", "blond" ],
	// Input a word ending in diminutive suffix -ačok
	[ "spišiačok", "spiš" ],
	// Input a word ending in diminutive suffix -anok
	[ "lužianok", "luh" ],
	// Input a word ending in diminutive suffix -ičk and a case suffix -a
	[ "mamička", "mam" ],
	// Should be stemmed into "pesn" (song), not "pes"(dog). With the current stemmer, "pesn" is further stemmed to "pes"
	// As it ends in -n which looks like a derivational suffix.
	// [ "pesničky", "pesn" ],
	// Input a word ending in diminutive suffix -ínk and a case suffix -ach
	// Should be stemmed to "blond", but now stemmed to "blo". This is because this word is also processed in palatalise function
	// [ "blondínka", "blond" ],
	// Input a word ending in diminutive suffix -učk and a case suffix -y
	[ "príručky", "prír" ],
	// Input a word ending in diminutive suffix -ušk and a case suffix -a
	[ "popoluška", "popo" ],
	// Input a word ending in diminutive suffix -ék and a case suffix -a
	[ "vinotéka", "vin" ],
	// Input a word ending in diminutive suffix -ik
	[ "vtáčik", "vtá" ],
	// Input a word ending in diminutive suffix -ak
	[ "husák", "husá" ],
	// Input a word ending in diminutive suffix -ok
	[ "kvietok", "kvieto" ],
	// Input a word start in superlative prefix naj-
	[ "najmúdrejší", "múdr" ],
	// Input a word ending in case suffix -eho.
	// [ "teplejšieho", "tep" ],
	// Input a word ending in derivational suffix -obinec.
	[ "", "" ],
	// Input a word ending in derivational suffix -ionár.
	[ "milionár", "mil" ],
	// Input a word ending in derivational suffix -ovisk.
	// [ "pracovisk", "prac" ],
	// Input a word ending in derivational suffix -ovstv.
	[ "majstrovstv", "majstr" ],
	// Input a word ending in derivational suffix -ovec.
	[ "bezdomovec", "bezdom" ],
	// Input a word ending in derivational suffix -ások.
	[ "", "" ],
	// Input a word ending in derivational suffix -nosť.
	[ "možnosť", "mož" ],
	// Input a word ending in derivational suffix -enic.
	[ "smolenic", "smol" ],
	// Input a word ending in derivational suffix -inec.
	// [ "žrebčinec", "žrebč" ],
	// Input a word ending in derivational suffix -árn.
	[ "", "" ],
	// Input a word ending in derivational suffix -enk.
	// [ "podmienk", "podmi" ],
	// Input a word ending in derivational suffix -ián.
	[ "bazilián", "bazil" ],
	// Input a word ending in derivational suffix -och.
	[ "", "" ],
	// Input a word ending in derivational suffix -ost.
	[ "zodpovednost", "zodpovedn" ],
	// Input a word ending in derivational suffix -áč.
	[ "poslucháč", "posluch" ],
	// Input a word ending in derivational suffix -ač.
	[ "prijímač", "prijím" ],
	// Input a word ending in derivational suffix -ec.
	[ "rámec", "rám" ],
	// Input a word ending in derivational suffix -en.
	[ "žiaden", "žiad" ],
	// Input a word ending in derivational suffix -ér.
	[ "manažér", "manaž" ],
	// Input a word ending in derivational suffix -ír.
	[ "krajčír", "krajč" ],
	// Input a word ending in derivational suffix -ic.
	[ "", "" ],
	// Input a word ending in derivational suffix -in.
	[ "", "" ],
	// Input a word ending in derivational suffix -ín.
	[ "", "" ],
	// Input a word ending in derivational suffix -it.
	[ "", "" ],
	// Input a word ending in derivational suffix -iv.
	[ "", "" ],
];


const paradigms = [
	// Paradigm of a noun
	{ stem: "tep", forms: [
		"teplý",
		"teplého",
		"teplému",
		"teplém",
		"teplým",
		"teplá",
		"teplé",
		"teplou",
		"teplí",
		"teplých",
		"teplými",
	] },

	// Paradigm of a noun including the diminutive forms
	{ stem: "mač", forms: [
		"mačka",
		"mačky",
		"mačke",
		"mačku",
		"mačke",
		"mačkou",
		// "mačiek",
		"mačkám",
		"mačkách",
		"mačkami",
		// "mačička",
		// "mačičkou",
	] },

	// Paradigm of a noun with declension pattern "chlap"
	{ stem: "chlap", forms: [
		"chlap",
		"chlapa",
		"chlapovi",
		"chlape",
		"chlapom",
		"chlapi",
		"chlapov",
		"chlapoch",
		"chlapmi",
	] },

	// Paradigm of a noun with declension pattern "dlaň"
	{ stem: "dlaň", forms: [
		"dlaň",
		// "dlane",
		// "dlani",
		"dlaňou",
		// "dlaní",
		// "dlaniam",
		// "dlaniach",
		"dlaňami",
	] },

	// Paradigm of a noun with declension pattern "dub"
	{ stem: "dub", forms: [
		"dub",
		"duba",
		"dubu",
		"dube",
		"dubom",
		"duby",
		"dubov",
		"duboch",
		"dubmi",
	] },

	// Paradigm of a noun with declension pattern "gazdiná"
	{ stem: "gazd", forms: [
		"gazdiná",
		"gazdinej",
		"gazdinú",
		"gazdinou",
		"gazdiné",
		"gazdín",
		"gazdinám",
		"gazdinách",
		"gazdinami",
	] },

	// Paradigm of a noun with declension pattern "dievča"
	{ stem: "diev", forms: [
		"dievča",
		"dievčaťa",
		// "dievčaťu",
		// "dievčati",
		"dievčaťom",
		// "dievčatá",
		"dievčat",
		// "dievčatám",
		// "dievčatách",
		// "dievčatami",
		"dievčence",
		// "dievčeniec",
		// "dievčencom",
		// "dievčencoch",
		// "dievčencami",
	] },

	// Paradigm of an adjective
	{ stem: "krás", forms: [
		"krásny",
		// Comparative
		// "krajši",
		// Superlative
		// "najkrajši",
		"krásneho",
		"krásnemu",
		"krásnom",
		"krásnym",
		"krásna",
		"krásnej",
		"krásnu",
		"krásnou",
		"krásne",
		"krásni",
		"krásnych",
		"krásnymi",
	] },
	// Paradigm of a verb
	{ stem: "pochop", forms: [
		// "pochopiť",
		// "pochopiac",
		// "pochopiaci",
		// "pochopiaca",
		// "pochopiace",
		"pochopený",
		"pochopená",
		"pochopené",
		"pochopení",
		// "pochopím",
		// "pochopíš",
		"pochopí",
		// "pochopíme",
		// "pochopíte",
		// "pochopia",
		// "pochopili",
		// "pochopil",
		// "pochopila",
		// "pochopilo",
		// "pochopme",
		"pochopte",
		// "pochopenie",
	] },
	// Paradigm of a verb
	{ stem: "hovor", forms: [
		// "hovorím",
		// "hovoril",
		// "hovorila",
		// "hovorilo",
		// "hovoriť",
		// "hovoríš",
		"hovorí",
		// "hovorili",
		// "hovoríme",
		// "hovoríte",
		// "hovoria",
		// "hovorme",
		"hovorte",
		// "hovoriaci",
		// "hovoriac",
		// "hovoriace",
		// "hovoriaca",
		"hovorený",
		"hovorená",
		"hovorené",
		"hovorení",
		// "hovorenie",
	] },
];

describe( "Test for stemming Slovak words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataSK ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataSK ) ).toBe( paradigm.stem );
			} );
		}
	}
} );

