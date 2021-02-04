import { isAlertDismissed } from "../../../src/redux/selectors/dismissedAlerts";

describe( "isAlertDismissed Selector", () => {
	it( "returns true when the provided Alertkey is present", () => {
		const state = {
			dismissedAlerts: {
				test1: true,
			},
		};
		const alertKey = "test1";
		const expected = true;
		const actual = isAlertDismissed( state, alertKey );

		expect( actual ).toEqual( expected );
	} );

	it( "returns false when the provided Alertkey is not present", () => {
		const state = {
			dismissedAlerts: {
				test1: true,
			},
		};
		const alertKey = "not-present";
		const expected = false;
		const actual = isAlertDismissed( state, alertKey );

		expect( actual ).toEqual( expected );
	} );
} );
