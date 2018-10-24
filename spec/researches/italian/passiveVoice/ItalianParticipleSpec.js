import ItalianParticiple from "../../../../src/researches/italian/passiveVoice/ItalianParticiple.js";
import checkException from "../../../../src/researches/passiveVoice/periphrastic/checkException.js";

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
		let mockParticiple = new ItalianParticiple( "mandato", "Dovresti andare a vedere se esiste il mandato.", {
			auxiliaries: [ "andare" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
