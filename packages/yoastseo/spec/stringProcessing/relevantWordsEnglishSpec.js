import WordCombination from "../../src/values/WordCombination";
import { getRelevantWords } from "../../src/stringProcessing/relevantWords";
import { en as morphologyData } from "../../premium-configuration/data/morphologyData.json";

describe( "gets English word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables.";
		const expected = [
			new WordCombination( "syllables", "syllable", 37 ),
		];

		const words = getRelevantWords( input, [], "en", morphologyData );

		expect( words ).toEqual( expected );
	} );

	it( "also uses morphology", function() {
		const input = "Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. " +
			"Here are a ton of syllables. Here are a ton of syllables. " +
			"Here is one syllable. Here is one syllable. Here is one syllable. Here is one syllable. Here is one syllable. " +
			"Here is one syllable. Here is one syllable. Here is one syllable. Here is one syllable. Here is one syllable.";
		const expected = [
			new WordCombination( "syllable", "syllable", 47 ),
		];

		const words = getRelevantWords( input, [], "en", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

