import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/languages/legacy/stringProcessing/relevantWords";
import indonesianFunctionWordsFactory from "../../src/languages/legacy/researches/indonesian/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const indonesianFunctionWords = indonesianFunctionWordsFactory().all;

describe( "gets Indonesian word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Otak adalah pusat koordinasi dari semua aktivitas linguistik. Otak adalah pusat koordinasi dari " +
			"semua aktivitas linguistik. Otak adalah pusat koordinasi dari semua aktivitas linguistik. Otak adalah pusat" +
			" koordinasi dari semua aktivitas linguistik. Otak adalah pusat koordinasi dari semua aktivitas linguistik. " +
			"Otak adalah pusat koordinasi dari semua aktivitas linguistik. Otak adalah pusat koordinasi dari semua " +
			"aktivitas linguistik. Otak adalah pusat koordinasi dari semua aktivitas linguistik. Otak adalah pusat " +
			"koordinasi dari semua aktivitas linguistik. Otak adalah pusat koordinasi dari semua aktivitas linguistik";


		const expected = [
			new WordCombination( [ "pusat", "koordinasi" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "aktivitas", "linguistik" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "otak" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "pusat" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "koordinasi" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "aktivitas" ], 10, indonesianFunctionWords ),
			new WordCombination( [ "linguistik" ], 10, indonesianFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "id_ID" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
