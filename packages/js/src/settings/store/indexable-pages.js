/* eslint-disable complexity */
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { decodeEntities } from "@wordpress/html-entities";
import { buildQueryString } from "@wordpress/url";
import { map, trim } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

/**
 * Represents the indexable pages slice of the store.
 *
 * The state holds all the indexable pages and a per "scope" last query.
 * A scope is a unique identifier for a component, using its own search query, abort controller, and status.
 * This way, components have their own isolated state but the overall results are shared.
 * This might be useful if we want to query pages by ID, preventing unnecessary requests.
 *
 * By using a scope instead of the query we don't grow our cached results more than necessary.
 *
 * The actions include fetching indexable pages from the API.
 */

/**
 * @typedef IndexablePage The indexable page.
 * @property {number} id The ID of the page.
 * @property {string} name The name of the page.
 * @property {string} slug The slug of the page.
 */

/**
 * @typedef RawIndexablePage The raw indexable page from the API.
 * @property {number} id The ID of the page.
 * @property {string} title The title of the page.
 * @property {string} slug The slug of the page.
 */

/**
 * @typedef {Object} QueryData
 * @property {string} search The search query.
 */

/**
 * @type {import("../../shared-admin/constants").AsyncActionStatuses}
 */

/**
 * @typedef {Object<string, QueryResult>} QueryResult
 * @property {QueryData} query The query data used for the request.
 * @property {number[]} ids The IDs of matching indexable pages.
 * @property {AsyncActionStatuses} status The status of the query.
 */

export const INDEXABLE_PAGE_NAME = "indexablePages";
export const FETCH_INDEXABLE_PAGES_ACTION_NAME = `${ INDEXABLE_PAGE_NAME }/fetch`;

/**
 * Abort controllers per "scope" to cancel ongoing requests.
 * @type {{string: AbortController}}
 */
const abortControllers = {};

/**
 * @type {import("@reduxjs/toolkit").EntityAdapter<IndexablePage>}
 */
const indexablePagesAdapter = createEntityAdapter( {
	selectId: ( page ) => page.id,
	sortComparer: ( a, b ) => a.name.localeCompare( b.name ),
} );

/**
 * @param {string} scope The scope for the request.
 * @param {QueryData} [query={search:""}] The query data.
 * @param {AbortController} [abortController=null] The abort controller for the request.
 * @returns {Object} The next action to be dispatched.
 */
export function* fetchIndexablePages( scope, query = { search: "" }, abortController = null ) {
	// Updates the scope query, and status to loading.
	yield{ type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, payload: { scope, query } };
	try {
		// Triggers the fetch indexable pages control flow.
		const pages = yield{
			type: FETCH_INDEXABLE_PAGES_ACTION_NAME,
			payload: { scope, query, abortController },
		};
		// Updates the state with the fetched pages.
		return { type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: { scope, query, pages } };
	} catch ( error ) {
		if ( error?.name === "AbortError" ) {
			// If the request was aborted, we don't need to do anything.
			return {};
		}
		console.error( "Error fetching indexable pages:", error );
		// Updates the scope status to error.
		return { type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: { scope } };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialIndexablePagesState = () => indexablePagesAdapter.getInitialState( {
	/** @type {Object<string, QueryResult>} */
	scopes: {},
} );

/**
 * @param {RawIndexablePage} indexablePage The raw indexable page.
 * @returns {IndexablePage} The prepared and predictable indexable page.
 */
const prepareIndexablePage = ( indexablePage ) => ( {
	id: Number( indexablePage?.id ) || 0,
	// Fallbacks for page title, because we always need something to show.
	name: String( decodeEntities( trim( indexablePage?.title ) ) || indexablePage?.slug || indexablePage?.id || 0 ),
	slug: String( indexablePage?.slug || "" ),
} );

const indexablePagesSlice = createSlice( {
	name: INDEXABLE_PAGE_NAME,
	initialState: createInitialIndexablePagesState(),
	reducers: {
		addIndexablePages: {
			reducer: indexablePagesAdapter.upsertMany,
			prepare: ( pages ) => ( {
				payload: map( pages, prepareIndexablePage ),
			} ),
		},
		// Cleanup action to remove a scope.
		removeIndexablePagesScope: ( state, { payload } ) => {
			if ( ! ( payload in state.scopes ) ) {
				return;
			}
			// Note that these are side-effects, but contained in this file.
			if ( state.scopes[ payload ].status === ASYNC_ACTION_STATUS.loading ) {
				// If the scope is still loading, we need to abort the request.
				abortControllers[ payload ]?.abort();
				// Remove the abort controller for this scope.
				delete abortControllers[ payload ];
			}
			delete state.scopes[ payload ];
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state, { payload } ) => {
			if ( ! state.scopes[ payload.scope ] ) {
				state.scopes[ payload.scope ] = {
					query: { search: "" },
					status: ASYNC_ACTION_STATUS.idle,
					ids: [],
				};
			}
			if ( "query" in payload ) {
				// Used for optimistic updates of the label.
				state.scopes[ payload.scope ].query = payload.query;
			}
			state.scopes[ payload.scope ].status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, { payload } ) => {
			// Add found indexable pages to all pages.
			indexablePagesAdapter.upsertMany( state, map( payload.pages, prepareIndexablePage ) );

			// Store the query in the scope.
			state.scopes[ payload.scope ] ||= {};
			state.scopes[ payload.scope ].query = payload.query;
			state.scopes[ payload.scope ].status = ASYNC_ACTION_STATUS.success;
			state.scopes[ payload.scope ].ids = payload.pages.map( ( page ) => page.id );
		} );
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			if ( ! state.scopes[ payload.scope ] ) {
				state.scopes[ payload.scope ] = {
					query: { search: "" },
					status: ASYNC_ACTION_STATUS.idle,
					ids: [],
				};
			}
			state.scopes[ payload.scope ].status = ASYNC_ACTION_STATUS.error;
		} );
	},
} );

