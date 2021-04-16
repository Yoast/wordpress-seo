import PortugueseClause from "../../../../../src/languageProcessing/languages/pt/values/Clause.js";

describe( "A test for checking the Portuguese participle", function() {
	it( "checks Portuguese clause with a participle and checks its passiveness", function() {
		const mockParticiple = new PortugueseClause( "A decisão és aprovado por mim.", [ "és" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "aprovado" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks Portuguese clause with a participle with a direct precedence exception and checks its passiveness", function() {
		const mockParticiple = new PortugueseClause( "Ela é a amada.", [ "é" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "amada" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "ensures that the clause is not set to passive if there is no participle", function() {
		const mockParticiple = new PortugueseClause( "A gata é linda", [ "é" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );
} );
