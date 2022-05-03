import getParticiples from "../../../../../../src/languageProcessing/languages/nb/helpers/internal/getParticiples.js";

describe( "Test for matching Norwegian participles", function() {
	it( "returns matched participles.", function() {
		const clauseText = "Oppgaven blir prøvd.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual(  [ "prøvd" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const clauseText = "De liker denne maten.";
		expect( getParticiples( clauseText ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
