import { describe, expect, it } from "@jest/globals";
import { ALERT_CENTER_NAME, alertCenterActions, alertCenterReducer, alertCenterSelectors } from "../../../src/general/store/alert-center";

it( "ALERT_CENTER_NAME is alertCenter", () => {
	expect( ALERT_CENTER_NAME ).toBe( "alertCenter" );
} );

describe( "actions", () => {
	describe( "removeAlert", () => {
		it( "should exist", () => {
			expect( alertCenterActions.removeAlert ).toBeDefined();
		} );

		it( "should return the action", () => {
			expect( alertCenterActions.removeAlert( "alertId" ) ).toEqual( { type: "alertCenter/removeAlert", payload: "alertId" } );
		} );
	} );

	it( "should have the toggleAlert action", () => {
		expect( alertCenterActions.toggleAlert ).toBeDefined();
	} );

	describe( "toggleAlertStatus", () => {
		it( "should exist", () => {
			expect( alertCenterActions.toggleAlertStatus ).toBeDefined();
		} );

		it( "should dispatch the request action", () => {
			const id = "alertId";
			const nonce = "alertNonce";
			const hidden = false;

			const generator = alertCenterActions.toggleAlertStatus( id, nonce, hidden );

			expect( generator.next().value ).toEqual( {
				type: "toggleAlertVisibility/request",
			} );
		} );

		it( "should dispatch the success action with the correct payload", () => {
			const id = "alertId";
			const nonce = "alertNonce";
			const hidden = false;

			const generator = alertCenterActions.toggleAlertStatus( id, nonce, hidden );

			generator.next();

			const successAction = generator.next().value;

			expect( successAction.type ).toEqual( "toggleAlertVisibility" );
			expect( successAction.payload.id ).toEqual( id );
			expect( successAction.payload.nonce ).toEqual( nonce );
			expect( successAction.payload.hidden ).toEqual( hidden );
		} );
	} );
} );

describe( "initial state", () => {
	it( "should have an empty alerts array and no error", () => {
		expect( alertCenterReducer( undefined, { type: "" } ) ).toEqual( { alerts: [], alertToggleError: null } );
	} );
} );

describe( "reducer", () => {
	describe( "removeAlert", () => {
		it( "should remove the alert", () => {
			const state = {
				alerts: [
					{ id: "alertId" },
				],
			};
			const newState = alertCenterReducer( state, alertCenterActions.removeAlert( "alertId" ) );
			expect( newState ).toEqual( { alerts: [] } );
		} );

		it( "should not change if trying to remove an unknown alert", () => {
			const state = {
				alerts: [
					{ id: "alertId" },
				],
			};
			const newState = alertCenterReducer( state, alertCenterActions.removeAlert( "unknown" ) );
			expect( newState ).toEqual( state );
		} );
	} );
} );

describe( "selectors", () => {
	const state = {
		[ ALERT_CENTER_NAME ]: {
			alerts: [
				{ id: "foo", type: "error", dismissed: false },
				{ id: "bar", type: "warning", dismissed: false },
				{ id: "baz", type: "error", dismissed: true },
				{ id: "qux", type: "warning", dismissed: true },
			],
			alertToggleError: "qux",
		},
	};

	describe( "selectActiveNotifications", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectActiveNotifications ).toBeDefined();
		} );

		it( "should return the active notifications", () => {
			expect( alertCenterSelectors.selectActiveNotifications( state ) ).toEqual( [
				{ id: "bar", type: "warning", dismissed: false },
			] );
		} );
	} );

	describe( "selectActiveProblems", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectActiveProblems ).toBeDefined();
		} );

		it( "should return the active problems", () => {
			expect( alertCenterSelectors.selectActiveProblems( state ) ).toEqual( [
				{ id: "foo", type: "error", dismissed: false },
			] );
		} );
	} );

	describe( "selectActiveAlertsCount", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectActiveAlertsCount ).toBeDefined();
		} );

		it( "should return the active alerts count", () => {
			expect( alertCenterSelectors.selectActiveAlertsCount( state ) ).toEqual( 2 );
		} );
	} );

	describe( "selectAlert", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectAlert ).toBeDefined();
		} );

		it( "should return the alert with the given id", () => {
			expect( alertCenterSelectors.selectAlert( state, "foo" ) ).toEqual( { id: "foo", type: "error", dismissed: false } );
		} );
	} );

	describe( "selectAlertToggleError", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectAlertToggleError ).toBeDefined();
		} );

		it( "should return the alert toggle error", () => {
			expect( alertCenterSelectors.selectAlertToggleError( state ) ).toEqual( "qux" );
		} );
	} );

	describe( "selectDismissedNotifications", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectDismissedNotifications ).toBeDefined();
		} );

		it( "should return the dismissed notifications", () => {
			expect( alertCenterSelectors.selectDismissedNotifications( state ) ).toEqual( [
				{ id: "qux", type: "warning", dismissed: true },
			] );
		} );
	} );

	describe( "selectDismissedProblems", () => {
		it( "should exist", () => {
			expect( alertCenterSelectors.selectDismissedProblems ).toBeDefined();
		} );

		it( "should return the dismissed problems", () => {
			expect( alertCenterSelectors.selectDismissedProblems( state ) ).toEqual( [
				{ id: "baz", type: "error", dismissed: true },
			] );
		} );
	} );
} );
