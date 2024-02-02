import Researcher from "../../../../src/languageProcessing/languages/pl/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/pl/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/pl/config/firstWordExceptions";
import stopWords from "../../../../src/languageProcessing/languages/pl/config/stopWords";
import transitionWords from "../../../../src/languageProcessing/languages/pl/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/pl/config/twoPartTransitionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import sentenceLength from "../../../../src/languageProcessing/languages/pl/config/sentenceLength";

const morphologyDataPL = getMorphologyData( "pl" );

describe( "a test for the Polish Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Polish Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in Polish Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Polish Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "syllables" ) ).toBe( false );
	} );

	it( "returns Polish function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Polish first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Polish transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Polish two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Polish stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns Polish sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Polish locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "pl" );
	} );

	it( "returns the Polish passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the Polish stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataPL );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "kotek" ) ).toEqual( "kot" );
	} );

	it( "splits Polish sentence into clauses and checks if the clauses are passive", function() {
		const sentence =  "Ten kot jest szczęśliwy, ponieważ jest kochany.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "Ten kot jest szczęśliwy," );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "ponieważ jest kochany." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toEqual( false );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toEqual( true );
	} );
} );
