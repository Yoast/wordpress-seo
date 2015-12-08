var urlKeyword = require("../../js/analyses/urlKeyword");

describe("test to check url for keyword", function(){
	it("returns matches", function(){
		expect( urlKeyword( "url-with-keyword", "keyword" ) ).toBe(1);
		expect( urlKeyword( "url-with-key-word", "key word" ) ).toBe(1);
		expect( urlKeyword( "url-with-key-word", "keyword" ) ).toBe(0);
		expect( urlKeyword( "url-with-key-word", "këy word" ) ).toBe(0);
	});
});