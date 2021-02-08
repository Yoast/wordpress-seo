import participleRegexesFactory from "../../../src/languageProcessing/helpers/passiveVoice/periphrastic/matchRegularParticiples";
const participleRegexes = participleRegexesFactory();

describe( "a test for matching regular participles.", function() {
	it( "matches a regular participle", function() {
		expect( participleRegexes.regularParticiples( "dělána", "cz" ) ).toEqual( [ "fried" ] );
	} );

	it( "does not match a word that is not a regular participle", function() {
		expect( participleRegexes.regularParticiples( "kramle", "cz" ) ).toEqual( [] );
	} );

	it( "does not match an empty string", function() {
		expect( participleRegexes.regularParticiples( "", "cz" ) ).toEqual( [] );
	} );
} );
