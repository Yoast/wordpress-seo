import { cloneDeep } from "lodash";

/**
 * Wraps a reducer with freeze functionality.
 *
 * @param {function} reducer The reducer to potentially freeze.
 * @param {*} [initialState] The initial state.
 *
 * @returns {{toggleFreeze: function, freezeReducer: function}} The freeze reducer and freeze function to toggle the freezing.
 */
export const createFreezeReducer = ( reducer, initialState ) => {
	let isFrozen = false;
	let frozenState = null;

	return {
		/**
		 * Reduces the state only if not frozen.
		 *
		 * @param {*} [state] The state. Defaults to the initialState.
		 * @param {Object} action The action.
		 *
		 * @returns {function} Either the state as normal or the frozen state.
		 */
		freezeReducer: ( state = initialState, action ) => isFrozen ? frozenState : reducer( state, action ),

		/**
		 * Freezes the store state depending on the given value.
		 *
		 * @param {function} getState The function to get the current state, used if freezing.
		 * @param {boolean} [value] Whether to freeze or unfreeze the state. Defaults to the opposite of the current value.
		 *
		 * @returns {void}
		 */
		toggleFreeze: ( getState, value = ! isFrozen ) => {
			frozenState = value ? cloneDeep( getState() ) : null;
			isFrozen = Boolean( value );
		},
	};
};
