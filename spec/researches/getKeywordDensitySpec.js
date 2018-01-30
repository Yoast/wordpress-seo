var keywordDensity = require("../../js/researches/getKeywordDensity.js");
var Paper = require( "../../js/values/Paper.js" );

describe("Test for counting the keyword density in a text", function(){
	it("returns keyword density", function(){
		var mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%", {keyword: "keyword"} );
		expect( keywordDensity(mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text without the keyword in it, density should be 0%", {keyword: "empty"} );
		expect( keywordDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", {keyword: "äöüß"} );
		expect( keywordDensity( mockPaper ) ).toBe( 9.090909090909092 );
		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit ", {keyword: "key-word"} );
		expect( keywordDensity( mockPaper  ) ).toBe( 9.090909090909092 );
		mockPaper = new Paper( "a string of text with the kapaklı in it, density should be 7.7%", {keyword: "kapaklı"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 7.7%", {keyword: "key-word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 7.7%", {keyword: "key_word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 0.0%", {keyword: "key word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 0.0%", {keyword: "key word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 0 );
		mockPaper = new Paper( "a string of text with the key&word in it, density should be 7.7%", {keyword: "key&word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "<img src='http://image.com/image.png'>", {keyword: "key&word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 0 );
		// consecutive keywords are skipped, so this will match 2 times.
		mockPaper = new Paper( "This is a nice string with a keyword keyword keyword.", {keyword: "keyword"} );
		expect( keywordDensity( mockPaper ) ).toBe( 20 );
		mockPaper = new Paper( "a string of text with the $keyword in it, density should be 7.7%", {keyword: "$keyword"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the Keyword in it, density should be 7.7%", {keyword: "keyword"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
		mockPaper = new Paper( "a string of text with the Key word in it, density should be 7.14%", {keyword: "key word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.142857142857142 );

		mockPaper = new Paper( "a string with quotes to match the key'word, even if the quotes differ", {keyword: "key’word"} );
		expect( keywordDensity( mockPaper ) ).toBe( 7.6923076923076925 );
	});
});
