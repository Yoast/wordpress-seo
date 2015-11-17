require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");


keywordCountArgs = {
	text: '<img src="plaatje" animation="a bunch of filler texts" alt="keyword" width="100" /> TestText',
	keyword: "keyword"
};

describe("A keyword count test with no keyword in the test, only the alt", function(){
	it("should return no keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(0);
	});
});

keywordCountArgs2 = {
	text: '<img src="plaatje" animation="a bunch of filler texts" alt="keyword" width="100" /> TestText',
	keyword: "width"
};

describe("A keyword count test with no keyword in the test, but keyword is in the tag", function(){
	it("should return no keyword found in the text.", function(){
		var textAnalyzer = Factory.buildAnalyzer(keywordCountArgs2);
		var result = textAnalyzer.keywordCount();
		expect(result).toBe(0);
	});
});


