import {
	calculateTotalNumberOfSyllables,
	removeEnding,
	checkBeginningsList,
} from "../../../../../../src/languageProcessing/languages/id/helpers/internal/stemHelpers";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "id" ).id;

describe( "a test to calculate the total number of syllables in the input word", function() {
	it( "returns the total number of syllables in the word", function() {
		expect( calculateTotalNumberOfSyllables( "menyalakan" ) ).toBe( 4 );
	} );
} );

describe( "a test for removing word endings", function() {
	const endingsRegex1 = [ [ "(ku|mu|nya)$", "" ] ];
	const exceptions = [ "bangku", "tanya", "tamu" ];
	it( "returns the word without ending: input word is not in the exception", function() {
		expect( removeEnding( "kucingku", endingsRegex1, exceptions, morphologyData ) ).toBe( "kucing" );
	} );

	it( "returns the word without ending: input word is in the exception", function() {
		expect( removeEnding( "bangku", endingsRegex1, exceptions, morphologyData ) ).toBe( "bangku" );
	} );

	const endingsRegex2 = [ [ "(kan|an|i)$", "" ] ];
	it( "returns the word without ending: input word ends in -kan", function() {
		expect( removeEnding( "tunaikan", endingsRegex2, exceptions, morphologyData ) ).toBe( "tunai" );
		expect( removeEnding( "anakan", endingsRegex2, exceptions, morphologyData ) ).toBe( "anak" );
	} );
} );

describe( "a test for checking if the beginning of the word is present in an exception list", function() {
	const exceptionList = [ "aba", "angkap", "atap" ];
	it( "returns the word without ending", function() {
		expect( checkBeginningsList( "meraba", 3, exceptionList ) ).toBe( true );
	} );
} );
