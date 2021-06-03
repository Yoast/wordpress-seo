import { setSettings, SET_SETTINGS } from "../../../src/redux/actions/settings";


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
