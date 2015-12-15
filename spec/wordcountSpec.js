require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/preprocessor.js");
require("../js/analyzescorer.js");
require("../js/stringhelper.js");
var wordCount = require("../js/stringProcessing/countWords.js");
wordcountArgs = {
	testString: "een twee 13 vier",
	testString2: "een twee 3 vier 5",
	testString3: "1",
	testString4: "<p class='class'>word</p>"

};

describe("Test wordcount with digits", function(){
	it("returns wordcount - double digits", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString);
		expect(preProcessor.__store.wordcount).toBe(4);
		expect(wordCount(wordcountArgs.testString)).toBe(4);
	});
	it("returns wordcount - single digit", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString2);
		expect(preProcessor.__store.wordcount).toBe(5);
		expect(wordCount(wordcountArgs.testString2)).toBe(5);
	});
	it("returns wordcount - only digit", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString3);
		expect(preProcessor.__store.wordcount).toBe(1);
		expect(wordCount(wordcountArgs.testString3)).toBe(1);
	});
	it("returns wordcount - 1 word, no tags", function(){
		preProcessor = new YoastSEO.PreProcessor(wordcountArgs.testString4);
		expect(wordCount(wordcountArgs.testString4)).toBe(1);
	});

});

