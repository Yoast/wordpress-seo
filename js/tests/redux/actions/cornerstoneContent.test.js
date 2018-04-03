/* global describe, it, expect */

import * as actions from "../../../src/redux/actions/cornerstoneContent";

describe( "cornerstone actions", () => {
	it( "toggleCornerstoneContent should return an action with the TOGGLE_CORNERSTONE_CONTENT type", () => {
		const expected = {
			type: actions.TOGGLE_CORNERSTONE_CONTENT,
		};
		const actual = actions.toggleCornerstoneContent();

		expect( actual ).toEqual( expected );
	} );
} );
