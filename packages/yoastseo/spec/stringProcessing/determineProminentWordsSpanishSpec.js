import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";

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
			new ProminentWord( "nieve", "nieve", 19 ),
			new ProminentWord( "tormenta", "tormenta", 19 ),
			new ProminentWord( "trabajar", "trabajar", 19 ),
		];

		const words = getRelevantWords( input, [], "es", false );

		expect( words ).toEqual( expected );
	} );
} );
