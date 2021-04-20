import GermanClause from "../../../../../src/languageProcessing/languages/de/values/Clause";

describe( "A test for creating a German clause object", function() {
	it( "makes sure the German clause inherits all functions", function() {
		const mockClause = new GermanClause( "German text.", [] );
		expect( mockClause.getClauseText() ).toBe( "German text." );
	} );
} );

describe( "A test for checking German participles", function() {
	it( "checks German clause in which the participle is followed by 'haben'", function() {
		const mockClause = new GermanClause( "Wir werden geschlossen haben", [ "werden" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "geschlossen" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks German clause which is indirectly followed by 'sein'", function() {
		const mockClause = new GermanClause( "Es wird geschlossen worden sein.", [ "wird" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "geschlossen" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks German clause without 'haben'/'sein'", function() {
		const mockClause = new GermanClause( "Es wird gekauft.", [ "wird" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "gekauft" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks German clause with a participle from the exception list.", function() {
		const mockClause = new GermanClause( "Es wird geburtsakt.", [ "wird" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "geburtsakt" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle that is a participle like auxiliary.", function() {
		const mockClause = new GermanClause( "In deinem Netzwerk bekommst du emotionale Unterstützung.", [ "bekommst" ] );
		expect( mockClause.getParticiples() ).toEqual( [] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle with a noun suffix.", function() {
		const mockClause = new GermanClause( "Es wird gemütlichkeit.", [ "wird" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "gemütlichkeit" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks German clause with a participle followed by a special quotation mark.", function() {
		var mockClause = new GermanClause( "Es wurde “gekauft”.", [ "wurde" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "gekauft" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
} );
