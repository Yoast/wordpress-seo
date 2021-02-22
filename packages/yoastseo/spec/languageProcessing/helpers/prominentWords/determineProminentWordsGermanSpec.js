import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/languageProcessing/helpers/prominentWords/determineProminentWords";
import getMorphologyData from "../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "de" ).de;

describe( "gets German prominent words", function() {
	it( "returns prominent words", function() {
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

		const words = getProminentWords( input, [], "de", morphologyData );

		expect( words ).toEqual( expected );
	} );
} );

