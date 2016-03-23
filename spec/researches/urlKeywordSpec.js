var urlKeyword = require("../../js/researches/keywordCountInUrl.js");
var Paper = require( "../../js/values/Paper.js" );

describe("test to check url for keyword", function() {
	it("returns matches", function() {

		expect( urlKeyword(
			new Paper( "", { url: "url-with-keyword", keyword: "keyword" } )
		) ).toBe(1);

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "key word" } )
		) ).toBe(1);

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "keyword" } )
		) ).toBe(0);

		expect( urlKeyword(
			new Paper( "", { url: "url-with-key-word", keyword: "këyword" } )
		) ).toBe(0);

		expect( urlKeyword(
			new Paper( "", { url: "url-with-yoast-seo-3", keyword: "yoast seo 3" } )
		) ).toBe(1);

		expect( urlKeyword(
			new Paper( "", { url: "yoasts-analyzer", keyword: "Yoast's analyzer" } )
		) ).toBe( 1 );
	});
});
