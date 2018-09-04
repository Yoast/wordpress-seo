import matchParticiplesFactory from '../../../src/researches/passiveVoice/periphrastic/matchParticiples';
const matchParticiples = matchParticiplesFactory();

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( matchParticiples.irregularParticiples( "narysowany", "pl" ) ).toEqual( [ "narysowany" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( matchParticiples.irregularParticiples( "słońce", "pl" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( matchParticiples.irregularParticiples( "", "pl" ) ).toEqual( [] );
	} );
} );
