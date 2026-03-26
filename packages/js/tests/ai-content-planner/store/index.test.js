import { createReduxStore, register } from "@wordpress/data";
import { setBannerDismissedInput, setBannerRenderedInput } from "../../../src/ai-content-planner/helpers/fields";
import { BANNER_NAME } from "../../../src/ai-content-planner/store/banner";
import { registerStore, STORE_NAME } from "../../../src/ai-content-planner/store/index";

jest.mock( "@wordpress/data", () => ( {
	createReduxStore: jest.fn( () => ( { storeDescriptor: true } ) ),
	register: jest.fn(),
	combineReducers: ( reducers ) => ( state = {}, action ) =>
		Object.keys( reducers ).reduce(
			( acc, key ) => ( { ...acc, [ key ]: reducers[ key ]( state[ key ], action ) } ),
			{}
		),
} ) );

jest.mock( "../../../src/ai-content-planner/helpers/fields", () => ( {
	setBannerRenderedInput: jest.fn(),
	setBannerDismissedInput: jest.fn(),
} ) );

/**
 * Extracts `persistBannerMiddleware` from the store config captured by the
 * `createReduxStore` mock. It is always the last entry appended after the
 * default middleware.
 *
 * @returns {Function} The persist-banner middleware.
 */
const getPersistMiddleware = () => {
	const config = createReduxStore.mock.calls[ 0 ][ 1 ];
	const middlewareArray = config.middleware( () => [] );
	return middlewareArray[ middlewareArray.length - 1 ];
};

beforeEach( () => {
	jest.clearAllMocks();
} );

describe( "registerStore", () => {
	it( "registers the store with the correct name", () => {
		registerStore();
		expect( createReduxStore ).toHaveBeenCalledWith( STORE_NAME, expect.any( Object ) );
		expect( register ).toHaveBeenCalledTimes( 1 );
	} );

	it( "uses the default initial state when none is provided", () => {
		registerStore();
		const config = createReduxStore.mock.calls[ 0 ][ 1 ];
		expect( config.initialState[ BANNER_NAME ].isBannerDismissed ).toBe( false );
		expect( config.initialState[ BANNER_NAME ].isBannerRendered ).toBe( false );
	} );

	it( "merges provided initial state over the defaults", () => {
		registerStore( { [ BANNER_NAME ]: { isBannerDismissed: true } } );
		const config = createReduxStore.mock.calls[ 0 ][ 1 ];
		expect( config.initialState[ BANNER_NAME ].isBannerDismissed ).toBe( true );
		expect( config.initialState[ BANNER_NAME ].isBannerRendered ).toBe( false );
	} );
} );

describe( "persistBannerMiddleware", () => {
	let next;

	beforeEach( () => {
		registerStore();
		next = jest.fn();
	} );

	it( "calls next(action) before the DOM side effect", () => {
		const callOrder = [];
		next.mockImplementation( () => callOrder.push( "next" ) );
		setBannerRenderedInput.mockImplementation( () => callOrder.push( "dom" ) );

		const action = { type: `${ BANNER_NAME }/setBannerRendered` };
		getPersistMiddleware()()( next )( action );

		expect( callOrder ).toEqual( [ "next", "dom" ] );
	} );

	it( "calls setBannerRenderedInput for setBannerRendered", () => {
		getPersistMiddleware()()( next )( { type: `${ BANNER_NAME }/setBannerRendered` } );
		expect( setBannerRenderedInput ).toHaveBeenCalledTimes( 1 );
		expect( setBannerDismissedInput ).not.toHaveBeenCalled();
	} );

	it( "calls setBannerDismissedInput for setBannerDismissed", () => {
		getPersistMiddleware()()( next )( { type: `${ BANNER_NAME }/setBannerDismissed` } );
		expect( setBannerDismissedInput ).toHaveBeenCalledTimes( 1 );
		expect( setBannerRenderedInput ).not.toHaveBeenCalled();
	} );

	it( "does not call any DOM helper for unrelated actions", () => {
		getPersistMiddleware()()( next )( { type: "some/otherAction" } );
		expect( setBannerRenderedInput ).not.toHaveBeenCalled();
		expect( setBannerDismissedInput ).not.toHaveBeenCalled();
	} );

	it( "returns the result of next(action)", () => {
		next.mockReturnValue( "nextResult" );
		const result = getPersistMiddleware()()( next )( { type: "some/action" } );
		expect( result ).toBe( "nextResult" );
	} );
} );
