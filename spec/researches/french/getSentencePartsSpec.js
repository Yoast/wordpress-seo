var getSentenceParts = require( "../../../js/researches/french/getSentenceParts.js");

describe( "splits French sentences into parts", function() {
	it ( "returns all sentence parts from the auxiliary to the stopword and from the stopword to the end of the sentence", function() {
		var sentence = "Ils étaient très amis lorsqu'ils étaient enfants.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "étaient très amis" );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "étaient enfants." );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );

	it ( "returns all sentence parts from the auxiliary to the stopword", function() {
		var sentence = "Ils étaient très heureux lorsque je les y conduisais.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "étaient très heureux" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

	it ( "doesn't split on sentence breakers within words", function() {
		var sentence = "Désormais tu es responsable de tes actes.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "es responsable de tes actes." );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );

} );
