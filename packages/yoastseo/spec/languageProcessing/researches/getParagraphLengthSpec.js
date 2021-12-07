import getParagraphLength from "../../../src/languageProcessing/researches/getParagraphLength.js";
import Paper from "../../../src/values/Paper.js";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher.js";
import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher.js";

describe( "a test for getting paragraph length", function() {
	it( "returns the paragraph length of a paragraph between p tags", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 2 );
	} );

	it( "returns the paragraph length of a paragraph in Japanese between p tags", function() {
		const mockPaper = new Paper( "<p>これに対し日本国有鉄道</p>" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 11 );
	} );

	it( "returns the paragraph length of two paragraphs divided by double linebreaks and ends with a double linebreak", function() {
		const mockPaper = new Paper( "Lorem \n\n ipsum two \n\n" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 1 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 1 ].countLength ).toBe( 2 );
	} );

	it( "returns the paragraph length of two paragraphs in Japanese divided by double linebreaks and ends with a double linebreak", function() {
		const mockPaper = new Paper( "1964年 \n\n （昭和39年） \n\n" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 5 );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 1 ].countLength ).toBe( 7 );
	} );

	it( "returns the paragraph length of two paragraphs divided by double linebreaks that don't end with a double linebreak", function() {
		const mockPaper = new Paper( "Lorem \n\n ipsum two" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 1 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 1 ].countLength ).toBe( 2 );
	} );

	it( "returns the paragraph length of two paragraphs in Japanese divided by double linebreaks that don't end with a double linebreak", function() {
		const mockPaper = new Paper( "1964年 \n\n （昭和39年）" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 5 );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 1 ].countLength ).toBe( 7 );
	} );

	it( "returns the paragraph length of a paragraph without tags or double linebreaks", function() {
		const mockPaper = new Paper( "Lorem ipsum dolor sit amet" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 5 );
	} );

	it( "returns the paragraph length of a paragraph in Japanese without tags or double linebreaks", function() {
		const mockPaper = new Paper( "東京オリンピック開会直前の1964年（昭和39年）10月1日に開業した。" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 36 );
	} );

	it( "returns the paragraph length of 2 paragraphs, both between p tags", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p><p>dolor sit amet</p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 2 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 1 ].countLength ).toBe( 3 );
	} );

	it( "returns the paragraph length of 2 paragraphs in Japanese, both between p tags", function() {
		const mockPaper = new Paper( "<p>東京オリンピック開会直前の1964年</p><p>（昭和39年）10月1日に開業した。</p>" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 18 );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 1 ].countLength ).toBe( 18 );
	} );

	it( "returns the paragraph length of 2 paragraphs, both between p tags, divided by double linebreaks", function() {
		const mockPaper = new Paper( "<p>Lorem ipsum</p> \n\n <p>dolor sit amet</p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 2 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 1 ].countLength ).toBe( 3 );
	} );

	it( "returns the paragraph length of 2 paragraphs in Japanese, both between p tags, divided by double linebreaks", function() {
		const mockPaper = new Paper( "<p>東京オリンピック開会直前の1964年</p> \n\n <p>（昭和39年）10月1日に開業した。</p>" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 18 );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 1 ].countLength ).toBe( 18 );
	} );

	it( "returns the paragraph length, with empty paragraphs", function() {
		const mockPaper = new Paper( "<p>test</p><p></p><p>more text</p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).length ).toBe( 2 );
	} );

	it( "returns the paragraph length, with paragraph with only image", function() {
		const mockPaper = new Paper( "<p>test</p><p><img src='image.com/image.png' /></p><p>more text</p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).length ).toBe( 2 );
	} );

	it( "returns the paragraph length, with paragraph with only image", function() {
		const mockPaper = new Paper( "<p><img src='image.com/image.png' /></p><p><img src='image.com/image.png' /></p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).length ).toBe( 0 );
	} );

	it( "returns the paragraph length, with paragraph with only image", function() {
		const mockPaper = new Paper( "<p><img src='image.com/image.png' />test</p><p><img src='image.com/image.png' /> test </p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).length ).toBe( 2 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 1 );
	} );

	it( "returns the paragraph length, with paragraph with only image", function() {
		const mockPaper = new Paper( "<p><img src='image.com/image.png' />test</p><p><img src='image.com/image.png' /> </p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).length ).toBe( 1 );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 1 );
	} );

	it( "returns the paragraph length of paragraph without p tags or double linebreaks, but with h2 tags", function() {
		const mockPaper = new Paper( "<h2>Lorem ipsum dolor sit amet</h2>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() )[ 0 ].countLength ).toBe( 5 );
	} );

	it( "returns the paragraph length of paragraph in Japanese without p tags or double linebreaks, but with h2 tags", function() {
		const mockPaper = new Paper( "<h2>（昭和39年）10月1日に開業した。</h2>" );
		expect( getParagraphLength( mockPaper, new JapaneseResearcher() )[ 0 ].countLength ).toBe( 18 );
	} );

	xit( "returns the paragraph length of an empty paragraph with p tags", function() {
		const mockPaper = new Paper( "<p></p>" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).countLength ).not.toContain( 0 );
	} );

	xit( "returns the paragraph length of an empty paragraph without p tags or double line breaks", function() {
		const mockPaper = new Paper( "" );
		expect( getParagraphLength( mockPaper, new EnglishResearcher() ).countLength ).not.toContain( 0 );
	} );
} );
