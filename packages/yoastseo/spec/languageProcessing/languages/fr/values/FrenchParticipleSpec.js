import FrenchParticiple from "../../../../../src/languageProcessing/languages/fr/values/FrenchParticiple.js";
import checkException from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/checkException.js";
import { cannotBeBetweenPassiveAuxiliaryAndParticiple,
	cannotDirectlyPrecedePassiveParticiple } from "../../../../../src/languageProcessing/languages/fr/config/functionWords";

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object with a passive", function() {
		const mockParticiple = new FrenchParticiple( "créée", "fut créée par moi.", { auxiliaries: [ "fut" ], type: "regular", language: "fr" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é", function() {
		const mockParticiple = new FrenchParticiple( "aîné", "est le frère aîné.", { auxiliaries: [ "est" ], type: "regular", language: "fr" } );
		expect( mockParticiple.getParticiple() ).toBe( "aîné" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é plus suffix", function() {
		const mockParticiple = new FrenchParticiple( "aînée", "est la sœur aînée.", { auxiliaries: [ "est" ], type: "regular", language: "fr" } );
		expect( mockParticiple.getParticiple() ).toBe( "aînée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a noun exception ending in é", function() {
		const mockParticiple = new FrenchParticiple( "café", "J’étais au café.", { auxiliaries: [ "j'étais" ], type: "regular", language: "fr" } );
		expect( mockParticiple.getParticiple() ).toBe( "café" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a noun exception ending in é and beginning with a" +
		" contracted article", function() {
		const mockParticiple = new FrenchParticiple( "l'intégrité",
			"Est-ce que la création de cet outil contribuera à améliorer l’intégrité scientifique ?",
			{ auxiliaries: [ "est-ce" ], type: "regular", language: "fr" }
		);
		expect( mockParticiple.getParticiple() ).toBe( "l'intégrité" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a noun exception ending in é plus suffix", function() {
		const mockParticiple = new FrenchParticiple( "cafés", "étaient les deux cafés du village.", {
			auxiliaries: [ "étaient" ],
			type: "regular",
			language: "fr",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "cafés" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with an exception from the other list ending in é", function() {
		const mockParticiple = new FrenchParticiple( "malgré", "était triste malgré tout.", {
			auxiliaries: [ "était" ],
			type: "regular",
			language: "fr",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "malgré" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( true );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a direct precedence exception", function() {
		// Direct precedence exception word: en.
		const mockParticiple = new FrenchParticiple( "vue", "C'est en vue.", { auxiliaries: [ "c'est" ], type: "irregular", language: "fr" } );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a precedence exception (indirectly preceding)", function() {
		// Precedence exception word: avoir (in between "n'est" and "vu").
		const mockParticiple = new FrenchParticiple( "vu", "n'est pas possible de l'avoir déjà vu.", {
			auxiliaries: [ "n'est" ],
			type: "irregular",
			language: "fr",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the French participle object with a precedence exception (directly preceding)", function() {
		// Precedence exception word: avoir (in between "n'est" and "vu").
		const mockParticiple = new FrenchParticiple( "vu", "n'est pas nécessaire d'avoir vu le premier film", {
			auxiliaries: [ "n'est" ],
			type: "irregular",
			language: "fr",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotDirectlyPrecedePassiveParticiple ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle,
			cannotBeBetweenPassiveAuxiliaryAndParticiple ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		const mockParticiple = new FrenchParticiple( "cuisiné", "Ça a été cuisiné par lui.", {
			auxiliaries: [ "été" ],
			type: "regular",
			language: "fr",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
