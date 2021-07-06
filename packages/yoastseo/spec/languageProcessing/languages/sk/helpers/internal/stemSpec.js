import stem from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -atoch.
	[ "sampionatoch", "sampio" ],
	// Input a word ending in case suffix -aťom.
	[ "arcikniežaťom", "arcikniež" ],
	// Input a word ending in case suffix -och.
	[ "mesiacoch", "mesia" ],
	// Input a word ending in case suffix -ému.
	[ "samotnému", "samot" ],
	// Input a word ending in case suffix -ých.
	[ "ktorých", "ktor" ],
	// Input a word ending in case suffix -ých and a derivational suffix -č.
	[ "zahraničných", "zahrani" ],
	// Input a word ending in case suffix -ata.
	[ "zvierata", "zviera" ],
	// Input a word ending in case suffix -om and a derivational suffix -ob.
	[ "spôsobom", "spôs" ],
	// Input a word ending in case suffix -om.
	[ "spolužiakom", "spolužia" ],
	// Input a word ending in case suffix -es.
	[ "najdes", "naj" ],
	// Input a word ending in case suffix -ím.
	[ "hovorím", "hovo" ],
	// Input a word ending in case suffix -úm.
	[ "chartúm", "char" ],
	// Input a word ending in case suffix -ej.
	[ "súčasnej", "súčas" ],
	// Input a word ending in possessive suffix -ov.
	[ "problémov", "problém" ],
	// Input a word ending in possessive suffix -in.
	[ "problémin", "problém" ],
	// Input a word ending in comparative suffix -ejš.
	[ "mokrejš", "mokr" ],
	// Input a word ending in a case suffix -í and comparative suffix -ejš.
	[ "skúpejší", "skúp" ],
	// Input a word ending in a case suffix -í and comparative suffix -ějš.
	[ "nejkrásnější", "nejkrás" ],
	// Input a word ending in diminutive suffix -oušok (a made-up word).
	[ "prístroušok", "prístr" ],
	// Input a word ending in diminutive suffix -ečok.
	[ "zrniečok", "zrni" ],
	// Input a word ending in diminutive suffix -ínok.
	[ "blondínok", "blond" ],
	// Input a word ending in diminutive suffix -ačok.
	[ "spišiačok", "spiš" ],
	// Input a word ending in diminutive suffix -anok.
	[ "lužianok", "luh" ],
	// Input a word ending in diminutive suffix -ičk and a case suffix -a.
	[ "mamička", "mam" ],
	// Should be stemmed into "pesn" (song), not "pes"(dog). With the current stemmer, "pesn" is further stemmed to "pes"
	// As it ends in -n which looks like a derivational suffix.
	// [ "pesničky", "pesn" ],
	// Input a word ending in diminutive suffix -ínk and a case suffix -a
	// Should be stemmed to "blond", but now stemmed to "blo". This is because this word is also processed in palatalise function
	// [ "blondínka", "blond" ],
	// Input a word ending in diminutive suffix -učk and a case suffix -y.
	[ "príručky", "prír" ],
	// Input a word ending in diminutive suffix -ušk and a case suffix -a.
	[ "popoluška", "popo" ],
	// Input a word ending in diminutive suffix -ék and a case suffix -a.
	[ "vinotéka", "vin" ],
	// Input a word ending in diminutive suffix -ik.
	[ "vtáčik", "vtá" ],
	// Input a word ending in diminutive suffix -ak.
	[ "husák", "husá" ],
	// Input a word ending in diminutive suffix -ok.
	[ "kvietok", "kvieto" ],
	// Input a word start in superlative prefix naj-
	[ "najmúdrejší", "múdr" ],
	// Input a word ending in case suffix -eho.
	// [ "teplejšieho", "tep" ],
	// Input a word ending in possessive suffix -ov.
	// [ "dolárov", "dolár" ],
	// Input a word ending in possessive suffix -in.
	[ "zločin", "zlo" ],
	// Input a word ending in case suffix -ejš.
	[ "mokrejš", "mokr" ],
	// Input a word ending in diminutive suffix -ečok.
	[ "zrniečok", "zrni" ],
	// Input a word ending in diminutive suffix -éčok.
	[ "dévedéčok", "déved" ],
	// Input a word ending in diminutive suffix -áčok.
	// [ "speváčok", "spev" ],
	// Input a word ending in diminutive suffix -ačok.
	// [ "spolužiačok", "spoluži" ],
	// Input a word ending in diminutive suffix -ečk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -éčk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -áčk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ačk.
	[ "", "" ],
	// Input a word ending in diminutive suffix -ek.
	[ "jednotiek", "jednoti" ],
	// Input a word ending in diminutive suffix -ék.
	[ "szerencsejáték", "szerencsejá" ],
	// Input a word ending in diminutive suffix -ák. The correct stem is "spev".
	// [ "spevák", "spevá" ],
	// Input a word ending in diminutive suffix -ak.
	// [ "spolužiak", "spoluži" ],
	// Input a word ending in augmentative suffix -ajzn.
	[ "stabajzna", "stab" ],
	// Input a word ending in augmentative suffix -izn.
	[ "priblizne", "prib" ],
	// Input a word ending in augmentative suffix -isk and a derivational suffix -ov
	[ "parkovisk", "park" ],
	// Input a word ending in augmentative suffix -ák. The correct stem is "ukazov".
	// [ "ukazovák", "ukazov" ],
	// Input a word ending in derivational suffix -obinec.
	[ "starobinec", "star" ],
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
	[ "legendárneho", "legend" ],
	// Input a word ending in derivational suffix -enk.
	// [ "podmienk", "podmi" ],
	// Input a word ending in derivational suffix -ián.
	[ "bazilián", "bazil" ],
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
	[ "tvárnic", "tvárn" ],
	// Input a word ending in derivational suffix -in.
	[ "zločin", "zlo" ],
	// Input a word ending in derivational suffix -ín.
	[ "potravín", "potrav" ],
	// Input a word ending in derivational suffix -it.
	[ "vysvetlit", "vysvetl" ],
	// Input a word ending in derivational suffix -iv.
	[ "liečiv", "liek" ],
	// Stems a word from the exception list of stems with full forms.
	[ "oči", "oko" ],
];


