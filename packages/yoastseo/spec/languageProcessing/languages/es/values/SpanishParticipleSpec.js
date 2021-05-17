import SpanishParticiple from "../../../../../src/languageProcessing/languages/es/values/SpanishParticiple.js";
import checkException from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/checkException.js";
import { cannotDirectlyPrecedePassiveParticiple,
	cannotBeBetweenPassiveAuxiliaryAndParticiple,
	 } from "../../../../../src/languageProcessing/languages/es/config/functionWords";

describe( "A test for checking the Spanish participle", function() {
	it( "checks the properties of the Spanish participle object with a passive", function() {
		const mockParticiple = new SpanishParticiple( "escrito", "El libro fue escrito por mi amiga.", {
			auxiliaries: [ "fue" ],
			type: "irregular",
			language: "es",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "escrito" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Spanish participle object with a direct precedence exception", function() {
		// Direct precedence exception word: un.
		const mockParticiple = new SpanishParticiple( "sentido", "fue un sentido monumental y grandilocuente.", {
			auxiliaries: [ "fue" ],
			type: "irregular",
			language: "es",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Spanish participle object with a precedence exception (directly preceding)", function() {
		// Precedence exception word: estaban.
		const mockParticiple = new SpanishParticiple( "armados", "eran casi en su totalidad exsamuráis y estaban armados", {
			auxiliaries: [ "eran" ],
			type: "irregular",
			language: "es",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Spanish participle object with a precedence exception (indirectly preceding)", function() {
		// Precedence exception word: estaban.
		const mockParticiple = new SpanishParticiple( "esperado", "son famosos estaban en un programa de televisión muy esperado.", {
			auxiliaries: [ "son" ],
			type: "irregular",
			language: "es",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		const mockParticiple = new SpanishParticiple( "escrito", "fue escrito por mi amiga.", {
			auxiliaries: [ "fue" ],
			type: "regular",
			language: "es",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
