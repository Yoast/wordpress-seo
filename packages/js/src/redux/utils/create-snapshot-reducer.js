import { cloneDeep } from "lodash";

/**
 * Wraps a reducer with snapshot functionality.
 *
 * @param {function} reducer The reducer.
 * @param {*} [initialState] The initial state.
 *
 * @returns {Object} The snapshot reducer and snapshot functions.
 */
export const createSnapshotReducer = ( reducer, initialState ) => {
	let isRestoring = false;
	let hasSnapshot = false;
	let snapshot;

	return {
		/**
		 * Returns either the snapshot or the result of the wrapped reducer.
		 *
		 * @param {*} state The state.
		 * @param {Object} action The action.
		 *
		 * @returns {*} The new state.
		 */
		snapshotReducer: ( state = initialState, action ) => {
			if ( isRestoring ) {
				isRestoring = false;
				return snapshot;
			}
			return reducer( state, action );
		},

		/**
		 * Takes a snapshot of the current state.
		 *
		 * @param {function} getState The function to get the current state.
		 * @param {function} dispatch The dispatch function.
		 *
		 * @returns {void}
		 */
		takeSnapshot: ( getState, dispatch ) => {
			// Not actually needed for functionality, but nice to see the point in time.
			dispatch( { type: "CREATE_SNAPSHOT" } );
			snapshot = cloneDeep( getState() );
			hasSnapshot = true;
		},

		/**
		 * Restores the snapshot if available.
		 *
		 * @param {function} dispatch The dispatch function.
		 *
		 * @returns {void}
		 */
		restoreSnapshot: ( dispatch ) => {
			if ( ! hasSnapshot ) {
				return;
			}
			isRestoring = true;
			// Dispatch an action so we hit the `isRestoring` logic inside.
			dispatch( { type: "RESTORE_SNAPSHOT" } );
		},
	};
};
