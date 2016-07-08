var transitionWordsResearch = require( "../../js/researches/findTransitionWords.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("a test for finding transition words from a string", function() {

	it("returns 1 when a transition word is found in the middle of a sentence (English)", function () {
		// Transition word: above all.
		mockPaper = new Paper("this story is, above all, about a boy", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a transition word with capital is found at the beginning of a sentence (English)", function () {
		// Transition word: firstly.
		mockPaper = new Paper("Firstly, I'd like to say", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a transition word combination is found in the middle of a sentence (English)", function () {
		// Transition word: different from.
		mockPaper = new Paper("that is different from something else", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a transition word combination is found at the end of a sentence (English)", function () {
		// Transition word: for example.
		mockPaper = new Paper("A story, for example", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word  is found in a sentence (English)", function () {
		// Transition word: either...or.
		mockPaper = new Paper("I will either tell you a story, or read you a novel.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word  is found in a sentence, and no transition word in another sentence. (English)", function () {
		// Transition word: either...or.
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Okay?", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 2 when a two-part transition word  is found in a sentence, and a transition word in another sentence. (English)", function () {
		// Transition words: either...or, unless.
		mockPaper = new Paper("I will either tell you a story, or read you a novel. Unless it is about a boy.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});

	it("returns 2 when a two-part transition word is found in two sentences. (English)", function () {
		// Transition words: either...or, if...then.
		mockPaper = new Paper("I will either tell you a story, or read you a novel. If you want, then I will.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});

	it("returns 2 when a two-part transition word is found in two sentences, and an additional transition word is found in one of them. (English)", function () {
		// Transition words: either...or, if ...then, as soon as.
		mockPaper = new Paper("I will either tell you a story about a boy, or read you a novel. If you want, then I will start as soon as you're ready.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});

	it("returns 1 when a transition word abbreviation found in a sentence (English)", function () {
		// Transition word: e.g..
		mockPaper = new Paper("That is e.g. a story...", { locale: 'en_US'} );
		 result = transitionWordsResearch(mockPaper);
		 expect(result.totalSentences).toBe(1);
		 expect(result.transitionWordSentences).toBe(1);
	 });

	it("returns 1 when 2 transition words are found in the same sentence (English)", function () {
		// Transition words: firstly, for example.
		mockPaper = new Paper("Firstly, I'd like to tell a story, for example", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 2 when 2 transition words are found in two sentences (1 transition word each) (English)", function () {
		// Transition words: firstly, for example.
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});

	it("returns 2 in the case of a sentence with 1 transition word and a sentence with 2 transition words) (English)", function () {
		// Transition words: firstly, for example, as I have said.
		mockPaper = new Paper("Firstly, I'd like to tell a story. For example, about you, as I have said.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(2);
	});

	it("returns 1 in the case of a sentence with 1 transition word and a sentence without transition words) (English)", function () {
		// Transition word: firstly.
		mockPaper = new Paper("Firstly, I'd like to tell a story. Haha.", { locale: 'en_US'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(2);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word  is found in a sentence (English)", function () {
		// Transition word: either...or.
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
		// Transition word: zuerst.
		mockPaper = new Paper("Zuerst werde ich versuchen zu verstehen, warum er so denkt.", { locale: 'de_DE'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word is found in a sentence (German)", function () {
		// Transition word: nicht nur...sondern.
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

	it("returns 1 when a transition word is found in a sentence (French)", function () {
		// Transition word: deuxièmement.
		mockPaper = new Paper("Deuxièmement, il convient de reconnaître la complexité des tâches à entreprendre.", { locale: 'fr_FR'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word is found in a sentence (French)", function () {
		// Transition word: non seulement, mais encore. 
		mockPaper = new Paper("Non seulement on l’estime, mais encore on l’aime.", { locale: 'fr_FR'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a transition word with an apostrophe is found in a sentence (French)", function () {
		// Transition word: quoi qu’il en soit.
		mockPaper = new Paper("Quoi qu’il en soit, le gouvernement du Mali a perdu sa légitimité.", { locale: 'fr_FR'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 0 when no transition words are present in a sentence (French)", function () {
		mockPaper = new Paper("Une, deux, trois.", { locale: 'fr_FR'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});

	it("returns 1 when a transition word is found in a sentence (Spanish)", function () {
		// Transition word: pr el contrario.
		mockPaper = new Paper("Por el contrario, desea que se inicien cambios beneficiosos en Europa.", { locale: 'es_ES'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 1 when a two-part transition word is found in a sentence (Spanish)", function () {
		// Transition word: de un lado...de otra parte.
		mockPaper = new Paper("Se trata además, de una restauración que ha pretendido de un lado ser reversible y que de otra parte ha intentado minimizar al máximo el impacto material.", { locale: 'es_ES'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("returns 0 when no transition words are present in a sentence (Spanish)", function () {
		mockPaper = new Paper("Uno, dos, tres.", { locale: 'es_ES'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});

	it("defaults to English in case of a bogus locale", function () {
		// Transition word: because.
		mockPaper = new Paper("Because of a bogus locale.", { locale: 'xx_YY'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(1);
	});

	it("defaults to English in case of a bogus locale", function () {
		// Transition word: none in English (but zuerst is a German transition word).
		mockPaper = new Paper("Zuerst eine bogus locale.", { locale: 'xx_YY'} );
		result = transitionWordsResearch(mockPaper);
		expect(result.totalSentences).toBe(1);
		expect(result.transitionWordSentences).toBe(0);
	});

	it( "works with normalizes quotes", function() {
		// Transition word: what’s more.
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

	it( "works with the no-break space character", function() {
		// Transition word: then.
		mockPaper = new Paper( "and\u00a0then" );
		var expected = {
			totalSentences: 1,
			sentenceResults: [{
				sentence: "and\u00a0then",
				transitionWords: [ "then" ]
			}],
			transitionWordSentences: 1
		};

		var result = transitionWordsResearch( mockPaper );

		expect( result ).toEqual( expected );
	});
} );
