var GermanParticiple = require( "../../../js/researches/french/FrenchParticiple.js" );

describe( "A test for checking the French participle", function() {
	it( "checks the properties of the French participle object without a passive", function() {
		var mockParticiple = new GermanParticiple( "créée", "Cette bague a été créée par moi.", { auxiliaries: [ "été" ], type: "regular" } );
		expect( mockParticiple.getParticiple() ).toBe( "créée" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});
	it( "checks the properties of the French participle object without a passive", function() {
		var mockParticiple = new GermanParticiple( "vendu", " Il fut vendu à une fondation.", { auxiliaries: [ "vendu" ], type: "irregular" } );
		expect( mockParticiple.getParticiple() ).toBe( "vendu" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});
});