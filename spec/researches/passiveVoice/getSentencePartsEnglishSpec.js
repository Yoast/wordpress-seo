var getSentenceParts = require( "../../../js/researches/passiveVoice/periphrastic/getSentenceParts.js" );

describe( "splits English sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the end of the sentence", function() {
		var sentence = "The English are still having a party.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "are still" );
		expect( getSentenceParts( sentence, "en" )[ 1 ].getSentencePartText() ).toBe( "having a party." );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 2 );
	} );
	it( "filters out sentence parts without auxiliary", function() {
		var sentence = "The English are always throwing parties.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "are always" );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
	it( "doesn't split on sentence breakers within words", function() {
		// Sentence breaker: 'is' in 'praise'.
		var sentence = "Commented is praise due.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "is praise due." );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters", function() {
		var sentence = "It is a hands-free, voice-controlled device.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "is a hands-free" );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
	it( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		var sentence = "It is a 1,000,000 dollar house.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "is a 1,000,000 dollar house." );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters when followed by a punctuation mark", function() {
		var sentence = "\"This is it\", he said.";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "is it\"" );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
	it( "correctly splits English sentences when matching punctuation after words ending in ing", function() {
		var sentence = "(is having)";
		expect( getSentenceParts( sentence, "en" )[ 0 ].getSentencePartText() ).toBe( "having)" );
		expect( getSentenceParts( sentence, "en" ).length ).toBe( 1 );
	} );
} );