const paradigms = [
	// Paradigm of a noun.
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

	// Paradigm of a noun including the diminutive forms.
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
		"mačička",
		"mačičkou",
		"mačičky",
		"mačičke",
		"mačičku",
		// "mačičiek",
		"mačičkám",
		"mačičkách",
		"mačičkami",
	] },

	// Paradigm of a noun with declension pattern "chlap".
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

	// Paradigm of a noun with declension pattern "dlaň".
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

	// Paradigm of a noun with declension pattern "dub".
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

	// Paradigm of a noun with declension pattern "gazdiná".
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

	// Paradigm of a noun with declension pattern "dievča".
	{ stem: "dievča", forms: [
		"dievča",
		"dievčaťa",
		"dievčaťu",
		"dievčati",
		"dievčaťom",
		"dievčatá",
		"dievčat",
		"dievčatám",
		"dievčatách",
		"dievčatami",
		"dievčence",
		"dievčeniec",
		"dievčencom",
		"dievčencoch",
		"dievčencami",
	] },

	// Paradigm of a noun with declension pattern "hrdina".
	{ stem: "hrd", forms: [
		"hrdina",
		"hrdinu",
		"hrdinovi",
		"hrdinom",
		// "hrdinovia",
		"hrdinov",
		"hrdinoch",
		"hrdinami",
	] },

	// Paradigm of a noun with declension pattern "kosť".
	{ stem: "kosť", forms: [
		"kosť",
		"kosti",
		"kosťou",
		"kostí",
		"kostiam",
		"kostiach",
		"kosťami",
	] },

	// Paradigm of a noun with declension pattern "mesto".
	{ stem: "mes", forms: [
		"mesto",
		"mesta",
		"mestu",
		"meste",
		"mestom",
		"mestá",
		"miest",
		"mestám",
		"mestách",
		"mestami",
	] },

	// Paradigm of a noun with declension pattern "srdce".
	{ stem: "srd", forms: [
		"srdce",
		"srdca",
		"srdcu",
		"srdci",
		"srdcom",
		"srdcia",
		"sŕdc",
		"srdciam",
		"srdciach",
		"srdciami",
	] },

	// Paradigm of a noun with declension pattern "stroj".
	{ stem: "stroj", forms: [
		"stroj",
		"stroja",
		"stroju",
		"stroji",
		"strojom",
		"stroje",
		"strojov",
		"strojoch",
		"strojmi",
	] },

	// Paradigm of a noun with declension pattern "ulica".
	{ stem: "uli", forms: [
		"ulica",
		"ulice",
		"ulici",
		"ulicu",
		"ulicou",
		// "ulíc",
		// "uliciam",
		// "uliciach",
		"ulicami",
	] },

	// Paradigm of a noun with declension pattern "vysvedčenie".
	{ stem: "vysvedčeni", forms: [
		"vysvedčenia",
		"vysvedčeniu",
		"vysvedčenie",
		// "vysvedčení",
		// "vysvedčením",
		// "vysvedčeniam",
		"vysvedčeniach",
		"vysvedčeniami",
	] },

	// Paradigm of a noun with declension pattern "žena".
	{ stem: "žen", forms: [
		"žena",
		"ženy",
		"žene",
		"ženu",
		"ženou",
		// "žien",
		"ženám",
		"ženách",
		"ženami",
	] },

	// Paradigm of an adjective
	{ stem: "krás", forms: [
		"krásny",
		// Comparative.
		// "krajši",
		// Superlative.
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

	// Paradigm of an adjective with "pekný" pattern.
	{ stem: "pek", forms: [
		"pekný",
		"pekného",
		"peknému",
		"peknom",
		"pekným",
		"pekná",
		"peknú",
		"peknej",
		"peknou",
		"pekní",
		"pekných",
		"peknými",
	] },

	// Paradigm of an adjective with "cudzí" pattern.
	{ stem: "cudz", forms: [
		"cudzí",
		// "cudzieho",
		// "cudziemu",
		"cudzom",
		// "cudzím",
		// "cudzia",
		"cudzej",
		// "cudziu",
		"cudzou",
		// "cudzie",
		"cudzích",
		"cudzími",
	] },

	// Paradigm of an adjective with "otcov" pattern.
	{ stem: "otc", forms: [
		"otcov",
		// "otcovho",
		// "otcovmu",
		"otcovom",
		"otcovým",
		"otcova",
		"otcovej",
		"otcovu",
		"otcovu",
		"otcovi",
		"otcových",
		"otcovými",
	] },

	// Paradigm of a verb.
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
	// Paradigm of a verb.
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

