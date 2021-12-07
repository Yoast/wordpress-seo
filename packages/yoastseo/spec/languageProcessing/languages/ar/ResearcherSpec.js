import Researcher from "../../../../src/languageProcessing/languages/ar/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import getMorphologyData from "../../../specHelpers/getMorphologyData";
import functionWords from "../../../../src/languageProcessing/languages/ar/config/functionWords";
import transitionWords from "../../../../src/languageProcessing/languages/ar/config/transitionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/ar/config/firstWordExceptions";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/ar/config/twoPartTransitionWords";

const morphologyDataAR = getMorphologyData( "ar" );

describe( "a test for Arabic Researcher", function() {
	const researcher = new Researcher( new Paper( "This is another paper!" ) );

	it( "checks if the Arabic Researcher still inherit the Abstract Researcher", function() {
		expect( researcher.getResearch( "getParagraphLength" ) ).toEqual( [ { text: "This is another paper!", countLength: 4 } ] );
	} );

	it( "returns false if the default research is deleted in Arabic Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Arabic Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns true if the Arabic Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getPassiveVoiceResult" ) ).toBe( true );
	} );

	it( "returns the Arabic function words", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords.all );
	} );

	it( "returns the Arabic first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns the Arabic transition words", function() {
		expect( researcher.getConfig( "transitionWords" ) ).toEqual( transitionWords );
	} );

	it( "returns the Arabic two part transition word", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Arabic locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "ar" );
	} );

	it( "returns the Arabic passive construction type", function() {
		expect( researcher.getConfig( "passiveConstructionType" ) ).toEqual( "morphological" );
	} );

	it( "returns the Arabic basic word forms", function() {
		expect( researcher.getHelper( "createBasicWordForms" )( "الرحمن" ) ).toEqual(
			[ "لالرحمن", "بالرحمن", "كالرحمن", "والرحمن", "فالرحمن", "سالرحمن", "أالرحمن", "الالرحمن", "وبالرحمن",
				"ولالرحمن", "للالرحمن", "فسالرحمن", "فبالرحمن", "فلالرحمن", "وسالرحمن", "والالرحمن", "بالالرحمن",
				"فالالرحمن", "كالالرحمن", "وللالرحمن", "وبالالرحمن", "رحمن", "لرحمن", "برحمن", "كرحمن", "ورحمن", "فرحمن",
				"سرحمن", "أرحمن", "الرحمن", "وبرحمن", "ولرحمن", "للرحمن", "فسرحمن", "فبرحمن", "فلرحمن", "وسرحمن", "والرحمن",
				"بالرحمن", "فالرحمن", "كالرحمن", "وللرحمن", "وبالرحمن" ]

		);
	} );

	it( "stems the Arabic word using the Arabic stemmer", function() {
		researcher.addResearchData( "morphology", morphologyDataAR );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "الرحمن" ) ).toEqual( "رحم" );
	} );

	it( "checks if an Arabic sentence is passive or not", function() {
		// Passive verb: يُوازي
		expect( researcher.getHelper( "isPassiveSentence" )( "غير أنه يتعين أن يُوازي ذلك معالجة المسائل العرضية." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "هذا الكتاب كتبه مؤلف مشهور." ) ).toEqual( false );
	} );
} );
