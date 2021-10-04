import isPassiveSentence from "../../../../../src/languageProcessing/languages/el/helpers/isPassiveSentence.js";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		expect( isPassiveSentence( "Εγώ διπλώνω τα ρούχα." ) ).toBe( false );
	} );

	it( "returns passive voice (morphological conditional present)", function() {
		// Passive: χτίστηκε.
		expect( isPassiveSentence( "Το σπίτι χτίστηκε από τον πατέρα μου." ) ).toBe( true );
	} );

	it( "returns a non passive verb that looks like a passive (deponent verb)", function() {
		// Non Passive: ερωτεύτηκε.
		expect( isPassiveSentence( "Η γάτα μου ερωτεύτηκε τον γάτο του γείτονα." ) ).toBe( false );
	} );

	it( "returns a non passive verb that looks like a passive (deponent verb)", function() {
		// Non Passive: σκέφτεται.
		expect( isPassiveSentence( "Η γάτα μου σκέφτεται τί θα φάει μετά" ) ).toBe( false );
	} );

	it( "returns active voice for a sentence with a passive infinitive, but the infinitive is directly preceded by 'να' ", function() {
		// Passive infinitive: γραφθεί.
		expect( isPassiveSentence( "Το άρθρο έχει να γραφθεί." ) ).toBe( false );
	} );
} );
