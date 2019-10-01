import { SET_WORDS_FOR_INSIGHTS } from "../../actions/insights";
import { insightsReducer } from "../insights";

jest.mock( "../prominentWords", () => {
	return {
		wordsForInsightsReducer: jest.fn( () => {
			return { name: "wordsForInsightsReducer" };
		} ),
	};
} );

describe( "insightsReducer with a SET_WORDS_FOR_INSIGHTS action ", () => {
	it( "returns the correct reducers", () => {
		const state = {};
		const action = {
			type: SET_WORDS_FOR_INSIGHTS,
		};
		const expected = { prominentWords: { name: "wordsForInsightsReducer" } };

		const actual = insightsReducer( state, action );
		expect( actual ).toEqual( expected );
	} );
} );
