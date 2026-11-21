/* eslint-disable camelcase -- snake_case keys model the backend's REST request/response contract. */
import { describe, expect, it } from "@jest/globals";
import {
	getInitialMyyoastConnectionState,
	MYYOAST_CONNECTION_NAME,
	myyoastConnectionActions,
	myyoastConnectionReducer,
	myyoastConnectionSelectors,
	transformStatus,
} from "../../../../src/integrations-page/myyoast-connection/store/myyoast-connection";

it( "MYYOAST_CONNECTION_NAME is myyoastConnection", () => {
	expect( MYYOAST_CONNECTION_NAME ).toBe( "myyoastConnection" );
} );

describe( "transformStatus", () => {
	it( "returns the default status when the payload is empty", () => {
		expect( transformStatus( null ) ).toEqual( {
			isProvisioned: false,
			isRegistered: false,
			registeredAt: null,
			registeredAtIso: null,
			redirectUris: [],
			redirectUrisMatch: true,
		} );
	} );

	it( "maps the snake_case payload to the camelCase shape", () => {
		const status = transformStatus( {
			is_provisioned: true,
			is_registered: true,
			registered_at: 1700000000,
			registered_at_iso: "2023-11-14T22:13:20+00:00",
			redirect_uris: [
				{ uri: "https://example.com/callback", origin: "https://example.com", is_verified: true },
				{ uri: "https://example.com/other", origin: "https://example.com", is_verified: false },
			],
			redirect_uris_match: true,
		} );

		expect( status ).toEqual( {
			isProvisioned: true,
			isRegistered: true,
			registeredAt: 1700000000,
			registeredAtIso: "2023-11-14T22:13:20+00:00",
			redirectUris: [
				{ uri: "https://example.com/callback", origin: "https://example.com", isVerified: true },
				{ uri: "https://example.com/other", origin: "https://example.com", isVerified: false },
			],
			redirectUrisMatch: true,
		} );
	} );

	it( "defaults each redirect URI field when the entry is malformed", () => {
		const status = transformStatus( { redirect_uris: [ {}, null ] } );

		expect( status.redirectUris ).toEqual( [
			{ uri: "", origin: "", isVerified: false },
			{ uri: "", origin: "", isVerified: false },
		] );
	} );

	it( "treats a non-array redirect_uris as an empty list", () => {
		expect( transformStatus( { redirect_uris: "nope" } ).redirectUris ).toEqual( [] );
	} );

	it( "only reports redirectUrisMatch false when explicitly false", () => {
		// A missing or truthy value is treated as a match; only an explicit `false` flips it.
		expect( transformStatus( {} ).redirectUrisMatch ).toBe( true );
		expect( transformStatus( { redirect_uris_match: false } ).redirectUrisMatch ).toBe( false );
	} );
} );

describe( "initial state", () => {
	it( "is the empty connection state", () => {
		expect( myyoastConnectionReducer( undefined, { type: "" } ) ).toEqual( getInitialMyyoastConnectionState() );
	} );
} );

