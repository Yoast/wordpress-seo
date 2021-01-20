import getSentencePartsSplitOnStopwords
	from "../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/getSentencePartsSplitOnStopwords.js";
import arrayToRegex from "../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import SentencePart from "../../../../../src/values/SentencePart";

const options1 = {
	SentencePart: SentencePart,
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "word", "wordt", "worden", "werd" ] ),
		stopwordRegex: arrayToRegex( [ "als", "dan", "doordat", "hoewel", "omdat" ] ),
	},
};

const options2 = {
	SentencePart: SentencePart,
	regexes: {
		stopwordRegex: arrayToRegex( [ "als", "dan", "doordat", "hoewel", "omdat" ] ),
	},
};


describe( "splits sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 0 ].getSentencePartText() )
			.toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 ).length ).toBe( 1 );
	} );

	it( "returns all sentence parts from sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ik ging naar buiten omdat het mooi weer was.";
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "Ik ging naar buiten" );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 1 ].getSentencePartText() ).toBe( "omdat het mooi weer was." );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 ).length ).toBe( 2 );
	} );

	it( "returns all the stop words as individual sentence part if the sentence contains only stop words", function() {
		const sentence = "Omdat als hoewel.";
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 0 ].getSentencePartText() ).toBe( "Omdat" );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 1 ].getSentencePartText() ).toBe( "als" );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 )[ 2 ].getSentencePartText() ).toBe( "hoewel." );
		expect( getSentencePartsSplitOnStopwords( sentence, options1 ).length ).toBe( 3 );
	} );

	it( "returns the whole sentence when the auxiliary list is not available", function() {
		const sentence = "Het wordt geïmplementeerd.";
		expect( getSentencePartsSplitOnStopwords( sentence, options2 )[ 0 ].getSentencePartText() ).toBe( "Het wordt geïmplementeerd." );
	} );
} );
