var sentenceCount = require("../../js/stringProcessing/countSentences.js");

describe("Counting of sentences", function(){
	it("returns the number of sentences in a string", function(){
		expect( sentenceCount( "First sentence. Second sentence. 3rd sentence." ) ).toBe(3);
		expect( sentenceCount( "First sentence.. Second sentence. 3rd sentence." ) ).toBe(3);
		expect( sentenceCount( "First sentence!!! Second sentence. 3rd sentence." ) ).toBe(3);
		expect( sentenceCount( "First sentence!!! Second sentence. 3rd sentence. ." ) ).toBe(3);
	});
});
