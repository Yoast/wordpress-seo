import settingsReducer from "../../../src/redux/reducers/settings";
import { SET_SETTINGS, updateSettings } from "../../../src/redux/actions";

describe( settingsReducer, () => {
	it( "returns the state with the settings when action.type is SET_SETTINGS", () => {
		const state = {};

		const action = { type: SET_SETTINGS, settings: { test: "test" } };
		const expected = { test: "test" };
		const actual = settingsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "returns an empty object when the action.type is NOT SET_SETTINGS", () => {
		const state = {};
		const SET_NOTHING = "SET_NOTHING";
		const action = { type: SET_NOTHING, settings: { test: "test" } };
		const expected = {};
		const actual = settingsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "updates the settings data for snippet editor", () => {
		const state = {};

		const action = updateSettings( { baseUrl: "https://basic.wordpress.test/collections/" } );
		const expected = { snippetEditor: { baseUrl: "https://basic.wordpress.test/collections/" } };
		const actual = settingsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
