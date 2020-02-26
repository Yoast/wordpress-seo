import { determineStem } from "../../../src/morphology/dutch/determineStem";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataNL = getMorphologyData( "nl" ).nl;

// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
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
	// Word that gets suffix -end/-ende and is in an verb exception list (9i-11)
	[ "smeltend", "smelt" ],
	[ "helpende", "help" ],
	// Word that gets suffix -end/-ende and gets stem modification after suffix deletion and is in an verb exception list (9j-11)
	[ "wegend", "weeg" ],
	[ "wegende", "weeg" ],
	// Word that ends in -t end gets -end suffix (4h-13)
	[ "plantend", "plant" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9j-12)
	 */
	[ "makende", "maak" ],
	[ "makend", "maak" ],
	// Word that gets suffix -de/-den and is in an verb exception list (9k-11)
	[ "beginde", "begin" ],
	[ "vouwden", "vouw" ],
	// Word that gets suffix -de/-den and is neither in an exception list nor ends in t/d (9k-12)
	[ "waagde", "waag" ],
	[ "humde", "hum" ],
	// Word that gets suffix -ë and is neither in an exception list nor ends in t/d (9l-12)
	[ "moeë", "moe" ],
	[ "reeë", "ree" ],
	// Word that gets suffix -e and is neither in an exception list nor ends in t/d (9m-12)
	[ "lekkere", "lekker" ],
	[ "bittere", "bitter" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9n-12)
	 */
	[ "schone", "schoon" ],
	[ "hoge", "hoog" ],
	/*
	 * Word that gets suffix -etje and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9go-12)
	 */
	[ "balletje", "bal" ],
	/*
	 * Word that gets suffix -e and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9mo-12)
	 */
	[ "zwakke", "zwak" ],
	// Change -iël to -ieel after suffix -er/-ers/-ere deletion and the stem is neither in an exception list nor ends in t/d (9cp-12)
	[ "partiëler", "partieel" ],
	[ "essentiëlers", "essentieel" ],
	[ "initiëlere", "initieel" ],
	// Change -iël to -ieel after suffix -e deletion and the stem is neither in an exception list nor ends in t/d (9mp-12)
	[ "initiële", "initieel" ],
	[ "essentiële", "essentieel" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion
	 * and is in an verb exception list (9cq-11)
	 */
	[ "bedelven", "bedelf" ],
	[ "vriezen", "vries" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion
	 * and is in verb exception list (9dq-11)
	 */
	[ "geblazen", "blaas" ],
	/*
	 * Word that gets suffix -en and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9cq-12)
	 */
	[ "luizen", "luis" ],
	/*
	 * Word that gets suffix -en and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9dq-12)
	 */
	[ "reven", "reef" ],
	/*
	 * Word that gets suffix -end and undergoes stem-ending devoicing after suffix deletion
	 * and is in verb exception list (9iq-11)
	 */
	[ "bedelvend", "bedelf" ],
	/*
	 * Word that gets suffix -ende and gets stem modification after suffix deletion
	 * and is in an verb exception list (9jq-11)
	 */
	[ "blazende", "blaas" ],
	/*
	 * Word that gets suffix -end/-ende and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9iq-12)
	 */
	[ "luizend", "luis" ],
	[ "grievende", "grief" ],
	/*
	 * Word that gets suffix -end/-ende and gets stem modification after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9jq-12)
	 */
	[ "snevende", "sneef" ],
	[ "dovend", "doof" ],
	/*
 	 * Word that gets suffix -e and undergoes stem-ending devoicing after suffix deletion
	 * and is neither in an exception list nor ends in t/d (9mq-12)
 	*/
	[ "vieze", "vies" ],
	// Word that gets suffix -e and gets stem modification after suffix deletion and is neither in an exception list nor ends in t/d (9nq-12)
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
