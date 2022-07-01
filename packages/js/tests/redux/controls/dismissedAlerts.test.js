import { DISMISS_ALERT } from "../../../src/redux/controls/dismissedAlerts";

describe( "dismissedAlerts controls", () => {
	it( "returns a new promise", async () => {
		const postRequest = jest.fn( ( action, payload, callback ) => callback() );

		global.wpseoApi = {
			post: postRequest,
		};

		const data = { alertKey: "my-test-alertkey" };

		// eslint-disable-next-line new-cap
		await DISMISS_ALERT( data );

		expect( postRequest ).toHaveBeenCalled();
		expect( postRequest ).toHaveBeenCalledWith(
			"alerts/dismiss",
			expect.objectContaining( {
				key: "my-test-alertkey",
			} ),
			expect.anything()
		);
	} );
} );
