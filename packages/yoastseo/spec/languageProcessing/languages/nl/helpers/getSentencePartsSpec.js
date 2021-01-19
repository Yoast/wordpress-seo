import getSentenceParts from "../../../../../src/languageProcessing/languages/nl/helpers/getSentenceParts.js";

describe( "splits Dutch sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getSentenceParts( sentence, )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getSentenceParts( sentence, ).length ).toBe( 1 );
	} );

	it( "returns all sentence parts from sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ik ging naar buiten omdat het mooi weer was.";
		expect( getSentenceParts( sentence, )[ 0 ].getSentencePartText() ).toBe( "Ik ging naar buiten" );
		expect( getSentenceParts( sentence, )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, )[ 1 ].getSentencePartText() ).toBe( "omdat het mooi weer was." );
		expect( getSentenceParts( sentence, )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, ).length ).toBe( 2 );
	} );
} );
