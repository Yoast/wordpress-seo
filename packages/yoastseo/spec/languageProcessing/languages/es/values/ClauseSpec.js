import SpanishClause from "../../../../../src/languageProcessing/languages/es/values/Clause.js";

describe( "creates an Spanish clause", function() {
	it( "checks Spanish non-passive clause for passiveness", function() {
		const mockPart = new SpanishClause( "Los nuevos textos fueron geniales.", [ "fueron" ] );
		expect( mockPart.getClauseText() ).toBe( "Los nuevos textos fueron geniales." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "fueron" ] );
	} );
	it( "checks passive Spanish clause for passiveness", function() {
		const mockPart = new SpanishClause( "El libro fue emplazado", [ "fue" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "emplazado" );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "checks Spanish clause with a participle with a direct precedence exception not directly preceding the participle" +
		"and checks its passiveness", function() {
		const mockPart = new SpanishClause( "Algo fue construido dos edificios a tiempo.", [ "fue" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "construido" ] );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "checks Spanish clause with a direct precedence exception when the word from the list directly precedes the participle " +
		"and checks its passiveness", function() {
		const mockPart = new SpanishClause( "Han dos construidos aqui.", [ "han" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "construidos" ] );
		expect( mockPart.isPassive() ).toBe( false );
	} );
	it( "checks Spanish clause with a word from the exception list of words that cannot be between auxiliary and passive " +
		"and checks its passiveness", function() {
		const mockPart = new SpanishClause( "Las casas fueron estar construidas aqui.", [ "han" ] );
		expect( mockPart.getParticiples() ).toEqual( [ "construidas" ] );
		expect( mockPart.isPassive() ).toBe( false );
	} );
} );
