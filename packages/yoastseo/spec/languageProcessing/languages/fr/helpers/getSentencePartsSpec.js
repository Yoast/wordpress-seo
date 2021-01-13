import getSentenceParts from "../../../../../src/languageProcessing/languages/fr/helpers/getSentenceParts.js";

describe( "splits French sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ils étaient très amis lorsqu'ils étaient enfants.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "étaient très amis" );
		expect( getSentenceParts( sentence, )[ 1 ].getSentencePartText() ).toBe( "étaient enfants." );
		expect( getSentenceParts( sentence, ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		const sentence = "Ils étaient très heureux lorsque je les y conduisais.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "étaient très heureux" );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'es' in 'responsable', 'tes' and 'actes'.
		const sentence = "Désormais tu es responsable de tes actes.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "es responsable de tes actes." );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop characters followed by a space/punctuation mark", function() {
		const sentence = "Cela est en particulier une question d'argent, a résumé le Premier ministre néerlandais Mark Rutte.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "est en particulier une question d'argent" );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
		const sentence = "La branche était déficitaire de 1,5 milliard.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "était déficitaire de 1,5 milliard." );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by a reflexive pronoun", function() {
		const sentence = "Ils se sont lavés.";
		expect( getSentenceParts( sentence, ).length ).toBe( 0 );
	} );

	it( "doesn't return sentence parts when an auxiliary is preceded by an elided reflexive pronoun (s')", function() {
		const sentence = "L’emballement s'est prolongé mardi 9 janvier.";
		expect( getSentenceParts( sentence, ).length ).toBe( 0 );
	} );

	it( "doesn't return a sentence part when there is a non-auxiliary sentence breaker (comma) but the auxiliary is preceded" +
		" by a reflexive pronoun", function() {
		const sentence = "Nous sommes arrivés, nous nous sommes lavés, et puis nous nous sommes couchés.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "sommes arrivés" );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: le.
		const sentence = "C'est le film le plus vu.";
		expect( getSentenceParts( sentence, ).length ).toBe( 0 );
	} );
} );
