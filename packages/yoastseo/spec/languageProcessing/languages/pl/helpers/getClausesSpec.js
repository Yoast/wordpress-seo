import getClauses from "../../../../../src/languageProcessing/languages/pl/helpers/getClauses.js";

describe( "splits Polish sentences into clauses", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "To zostało już dawno zapomniane.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "To zostało już dawno zapomniane." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "returns all clauses from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ten kot został adoptowany, bo jest uroczy.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Ten kot został adoptowany," );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "bo jest uroczy." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
} );
