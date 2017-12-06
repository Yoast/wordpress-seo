var FrenchParticiple = require( "../../../js/researches/french/FrenchParticiple.js" );
var checkException = require ( "../../../js/researches/passivevoice/checkException.js" );

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object  a passive", function() {
		var mockParticiple = new FrenchParticiple( "créée", "Cette association fut créée par moi.", { auxiliaries: [ "fut" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é", function() {
		let mockParticiple = new FrenchParticiple( "aîné", "Il est le frère aîné.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aîné" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with an adjective or verb exception ending in é plus suffix", function() {
		let mockParticiple = new FrenchParticiple( "aînée", "Elle est la sœur aînée.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aînée" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é", function() {
		let mockParticiple = new FrenchParticiple( "café", "J’étais au café.", { auxiliaries: [ "j'étais" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "café" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é and beginning with a contracted article", function() {
		let mockParticiple = new FrenchParticiple( "l'intégrité", "Est-ce que la création de cet outil contribuera à améliorer l’intégrité scientifique ?", { auxiliaries: [ "est-ce" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "l'intégrité" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with a noun exception ending in é plus suffix", function() {
		let mockParticiple = new FrenchParticiple( "cafés", "Les seuls endroits où l'on pouvait se divertir étaient les deux cafés du village.", { auxiliaries: [ "j'étais" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "cafés" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( true );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of the French participle object with an exception from the other list ending in é", function() {
		let mockParticiple = new FrenchParticiple( "malgré", "Elle était triste malgré tout.", { auxiliaries: [ "était" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "malgré" );
		expect( mockParticiple.isOnAdjectivesVerbsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnNounsExceptionList() ).toBe( false );
		expect( mockParticiple.isOnOthersExceptionList() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});


	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		let mockParticiple = new FrenchParticiple( "cuisiné", "Ça a été cuisiné par lui.", { auxiliaries: [ "été" ], type: "regular" } );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});
});