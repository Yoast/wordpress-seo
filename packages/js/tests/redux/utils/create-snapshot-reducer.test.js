import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { createSnapshotReducer } from "../../../src/redux/utils/create-snapshot-reducer";

describe( createSnapshotReducer.name, () => {
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

	it( "should return the snapshotReducer, takeSnapshot and restoreSnapshot functions", () => {
		const actual = createSnapshotReducer( jest.fn() );

		expect( actual ).toBeInstanceOf( Object );
		expect( actual.snapshotReducer ).toBeInstanceOf( Function );
		expect( actual.takeSnapshot ).toBeInstanceOf( Function );
		expect( actual.restoreSnapshot ).toBeInstanceOf( Function );
	} );

	it( "should return the initial state", () => {
		const initialState = "foo";
		const { snapshotReducer } = createSnapshotReducer( testReducer, initialState );

		expect( snapshotReducer( undefined, {} ) ).toBe( initialState );
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( testReducer ).toHaveBeenCalledWith( initialState, {} );
	} );

	it( "should handle an action", () => {
		const state = "foo";
		const action = { type: "change", payload: "bar" };
		const { snapshotReducer } = createSnapshotReducer( testReducer );

		expect( snapshotReducer( state, action ) ).toBe( "bar" );
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( testReducer ).toHaveBeenCalledWith( state, action );
	} );

	it( "should restore a taken snapshot", () => {
		let state = "foo";
		const changeAction = { type: "change", payload: "bar" };
		const { snapshotReducer, takeSnapshot: unboundTakeSnapshot, restoreSnapshot: unboundRestoreSnapshot } = createSnapshotReducer( testReducer );

		// Mimic a Redux store' getState and dispatch functions.
		/**
		 * @returns {string} The state.
		 */
		const getState = () => state;
		/**
		 * @param {Object} action The action.
		 * @returns {void}
		 */
		const dispatch = jest.fn( ( action ) => {
			state = snapshotReducer( state, action );
		} );

		// Bind the getState and dispatch functions. Similar to how we would use it in a real application.
		const takeSnapshot = unboundTakeSnapshot.bind( null, getState, dispatch );
		const restoreSnapshot = unboundRestoreSnapshot.bind( null, dispatch );

		// The snapshot should now be "foo".
		takeSnapshot();
		// Verify dispatch was called with the snapshot action.
		expect( testReducer ).toHaveBeenCalledTimes( 1 );
		expect( dispatch ).toHaveBeenCalledWith( { type: "CREATE_SNAPSHOT" } );
		// Change the state to "bar".
		dispatch( changeAction );
		// Verify that the state is now "bar".
		expect( state ).toBe( "bar" );

		// Restore the snapshot, which should be "foo".
		restoreSnapshot();
		// Verify dispatch was called with the snapshot action.
		expect( dispatch ).toHaveBeenLastCalledWith( { type: "RESTORE_SNAPSHOT" } );
		// Verify that the state is now "foo" again.
		expect( state ).toBe( "foo" );
	} );

	it( "should ignore restore when no snapshot was taken", () => {
		const dispatch = jest.fn();
		const { restoreSnapshot } = createSnapshotReducer( testReducer );

		// Restore the snapshot without taking one beforehand.
		restoreSnapshot( dispatch );
		// Verify dispatch was not called.
		expect( dispatch ).toHaveBeenCalledTimes( 0 );
	} );
} );
