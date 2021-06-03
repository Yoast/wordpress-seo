import getParticiples from "../../../../../../src/languageProcessing/languages/es/helpers/internal/getParticiples.js";

describe( "Test for matching Spanish participles", function() {
	it( "returns matched participles.", function() {
		const clauseText = "Fueron viajadas con un lunch.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual(  [ "viajadas" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const clauseText = "Yo como una manzana.";
		expect( getParticiples( clauseText ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
