import Researcher from "../../../../src/languageProcessing/languages/fr/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/fr/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/fr/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/fr/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/fr/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/fr/config/stopWords";
import syllables from "../../../../src/languageProcessing/languages/fr/config/syllables.json";
const morphologyDataFR = getMorphologyData( "fr" );

describe( "a test for the French Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the French Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Farsi Researcher", function() {
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns French function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the French first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the French transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the French two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the French syllables data", function() {
		expect( researcher.getConfig( "syllables" ) ).toEqual( syllables );
	} );

	it( "returns the French stop words", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the French locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "fr" );
	} );

	it( "returns the French passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "stems a word using the French stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataFR );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "chats" ) ).toEqual( "chat" );
	} );

	it( "splits French sentence into clauses and checks if the clauses are passive", function() {
		const sentence =  "Le chat est mignon et il est aimé.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "est mignon" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "est aimé." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toEqual( false );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toEqual( true );
	} );

	it( "calculates the Flesch reading score using the formula for French", function() {
		const statistics = {
			numberOfWords: 400,
			numberOfSyllables: 600,
			numberOfSentences: 20,
		};
		expect( researcher.getHelper( "fleschReadingScore" )( statistics ) ).toBe( 76.3 );
	} );
} );
