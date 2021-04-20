import getClauses from "../../../../../src/languageProcessing/languages/de/helpers/getClauses.js";

describe( "splits German sentences into clauses", function() {
	it( "returns all clauses and their passiveness", function() {
		const sentence =  "Die Katze wurde adoptiert, sobald sie gesehen wurde.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Die Katze wurde adoptiert," );
		expect( getClauses( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "sobald sie gesehen wurde." );
		expect( getClauses( sentence )[ 1 ].isPassive() ).toBe( true );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "splits German sentences that begin with a stopword into clauses", function() {
		const sentence =  "und bekommt seinen letzten Lohn.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "und bekommt seinen letzten Lohn." );
	} );
	it( "returns an empty array if there is no auxiliary in the sentence", function() {
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getClauses( sentence ) ).toEqual( [] );
	} );
} );
