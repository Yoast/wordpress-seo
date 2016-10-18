var participleRegexes = require( "../../../../js/researches/english/passivevoice-english/participleRegexes.js" )();

describe( "a test for matching regular participles.", function() {
	it( "matches a regular participle", function() {
		expect( participleRegexes.regularParticiples( "fried" ) ).toEqual( [ "fried" ] );
	} );

	it( "does not match a word that is not a regular participle", function() {
		expect( participleRegexes.regularParticiples( "banana" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.regularParticiples( "" ) ).toEqual( [] );
	} );
} );

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "chosen" ) ).toEqual( [ "chosen" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "apple" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "" ) ).toEqual( [] );
	} );
} );
