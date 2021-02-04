import { DISMISS_ALERT, dismissAlert } from "../../../src/redux/actions/dismissedAlerts";

describe( "dismissedAlerts actions", () => {
	it( "returns a DISMISS_ALERT action with alertKey being the passed alertKey", () => {
		const expected = {
			type: DISMISS_ALERT,
			alertKey: "my-test-alertKey",
		};
		const actual = dismissAlert( "my-test-alertKey" );

		expect( actual ).toEqual( expected );
	} );
} );
