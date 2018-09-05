import Participle from "../../src/values/Participle.js";

describe( "A test for checking the Participle", function() {
	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Es wird geschlossen worden sein.", { auxiliaries: [ "wird", "worden" ], type: "irregular", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Es wird geschlossen worden sein." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toEqual( [ "wird", "worden" ] );
		expect( mockParticiple.getLanguage() ).toBe( "de" );
	} );

	it( "checks the properties of a participle object without a passive", function() {
		var mockParticiple = new Participle( "geschlossen", "Wir werden geschlossen haben.", { auxiliaries: [ "werden" ], type: "irregular", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.getSentencePart() ).toBe( "Wir werden geschlossen haben." );
		expect( mockParticiple.getType() ).toBe( "irregular" );
		expect( mockParticiple.getAuxiliaries() ).toEqual( [ "werden" ] );
		expect( mockParticiple.getLanguage() ).toBe( "de" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks whether the setSentencePartPassiveness function is working properly.", function() {
		var mockParticiple = new Participle( "geschlossen", "wir werden geschlossen haben." );
		mockParticiple.setSentencePartPassiveness( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "throws an error when setSentencePartPassiveness doesn't get a boolean", function() {
		var mockParticiple = new Participle( "geschlossen", "wir werden geschlossen haben." );
		expect( function() {
			mockParticiple.setSentencePartPassiveness( 9 );
		} ).toThrowError( "Passiveness had invalid type. Expected boolean, got number." );
	} );

	it( "throws an error when the auxiliaries are not an array.", function() {
		expect( function() {
			new Participle( "geschlossen", "Wir werden geschlossen haben.", { auxiliaries: 9, type: {} } );
		} ).toThrowError( "Attribute auxiliaries has invalid type. Expected array, got number." );
	} );

	it( "throws an error when the type is not a string.", function() {
		expect( function() {
			new Participle( "geschlossen", "Wir werden geschlossen haben.", { auxiliaries: [ "werden" ], type: [ "irregular" ] } );
		} ).toThrowError( "Attribute type has invalid type. Expected string, got array." );
	} );

	it( "throws an error when the language is not a string.", function() {
		expect( function() {
			new Participle( "helped", "I was helped.", { auxiliaries: [ "was" ], type: [ "regular" ], language: [ [ "en" ] ] } );
		} ).toThrowError( "Attribute type has invalid type. Expected string, got array." );
	} );

	it( "throws an error when the participle is empty.", function() {
		expect( function() {
			new Participle( "", "Wir werden geschlossen haben.", { auxiliaries: [ "werden" ], type: [ "irregular" ] } );
		} ).toThrowError( "The participle should not be empty." );
	} );

	it( "throws an error when the sentence part is empty.", function() {
		expect( function() {
			new Participle( "geschlossen", "", { auxiliaries: [ "werden" ], type: [ "irregular" ] } );
		} ).toThrowError( "The sentence part should not be empty." );
	} );
} );
