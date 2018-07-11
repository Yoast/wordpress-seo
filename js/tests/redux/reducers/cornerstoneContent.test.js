/* global describe, it, expect */

import { toggleCornerstoneContent } from "../../../src/redux/actions/cornerstoneContent";
import cornerstoneContentReducer from "../../../src/redux/reducers/cornerstoneContent";

describe( "cornerstone reducers", () => {
	describe( "cornerstoneContentReducer on receiving the TOGGLE_CORNERSTONE_CONTENT action", () => {
		it( "should set isCornerstoneContent's current value to true if it was false", () => {
			const state = false;
			const action = toggleCornerstoneContent();
			const expected = true;
			const actual = cornerstoneContentReducer( state, action );

			expect( actual ).toEqual( expected );
		} );

		it( "should set isCornerstoneContent's current value to false if it was true", () => {
			const state = true;
			const action = toggleCornerstoneContent();
			const expected = false;
			const actual = cornerstoneContentReducer( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );
} );
