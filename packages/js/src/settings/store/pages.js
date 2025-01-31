/* eslint-disable complexity */
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { decodeEntities } from "@wordpress/html-entities";
import { buildQueryString } from "@wordpress/url";
import { map, trim, pickBy } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const pagesAdapter = createEntityAdapter();

export const FETCH_PAGES_ACTION_NAME = "fetchPages";
export const PAGE_NAME = "pages";
// Global abort controller for this reducer to abort requests made by multiple selects.
let abortController;

/**
 * @param {Object} queryData The query data.
 * @returns {Object} Success or error action object.
 */
export function* fetchPages( queryData ) {
	yield{ type: `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch pages control flow.
		const pages = yield{
			type: FETCH_PAGES_ACTION_NAME,
			payload: { ...queryData },
		};
		return { type: `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: pages };
	} catch ( error ) {
		return { type: `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @param {Object} page The page.
 * @returns {Object} The prepared and predictable page.
 */
const preparePage = page => (
	{
		id: page?.id,
		// Fallbacks for page title, because we always need something to show.
		name: decodeEntities( trim( page?.title.rendered ) ) || page?.slug || page.id,
		slug: page?.slug,
		"protected": page?.content?.protected,
	} );

const pagesSlice = createSlice( {
	name: "pages",
	initialState: pagesAdapter.getInitialState( {
		status: ASYNC_ACTION_STATUS.idle,
		error: "",
	} ),
	reducers: {
		addOnePage: {
			reducer: pagesAdapter.addOne,
			prepare: page => ( { payload: preparePage( page ) } ),
		},
		addManyPages: {
			reducer: pagesAdapter.addMany,
			prepare: pages => ( { payload: map( pages, preparePage ) } ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			pagesAdapter.addMany( state, map( action.payload, preparePage ) );
		} );
		builder.addCase( `${ FETCH_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

export const getPageInitialState = pagesSlice.getInitialState;
// Prefix selectors
const pageAdapterSelectors = pagesAdapter.getSelectors( state => state.pages );

export const pageSelectors = {
	selectPageIds: pageAdapterSelectors.selectIds,
	selectPageById: pageAdapterSelectors.selectById,
	selectPages: pageAdapterSelectors.selectEntities,
};
pageSelectors.selectPagesWith = createSelector(
	[
		pageSelectors.selectPages,
		( state, additionalPage = {} ) => additionalPage,
	],
	( pages, additionalPage ) => {
		const additionalPages = {};
		additionalPage.forEach( page => {
			if ( page?.id && ! pages[ page.id ] ) {
				// Add the additional page.
				additionalPages[ page.id ] = { ...page };
			}
		} );
		const cleanPages = pickBy( pages, ( value ) => ! value.protected );
		return { ...additionalPages, ...cleanPages };
	}
);
export const pageActions = {
	...pagesSlice.actions,
	fetchPages,
};

export const pageControls = {
	[ FETCH_PAGES_ACTION_NAME ]: async( { payload } ) => {
		abortController?.abort();


		abortController = new AbortController();
		return apiFetch( {
			path: `/wp/v2/pages?${ buildQueryString( payload ) }`,
			signal: abortController.signal,
		} );
	},
};

export default pagesSlice.reducer;
