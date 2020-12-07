import getIndicesWithRegex from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getIndicesWithRegex";

describe( "splits German sentences into parts", function() {
	it( "returns all sentence parts", function() {
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getIndicesWithRegex( sentence, "de" )[ 0 ].getSentencePartText() ).toBe( "Zwischen 1927" );
	} );
	it( "splits German sentences that begin with a stopword into sentence parts", function() {
		const sentence =  "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( getIndicesWithRegex( sentence, "de" )[ 0 ].getSentencePartText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
	} );
} );
