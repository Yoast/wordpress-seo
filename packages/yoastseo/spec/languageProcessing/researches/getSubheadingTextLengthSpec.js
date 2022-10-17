import foundSubheadingsTextLength from "../../../src/languageProcessing/researches/getSubheadingTextLengths.js";
import Paper from "../../../src/values/Paper.js";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";

describe( "gets the length of text segments", function() {


	it( "returns an array with text segments for a text with one subheading", function() {
		const mockPaper = new Paper( "<h1>test</h1>one two three" );
		const englishResearcher = new EnglishResearcher( mockPaper );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings.length ).toBe( 1 );
		// Check the content and length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h1>test</h1>" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].text ).toBe( "one two three" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 3 );
	} );

	it( "returns an array with one text segment length for a text without subheadings", function() {
		const mockPaper = new Paper( "one two three" );
		const englishResearcher = new EnglishResearcher( mockPaper );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings.length ).toBe( 0 );
	} );

	it( "returns an array with 2 entries for a text with two subheadings and two text segments", function() {
		const mockPaper = new Paper( "<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		const englishResearcher = new EnglishResearcher( mockPaper );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings.length ).toBe( 2 );
		// Check the length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h2>one</h2>" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].text ).toBe( " two three" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].subheading ).toBe( "<h3>four</h3>" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 2 );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].text ).toBe( "this is a text string with a number of words" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].countLength ).toBe( 10 );
	} );

	it( "returns an array with 3 entries for a text with two subheadings, two text segments, and one introductory segment", function() {
		const mockPaper = new Paper( "some text<h2>one</h2> two three<h3>four</h3>this is a text string with a number of words" );
		const englishResearcher = new EnglishResearcher( mockPaper );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings.length ).toBe( 2 );
		// Check the length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).textBeforeFirstSubheadingLength ).toBe( 2 );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h2>one</h2>" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].text ).toBe( " two three" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 2 );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].subheading ).toBe( "<h3>four</h3>" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].text ).toBe( "this is a text string with a number of words" );
		expect( foundSubheadingsTextLength( mockPaper, englishResearcher ).foundSubheadings[ 1 ].countLength ).toBe( 10 );
	} );
} );

describe( "gets the length of text segments expressed in characters " +
	"when there is a character count function helper available on the researcher", function() {
	// The Japanese researcher has a customCountLength help function that overwrites the default word count help function.
	const japaneseResearcher = new JapaneseResearcher();

	it( "returns an array with lengths for a text with one subheading", function() {
		const mockPaper = new Paper( "<h1>タイトル</h1>文章です。" );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings.length ).toBe( 1 );
		// Check the content and length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h1>タイトル</h1>" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].text ).toBe( "文章です。" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 5 );
	} );

	it( "returns an array with one text segment for a text without subheadings", function() {
		const mockPaper = new Paper( "文章です。" );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings.length ).toBe( 0 );
	} );

	it( "returns an array with 2 text segments for a text with two subheadings and two text segments", function() {
		const mockPaper = new Paper( "<h2>犬</h2>犬はかわいいです。<h3>子犬</h3>子犬が特にかわいいです。" );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings.length ).toBe( 2 );
		// Check the content and length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h2>犬</h2>" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].text ).toBe( "犬はかわいいです。" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 9 );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].subheading ).toBe( "<h3>子犬</h3>" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].text ).toBe( "子犬が特にかわいいです。" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].countLength ).toBe( 12 );
	} );

	it( "returns an array with 3 entries for a text with two subheadings, two text segments, and one introductory segment", function() {
		const mockPaper = new Paper( "トピックは犬です。<h2>犬</h2>犬はかわいいです。<h3>子犬</h3>子犬が特にかわいいです。" );
		// Check the total number of subheading blocks.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings.length ).toBe( 2 );
		// Check the length of each individual text segment.
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).textBeforeFirstSubheadingLength ).toBe( 9 );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].subheading ).toBe( "<h2>犬</h2>" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].text ).toBe( "犬はかわいいです。" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 0 ].countLength ).toBe( 9 )
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].subheading ).toBe( "<h3>子犬</h3>" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].text ).toBe( "子犬が特にかわいいです。" );
		expect( foundSubheadingsTextLength( mockPaper, japaneseResearcher ).foundSubheadings[ 1 ].countLength ).toBe( 12 );
	} );
} );
