import Researcher from "../../../../src/languageProcessing/languages/sk/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" );


describe( "a test for the Slovak Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns the Slovak locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "sk" );
	} );

	it( "stems the Slovak word using the Slovak stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataSK );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "teplého" ) ).toEqual( "tep" );
	} );
} );
