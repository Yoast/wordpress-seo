import getClausesSplitOnStopwords
	from "../../../../../../src/languageProcessing/helpers/passiveVoice/periphrastic/freeAuxiliaryParticipleOrder/getClausesSplitOnStopWords.js";
import arrayToRegex from "../../../../../../src/languageProcessing/helpers/regex/createRegexFromArray";
import Clause from "../../../../../../src/languageProcessing/values/Clause";
import getClauses from "../../../../../../src/languageProcessing/languages/cs/helpers/getClauses";

const options1 = {
	Clause: Clause,
	regexes: {
		auxiliaryRegex: arrayToRegex( [ "word", "wordt", "worden", "werd" ] ),
		stopwordRegex: arrayToRegex( [ "als", "dan", "zodra", "hoewel", "omdat" ] ),
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
		const sentence = "De kat werd geadopteerd zodra hij werd gezien.";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() ).toBe( "De kat werd geadopteerd" );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 1 ].getClauseText() ).toBe( "zodra hij werd gezien." );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 1 ].getAuxiliaries() ).toEqual( [ "werd" ] );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 2 );
	} );

	it( "does not return a clause that doesn't have an auxiliary", function() {
		const sentence = "De kat wordt geadopteerd zodra zij haar moeder niet nodig heeft";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() ).toBe( "De kat wordt geadopteerd" );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [ "wordt" ] );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 1 );
	} );

	it( "returns a clause that starts with a stopword", function() {
		const sentence = "Als ik rijk wordt ga ik je iets kopen.";
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getClauseText() ).toBe( "Als ik rijk wordt ga ik je iets kopen." );
		expect( getClausesSplitOnStopwords( sentence, options1 )[ 0 ].getAuxiliaries() ).toEqual( [ "wordt" ] );
		expect( getClausesSplitOnStopwords( sentence, options1 ).length ).toBe( 1 );
	} );

	it( "splits sentence on stop character", function() {
		const sentence = "Rostliny jsou vysazeny, léto je blízko.";
		expect( getClauses( sentence )[ 0 ].getClauseText() ).toBe( "Rostliny jsou vysazeny" );
		expect( getClauses( sentence )[ 1 ].getClauseText() ).toBe( "léto je blízko." );
		expect( getClauses( sentence ).length ).toBe( 2 );
	} );

	it( "returns an empty array if there are no auxiliaries in any of the clauses", function() {
		const sentence = "De zon schijnt.";
		expect( getClausesSplitOnStopwords( sentence, options1 ) ).toEqual( [] );
	} );

	it( "returns the whole sentence when the auxiliary list is not available", function() {
		const sentence = "Het wordt geïmplementeerd.";
		expect( getClausesSplitOnStopwords( sentence, options2 )[ 0 ].getClauseText() ).toBe( "Het wordt geïmplementeerd." );
	} );
} );
