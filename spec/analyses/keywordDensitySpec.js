var keywordDensity = require("../../js/researches/getKeywordDensity.js");
var Paper = require( "../../js/values/Paper.js" );

describe("Test for counting the keywordDensity in a text", function(){
	it("returns keywordDensity", function(){
		var mockPaper = new Paper( "a string of text with the keyword in it, density should be 7.7%", {keyword: "keyword"} );
		expect( keywordDensity(mockPaper ) ).toBe( "7.7" );
		mockPaper = new Paper( "a string of text without the keyword in it, density should be 0%", {keyword: "empty"} );
		expect( keywordDensity( mockPaper ) ).toBe( "0.0" );
		mockPaper = new Paper( "Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", {keyword: "äöüß"} );
		expect( keywordDensity( mockPaper ) ).toBe("9.1");
		mockPaper = new Paper( "Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit ", {keyword: "key-word"} );
		expect( keywordDensity( mockPaper  ) ).toBe("9.1");
		mockPaper = new Paper( "a string of text with the kapaklı in it, density should be 7.7%", {keyword: "kapaklı"} );
		expect( keywordDensity( mockPaper ) ).toBe( "7.7" );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 7.7%", {keyword: "key-word"} );
		expect( keywordDensity( mockPaper ) ).toBe( "7.7" );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 7.7%", {keyword: "key_word"} );
		expect( keywordDensity( mockPaper ) ).toBe( "7.7" );
		mockPaper = new Paper( "a string of text with the key_word in it, density should be 0.0%", {keyword: "key word"} );
		expect( keywordDensity( mockPaper ) ).toBe( "0.0" );
		mockPaper = new Paper( "a string of text with the key-word in it, density should be 0.0%", {keyword: "key word"} );
		expect( keywordDensity( mockPaper ) ).toBe( "0.0" );
		mockPaper = new Paper( "a string of text with the key&word in it, density should be 7.7%", {keyword: "key&word"} );
		expect( keywordDensity( mockPaper ) ).toBe( "7.7" );
	});
});
