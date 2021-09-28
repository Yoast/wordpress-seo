import getParticiples from "../../../../../../src/languageProcessing/languages/el/helpers/internal/getParticiples";

describe( "Test for matching Greek participles", function() {
	it( "returns matched participles.", function() {
		const sentence = "η γάτα εγκαταλείφμένος.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples.participle ).toEqual( [ "εγκαταλείφμένος" ] );
		expect( foundParticiples.type ).toEqual( "participle" );

	} );

	it( "returns no matched participles.", function() {
		const sentence = "η γάτα εγκαταλ.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( null );
	} );
} );
