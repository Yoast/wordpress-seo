import GermanParticiple from "../../../../../src/languageProcessing/languages/de/values/GermanParticiple.js";

describe( "A test for checking the de Participle", function() {
	it( "checks the properties of the de participle object without a passive", function() {
		const mockParticiple = new GermanParticiple( "geschlossen", "Wir werden geschlossen haben", { auxiliaries: [ "werden" ],
			type: "irregular", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( true );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the de participle object without a passive, but with 'sein'", function() {
		const mockParticiple = new GermanParticiple( "geschlossen", "Es wird geschlossen worden sein.", { auxiliaries: [ "werden" ],
			type: "irregular", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geschlossen" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the de participle object without a passive, and without 'haben'/'sein'", function() {
		const mockParticiple = new GermanParticiple( "gekauft", "Es wird gekauft.", { auxiliaries: [ "wird" ], type: "ge- at beginning",
			language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "gekauft" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the de participle object with a participle from the exception list.", function() {
		const mockParticiple = new GermanParticiple( "geburtsakt", "Es wird geburtsakt.", { auxiliaries: [ "wird" ], type: "ge- at beginning",
			language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geburtsakt" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( true );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the de participle object with a participle that is an auxiliary.", function() {
		const mockParticiple = new GermanParticiple( "bekommst", "In deinem Netzwerk bekommst du emotionale Unterstützung.",
			{ auxiliaries: [ "bekommst" ], type: "be- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "bekommst" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the de participle object with a participle with a noun suffix.", function() {
		const mockParticiple = new GermanParticiple( "gemütlichkeit", "Es wird gemütlichkeit.", { auxiliaries: [ "wird" ],
			type: "ge- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "gemütlichkeit" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( true );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the german participle object with a participle follwed by a special quotation mark.", function() {
		var mockParticiple = new GermanParticiple( "gekauft", "Es wurde “gekauft”.", { auxiliaries: [ "wurde" ], type: "ge- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "gekauft" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
