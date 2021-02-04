import { dismissAlert } from "../../../src/redux/actions/dismissedAlerts";
import dismissedAlertsReducer from "../../../src/redux/reducers/dismissedAlerts";

describe( "dismissedAlerts reducer", () => {
	it( "adds an entry to the object when an alertKey is provided", () => {
		const window = {
			wpseoScriptData: {
				dismissedAlerts: { test1: true },
			},
		};
		const action = dismissAlert( "test2" );
		const expected = { test1: true, test2: true };
		const actual = dismissedAlertsReducer( window, action );

		expect( actual ).toEqual( expected );
	} );

	it( "doesn't change the state when the dismissedAlerts reducer is called with a bogus action", () => {
		const window = {
			wpseoScriptData: {
				dismissedAlerts: { test1: true },
			},
		};
		const expected = { test1: true };
		const actual = dismissedAlertsReducer( window, { type: "BOGUS_ACTION" } );

		expect( actual ).toEqual( expected );
	} );
} );
