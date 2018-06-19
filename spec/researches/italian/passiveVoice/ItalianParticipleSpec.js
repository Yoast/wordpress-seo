var ItalianParticiple = require( "../../../../js/researches/italian/passiveVoice/ItalianParticiple.js" );
var checkException = require( "../../../../js/researches/passiveVoice/periphrastic/checkException.js" );

describe( "A test for checking the Italian participle", function() {
	it( "checks the properties of the Italian participle object with a passive", function() {
		var mockParticiple = new ItalianParticiple( "scritto", "Il libro è stato scritto dal mio amico.", {
			auxiliaries: [ "stato" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "scritto" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Italian participle object with a direct precedence exception", function() {
		// Direct precedence exception word: il.
		let mockParticiple = new ItalianParticiple( "mandato", "sono infelici che il mandato esiste", {
			auxiliaries: [ "sono" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 21, "it" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		let mockParticiple = new ItalianParticiple( "scritto", "è stato scritto dal mio amico.", {
			auxiliaries: [ "stato" ],
			type: "irregular",
			language: "it",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 8, "it" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
