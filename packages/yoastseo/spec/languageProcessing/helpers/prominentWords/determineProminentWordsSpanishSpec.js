import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/languageProcessing/helpers/prominentWords/determineProminentWords";

describe( "gets Spanish prominent words", function() {
	it( "returns prominent words", function() {
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

		const words = getProminentWords( input, [], "es", false );

		expect( words ).toEqual( expected );
	} );
} );
