import getClauses from "../../../../../src/languageProcessing/languages/cs/helpers/getClauses.js";

describe( "splits Czech sentences into clauses", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "On byl doporučen k lékaři.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "On byl doporučen k lékaři." );
		expect( getClauses( sentence )[ 0 ].getParticiples() ).toEqual( [ "doporučen" ] );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "byl" ] );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "returns all clauses from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "byla kočka adoptována nebo byla koupena?";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "byla kočka adoptována" );
		expect( getClauses( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "byla" ] );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "nebo byla koupena?" );
		expect( getClauses( sentence )[ 1 ].getAuxiliaries() ).toEqual( [ "byla" ] );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
} );
