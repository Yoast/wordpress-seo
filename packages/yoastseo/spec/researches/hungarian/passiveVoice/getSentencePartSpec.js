import getSentenceParts from "../../../../src/researches/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js";

describe( "splits Hungarian sentences into parts", function() {
	it( "returns all sentence parts", function() {
		const sentence =  "Péter és Sára szeretnek aludni.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "Péter" );
		expect( getSentenceParts( sentence, "hu" )[ 1 ].getSentencePartText() ).toBe( "és Sára szeretnek aludni." );
		expect( getSentenceParts( sentence, "hu" ).length ).toBe( 2 );
	} );
	it( "splits Hungarian sentences that begin with a stopword into sentence parts", function() {
		const sentence =  "és Sára szeretnek aludni.";
		expect( getSentenceParts( sentence, "hu" )[ 0 ].getSentencePartText() ).toBe( "és Sára szeretnek aludni." );
	} );
} );
