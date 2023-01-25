import { isAlertDismissed } from "../../../src/redux/selectors/dismissedAlerts";

describe( "isAlertDismissed Selector", () => {
	it( "returns true when the provided Alertkey is present and true", () => {
		const state = {
			dismissedAlerts: {
				test1: true,
			},
		};
		const alertKey = "test1";
		const expected = true;
		const actual = isAlertDismissed( state, alertKey );

		expect( actual ).toBe( expected );
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

		expect( actual ).toBe( expected );
	} );

	it( "returns false when the provided Alertkey is present but it's value isn't a true boolean", () => {
		const state = {
			dismissedAlerts: {
				test1: "true",
			},
		};
		const alertKey = "test1";
		const expected = false;
		const actual = isAlertDismissed( state, alertKey );

		expect( actual ).toBe( expected );
	} );
} );
