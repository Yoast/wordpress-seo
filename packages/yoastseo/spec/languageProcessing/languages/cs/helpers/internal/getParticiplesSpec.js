import getParticiples from "../../../../../../src/languageProcessing/languages/cs/helpers/internal/getParticiples.js";

describe( "Test for matching Czech participles", function() {
	it( "returns matched participles.", function() {
		const foundParticiples = getParticiples( "budou propuštěni." );
		expect( foundParticiples ).toEqual( [ "propuštěni" ] );
	} );

	it( "returns an empty array when there is no participle", function() {
		const foundParticiples = getParticiples( "Vstoupila do místnosti." );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
