import DutchClause from "../../../../../src/languageProcessing/languages/nl/values/Clause.js";

describe( "A test for checking the Dutch clause", function() {
	it( "checks Dutch clause with a regular participle and checks its passiveness", function() {
		const mockClause = new DutchClause( "werd door mij gekocht.", [ "werd" ] );
		expect( mockClause.getClauseText() ).toEqual(  "werd door mij gekocht." );
		expect( mockClause.getParticiples() ).toEqual( [ "gekocht" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks Dutch clause with an irregular participle and checks its passiveness", function() {
		const mockClause = new DutchClause( "werd achtervolgd.", [ "werd" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "achtervolgd" ] );
		expect( mockClause.isPassive() ).toBe( true );
	} );

	it( "checks Dutch clause with a word from the list of non-participles and checks its passiveness", function() {
		let mockClause = new DutchClause( "wordt beschrijvend.", [ "wordt" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "beschrijvend" ] );
		expect( mockClause.isPassive() ).toBe( false );

		mockClause = new DutchClause( "wordt geen gemoedelijkheid", [ "wordt" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "gemoedelijkheid" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );

	it( "checks Dutch clause with a direct precedence exception and checks its passiveness", function() {
		const mockClause = new DutchClause( "wordt een geliefd", [ "wordt" ] );
		expect( mockClause.getParticiples() ).toEqual( [ "geliefd" ] );
		expect( mockClause.isPassive() ).toBe( false );
	} );
} );
