import Researcher from "../../../../src/languageProcessing/languages/ru/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
const morphologyDataRU = getMorphologyData( "ru" );
import functionWords from "../../../../src/languageProcessing/languages/ru/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/ru/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/ru/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/ru/config/twoPartTransitionWords";
import syllables from "../../../../src/languageProcessing/languages/ru/config/syllables.json";
import fleschReadingEaseScores from "../../../../src/languageProcessing/languages/ru/config/fleschReadingEaseScores";
import sentenceLength from "../../../../src/languageProcessing/languages/ru/config/sentenceLength";

describe( "a test for the Russian Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Russian Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Russian Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if a specific helper is not available in the Russian Researcher", function() {
		expect( researcher.getHelper( "getSentenceParts" ) ).toBe( false );
	} );

	it( "returns false if a specific config is not available in the Russian Researcher", function() {
		expect( researcher.getConfig( "stopWordsInKeyword" ) ).toBe( false );
	} );

	it( "returns the Russian function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Russian first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Russian transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Russian two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Russian syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the Russian Flesch reading ease scores and boundaries", function() {
		expect( researcher.getConfig( "fleschReadingEaseScores" ) ).toEqual( fleschReadingEaseScores );
	} );

	it( "returns Russian sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Russian locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "ru" );
	} );

	it( "returns the Russian passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "stems a word using the Russian stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataRU );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "труднейш" ) ).toEqual( "трудн" );
	} );

	it( "checks if a Russian sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "В этой нише представлены, по сути," +
			" две основные компании ― Tyan и Supermicro." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Мы представили себе, что бы могло произойти." ) ).toEqual( false );
	} );

	it( "calculates the Flesch reading score using the formula for Russian", function() {
		const testStatistics = {
			numberOfSentences: 10,
			numberOfWords: 50,
			numberOfSyllables: 100,
			averageWordsPerSentence: 5,
			syllablesPer100Words: 200,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( testStatistics ) ).toBe( 80.1 );
	} );
} );
