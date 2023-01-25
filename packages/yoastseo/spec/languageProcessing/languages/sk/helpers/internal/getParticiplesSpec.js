import getParticiples from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/getParticiples.js";

describe( "Test for matching Slovak participles", function() {
	it( "returns matched participles.", function() {
		const foundParticiples = getParticiples( "budú prepustení." );
		expect( foundParticiples ).toEqual( [ "prepustení" ] );
	} );

	it( "returns an empty array when there is no participle", function() {
		const foundParticiples = getParticiples( "Vstúpila do miestnosti." );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
