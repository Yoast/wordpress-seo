var keywordDensity = require("../../js/analyses/keywordDensity.js");

describe("Test for counting the keywordDensity in a text", function(){
	it("returns keywordDensity", function(){
		expect( keywordDensity("a string of text with the keyword in it, density should be 7.7%", "keyword" ) ).toBe( "7.7" );
	});
});