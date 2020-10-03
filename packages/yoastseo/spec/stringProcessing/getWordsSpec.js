import getWords from "../../src/researches/stringProcessing/getWords";

describe( "a test getting words from a sentence", function() {
	it( "returns an empty array", function() {
		expect( getWords( "" ).length ).toBe( 0 );
	} );

	it( "returns an array without html", function() {
		var words = getWords( "<strong>strong</strong> and <em>emphasized</em>" );

		expect( words[ 0 ] ).toBe( "strong" );
		expect( words[ 1 ] ).toBe( "and" );
		expect( words[ 2 ] ).toBe( "emphasized" );
	} );

	it( "returns an array without the space comma", function() {
		var words = getWords( "strong , emphasized" );

		expect( words[ 0 ] ).toBe( "strong" );
		expect( words[ 1 ] ).toBe( "emphasized" );
	} );

	it( "returns the correct array of words with a ton of punctuation", function() {
		var words = getWords( "A sentence with words. And some; punctuation." );

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
		var words = getWords( "A sentence sentence, sentence! Sentence with words." );

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
		const words = getWords( "ما هي المقالات الجيدة؟ السلطان خوارزمشاه، وعدم تنسيق سبل المقاومة، كانت كلها أسبابًا لفشل ذلك الصمود. جدول قواسم الأعداد من 1 إلى العدد 1000؛ وقاسم" );

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
