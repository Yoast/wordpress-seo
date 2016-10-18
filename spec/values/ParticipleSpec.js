var Participle = require( "../../js/values/Participle.js" );

describe( "A test for checking the Participle", function() {
	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Es wird geschlossen worden sein.", [ "wird", "worden" ],  "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Es wird geschlossen worden sein." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toEqual( [ "wird", "worden" ]);
	});

	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Wir werden geschlossen haben.",  [ "werden" ],  "irregular" );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Wir werden geschlossen haben." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks the properties of an empty participle object", function() {
		var mockParticiple = new Participle( );
		expect( mockParticiple.getParticiple() ).toBe( "" );
		expect( mockParticiple.getSentencePart() ).toBe( "" );
		expect( mockParticiple.getType() ).toBe( "" );
		expect( mockParticiple.getAuxiliaries() ).toEqual( [] );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	});

	it( "checks whether the setSentencePartPassiveness function is working properly.", function() {
		var mockParticiple = new Participle( );
		mockParticiple.setSentencePartPassiveness( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	});
});

