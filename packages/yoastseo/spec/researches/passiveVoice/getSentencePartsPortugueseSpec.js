import getSentenceParts from "../../../src/languages/legacy/researches/passiveVoice/periphrastic/getSentenceParts.js";

describe( "splits Portuguese sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Eles eram três amigos quando eram crianças.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "eram três amigos" );
		expect( getSentenceParts( sentence, "pt" )[ 1 ].getSentencePartText() ).toBe( "eram crianças." );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		const sentence = "Eles eram três amigos quando os conheci.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "eram três amigos" );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'e' in 'internet' and 'energia'.
		const sentence = "A internet do conhecimento é combinada com a internet da energia e a internet da mobilidade.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "é combinada com a internet da energia" );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop character followed by a space/punctuation mark", function() {
		const sentence = "Isso é especialmente uma questão de dinheiro, resumiu o primeiro-ministro holandês, Mark Rutte.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "é especialmente uma questão de dinheiro" );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop character that is not followed by a space/punctuation mark", function() {
		const sentence = "Felizmente será Natal em 2,5 semanas.";
		expect( getSentenceParts( sentence, "pt" )[ 0 ].getSentencePartText() ).toBe( "será Natal em 2,5 semanas." );
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: o.
		const sentence = "É o capítulo preferido de vários membros da equipe de produção.";
		expect( getSentenceParts( sentence, "pt" ).length ).toBe( 0 );
	} );
} );
