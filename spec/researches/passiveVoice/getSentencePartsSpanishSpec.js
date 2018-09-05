import getSentenceParts from "../../../src/researches/passiveVoice/periphrastic/getSentenceParts.js";

describe( "splits Spanish sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Ellos eran tres amigos cuando eran niños.";
		expect( getSentenceParts( sentence, "es" )[ 0 ].getSentencePartText() ).toBe( "eran tres amigos" );
		expect( getSentenceParts( sentence, "es" )[ 1 ].getSentencePartText() ).toBe( "eran niños." );
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 2 );
	} );

	it( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Ellos eran tres amigos cuando los conocí.";
		expect( getSentenceParts( sentence, "es" )[ 0 ].getSentencePartText() ).toBe( "eran tres amigos" );
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a sentence breaker within a word", function() {
		// Sentence breaker: 'es' in 'responsable' and 'acciones'.
		var sentence = "De aquí en adelante ella es responsable de sus acciones.";
		expect( getSentenceParts( sentence, "es" )[ 0 ].getSentencePartText() ).toBe( "es responsable de sus acciones." );
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 1 );
	} );

	it( "returns sentence parts when there is a stop characters followed by a space/punctuation mark", function() {
		var sentence = "Esto es especialmente y principalmente una cuestión de dinero, resumió el primer ministro holandés, Mark Rutte.";
		expect( getSentenceParts( sentence, "es" )[ 0 ].getSentencePartText() ).toBe( "es especialmente y principalmente una cuestión de dinero" );
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when there is a stop characters that is not followed by a space/punctuation mark", function() {
		var sentence = "Afortunadamente será Navidad en 2,5 semanas.";
		expect( getSentenceParts( sentence, "es" )[ 0 ].getSentencePartText() ).toBe( "será Navidad en 2,5 semanas." );
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 1 );
	} );

	it( "doesn't return sentence parts when an auxiliary is followed by a word from the followingAuxiliaryExceptionWords list", function() {
		// Exception word after auxiliary: el.
		var sentence = "Es el capítulo preferido de varios miembros del equipo de producción.";
		expect( getSentenceParts( sentence, "es" ).length ).toBe( 0 );
	} );
} );
