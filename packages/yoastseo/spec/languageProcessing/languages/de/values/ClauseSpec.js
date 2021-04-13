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

	it( "checks German clause with a participle from the exception list.", function() {
		const mockParticiple = new GermanClause( "Es wird geburtsakt.", [ "wird" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "geburtsakt" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle that is a participle like auxiliary.", function() {
		const mockParticiple = new GermanClause( "In deinem Netzwerk bekommst du emotionale Unterstützung.", [ "bekommst" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle with a noun suffix.", function() {
		const mockParticiple = new GermanClause( "Es wird gemütlichkeit.", [ "wird" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gemütlichkeit" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle followed by a special quotation mark.", function() {
		var mockParticiple = new GermanClause( "Es wurde “gekauft”.", [ "wurde" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gekauft" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );
} );
