import getClauses from "../../../../../src/languageProcessing/languages/de/helpers/getClauses.js";

describe( "splits German sentences into clauses", function() {
	it( "returns all clauses and their passiveness", function() {
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Zwischen 1927" );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( false );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
		expect( getClauses( sentence )[ 1 ].isPassive() ).toBe( false );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "splits German sentences that begin with a stopword into clauses", function() {
		const sentence =  "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
	} );
} );
