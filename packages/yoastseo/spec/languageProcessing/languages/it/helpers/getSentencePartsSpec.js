import getSentenceParts from "../../../../../src/languageProcessing/languages/it/helpers/getSentenceParts.js";

describe( "splits Italian sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Furono tre amici quando furono bambini.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Furono tre amici" );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "furono bambini." );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		const sentence = "Siamo stati tre amici quando li incontravo.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "stati tre amici" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentence when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'fu' in 'funghi'.
		const sentence = "Fu pasta con il funghi e pomodori.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Fu pasta con il funghi e pomodori." );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		const sentence = "Lei viene da noi, ma i suoi figli resteranno a casa.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "viene da noi" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't split sentence on a stop characters that is not followed by a space/punctuation mark", function() {
		const sentence = "I nostri amici verranno tra 2,5 ore";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "verranno tra 2,5 ore" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Mi fui alzata.";
		expect( getSentenceParts( sentence ).length ).toBe( 0 );
	} );

	it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) " +
		"but the auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Fummo arrivati, ci fummo lavati, e poi ci fummo rasati.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Fummo arrivati" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: la .
		const sentence = "Questa è stata la mia casa.";
		expect( getSentenceParts( sentence ).length ).toBe( 0 );
	} );
} );
