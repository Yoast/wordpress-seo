import ItalianClause from "../../../../../src/languageProcessing/languages/it/values/Clause.js";

describe( "creates an Italian clause", function() {
	it( "makes sure the Italian sentence part inherits all functions", function() {
		const mockClause = new ItalianClause( "I testi italiani sono stati bellissimi.", [ "stati" ] );
		expect( mockClause.getClauseText() ).toBe( "I testi italiani sono stati bellissimi." );
		expect( mockClause.getAuxiliaries() ).toEqual( [ "stati" ] );
	} );

	it( "returns a participle for an Italian clause", function() {
		const mockClause = new ItalianClause( "Il testo è stato corretto.", [ "stato" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "corretto" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
} );