describe( "reducer", () => {
	describe( "startMyyoastAction", () => {
		it( "records the in-flight action and clears any previous error", () => {
			const state = { ...getInitialMyyoastConnectionState(), actionError: { errorCode: "boom" } };
			const next = myyoastConnectionReducer( state, myyoastConnectionActions.startMyyoastAction( "connect" ) );

			expect( next.actionInFlight ).toBe( "connect" );
			expect( next.actionError ).toBeNull();
		} );

		it( "ignores a second action while one is already in flight", () => {
			// Every action mutates the same registration, so a started action must
			// not be overwritten by another that begins before it finishes.
			const state = { ...getInitialMyyoastConnectionState(), actionInFlight: "connect" };
			const next = myyoastConnectionReducer( state, myyoastConnectionActions.startMyyoastAction( "disconnect" ) );

			expect( next.actionInFlight ).toBe( "connect" );
		} );
	} );

	describe( "finishMyyoastAction", () => {
		it( "clears the in-flight action", () => {
			const state = { ...getInitialMyyoastConnectionState(), actionInFlight: "connect" };
			const next = myyoastConnectionReducer( state, myyoastConnectionActions.finishMyyoastAction() );

			expect( next.actionInFlight ).toBeNull();
		} );
	} );

	describe( "setMyyoastStatus", () => {
		it( "stores the status payload", () => {
			const status = transformStatus( { is_registered: true } );
			const next = myyoastConnectionReducer( getInitialMyyoastConnectionState(), myyoastConnectionActions.setMyyoastStatus( status ) );

			expect( next.status ).toEqual( status );
		} );

		it( "leaves the status untouched for a falsy payload", () => {
			const state = { ...getInitialMyyoastConnectionState(), status: { isRegistered: true } };
			const next = myyoastConnectionReducer( state, myyoastConnectionActions.setMyyoastStatus( null ) );

			expect( next.status ).toEqual( { isRegistered: true } );
		} );
	} );

	describe( "clearMyyoastCallbackOutcome", () => {
		it( "clears the pending callback outcome", () => {
			const state = { ...getInitialMyyoastConnectionState(), pendingCallbackOutcome: { kind: "success", key: "connect_success" } };
			const next = myyoastConnectionReducer( state, myyoastConnectionActions.clearMyyoastCallbackOutcome() );

			expect( next.pendingCallbackOutcome ).toBeNull();
		} );
	} );
} );

describe( "selectors", () => {
	const status = transformStatus( { is_registered: true } );
	const state = {
		[ MYYOAST_CONNECTION_NAME ]: {
			status,
			actionInFlight: "connect",
			actionError: { errorCode: "boom" },
			pendingCallbackOutcome: { kind: "success", key: "connect_success" },
			linkParams: { php_version: "8.2" },
			endpoints: { authorize: "yoast/v1/myyoast/authorize" },
		},
	};

	it( "selectMyyoastConnectionStatus returns the stored status", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionStatus( state ) ).toEqual( status );
	} );

	it( "selectMyyoastConnectionStatus falls back to the default status when absent", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionStatus( {} ) ).toEqual( transformStatus( null ) );
	} );

	it( "selectMyyoastConnectionActionInFlight returns the in-flight action", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionActionInFlight( state ) ).toBe( "connect" );
	} );

	it( "selectMyyoastConnectionPendingCallbackOutcome returns the pending outcome", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionPendingCallbackOutcome( state ) ).toEqual( { kind: "success", key: "connect_success" } );
	} );

	it( "selectMyyoastConnectionLinkParams returns the link params", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionLinkParams( state ) ).toEqual( { php_version: "8.2" } );
	} );

	it( "selectMyyoastConnectionLinkParams falls back to an empty object when absent", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionLinkParams( {} ) ).toEqual( {} );
	} );

	it( "selectMyyoastConnectionEndpoint resolves an endpoint path by name", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionEndpoint( state, "authorize" ) ).toBe( "yoast/v1/myyoast/authorize" );
	} );

	it( "selectMyyoastConnectionEndpoint falls back to an empty string for an unknown name", () => {
		expect( myyoastConnectionSelectors.selectMyyoastConnectionEndpoint( state, "missing" ) ).toBe( "" );
	} );
} );

