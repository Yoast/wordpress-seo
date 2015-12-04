var basicSyllableFunction = require("../../js/stringProcessing/basicSyllable.js");

describe("counts syllables in a string by splitting on consonants", function(){
	it("returns syllablecount", function(){
		expect( basicSyllableFunction( "this is a textstring with multiple words" ) ).toBe(10);
	});
});
