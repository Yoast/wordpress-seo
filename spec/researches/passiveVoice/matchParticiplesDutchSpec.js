import matchParticiplesFactory from "../../../src/researches/passiveVoice/periphrastic/matchParticiples";
const matchParticiples = matchParticiplesFactory();

describe( "a test for matching regular participles", function() {
	it( "matches a regular participle following the first regex pattern", function() {
		expect( matchParticiples.regularParticiples( "gekocht", "nl" ) ).toEqual( [ "gekocht" ] );
	} );

	it( "matches a regular participle following the second regex pattern", function() {
		expect( matchParticiples.regularParticiples( "neergedaald", "nl" ) ).toEqual( [ "neergedaald" ] );
	} );

	it( "matches an irregular participle", function() {
		expect( matchParticiples.irregularParticiples( "aaneengedraaid", "nl" ) ).toEqual( [ "aaneengedraaid" ] );
	} );

	it( "does not match a word that is not a regular participle", function() {
		expect( matchParticiples.regularParticiples( "banaan", "nl" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( matchParticiples.regularParticiples( "", "nl" ) ).toEqual( [] );
	} );
} );