describe( "management actions", () => {
	// The generator yields plain control objects and slice actions, so it can be
	// driven by hand: `next( value )` feeds back what a control would have resolved
	// to, and the final `return` value is the result the UI layer consumes.
	const REQUEST_STATUS = { is_registered: true };

	describe( "connectMyyoastConnection", () => {
		it( "starts the action, dispatches the control, mirrors the status and finishes on success", () => {
			const generator = myyoastConnectionActions.connectMyyoastConnection( { foo: "bar" } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/startMyyoastAction", payload: "connect" } );

			expect( generator.next().value ).toEqual( { type: "connectMyyoastConnection", payload: { foo: "bar" } } );

			// Feed back the control's resolved payload; the status mirror is yielded next.
			expect( generator.next( { status: REQUEST_STATUS, message_key: "connect_success" } ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastStatus", payload: transformStatus( REQUEST_STATUS ) } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/finishMyyoastAction" } );

			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: true, messageKey: "connect_success" } );
		} );

		it( "returns the error code and details when the body carries an error_code", () => {
			const generator = myyoastConnectionActions.connectMyyoastConnection();
			generator.next();
			generator.next();

			// A precondition/upstream failure arrives as a 200 with an error_code body.
			expect( generator.next( { error_code: "rate_limited", details: { retry_after_seconds: 120 } } ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastActionError", payload: { actionName: "connect", errorCode: "rate_limited", message: "" } } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/finishMyyoastAction" } );

			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: false, errorCode: "rate_limited", details: { retry_after_seconds: 120 } } );
		} );

		it( "maps an aborted request to the timeout error and still finishes", () => {
			const generator = myyoastConnectionActions.connectMyyoastConnection();
			generator.next();
			generator.next();

			const abortError = new Error( "aborted" );
			abortError.name = "AbortError";

			expect( generator.throw( abortError ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastActionError", payload: { actionName: "connect", errorCode: "timeout", message: "" } } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/finishMyyoastAction" } );

			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: false, errorCode: "timeout" } );
		} );

		it( "maps any other thrown error to unexpected_error", () => {
			const generator = myyoastConnectionActions.connectMyyoastConnection();
			generator.next();
			generator.next();

			expect( generator.throw( new Error( "network down" ) ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastActionError", payload: { actionName: "connect", errorCode: "unexpected_error", message: "" } } );

			generator.next();
			expect( generator.next().value ).toEqual( { ok: false, errorCode: "unexpected_error" } );
		} );
	} );

	describe( "authorizeMyyoastSite", () => {
		it( "sends the return_url and returns the authorize URL on success", () => {
			const generator = myyoastConnectionActions.authorizeMyyoastSite( { returnUrl: "https://example.com/admin" } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/startMyyoastAction", payload: "authorize" } );

			expect( generator.next().value ).toEqual( { type: "authorizeMyyoastSite", payload: { return_url: "https://example.com/admin" } } );

			expect( generator.next( { authorize_url: "https://my.yoast.com/authorize" } ).value )
				.toEqual( { type: "myyoastConnection/finishMyyoastAction" } );

			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: true, authorizeUrl: "https://my.yoast.com/authorize" } );
		} );

		it( "omits the body when no return URL is given", () => {
			const generator = myyoastConnectionActions.authorizeMyyoastSite();
			generator.next();

			expect( generator.next().value ).toEqual( { type: "authorizeMyyoastSite", payload: {} } );
		} );

		it( "fails with unexpected_error when the success response has no authorize_url", () => {
			const generator = myyoastConnectionActions.authorizeMyyoastSite();
			generator.next();
			generator.next();

			expect( generator.next( {} ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastActionError", payload: { actionName: "authorize", errorCode: "unexpected_error", message: "" } } );

			expect( generator.next().value ).toEqual( { type: "myyoastConnection/finishMyyoastAction" } );

			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: false, errorCode: "unexpected_error" } );
		} );

		it( "returns the error code and details when the body carries an error_code", () => {
			const generator = myyoastConnectionActions.authorizeMyyoastSite();
			generator.next();
			generator.next();

			expect( generator.next( { error_code: "invalid_user" } ).value )
				.toEqual( { type: "myyoastConnection/setMyyoastActionError", payload: { actionName: "authorize", errorCode: "invalid_user", message: "" } } );

			generator.next();
			const final = generator.next();
			expect( final.done ).toBe( true );
			expect( final.value ).toEqual( { ok: false, errorCode: "invalid_user", details: undefined } );
		} );
	} );
} );
