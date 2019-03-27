import WordCombination from "../../src/values/WordCombination";
import { getRelevantWords } from "../../src/stringProcessing/relevantWords";

describe( "gets Swedish word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet" +
			" för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera med " +
			"människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det vanligaste " +
			"sättet för katten att kommunicera med människor är att jama. Det vanligaste sättet för katten att kommunicera " +
			"med människor är att jama. Det vanligaste sättet för katten att kommunicera med människor är att jama. Det " +
			"vanligaste sättet för katten att kommunicera med människor är att jama.";


		const expected = [
			new WordCombination( "jama", "jama", 8 ),
			new WordCombination( "katten", "katten", 8 ),
			new WordCombination( "kommunicera", "kommunicera", 8 ),
			new WordCombination( "människor", "människor", 8 ),
			new WordCombination( "vanligaste", "vanligaste", 8 ),
		];

		const words = getRelevantWords( input, [], "sv", false );

		expect( words ).toEqual( expected );
	} );
} );
