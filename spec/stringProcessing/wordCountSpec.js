var wordCountFunction = require("../../js/stringProcessing/wordCount.js");

describe("counts words in a string", function(){
	it("returs the number of words", function(){
		expect(wordCountFunction("this is a string")).toBe(4);
		expect(wordCountFunction("this is a string, a very nice string.")).toBe(8);
	});
});
