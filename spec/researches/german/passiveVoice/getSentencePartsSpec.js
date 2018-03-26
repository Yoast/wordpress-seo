var getSentenceParts = require( "../../../../js/researches/german/passiveVoice/getSentenceParts.js" );

describe( "splits German sentences into parts", function() {
	it( "returns all sentence parts", function() {
		var sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Zwischen 1927" );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );
	it( "splits German sentences that begin with a stopword into sentence parts", function() {
		var sentence =  "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
	} );
} );
