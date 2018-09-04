import participleRegexesFactory from '../../../src/researches/passiveVoice/periphrastic/matchParticiples';
const participleRegexes = participleRegexesFactory();

describe( "a test for matching regular participles.", function() {
	it( "matches a regular participle", function() {
		expect( participleRegexes.regularParticiples( "fried", "en" ) ).toEqual( [ "fried" ] );
	} );

	it( "does not match a word that is not a regular participle", function() {
		expect( participleRegexes.regularParticiples( "banana", "en" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.regularParticiples( "", "en" ) ).toEqual( [] );
	} );
} );

describe( "a test for matching irregular participles.", function() {
	it( "matches an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "chosen", "en" ) ).toEqual( [ "chosen" ] );
	} );

	it( "does not match a word that is not an irregular participle", function() {
		expect( participleRegexes.irregularParticiples( "apple", "en" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.irregularParticiples( "", "en" ) ).toEqual( [] );
	} );
} );
