import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";
import { de as morphologyData } from "../../premium-configuration/data/morphologyData-de.json";

describe( "gets German word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren." +
			" Probieren geht über Studieren. Probieren geht über Studieren. Probieren geht über Studieren.  Probieren geht über Studieren.";
		const expected = [
			new ProminentWord( "probieren", "probi", 48 ),
			new ProminentWord( "studieren", "studium", 48 ),
		];

		const words = getRelevantWords( input, [], "de", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

