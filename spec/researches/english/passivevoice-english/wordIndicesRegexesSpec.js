var wordIndicesRegexes = require( "../../../../js/researches/english/passivevoice-english/wordIndicesRegexes.js" );

var determinerList = require( "../../../../js/researches/english/passivevoice-english/determiners.js" )();
var havingList = require( "../../../../js/researches/english/passivevoice-english/having.js" )();
var arrayToRegex = require( "../../../../js/stringProcessing/createRegexFromArray.js" );
var determinersRegex = arrayToRegex( determinerList );
var havingRegex = arrayToRegex( havingList );

describe( "a test for matching determiners.", function() {
	it( "matches a single determiner in a sentence part", function() {
		determiners = wordIndicesRegexes( "A boy.", determinersRegex );
		expect( determiners ).toEqual(
			[
				{ match: 'A ', index: 0 }
			]
		)
	} );

	it( "matches multiple determiners in a sentence part", function() {
		determiners = wordIndicesRegexes( "The boy, the girl, a dog.", determinersRegex );
		expect( determiners ).toEqual(
			[
				{ match: 'The ', index: 0 },
				{ match: ' the ', index: 8 },
				{ match: ' a ', index: 18 }
			]
		);
	} );

	it( "does not match anything in a sentence part without determiners", function() {
		determiners = wordIndicesRegexes( "was chosen.", determinersRegex );
		expect( determiners ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		determiners = wordIndicesRegexes( "", determinersRegex );
		expect( determiners ).toEqual( [] );
	} );
} );

describe( "a test for matching 'having'.", function() {
	it( "matches a single instance of 'having' in a sentence part", function() {
		havingMatches = wordIndicesRegexes( "was having the house painted", havingRegex );
		expect( havingMatches ).toEqual(
			[
				{ match: ' having ', index: 3 }
			]
		)
	} );

	it( "matches multiple instances of 'having' in a sentence part", function() {
		havingMatches = wordIndicesRegexes( "having fun, having the house painted", havingRegex );
		expect( havingMatches ).toEqual(
			[
				{ match: 'having ', index: 0 },
				{ match: ' having ', index: 11 },
			]
		);
	} );

	it( "does not match anything in a sentence part without 'having'", function() {
		havingMatches = wordIndicesRegexes( "was chosen.", havingRegex );
		expect( havingMatches ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		havingMatches = wordIndicesRegexes( "", havingRegex );
		expect( havingMatches ).toEqual( [] );
	} );
} );
