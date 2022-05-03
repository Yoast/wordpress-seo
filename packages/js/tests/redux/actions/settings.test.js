import { setSettings, SET_SETTINGS, updateSettings, UPDATE_SETTINGS } from "../../../src/redux/actions";


describe( setSettings, () => {
	it( "Returns an object with the set settings", () => {
		const settings = {
			thisSetting: true,
		};

		const expected = {
			type: SET_SETTINGS,
			settings: { ...settings },

		};
		const actual = setSettings( settings );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "updateSettings for snippet editor", () => {
	it( "returns an action", () => {
		const newSettingsData = { baseUrl: " http://basic.wordpress.test/yoast-test-books/" };

		expect( updateSettings( newSettingsData ) ).toEqual( {
			type: UPDATE_SETTINGS,
			snippetEditor: newSettingsData,
		} );
	} );
} );
