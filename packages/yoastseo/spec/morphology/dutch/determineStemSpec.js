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
