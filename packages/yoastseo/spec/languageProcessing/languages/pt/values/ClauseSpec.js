import PortugueseClause from "../../../../../src/languageProcessing/languages/pt/values/Clause.js";

describe( "A test for checking the Portuguese clause", function() {
	it( "checks Portuguese clause with a participle and checks its passiveness", function() {
		const mockClause = new PortugueseClause( "A decisão és aprovado por mim.", [ "és" ] );
		expect( mockClause.getClauseText() ).toEqual( "A decisão és aprovado por mim." );
		expect( mockClause.getParticiples() ).toEqual( [ "aprovado" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks Portuguese clause with a participle with a direct precedence exception and checks its passiveness", function() {
		const mockClause = new PortugueseClause( "Ela é a amada.", [ "é" ] );
		expect( mockClause.getClauseText() ).toEqual( "Ela é a amada." );
		expect( mockClause.getParticiples() ).toEqual( [ "amada" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "ensures that the clause is not set to passive if there is no participle", function() {
		const mockClause = new PortugueseClause( "A gata é linda", [ "é" ] );
		expect( mockClause.getParticiples() ).toEqual( [] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
