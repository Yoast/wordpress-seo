import Researcher from "../../../../src/languageProcessing/languages/cs/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/cs/config/functionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import transitionWords from "../../../../src/languageProcessing/languages/cs/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/cs/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/cs/config/twoPartTransitionWords";
import stopWords from "../../../../src/languageProcessing/languages/cs/config/stopWords";

const morphologyDataCS = getMorphologyData( "cs" );

describe( "a test for the Czech Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Czech Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Czech Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns Czech function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns Czech transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns Czech two-part transition words words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns Czech first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns Czech stopwords", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the Czech locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "cs" );
	} );

	it( "stems the Czech word using the Czech stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataCS );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "mezinárodního" ) ).toEqual( "mezinárod" );
	} );

	it( "returns the Czech passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "splits Czech sentence into clauses and checks their passiveness", function() {
		const sentence =  "byla kočka adoptována nebo byla koupena?";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "byla kočka adoptována" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "nebo byla koupena?" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toBe( true );
	} );
} );

