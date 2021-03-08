import { DISMISS_ALERT, dismissAlert } from "../../../src/redux/actions/dismissedAlerts";

describe( "generator test", () => {
	it( "should call generator function", function() {
		const expected = {
			alertKey: "my-test-alertKey",
			type: DISMISS_ALERT,
		};
		const alertKey = "my-test-alertKey";
		const generator = dismissAlert( alertKey );

		expect( generator.next().value ).toEqual( expected );
	} );
} );
