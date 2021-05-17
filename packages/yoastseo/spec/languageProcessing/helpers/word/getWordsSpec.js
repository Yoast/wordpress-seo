import getWords from "../../../../src/languageProcessing/helpers/word/getWords";

describe( "a test for getting words from a sentence", function() {
	it( "returns an empty array", function() {
		expect( getWords( "" ).length ).toBe( 0 );
	} );

	it( "returns an array without html", function() {
		const words = getWords( "<strong>strong</strong> and <em>emphasized</em>" );

		expect( words[ 0 ] ).toBe( "strong" );
		expect( words[ 1 ] ).toBe( "and" );
		expect( words[ 2 ] ).toBe( "emphasized" );
	} );

	it( "returns an array without the space comma", function() {
		const words = getWords( "strong , emphasized" );

		expect( words[ 0 ] ).toBe( "strong" );
		expect( words[ 1 ] ).toBe( "emphasized" );
	} );

	it( "returns the correct array of words from a text containing a lot of punctuations", function() {
		const words = getWords( "A sentence with words. And some; punctuation." );

		expect( words ).toEqual( [
			"A",
			"sentence",
			"with",
			"words",
			"And",
			"some",
			"punctuation",
		] );
	} );

	it( "does not do anything with repetitions", function() {
		const words = getWords( "A sentence sentence, sentence! Sentence with words." );

		expect( words ).toEqual( [
			"A",
			"sentence",
			"sentence",
			"sentence",
			"Sentence",
			"with",
			"words",
		] );
	} );
} );

describe( "language-specific tests for getting words", function() {
	it( "returns words without special Arabic punctuation marks: ،؟؛", function() {
		const words = getWords( "ما هي المقالات الجيدة؟ السلطان خوارزمشاه، وعدم تنسيق سبل المقاومة،" +
			" كانت كلها أسبابًا لفشل ذلك الصمود. جدول قواسم الأعداد من 1 إلى العدد 1000؛ وقاسم" );

		expect( words ).toEqual( [
			"ما",
			"هي",
			"المقالات",
			"الجيدة",
			"السلطان",
			"خوارزمشاه",
			"وعدم",
			"تنسيق",
			"سبل",
			"المقاومة",
			"كانت",
			"كلها",
			"أسبابًا",
			"لفشل",
			"ذلك",
			"الصمود",
			"جدول",
			"قواسم",
			"الأعداد",
			"من",
			"1",
			"إلى",
			"العدد",
			"1000",
			"وقاسم",
		] );
	} );

	it( "returns words without special Urdu punctuation marks: ۔", function() {
		const words = getWords( "اس دوران میں وہ حملے کرتے رہے اور آخرکار شکست کھا گئے۔"	);

		expect( words ).toEqual( [
			"اس",
			"دوران",
			"میں",
			"وہ",
			"حملے",
			"کرتے",
			"رہے",
			"اور",
			"آخرکار",
			"شکست",
			"کھا",
			"گئے",
		] );
	} );
} );
