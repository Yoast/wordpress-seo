import { isFunction, isObject } from "lodash";
import { getLogger } from "loglevel";
import wrapTryCatchAroundAction from "../../src/worker/wrapTryCatchAroundAction";

let logger;

describe( "wrapTryAroundAction", function() {
	beforeEach( () => {
		logger = getLogger( "yoast-test" );
		// Mute the actual error logs.
		logger.error = jest.fn();
	} );

	test( "returns a function that calls the action", done => {
		const action = jest.fn();
		const wrapper = wrapTryCatchAroundAction( logger, action );

		expect( isFunction( wrapper ) ).toBe( true );

		wrapper().then( () => {
			expect( action ).toHaveBeenCalledTimes( 1 );

			done();
		} );
	} );

	test( "catches an error", done => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );
		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( result.error ).toBe( "Error: Testing error!" );

			done();
		} );
	} );

	test( "catches an error, with a stack", done => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );

		logger.debug = jest.fn();

		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( logger.debug ).toHaveBeenCalledTimes( 1 );
			expect( result.error ).toBe( "Error: Testing error!" );

			done();
		} );
	} );

	test( "catches an error, without a stack", done => {
		const action = () => {
			throw { name: "Error", message: "Testing error!" };
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );

		logger.debug = jest.fn();

		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( logger.debug ).toHaveBeenCalledTimes( 0 );
			expect( result.error ).toBe( "Error: Testing error!" );

			done();
		} );
	} );

	test( "catches an error, without a name and message", done => {
		const action = () => {
			throw "Testing error!";
		};
		const wrapper = wrapTryCatchAroundAction( logger, action );
		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( result.error ).toBe( "" );

			done();
		} );
	} );

	test( "set a message prefix", done => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action, "PREFIX" );

		// Mute the actual logs.
		logger.error = jest.fn();

		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( result.error ).toBe( "PREFIX\n\tError: Testing error!" );

			done();
		} );
	} );

	test( "works with console as logger", done => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( console, action );

		// Mute the actual logs.
		// eslint-disable-next-line no-console
		console.debug = jest.fn();
		console.error = jest.fn();

		wrapper().then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( result.error ).toBe( "Error: Testing error!" );
			// eslint-disable-next-line no-console
			expect( console.debug ).toHaveBeenCalledTimes( 1 );
			expect( console.error ).toHaveBeenCalledTimes( 1 );

			done();
		} );
	} );

	test( "Formats error message prefix based on payload.", done => {
		const action = () => {
			throw new Error( "Testing error!" );
		};
		const wrapper = wrapTryCatchAroundAction( logger, action, "Error while running %%name%%." );
		const id = 123;
		wrapper( id, {
			name: "someResearch",
		} ).then( result => {
			expect( isObject( result ) ).toBe( true );
			expect( result.error ).toBe( "Error while running someResearch.\n\tError: Testing error!" );

			done();
		} );
	} );
} );
