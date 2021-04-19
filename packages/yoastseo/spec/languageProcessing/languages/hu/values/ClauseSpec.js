import HungarianClause from "../../../../../src/languageProcessing/languages/hu/values/Clause.js";

describe( "A test for checking the Hungarian clause", function() {
	it( "checks the properties of the Hungarian clause object with a participle from the list of  participles in -ra and -re.", function() {
		const mockClause = new HungarianClause( "A diákok minősítésre kerültek.", [ "kerültek" ] );
		expect( mockClause.getClauseText() ).toBe( "A diákok minősítésre kerültek." );
		expect( mockClause.getParticiples() ).toEqual( [ "minősítésre" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian clause object with a word that looks like a participle from the list", function() {
		const mockClause = new HungarianClause( "A klubunknak nincs vezérszava.", [] );
		expect( mockClause.getParticiples() ).toEqual( [ "vezérszava" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Hungarian clause object with a participle followed by a special quotation mark.", function() {
		const mockClause = new HungarianClause( "Az ablak le van “mosva”.", [ "van" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "mosva" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian clause object with a participle followed by a Hungarian specific quotation mark.", function() {
		const mockClause = new HungarianClause( "Az ablak le van „mosva”.", [ "van" ] );
		expect( mockClause.getClauseText() ).toBe( "Az ablak le van „mosva”." );
		expect( mockClause.getParticiples() ).toEqual( [ "mosva" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
} );
