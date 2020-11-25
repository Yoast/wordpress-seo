import getSentenceParts from "../../../src/researches/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js";

describe( "splits Hungarian sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "Reggel kávét főztem.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Reggel kávét főztem." );
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 1 );
	} );
	it( "returns all sentence parts from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Reggel általában kávét iszom.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Reggel" );
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, "hu" )[ 1 ].getSentencePartText() ).toBe( "általában kávét iszom." );
		expect( getSentenceParts( sentence, "hu" )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 2 );
	} );
} );
