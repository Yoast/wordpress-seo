import PortugueseParticiple from "../../../../../src/languageProcessing/languages/pt/values/PortugueseParticiple.js";
import checkException from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/checkException.js";
import { cannotDirectlyPrecedePassiveParticiple } from "../../../../../src/languageProcessing/languages/pt/config/functionWords";

describe( "A test for checking the Portuguese participle", function() {
	it( "checks the properties of the Portuguese participle object", function() {
		const mockParticiple = new PortugueseParticiple( "aprovado", "A decisão és aprovado por mim.",
			{ auxiliaries: [ "és" ], type: "regular", language: "pt" } );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, [] ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle, [] ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Portuguese participle object with a direct precedence exception", function() {
		const mockParticiple = new PortugueseParticiple( "amada", "Ela é a amada.", {
			auxiliaries: [ "é" ],
			type: "irregular",
			language: "pt",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle, [] ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if there is no participle", function() {
		const mockParticiple = new PortugueseParticiple( "linda", "A gata é linda", {
			auxiliaries: [ "é" ],
			type: "regular",
			language: "pt",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
