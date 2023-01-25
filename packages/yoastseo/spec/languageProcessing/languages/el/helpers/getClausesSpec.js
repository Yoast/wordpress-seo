import getClauses from "../../../../../src/languageProcessing/languages/el/helpers/getClauses";

describe( "splits Greek sentences into clauses", function() {
	it( "returns all clauses and their passiveness", function() {
		const sentence = "Το άρθρο είναι γραμμένο και ο συγγραφέας είναι ευχαριστημένος.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Το άρθρο είναι γραμμένο" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "ο συγγραφέας είναι ευχαριστημένος." );
		expect( getClauses( sentence )[ 1 ].isPassive() ).toBe( true );
	} );
	it( "splits Greek sentences that begin with a stopword into clauses", function() {
		const sentence = "και ο συγγραφέας είναι ευχαριστημένος.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "ο συγγραφέας είναι ευχαριστημένος." );
	} );
	it( "returns an empty array if there is no auxiliary in the sentence", function() {
		const sentence =  "Λατρεύει τις γάτες.";
		expect( getClauses( sentence ) ).toEqual( [] );
	} );
} );
