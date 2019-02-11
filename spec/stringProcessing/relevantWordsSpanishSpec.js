import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import spanishFunctionWordsFactory from "../../src/researches/spanish/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const spanishFunctionWords = spanishFunctionWordsFactory();

describe( "gets Spanish word combinations", function() {
	it( "returns word combinations", function() {
		const input = "No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una " +
			"tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque " +
			"hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar " +
			"porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a " +
			"trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos " +
			"ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. " +
			"No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de " +
			"nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve.";
		const expected = [
			new WordCombination( [ "tormenta", "de", "nieve" ], 19, spanishFunctionWords.all ),
			new WordCombination( [ "ir", "a", "trabajar" ], 19, spanishFunctionWords.all ),
			new WordCombination( [ "trabajar" ], 19, spanishFunctionWords.all ),
			new WordCombination( [ "tormenta" ], 19, spanishFunctionWords.all ),
			new WordCombination( [ "nieve" ], 19, spanishFunctionWords.all ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "es", spanishFunctionWords );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
