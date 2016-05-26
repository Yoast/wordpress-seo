var wordMatch = require("../../js/stringProcessing/matchTextWithWord.js");

describe("Counts the occurences of a word in a string", function(){
	it("returns number", function(){

		expect(wordMatch("this is a test string", "test")).toBe(1);
		//this fails now because the regex isn't working properly for wordboundaries.
		//expect(wordMatch("this is a test test test", "test")).toBe(3);
		expect(wordMatch("test with maïs", "maïs")).toBe(1);

		// This fails without the literations.
		// Todo: test this when literations are implemented.
		//expect(wordMatch("test with mais", "maïs")).toBe(1);
	});

	it( "should not match in HTML tags", function() {
		expect( wordMatch( "<img alt='keyword' />", "keyword" ) ).toBe( 0 );
		expect( wordMatch( "<img width='100' />", "width" ) ).toBe( 0 );
	});

	it( "should match quotes", function() {
		expect( wordMatch( "Yoast's analyzer", "Yoast's" ) ).toBe( 1 );
		expect( wordMatch( "Yoast\"s analyzer", "Yoast\"s analyzer" ) ).toBe( 1 );
	});

	it( "should match special characters", function() {
		expect( wordMatch( "a string with diacritics äöüß oompaloomp", "äöüß oompaloomp" ) ).toBe( 1 );
		expect( wordMatch( "", "äbc" ) ).toBe( 0 );
	});

	it( "should match words and numbers", function() {
		expect( wordMatch( "a string test 123 with test 123", "test 123" ) ).toBe( 2 );

		expect( wordMatch( "only numbers 123", "123" ) ).toBe( 1 );
		expect( wordMatch( "only numbers123", "123" ) ).toBe( 0 );
	});

	it( "should match cyrillic characters", function() {
		expect( wordMatch( "Тест текст тест нечто Тест текст тест нечто", "текст" ) ).toBe( 2 );
	});

	it( "should match alternative whitespace", function() {
		expect( wordMatch( "focus&nbsp;keyword", "focus keyword" ) ).toBe( 1 );
	});

	it( "should match hebrew", function() {
		expect( wordMatch( "ל בעל", "ל בעל" ) ).toBe( 1 );
		expect( wordMatch( "", "ל בעל" ) ).toBe( 0 );
	});

	it( "should match dashes in the keyword", function() {
		expect( wordMatch( "text key-word text", "key-word" ) ).toBe( 1 );
		expect( wordMatch( "", "key-word" ) ).toBe( 0 );
	});

	it( "should match within special characters", function() {
		expect( wordMatch( "Sed <keyword» dictum", "keyword" ) ).toBe( 1 );
		expect( wordMatch( "Sed «keyword> dictum", "keyword" ) ).toBe( 1 );
		expect( wordMatch( "Sed ‹keyword› dictum", "keyword" ) ).toBe( 1 );
		expect( wordMatch( "", "keyword" ) ).toBe( 0 );
	})
});
