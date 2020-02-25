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
