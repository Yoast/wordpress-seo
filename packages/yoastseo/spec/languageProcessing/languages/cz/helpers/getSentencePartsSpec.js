import getSentenceParts from "../../../../../src/languageProcessing/languages/cz/helpers/getSentenceParts.js";

describe( "splits Czech sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "Počasí dnes ukazuje slunce.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Počasí dnes ukazuje slunce." );
		expect( getSentenceParts( sentence )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence ).length ).toBe( 1 );
	} );
	it( "returns all sentence parts from the sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Pustil práci aby se postaral o děti.";
		expect( getSentenceParts( sentence )[ 0 ].getSentencePartText() ).toBe( "Pustil práci" );
		expect( getSentenceParts( sentence )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence )[ 1 ].getSentencePartText() ).toBe( "aby se postaral o děti." );
		expect( getSentenceParts( sentence )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence ).length ).toBe( 2 );
	} );
} );
