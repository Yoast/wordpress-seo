var wordMatch = require("../../js/stringProcessing/wordMatch.js");

describe("Test for removing unwanted characters", function(){
	it("returns cleaned string", function(){
		expect(wordMatch("this is a test string", "test")).toBe(1);
		expect(wordMatch("this is a test test test", "test")).toBe(3);
	});
});