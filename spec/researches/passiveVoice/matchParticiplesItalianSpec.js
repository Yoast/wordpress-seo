var participleRegexes = require( "../../../js/researches/passiveVoice/periphrastic/matchParticiples" )();

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "concluso", "it" ) ).toEqual( [ "concluso" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "mela", "it" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "", "it" ) ).toEqual( [] );
	} );
} );
