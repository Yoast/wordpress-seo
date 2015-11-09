require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

var metaArgs = {
	keyword: "keyword",
	meta: "this is the metadescription that contains a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
	it("returns a match for the keyword", function(){
		var metaAnalyzer = Factory.buildAnalyzer(metaArgs);
		var result = metaAnalyzer.metaDescriptionKeyword();
		expect(result[0].result).toBe(1);
	});
});

var metaArgs2 = {
	keyword: "sample",
	meta: "this is the metadescription that doesn't contain a keyword"
};

describe("a test matching the keywords in the metadescription", function(){
	it("returns no matches for the keyword, since it isn't there", function(){
		var metaAnalyzer = Factory.buildAnalyzer(metaArgs2);
		var result = metaAnalyzer.metaDescriptionKeyword();
		expect(result[0].result).toBe(0);
	});
});

var metaArgs3 = {
	keyword: "sample",
};

describe("a test matching the keyword in the metadescription", function(){
	it("returns no matches for the keyword, since there is no metadescription", function(){
		var metaAnalyzer = Factory.buildAnalyzer(metaArgs3);
		var result = metaAnalyzer.metaDescriptionKeyword();
		expect(result[0].result).toBe(-1);
	});
});

var metaArgs4 = {
	meta: "Last month, Google actually announced a change in their algorithm before it had already happened. ",
	keyword: ""
};

describe("a test matching the keyword in the metadescription", function(){
	it("returns no matches for the keyword, since the keyword is not set", function(){
		var metaAnalyzer = Factory.buildAnalyzer(metaArgs4);
		var result = metaAnalyzer.metaDescriptionKeyword();
		expect(result[0].result).toBe(-1);
	});
});

var metaArgs5 = {
	meta: "",
	keyword: ""
};

describe("a test matching the keyword in the metadescription", function(){
	it("returns no matches for the keyword, since the keyword is not set and the meta is empty", function(){
		var metaAnalyzer = Factory.buildAnalyzer(metaArgs5);
		var result = metaAnalyzer.metaDescriptionKeyword();
		expect(result[0].result).toBe(-1);
	});
});
