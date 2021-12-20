import getKeyphraseLength from "../../../../../src/languageProcessing/languages/ja/customResearches/getKeyphraseLength";
import Paper from "../../../../../src/values/Paper";

describe( "test for calculating the Japanese keyphrase length research", function() {
	it( "returns the length of the keyphrase without function word(s)", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。", { keyword: "猫用フード" } );

		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 5 );
	} );

	it( "returns the length of the keyphrase with function word(s): the function word(s) is also included in the calculation", function() {
		const mockPaper = new Paper( "私の猫はかわいいです。", { keyword: "猫用のフード" } );

		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 6 );
	} );

	it( "returns the length of the keyphrase that contains space(s): the space(s) " +
		"should not be included in the calculation", function() {
		const mockPaper = new Paper( "", { keyword: "小さい花 の 刺繍" } );

		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 7 );
	} );

	it( "returns the length of the keyphrase that contains punctuation: the punctuation " +
		"should not be included in the calculation", function() {
		const mockPaper = new Paper( "", { keyword: "小さい花の刺繍。" } );

		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 7 );
	} );

	it( "returns 0 if the keyword is empty or not set", function() {
		let mockPaper = new Paper( "", { keyword: "" } );
		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 0 );

		mockPaper = new Paper( "" );
		expect( getKeyphraseLength( mockPaper ).keyphraseLength ).toBe( 0 );
	} );
} );
