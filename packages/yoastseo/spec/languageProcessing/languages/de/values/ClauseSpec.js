import GermanClause from "../../../../../src/languageProcessing/languages/de/values/Clause";

describe( "A test for creating a German clause object", function() {
	it( "makes sure the German sentence part inherits all functions", function() {
		const mockSentencePart = new GermanClause( "German text.", [] );
		expect( mockSentencePart.getClauseText() ).toBe( "German text." );
	} );
} );

describe( "A test for checking German participles", function() {
	it( "checks German clause in which the participle is followed by 'haben'", function() {
		const mockParticiple = new GermanClause( "Wir werden geschlossen haben", [ "werden" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "geschlossen" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks German clause which is indirectly followed by 'sein'", function() {
		const mockParticiple = new GermanClause( "Es wird geschlossen worden sein.", [ "wird" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "geschlossen" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks German clause without 'haben'/'sein'", function() {
		const mockParticiple = new GermanClause( "Es wird gekauft.", [ "wird" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gekauft" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	xit( "checks the properties of the de participle object with a participle from the exception list.", function() {
		const mockParticiple = new GermanParticiple( "geburtsakt", "Es wird geburtsakt.", { auxiliaries: [ "wird" ], type: "ge- at beginning",
			language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "geburtsakt" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( true );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	xit( "checks the properties of the de participle object with a participle that is an auxiliary.", function() {
		const mockParticiple = new GermanParticiple( "bekommst", "In deinem Netzwerk bekommst du emotionale Unterstützung.",
			{ auxiliaries: [ "bekommst" ], type: "be- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "bekommst" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	xit( "checks the properties of the de participle object with a participle with a noun suffix.", function() {
		const mockParticiple = new GermanParticiple( "gemütlichkeit", "Es wird gemütlichkeit.", { auxiliaries: [ "wird" ],
			type: "ge- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "gemütlichkeit" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( true );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	xit( "checks the properties of the german participle object with a participle follwed by a special quotation mark.", function() {
		var mockParticiple = new GermanParticiple( "gekauft", "Es wurde “gekauft”.", { auxiliaries: [ "wurde" ], type: "ge- at beginning", language: "de" } );
		expect( mockParticiple.getParticiple() ).toBe( "gekauft" );
		expect( mockParticiple.hasHabenSeinException() ).toBe( false );
		expect( mockParticiple.isInExceptionList() ).toBe( false );
		expect( mockParticiple.hasNounSuffix() ).toBe( false );
		expect( mockParticiple.isAuxiliary() ).toBe( false );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );
} );
