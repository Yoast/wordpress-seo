import { reduce } from "lodash";

export const createActions = ( store, actions ) => reduce(
	actions,
	( acc, action, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => store.dispatch( action( ...args ) ),
	} ),
	{}
);

export const createSelectors = ( store, selectors ) => reduce(
	selectors,
	( acc, selector, name ) => ( {
		...acc,
		[ name ]: ( ...args ) => selector( store.getState(), ...args ),
	} ),
	{}
);
