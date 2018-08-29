var getSentenceParts = require( "../../../src/researches/passiveVoice/periphrastic/getSentenceParts.js" );

describe( "splits Italian sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Furono tre amici quando furono bambini.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Furono tre amici" );
		expect( getSentenceParts( sentence, "it" )[ 1 ].getSentencePartText() ).toBe( "furono bambini." );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Siamo stati tre amici quando li incontravo.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "stati tre amici" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'fu' in 'funghi'.
		var sentence = "Fu pasta con il funghi e pomodori.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Fu pasta con il funghi e pomodori." );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		var sentence = "Lei viene da noi, ma i suoi figli resteranno a casa.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "viene da noi" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
		var sentence = "I nostri amici verranno tra 2,5 ore";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "verranno tra 2,5 ore" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		var sentence = "Mi fui alzata.";
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 0 );
	} );

	it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) but the auxiliary is preceded by a reflexive pronoun", function() {
		var sentence = "Fummo arrivati, ci fummo lavati, e poi ci fummo rasati.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Fummo arrivati" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: la .
		var sentence = "Questa è stata la mia casa.";
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 0 );
	} );
} );
