import getParticiples from "../../../../../../src/languageProcessing/languages/pl/helpers/internal/getParticiples.js";

describe( "Test for matching Polish participles", function() {
	it( "returns matched participles.", function() {
		const clauseText = "zostałam zaatakowana przez mewę.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "zaatakowana" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const clauseText = "zaatakował mnie mewa.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
