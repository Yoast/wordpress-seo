import DutchClause from "../../../../../src/languageProcessing/languages/nl/values/Clause.js";

describe( "A test for checking the Dutch participle", function() {
	it( "checks Dutch clause with a regular participle and checks its passiveness", function() {
		const mockParticiple = new DutchClause( "werd door mij gekocht.", [ "werd" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gekocht" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks Dutch clause with an irregular participle and checks its passiveness", function() {
		const mockParticiple = new DutchClause( "werd achtervolgd.", [ "werd" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "achtervolgd" ] );
		expect( mockParticiple.isPassive() ).toBe( true );
	} );

	it( "checks Dutch clause with a word from the list of non-participles and checks its passiveness", function() {
		let mockParticiple = new DutchClause( "wordt beschrijvend.", [ "wordt" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "beschrijvend" ] );
		expect( mockParticiple.isPassive() ).toBe( false );

		mockParticiple = new DutchClause( "wordt geen gemoedelijkheid", [ "wordt" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gemoedelijkheid" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks Dutch clause with a direct precedence exception and checks its passiveness", function() {
		const mockParticiple = new DutchClause( "wordt een geliefd", [ "wordt" ] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "geliefd" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );

	it( "checks Dutch clause without auxiliary and checks its passiveness", function() {
		const mockParticiple = new DutchClause( "Mijn lieve tortie heeft haar avondeten gegeten.", [] );
		expect( mockParticiple.getParticiples() ).toEqual( [ "gegeten" ] );
		expect( mockParticiple.isPassive() ).toBe( false );
	} );
} );
