import stem from "../../../src/morphology/norwegian/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNB = getMorphologyData( "nb" ).nb;

const wordsToStem = [
	// Stem words end in suffixes in step 1
	[ "aabakken", "aabakk" ],
	[ "aabakkens", "aabakk" ],
	[ "analysert", "analyser" ],
	[ "arbeids", "arbeid" ],
	[ "importerte", "importer" ],
	[ "selskaps", "selskap" ],

	// Stem words end in suffixes step 2
	[ "informert", "informer" ],
	[ "anvendt", "anvend" ],
	[ "attraktivt", "attraktiv" ],

	// Stem words end in suffixes step 3
	[ "forsikringsvirksomhetsloven", "forsikringsvirksom" ],
	[ "forutseielege", "forutsei" ],
	[ "havneloven", "havn" ],
	[ "brukareige", "brukar" ],
];

const wordsNotToStem = [
	// A word that doesn't have R1
	"au",
	"arm",
];

const paradigms = [
	// A paradigm of a verb.
	{ stem: "lev", forms: [
		"leve",
		"lever",
		// Verb suffix -de (simple past) and -d (past participle) are not covered yet
		// "levde",
		// "levd",
		"levende",
	] },
	// A paradigm of a verb.
	{ stem: "ring", forms: [
		"ringer",
		// Verb suffix -te (simple past) and -t (past participle) are not covered yet
		// "ringte",
		// "ringt",
		"ringende",
	] },
	// // A paradigm of an adjective. Not covered yet
	// // { stem: "sen", forms: [
	// // 	"sent",
	// // 	"sene",
	// // 	"senere",
	// // 	"senest",
	// // 	"seneste",
	// // ] },
	// A paradigm of a noun.
	{ stem: "selskap", forms: [
		"selskapa",
		"selskapene",
		"selskapenes",
		"selskaper",
		"selskapers",
		"selskapet",
		"selskapets",
		"selskaps",
	] },
];


describe( "Test for stemming Norwegian words", () => {
	it( "stems Norwegian words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataNB ) ).toBe( wordToStem[ 1 ] ) );
		wordsNotToStem.forEach( wordNotToStem => expect( stem( wordNotToStem, morphologyDataNB ) ).toBe( wordNotToStem ) );
	} );
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataNB ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
