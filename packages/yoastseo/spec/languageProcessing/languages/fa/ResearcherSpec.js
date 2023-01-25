import Researcher from "../../../../src/languageProcessing/languages/fa/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/fa/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/fa/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/fa/config/twoPartTransitionWords";
import sentenceLength from "../../../../src/languageProcessing/languages/fa/config/sentenceLength";
import firstWordExceptions from "../../../../src/languageProcessing/languages/fa/config/firstWordExceptions";

describe( "a test for the Farsi Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Farsi Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Farsi Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Farsi Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Farsi function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns the Farsi transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Farsi two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns Farsi sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Farsi first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Farsi locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "fa" );
	} );

	it( "returns the Farsi basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "ماشینهای" ) ).toEqual(
			[ "نماشینهای", "ماشینهای‌ای", "ماشینهایمان", "ماشینهایشان", "ماشینهایتان", "ماشینهایش", "ماشینهایت",
				"ماشینهایم", "ماشینهایی", "ماشینها", "نماشینها", "ماشینهایی", "ماشینهای",
			]
		);
	} );

	it( "returns the Farsi passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "checks if a Farsi sentence is passive or not", function() {
		// Passive verb: خراشیده
		expect( researcher.getHelper( "isPassiveSentence" )( ".پنجره خراشیده است" ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( ".او پنجره را خراش داد" ) ).toEqual( false );
	} );
} );
