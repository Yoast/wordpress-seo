import getParticiples from "../../../../../../src/languageProcessing/languages/it/helpers/internal/getParticiples.js";

describe( "Test for matching Italian participles", function() {
	it( "returns matched irregular participles.", function() {
		const clauseText = "Venivano salvati dal bagnino.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples).toEqual( [ "salvati" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const clauseText = "Sto mangiando una mela.";
		expect( getParticiples( clauseText ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
