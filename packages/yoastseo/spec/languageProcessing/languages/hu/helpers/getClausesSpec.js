import getClauses from "../../../../../src/languageProcessing/languages/hu/helpers/getClauses.js";

describe( "splits Hungarian sentences into clauses", function() {
	it( "returns all clauses", function() {
		const sentence =  "Péter és Sára szeretnek aludni.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Péter" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "és Sára szeretnek aludni." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "splits Hungarian sentences that begin with a stopword into clauses", function() {
		const sentence =  "és Sára szeretnek aludni.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "és Sára szeretnek aludni." );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
	} );
} );
