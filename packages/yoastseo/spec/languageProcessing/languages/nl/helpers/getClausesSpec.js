import getClauses from "../../../../../src/languageProcessing/languages/nl/helpers/getClauses.js";

describe( "splits Dutch sentences into clauses", function() {
	it( "returns the whole sentence when there is no stopword and return its passiveness.", function() {
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "returns all clauses from sentence beginning to the stopword and from the stopword to the end of the sentence " +
		"and returns their passiveness", function() {
		const sentence = "De kat werd geadopteerd zodra hij werd gezien.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "De kat werd geadopteerd" );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "zodra hij werd gezien." );
		expect( getClauses( sentence )[ 1 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
} );
