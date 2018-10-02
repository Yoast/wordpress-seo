import { SET_PROMINENT_WORDS } from "../../actions/insights";
import { insightsReducer } from "../insights";

jest.mock( "../prominentWords", () => {
	return {
		prominentWordsReducer: jest.fn( () => {
			return { name: "prominentWordsReducer" };
		} ),
	};
} );

describe( "insightsReducer with a SET_PROMINENT_WORDS action ", () => {
	it( "returns the correct reducers", () => {
		const state = {};
		const action = {
			type: SET_PROMINENT_WORDS,
		};
		const expected = { prominentWords: { name: "prominentWordsReducer" } };

		const actual = insightsReducer( state, action );
		expect( actual ).toEqual( expected );
	} );
} );
