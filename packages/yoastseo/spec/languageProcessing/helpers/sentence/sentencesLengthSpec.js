import sentencesLength from "../../../../src/languageProcessing/helpers/sentence/sentencesLength";
import getSentencesFromTree from "../../../../src/languageProcessing/helpers/sentence/getSentencesFromTree";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../../src/values/Paper";
import buildTree from "../../../specHelpers/parse/buildTree";

describe( "A test to count sentence lengths.", function() {
	it( "should not return a length for an empty sentence", function() {
		const mockPaper = new Paper( "<p></p><p>A sentence</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockResearcher );

		expect( sentenceLengths.length ).toEqual( 1 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentence.text ).toEqual( "A sentence" );
	} );

	it( "should return the sentences and their length (the HTML tags should not be counted if present)", function() {
		const mockPaper = new Paper( "<p>A <strong>good</strong> text</p>" +
			"<p>this is a <span style='color: blue;'>string</span></p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockResearcher );

		expect( sentenceLengths.length ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 3 );
		expect( sentenceLengths[ 0 ].sentence.text ).toEqual( "A good text" );
		expect( sentenceLengths[ 1 ].sentenceLength ).toEqual( 4 );
		expect( sentenceLengths[ 1 ].sentence.text ).toEqual( "this is a string" );
	} );

	it( "should return the correct length for sentences containing hyphens", function() {
		const mockPaper = new Paper(
			"<p>My know-it-all mother-in-law made a state-of-the-art U-turn.</p>" +
			"<p>Her ex-husband found that low-key amazing.</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockResearcher );

		expect( sentenceLengths.length ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 7 );
		expect( sentenceLengths[ 1 ].sentenceLength ).toEqual( 6 );
	} );

	it( "should return the correct length for sentences containing hyphens, and disregard hyphens at the start/end", function() {
		const mockPaper = new Paper(
			"<p>---My know-it-all mother-in-law made a state-of-the-art U-turn-</p>" +
			"<p>- Her ex-husband found that low-key amazing ---</p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockResearcher );

		expect( sentenceLengths.length ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 7 );
		expect( sentenceLengths[ 1 ].sentenceLength ).toEqual( 6 );
	} );

	it( "should return the correct length for sentences containing leading and trailing spaces including the first and last token that is not spaces", function() {
		const mockPaper = new Paper(
			"<p> The first sentence.</p><p>The second sentence. </p>" );
		const mockResearcher = new EnglishResearcher( mockPaper );
		buildTree( mockPaper, mockResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockResearcher );

		expect( sentenceLengths.length ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 3 );
		expect( sentenceLengths[ 0 ].firstToken ).toEqual( { sourceCodeRange: { endOffset: 7, startOffset: 4 }, text: "The" } );
		expect( sentenceLengths[ 0 ].lastToken ).toEqual( { sourceCodeRange: { endOffset: 23, startOffset: 22 }, text: "." } );
		expect( sentenceLengths[ 1 ].sentenceLength ).toEqual( 3 );
		expect( sentenceLengths[ 1 ].firstToken ).toEqual( { sourceCodeRange: { endOffset: 33, startOffset: 30 }, text: "The" } );
		expect( sentenceLengths[ 1 ].lastToken ).toEqual( { sourceCodeRange: { endOffset: 50, startOffset: 49 }, text: "." } );
	} );

	it( "should return the sentences and their length for Japanese (so counting characters)", function() {
		const mockPaper = new Paper( "<p>自然おのずから存在しているもの</p>" +
			"<p>歩くさわやかな森 <span style='color: red;'> 自然 </span></p>" );
		const mockJapaneseResearcher = new JapaneseResearcher( mockPaper );
		buildTree( mockPaper, mockJapaneseResearcher );

		const sentenceLengths = sentencesLength( getSentencesFromTree( mockPaper ), mockJapaneseResearcher );

		expect( sentenceLengths.length ).toEqual( 2 );
		expect( sentenceLengths[ 0 ].sentenceLength ).toEqual( 15 );
		expect( sentenceLengths[ 0 ].sentence.text ).toEqual( "自然おのずから存在しているもの" );
		expect( sentenceLengths[ 1 ].sentenceLength ).toEqual( 10 );
		expect( sentenceLengths[ 1 ].sentence.text ).toEqual( "歩くさわやかな森  自然 " );
	} );
} );
