var urlKeyword = require("../../js/analyses/countKeywordInUrl.js");

describe("test to check url for keyword", function(){
	it("returns matches", function(){
		expect( urlKeyword( "url-with-keyword", "keyword" ) ).toBe(1);
		expect( urlKeyword( "url-with-key-word", "key word" ) ).toBe(1);
		expect( urlKeyword( "url-with-key-word", "keyword" ) ).toBe(0);
		expect( urlKeyword( "url-with-key-word", "këyword" ) ).toBe(0);
	});
});