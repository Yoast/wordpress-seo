var transitionWordsResearch = require( "../../js/researches/findTransitionWords.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("a test for finding transition words from a string", function() {

	it("returns 1 when a transition word is found in the middle of a sentence (English)", function () {
		mockPaper = new Paper("this story is, above all, about a boy", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word with capital is found at the beginning of a sentence (English)", function () {
		mockPaper = new Paper("Firstly, I'd like to say", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word combination is found in the middle of a sentence (English)", function () {
		mockPaper = new Paper("that is different from something else", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a transition word combination is found at the end of a sentence (English)", function () {
		mockPaper = new Paper("A story, for example", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence (English)", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence, and no transition word in another sentence. (English)", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Okay?", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 2 when a two-part transition word  is found in a sentence, and a transition word in another sentence. (English)", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Unless it is about a boy.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 when a two-part transition word is found in two sentences. (English)", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel. If you want, then I will.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 when a two-part transition word is found in two sentences, and an addition transition word is found in one of them. (English)", function () {
		mockPaper = new Paper("I will either tell you a story about a boy, or read you a novel. If you want, then I will.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 1 when a transition word abbreviation found in a sentence (English)", function () {
		mockPaper = new Paper("That is e.g. a story...", { locale: 'en_US'} );
		 result = transitionWordsResearch(mockPaper);
		 expect(result.totalSentences).toBe(1);
		 expect(result.transitionWordSentences).toBe(1);
	 });
	it("returns 1 when 2 transition words are found in the same sentence (English)", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story, for example", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 2 when 2 transition words are found in two sentences (1 transition word each) (English)", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 2 in the case of a sentence with 1 transition word and a sentence with 2 transition words) (English)", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example, about you.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});
	it("returns 1 in the case of a sentence with 1 transition word and a sentence without transition words) (English)", function () {
		mockPaper = new Paper("Firstly, I'd like to tell a story. Haha.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word  is found in a sentence (English)", function () {
		mockPaper = new Paper("I will either tell you a story, or read you a novel.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 0 when no transition words are present in a sentence (English)", function () {
		mockPaper = new Paper("nothing special", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});
	it("returns 0 when no transition words are present in multiple sentences (English)", function () {
		mockPaper = new Paper("nothing special. Nothing special Either. Boring!", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(3);
		expect(result.transitionWordSentences).toBe(0);
	});
	it("returns 1 when a transition word is found in a sentence (German)", function () {
		mockPaper = new Paper("Zuerst werde ich versuchen zu verstehen, warum er so denkt.", { locale: 'de_DE'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 1 when a two-part transition word is found in a sentence (German)", function () {
		mockPaper = new Paper("Man soll nicht nur in seinen Liebesbeziehungen, sondern in sämtlichen Lebensbereichen um das Glück kämpfen.", { locale: 'de_DE'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("returns 0 when no transition words are present in a sentence (German)", function () {
		mockPaper = new Paper("Eins, zwei, drei.", { locale: 'de_DE'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});
	it("returns a result based on the default English locale in case of a bogus locale", function () {
		mockPaper = new Paper("A bogus locale.", { locale: 'xx_YY'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});
	it("defaults to English in case of a bogus locale", function () {
		mockPaper = new Paper("Because of a bogus locale.", { locale: 'xx_YY'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});
	it("defaults to English in case of a bogus locale", function () {
		mockPaper = new Paper("Zuerst eine bogus locale.", { locale: 'xx_YY'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
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
