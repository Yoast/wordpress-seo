var FrenchParticiple = require( "../../../js/researches/french/FrenchParticiple.js" );
var checkException = require ( "../../../js/researches/passivevoice/checkException.js" );

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object with a passive", function() {
		var mockParticiple = new FrenchParticiple( "créée", "fut créée par moi.", { auxiliaries: [ "fut" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 4 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 4 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é", function() {
		let mockParticiple = new FrenchParticiple( "aîné", "est le frère aîné.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aîné" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 13 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 13 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é plus suffix", function() {
		let mockParticiple = new FrenchParticiple( "aînée", "est la sœur aînée.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aînée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 12 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 12 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é", function() {
		let mockParticiple = new FrenchParticiple( "café", "J’étais au café.", { auxiliaries: [ "j'étais" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "café" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 11 ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 11 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é and beginning with a contracted article", function() {
		let mockParticiple = new FrenchParticiple( "l'intégrité", "Est-ce que la création de cet outil contribuera à améliorer l’intégrité scientifique ?", { auxiliaries: [ "est-ce" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "l'intégrité" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 60 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 60 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é plus suffix", function() {
		let mockParticiple = new FrenchParticiple( "cafés", "étaient les deux cafés du village.", { auxiliaries: [ "étaient" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "cafés" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 17 ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 17 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with an exception from the other list ending in é", function() {
		let mockParticiple = new FrenchParticiple( "malgré", "était triste malgré tout.", { auxiliaries: [ "était" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "malgré" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( true );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 12 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 12 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a direct precedence exception", function() {
		let mockParticiple = new FrenchParticiple( "vue", "C'est en vue.", { auxiliaries: [ "c'est" ], type: "irregular" } );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 9 ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 9 ) ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a precedence exception", function() {
		let mockParticiple = new FrenchParticiple( "vu", "n'est pas nécessaire d'avoir vu le premier film", { auxiliaries: [ "n'est" ], type: "irregular" } );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, 29 ) ).toBe( false );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, 29 ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		let mockParticiple = new FrenchParticiple( "cuisiné", "Ça a été cuisiné par lui.", { auxiliaries: [ "été" ], type: "regular" } );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});
});
