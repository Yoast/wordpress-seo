import linkSuggestionsReducer from "../linkSuggestions";
import { SET_LINK_SUGGESTIONS } from "../../actions/linkSuggestions";

describe( "SET_LINK_SUGGESTIONS action", () => {
	it( "Sets a default state if the state is undefined" , () => {
		const state = undefined;
		const action = {
			type: SET_LINK_SUGGESTIONS,
			linkSuggestions: [ "linkSuggestion1", "linkSuggestion2" ],
		};

		const expected = [ "linkSuggestion1", "linkSuggestion2" ];

		const actual = linkSuggestionsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets the linking suggestions in an empty state" , () => {
		const state = [];
		const action = {
			type: SET_LINK_SUGGESTIONS,
			linkSuggestions: [ "linkSuggestion1", "linkSuggestion2" ],
		};
		const expected = [ "linkSuggestion1", "linkSuggestion2" ];

		const actual = linkSuggestionsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites a non-empty state " , () => {
		const state = [ "oldSuggestion", "oldSuggestion2" ];
		const action = {
			type: SET_LINK_SUGGESTIONS,
			linkSuggestions: [ "linkSuggestion1", "linkSuggestion2" ],
		};
		const expected = [ "linkSuggestion1", "linkSuggestion2" ];

		const actual = linkSuggestionsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe ( "Faulty action " , () => {
	it( "Doesn't change the state when a faulty action is passed to the reducer" , () => {
		const state = [];
		const action = {
			type: "FAULTY",
		};
		const expected = state;

		const actual = linkSuggestionsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
