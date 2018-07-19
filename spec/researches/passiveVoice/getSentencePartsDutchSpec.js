const getSentenceParts = require( "../../../js/researches/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js" );

describe( "splits Dutch sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getSentencePartText() ).toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getSentenceParts( sentence, "nl" ).length ).toBe( 1 );
	} );

	it( "returns all sentence parts from sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ik ging naar buiten omdat het mooi weer was.";
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getSentencePartText() ).toBe( "Ik ging naar buiten" );
		expect( getSentenceParts( sentence, "nl" )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, "nl" )[ 1 ].getSentencePartText() ).toBe( "omdat het mooi weer was." );
		expect( getSentenceParts( sentence, "nl" )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentenceParts( sentence, "nl" ).length ).toBe( 2 );
	} );
} );
