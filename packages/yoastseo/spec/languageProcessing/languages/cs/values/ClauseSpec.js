import CzechClause from "../../../../../src/languageProcessing/languages/cs/values/Clause";

describe( "A test for checking the Czech clause", function() {
	it( "checks the properties of the Czech clause object with an auxiliary and a participle", function() {
		const mockClause = new CzechClause( "již bylo napsáno.", [ "bylo" ] );

		expect( mockClause.getParticiples() ).toEqual( [ "napsáno" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Czech clause object with a participle but without an auxiliary", function() {
		const mockClause = new CzechClause( "adoptována kočka", [] );

		expect( mockClause.getParticiples() ).toEqual( [ "adoptována" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object with an auxiliary but without a participle", function() {
		const mockClause = new CzechClause( "Kočky jsou krásné.", [ "jsou" ] );

		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object without an auxiliary and a participle", function() {
		const mockClause = new CzechClause( "Dorazil doktor.", [] );

		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object without an auxiliary and a participle", function() {
		const mockClause = new CzechClause( "Kat je člověk, který vykonává popravy lidí.", [] );

		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
