import { toggleAlertStatus, alertCenterActions, alertCenterSelectors } from "../../../src/dashboard/store/alert-center";

describe( "toggleAlertStatus", () => {
	it( "should dispatch the request action", () => {
		const id = "alertId";
		const nonce = "alertNonce";
		const hidden = false;

		const generator = toggleAlertStatus( id, nonce, hidden );

		expect( generator.next().value ).toEqual( {
			type: "toggleAlertVisibility/request",
		} );
	} );

	it( "should dispatch the success action with the correct payload", () => {
		const id = "alertId";
		const nonce = "alertNonce";
		const hidden = false;

		const generator = toggleAlertStatus( id, nonce, hidden );

		generator.next();

		const successAction = generator.next().value;

		expect( successAction.type ).toEqual( "toggleAlertVisibility" );
		expect( successAction.payload.id ).toEqual( id );
		expect( successAction.payload.nonce ).toEqual( nonce );
		expect( successAction.payload.hidden ).toEqual( hidden );
	} );
} );

describe( "alertCenterActions", () => {
	it( "should have the toggleAlert action", () => {
		expect( alertCenterActions.toggleAlert ).toBeDefined();
		expect( alertCenterActions.toggleAlertStatus ).toBeDefined();
	} );
} );

describe( "alertCenterSelectors", () => {
	it( "should have the selectActiveNotifications selector", () => {
		expect( alertCenterSelectors.selectActiveNotifications ).toBeDefined();
	} );

	it( "should have the selectDismissedNotifications selector", () => {
		expect( alertCenterSelectors.selectDismissedNotifications ).toBeDefined();
	} );

	it( "should have the selectActiveProblems selector", () => {
		expect( alertCenterSelectors.selectActiveProblems ).toBeDefined();
	} );

	it( "should have the selectDismissedProblems selector", () => {
		expect( alertCenterSelectors.selectDismissedProblems ).toBeDefined();
	} );
} );


