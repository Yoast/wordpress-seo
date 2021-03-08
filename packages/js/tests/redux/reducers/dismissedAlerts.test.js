/* global describe, it, expect */

import dismissedAlertsReducer from "../../../src/redux/reducers/dismissedAlerts";

describe( "dismissed alerts reducer", () => {
	it( "should should add the passed alertKey to the object with value true", () => {
		const state = {
			alert1: true,
			alert2: true,
		};
		const action = {
			alertKey: "alert3",
			type: "DISMISS_ALERT_SUCCESS",
		};
		const expected = {
			alert1: true,
			alert2: true,
			alert3: true,
		};
		const actual = dismissedAlertsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "should do nothing when provided something else then an alertKey", () => {
		const state = {
			alert1: true,
			alert2: true,
		};
		const action = {
			myCrap: "123abc",
			type: "DISMISS_ALERT_SUCCESS",
		};
		const expected = {
			alert1: true,
			alert2: true,
		};
		const actual = dismissedAlertsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "should do nothing when called with a bogus action", () => {
		const state = {
			alert1: true,
			alert2: true,
		};
		const action = {
			myCrap: "123abc",
			type: "BOGUS_ACTION",
		};
		const expected = {
			alert1: true,
			alert2: true,
		};
		const actual = dismissedAlertsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );
