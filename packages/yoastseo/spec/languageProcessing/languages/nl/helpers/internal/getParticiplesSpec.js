import getParticiples from "../../../../../../src/languageProcessing/languages/nl/helpers/internal/getParticiples";

describe( "Test for matching Dutch participles", function() {
	it( "returns matched regular participles.", function() {
		let sentence = "De kat werd geadopteerd door de aardige mensen.";
		let foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "geadopteerd" ] );

		// A participle with a separable prefix.
		sentence = "De boeken werden teruggegeven.";
		foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "teruggegeven" ] );
	} );

	it( "returns matched irregular participles.", function() {
		let sentence = "De snacks werden door de kat gegeten.";
		let foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "gegeten" ] );

		// A participle with a separable prefix.
		sentence = "De draden werden aaneengedraaid.";
		foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [ "aaneengedraaid" ] );
	} );

	it( "returns an empty array when there is no participle or the sentence is empty", function() {
		const sentence = "De kat is erg blij in haar nieuwe huis.";
		expect( getParticiples( sentence ) ).toEqual( [] );
		expect( getParticiples( "" ) ).toEqual( [] );
	} );
} );
