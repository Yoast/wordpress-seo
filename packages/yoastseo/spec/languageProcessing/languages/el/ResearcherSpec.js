import Researcher from "../../../../src/languageProcessing/languages/el/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import firstWordExceptions from "../../../../src/languageProcessing/languages/el/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/el/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/el/config/twoPartTransitionWords";
import functionWords from "../../../../src/languageProcessing/languages/el/config/functionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataEL = getMorphologyData( "el" );

describe( "a test for Greek Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the Greek Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Greek Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Greek Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Greek Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toBe( false );
	} );

	it( "returns the Greek first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions.firstWords );
	} );

	it( "returns the Greek second word exceptions", function() {
		expect( researcher.getConfig( "secondWordExceptions" ) ).toEqual( firstWordExceptions.secondWords );
	} );

	it( "stems the Greek word using the Greek stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataEL );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "αγαπάς" ) ).toEqual( "αγαπ" );
	} );

	it( "returns the Greek transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Greek two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns Greek function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns the Greek passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphologicalAndPeriphrastic" );
	} );

	it( "splits Greek sentence into clauses", function() {
		const sentence = "Το άρθρο είναι γραμμένο και ο συγγραφέας είναι ευχαριστημένος.";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "Το άρθρο είναι γραμμένο" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].isPassive() ).toBe( true );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "ο συγγραφέας είναι ευχαριστημένος." );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toBe( true );
	} );

	it( "checks if a Greek sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "Το σπίτι χτίστηκε από τον πατέρα μου." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Εγώ διπλώνω τα ρούχα." ) ).toEqual( false );
	} );
} );
