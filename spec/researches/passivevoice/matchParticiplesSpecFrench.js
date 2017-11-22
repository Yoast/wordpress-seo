var participleRegexes = require( "../../../js/researches/french/passivevoice/matchParticiples" )();

describe( "a test for matching regular participles.", function() {
	it( "matches a regular participle", function() {
		expect( participleRegexes.regularParticiples( "mangé", "fr" ) ).toEqual( [ "mangé" ] );
	} );

	it( "matches a regular participle with a suffix", function() {
		expect( participleRegexes.regularParticiples( "mangées", "fr" ) ).toEqual( [ "mangées" ] );
	} );

	it( "does not match a word that is not a regular participle", function() {
		expect( participleRegexes.regularParticiples( "banane", "fr" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.regularParticiples( "" ) ).toEqual( [] );
	} );
} );

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "vendu", "fr" ) ).toEqual( [ "vendu" ] );
	} );

	it( "matches an irregular participle with a suffix", function() {
		expect( participleRegexes.irregularParticiples( "vendues", "fr" ) ).toEqual( [ "vendues" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "pomme", "fr" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "", "fr" ) ).toEqual( [] );
	} );
} );
