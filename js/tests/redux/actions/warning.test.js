/* global describe, it, expect */

import * as actions from "../../../src/redux/actions/warning";

describe( "warning actions", () => {
	it( "setWarningMessage should return an action with the SET_WARNING_MESSAGE type and the message", () => {
		const actual = actions.setWarningMessage( [ "test message" ] );

		const expected = {
			type: actions.SET_WARNING_MESSAGE,
			message: [ "test message" ],
		};

		expect( actual ).toEqual( expected );
	} );
} );
