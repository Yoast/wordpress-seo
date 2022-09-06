import Researcher from "../../../../src/languageProcessing/languages/pt/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/pt/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/pt/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/pt/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/pt/config/twoPartTransitionWords";
import syllables from "../../../../src/languageProcessing/languages/pt/config/syllables.json";
import stopWords from "../../../../src/languageProcessing/languages/pt/config/stopWords";
const morphologyDataPT = getMorphologyData( "pt" );
import sentenceLength from "../../../../src/languageProcessing/languages/pt/config/sentenceLength";

describe( "a test for the Portuguese Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Portuguese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Portuguese Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns Portuguese function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Portuguese first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Portuguese transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Portuguese two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns a specified part of the Portuguese syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the Portuguese stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns Portuguese sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Portuguese locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "pt" );
	} );

	it( "returns the Portuguese passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the Portuguese stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataPT );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "gatas" ) ).toEqual( "gat" );
	} );

	it( "splits Portuguese sentence into clauses", function() {
		let sentence =  "Eles eram três amigos quando os conheci.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "eram três amigos" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( false );

		sentence = "Os gatos são amados.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "são amados." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( true );
	} );

	it( "calculates the Flesch reading score using the formula for Portuguese", function() {
		const statistics = {
			numberOfWords: 600,
			numberOfSyllables: 1200,
			averageWordsPerSentence: 19,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 60.4 );
	} );
} );
