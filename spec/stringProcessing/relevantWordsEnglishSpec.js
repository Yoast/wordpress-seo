import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/relevantWords";
import englishFunctionWordsFactory from "../../src/researches/english/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const englishFunctionWords = englishFunctionWordsFactory().all;

describe( "gets English word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. ";
		const expected = [
			new WordCombination( [ "syllables" ], 37, englishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "en_US" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );

