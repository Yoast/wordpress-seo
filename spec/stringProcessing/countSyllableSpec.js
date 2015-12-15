var countSyllableFunction = require("../../js/stringProcessing/countSyllables.js");

describe("a syllable counter for textstrings", function(){
	it("returns the number of syllables", function(){
		expect( countSyllableFunction("this is a textstring") ).toBe( 5 );
		expect( countSyllableFunction("human beings") ).toBe( 4 );
		expect( countSyllableFunction("along the shoreline") ).toBe( 5 );
		expect( countSyllableFunction("A piece of text to calculate scores") ).toBe( 10 );
	});
});
