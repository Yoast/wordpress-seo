import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { map } from "lodash";

const NAME = "routes";

/**
 * @param {string} id The ID.
 * @param {string} path The path.
 * @param {string} text The text.
 * @returns {{children: string, id: string, to: string}} The link.
 */
const transformRouteToLink = ( { id, path, text } ) => ( { id: `link-nav-${ id }`, to: path, children: text } );

/**
 * @param {{id: string, priority: Number, path: string, text: string}} route The route.
 * @returns {Object} The prepared and predictable route.
 */
const prepareRoute = route => ( {
	id: route.id || route.path.replace( "/", "" ),
	priority: route.priority ?? Number.MAX_VALUE,
	path: route.path ?? "",
	text: route.text || route.id || route.path,
} );

const adapter = createEntityAdapter( {
	selectId: entity => entity.id,
	sortComparer: ( a, b ) => {
		const diff = a.priority - b.priority;
		if ( diff !== 0 ) {
			return diff;
		}
		return a.text.localeCompare( b.text );
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const createInitialState = () => adapter.getInitialState();

const slice = createSlice( {
	name: NAME,
	initialState: createInitialState(),
	reducers: {
		addRoute: {
			reducer: adapter.addOne,
			prepare: menuItem => ( { payload: prepareRoute( menuItem ) } ),
		},
		addRoutes: {
			reducer: adapter.addMany,
			prepare: menu => ( { payload: map( menu, prepareRoute ) } ),
		},
		removeRoute: {
			reducer: adapter.removeOne,
		},
	},
} );

const adapterSelectors = adapter.getSelectors( state => state[ NAME ] );
export const selectors = {
	selectRouteById: adapterSelectors.selectById,
	selectAllRoutes: adapterSelectors.selectAll,
	selectRouteEntities: adapterSelectors.selectEntities,
};
selectors.selectLinksFromRoutes = createSelector(
	[ selectors.selectAllRoutes ],
	routes => map( routes, transformRouteToLink )
);

export const actions = slice.actions;

export const reducer = slice.reducer;
