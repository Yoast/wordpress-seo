import getSentenceParts from "../../../../../src/languageProcessing/languages/cz/helpers/getSentenceParts.js";

describe( "splits Czech sentences into parts", function() {
	it( "returns all sentence parts", function() {
		const sentence =  "Péter és Sára szeretnek aludni.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Péter" );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "és Sára szeretnek aludni." );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );
	it( "splits Czech sentences that begin with a stopword into sentence parts", function() {
		const sentence =  "és Sára szeretnek aludni.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "és Sára szeretnek aludni." );
	} );
} );
