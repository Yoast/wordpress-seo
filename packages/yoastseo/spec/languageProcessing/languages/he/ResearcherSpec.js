import Researcher from "../../../../src/languageProcessing/languages/he/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/he/config/functionWords";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import transitionWords from "../../../../src/languageProcessing/languages/he/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/he/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/he/config/twoPartTransitionWords";
import sentenceLength from "../../../../src/languageProcessing/languages/he/config/sentenceLength";

const morphologyDataHE = getMorphologyData( "he" );

describe( "a test for the Hebrew Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Hebrew Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Hebrew Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
		expect( researcher.getResearch( "wordComplexity" ) ).toBe( false );
	} );

	it( "returns false if the Hebrew Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Hebrew function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "returns Hebrew transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns Hebrew two-part transition words words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns Hebrew first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns Hebrew sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Hebrew locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "he" );
	} );

	it( "returns the Hebrew passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "returns the Hebrew basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "והוא" ) ).toEqual(
			[ "בוהוא", "הוהוא", "ווהוא", "כוהוא", "לוהוא", "מוהוא", "שוהוא", "הוא", "בהוא", "ההוא", "והוא", "כהוא", "להוא", "מהוא", "שהוא" ]
		);
	} );

	it( "returns the original word through the base stemmer", function() {
		expect( researcher.getHelper( "getStemmer" )( researcher )( "ווהוא" ) ).toEqual( "ווהוא" );
	} );

	it( "stems the Hebrew word using the Hebrew stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataHE );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "באהבה" ) ).toEqual( "אהב" );
	} );

	it( "checks if a Hebrew sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "התפוח נאכל על ידי הילדה." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "הוא הקריא ספר." ) ).toEqual( false );
	} );
} );
