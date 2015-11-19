require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");

wordcountArgs = {
	testString: "een twee 13 vier",
	testString2: "een twee 3 vier 5",
	testString3: "1"

};

describe("Test wordcount with digits", function(){
	it("returns wordcount - double digits", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString);
		expect(preProcessor.__store.wordcount).toBe(4);
	});
	it("returns wordcount - single digit", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString2);
		expect(preProcessor.__store.wordcount).toBe(5);
	});
	it("returns wordcount - only digit", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString3);
		expect(preProcessor.__store.wordcount).toBe(1);
	});
});