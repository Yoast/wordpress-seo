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

	it( "returns the correct array of words from a text containing a lot of punctuation", function() {
		const words = getWords( "A sentence—with words. And some; punctuation." );

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

	it( "doesn't remove punctuation when doRemovePunctuation is false.", () => {
		const text = "A sentence with words. And some; punctuation.";
		const words = getWords( text, "[\\s\\u2013\\u002d]", false );

		expect( words ).toEqual( [
			"A",
			"sentence",
			"with",
			"words",
			".",
			"And",
			"some",
			";",
			"punctuation",
			".",
		] );
	} );

	it( "doesn't return non-breaking space &nbsp; in the result", () => {
		const text = "<p>Sri Tandjung noted that Javanese had been eating cooked (native black) soybeans since the 12th&nbsp;century.</p>\n";

		expect( getWords( text ) ).toEqual(  [ "Sri", "Tandjung", "noted", "that", "Javanese", "had", "been", "eating", "cooked", "native", "black",
			"soybeans", "since", "the", "12th", "century" ] );
	} );

	it( "gets words from text containing html tags", function() {
		const text = "<p>A very intelligent cat loves their human. A dog is very cute.</p><h3>A subheading 3" +
			"</h3>text text text<h4>A subheading 4</h4>more text.";
		expect( getWords( text ).length ).toBe( 23 );
		expect( getWords( text ) ).toEqual( [ "A", "very", "intelligent", "cat", "loves", "their", "human", "A", "dog",
			"is", "very", "cute", "A", "subheading", "3", "text", "text", "text", "A", "subheading", "4", "more", "text" ] );
	} );

	it( "gets words when a non-default word boundary regex is used (words should be split on spaces, hyphens, and en-dashes)", function() {
		const text = "Exercise is good for your cat's well-being but giving too many treats post–exercise is not";
		expect( getWords( text, "[\\s\\u2013\\u002d]" ).length ).toBe( 17 );
		expect( getWords( text, "[\\s\\u2013\\u002d]" ) ).toEqual( [ "Exercise", "is", "good",
			"for", "your", "cat's", "well", "being", "but", "giving", "too", "many", "treats", "post", "exercise", "is", "not" ] );
	} );

	it( "gets words when a non-default word boundary regex is used (words should be split on spaces and en-dashes)", function() {
		const text = "Exercise is good for your cat's well-being but giving too many treats post–exercise is not";
		expect( getWords( text, "[\\s\\u2013]" ).length ).toBe( 16 );
		expect( getWords( text, "[\\s\\u2013]" ) ).toEqual( [ "Exercise", "is", "good",
			"for", "your", "cat's", "well-being", "but", "giving", "too", "many", "treats", "post", "exercise", "is", "not" ] );
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
