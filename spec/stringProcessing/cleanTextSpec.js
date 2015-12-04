var cleanText = require ("../../js/stringProcessing/cleanText.js");

describe("cleaning text", function(){
	it("returns text", function(){
		expect( cleanText ( "This  is  a  text!" ) ).toBe("this is a text.");
	});
});
