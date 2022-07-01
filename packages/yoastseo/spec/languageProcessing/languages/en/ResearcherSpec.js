import Researcher from "../../../../src/languageProcessing/languages/en/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/en/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/en/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/en/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/en/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/en/config/stopWords";
import syllables from "../../../../src/languageProcessing/languages/en/config/syllables.json";
import frequencyList from "../../../../src/languageProcessing/languages/en/config/frequencyList.json";
const morphologyDataEN = getMorphologyData( "en" );

describe( "a test for the English Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the English Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns the English function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the English first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the English transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the English two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the English syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the English stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the English locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "en" );
	} );

	it( "returns the English passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "returns the English word complexity configs", function() {
		expect( researcher.getConfig( "wordComplexity" ).frequencyList ).toEqual( frequencyList.list );
		expect( researcher.getConfig( "wordComplexity" ).wordLength ).toEqual( 7 );
		expect( researcher.getConfig( "wordComplexity" ).doesUpperCaseDecreasesComplexity ).toEqual( true );
	} );

	it( "stems a word using the English stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataEN );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "cats" ) ).toEqual( "cat" );
	} );

	it( "splits English sentence into clauses and checks if the clauses are passive or not.", function() {
		let sentence =  "The English are still having a party.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "are still" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "having a party." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( false );

		sentence = "The cats are adored.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "are adored." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( true );
	} );

	it( "calculates the Flesch reading score using the formula for English", function() {
		const statistics = {
			numberOfWords: 400,
			numberOfSyllables: 800,
			averageWordsPerSentence: 20,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 17.3 );
	} );
} );
