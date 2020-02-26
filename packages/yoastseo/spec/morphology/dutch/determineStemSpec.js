import { determineStem } from "../../../src/morphology/dutch/determineStem";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;

// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
	// A word that exists on the list of words that should not be stemmed and that is a strong verb (1-11 condition in flowchart).
	[ "smolt", "smelt" ],
	// Words that are on the list of words that should not be stemmed (1-12)
	[ "ander", "ander" ],
	[ "beneden", "beneden" ],
	[ "zeker", "zeker" ],
	// Words that are on the list of words with full forms (2-12)
	[ "skiën", "ski" ],
	[ "raderen", "rad" ],
	[ "grofs", "grof" ],
	// Words that are on the list of nonParticiples (are matched with participle regex but are not actually participles) (3a-15).
	[ "geld", "gel" ],
	[ "gevelwand", "gevelwan" ],
	[ "beurt", "beur" ],
	// A word on the list of inseparable compound verbs that should not be stemmed (3b)
	[ "onderricht", "onderricht" ],
	// A participle without separable or inseparable prefixes that should not have the ge- stemmed (3c)
	[ "gebeurd", "gebeurd" ],
	// A word on the list of inseparable compound verbs (3d)
	[ "onderverhuurd", "onderverhuur" ],
	// A participle of a strong verb without separable or inseparable prefixes which should have the suffix removed (3e-11)
	[ "gevraagd", "vraag" ],
	[ "gejaagd", "jaag" ],
	// A participle of a regular verb without separable or inseparable prefixes which should have the suffix removed (3e-12)
	[ "gewandeld", "wandel" ],
	[ "gezwikt", "zwik" ],
	[ "geankerd", "anker" ],
	// A participle of a strong verb without separable or inseparable prefixes which should not have the suffix removed (3f-11)
	[ "gebracht", "breng" ],
	// A participle of a regular verb without separable or inseparable prefixes which should not have the suffix removed (3f-15)
	[ "gesport", "sport" ],
	[ "getocht", "tocht" ],
	[ "gekorst", "korst" ],
	// A participle of a strong verb with a separable prefix which should have the suffix removed. (3h-11)
	[ "afgescheerd", "afscheer" ],
	// A participle of a regular verb with a separable prefix which should have the suffix removed (3h-12).
	[ "aangegroied", "aangroei" ],
	[ "opgesmukt", "opsmuk" ],
	[ "aangebakt", "aanbak" ],
	// A participle of a strong verb with a separable prefix which should not have the suffix removed. (3i-11)
	[ "aangebracht", "aanbreng" ],
	// A participle of a regular verb with a separable prefix which should not have the suffix removed. (3i-15)
	[ "afgerond", "afrond" ],
	[ "uitgerust", "uitrust" ],
	[ "aangelicht", "aanlicht" ],
	// A participle of a strong verb with an inseparable prefix which should have the suffix removed. (3k-11)
	[ "verzind", "verzin" ],
	// A participle of a regular verb with an inseparable prefix which should have the suffix removed. (3k-12)
	[ "verlakt", "verlak" ],
	[ "onderdrukt", "onderdruk" ],
	[ "herhaald", "herhaal" ],
	// A participle of a strong verb with an inseparable prefix which should not have the suffix removed. (3l-11)
	[ "onderbracht", "onderbreng" ],
	// A participle of a regular verb with an inseparable prefix which should not have the suffix removed. (3l-15)
	[ "vertroost", "vertroost" ],
	[ "beantwoord", "beantwoord" ],
	[ "verlicht", "verlicht" ],
	// A verb ending in -t that is on the list of verbs that should have the -t stemmed (4a-12)
	[ "scratcht", "scratch" ],
	[ "vrijt", "vrij" ],
	[ "groeit", "groei" ],
	// A noun matched with a regex for when -t should not be stemmed, that is on the list of nouns with multiple stems (4b-10)
	[ "vaat", "vat" ],
	[ "loot", "lot" ],
	// A strong verb matched with a regex for when -t should not be stemmed (4b-11)
	[ "sloot", "sluit" ],
	[ "kweet", "kwijt" ],
	// A word matched with a regex for when -t should not be stemmed (4b-13)
	[ "astronaut", "astronaut" ],
	[ "nacht", "nacht" ],
	[ "favoriet", "favoriet" ],
	// A strong verb ending in -tte/tten/dde/dden (4c-11)
	[ "zoutten", "zout" ],
	[ "barstten", "barst" ],
	[ "ziedden", "zied" ],
	// A word ending in -tte/tten/dde/dden (4c-13)
	[ "katten", "kat" ],
	[ "grondden", "grond" ],
	[ "splitten", "split" ],
	// Other specs:
	// Return the unique stem from noun exception list with multiple stems
	[ "daag", "dag" ],
	[ "bigget", "big" ],
	[ "krab", "krab" ],
	// Return the unique stem from verb exception list
	[ "doorliep", "doorloop" ],
	[ "begin", "begin" ],
	[ "berg", "berg" ],
	[ "zeek", "zeik" ],
	// Return the unique stem from word that end in -t/-d
	[ "roeit", "roei" ],
	[ "effect", "effect" ],
	[ "katten", "kat" ],
	[ "ontbieden", "ontbied" ],
	[ "potloden", "potlood" ],
	[ "beenharde", "beenhard" ],
	[ "mode", "mood" ],
	[ "compote", "compoot" ],
	[ "taarten", "taart" ],

	// Word that ends in -heden
	[ "snelheden", "snelheid" ],
	[ "gezonheden", "gezonheid" ],
	// Word that ends in -den with -d being part of the stem (4-e) and the stem is in verb exception list (1-11)
	[ "belijden", "belijd" ],
	// Word that ends in -den with -d being part of the stem (4-e) and the stem ends in t/d (1-13)
	[ "onthoofden", "onthoofd" ],
	/*
	 * Word that ends in -den with -d being part of the stem and undergoes vowel doubling after suffix deletion (4-d)
	 * and the stem ends in t/d (1-13)
	 */
	[ "potloden", "potlood" ],
	// Word that ends in -de with -d being part of the stem (4-g) and the stem ends in t/d (1-13)
	[ "hoede", "hoed" ],
	/*
	 * Word that ends in -de with -d being part of the stem and undergoes vowel doubling after suffix deletion (4-f)
	 * and the stem ends in t/d (1-13)
	 */
	[ "mode", "mood" ],
	/*
	 * Word that ends in -te/-ten with -t being part of the stem and undergoes vowel doubling after suffix deletion (4-h)
	 * and the stem ends in t/d (1-13)
	 */
	[ "blaten", "blaat" ],
	/*
	 * Word that ends in -te/-ten with -t being part of the stem and undergoes vowel doubling after suffix deletion (4-h)
	 * and the stem is in verb exception list (1-11)
	 */
	[ "stoten", "stoot" ],
	// Word that ends in -te/-ten with -t being part of the stem (4-i) and the stem is in verb exception list (1-11)
	[ "zouten", "zout" ],
	// Word that ends in -te/-ten with -t being part of the stem (4-i) and the stem ends in t/d (1-13)
	[ "taarten", "taart" ],
	// Word that is in adjective exception list and gets suffix -er/-ere (6) and the stem ends in t/d (1-13)
	[ "harder", "hard" ],
	[ "absurdere", "absurd" ],
	// Word that gets suffix -tje/-etje and is in removeSuffixFromFullForms list (7) and the stem ends in t/d (1-13)
	[ "ingrediëntje", "ingrediënt" ],
	// Word that gets suffix -tje/-etje and is in removeSuffixFromFullForms list (7) and the stem does not end in -t/-d (1-12)
	[ "garagetje", "garage" ],
	[ "taxietje", "taxi" ],
	// Noun that is in stemJeAndOnePrecedingVowel list (8) and the stem does not end in -t/-d (1-12)
	[ "dramaatje", "drama" ],
	[ "cameraatje", "camera" ],
	// Verb that gets suffix -ten (9-b) and is in verb exception list (1-11)
	[ "lachten", "lach" ],
	[ "bakten", "bak" ],
	// Verb that gets suffix -ten (9-b) and is neither in an exception list nor ends in t/d (1-12)
	[ "etsten", "ets" ],
	// Word that gets suffix -en and undergoes stem modification after suffix deletion (9-c-o) and is in noun exception list (1-10)
	[ "bruggen", "brug" ],
	// Word that gets suffix -en (9-c-) and is in verb exception list (1-11)
	[ "duiken", "duik" ],
	// Word that gets suffix -en and undergoes stem modification after suffix deletion (9-c-o) and is in verb exception list (1-11)
	[ "klimmen", "klim" ],
	/*
	 * Word that gets suffix -en and is in getVowelDoubling list (9-d-i)
	 * and does not end in t/d (1-12)
	 */
	[ "nivelleren", "nivelleer" ],
	/*
	 * Word that gets suffix -en and is in noVowelOrConsonantDoubling list (9-d-ii)
	 * and is in noun exception list (1-10)
	 */
	[ "vaten", "vat" ],
	/*
	 * Word that gets suffix -en and is in noVowelOrConsonantDoubling list (9-d-ii)
	 * and is in verb exception list (1-11)
	 */
	[ "traden", "treed" ],
	// Word that gets suffix -en (9-c) and does not end in t/d (1-12)
	[ "werken", "werk" ],
	// Word that gets suffix -en (9-d-iii) and does not end in t/d (1-12)
	[ "luttelen", "luttel" ],
	// Word that gets suffix -en (9-c) and the stem ends in -t/-d (1-15) (incorrect stem)
	[ "duiden", "dui" ],
	// Change -ied/-ïed to -id after suffix -st/-ste deletion (9-e) and the stem ends in -t/-d (1-15) (incorrect stem)
	[ "rigiedst", "rigi" ],
	[ "paranoïedste", "paranoï" ],
	// Word that gets suffix -t (9-f) and is in an verb exception list (1-11)
	[ "sterft", "sterf" ],
	[ "bindt", "bind" ],
	/*
	 * Word that gets suffix -ën and also gets its last -e deleted after suffix deletion (9-f-m)
	 * and is neither in an exception list nor ends in t/d (1-12) (incorrect stem)
	 */
	[ "melodieën", "melodi" ],
	// Word that gets suffix -der (9-f) and is neither in an exception list nor ends in t/d (1-12)
	[ "lekkerder", "lekker" ],
	// Word that gets suffix -je (9-g) and is in an noun exception list (1-10)
	[ "glaasje", "glaas" ],
	[ "biggetje", "big" ],
	// Word that gets suffix -je (9-g) and the stem ends in -t/-d (1-15) (incorrect stem)
	[ "plaatje", "plaa" ],
	// Word that gets suffix -pje (9-g) and is neither in an exception list nor ends in t/d (1-12)
	[ "museumpje", "museum" ],
	// Word that gets suffix -kje (9-h) and is neither in an exception list nor ends in t/d (1-12)
	[ "kettinkje", "ketting" ],
	[ "woninkje", "woning" ],
	// Word that gets suffix -end/-ende (9-i) and is neither in an exception list nor ends in t/d (1-12)
	[ "werkend", "werk" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion (9-i-o)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "rennende", "ren" ],
	// Word that gets suffix -end/-ende (9-i) and is in an verb exception list (1-11)
	[ "smeltend", "smelt" ],
	[ "helpende", "help" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion (9-j)
	 * and is in an verb exception list (1-11)
	 */
	[ "wegend", "weeg" ],
	[ "wegende", "weeg" ],
	// Word that ends in -t end gets -end suffix (4-h-13)
	[ "plantend", "plant" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion (9-j)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "makende", "maak" ],
	[ "makend", "maak" ],
	// Word that gets suffix -de/-den (9-k) and is in an verb exception list (1-11)
	[ "beginde", "begin" ],
	[ "vouwden", "vouw" ],
	// Word that gets suffix -de/-den (9-k) and is neither in an exception list nor ends in t/d (1-12)
	[ "waagde", "waag" ],
	[ "humde", "hum" ],
	// Word that gets suffix -ë (9-l) and is neither in an exception list nor ends in t/d (1-12)
	[ "moeë", "moe" ],
	[ "reeë", "ree" ],
	// Word that gets suffix -e (9-m) and is neither in an exception list nor ends in t/d (1-12)
	[ "lekkere", "lekker" ],
	[ "bittere", "bitter" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion (9-n-iv)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "schone", "schoon" ],
	[ "hoge", "hoog" ],
	/*
	 * Word that gets suffix -etje and gets stem modification after suffix deletion (9-g-o)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "balletje", "bal" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion (9-m-o)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "zwakke", "zwak" ],
	// Change -iël to -ieel after suffix -er/-ers/-ere deletion (9-c-p) and the stem is neither in an exception list nor ends in t/d (1-12)
	[ "partiëler", "partieel" ],
	[ "essentiëlers", "essentieel" ],
	[ "initiëlere", "initieel" ],
	// Change -iël to -ieel after suffix -e deletion (9-m-p) and the stem is neither in an exception list nor ends in t/d (1-12)
	[ "initiële", "initieel" ],
	[ "essentiële", "essentieel" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion (9-c-q)
	 * and is in an verb exception list (1-11)
	 */
	[ "bedelven", "bedelf" ],
	[ "vriezen", "vries" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion (9-d-q)
	 * and is in verb exception list (1-11)
	 */
	[ "geblazen", "blaas" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion (9-c-q)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "luizen", "luis" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion (9-d-q)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "reven", "reef" ],
	/*
	 * Word that gets suffix -end and undergoes stem-ending devoicing after suffix deletion (9-i-q)
	 * and is in verb exception list (1-11)
	 */
	[ "bedelvend", "bedelf" ],
	/*
	 * Word that gets suffix -ende and gets stem modification after suffix deletion (9-j-q)
	 * and is in an verb exception list (1-11)
	 */
	[ "blazende", "blaas" ],
	/*
	 * Word that gets suffix -end/-ende and undergoes stem-ending devoicing after suffix deletion (9-i-q)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "luizend", "luis" ],
	[ "grievende", "grief" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion (9-j-q)
	 * and is neither in an exception list nor ends in t/d (1-12)
	 */
	[ "snevende", "sneef" ],
	[ "dovend", "doof" ],
	/*
 	 * Word that gets suffix -e and undergoes stem-ending devoicing after suffix deletion (9-m-q)
	 * and is neither in an exception list nor ends in t/d (1-12)
 	*/
	[ "vieze", "vies" ],
	// Word that gets suffix -e and gets stem modification after suffix deletion (9-n-q) and is neither in an exception list nor ends in t/d (1-12)
	[ "daze", "daas" ],


];

// These words should not be stemmed (same form should be returned).

const wordsNotToStem = [
	// Return the unique stem from words that does not end in -t/-d
	"maak",
	// Return the unique stem from word that is in words not to stem exception list
	"print",
];

describe( "Test for determining unique stem for Dutch words", () => {
	it( "stems Dutch words", () => {
		wordsToStem.forEach( wordToStem => expect( determineStem( morphologyDataNL, wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
		wordsNotToStem.forEach( wordNotToStem => expect( determineStem( morphologyDataNL, wordNotToStem ) ).toBe( wordNotToStem ) );
	} );
} );
