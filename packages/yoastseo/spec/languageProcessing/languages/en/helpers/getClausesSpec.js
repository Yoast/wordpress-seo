import getClauses from "../../../../../src/languageProcessing/languages/en/helpers/getClauses.js";

describe( "splits English sentences into clauses", function() {
	it( "returns all clauses from the auxiliary to the end of the sentence", function() {
		const sentence = "The English are still having a party.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "are still" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "having a party." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );
	it( "filters out clauses without auxiliary", function() {
		const sentence = "The English are always throwing parties.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "are always" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't split on sentence breakers within words", function() {
		// Sentence breaker: 'is' in 'praise'.
		const sentence = "Commented is praise due.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "is praise due." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "It is a hands-free, voice-controlled device.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "is a hands-free" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		const sentence = "It is a 1,000,000 dollar house.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "is a 1,000,000 dollar house." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters when followed by a punctuation mark", function() {
		const sentence = "\"This is it\", he said.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "is it\"" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "correctly splits English sentences when matching punctuation after words ending in ing", function() {
		const sentence = "(is having)";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "having)" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "does not split an English sentence on a word from the -ing exception list", function() {
		const sentence = "He is the king of the castle";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "is the king of the castle" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
} );
