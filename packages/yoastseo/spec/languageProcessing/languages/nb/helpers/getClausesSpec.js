import getClauses from "../../../../../src/languageProcessing/languages/nb/helpers/getClauses.js";

describe( "splits Norwegian sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the end of the sentence", function() {
		const sentence = "Ågot Valle blir ny leder av kontroll og konstitusjonskomitéen.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "blir ny" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "leder av kontroll og konstitusjonskomitéen." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "Det er en håndfri, stemmestyrt enhet.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "er en håndfri" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "splits Norwegian sentences that begin with a stopword into clauses", function() {
		const sentence =  "ble Fram XVI beste 50 fots båt.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "ble Fram XVI beste 50 fots båt." );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
	} );
} );
