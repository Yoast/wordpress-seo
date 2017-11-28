var getSentenceParts = require( "../../../js/researches/passivevoice/getSentenceParts.js");

describe( "splits French sentences into parts", function() {
	it ( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Ils étaient très amis lorsqu'ils étaient enfants.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "étaient très amis" );
		expect( getSentenceParts( sentence, "fr" )[ 1 ].getSentencePartText() ).toBe( "étaient enfants." );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 2 );
	} );

	it ( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Ils étaient très heureux lorsque je les y conduisais.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "étaient très heureux" );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 1 );
	} );

	it ( "doesn't split on sentence breakers within words", function() {
		var sentence = "Désormais tu es responsable de tes actes.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "es responsable de tes actes." );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 1 );
	} );

	it ( "splits sentences on stop characters", function() {
		var sentence = "C'est en particulier et principalement une question d'argent, a résumé le Premier ministre néerlandais Mark Rutte.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "C'est en particulier et principalement une question d'argent" );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 1 );
	} );

	it ( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		var sentence = "La branche était déficitaire de 1,5 milliard.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "était déficitaire de 1,5 milliard." );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 1 );
	} );

	it ( "doesn't split sentences when an auxiliary is preceded by a reflexive pronoun", function() {
		var sentence = "Ils se sont lavés.";
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 0 );
	} );

	it ( "filters the sentence part when it is included because of a non-auxiliary sentence breaker but contains an auxiliary preceded by a reflexive pronoun", function() {
		var sentence = "Nous sommes arrivés, nous nous sommes lavés, et puis nous nous sommes couchés.";
		expect( getSentenceParts( sentence, "fr" )[ 0 ].getSentencePartText() ).toBe( "sommes arrivés" );
		expect( getSentenceParts( sentence, "fr" ).length ).toBe( 1 );
	} );

} );
