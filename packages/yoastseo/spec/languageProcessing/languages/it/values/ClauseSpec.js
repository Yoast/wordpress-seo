import ItalianClause from "../../../../../src/languageProcessing/languages/it/values/Clause.js";

describe( "creates an Italian clause", function() {
	it( "makes sure the Italian sentence part inherits all functions", function() {
		const mockClause = new ItalianClause( "I testi italiani sono stati bellissimi.", [ "stati" ] );
		expect( mockClause.getClauseText() ).toBe( "I testi italiani sono stati bellissimi." );
		expect( mockClause.getAuxiliaries() ).toEqual( [ "stati" ] );
	} );

	it( "returns a participle for an Italian passive clause", function() {
		const mockClause = new ItalianClause( "Il testo è stato corretto.", [ "stato" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "corretto" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks an Italian clause with a precedence exception between the passive auxiliary and the participle" +
		"and checks its passiveness", function() {
		const mockClause = new ItalianClause( "Ciò che ebbe l'aveva costruito suo padre.", [ "fue" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "costruito" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	xit( "checks an Italian clause with a precedence exception where the word from the list directly precedes the participle" +
		"and checks its passiveness", function() {
		const mockClause = new ItalianClause( "Era il fatto che le avesse portato dei fiori a farle piacere.", [ "era" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "fatto" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
