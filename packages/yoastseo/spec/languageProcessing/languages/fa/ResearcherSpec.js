import Researcher from "../../../../src/languageProcessing/languages/fa/Researcher.js";
import Paper from "../../../../src/values/Paper.js";

describe( "a test for the Farsi Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );
	const farsiFunctionWordExamples = [ "چهار", "سوم", "به آنها", "خودم", "برای", "اردیبهشت", "مخصوصاً" ];

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Farsi Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Farsi Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Farsi Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Farsi function words", function() {
		expect( researcher.getConfig( "functionWords" )().all ).toEqual( expect.arrayContaining( farsiFunctionWordExamples ) );
	} );

	it( "returns the Farsi locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "fa" );
	} );

	it( "returns the Farsi basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "ماشینهای" ) ).toEqual(
			[ "نماشینهای", "ماشینهای‌ای", "ماشینهایمان", "ماشینهایشان", "ماشینهایتان", "ماشینهایش", "ماشینهایت",
				"ماشینهایم", "ماشینهایی", "ماشینها", "نماشینها", "ماشینهایی", "ماشینهای",
			]
		);
	} );
} );
