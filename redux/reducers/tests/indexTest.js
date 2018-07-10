import { SET_PROMINENT_WORDS } from "../../actions/insights";
import rootReducer from "../index";

jest.mock( "../insights", () => {
	return {
		insightsReducer: jest.fn( () => {
			return { name: "insightsReducer" };
		} ),
	};
} );

jest.mock( "../linkSuggestions", () => {
	return {
		linkSuggestionsReducer: jest.fn( () => {
			return { name: "linkSuggestionsReducer" };
		} ),
	};
} );

describe ( "rootReducer with a SET_PROMINENT_WORDS action ", () => {
	it( "returns the correct reducers", () => {
		const state = {};
		const action = {
			type: SET_PROMINENT_WORDS,
		};
		const expected = { insights: { name: "insightsReducer" }, linkSuggestions: { name: "linkSuggestionsReducer" } };

		const actual = rootReducer( state, action );
		expect( actual ).toEqual( expected );
	} );
} );
