require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var stringhelperArgs = {
		words: ["a","abc","abcdef"],
		textString: "abc"
	};

describe("a test to match a word in a string", function(){
	it("should match 'abc'", function(){
		var stringHelper = new YoastSEO.StringHelper();
		var regex = stringHelper.stringToRegex( stringhelperArgs.words );
		var result = stringhelperArgs.textString.match( regex );
		expect(result[0]).toBe("abc");
	});
});
