import getSentenceParts from "../../../src/researches/passiveVoice/periphrastic/getSentenceParts.js";

describe( "splits Hungarian sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Voltál tre amici alatt furono bambini.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Voltál tre amici " );
		expect( getSentenceParts( sentence, "hu" )[ 1 ].getSentencePartText() ).toBe( "furono bambini." );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		const sentence = "Voltál stati tre amici alatt li incontravo.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Voltál stati tre amici" );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'van' in 'megvan'.
		const sentence = "Megvan pasta con i pomodori.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "" );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		const sentence = "Hogy viene da noi, ma i suoi figli resteranno a casa.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "viene da noi" );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	} );

	// it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
	// 	var sentence = "I nostri amici verranno tra 2,5 ore";
	// 	expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "verranno tra 2,5 ore" );
	// 	expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	// } );

	// it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
	// 	var sentence = "Mi fui alzata.";
	// 	expect( getSentenceParts( sentence, "hu" ).length ).toBe( 0 );
	// } );

	// it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) but the auxiliary is preceded by a reflexive pronoun", function() {
	// 	var sentence = "Fummo arrivati, ci fummo lavati, e poi ci fummo rasati.";
	// 	expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Fummo arrivati" );
	// 	expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	// } );
	// it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
	// 	// Exception word after auxiliary: la .
	// 	var sentence = "Questa è stata la mia casa.";
	// 	expect( getSentenceParts( sentence, "hu" ).length ).toBe( 0 );
	// } );
} );
