import getSentenceParts from "../../../../../src/languageProcessing/languages/en/helpers/getSentenceParts.js";

describe( "splits English sentences into parts", function() {
	it( "returns all sentence parts from the auxiliary to the end of the sentence", function() {
		const sentence = "The English are still having a party.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "are still" );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "having a party." );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );
	it( "filters out sentence parts without auxiliary", function() {
		const sentence = "The English are always throwing parties.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "are always" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't split on sentence breakers within words", function() {
		// Sentence breaker: 'is' in 'praise'.
		const sentence = "Commented is praise due.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "is praise due." );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters", function() {
		const sentence = "It is a hands-free, voice-controlled device.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "is a hands-free" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "doesn't split sentences on stop characters that are not preceded by a word and also not followed by a space/punctuation mark", function() {
		const sentence = "It is a 1,000,000 dollar house.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "is a 1,000,000 dollar house." );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "splits sentences on stop characters when followed by a punctuation mark", function() {
		const sentence = "\"This is it\", he said.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "is it\"" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "correctly splits English sentences when matching punctuation after words ending in ing", function() {
		const sentence = "(is having)";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "having)" );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
} );
