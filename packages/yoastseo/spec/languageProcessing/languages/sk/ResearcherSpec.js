import Researcher from "../../../../src/languageProcessing/languages/sk/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
// const morphologyDataSK = getMorphologyData( "sk" );
// import functionWords from "../../../../src/languageProcessing/languages/sk/config/functionWords";
// import firstWordExceptions from "../../../../src/languageProcessing/languages/sk/config/firstWordExceptions";
// import transitionWords from "../../../../src/languageProcessing/languages/sk/config/transitionWords";
// import twoPartTransitionWords from "../../../../src/languageProcessing/languages/sk/config/twoPartTransitionWords";
// import syllables from "../../../../src/languageProcessing/languages/sk/config/syllables.json";
// import fleschReadingEaseScores from "../../../../src/languageProcessing/languages/sk/config/fleschReadingEaseScores";
// import sentenceLength from "../../../../src/languageProcessing/languages/sk/config/sentenceLength";

describe( "a test for the Slovak Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	// it( "returns true if the Slovak Researcher has a specific research", function() {
	// 	expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	// } );
	//
	// it( "returns false if a specific helper is not available in the Slovak Researcher", function() {
	// 	expect( researcher.getHelper( "getSentenceParts" ) ).toBe( false );
	// } );
	//
	// it( "returns false if a specific config is not available in the Slovak Researcher", function() {
	// 	expect( researcher.getConfig( "stopWordsInKeyword" ) ).toBe( false );
	// } );

	// it( "returns the Slovak function words", function() {
	// 	expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	// } );
	//
	// it( "returns the Slovak first word exceptions", function() {
	// 	expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	// } );
	//
	// it( "returns the Slovak transition words", function() {
	// 	expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	// } );
	//
	// it( "returns the Slovak two part transition word", function() {
	// 	expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	// } );
	//
	// it( "returns the Slovak syllables data", function() {
	// 	expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	// } );
	//
	// // it( "returns the Slovak Flesch reading ease scores and boundaries", function() {
	// 	expect( researcher.getConfig( "fleschReadingEaseScores" ) ).toEqual( fleschReadingEaseScores );
	// } );
	//
	// it( "returns Slovak sentence length config", function() {
	// 	expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	// } );

	it( "returns the Slovak locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "sk" );
	} );

	// it( "returns the Slovak passive construction type", function() {
	// 	expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "" );
	// } );
	//
	// it( "stems a word using the Slovak stemmer", function() {
	// 	researcher.addResearchData( "morphology", morphologyDataSK );
	// 	expect( researcher.getHelper( "getStemmer" )( researcher )( "" ) ).toEqual( "" );
	// } );
	//
	// it( "checks if a Slovak sentence is passive or not", function() {
	// 	expect( researcher.getHelper( "isPassiveSentence" )( "" ) ).toEqual( true );
	// 	expect( researcher.getHelper( "isPassiveSentence" )( "" ) ).toEqual( false );
	// } );

	// it( "calculates the Flesch reading score using the formula for Slovak", function() {
	// 	const testStatistics = {
	// 		numberOfSentences: 10,
	// 		numberOfWords: 50,
	// 		numberOfSyllables: 100,
	// 		averageWordsPerSentence: 5,
	// 		syllablesPer100Words: 200,
	// 	};
	// 	expect( researcher.getHelper( "fleschReadingScore" )( testStatistics ) ).toBe( 80.1 );
	// } );
} );
