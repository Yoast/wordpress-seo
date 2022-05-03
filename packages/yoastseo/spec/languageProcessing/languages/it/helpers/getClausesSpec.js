import getClauses from "../../../../../src/languageProcessing/languages/it/helpers/getClauses.js";

describe( "splits Italian sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Furono tre amici quando furono bambini.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Furono tre amici" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "furono bambini." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		const sentence = "Siamo stati tre amici quando li incontravo.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "stati tre amici" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentence when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'fu' in 'funghi'.
		const sentence = "Fu pasta con il funghi e pomodori.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Fu pasta con il funghi e pomodori." );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		const sentence = "Lei viene da noi, ma i suoi figli resteranno a casa.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "viene da noi" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentence on a stop characters that is not followed by a space/punctuation mark", function() {
		const sentence = "I nostri amici verranno tra 2,5 ore";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "verranno tra 2,5 ore" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Mi fui alzata.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );

	it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) " +
		"but the auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Fummo arrivati, ci fummo lavati, e poi ci fummo rasati.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Fummo arrivati" );
		expect( getClauses( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: la .
		const sentence = "Questa è stata la mia casa.";
		expect( getClauses( sentence ).length ).toBe( 0 );
	} );
} );
