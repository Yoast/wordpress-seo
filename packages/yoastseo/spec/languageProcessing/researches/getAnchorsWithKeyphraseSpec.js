import Paper from "../../../src/values/Paper";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import getAnchorsWithKeyphrase from "../../../src/languageProcessing/researches/getAnchorsWithKeyphrase";
import buildTree from "../../specHelpers/parse/buildTree";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" );
const morphologyDataJA = getMorphologyData( "ja" );

describe( "A test for getting the anchors that contain the keyphrase or synonym", () => {
	it( "should return 0 if the paper text is empty", () => {
		const attributes = {
			permalink: "http://yoast.com",
			keyword: "cats",
		};
		const mockPaper = new Paper( "", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 if neither the keyphrase nor the synonym is set", () => {
		const attributes = {
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>fluffy bunny</a>", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 if the keyphrase is found in an anchor text of a link" +
		"that refers to the current url", () => {
		const attributes = {
			keyword: "good companion for an orange cat",
			permalink: "http://yoast.com/this-page/",
		};

		const mockPaper = new Paper( "string <a href='http://yoast.com/this-page/'>good companion for an orange cat</a>", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 if the anchor tag doesn't have href attribute", () => {
		const attributes = {
			permalink: "http://yoast.com",
			keyword: "cats",
		};
		const mockPaper = new Paper( "string <a href=''>good companion for an orange cat</a>", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should ignore the keyphrase in an url when referencing to the current url with a hash", () => {
		let attributes = {
			keyword: "cat",
			permalink: "http://example.org/cat#top",
		};
		let mockPaper = new Paper( "string <a href='http://example.org/cat'>good companion for an orange cat</a>", attributes );
		let researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );

		attributes = {
			keyword: "cat",
			permalink: "http://example.org/cat",
		};
		mockPaper = new Paper( "There was seen <a href='http://example.org/cat#top'>a turkish van together with a tortie</a>", attributes );
		researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 if the keyphrase is found in an anchor text of a fragment on the same page", () => {
		const attributes = {
			keyword: "good companion for an orange cat",
			permalink: "http://yoast.com/this-page/",
		};

		const mockPaper = new Paper( "string <a href='#some-fragment'>good companion for an orange cat</a>", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 if neither the keyphrase nor the synonym is found in the anchors", () => {
		const attributes = {
			keyword: "cats",
			permalink: "http://yoast.com",
			synonyms: "Felis catus",
		};
		const mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>fluffy bunny</a>", attributes );

		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should return 0 when the anchor text contains more content words than just the keyphrase or synonym", () => {
		const attributes = {
			keyword: "cats",
			permalink: "http://yoast.com",
			synonyms: "Felis catus",
		};
		const mockPaper = new Paper( "A <a href='example.com'>fluffy cat and a smart felis catus</a> were seen pouncing together. ", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should find a match when the keyphrase is found in the anchor text, even when it only contains function words", () => {
		const attributes = {
			keyword: "Mrs. always tries to be awesome",
			permalink: "http://yoast.com",
			synonyms: "Felis catus",
		};
		const mockPaper = new Paper( "A <a href='example.com'>Mrs. always tries to be awesome</a> were seen pouncing together. ", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );

		const result = getAnchorsWithKeyphrase( mockPaper, researcher );

		expect( result.anchorsWithKeyphraseCount ).toEqual( 1 );
		expect( result.anchorsWithKeyphrase ).toEqual( [ {
			attributes: { href: "example.com" },
			childNodes: [ { name: "#text", value: "Mrs. always tries to be awesome" } ],
			name: "a",
			sourceCodeLocation: {
				endOffset: 59,
				endTag: { endOffset: 59, startOffset: 55 },
				startOffset: 2,
				startTag: { endOffset: 24, startOffset: 2 },
			},
		} ] );
	} );

	it( "should find a match of a keyphrase in the anchor text of an internal link", () => {
		const attributes = {
			keyword: "fluffy and furry cat",
			permalink: "http://yoast.com",
		};

		const mockPaper = new Paper( "string <a href='http://yoast.com/some-other-page/'>many fluffy and furry cats</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		const result = getAnchorsWithKeyphrase( mockPaper, researcher );

		expect( result.anchorsWithKeyphraseCount ).toEqual( 1 );
		expect( result.anchorsWithKeyphrase ).toEqual( [ {
			attributes: { href: "http://yoast.com/some-other-page/" },
			childNodes: [ { name: "#text", value: "many fluffy and furry cats" } ],
			name: "a",
			sourceCodeLocation: {
				endOffset: 81,
				endTag: { endOffset: 81, startOffset: 77 },
				startOffset: 7,
				startTag: { endOffset: 51, startOffset: 7 } } },
		] );
	} );

	it( "should find a match of a keyphrase in the anchor text of a link with a hash", () => {
		const attributes = {
			keyword: "food for cats",
			permalink: "http://example.org/keyword#top",
		};

		const mockPaper = new Paper( "How to prepare <a href='http://test.com/keyword#top'>food for cats</a>.", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		const result = getAnchorsWithKeyphrase( mockPaper, researcher );

		expect( result.anchorsWithKeyphraseCount ).toEqual( 1 );
		expect( result.anchorsWithKeyphrase ).toEqual( [ {
			attributes: { href: "http://test.com/keyword#top" },
			childNodes: [ { name: "#text", value: "food for cats" } ],
			name: "a",
			sourceCodeLocation: {
				endOffset: 70,
				endTag: { endOffset: 70, startOffset: 66 },
				startOffset: 15,
				startTag: { endOffset: 53, startOffset: 15 } } },
		] );
	} );

	it( "should find a match of a synonym in the anchor text of an external link", () => {
		const attributes = {
			keyword: "felis catus",
			synonyms: "fluffy and furry cat",
			permalink: "http://yoast.com",
		};

		const mockPaper = new Paper( "string <a href='http://example.com/some-other-page/'>many fluffy and furry cats</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		const result = getAnchorsWithKeyphrase( mockPaper, researcher );

		expect( result.anchorsWithKeyphraseCount ).toEqual( 1 );
		expect( result.anchorsWithKeyphrase ).toEqual( [ {
			attributes: { href: "http://example.com/some-other-page/" },
			childNodes: [ { name: "#text", value: "many fluffy and furry cats" } ],
			name: "a",
			sourceCodeLocation: {
				endOffset: 83,
				endTag: { endOffset: 83, startOffset: 79 },
				startOffset: 7,
				startTag: { endOffset: 53, startOffset: 7 } } },
		] );
	} );

	it( "should still find a match of a keyphrase in the anchor text containing html tags", () => {
		const attributes = {
			keyword: "food for cats",
			permalink: "http://example.org/this-page",
		};

		const mockPaper = new Paper( "How to prepare <a href='http://test.com/that-page'>food for <strong>cats</strong></a>.", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		const result = getAnchorsWithKeyphrase( mockPaper, researcher );

		expect( result.anchorsWithKeyphraseCount ).toEqual( 1 );
		expect( result.anchorsWithKeyphrase ).toEqual( [ {
			attributes: { href: "http://test.com/that-page" },
			childNodes: [
				{ name: "#text", value: "food for " },
				{
					attributes: {},
					childNodes: [ { name: "#text", value: "cats" } ],
					name: "strong",
					sourceCodeLocation: {
						endOffset: 81,
						endTag: { endOffset: 81, startOffset: 72 },
						startOffset: 60,
						startTag: { endOffset: 68, startOffset: 60 } },
				},
			],
			name: "a",
			sourceCodeLocation: {
				endOffset: 85,
				endTag: { endOffset: 85, startOffset: 81 },
				startOffset: 15,
				startTag: { endOffset: 51, startOffset: 15 } } },
		] );
	} );

	it( "should find a match a keyphrase and synonyms when there are multiple anchors in the text", () => {
		const attributes = {
			keyword: "key word and key phrase",
			synonyms: "interesting article, and another exciting paper",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keys wording phrased</a>" +
			" as  well as the lovely <a href='http://example.com/keyword'>articles which are interesting</a>, " +
			"and <a href='http://example.com/keyword'>excited papers</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 3 );
	} );

	it( "should not match a partial overlap", () => {
		const attributes = {
			keyword: "key word and key phrase",
			synonyms: "interesting article",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>keys wording </a>" +
			" as  well as the lovely <a href='http://example.com/keyword'>articles which are </a>, " +
			"and <a href='http://example.com/keyword'>excited papers</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );

		buildTree( mockPaper, researcher );
		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );
} );

describe( "a test for anchors and its attributes when the exact match of a keyphrase is requested", () => {
	it( "should match all words from keyphrase in the link text and vice versa when the keyphrase is enclosed in double quotes", function() {
		const attributes = {
			keyword: "\"walking in nature\"",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>walking in nature</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );

	it( "should match all words from keyphrase in the link text and vice versa when the keyphrase is enclosed in double quotes " +
		"and the keyphrase is preceded by a function word in the anchor text", function() {
		const attributes = {
			keyword: "\"walking in nature\"",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>" +
			"immediately walking in nature</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );

	it( "should not return a match of keyphrase in the anchor text and vice versa when the keyphrase is enclosed in double quotes " +
		"and the keyphrase is followed by a content word in the anchor text", function() {
		const attributes = {
			keyword: "\"walking in nature\"",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>" +
			"walking in nature activity</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "should not return a match of keyphrase in the anchor text and vice versa when the keyphrase is enclosed in double quotes " +
		"and the keyphrase appears in a different form in the anchor text", function() {
		const attributes = {
			keyword: "\"walking in nature\"",
			permalink: "http://example.org/keyword",
		};

		const mockPaper = new Paper( "hello, here is a link with my <a href='http://example.com/keyword'>" +
			"walks in nature</a>", attributes );
		const researcher = new EnglishResearcher( mockPaper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
	} );

	it( "assesses the anchor text where all content words in the text are present in one of the synonyms, " +
		"and the synonym is enclosed in double quotes ", function() {
		const paperAttributes = {
			keyword: "something and tortie",
			synonyms: "\"cats and dogs\", tortoiseshell",
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "A text with a <a href='http://yoast.com'>link</a>, <a href='http://example.com'>cats and dogs</a>",
			paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );

	it( "assesses multiple anchor texts where all content words in the texts are present in the keyphrase and in one of the synonyms, " +
		"and the keyphrase and synonym are enclosed in double quotes ", function() {
		const paperAttributes = {
			keyword: "\"tabby and tortie\"",
			synonyms: "\"cats and dogs\", tortoiseshell",
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "A text with a <a href='http://test.com'>tabby and tortie</a>, <a href='http://example.com'>cats and dogs</a>",
			paperAttributes );
		const researcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 2 );
	} );

	it( "should match the keyphrase in the anchor text when the keyphrase is enclosed in double quotes in Japanese", function() {
		const paperAttributes = {
			keyword: "『読ん一冊の本』",
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>読ん一冊の本</a>", paperAttributes );
		const researcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );

	it( "should match the keyphrase in the anchor text when the keyphrase is enclosed in double quotes " +
		"and the keyphrase is preceded by a function word in the anchor text", function() {
		const paperAttributes = {
			keyword: "『読ん一冊の本』",
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>から読ん一冊の本</a>", paperAttributes );
		const researcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );

	it( "assesses the anchor text where all content words in the text are present in the synonym, " +
		"and the synonym is enclosed in Japanese quotes", function() {
		const paperAttributes = {
			keyword: "言葉",
			synonyms: "『小さく花の刺繍』",
			permalink: "http://yoast.com",
		};
		const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さく花の刺繍</a>", paperAttributes );
		const researcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, researcher );

		expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
	} );
} );

describe( "a test for anchors and its attributes in languages that have a custom helper " +
	"to get the words from the text and matching them in the text", () => {
	// Japanese has custom helpers to get the words from the text and matching them in the text.
	describe( "a test for when the morphology data is not available", () => {
		let paperAttributes = {
			keyword: "リンク",
			permalink: "http://yoast.com",
		};

		it( "assesses the anchor text where not all content words in the text are present in the keyphrase", function() {
			paperAttributes = {
				keyword: "読ん一冊の本",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>猫と読ん一冊の本</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
		} );

		it( "assesses the anchor text where all content words in the text present in the keyphrase: should find a match", function() {
			paperAttributes = {
				keyword: "から小さい花の刺繍",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さい花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
		} );

		it( "assesses the anchor text where all content words in the text present in the keyphrase, but in a different form:" +
			"should not find a match", function() {
			paperAttributes = {
				keyword: "から小さく花の刺繍",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さい花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
		} );

		it( "assesses the anchor text where all content words in the text are present in the synonym and in the keyphrase", function() {
			paperAttributes = {
				keyword: "から小さく花の刺繍",
				synonyms: "猫用のフード, 猫用食品",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さく花の刺繍</a>" +
				" <a href='http://example.com'>から猫用のフード</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 2 );
		} );
	} );

	describe( "a test for when the morphology data is available", () => {
		it( "assesses the anchor text where not all content words in the text present in the keyphrase: should not find a match", function() {
			const paperAttributes = {
				keyword: "読ん一冊の本",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>猫と読ん一冊の本</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
		} );

		it( "assesses the anchor text where all content words in the text present in the keyphrase: should find a match", function() {
			const paperAttributes = {
				keyword: "から小さい花の刺繍",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さい花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
		} );

		it( "assesses the anchor text where all content words in the text present in the keyphrase, but in a different form:" +
			" should find matches", function() {
			const paperAttributes = {
				keyword: "から小さく花の刺繍",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さい花の刺繍</a>" +
				" <a href='http://example.com'>小さける花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 2 );
		} );

		it( "assesses the anchor text where all content words in the text present in the synonyms, but in a different form", function() {
			const paperAttributes = {
				keyword: "猫用食品",
				synonyms: "小さく花の刺繍",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>," +
				" <a href='http://example.com'>から小さい花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			researcher.addResearchData( "morphology", morphologyDataJA );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 1 );
		} );

		it( "checks the keyphrase in the anchor text when the keyphrase is enclosed in double quotes, " +
			"and the anchor text contains a different form of the keyphrase: should not find a match", function() {
			const paperAttributes = {
				keyword: "「小さく花の刺繍」",
				synonyms: "something, something else",
				permalink: "http://yoast.com",
			};
			const mockPaper = new Paper( "言葉 <a href='http://yoast.com'>リンク</a>, <a href='http://example.com'>小さい花の刺繍</a>", paperAttributes );
			const researcher = new JapaneseResearcher( mockPaper );
			buildTree( mockPaper, researcher );

			expect( getAnchorsWithKeyphrase( mockPaper, researcher ).anchorsWithKeyphraseCount ).toEqual( 0 );
		} );
	} );
} );
