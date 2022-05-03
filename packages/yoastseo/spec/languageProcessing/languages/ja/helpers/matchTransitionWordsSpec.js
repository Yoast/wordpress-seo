import matchTransitionWords from "../../../../../src/languageProcessing/languages/ja/helpers/matchTransitionWords";


describe( "test for matching Japanese transition words in a sentence", function() {
	it( "returns an empty array for the matches if the transition word is not found in the sentence", function() {
		const words = matchTransitionWords( "これは例文です。", [ [ "よって" ] ] );

		expect( words ).toEqual( [] );
	} );

	it( "returns an array with the word if the transition word can be found in the text", function() {
		// https://tatoeba.org/en/sentences/show/108194
		const words = matchTransitionWords( "彼は金持ちだった、だから大邸宅が買えた。", [ [ "だから" ] ] );

		expect( words ).toEqual( [ [ "だから" ] ] );
	} );

	it( "returns an array with all the matches of a transition word found in the text", function() {
		// https://tatoeba.org/en/sentences/show/4815
		const words = matchTransitionWords( "その後私はそこを出るんだけど、鞄を忘れてきたことに気付くんだ。", [ [ "その", "後" ], [ "だけど" ] ] );

		expect( words ).toEqual( [ [ "その", "後" ], [ "だけど" ] ] );
	} );
} );
