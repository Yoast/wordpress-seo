var wordMatch = require("../../js/stringProcessing/wordMatch.js");

describe("Counts the occurences of a word in a string", function(){
	it("returns number", function(){
		expect(wordMatch("this is a test string", "test")).toBe(1);
		expect(wordMatch("this is a test test test", "test")).toBe(3);
		expect(wordMatch("test with maïs", "maïs")).toBe(1);
		expect(wordMatch("test with mais", "maïs")).toBe(1);
	});
});