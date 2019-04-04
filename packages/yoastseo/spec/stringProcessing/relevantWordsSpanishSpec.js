import WordCombination from "../../src/values/WordCombination";
import { getRelevantWords } from "../../src/stringProcessing/relevantWords";

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
			new WordCombination( "nieve", "nieve", 19 ),
			new WordCombination( "tormenta", "tormenta", 19 ),
			new WordCombination( "trabajar", "trabajar", 19 ),
		];

		const words = getRelevantWords( input, [], "es", false );

		expect( words ).toEqual( expected );
	} );
} );
