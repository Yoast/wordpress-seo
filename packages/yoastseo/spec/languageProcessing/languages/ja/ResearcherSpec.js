import Researcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/ja/config/functionWords";

describe( "a test for Japanese Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the Japanese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Japanese Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "doesn't stem word if the Japanese Researcher is used", function() {
		expect( researcher.getHelper( "getStemmer" )()( "食べる" ) ).toBe( "食べる" );
	} );
} );
