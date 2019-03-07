import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import swedishFunctionWordsFactory from "../../src/researches/swedish/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const swedishFunctionWords = swedishFunctionWordsFactory().all;

describe( "gets Swedish word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet" +
			" för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera med " +
			"människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste " +
			"sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera " +
			"med människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det " +
			"vanligaste sättet för katten att kommunicera med människor är att jama.";


		const expected = [
			new WordCombination( [ "kommunicera", "med", "människor" ], 8, swedishFunctionWords ),
			new WordCombination( [ "vanligaste" ], 8, swedishFunctionWords ),
			new WordCombination( [ "katten" ], 8, swedishFunctionWords ),
			new WordCombination( [ "kommunicera" ], 8, swedishFunctionWords ),
			new WordCombination( [ "människor" ], 8, swedishFunctionWords ),
			new WordCombination( [ "jama" ], 8, swedishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "sv_SE" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
