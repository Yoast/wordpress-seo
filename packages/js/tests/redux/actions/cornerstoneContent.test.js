/* global describe, it, expect */

import * as actions from "../../../src/redux/actions/cornerstoneContent";

jest.mock( "../../../src/helpers/fields/AnalysisFields.js", () => {
	return {};
} );

describe( "cornerstone actions", () => {
	it( "toggleCornerstoneContent should return an action with the TOGGLE_CORNERSTONE_CONTENT type", () => {
		const expected = {
			type: actions.TOGGLE_CORNERSTONE_CONTENT,
		};
		const actual = actions.toggleCornerstoneContent();

		expect( actual ).toEqual( expected );
	} );
} );
