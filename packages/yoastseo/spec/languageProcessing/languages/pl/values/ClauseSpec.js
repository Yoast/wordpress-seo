import PolishClause from "../../../../../src/languageProcessing/languages/pl/values/Clause.js";

describe( "creates a Polish sentence part", function() {
	it( "makes sure the Polish clause inherits all functions", function() {
		const mockClause = new PolishClause( "To jest piękne zdanie.", [ "jest" ] );
		expect( mockClause.getClauseText() ).toBe( "To jest piękne zdanie." );
		expect( mockClause.getAuxiliaries() ).toEqual( [ "jest" ] );
	} );

	it( "returns a participle for a Polish clause", function() {
		const mockClause = new PolishClause( "To zdanie jest pisane przeze mnie.", [ "jest" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "pisane" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found (direct precedence exception)", function() {
		// Exception word: nasze.
		const mockClause = new PolishClause( "To są nasze znalezione skarby.", [ "są" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "znalezione" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
	it( "checks participle exceptions and returns clause passiveness as false if an exception was found " +
		"(nondirect precedence exception)", function() {
		// Exception word: może.
		const mockClause = new PolishClause( "Jak komuś jest gorąco to może doceniać szeroko otwarte okna.", [ "jest" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "otwarte" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
