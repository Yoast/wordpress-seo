import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import firstParagraph from "../../../src/languageProcessing/researches/findKeywordInFirstParagraph.js";
import Paper from "../../../src/values/Paper.js";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import buildTree from "../../specHelpers/parse/buildTree";

const morphologyData = getMorphologyData( "en" );
const morphologyDataJA = getMorphologyData( "ja" );

const keyphraseEN = "walking in nature benefits";
const sentenceWithAllKeywordsEN = "I like to take walks in the nature, because my body and brain benefit from it! ";
const sentenceWithSomeKeywordsEN = "I like to take walks in the nature. ";
const sentenceWithTheOtherKeywordsEN = "My body and brain benefit from it! ";
const sentenceWithoutKeywordsEN = "I also enjoy cycling. ";
const sentenceWithExactMatchOfAllKeywordsEN = "I like walking in the nature, because my brain benefits from it! ";
const sentenceWithExactMatchOfSomeKeywordsEN = "I like walking in the nature. ";
const sentenceWithExactMatchOfTheOtherKeywordsEN = "My brain benefits from it! ";

const paragraphWithSentenceMatchEN = "<p>" + sentenceWithAllKeywordsEN + sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithParagraphMatchEN = "<p>" + sentenceWithSomeKeywordsEN + sentenceWithTheOtherKeywordsEN +
	sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithExactSentenceMatchEN = "<p>" + sentenceWithExactMatchOfAllKeywordsEN + sentenceWithSomeKeywordsEN +
	sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithExactParagraphMatchEN = "<p>" + sentenceWithExactMatchOfSomeKeywordsEN + sentenceWithExactMatchOfTheOtherKeywordsEN +
	sentenceWithSomeKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";
const paragraphWithoutMatchEN = "<p>" + sentenceWithoutKeywordsEN + sentenceWithoutKeywordsEN + sentenceWithoutKeywordsEN + "/<p>";

