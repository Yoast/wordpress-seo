import getParticiples from "../../../../../../src/languageProcessing/languages/el/helpers/internal/getParticiples";

describe( "Test for matching Greek participles", function() {
	it( "returns matched passive participles.", function() {
		// Passive participle: αγαπημένη.
		const sentence = "Η γάτα είναι αγαπημένη.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].passives ).toEqual( [ "αγαπημένη" ] );
		expect( foundParticiples[ 0 ].type ).toEqual( "participle" );
	} );

	it( "returns matched passive infinitive.", function() {
		// Passive infinitive: αγαπηθεί.
		const sentence = "Ο σκύλος έχει αγαπηθεί.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples[ 0 ].passives ).toEqual( [ "αγαπηθεί" ] );
		expect( foundParticiples[ 0 ].type ).toEqual( "infinitive" );
	} );

	it( "returns an empty array when no participle/passive is matched.", function() {
		const sentence = "To καινουργιο αυτοκίνητο μου τρέχει με ενενήντα χιλιόμετρα την ώρα.";
		const foundParticiples = getParticiples( sentence );
		expect( foundParticiples ).toEqual( [] );
	} );
} );
