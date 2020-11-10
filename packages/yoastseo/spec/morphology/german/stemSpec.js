import stem from "../../../src/languageProcessing/languages/de/helpers/internal/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataDE = getMorphologyData( "de" ).de;

const wordsToStem = [
	// Suffix step 1 category a (-ern).
	[ "häusern", "häus" ],
	// Suffix step 1 category b (-en).
	[ "studenten", "student" ],
	// Suffix step 1 category c (-s preceded by valid s-ending).
	[ "manns", "mann" ],
	// Suffix step 1 category b with -nis ending.
	[ "ergebnisse", "ergebnis" ],
	// Suffix step 2 category a (-est)
	[ "nettesten", "nett" ],
	// Suffix step 2 category b (-st)
	[ "liebsten", "lieb" ],
	// Suffix as defined in step 1 (-ern) that is not within the R1.
	[ "kern", "kern" ],
	// Suffix as defined in step 2 (-est) that is not within the R1.
	[ "test", "test" ],
	// A word without an R1.
	[ "so", "so" ],
	// An irregular verb.
	[ "hat", "haben" ],
	// A word with a vowel that should be treated like a consonant
	[ "schreien", "schrei" ],
];

describe( "Test for stemming German words", () => {
	it( "stems German nouns", () => {
		wordsToStem.forEach( wordToStem => expect( stem( morphologyDataDE.verbs, wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
