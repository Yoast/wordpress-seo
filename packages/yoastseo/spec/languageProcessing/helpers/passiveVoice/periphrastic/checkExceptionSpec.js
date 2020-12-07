import checkException from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/checkException";

describe( "splits German sentences into parts", function() {
	it( "returns all sentence parts", function() {
		const mockParticiple = new Participle( )
		const sentence =  "Zwischen 1927 und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( checkException( sentence, "de" )[ 0 ].getSentencePartText() ).toBe( "Zwischen 1927" );
		expect( checkException( sentence, "de" )[ 1 ].getSentencePartText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
		expect( checkException( sentence, "de" ).length ).toBe( 2 );
	} );
	it( "splits German sentences that begin with a stopword into sentence parts", function() {
		const sentence =  "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron.";
		expect( checkException( sentence, "de" )[ 0 ].getSentencePartText() ).toBe( "und 1933 hatte sie intensiven Kontakt zur Erzabtei Beuron." );
	} );
} );
