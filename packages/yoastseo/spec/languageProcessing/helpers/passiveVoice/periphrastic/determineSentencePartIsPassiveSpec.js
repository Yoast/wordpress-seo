import determineSentencePartIsPassive
	from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/determineSentencePartIsPassive";

describe( "Tests if the participles make the sentence part passive", function() {
	it( "returns true if the sentence part is passive", function() {
		expect( determineSentencePartIsPassive( participles ) ).toBe( true );
	} );
	it( "returns false if the sentence part is not passive", function() {
		expect( determineSentencePartIsPassive( participles ) ).toBe( false );
	} );
} );
