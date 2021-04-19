import relevantWordsResearch from "../../src/researches/relevantWords";
import Paper from "../../src/values/Paper";
import WordCombination from "../../src/values/WordCombination";

import functionWordsFactory from "../../src/researches/english/functionWords.js";
const functionWords = functionWordsFactory().all;

describe( "relevantWords research", function() {
	it( "returns no relevant words for short texts under 400 words", function() {
		let input = "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are even more important. Syllable combinations for the win!";
		input = new Paper( input );

		const expected = {
			prominentWords: [],
			hasMetaDescription: false,
			hasTitle: false,
		};

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = relevantWordsResearch( input );

		expect( words ).toEqual( expected );
	} );

	it( "calls through to the string processing function", function() {
		let input = ( "Here are a ton of syllables. Syllables are very important. I think the syllable combinations are " +
			"even more important. Syllable combinations for the win!" ).repeat( 30 );
		input = new Paper( input );
		const expected = {
			prominentWords: [
				new WordCombination( [ "syllable", "combinations", "for", "the", "win" ], 30, functionWords ),
				new WordCombination( [ "syllable", "combinations" ], 60, functionWords ),
				new WordCombination( [ "combinations", "for", "the", "win" ], 30, functionWords ),
				new WordCombination( [ "syllables" ], 60, functionWords ),
				new WordCombination( [ "syllable" ], 60, functionWords ),
				new WordCombination( [ "combinations" ], 60, functionWords ),
				new WordCombination( [ "win" ], 30, functionWords ),
			],
			hasMetaDescription: false,
			hasTitle: false,
		};

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = relevantWordsResearch( input );
		words.prominentWords.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