describe( "a test for excluded elements", function() {
	it( "should not recognize image captions as the introduction if it occurs at the beginning of the post (classic editor)", function() {
		// The keyphrase is 'tortie cat', where it is added to the image caption. The first paragraph after the image doesn't contain the keyphrase.
		// Hence, this test should return that the keyphrase was not found in the first paragraph.
		const paper = new Paper( "\"[caption id=\"attachment_1205\" align=\"alignnone\" width=\"300\"]<img class=\"size-medium wp-image-1205\" src=\"https://basic.wordpress.test/wp-content/uploads/2024/05/cat-5579221_640-300x200.jpg\" alt=\"\" width=\"300\" height=\"200\" /> A great tortie cat.[/caption]<p> </p><p id=\"mntl-sc-block_18-0\" class=\"comp mntl-sc-block lifestyle-sc-block-html mntl-sc-block-html text-passage u-how-to-title-align\">In the early 2000's, researchers at the National Institutes of Health discovered that the genetic mutations that cause cats to have black coats may offer them some protection from diseases. In fact, the mutations affect the same genes that offer HIV resistance to some humans.</p>",
			{ keyword: "tortie cat" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
		expect( firstParagraph( paper, researcher ).introduction.childNodes[ 0 ].value ).toEqual(
			"In the early 2000's, researchers at the National Institutes of Health discovered that the genetic mutations that cause cats to have black coats may offer them some protection from diseases. In fact, the mutations affect the same genes that offer HIV resistance to some humans."
		);
	} );
	it( "should not recognize image captions as the introduction if it occurs at the beginning of the post (block editor)", function() {
		// The keyphrase is 'tortie cat', where it is added to the image caption. The first paragraph after the image doesn't contain the keyphrase.
		// Hence, this test should return that the keyphrase was not found in the first paragraph.
		const paper = new Paper( "<!-- wp:image {\"id\":1377,\"sizeSlug\":\"full\",\"linkDestination\":\"none\"} -->\n" +
			"<figure class=\"wp-block-image size-full\"><img src=\"cat.png\" alt=\"\" class=\"wp-image-1377\"/><figcaption class=\"wp-element-caption\">A great tortie cat.</figcaption></figure>\n" +
			"<!-- /wp:image -->\n" +
			"\n" +
			"<!-- wp:paragraph -->\n" +
			"<p>Some other text.</p>\n" +
			"<!-- /wp:paragraph -->",
		{ keyword: "tortie cat" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
		expect( firstParagraph( paper, researcher ).introduction.childNodes[ 0 ].value ).toEqual( "Some other text." );
	} );
	it( "should not recognize image captions as the introduction if it occurs at the beginning of the post (block editor: classic block)", function() {
		// The keyphrase is 'the highland cow Braunvieh', where it is added to the image caption. The first paragraph after the image doesn't contain the keyphrase.
		// Hence, this test should return that the keyphrase was not found in the first paragraph.
		const paper = new Paper( "<p>[caption id=\"attachment_1425\" align=\"alignnone\" width=\"300\"]<img class=\"size-medium wp-image-1425\"" +
			" src=\"https://basic.wordpress.test\" alt=\"\" width=\"300\" height=\"213\"> Braunvieh: the highland cow[/caption]</p>" +
			"\n<p>The <b>Braunvieh</b> (German, \"brown cattle\") or <b>Swiss Brown</b> is a breed or group of breeds of domestic cattle originating in Switzerland" +
			" and distributed throughout the Alpine region.</p>",
		{ keyword: "the highland cow Braunvieh" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
		expect( firstParagraph( paper, researcher ).introduction.sentences[ 0 ].text ).toEqual( "The Braunvieh (German, \"brown cattle\") or Swiss Brown is a breed or group of breeds of domestic cattle originating in Switzerland and distributed throughout the Alpine region." );
	} );
} );

describe( "checks for the content words from the keyphrase in the first paragraph (English)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper( paragraphWithSentenceMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithParagraphMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithoutMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from the keyphrase in the first paragraph (English, but no morphology data provided)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper( paragraphWithExactSentenceMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithExactParagraphMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithoutMatchEN, { keyword: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "checks for the content words from a synonym phrase in the first paragraph (English)", function() {
	it( "returns whether all keywords were matched in one sentence", function() {
		const paper = new Paper( paragraphWithSentenceMatchEN, { keyword: "something unrelated", synonyms: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithParagraphMatchEN, { keyword: "something unrelated", synonyms: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns whether all keywords were matched in the paragraph", function() {
		const paper = new Paper( paragraphWithoutMatchEN, { keyword: "something unrelated", synonyms: keyphraseEN } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "tests for edge cases", function() {
	it( "returns not found if no keyphrase or synonyms were specified", function() {
		const paper = new Paper( "something", { keyword: "", synonyms: "" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns not found if there is no text", function() {
		const paper = new Paper( "", { keyword: "keyword", synonyms: "synonyms" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns not found if the paragraph has no text", function() {
		const paper = new Paper( "<p></p>", { keyword: "keyword", synonyms: "synonyms" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns correct result if the first paragraph has no text, but the second one does and contains the keyphrase", function() {
		const paper = new Paper( "<p></p><p>something keyword something else</p>", { keyword: "keyword", synonyms: "synonyms" } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips the first paragraph if there is nothing but an image there", function() {
		const paper = new Paper(
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" /></p>" +
			"<p></p>" +
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\" /></p></p>" +
			"<p></p>" +
			"<p>A sentence with a keyword</p>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips the first paragraph if there is nothing but an image there (in a div)", function() {
		const paper = new Paper(
			"<div style=\"text-align: center;\"><img src=\"https://www.test.com/test.jpg\" alt=\"an alt tag\"></div>" +
			"<div>A sentence with a keyword</div>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips the first paragraph if there is nothing but an image there (in a div), also with a href", function() {
		const paper = new Paper(
			"<div style=\"text-align: center;\"> <a href=\"https://test.test.com/test\"> <img src=\"https://www.test.com/test.jpg\" " +
			"alt=\"an alt tag\"> </a> </div>" +
			"<div>A sentence with a keyword</div>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "skips the first paragraph if the document starts with the Estimated reading time block", function() {
		const paper = new Paper(
			"<!-- wp:yoast-seo/estimated-reading-time {\"estimatedReadingTime\":3} -->\n" +
			"<p class=\"yoast-reading-time__wrapper\"><span class=\"yoast-reading-time__icon\"></span><span " +
			"class=\"yoast-reading-time__descriptive-text\">Estimated reading time:  </span><span class=\"yoast-reading-time__reading-time\">" +
			"3</span><span class=\"yoast-reading-time__time-unit\"> minutes</span></p>\n" +
			"<!-- /wp:yoast-seo/estimated-reading-time --><!-- wp:paragraph -->" +
			"<p>A sentence with a keyword</p><!-- /wp:paragraph -->",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "does not find keyword in the link in the first paragraph", function() {
		const paper = new Paper(
			"<a href=\"https://test.keyword.com/test\"> keyword <img src=\"https://www.keyword.com/test.jpg\" alt=\"a keyword tag\"> keyword </a>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "does not find keyword in the alt tag in the first paragraph if there is nothing but an image there (in a div)", function() {
		const paper = new Paper(
			"<div style=\"text-align: center;\"><img src=\"https://www.test.com/test.jpg\" alt=\"an alt tag keyword\"></div>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "does not find keyword in the alt tag in the first paragraph if there is nothing but an image there (in a link in a div)", function() {
		const paper = new Paper(
			"<div style=\"text-align: center;\"><a href=\"https://test.keyword.com/test\"> keyword <img src=\"https://www.keyword.com/test.jpg\" " +
			"alt=\"a keyword tag\"> keyword </a></div>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );


	it( "skips paragraphs until there is text", function() {
		const paper = new Paper(
			"<p><img class=\"alignnone size-medium wp-image-95\" src=\"test.png\" alt=\"image1\" width=\"300\" height=\"36\"></p>" +
			"<p>A sentence with a keyword</p>",
			{
				keyword: "keyword",
				synonyms: "",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns correct result if the first paragraph has text, but the keyphrase is only in the second paragraph", function() {
		const paper = new Paper(
			"<p>something</p><p>something keyword something else</p>",
			{
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns correct result if the text contains image tags", function() {
		const paper = new Paper(
			"<img src=\"img_girl.jpg\" alt=\"Girl in a jacket\" width=\"500\" height=\"600\">\n " +
			"<img src=\"img_girl.jpg\" alt=\"Girl in a jacket\" width=\"500\" height=\"600\">\n",
			{
				keyword: "keyword",
				synonyms: "synonyms",
			}
		);
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );
} );

describe( "a test for the keyphrase in first paragraph research when the exact match is requested", function() {
	it( "returns a bad result when the first paragraph doesn't contain the exact match of the keyphrase", function() {
		const paper = new Paper( paragraphWithParagraphMatchEN,
			{ keyword: "\"walking in the nature\"", description: "A cat is enjoying a walk in nature." } );
		const researcher = new EnglishResearcher( paper );
		researcher.addResearchData( "morphology", morphologyData );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase", function() {
		const paper = new Paper( paragraphWithExactSentenceMatchEN,
			{ keyword: "\"walking in the nature\"", description: "A cat is enjoying walking in nature." } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const paper = new Paper( "A cat loves an activity in the nature. A cat is enjoying to take a walk in the nature",
			{ keyword: "\"walking in the nature\"",
				synonyms: "activity in the nature" } );
		const researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase in upper case with a period", function() {
		let paper = new Paper( "What is ASP.NET", { keyword: "ASP.NET" } );
		let researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject(
			{
				foundInOneSentence: true,
				foundInParagraph: true,
				keyphraseOrSynonym: "keyphrase",
			}
		);

		paper = new Paper( "What is ASP.net", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );

		paper = new Paper( "What is asp.NET", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );

		paper = new Paper( "What is asp.net", { keyword: "\"ASP.NET\"" } );
		researcher = new EnglishResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "returns a bad result when the first paragraph doesn't contain the exact match of the keyphrase in Japanese", function() {
		const paper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。",
			{ keyword: "『小さい花の刺繍』", synonyms: "野生のハーブの刺繡" } );
		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: false,
			foundInParagraph: false,
			keyphraseOrSynonym: "",
		} );
	} );

	it( "returns a good result when the first paragraph contains the exact match of the keyphrase", function() {
		const paper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。小さい花の刺繍。",
			{ keyword: "「小さい花の刺繍」", synonyms: "野生のハーブの刺繡" } );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "keyphrase",
		} );
	} );

	it( "still returns a good result when the first paragraph doesn't contain the exact match of the keyphrase," +
		" but it does contain the synonym", function() {
		const paper = new Paper( "小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。",
			{ keyword: "「小さい花の刺繍」", synonyms: "野生のハーブの刺繡" }  );
		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );

		expect( firstParagraph( paper, researcher ) ).toMatchObject( {
			foundInOneSentence: true,
			foundInParagraph: true,
			keyphraseOrSynonym: "synonym",
		} );
	} );
} );
