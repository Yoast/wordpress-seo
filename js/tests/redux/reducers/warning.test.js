/* global describe, it, expect */

import { setWarningMessage } from "../../../src/redux/actions/warning";
import warning from "../../../src/redux/reducers/warning";

describe( "warning reducer", () => {
	describe( "warningReducer on receiving the SET_WARNING_MESSAGE action", () => {
		it( "should set the message in the warning state", () => {
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
