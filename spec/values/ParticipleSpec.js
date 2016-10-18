var Participle = require( "../../js/values/Participle.js" );

describe( "A test for checking the Participle", function() {
	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Es wird geschlossen worden sein.",  "wird",  "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Es wird geschlossen worden sein." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toBe( "wird" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});

	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Wir werden geschlossen haben.",  "werden",  "irregular" );
		mockParticiple.setSentencePartPassiveness( false );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Wir werden geschlossen haben." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toBe( "werden" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

});

