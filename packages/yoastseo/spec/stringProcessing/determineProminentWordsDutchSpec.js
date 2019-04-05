import ProminentWord from "../../src/values/ProminentWord";
import { getRelevantWords } from "../../src/stringProcessing/determineProminentWords";

describe( "gets Dutch word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn" +
			" heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen" +
			" met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden." +
			" Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel" +
			" veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel" +
			" veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit" +
			" zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel" +
			" zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel" +
			" veel woorden. Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden." +
			" Dit zijn heel veel zinnen met heel veel woorden. Dit zijn heel veel zinnen met heel veel woorden.";
		const expected = [
			new ProminentWord( "woorden", "woorden", 23 ),
			new ProminentWord( "zinnen", "zinnen", 23 ),
		];

		const words = getRelevantWords( input, [], "nl", false );

		expect( words ).toEqual( expected );
	} );
} );

