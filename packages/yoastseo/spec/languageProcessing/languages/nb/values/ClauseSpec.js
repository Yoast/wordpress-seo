import NorwegianClause from "../../../../../src/languageProcessing/languages/nb/values/Clause.js";

describe( "A test for checking the Norwegian clause", function() {
	it( "checks the properties of the Hungarian clause object with a participle from periphrastic participles list", function() {
		const mockClause = new NorwegianClause( "Små barn er redde for å bli forlatt i mørket.", [ "bli" ] );
		expect( mockClause.getClauseText() ).toBe( "Små barn er redde for å bli forlatt i mørket." );
		expect( mockClause.getParticiples() ).toEqual( [ "forlatt" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Hungarian clause object with a participle marked with quotation marks.", function() {
		const mockClause = new NorwegianClause( "Jeg vil heller bli “lurt”.", [ "bli" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "lurt" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );
} );
