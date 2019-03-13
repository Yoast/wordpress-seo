import { determineStem } from "../../../src/morphology/german/determineStem";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

const nounsToStem = [
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
	// Participles
	[ "heraufgeholt", "heraufhol" ],
];

describe( "Test for determining stems for German words", () => {
	it( "creates stems for German words", () => {
		nounsToStem.forEach( wordToStem => expect( determineStem( wordToStem[ 0 ], morphologyDataDE ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
