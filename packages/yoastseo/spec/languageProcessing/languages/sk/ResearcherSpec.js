import Researcher from "../../../../src/languageProcessing/languages/sk/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import stopWords from "../../../../src/languageProcessing/languages/sk/config/stopWords";
import { allWords as transitionWords } from "../../../../src/languageProcessing/languages/sk/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/sk/config/twoPartTransitionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" );


describe( "a test for the Slovak Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns the Slovak locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "sk" );
	} );

	it( "returns Slovak stopwords", function() {
		expect( researcher.getConfig( "stopWords" ) ).toEqual( stopWords );
	} );

	it( "returns the Slovak passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "periphrastic" );
	} );

	it( "splits Slovak sentence into clauses and checks their passiveness", function() {
		const sentence =  "bola mačka adoptované alebo bola kúpená?";
		expect( researcher.getHelper( "getClauses" )( sentence )[ 0 ].getClauseText() ).toBe( "bola mačka adoptované" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].getClauseText() ).toBe( "alebo bola kúpená?" );
		expect( researcher.getHelper( "getClauses" )( sentence )[ 1 ].isPassive() ).toBe( true );
	} );

	it( "returns the Slovak transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Slovak two part transition words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "stems the Slovak word using the Slovak stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataSK );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "teplého" ) ).toEqual( "tep" );
	} );
} );
