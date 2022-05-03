import removeSentenceTerminators from "../../../../src/languageProcessing/helpers/sanitize/removeSentenceTerminators";

describe( "a test removing sentence terminators from a string", function() {
	it( "returns string without full stops", function() {
		expect( removeSentenceTerminators( ".t.e.s.t" ) ).toBe( "test" );
	} );

	it( "returns string with no terminators in word untouched", function() {
		expect( removeSentenceTerminators( "te-st" ) ).toBe( "te-st" );
	} );

	it( "returns string without question marks in the words", function() {
		expect( removeSentenceTerminators( "t?e?st" ) ).toBe( "test" );
	} );
} );
