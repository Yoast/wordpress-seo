var participleRegexes = require( "../../../src/researches/passiveVoice/periphrastic/matchParticiples" )();

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "leído", "es" ) ).toEqual( [ "leído" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "manzana", "es" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "", "es" ) ).toEqual( [] );
	} );
} );
