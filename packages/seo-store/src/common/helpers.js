import { get, reduce, upperFirst } from "lodash";

/**
 * Binds actions to a store.
 *
 * @param {Object} store The Redux store.
 * @param {Object} actions The actions.
 *
 * @returns {Object} Bound actions.
 */
export const createActions = ( store, actions ) => reduce(
	actions,
	( acc, action, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => store.dispatch( action( ...args ) ),
	} ),
	{},
);

/**
 * Binds selectors to a store.
 *
 * @param {Object} store The Redux store.
 * @param {Object} selectors The actions.
 *
 * @returns {Object} Bound selectors.
 */
export const createSelectors = ( store, selectors ) => reduce(
	selectors,
	( acc, selector, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => selector( store.getState(), ...args ),
	} ),
	{},
);

/**
 * @param {String|Array} sliceName The name of the slice.
 * @param {Array}  names The keys of the slice its initialState.
 *
 * @returns {Object} An object containing Redux selector functions.
 */
export const createSimpleSelectors = ( sliceName, names ) => reduce(
	names,
	( selectors, name ) => ( {
		...selectors,
		[ `select${ upperFirst( name ) }` ]: state => get( state, [ sliceName, name ] ),
	} ),
	{
		[ `select${ upperFirst( sliceName ) }` ]: state => get( state, sliceName ),
	},
);

/**
 * @param {String|Array} sliceName The keys of the slice its initialState.
 * @param {Array} names The keys of the slice its initialState.
 *
 * @returns {Object} An object containing Redux reducer functions.
 */
export const createSimpleReducers = ( sliceName, names ) => reduce(
	names,
	( selectors, name ) => ( {
		...selectors,
		[ `update${ upperFirst( name ) }` ]: ( state, action ) => {
			state[ name ] = action.payload;
		},
	} ),
	{},
);
