import SentenceTokenizer from "../../../../src/languageProcessing/helpers/sentence/SentenceTokenizer";

const mockTokenizer = new SentenceTokenizer();

describe( "A test for tokenizing a (html) text into sentences", function() {
	it( "returns whether the sentenceBeginning beginning is a valid beginning.", function() {
		expect( mockTokenizer.isValidSentenceBeginning( "Text with duplicate spaces." ) ).toBe( true );
		expect( mockTokenizer.isValidSentenceBeginning( "2 texts with duplicate spaces." ) ).toBe( true );
		expect( mockTokenizer.isValidSentenceBeginning( "'" ) ).toBe( true );
		expect( mockTokenizer.isValidSentenceBeginning( "¿" ) ).toBe( true );
		expect( mockTokenizer.isValidSentenceBeginning( "<" ) ).toBe( true );
		expect( mockTokenizer.isValidSentenceBeginning( "أ" ) ).toBe( true );
	} );

	it( "returns an array of sentences for a given array of tokens started and ended with block.", function() {
		const tokens = [
			{ type: "block-start", src: "<form>" },
			{ type: "html-start", src: "<p>" },
			{ type: "sentence", src: "First sentence" },
			{ type: "sentence-delimiter", src: ":" },
			{ type: "sentence", src: " second sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: "  Third sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence-delimiter", src: "\"" },
			{ type: "sentence", src: "  Fourth sentence" },
			{ type: "sentence-delimiter", src: "\"" },
			{ type: "html-end", src: "<br> element.</p>" },
			{ type: "block-end", src: "</form>" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [
			"<form><p>First sentence:",
			"second sentence.",
			"Third sentence.\"",
			"Fourth sentence\"",
			"</form>",
		] );
	} );

	it( "returns an array of sentences for a given array of tokens that include quotation marks", function() {
		const tokens = [
			{ type: "sentence", src: "Hello", line: 1, col: 1 },
			{ type: "full-stop", src: ".", line: 1, col: 6 },
			{ type: "sentence", src: " ", line: 1, col: 7 },
			{ type: "sentence-delimiter", src: "\"", line: 1, col: 8 },
			{ type: "sentence", src: "How are you", line: 1, col: 9 },
			{ type: "sentence-delimiter", src: "\"", line: 1, col: 20 },
			{ type: "sentence", src: " Bye", line: 1, col: 21 },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [
			"Hello.",
			"\"How are you\" Bye",
		] );
	} );

	it( "returns an array of sentences for a given array of tokens that include quotation marks preceded by" +
		"period", function() {
		const tokens = [
			{ type: "sentence", src: "Hello", line: 1, col: 1 },
			{ type: "full-stop", src: ".", line: 1, col: 6 },
			{ type: "sentence", src: " ", line: 1, col: 7 },
			{ type: "sentence-delimiter", src: "\"", line: 1, col: 8 },
			{ type: "sentence", src: "How are you", line: 1, col: 9 },
			{ type: "full-stop", src: ".", line: 1, col: 20 },
			{ type: "sentence-delimiter", src: "\"", line: 1, col: 21 },
			{ type: "sentence", src: " Bye", line: 1, col: 22 },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [
			"Hello.",
			"\"How are you.\"",
			"Bye",
		] );
	} );

	it( "returns an array of sentences for a given array of tokens started and ended with html tags.", function() {
		const tokens = [
			{ type: "html-start", src: "<p>" },
			{ type: "sentence", src: "First sentence" },
			{ type: "sentence-delimiter", src: ":" },
			{ type: "sentence", src: " second sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " 5 is " },
			{ type: "smaller-than-sign-content", src: "< than 7." },
			{ type: "html-end", src: "</p>" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [
			"First sentence:",
			"second sentence.",
			"5 is < than 7.",
		] );
	} );

	it( "returns an array of sentences for a given array of tokens when there is no next token after sentence delimiter.", function() {
		const tokens = [
			{ type: "sentence", src: "First sentence" },
			{ type: "sentence-delimiter", src: ":" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "First sentence:" ] );
	} );

	it( "returns an array of sentences for a given array of tokens when there is no next token after full stop.", function() {
		const tokens = [
			{ type: "sentence", src: "One cat is special" },
			{ type: "full-stop", src: "." },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "One cat is special." ] );
	} );

	it( "does not split sentences if 'block-end' is followed by a token started with a number or " +
		"if it is preceded by a valid sentence ending, but not followed by a valid sentence beginning.", function() {
		let tokens = [
			{ type: "block-start", src: "<form>" },
			{ type: "sentence", src: "One cat is special" },
			{ type: "full-stop", src: "." },
			{ type: "block-end", src: "</form>" },
			{ type: "sentence", src: "5 is perfect!" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "<form>One cat is special.</form>5 is perfect!" ] );

		tokens = [
			{ type: "block-start", src: "<form>" },
			{ type: "sentence", src: "One cat is special" },
			{ type: "full-stop", src: "." },
			{ type: "block-end", src: "</form>" },
			{ type: "sentence", src: "five is perfect!" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "<form>One cat is special.</form>five is perfect!" ] );
	} );

	it( "does not split sentences if it contains an abbreviation", function() {
		const tokens = [
			{ type: "sentence", src: "Our feline teacher is called Prof" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " Felix the cat" },
			{ type: "full-stop", src: "." },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "Our feline teacher is called Prof. Felix the cat." ] );
	} );

	it( "does not split sentences if last word is No. and a number. ", function() {
		const tokens = [
			{ type: "sentence", src: "My favorite song is Mambo No" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " 5" },
			{ type: "full-stop", src: "." },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "My favorite song is Mambo No. 5." ] );
	} );

	it( "endsWithAbbreviation returns true if a string ends in an abbreviation", function() {
		const testString = "This string ends with an abbreviation e.g.";
		expect( mockTokenizer.endsWithAbbreviation( testString ) ).toBeTruthy();
	} );

	it( "endsWithAbbreviation returns false if a string does not end with an abbreviation,", function() {
		const testString = "This string does not end with an abbreviation.";
		expect( mockTokenizer.endsWithAbbreviation( testString ) ).toBeFalsy();
	} );

	it( "endsWithAbbreviation returns false if string does not end with an abbreviation but has an abbreviation in the middle.", function() {
		const testString = "This is e.g. a sentence.";
		expect( mockTokenizer.endsWithAbbreviation( testString ) ).toBeFalsy();
	} );

	it( "endsWithAbbreviation returns true if string contains multiple abbreviations and ends with one.", function() {
		const testString = "Prof. Barabas was helped by Dr.";
		expect( mockTokenizer.endsWithAbbreviation( testString ) ).toBeTruthy();
	} );

	it( "endsWithAbbreviation returns false if string contains multiple abbreviations and does not end with one.", function() {
		const testString = "Prof. Barabas was helped by Dr. Wargaren.";
		expect( mockTokenizer.endsWithAbbreviation( testString ) ).toBeFalsy();
	} );

	it( "splits sentences if 'block-end' is preceded by a sentence ending and followed by a valid sentence beginning.", function() {
		let tokens = [
			{ type: "block-start", src: "<form>" },
			{ type: "sentence", src: "One cat is special" },
			{ type: "full-stop", src: "." },
			{ type: "block-end", src: "</form>" },
			{ type: "sentence", src: "Five is perfect!" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "<form>One cat is special.</form>", "Five is perfect!" ] );

		tokens = [
			{ type: "block-start", src: "<form>" },
			{ type: "sentence", src: "One cat is special" },
			{ type: "full-stop", src: "." },
			{ type: "block-end", src: "</form>" },
			{ type: "block-start", src: "<footer>" },
			{ type: "block-end", src: "</footer>" },
		];
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "<form>One cat is special.</form>", "<footer></footer>" ] );
	} );

	it( "tokens that represent a '<', followed by content until it enters another '<' or '>' gets another pass by the tokenizer.", function() {
		let token = { type: "smaller-than-sign-content", src: "<h2>Positive feedback</h2>" };
		let tokenSentences = [ "First sentence:", "second sentence.", "<h2>Positive feedback</h2>" ];
		let currentSentence = "5 is < than 7.";
		expect( mockTokenizer.tokenizeSmallerThanContent( token, tokenSentences, currentSentence ) ).toEqual( {
			currentSentence: "<h2>Positive feedback</h2>",
			tokenSentences: [ "First sentence:", "second sentence.", "<h2>Positive feedback</h2>", "5 is < than 7." ],
		} );

		token = { type: "smaller-than-sign-content", src: "positive feedback" };
		tokenSentences = [ "First sentence:", "second sentence." ];
		currentSentence = "Third sentence.";
		expect( mockTokenizer.tokenizeSmallerThanContent( token, tokenSentences, currentSentence ) ).toEqual( {
			currentSentence: "Third sentence.<ositive feedback",
			tokenSentences: [ "First sentence:", "second sentence." ],
		} );

		token = { type: "smaller-than-sign-content", src: "<p>To force<br> line breaks<br> in a text,<br> use the br<br> element.</p>" };
		expect( mockTokenizer.tokenizeSmallerThanContent( token, tokenSentences, currentSentence ) ).toEqual( {
			currentSentence: "</p>",
			tokenSentences: [ "First sentence:", "second sentence.", "Third sentence.", "<p>To force", " line breaks",
				" in a text,", " use the br", " element." ],
		} );

		token = { type: "smaller-than-sign-content", src: "<p>Use<br> this</p>?" };
		tokenSentences = [ "First sentence:", "second sentence." ];
		currentSentence = "Another sentence.";
		expect( mockTokenizer.tokenizeSmallerThanContent( token, tokenSentences, currentSentence ) ).toEqual( {
			currentSentence: "",
			tokenSentences: [ "First sentence:", "second sentence.", "Another sentence.", "<p>Use", " this</p>?" ],
		} );
	} );

	it( "throws an error.", function() {
		const errorMessage = "Test end.";
		const tokenizer = mockTokenizer.createTokenizer();
		tokenizer.tokenizer.end = () => {
			const error = new Error( errorMessage );
			error.tokenizer2 = "test";
			throw error;
		};

		const consoleSpy = jest.spyOn( console, "error" );
		console.error.mockImplementation( () => {} );

		mockTokenizer.tokenize( tokenizer.tokenizer, "This is a string." );

		expect( consoleSpy ).toHaveBeenCalledWith( "Tokenizer end error:", new Error( errorMessage ), "test" );

		console.error.mockRestore();
	} );

	it( "does not break a sentence in two if there are initials within.", function() {
		// The reprint was favourably reviewed by "A. B." in The Musical Times in 1935, who commented "Praise is due to Mr Mercer.
		const tokens = [
			{ type: "sentence", src: 'The reprint was favourably reviewed by "A' },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " B" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: '" in The Musical Times in , who commented "Praise is due to Mr Mercer' },
			{ type: "full-stop", src: "." },
		];
		// eslint-disable-next-line max-len
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "The reprint was favourably reviewed by \"A. B.\" in The Musical Times in , who commented \"Praise is due to Mr Mercer." ]  );
	} );

	it( "recognizes sentence boundary when a sentence starts with initials", function() {
		// 'This is a sentence. E.F. is a good writer. G. H. is a very very great personality.'
		const tokens = [
			{ type: "sentence", src: " This is a sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " E" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: "F" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " is a good writer" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " G" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " H" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " is a very very great personality" },
			{ type: "full-stop", src: "." },

		];
		// eslint-disable-next-line max-len
		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "This is a sentence.", "E.F. is a good writer.",  "G. H. is a very very great personality." ]  );
	} );

	it( "recognizes sentence boundary when a sentence ends with initials", function() {
		// 'A cat is possessed by C. D. This is a sentence.'
		const tokens = [
			{ type: "sentence", src: " A cat is possessed by C" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " D" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " This is a sentence" },
			{ type: "full-stop", src: "." },

		];

		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual(   [ "A cat is possessed by C. D.", "This is a sentence." ]  );
	} );

	it( "recognizes when a full stop is part of a person's initials", function() {
		const tokens = [
			{ type: "sentence", src: " A cat is possessed by C" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " D" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " This is a sentence" },
			{ type: "full-stop", src: "." },

		];
		const token = tokens[ 1 ];
		const previousToken = tokens[ 0 ];
		const nextToken = tokens[ 2 ];
		const secondToNextToken = tokens[ 3 ];

		expect( mockTokenizer.isPartOfPersonInitial( token, previousToken, nextToken, secondToNextToken ) ).toBeTruthy();
	} );

	it( "recognizes when a full stop is not part of a person's initials", function() {
		const tokens = [
			{ type: "sentence", src: "This is a sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " This is a sentence" },
			{ type: "full-stop", src: "." },

		];
		const token = tokens[ 1 ];
		const previousToken = tokens[ 0 ];
		const nextToken = tokens[ 2 ];
		const secondToNextToken = tokens[ 3 ];

		expect( mockTokenizer.isPartOfPersonInitial( token, previousToken, nextToken, secondToNextToken ) ).toBeFalsy();
	} );

	xit( "recognizes when a full stop is part of initials with multiple letters", function() {
		const tokens = [
			{ type: "sentence", src: "This is a sentence" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " A" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " F" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " Th" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " van der Heijden is a well known Dutch writer." },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: "This is a sentence" },
			{ type: "full-stop", src: "." },
		];

		const token = tokens[ 5 ];
		const previousToken = tokens[ 4 ];
		const nextToken = tokens[ 6 ];
		const secondToNextToken = tokens[ 7 ];

		expect( mockTokenizer.isPartOfPersonInitial( token, previousToken, nextToken, secondToNextToken ) ).toBeTruthy();
	} );

	it( "recognizes initials in the edge case where there are quotes arouond the initials", function() {
		const tokens = [
			{ type: "sentence", src: "The reprint was favourably reviewed by" },
			{ type: "sentence-delimiter", src: "\"" },
			{ type: "sentence", src: "A" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " B" },
			{ type: "full-stop", src: "." },
			{ type: "sentence-delimiter", src: "\"" },
			{ type: "full-stop", src: " in The Musical Times in 1935, who commented \"Praise is due to Mr Mercer." },
		];

		const token = tokens[ 3 ];
		const previousToken = tokens[ 2 ];
		const nextToken = tokens[ 4 ];
		const secondToNextToken = tokens[ 5 ];

		expect( mockTokenizer.isPartOfPersonInitial( token, previousToken, nextToken, secondToNextToken ) ).toBe( true );
	} );

	it( "correctly constructs the sentence in the edge case where there are quotes arouond the initials", function() {
		const tokens = [
			{ type: "sentence", src: "The reprint was favourably reviewed by" },
			{ type: "sentence-delimiter", src: " \"" },
			{ type: "sentence", src: "A" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " B" },
			{ type: "full-stop", src: "." },
			{ type: "sentence-delimiter", src: "\"" },
			{ type: "full-stop", src: " in The Musical Times in 1935, who commented \"Praise is due to Mr Mercer." },
		];

		expect( mockTokenizer.getSentencesFromTokens( tokens ) ).toEqual( [
			"The reprint was favourably reviewed by \"A. B.\" in The Musical Times in 1935, who commented \"Praise is due to Mr Mercer." ] );
	} );

	it( "endsWithOrdinalDot should return false when the German tokenizer is not used", () => {
		expect( mockTokenizer.endsWithOrdinalDot( "Anything you want to put here, it shouldn't matter." ) ).toBe( false );
	} );
} );

