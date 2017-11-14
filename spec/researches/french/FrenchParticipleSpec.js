var FrenchParticiple = require( "../../../js/researches/french/FrenchParticiple.js" );

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object  a passive", function() {
		var mockParticiple = new FrenchParticiple( "créée", "Cette fut créée par moi.", { auxiliaries: [ "fut" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

});