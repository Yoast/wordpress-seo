import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/stringProcessing/determineProminentWords";
import getMorphologyData from "../specHelpers/getMorphologyData";


const morphologyData = getMorphologyData( "en" ).en;

describe( "gets English prominent words", function() {
	it( "returns  prominent words", function() {
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
			new ProminentWord( "syllables", "syllable", 37 ),
		];

		const words = getProminentWords( input, [], "en", morphologyData );

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
			new ProminentWord( "syllable", "syllable", 47 ),
		];

		const words = getProminentWords( input, [], "en", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

