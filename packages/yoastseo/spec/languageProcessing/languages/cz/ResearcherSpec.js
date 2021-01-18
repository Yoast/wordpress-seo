import Researcher from "../../../../src/languageProcessing/languages/cz/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataFR = getMorphologyData( "cz" );

describe( "a test for the French Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "stems a word using the Czech stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataCZ );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "kočky" ) ).toEqual( "kočka" );
	} );

} );