// Prefix selectors.
const indexablePageAdapterSelectors = indexablePagesAdapter.getSelectors( ( state ) => state[ INDEXABLE_PAGE_NAME ] );
export const indexablePagesSelectors = {
	selectIndexablePageById: indexablePageAdapterSelectors.selectById,
};
indexablePagesSelectors.selectIndexablePagesScope = createSelector(
	[
		indexablePageAdapterSelectors.selectIds,
		( state, scope ) => state[ INDEXABLE_PAGE_NAME ].scopes[ scope ],
	],
	( ids, scope ) => {
		if ( ! scope?.query?.search ) {
			// If the scope does not have a search query, we return all the ids.
			return {
				ids,
				status: scope?.status || ASYNC_ACTION_STATUS.idle,
				query: { search: "" },
			};
		}
		return {
			ids: scope?.ids || ids,
			status: scope?.status || ASYNC_ACTION_STATUS.idle,
			query: scope?.query || { search: "" },
		};
	}
);
indexablePagesSelectors.selectIndexablePagesById = createSelector(
	[
		indexablePageAdapterSelectors.selectAll,
		( state, ids ) => ids,
	],
	( indexablePages, ids ) => {
		return indexablePages.filter( ( page ) => ids.includes( page.id ) );
	}
);

export const indexablePagesActions = {
	...indexablePagesSlice.actions,
	fetchIndexablePages,
};

export const indexablePagesControls = {
	/**
	 * Fetches indexable pages from the API.
	 *
	 * @param {Object} action The action object.
	 * @param {string} action.type The action type, should be `FETCH_INDEXABLE_PAGES_ACTION_NAME`.
	 * @param {Object} action.payload The payload of the action.
	 * @param {string} action.payload.scope The scope for the request, used to identify the request and its state.
	 * @param {QueryData} [action.payload.query] The search query to filter the indexable pages.
	 * @param {AbortController} [action.payload.abortController] The abort controller to cancel the request if needed.
	 *
	 * @returns {Promise<RawIndexablePage[]>} The promise of raw indexable pages.
	 */
	[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]: async( { payload } ) => {
		if ( payload.scope in abortControllers ) {
			// If the scope already has an abort controller, abort the previous request.
			abortControllers[ payload.scope ]?.abort();
		}
		abortControllers[ payload.scope ] = payload.abortController || new AbortController();

		return apiFetch( {
			path: `/yoast/v1/available_posts?${ buildQueryString( payload.query ) }`,
			signal: abortControllers[ payload.scope ].signal,
		} );
	},
};

export default indexablePagesSlice.reducer;
