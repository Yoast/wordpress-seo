import ProminentWord from "../../src/values/ProminentWord";
import { getProminentWords } from "../../src/stringProcessing/helpers/_todo/determineProminentWords";

describe( "gets Dutch prominent words", function() {
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

		const words = getProminentWords( input, [], "nl", false );

		expect( words ).toEqual( expected );
	} );
} );

