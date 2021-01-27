import Researcher from "../../../../src/languageProcessing/languages/he/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import sentenceLength from "../../../../src/languageProcessing/languages/he/config/sentenceLength";

describe( "a test for the Hebrew Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );
	const functionWordExamplesHebrew = [ "ראשון", "ראשונה", "שני", "שניה", "שלישי", "שלישית", "רביעי", "רביעית", "חמישי",
		"חמישית", "ששי", "ששית", "שביעי", "שביעית", "שמיני", "שמינית", "תשיעי", "תשיעית", "עשירי", "עשירית" ];

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Hebrew Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Hebrew Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Hebrew Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Hebrew function words", function() {
		expect( researcher.getConfig( "functionWords" )().all ).toEqual( expect.arrayContaining( functionWordExamplesHebrew ) );
	} );

	it( "returns Hebrew sentence length config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toEqual( sentenceLength );
	} );

	it( "returns the Hebrew locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "he" );
	} );

	it( "returns the Hebrew basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "והוא" ) ).toEqual(
			[ "בוהוא", "הוהוא", "ווהוא", "כוהוא", "לוהוא", "מוהוא", "שוהוא", "הוא", "בהוא", "ההוא", "והוא", "כהוא", "להוא", "מהוא", "שהוא" ]
		);
	} );

	it( "returns the original word through the base stemmer", function() {
		expect( researcher.getHelper( "getStemmer" )( "ווהוא" ) ).toEqual( "ווהוא" );
	} );
} );
