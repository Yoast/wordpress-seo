import getClauses from "../../../../../src/languageProcessing/languages/el/helpers/getClauses";

describe( "splits Greek sentences into clauses", function() {
	it( "returns all clauses and their passiveness", function() {
		const sentence =  "Η γάτα είναι πολύ αγαπημένη γιατί είναι γλυκιά.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Η γάτα είναι πολύ αγαπημένη γιατί είναι γλυκιά." );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
	} );
	xit( "splits Greek sentences that begin with a stopword into clauses", function() {
		const sentence =  "";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "" );
	} );
	it( "returns an empty array if there is no auxiliary in the sentence", function() {
		const sentence =  "Λατρεύει τις γάτες.";
		expect( getClauses( sentence ) ).toEqual( [] );
	} );
} );
