import { SET_WORDS_FOR_INSIGHTS } from "../../actions/insights";
import { wordsForInsightsReducer } from "../prominentWords";

describe( "prominentWordsReducer with the SET_PROMINENT_WORDS action", () => {
	it( "sets the prominent words in an empty state", () => {
		const state = [];
		const action = {
			type: SET_WORDS_FOR_INSIGHTS,
			wordsForInsights: [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4", "prominent word 5" ],
		};
		const expected = [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4", "prominent word 5" ];

		const actual = wordsForInsightsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites a non-empty state ", () => {
		const state = [ "old prominent word 1", "old prominent word 2" ];
		const action = {
			type: SET_WORDS_FOR_INSIGHTS,
			wordsForInsights: [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4" ],
		};
		const expected = [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4" ];

		const actual = wordsForInsightsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "uses the default state when an undefined state is passed", () => {
		const action = {
			type: SET_WORDS_FOR_INSIGHTS,
			wordsForInsights: [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4", "prominent word 5" ],
		};
		const expected = [ "prominent word 1", "prominent word 2", "prominent word 3", "prominent word 4", "prominent word 5" ];

		// eslint-disable-next-line no-undefined
		const actual = wordsForInsightsReducer( undefined, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "prominentWordsReducer with a non-existing action ", () => {
	it( "doesn't change the state when a non-existing action is passed to the reducer", () => {
		const state = [ "prominent word 1", "prominent word 2" ];
		const action = {
			type: "NON_EXISTING_ACTION",
		};
		const expected = state;

		const actual = wordsForInsightsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
