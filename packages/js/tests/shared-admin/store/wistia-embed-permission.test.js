import apiFetch from "@wordpress/api-fetch";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../../src/shared-admin/constants";
import {
	getInitialWistiaEmbedPermissionState,
	WISTIA_EMBED_PERMISSION_NAME,
	wistiaEmbedPermissionActions,
	wistiaEmbedPermissionControls,
	wistiaEmbedPermissionReducer,
	wistiaEmbedPermissionSelectors,
} from "../../../src/shared-admin/store";

describe( "wistiaEmbedPermission", () => {
	it( "WISTIA_EMBED_PERMISSION_NAME is wistiaEmbedPermission", () => {
		expect( WISTIA_EMBED_PERMISSION_NAME ).toBe( "wistiaEmbedPermission" );
	} );

	describe( "actions", () => {
		describe( "setWistiaEmbedPermission", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionActions.setWistiaEmbedPermission ).toBeTruthy();
			} );

			it( "creates multiple setWistiaEmbedPermission action objects", () => {
				const generator = wistiaEmbedPermissionActions.setWistiaEmbedPermission( true );

				let result = generator.next();
				expect( result.done ).toBe( false );
				expect( result.value ).toEqual( {
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				} );

				result = generator.next();
				expect( result.done ).toBe( false );
				expect( result.value ).toEqual( {
					payload: true,
					type: `${ WISTIA_EMBED_PERMISSION_NAME }`,
				} );

				result = generator.next();
				expect( result.done ).toBe( true );
				expect( result.value ).toEqual( {
					payload: { value: true },
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
				} );
			} );

			it( "creates multiple setWistiaEmbedPermission action objects and fails", () => {
				const generator = wistiaEmbedPermissionActions.setWistiaEmbedPermission( true );

				let result = generator.next();
				expect( result.done ).toBe( false );
				expect( result.value ).toEqual( {
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.request }`,
				} );

				result = generator.next();
				expect( result.done ).toBe( false );
				expect( result.value ).toEqual( {
					payload: true,
					type: `${ WISTIA_EMBED_PERMISSION_NAME }`,
				} );

				result = generator.throw( "foo" );
				expect( result.done ).toBe( true );
				expect( result.value ).toEqual( {
					payload: { error: "foo", value: true },
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
				} );
			} );
		} );

		describe( "setWistiaEmbedPermissionValue", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionActions.setWistiaEmbedPermissionValue ).toBeTruthy();
			} );

			it( "creates a setWistiaEmbedPermissionValue action object", () => {
				expect( wistiaEmbedPermissionActions.setWistiaEmbedPermissionValue( true ) ).toEqual( {
					payload: true,
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/setWistiaEmbedPermissionValue`,
				} );
			} );
		} );
	} );

	describe( "initial state", () => {
		it( "has a default state", () => {
			expect( getInitialWistiaEmbedPermissionState() ).toEqual( {
				value: false,
				status: ASYNC_ACTION_STATUS.idle,
				error: {},
			} );
		} );
	} );

	describe( "reducer", () => {
		it( "returns the initial state", () => {
			expect( wistiaEmbedPermissionReducer( undefined, {} ) ).toEqual( getInitialWistiaEmbedPermissionState() );
		} );

		describe( "setWistiaEmbedPermissionValue", () => {
			test.each( [
				// Happy path with boolean.
				[ true, true ],
				[ false, false ],
				// Truthy with different types.
				[ true, "string" ],
				[ true, {} ],
				[ true, [] ],
				[ true, Object ],
				// Falsy with different types.
				[ false, "" ],
				[ false, null ],
				[ false, undefined ],
			] )( "returns the value %p when the input value is %p", ( expected, input ) => {
				expect( wistiaEmbedPermissionReducer( {}, wistiaEmbedPermissionActions.setWistiaEmbedPermissionValue( input ) ) )
					.toEqual( { value: expected } );
			} );
		} );

		describe( "wistiaEmbedPermission/request", () => {
			it( "returns the loading status", () => {
				expect( wistiaEmbedPermissionReducer( {}, { type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.request }` } ) )
					.toEqual( { status: ASYNC_ACTION_STATUS.loading } );
			} );
		} );

		describe( "wistiaEmbedPermission/success", () => {
			test.each( [
				// Happy path with boolean.
				[ true, { value: true } ],
				[ false, { value: false } ],
				// Truthy with different types.
				[ true, { value: "string" } ],
				[ true, { value: {} } ],
				[ true, { value: [] } ],
				[ true, { value: Object } ],
				// Falsy with different types.
				[ false, { value: "" } ],
				[ false, { value: null } ],
				[ false, { value: undefined } ],
				// The above, but without the object with value key.
				[ false, true ],
				[ false, false ],
				[ false, "string" ],
				[ false, {} ],
				[ false, [] ],
				[ false, Object ],
				[ false, "" ],
				[ false, null ],
				[ false, undefined ],
			] )( "returns the value %p when the input value is %p", ( expected, input ) => {
				expect( wistiaEmbedPermissionReducer( {}, {
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.success }`,
					payload: input,
				} ) )
					.toEqual( { status: ASYNC_ACTION_STATUS.success, value: expected } );
			} );
		} );

		describe( "wistiaEmbedPermission/error", () => {
			test.each( [
				// Happy path with boolean.
				[ true, { value: true } ],
				[ false, { value: false } ],
				// Truthy with different types.
				[ true, { value: "string" } ],
				[ true, { value: {} } ],
				[ true, { value: [] } ],
				[ true, { value: Object } ],
				// Falsy with different types.
				[ false, { value: "" } ],
				[ false, { value: null } ],
				[ false, { value: undefined } ],
				// The above, but without the object with value key.
				[ false, true ],
				[ false, false ],
				[ false, "string" ],
				[ false, {} ],
				[ false, [] ],
				[ false, Object ],
				[ false, "" ],
				[ false, null ],
				[ false, undefined ],
			] )( "returns the value %p when the input value is %p", ( expectedValue, inputValue ) => {
				expect( wistiaEmbedPermissionReducer( {}, {
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
					payload: inputValue,
				} ) )
					.toEqual( { status: ASYNC_ACTION_STATUS.error, value: expectedValue, error: { code: 500, message: "Unknown" } } );
			} );

			test.each( [
				// Happy path with code and message.
				[ { code: 401, message: "Unauthorized" }, { error: { code: 401, message: "Unauthorized" } } ],
				// Only code, only message, no code or message.
				[ { code: 404, message: "Unknown" }, { error: { code: 404 } } ],
				[ { code: 500, message: "foo" }, { error: { message: "foo" } } ],
				[ { code: 500, message: "Unknown" }, { error: {} } ],
				// Different types as value.
				[ { code: 500, message: "Unknown" }, { error: "string" } ],
				[ { code: 500, message: "Unknown" }, { error: true } ],
				[ { code: 500, message: "Unknown" }, { error: [] } ],
				[ { code: 500, message: "Unknown" }, { error: Object } ],
				[ { code: 500, message: "Unknown" }, { error: null } ],
				// Different type altogether.
				[ { code: 500, message: "Unknown" }, "string" ],
				[ { code: 500, message: "Unknown" }, true ],
				[ { code: 500, message: "Unknown" }, {} ],
				[ { code: 500, message: "Unknown" }, [] ],
				[ { code: 500, message: "Unknown" }, Object ],
				[ { code: 500, message: "Unknown" }, null ],
			] )( "returns the error %p when the input error is %p", ( expectedError, inputError ) => {
				expect( wistiaEmbedPermissionReducer( {}, {
					type: `${ WISTIA_EMBED_PERMISSION_NAME }/${ ASYNC_ACTION_NAMES.error }`,
					payload: inputError,
				} ) )
					.toEqual( { status: ASYNC_ACTION_STATUS.error, value: false, error: expectedError } );
			} );
		} );
	} );

	describe( "selectors", () => {
		const mockState = {
			[ WISTIA_EMBED_PERMISSION_NAME ]: {
				value: true,
				status: ASYNC_ACTION_STATUS.success,
				error: {
					code: 500,
					message: "Error",
				},
			},
		};

		describe( "selectWistiaEmbedPermission", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermission ).toBeTruthy();
			} );

			it( "returns a value and status by default", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermission( {} ) )
					.toEqual( { value: false, status: ASYNC_ACTION_STATUS.idle } );
			} );

			it( "returns the full state", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermission( mockState ) )
					.toEqual( mockState[ WISTIA_EMBED_PERMISSION_NAME ] );
			} );
		} );

		describe( "selectWistiaEmbedPermissionValue", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionValue ).toBeTruthy();
			} );

			it( "return false by default", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionValue( {} ) ).toBe( false );
			} );

			it( "returns the value", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionValue( mockState ) )
					.toBe( mockState[ WISTIA_EMBED_PERMISSION_NAME ].value );
			} );
		} );

		describe( "selectWistiaEmbedPermissionStatus", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionStatus ).toBeTruthy();
			} );

			it( "returns idle by default", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionStatus( {} ) ).toBe( ASYNC_ACTION_STATUS.idle );
			} );

			it( "returns the status", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionStatus( mockState ) )
					.toBe( mockState[ WISTIA_EMBED_PERMISSION_NAME ].status );
			} );
		} );

		describe( "selectWistiaEmbedPermissionError", () => {
			it( "exists", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionError ).toBeTruthy();
			} );

			it( "returns an empty object by default", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionError( {} ) ).toEqual( {} );
			} );

			it( "returns the error object", () => {
				expect( wistiaEmbedPermissionSelectors.selectWistiaEmbedPermissionError( mockState ) )
					.toEqual( mockState[ WISTIA_EMBED_PERMISSION_NAME ].error );
			} );
		} );
	} );

	describe( "controls", () => {
		describe( "wistiaEmbedPermission", () => {
			beforeEach( () => {
				apiFetch.mockClear();
			} );

			it( "exists", () => {
				expect( wistiaEmbedPermissionControls.wistiaEmbedPermission ).toBeTruthy();
			} );

			test.each( [
				// Happy path with boolean.
				[ true, { payload: true } ],
				[ false, { payload: false } ],
				// Truthy with different types.
				[ true, { payload: "string" } ],
				[ true, { payload: {} } ],
				[ true, { payload: [] } ],
				[ true, { payload: Object } ],
				// Falsy with different types.
				[ false, { payload: "" } ],
				[ false, { payload: null } ],
				[ false, { payload: undefined } ],
				// The above, but without the object with payload key.
				[ false, true ],
				[ false, false ],
				[ false, "string" ],
				[ false, {} ],
				[ false, [] ],
				[ false, Object ],
				[ false, "" ],
			] )( "calls apiFetch with the value %p when passing %p", ( expected, input ) => {
				wistiaEmbedPermissionControls.wistiaEmbedPermission( input );
				expect( apiFetch ).toBeCalledWith( {
					path: "/yoast/v1/wistia_embed_permission",
					method: "POST",
					data: { value: expected },
				} );
			} );

			test.each( [
				[ null ],
				[ undefined ],
			] )( "throws a TypeError when passing %p", async( input ) => {
				expect.assertions( 2 );
				try {
					await wistiaEmbedPermissionControls.wistiaEmbedPermission( input );
				} catch ( e ) {
					expect( e ).toBeInstanceOf( TypeError );
				}
				expect( apiFetch ).toHaveBeenCalledTimes( 0 );
			} );
		} );
	} );
} );
