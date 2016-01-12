var sanitizeString = require("../../js/stringProcessing/sanitizeString.js");

describe("Test for removing unwanted characters", function(){
	it("returns cleaned string", function(){
		expect(sanitizeString("keyword*")).toBe("keyword");
		expect(sanitizeString("keyword<p></p>")).toBe("keyword");
	});
});