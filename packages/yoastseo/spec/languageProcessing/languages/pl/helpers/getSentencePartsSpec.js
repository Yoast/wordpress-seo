import getSentenceParts from "../../../../../src/languageProcessing/languages/pl/helpers/getSentenceParts.js";

describe( "splits Polish sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "To zostało już dawno zapomniane.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "To zostało już dawno zapomniane." );
		expect( getSentenceParts( sentence )[ 0 ].getAuxiliaries() ).toEqual( [ "zostało" ] );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "returns all sentence parts from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Pojechałam na wakacje żeby odpocząć.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Pojechałam na wakacje" );
		expect( getSentenceParts( sentence )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "żeby odpocząć." );
		expect( getSentenceParts( sentence )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );
} );
