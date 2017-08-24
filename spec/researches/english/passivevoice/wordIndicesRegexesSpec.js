var wordIndicesRegexes = require( "../../../../js/researches/english/passivevoice/getIndicesWithRegex.js" );

var determinerList = require( "../../../../js/researches/english/passivevoice/determiners.js" )();
var arrayToRegex = require( "../../../../js/stringProcessing/createRegexFromArray.js" );
var determinersRegex = arrayToRegex( determinerList );

describe( "a test for matching determiners.", function() {
	it( "matches a single determiner in a sentence part", function() {
		var determiners = wordIndicesRegexes( "A boy.", determinersRegex );
		expect( determiners ).toEqual(
			[
				{ match: 'A', index: 0 }
			]
		)
	} );

	it( "matches multiple determiners in a sentence part", function() {
		var determiners = wordIndicesRegexes( "The boy, the girl, a dog.", determinersRegex );
		expect( determiners ).toEqual(
			[
				{ match: 'The', index: 0 },
				{ match: ' the', index: 8 },
				{ match: ' a', index: 18 }
			]
		);
	} );

	it( "does not match anything in a sentence part without determiners", function() {
		var determiners = wordIndicesRegexes( "was chosen.", determinersRegex );
		expect( determiners ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		var determiners = wordIndicesRegexes( "", determinersRegex );
		expect( determiners ).toEqual( [] );
	} );
} );

