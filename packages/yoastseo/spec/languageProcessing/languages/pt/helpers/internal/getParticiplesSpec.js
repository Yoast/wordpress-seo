import getParticiples from "../../../../../../src/languageProcessing/languages/pt/helpers/internal/getParticiples.js";

describe( "Test for matching Portuguese participles", function() {
	it( "returns matched irregular participles.", function() {
		const foundParticiples = getParticiples(  "sido acendida con o botão." );
		expect( foundParticiples ).toEqual( [ "sido", "acendida" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		expect( getParticiples( "Eu como uma maçã." ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );

	it( "correctly recognizes a participle ending in -os", function() {
		expect( getParticiples( "Eles foram convocados para o tribunal." ) ).toEqual( [ "convocados" ] );
	} );

	it( "returns an empty array when word ends in -os but is not a participle.", function() {
		expect( getParticiples( "Os chaveiros foram para a guerra." ) ).toEqual( [] );
	} );
} );
