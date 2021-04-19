import HungarianClause from "../../../../../src/languageProcessing/languages/hu/values/Clause.js";

describe( "A test for checking the Hungarian clause", function() {
	it( "checks the properties of the Hungarian clause object with a participle from the list of  participles in -ra and -re.", function() {
		const mockParticiple = new HungarianClause( "A diákok minősítésre kerültek.", [ "kerültek" ] );
		expect( mockParticiple.getClauseText() ).toBe( "A diákok minősítésre kerültek." );
		expect( mockParticiple.getParticiples() ).toEqual( [ "minősítésre" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian clause object with a word that looks like a participle from the list", function() {
		const mockParticiple = new HungarianClause( "A klubunknak nincs vezérszava.", [] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "vezérszava" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Hungarian clause object with a participle followed by a special quotation mark.", function() {
		const mockParticiple = new HungarianClause( "Az ablak le van “mosva”.", [ "van" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "mosva" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian clause object with a participle followed by a Hungarian specific quotation mark.", function() {
		const mockParticiple = new HungarianClause( "Az ablak le van „mosva”.", [ "van" ] );
		expect( mockParticiple.getClauseText() ).toBe( "Az ablak le van „mosva”." );
		expect( mockParticiple.getParticiples() ).toEqual( [ "mosva" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );
} );
