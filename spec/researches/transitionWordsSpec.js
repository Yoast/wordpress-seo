var transitionWordsResearch = require( "../../js/researches/findTransitionWords.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("a test for finding transition words from a string", function() {

	it("returns 1 when a transition word is found in the middle of a sentence", function () {
		mockPaper = new Paper("this story is, above all, about a boy");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word with capital is found at the beginning of a sentence", function () {
		mockPaper = new Paper("Firstly, I'd like to say");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word combination is found in the middle of a sentence", function () {
		mockPaper = new Paper("that is different from something else");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word combination is found at the end of a sentence", function () {
		mockPaper = new Paper("A story, for example");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence, and no transition word in another sentence.", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Okay?");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 2 when a two-part transition word  is found in a sentence, and a transition word in another sentence.", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Unless it is about a boy.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 when a two-part transition word is found in two sentences.", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. If you want, then I will.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 when a two-part transition word is found in two sentences, and an addition transition word is found in one of them.", function () {
		mockPaper = new Paper("I will either tell you a story about a boy, or read you a novel. If you want, then I will.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 1 when a transition word abbreviation found in a sentence", function () {
		mockPaper = new Paper("That is e.g. a story...");
		 result = transitionWordsResearch(mockPaper);
		 expect(result.totalSentences).toBe(1);
		 expect(result.transitionWordSentences).toBe(1);
	 });
	it("returns 1 when 2 transition words are found in the same sentence", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story, for example");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 2 when 2 transition words are found in two sentences (1 transition word each) ", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 in the case of a sentence with 1 transition word and a sentence with 2 transition words) ", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example, about you.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 1 in the case of a sentence with 1 transition word and a sentence without transition words) ", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. Haha.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel.");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 0 when no transition words are present in a sentence", function () {
		mockPaper = new Paper("nothing special");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});
	it("returns 0 when no transition words are present in multiple sentences", function () {
		mockPaper = new Paper("nothing special. Nothing special Either. Boring!");
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(3);
		expect(result.transitionWordSentences).toBe(0);
	});

	it( "works with normalizes quotes", function() {
		mockPaper = new Paper( "what’s more", {} );
		result = transitionWordsResearch( mockPaper );

		expect( result ).toEqual( {
			totalSentences: 1,
			sentenceResults: [
				{
					sentence: "what’s more",
					transitionWords: [ "what's more" ]
				}
			],
			transitionWordSentences: 1
		} );
	});
} );
