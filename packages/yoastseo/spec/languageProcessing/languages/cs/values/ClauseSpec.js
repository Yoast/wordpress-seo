import CzechClause from "../../../../../src/languageProcessing/languages/cs/values/Clause";

describe( "A test for checking the Czech clause", function() {
	it( "checks the properties of the Czech clause object with an auxiliary and a participle", function() {
		const mockParticiple = new CzechClause( "již bylo napsáno.", [ "bylo" ] );

		expect( mockParticiple.getParticiples() ).toEqual( [ "napsáno" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks the properties of the Czech clause object with a participle but without an auxiliary", function() {
		const mockParticiple = new CzechClause( "adoptována kočka", [] );

		expect( mockParticiple.getParticiples() ).toEqual( [ "adoptována" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object with an auxiliary but without a participle", function() {
		const mockParticiple = new CzechClause( "Kočky jsou krásné.", [ "jsou" ] );

		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object without an auxiliary and a participle", function() {
		const mockParticiple = new CzechClause( "Dorazil doktor.", [] );

		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks the properties of the Czech clause object without an auxiliary and a participle", function() {
		const mockParticiple = new CzechClause( "Kat je člověk, který vykonává popravy lidí.", [] );

		expect( mockParticiple.isPassive() ).toBe( false );
	} );
} );
