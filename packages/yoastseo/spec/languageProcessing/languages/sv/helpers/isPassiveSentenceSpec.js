import isPassiveSentence from "../../../../../src/languageProcessing/languages/sv/helpers/isPassiveSentence.js";

describe( "a test for detecting Swedish passive voice in sentences", function() {
	it( "returns false if the verb is not listed in the passive verbs list", function() {
		expect( isPassiveSentence( "Flickan älskar sina katter." ) ).toBeFalsy();
	} );

	it( "returns true if the verb is found in the passive verbs list", function() {
		expect( isPassiveSentence( "Katterna adopteras av den snälla kvinnan." ) ).toBeTruthy();
	} );
} );
