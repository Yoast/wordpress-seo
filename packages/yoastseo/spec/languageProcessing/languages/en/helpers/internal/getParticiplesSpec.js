import getParticiples from "../../../../../../src/languageProcessing/languages/en/helpers/internal/getParticiples";

describe( "Test for matching English participles", function() {
	it( "returns matched regular participles.", function() {
		const clauseText = "The cats are loved.";

		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual(  [ "loved" ] );
	} );

	it( "returns matched irregular participles.", function() {
		const clauseText = "The cats were given.";
		const foundParticiples = getParticiples( clauseText );
		expect( foundParticiples ).toEqual( [ "given" ] );
	} );

	it( "returns an empty array when there is no participle or when the sentence is empty.", function() {
		const clauseText = "The cats are special.";
		expect( getParticiples( clauseText ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
