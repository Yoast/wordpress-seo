import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createFreezeReducer } from "../../../src/redux/utils/create-freeze-reducer";

describe( createFreezeReducer.name, () => {
	const testReducer = jest.fn( ( state, { type, payload } = {} ) => {
		switch ( type ) {
			case "change":
				return payload;
			default:
				return state;
		}
	} );

	afterEach( () => {
		testReducer.mockClear();
	} );

	it( "should return the freezeReducer and toggleFreeze functions", () => {
		const actual = createFreezeReducer( jest.fn() );

		expect( actual ).toBeInstanceOf( Object );
		expect( actual.freezeReducer ).toBeInstanceOf( Function );
		expect( actual.toggleFreeze ).toBeInstanceOf( Function );
	} );

	it( "should return the initial state", () => {
		const initialState = "foo";
		const { freezeReducer } = createFreezeReducer( testReducer, initialState );

		expect( freezeReducer( undefined, {} ) ).toBe( initialState );
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( testReducer ).toHaveBeenCalledWith( initialState, {} );
	} );

	it( "should handle an action", () => {
		const state = "foo";
		const action = { type: "change", payload: "bar" };
		const { freezeReducer } = createFreezeReducer( testReducer );

		expect( freezeReducer( state, action ) ).toBe( "bar" );
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( testReducer ).toHaveBeenCalledWith( state, action );
	} );

	it( "should return the frozen state", () => {
		const state = "foo";
		const action = { type: "change", payload: "bar" };
		const { freezeReducer, toggleFreeze } = createFreezeReducer( testReducer );
		toggleFreeze( () => state, true );

		// Verify that the reducer ignores the state and action and just returns the frozen state.
		expect( freezeReducer( "ignoring the change action here", action ) ).toBe( state );
		// Verify it is not actually calling the wrapped reducer.
		expect( testReducer ).toHaveBeenCalledTimes( 0 );
	} );

	it( "should handle unfreeze", () => {
		let state = "foo";
		const action = { type: "change", payload: "bar" };
		const { freezeReducer, toggleFreeze: unboundToggleFreeze } = createFreezeReducer( testReducer );

		// Mimic a Redux store' getState function.
		/**
		 * @returns {string} The state.
		 */
		const getState = () => state;

		// Bind the getState function to the toggleFreeze function. Similar to how we would use it in a real application.
		const toggleFreeze = unboundToggleFreeze.bind( null, getState );
		toggleFreeze( true );

		// Verify that the reducer ignores the state and action and just returns the frozen state.
		state = freezeReducer( "ignoring the change action here", action );
		expect( state ).toBe( "foo" );
		// Verify it is not actually calling the wrapped reducer.
		expect( testReducer ).toHaveBeenCalledTimes( 0 );

		toggleFreeze( false );

		// Verify that the reducer handles the state and action and returns the new state.
		state = freezeReducer( state, action );
		expect( state ).toBe( "bar" );
		// Verify it is not actually calling the wrapped reducer.
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( testReducer ).toHaveBeenCalledWith( "foo", action );
	} );
} );
