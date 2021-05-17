import EnglishParticiple from "../../../../../src/languageProcessing/languages/en/values/EnglishParticiple.js";
import checkException from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/checkException.js";
import { cannotBeBetweenPassiveAuxiliaryAndParticiple,
	cannotDirectlyPrecedePassiveParticiple } from "../../../../../src/languageProcessing/languages/en/config/functionWords";

describe( "A test for checking the English Participle", function() {
	it( "checks the properties of the English participle object with a passive", function() {
		const mockParticiple = new EnglishParticiple( "fired", "He was fired", { auxiliaries: [ "was" ], type: "regular", language: "en" } );
		expect( mockParticiple.getParticiple() ).toBe( "fired" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the English participle object with a non-verb ending in -ed", function() {
		const mockParticiple = new EnglishParticiple( "wellbred", "It is wellbred", { auxiliaries: [ "is" ], type: "regular", language: "en" } );
		expect( mockParticiple.getParticiple() ).toBe( "wellbred" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( true );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a 'rid' exception", function() {
		const mockParticiple = new EnglishParticiple( "rid", "He wants to get rid of it", {
			auxiliaries: [ "get" ],
			type: "irregular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "rid" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( true );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a direct precedence exception", function() {
		const mockParticiple = new EnglishParticiple( "read", "I am wiser for having read that book", {
			auxiliaries: [ "am" ],
			type: "irregular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "read" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a 'left' exception, which is now covered by " +
		"the direct precedence exception", function() {
		const mockParticiple = new EnglishParticiple( "left", "He was at the left", { auxiliaries: [ "was" ], type: "irregular", language: "en" } );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with 'left' that is not an exception", function() {
		const mockParticiple = new EnglishParticiple( "left", "He was left", { auxiliaries: [ "was" ], type: "irregular", language: "en" } );
		expect( mockParticiple.getParticiple() ).toBe( "left" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the English participle object with a 'fit' exception, which is now covered by " +
		"the direct precedence exception", function() {
		const mockParticiple = new EnglishParticiple( "fit", "She was a fit girl", { auxiliaries: [ "was" ], type: "irregular", language: "en" } );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a word from the direct precedence exception list " +
		"which does not directly precede the participle", function() {
		const mockParticiple = new EnglishParticiple( "painted", "He was having his house painted", {
			auxiliaries: [ "was" ],
			type: "regular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "painted" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the English participle object with 'fit' that is not an exception", function() {
		const mockParticiple = new EnglishParticiple( "fit", "The data was then fit by the optimal model", {
			auxiliaries: [ "was" ],
			type: "irregular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "fit" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		const mockParticiple = new EnglishParticiple( "cooked", "It is cooked by him", { auxiliaries: [ "is" ], type: "regular", language: "en" } );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a precedence exception when the word " +
		"from the list doesn't directly precede the participle", function() {
		const mockParticiple = new EnglishParticiple( "enjoyed", "It's something I've always enjoyed doing", {
			auxiliaries: [ "it's" ],
			type: "regular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "enjoyed" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a precedence exception when the word " +
		"from the list directly precedes the participle", function() {
		const mockParticiple = new EnglishParticiple( "adopted", "Here is a list of ten beliefs I have adopted", {
			auxiliaries: [ "is" ],
			type: "regular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "adopted" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the English participle object with a precedence exception when the word from" +
		" the list occurs after the participle", function() {
		const mockParticiple = new EnglishParticiple( "stolen", "The money was stolen, but nobody has been able to prove it", {
			auxiliaries: [ "was" ],
			type: "irregular",
			language: "en",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "stolen" );
		expect( mockParticiple.isNonVerbEndingEd() ).toBe( false );
		expect( mockParticiple.hasRidException() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
