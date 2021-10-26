import { get, reduce, upperFirst } from "lodash";

export const createActions = ( store, actions ) => reduce(
	actions,
	( acc, action, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => store.dispatch( action( ...args ) ),
	} ),
	{},
);

export const createSelectors = ( store, selectors ) => reduce(
	selectors,
	( acc, selector, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => selector( store.getState(), ...args ),
	} ),
	{},
);

export const createSimpleSelectors = ( sliceName, initialState ) => reduce(
	initialState,
	( selectors, _, name ) => ( {
		...selectors,
		[ `select${ upperFirst( name ) }` ]: state => get( state, [ sliceName, name ] ),
	} ),
	{
		[ `select${ upperFirst( sliceName ) }` ]: state => get( state, sliceName ),
	},
);
