import getSentenceParts from "../../../src/researches/passiveVoice/periphrastic/getSentenceParts.js";

describe( "splits Portuguese sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Eles eram três amigos quando eram crianças.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "eram três amigos" );
		expect( getSentenceParts( sentence, "pt" )[ 1 ].getSentencePartText() ).toBe( "eram crianças." );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Eles eram três amigos quando os conheci.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "eram três amigos" );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'es' in 'responsable' and 'acciones'.
		var sentence = "De aqui em diante ela é responsável por suas ações.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "é responsável por suas ações." );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop characters followed by a space/punctuation mark", function() {
		var sentence = "Isso é especialmente uma questão de dinheiro, resumiu o primeiro-ministro holandês, Mark Rutte.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "é especialmente uma questão de dinheiro" );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
		var sentence = "Felizmente será Natal em 2,5 semanas.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "será Natal em 2,5 semanas." );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );
} );
