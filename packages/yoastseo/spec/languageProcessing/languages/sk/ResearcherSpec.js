import Researcher from "../../../../src/languageProcessing/languages/sk/Researcher.js";
import Paper from "../../../../src/values/Paper.js";


describe( "a test for the Slovak Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns the Slovak locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "sk" );
	} );
} );
