import isPassiveSentence from "../../../../../src/languageProcessing/languages/hu/helpers/isPassiveSentence.js";

describe( "a test for detecting passive voice in sentences", function() {
	it( "returns active voice (present)", function() {
		expect( isPassiveSentence( "Teát iszom." ) ).toBe( false );
	} );

	it( "returns passive voice (morphological conditional present)", function() {
		// Passive: kikötődne.
		expect( isPassiveSentence( "Ha kikötődne a cipőfűzőm futás közben, elesnék." ) ).toBe( true );
	} );

	it( "returns passive voice (in -ódik without a prefix)", function() {
		// Passive: íródott.
		expect( isPassiveSentence( "A levél 100 éve íródott." ) ).toBe( true );
	} );

	it( "returns passive voice (in -ődik without a prefix)", function() {
		// Passive: töltődik.
		expect( isPassiveSentence( "A telefon gyorsan töltődik." ) ).toBe( true );
	} );

	it( "returns passive voice (in -ődik with a prefix)", function() {
		// Passive: megíródott.
		expect( isPassiveSentence( "A könyv gyorsan megíródott." ) ).toBe( true );
	} );

	it( "returns passive voice (in -ődik with a prefix)", function() {
		// Passive: beszennyeződött.
		expect( isPassiveSentence( "A ruha beszennyeződött." ) ).toBe( true );
	} );
} );
