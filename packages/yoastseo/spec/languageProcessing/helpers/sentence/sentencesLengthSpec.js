import sentencesLength from "../../../../src/languageProcessing/helpers/sentence/sentencesLength";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import Paper from "../../../../src/values/Paper";

describe( "A test to count sentence lengths.", function() {
	it( "should not return a length for an empty sentence", function() {
		const sentences = [ "", "A sentence" ];
		const mockResearcher = new EnglishResearcher( new Paper( "" ) );

		const lengths = sentencesLength( sentences, mockResearcher );

		expect( lengths ).toEqual( [
			{ sentence: "A sentence", sentenceLength: 2 },
		] );
	} );

	it( "should return the sentences and their length (the HTML tags should not be counted if present)", function() {
		const sentences = [ "A <strong>good</strong> text", "this is a <span style='color: blue;'> textstring </span>" ];
		const mockResearcher = new EnglishResearcher( new Paper( "" ) );

		const lengths = sentencesLength( sentences, mockResearcher );

		expect( lengths ).toEqual( [
			{ sentence: "A <strong>good</strong> text", sentenceLength: 3 },
			{ sentence: "this is a <span style='color: blue;'> textstring </span>", sentenceLength: 4 },
		] );
	} );

	it( "should return the sentences and their length for Japanese (so counting characters)", function() {
		const sentences = [ "自然おのずから存在しているもの", "歩くさわやかな森 <span style='color: red;'> 自然 </span>" ];
		const mockJapaneseResearcher = new JapaneseResearcher( new Paper( "" ) );

		const lengths = sentencesLength( sentences, mockJapaneseResearcher );

		expect( lengths ).toEqual( [
			{ sentence: "自然おのずから存在しているもの", sentenceLength: 15 },
			{ sentence: "歩くさわやかな森 <span style='color: red;'> 自然 </span>", sentenceLength: 11 },
		] );
	} );
} );
