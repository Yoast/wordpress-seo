import getParagraphLength from "../../../src/languageProcessing/researches/getParagraphLength.js";
import Paper from "../../../src/values/Paper.js";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";
import buildTree from "../../specHelpers/parse/buildTree";

describe( "a test for getting paragraph length", function() {
	it( "returns the paragraph length of a paragraph between p tags", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum, hyphens all-over-the-place</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 4 );
	} );

	it( "returns the paragraph length of a paragraph in Japanese between p tags", function() {
		const mockPaper = new Paper( "<p>これに対し日本国有鉄道</p>" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 11 );
	} );

	it( "returns the paragraph length of two paragraphs divided by double linebreaks and ends with a double linebreak", function() {
		// After using the HTML parser, we don't split paragraphs on double linebreaks, so this should be one paragraph.
		const mockPaper = new Paper( "Lorem \n\n ipsum two \n\n" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 1 );
		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 3 );
	} );

	it( "returns the paragraph length of a paragraph without tags or double linebreaks", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 5 );
	} );

	it( "returns the paragraph length of a paragraph in Japanese without tags or double linebreaks", function() {
		const mockPaper = new Paper( "東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した。" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 36 );
	} );

	it( "returns the paragraph length of 2 paragraphs, both between p tags", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p><p>dolor sit amet</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );
		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 2 );
		expect( paragraphLengths[ 1 ].paragraphLength ).toBe( 3 );
	} );

	it( "returns the paragraph length of 2 paragraphs in Japanese, both between p tags", function() {
		const mockPaper = new Paper( "<p>東京オリンピック開会直前の1964年</p><p>（昭和39年）10月1日に開業した。</p>" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 18 );
		expect( paragraphLengths[ 1 ].paragraphLength ).toBe( 18 );
	} );

	it( "returns the paragraph length of 2 paragraphs, both between p tags, divided by double linebreaks", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p> \n\n <p>dolor sit amet</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 2 );
		expect( paragraphLengths[ 1 ].paragraphLength ).toBe( 3 );
	} );

	it( "returns the paragraph length of 2 paragraphs in Japanese, both between p tags, divided by double linebreaks", function() {
		const mockPaper = new Paper( "<p>東京オリンピック開会直前の1964年</p> \n\n <p>（昭和39年）10月1日に開業した。</p>" );
		const mockResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 18 );
		expect( paragraphLengths[ 1 ].paragraphLength ).toBe( 18 );
	} );

	it( "returns the paragraph length, with empty paragraphs", function() {
		const mockPaper = new Paper( "<p>test</p><p></p><p>more text</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 2 );
	} );

	it( "returns the paragraph length, ignoring text inside an element we want to exclude from the analysis", function() {
		const mockPaper = new Paper( "<p>test <code>ignore me</code></p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 1 );
	} );

	it( "returns the paragraph length, ignoring shortcodes", function() {
		const mockPaper = new Paper( "<p>test [shortcode]</p>", { shortcodes: [ "shortcode" ] } );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 1 );
	} );

	it( "should not recognize heading as paragraph", function() {
		const mockPaper = new Paper( "<h2>Lorem ipsum dolor sit amet</h2>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 0 );
	} );

	it( "should not count an empty paragraph", function() {
		const mockPaper = new Paper( "<p></p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 0 );
	} );

	it( "should not count an empty paragraph without p tags or double line breaks", function() {
		const mockPaper = new Paper( "" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 0 );
	} );
} );

describe( "a test for getting paragraph length of a text with image(s)", () => {
	it( "should not count a paragraph containing only an image", function() {
		// The paper contains 3 paragraphs: 2 paragraphs with text and one paragraph with only an image.
		const mockPaper = new Paper( "<p>test</p><p><img src='image.com/image.png' /></p><p>more text</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 2 );
	} );

	it( "should return 0 for paragraphs count when all paragraphs only contain images", function() {
		const mockPaper = new Paper( "<p><img src='image.com/image.png' /></p><p><img src='image.com/image.png' /></p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 0 );
	} );

	it( "should not include the image in the paragraph length calculation", function() {
		const mockPaper = new Paper( "<p><img src='image.com/image.png' />test</p><p><img src='image.com/image.png' /> test </p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const paragraphLengths = getParagraphLength( mockPaper, mockResearcher );

		expect( paragraphLengths.length ).toBe( 2 );
		expect( paragraphLengths[ 0 ].paragraphLength ).toBe( 1 );
	} );
} );
