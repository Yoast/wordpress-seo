import { determineStem } from "../../../src/morphology/german/determineStem";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

const wordsToStem = [
	// Default stemmer
	[ "studenten", "student" ],
	// Nouns: exceptionStemsWithFullForms
	[ "vögel", "vogel" ],
	// Nouns: exceptionStemsWithFullForms compound
	[ "raubvögel", "raubvogel" ],
	// Adjectives: elStemChange
	[ "inakzeptabl", "inakzeptabel" ],
	// Adjectives: erStemChangeClass1
	[ "integr", "integ" ],
	// Adjectives: erStemChangeClass2
	[ "saur", "sau" ],
	// Adjectives: erStemChangeClass3
	[ "tapfr", "tapf" ],
	// Adjectives: secondStemCompSup
	[ "jüng", "jung" ],
	// Adjectives: bothStemsCompSup
	[ "glätt", "glatt" ],
	// Verbs: strongVerbs
	[ "fraß", "fress" ],
	// Verbs: strongVerbs prefixed
	[ "überfraß", "überfress" ],
	// Verbs: strongVerbs, not treated as prefixed
	[ "berg", "berg" ],
	// Participles
	[ "heraufgeholt", "heraufhol" ],
	[ "gefürchtet", "fürcht" ],
	// Some more tests
	[ "häuser", "haus" ],
	[ "personen", "person" ],
	[ "züge", "zug" ],
	[ "sonderzüge", "sonderzug" ],
	[ "abgötter", "abgott" ],
	[ "Altbauwohnungen", "Altbauwohnung" ],
	[ "Altersdiskriminierung", "Altersdiskriminierung" ],
	[ "Kraftwerke", "Kraftwerk" ],
	// Verbs: a stemmed 3rd person singular
	[ "wirft", "werf" ],
];

describe( "Test for determining stems for German words", () => {
	it( "creates stems for German words", () => {
		wordsToStem.forEach( wordToStem => expect( determineStem( wordToStem[ 0 ], morphologyDataDE ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
