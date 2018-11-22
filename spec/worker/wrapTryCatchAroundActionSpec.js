import { isFunction, isObject } from "lodash-es";
import { getLogger } from "loglevel";
import wrapTryCatchAroundAction from "../../src/worker/wrapTryCatchAroundAction";

let logger;

describe( "wrapTryAroundAction", () => {
	beforeEach( () => {
		logger = getLogger( "yoast-test" );
		// Mute the actual error logs.
		logger.error = jest.fn();
	} );

	test( "returns a function that calls the action", () => {
		const action = jest.fn();
		const wrapper = wrapTryCatchAroundAction( logger, action );

		expect( isFunction( wrapper ) ).toBe( true );

		wrapper();
		expect( action ).toHaveBeenCalledTimes( 1 );
	} );

	test( "catches an error", () => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );
		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( result.error ).toBe( "Error: Testing error!" );
	} );

	test( "catches an error, with a stack", () => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );

		logger.debug = jest.fn();

		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( logger.debug ).toHaveBeenCalledTimes( 1 );
		expect( result.error ).toBe( "Error: Testing error!" );
	} );

	test( "catches an error, without a stack", () => {
		const action = () => {
			throw { name: "Error", message: "Testing error!" };
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );

		logger.debug = jest.fn();

		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( logger.debug ).toHaveBeenCalledTimes( 0 );
		expect( result.error ).toBe( "Error: Testing error!" );
	} );

	test( "catches an error, without a name and message", () => {
		const action = () => {
			throw "Testing error!";
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );
		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( result.error ).toBe( "" );
	} );

	test( "set a message prefix", () => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action, "PREFIX" );

		// Mute the actual logs.
		logger.error = jest.fn();

		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( result.error ).toBe( "PREFIX\n\tError: Testing error!" );
	} );

	test( "works with console as logger", () => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( console, action );

		// Mute the actual logs.
		// eslint-disable-next-line no-console
		console.debug = jest.fn();
		// eslint-disable-next-line no-console
		console.error = jest.fn();

		const result = wrapper();

		expect( isObject( result ) ).toBe( true );
		expect( result.error ).toBe( "Error: Testing error!" );
		// eslint-disable-next-line no-console
		expect( console.debug ).toHaveBeenCalledTimes( 1 );
		// eslint-disable-next-line no-console
		expect( console.error ).toHaveBeenCalledTimes( 1 );
	} );
} );
