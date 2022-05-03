import getParticiples from "../../../../../../src/languageProcessing/languages/pt/helpers/internal/getParticiples.js";

describe( "Test for matching Portuguese participles", function() {
	it( "returns matched irregular participles.", function() {
		const foundParticiples = getParticiples(  "sido acendida con o botão." );
		expect( foundParticiples ).toEqual( [ "acendida" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty", function() {
		expect( getParticiples( "Eu como uma maçã." ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
