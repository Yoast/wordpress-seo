import settingsReducer from "../../../src/redux/reducers/settings";
import { SET_SETTINGS } from "../../../src/redux/actions/settings";

describe( settingsReducer, () => {
	it( "Returns the state with the settings when action.type is SET_SETTINGS", () => {
		const state = {};

		const action = { type: SET_SETTINGS, settings: { test: "test" } };
		const expected = { test: "test" };
		const actual = settingsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "Returns an empty object when the action.type is NOT SET_SETTINGS", () => {
		const state = {};
		const SET_NOTHING = "SET_NOTHING";
		const action = { type: SET_NOTHING, settings: { test: "test" } };
		const expected = {};
		const actual = settingsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
