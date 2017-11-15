var FrenchParticiple = require( "../../../js/researches/french/FrenchParticiple.js" );

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object  a passive", function() {
		var mockParticiple = new FrenchParticiple( "créée", "Cette fut créée par moi.", { auxiliaries: [ "fut" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.isOnParticipleExceptionList() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of the French participle object with a non-participle ending in é", function() {
		let mockParticiple = new FrenchParticiple( "aîné", "Il est le frère aîné.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aîné" );
		expect( mockParticiple.isOnParticipleExceptionList() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	/*
	it( "checks the properties of the French participle object with a non-participle ending in é plus suffix", function() {
		let mockParticiple = new FrenchParticiple( "aînée", "Elle est la sœur aînée.", { auxiliaries: [ "est" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "aînée" );
		expect( mockParticiple.isOnParticipleExceptionList() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});
	*/

});