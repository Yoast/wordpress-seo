import stem from "../../../../../../src/languageProcessing/languages/pl/helpers/internal/stem";

/*
 * Minimal morphology data, shaped like the real Polish data: the dictionary is a plain object (as it is when parsed from JSON),
 * which means that it inherits the members of Object.prototype.
 */
const morphologyData = JSON.parse( JSON.stringify( {
	dictionary: {
		stems: {
			psa: "pies",
		},
	},
	externalStemmer: {
		diminutiveSuffixes: {},
		nounSuffixes: {},
		verbSuffixes: {},
		adjectiveAndAdverbSuffixes: {},
		generalSuffixes: {},
		superlativePrefix: "naj",
	},
} ) );

describe( "Test for looking up Polish words in the dictionary stemmer", () => {
	it( "replaces a word that is in the dictionary with its base form", () => {
		expect( stem( "psa", morphologyData ) ).toBe( "pies" );
	} );

	it( "returns a word that is not in the dictionary as it is when no suffix is found", () => {
		expect( stem( "dom", morphologyData ) ).toBe( "dom" );
	} );

	it.each( [
		[ "constructor" ],
		[ "toString" ],
		[ "valueOf" ],
		[ "hasOwnProperty" ],
		[ "isPrototypeOf" ],
		[ "__proto__" ],
	] )( "does not treat the Object.prototype member '%s' as a dictionary entry", ( word ) => {
		expect( stem( word, morphologyData ) ).toBe( word );
	} );
} );
