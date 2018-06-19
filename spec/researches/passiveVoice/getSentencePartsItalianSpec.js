var getSentenceParts = require( "../../../js/researches/passiveVoice/periphrastic/getSentenceParts.js" );

describe( "splits Italian sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Erano tre amici quando erano bambini.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Erano tre amici" );
		expect( getSentenceParts( sentence, "it" )[ 1 ].getSentencePartText() ).toBe( "erano bambini." );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Erano tre amici quando li incontravo.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Erano tre amici" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'era' in 'primavera' and 'temperature'.
		var sentence = "Ieri era un bel pomeriggio di primavera con temperature calde.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "era un bel pomeriggio di primavera con temperature calde." );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		var sentence = "Questo è molto costoso, ma voglio comprarlo.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "è molto costoso" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
		var sentence = "Per fortuna sarà Natale tra 2,5 settimane.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "sarà Natale tra 2,5 settimane." );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		var sentence = "Si sono lavati.";
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 0 );
	} );

	it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) but the auxiliary is preceded by a reflexive pronoun", function() {
		var sentence = "Siamo arrivati, ci siamo lavati, e poi ci siamo rasati.";
		expect( getSentenceParts( sentence, "it" )[ 0 ].getSentencePartText() ).toBe( "Siamo arrivati" );
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 1 );
	} );
	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: la .
		var sentence = "Questa è la mia casa.";
		expect( getSentenceParts( sentence, "it" ).length ).toBe( 0 );
	} );
} );
