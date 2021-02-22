import ProminentWord from "../../../../src/values/ProminentWord";
import { getProminentWords } from "../../../../src/languageProcessing/helpers/prominentWords/determineProminentWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";

const morphologyData = getMorphologyData( "en" );
const researcher = new Researcher();
researcher.addResearchData( "morphology", morphologyData );

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

		const words = getProminentWords( input, [],  researcher.getHelper( "getStemmer" )( researcher ), researcher.getConfig( "functionWords" ) );

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

		const words = getProminentWords( input, [],  researcher.getHelper( "getStemmer" )( researcher ), researcher.getConfig( "functionWords" ) );

		expect( words ).toEqual( expected );
	} );
} );

