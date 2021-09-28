import Researcher from "../../../../src/languageProcessing/languages/el/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import transitionWords from "../../../../src/languageProcessing/languages/el/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/el/config/twoPartTransitionWords";

describe( "a test for Greek Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the Greek Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Greek Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Greek Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Greek Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toBe( false );
	} );

	it( "doesn't stem word if the basic stemmer is used in the Researcher", function() {
		expect( researcher.getHelper( "getStemmer" )()( "γάτες" ) ).toBe( "γάτες" );
	} );

	it( "returns the Greek transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Greek two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

} );
