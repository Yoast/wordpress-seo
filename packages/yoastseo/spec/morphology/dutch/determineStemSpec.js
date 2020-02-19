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
];

// These words should not be stemmed (same form should be returned).

const wordsNotToStem = [
];

describe( "Test for determining unique stem for Dutch words", () => {
	it( "stems Dutch words", () => {
		wordsToStem.forEach( wordToStem => expect( determineStem( morphologyDataNL, wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
		wordsNotToStem.forEach( wordNotToStem => expect( determineStem( morphologyDataNL, wordNotToStem ) ).toBe( wordNotToStem ) );
	} );
} );
