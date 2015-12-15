var keywordDensity = require("../../js/analyses/getKeywordDensity.js");

describe("Test for counting the keywordDensity in a text", function(){
	it("returns keywordDensity", function(){
		expect( keywordDensity("a string of text with the keyword in it, density should be 7.7%", "keyword" ) ).toBe( "7.7" );
		expect( keywordDensity("a string of text without the keyword in it, density should be 0%", "empty" ) ).toBe( "0.0" );
		expect( keywordDensity("Waltz keepin auf mitz auf keepin äöüß weiner blitz deutsch spitzen. ", "äöüß" ) ).toBe("9.1");
		expect( keywordDensity("Lorem ipsum dolor sit amet, key word consectetur key-word adipiscing elit", "key-word" ) ).toBe("9.1");
	});
});
