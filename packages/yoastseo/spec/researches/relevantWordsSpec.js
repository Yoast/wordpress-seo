import relevantWordsResearch from "../../src/researches/relevantWords";
import Paper from "../../src/values/Paper";
import WordCombination from "../../src/values/WordCombination";

import functionWordsFactory from "../../src/researches/english/functionWords.js";
const functionWords = functionWordsFactory().all;

describe( "relevantWords research", function() {
	it( "calls through to the string processing function", function() {
		let input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. Syllable combinations for the win!";
		input = new Paper( input );
		const expected = [
			new WordCombination( [ "syllable", "combinations" ], 2, functionWords ),
			new WordCombination( [ "syllables" ], 2, functionWords ),
			new WordCombination( [ "syllable" ], 2, functionWords ),
			new WordCombination( [ "combinations" ], 2, functionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = relevantWordsResearch( input );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
