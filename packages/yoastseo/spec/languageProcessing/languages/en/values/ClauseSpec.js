import EnglishClause from "../../../../../src/languageProcessing/languages/en/values/Clause.js";

describe( "creates an English clause", function() {
	it( "makes sure the English clause inherits all functions", function() {
		const mockPart = new EnglishClause( "English texts are great.", [ "are" ] );
		expect( mockPart.getClauseText() ).toBe( "English texts are great." );
		expect( mockPart.getAuxiliaries() ).toEqual( [ "are" ] );
	} );
	it( "returns a irregular participle for an English sentence part", function() {
		const mockPart = new EnglishClause( "English texts are written.", [ "are" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "written" );
		expect( mockPart.isPassive() ).toBe( true );
	} );
	it( "returns a regular participle for an English sentence part", function() {
		const mockPart = new EnglishClause( "The kitchen cabinets were nailed to the wall.", [ "are" ] );
		expect( mockPart.getParticiples()[ 0 ] ).toBe( "nailed" );
		expect( mockPart.isPassive() ).toBe( true );
	} );
} );
