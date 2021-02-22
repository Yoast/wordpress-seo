import ProminentWord from "../../../../src/values/ProminentWord";
import { getProminentWords } from "../../../../src/languageProcessing/helpers/prominentWords/determineProminentWords";
import Researcher from "../../../../src/languageProcessing/languages/nl/Researcher";

describe( "gets Dutch prominent words", function() {
	it( "returns Dutch prominents words in free", function() {
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
		const researcher = new Researcher();
		const words = getProminentWords( input, [], researcher.getHelper( "getStemmer" )( researcher ), researcher.getConfig( "functionWords" ) );

		expect( words ).toEqual( expected );
	} );
} );

