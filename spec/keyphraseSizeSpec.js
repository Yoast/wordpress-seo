require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var keyphraseSizeArgs = {
	keyword: "keyword"
};

describe("a test to determine the number of words of the keyphrase", function(){
	it("returns the number of words found in the textstring", function(){
		keyphraseSizeAnalyzer = Factory.buildAnalyzer(keyphraseSizeArgs);
		var result = keyphraseSizeAnalyzer.keyphraseSizeCheck();
		expect(result[0].result).toBe(1);
	});
});

var keyphraseSizeArgs2 = {
	keyword: "a very long keyword phrase"
};

describe("a test to determine the number of words of the keyphrase", function(){
	it("returns the number of words found in the textstring", function(){
		keyphraseSizeAnalyzer = Factory.buildAnalyzer(keyphraseSizeArgs2);
		var result = keyphraseSizeAnalyzer.keyphraseSizeCheck();
		expect(result[0].result).toBe(5);
	});
});