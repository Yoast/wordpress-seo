import DutchParticiple from "../../../../src/researches/dutch/passiveVoice/DutchParticiple.js";
import checkException from "../../../../src/researches/passiveVoice/periphrastic/checkException.js";

describe( "A test for checking the Dutch participle", function() {
	it( "checks the properties of the Dutch participle object with a passive", function() {
		const mockParticiple = new DutchParticiple( "gekocht", "werd door mij gekocht.", {
			auxiliaries: [ "werd" ],
			type: "regular",
			language: "nl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "gekocht" );
		expect( mockParticiple.isOnNonParticiplesList() ).toBe( false );
		expect( mockParticiple.hasNonParticipleEnding() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "nl" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Dutch participle object with an irregular passive", function() {
		const mockParticiple = new DutchParticiple( "achtervolgd", "werd achtervolgd.", {
			auxiliaries: [ "werd" ],
			type: "irregular",
			language: "nl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "achtervolgd" );
		expect( mockParticiple.isOnNonParticiplesList() ).toBe( false );
		expect( mockParticiple.hasNonParticipleEnding() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "nl" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Dutch participle object with a word from the list of non-participles", function() {
		const mockParticiple = new DutchParticiple( "beschrijvend", "wordt beschrijvend.", {
			auxiliaries: [ "wordt" ],
			type: "regular",
			language: "nl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "beschrijvend" );
		expect( mockParticiple.isOnNonParticiplesList() ).toBe( true );
		expect( mockParticiple.hasNonParticipleEnding() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "nl" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Dutch participle object with a word from the list of non-participles", function() {
		const mockParticiple = new DutchParticiple( "gemoedelijkheid", "wordt geen gemoedelijkheid", {
			auxiliaries: [ "wordt" ],
			type: "regular",
			language: "nl",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "gemoedelijkheid" );
		expect( mockParticiple.isOnNonParticiplesList() ).toBe( false );
		expect( mockParticiple.hasNonParticipleEnding() ).toBe( true );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "nl" ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Dutch participle object with a direct precedence exception", function() {
		const mockParticiple = new DutchParticiple( "geliefd", "wordt een geliefd", { auxiliaries: [ "wordt" ], type: "regular", language: "nl" } );
		expect( mockParticiple.getParticiple() ).toBe( "geliefd" );
		expect( mockParticiple.isOnNonParticiplesList() ).toBe( false );
		expect( mockParticiple.hasNonParticipleEnding() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "nl" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		let mockParticiple = new DutchParticiple( "gekookt", "Het werd door hem gekookt.", {
			auxiliaries: [ "werd" ],
			type: "regular",
			language: "nl",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
