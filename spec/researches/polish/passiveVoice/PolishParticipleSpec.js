const PolishParticiple = require( "../../../../js/researches/polish/passiveVoice/PolishParticiple.js" );
const checkException = require( "../../../../js/researches/passiveVoice/periphrastic/checkException.js" );

describe( "A test for checking the Polish participle", function() {
	it( "checks the properties of the Polish participle object with a passive", function() {
		const mockParticiple = new PolishParticiple( "napisana", "została już napisana.", {
			auxiliaries: [ "została" ],
			type: "irregular",
			language: "pl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "napisana" );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 12, "pl" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Polish participle object with a direct precedence exception", function() {
		// Direct precedence exception word: il.
		let mockParticiple = new PolishParticiple( "znalezione", "To są nasze znalezione skarby.", {
			auxiliaries: [ "są" ],
			type: "irregular",
			language: "pl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "znalezione" );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 12, "pl" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		let mockParticiple = new PolishParticiple( "napisana", "została już napisana.", {
			auxiliaries: [ "została" ],
			type: "irregular",
			language: "pl",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
