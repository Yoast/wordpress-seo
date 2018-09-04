const getForms = require( "../../../src/morphology/english/getForms.js" );
const morphologyData = require( "../../../src/morphology/morphologyData.json" ).en;

import { includes } from "lodash-es";

const simpleWordsToTest = [
	[ "word", "words", "wording", "worded" ],
	[ "word", "words", "word's", "words'", "words's" ],
	[ "fly", "flies", "flying", "flew", "flown" ],
];

const complexWordsToTest = [
	[ "foot", [ "feet", "footing", "footed" ] ],
	[ "feet", [ "foot" ] ],
	[ "analysis", [ "analyses" ] ],
	[ "analyses", [ "analysis", "analyse", "analysing", "analysed" ] ],
	[ "analyse", [ "analyses", "analysing", "analysed" ] ],
	[ "analysing", [ "analyses", "analyse", "analysed" ] ],
	[ "analysed", [ "analyse", "analysing", "analyses" ] ],
	[ "embargo", [ "embargos", "embargoes", "embargoing", "embargoed" ] ],
	[ "embargos", [ "embargo", "embargoes" ] ],
	[ "embargoes", [ "embargo", "embargos", "embargoing", "embargoed" ] ],
	[ "embargoing", [ "embargo", "embargoes", "embargoed" ] ],
	[ "embargoed", [ "embargo", "embargoes", "embargoing" ] ],
	[ "word's", [ "word", "words", "words'", "words's" ] ],
	[ "focus", [ "foci", "focuses", "focused", "focusing" ] ],
	[ "focuses", [ "focus", "focused", "focusing" ] ],
	[ "focused", [ "focus", "focuses", "focusing" ] ],
	[ "focusing", [ "focus", "focuses", "focused" ] ],
	[ "foci", [ "focus" ] ],
];

const possessivesToTest = [
	[ "word's", [ "wording", "worded", "word'sed", "word'sing", "word'ses" ] ],
	[ "Tomas'", [ "Tomas'ing", "Tomas'ed", "Tomas'ed" ] ],
];


describe( "Test for getting all possible word forms for regular words", function() {
	simpleWordsToTest.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			it( "returns an array of word forms for a regular word", function() {
				const receivedForms = getForms( wordInParadigm, morphologyData );
				paradigm.forEach( function( form ) {
					expect( receivedForms ).toContain( form );
				} );
			} );
		} );
	} );
} );

describe( "Test for getting all possible word forms for complex words", function() {
	complexWordsToTest.forEach( function( paradigm ) {
		const receivedForms = getForms( paradigm[ 0 ], morphologyData );
		const expectedForms = paradigm[ 1 ];
		expectedForms.forEach( function( wordExpected ) {
			it( "returns an array of word forms for a complex word", function() {
				expect( receivedForms ).toContain( wordExpected );
			} );
		} );
	} );
} );

describe( "Test for NOT getting verb forms for possessives", function() {
	possessivesToTest.forEach( function( paradigm ) {
		const receivedForms = getForms( paradigm[ 0 ], morphologyData );
		const formsNotExpected = paradigm[ 1 ];
		formsNotExpected.forEach( function( formNotExpected ) {
			it( "returns an array of word forms that should not be formed for a possessive", function() {
				const presentInTheReceivedForms = includes( receivedForms, formNotExpected );
				expect( presentInTheReceivedForms ).toEqual( false );
			} );
		} );
	} );
} );

