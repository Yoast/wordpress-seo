/* global describe, it, expect */

import { setWarningMessage } from "../../../src/redux/actions/warning";
import warning from "../../../src/redux/reducers/warning";

describe( "warning reducer", () => {
	describe( "cornerstoneContentReducer on receiving the TOGGLE_CORNERSTONE_CONTENT action", () => {
		it( "should set isCornerstoneContent's current value to true if it was false", () => {
			const state = {
				key: "value",
			};
			const action = setWarningMessage( [ "test message" ] );
			const expected = {
				key: "value",
				message: [ "test message" ],
			};
			const actual = warning( state, action );

			expect( actual ).toEqual( expected );
		} );
	} );
} );
