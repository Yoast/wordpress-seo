import getClausesSplitOnStopwords from "../../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/getClausesSplitOnStopWords.js";
import arrayToRegex from "../../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import Clause from "../../../../../src/values/Clause";

const options1 = {
	Clause: Clause,
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "word", "wordt", "worden", "werd" ] ),
		stopwordRegex: arrayToRegex( [ "als", "dan", "doordat", "hoewel", "omdat" ] ),
	},
};

const options2 = {
	Clause: Clause,
	regexes: {
		stopwordRegex: arrayToRegex( [ "als", "dan", "doordat", "hoewel", "omdat" ] ),
	},
};


describe( "splits sentences into parts", function() {
	it( "returns the whole sentence when there is no stopword", function() {
		const sentence = "De taart werd voor haar verjaardag gebakken.";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() )
			.toBe( "De taart werd voor haar verjaardag gebakken." );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 1 );
	} );

	it( "returns all clauses from sentence beginning to the stopword and from the stopword to the end of the sentence", function() {
		const sentence = "Ik ging naar buiten omdat het mooi weer was.";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() ).toBe( "Ik ging naar buiten" );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [] );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 1 ].getClauseText() ).toBe( "omdat het mooi weer was." );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 1 ].getAuxiliaries() ).toEqual( [] );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 2 );
	} );

	it( "returns all the stop words as individual clause if the sentence contains only stop words", function() {
		const sentence = "Omdat als hoewel.";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() ).toBe( "Omdat" );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 1 ].getClauseText() ).toBe( "als" );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 2 ].getClauseText() ).toBe( "hoewel." );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 3 );
	} );

	it( "returns the whole sentence when the auxiliary list is not available", function() {
		const sentence = "Het wordt geïmplementeerd.";
		expect( getClausesSplitOnStopwords( sentence, options2 )[ 0 ].getClauseText() ).toBe( "Het wordt geïmplementeerd." );
	} );
} );
