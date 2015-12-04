var sentenceCount = require("../../js/stringProcessing/sentenceCount.js");

describe("Counting of sentences", function(){
	it("returns the number of sentences in a string", function(){
		expect( sentenceCount( "een zin. twee zin. 3 zin." ) ).toBe(3);
		expect( sentenceCount( "een zin.. twee zin. 3 zin." ) ).toBe(3);
		expect( sentenceCount( "een zin!!! twee zin. 3 zin." ) ).toBe(3);
		expect( sentenceCount( "een zin!!! twee zin. 3 zin. ." ) ).toBe(3);
	});
});