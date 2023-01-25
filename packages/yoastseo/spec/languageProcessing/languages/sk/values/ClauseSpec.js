import SlovakClause from "../../../../../src/languageProcessing/languages/sk/values/Clause";

describe( "A test for checking the Slovak clause", function() {
	it( "checks the properties of the Slovak clause object with an auxiliary and a participle", function() {
		const mockClause = new SlovakClause( "už bolo napísané", [ "bolo" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "napísané" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Slovak clause object with an auxiliary but without a participle", function() {
		const mockClause = new SlovakClause( "Mačky sú krásne.", [ "jsou" ] );

		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object without an auxiliary and a participle", function() {
		const mockClause = new SlovakClause( "Schôdzu zrušili.", [] );

		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
