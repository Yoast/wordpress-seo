var keyphraseSize = require("../../js/analyses/getKeyphraseLength.js");

describe("Test for counting the number of words in a keyphrase", function(){
	it("returns wordcount in a keyphrase", function(){
		expect(keyphraseSize("a keyword phrase")).toBe(3);
		expect(keyphraseSize("keyword")).toBe(1);
		expect(keyphraseSize("")).toBe(0);
	});
});
