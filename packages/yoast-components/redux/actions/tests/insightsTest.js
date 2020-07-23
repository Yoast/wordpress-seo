import { SET_WORDS_FOR_INSIGHTS, setWordsForInsights } from "../insights";

describe( "setWordsForInsights action creator", function() {
	it( "creates the setWordsForInsights action", function() {
		const wordsForInsights = [ "prominent word 1", "prominent word 2", "prominent word 3",
			"prominent word 4", "prominent word 5", "prominent word 6" ];

		const expected = {
			type: SET_WORDS_FOR_INSIGHTS,
			wordsForInsights: wordsForInsights,
		};
		const actual = setWordsForInsights( wordsForInsights );
		expect( actual ).toEqual( expected );
	} );
} );
