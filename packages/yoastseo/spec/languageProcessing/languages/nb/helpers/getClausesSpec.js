import getClauses from "../../../../../src/languageProcessing/languages/nb/helpers/getClauses.js";

describe( "splits Norwegian sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the end of the sentence", function() {
		// Stopword: og
		const sentence =  "Den er stengt og ble låst hele dagen";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "er stengt" );
		expect( getClauses( sentence ).length ).toBe( 2 );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
	} );
	it( "splits sentences on stopwords", function() {
		// Stopword: siden
		const sentence =  "Den er ferdig siden vi har bygget den i går";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "er ferdig" );
		expect( getClauses( sentence ).length ).toBe( 1 );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "Den ble lovet, det vil bli gjort.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "ble lovet" );
		expect( getClauses( sentence ).length ).toBe( 2 );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
	} );
	it( "splits Norwegian sentences that begin with a stopword into clauses", function() {
		// Stopword: veldig
		const sentence =  "Dette er en veldig god idé.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "er en veldig god idé." );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
	} );
	it( "Doesn't return any clauses when there is no auxiliary", function() {
		const sentence = "De går veldig fort";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );
} );
