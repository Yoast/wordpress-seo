import Researcher from "../../../../src/languageProcessing/languages/ca/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import sentenceLength from "../../../../src/languageProcessing/languages/ca/config/sentenceLength";
import transitionWords from "../../../../src/languageProcessing/languages/ca/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/ca/config/twoPartTransitionWords";

describe( "a test for the Catalan Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Catalan Researcher has a specific research", function() {
		expect( researcher.hasResearch( "findTransitionWords" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Catalan Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Catalan Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Catalan Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Catalan sentence length", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns Catalan transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns Catalan two-part transition words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Catalan locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "ca" );
	} );

	it( "doesn't stem the Catalan word as the Catalan stemmer is not yet available", function() {
		expect( researcher.getHelper( "getStemmer" )()( "gats" ) ).toEqual( "gats" );
	} );
} );
