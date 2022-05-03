import stem from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// A verb on the list of exceptions with full forms
	[ "bobsleede", "bobslee" ],
	// A regular participle.
	[ "getest", "test" ],
	// A word on the exception list of words not to stem.
	[ "bruiloft", "bruiloft" ],
	/*
     * A word that goes through the -t/-d stemming check but is not matched by any rule and which then is stemmed through
     * the general stemming algorithm.
	 */
	[ "bedaarde", "bedaar" ],
	/*
	 * A word that is on an exception list of no vowel doubling, and which is matched in the -t/-d stemming check and should
	 * not have the -t stemmed.
	 */
	[ "vaten", "vat" ],
	/*
	 * An inflected adjective which is on the exception list of comparative adjectives ending on -rder which should have only -er stemmed
	 * (as opposed to -der).
	*/
	[ "absurdere", "absurd" ],
	// A word on the list of words that should have -s suffix removed, and which does not require vowel doubling.
	[ "tattoos", "tattoo" ],
];

describe( "Test for stemming Dutch words", () => {
	it( "stems Dutch nouns", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataNL ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
