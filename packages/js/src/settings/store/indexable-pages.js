/* eslint-disable complexity */
import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { decodeEntities } from "@wordpress/html-entities";
import { buildQueryString } from "@wordpress/url";
import { map, trim, pickBy } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const indexablePagesAdapter = createEntityAdapter();

export const FETCH_INDEXABLE_PAGES_ACTION_NAME = "fetchIndexablePages";
export const INDEXABLE_PAGE_NAME = "indexablePages";
// Global abort controller for this reducer to abort requests made by multiple selects.
let abortController;

/**
 * @param {Object} queryData The query data.
 * @returns {Object} Success or error action object.
 */
export function* fetchIndexablePages( queryData ) {
	yield{ type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch indexable pages control flow.
		const indexablePages = yield{
			type: FETCH_INDEXABLE_PAGES_ACTION_NAME,
			payload: { ...queryData },
		};
		return { type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: indexablePages };
	} catch ( error ) {
		return { type: `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * @returns {Object} The initial state.
 */
export const createInitialIndexablePagesState = () => indexablePagesAdapter.getInitialState( {
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
} );

/**
 * @param {Object} indexablePage The indexable page.
 * @returns {Object} The prepared and predictable indexable page.
 */
const prepareIndexablePage = indexablePage => (
	{
		id: indexablePage?.id,
		// Fallbacks for page title, because we always need something to show.
		name: decodeEntities( trim( indexablePage?.title.rendered ) ) || indexablePage?.slug || indexablePage.id,
		slug: indexablePage?.slug,
		"protected": indexablePage?.content?.protected,
	} );

const indexablePagesSlice = createSlice( {
	name: "indexablePages",
	initialState: createInitialIndexablePagesState(),
	reducers: {
		addOneIndexablePage: {
			reducer: indexablePagesAdapter.addOne,
			prepare: indexablePage => ( { payload: prepareIndexablePage( indexablePage ) } ),
		},
		addManyIndexablePages: {
			reducer: indexablePagesAdapter.addMany,
			prepare: indexablePages => ( { payload: map( indexablePages, prepareIndexablePage ) } ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			indexablePagesAdapter.addMany( state, map( action.payload, prepareIndexablePage ) );
		} );
		builder.addCase( `${ FETCH_INDEXABLE_PAGES_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

// Prefix selectors
const indexablePageAdapterSelectors = indexablePagesAdapter.getSelectors( state => state.indexablePages );
export const indexablePagesSelectors = {
	selectIndexablePageIds: indexablePageAdapterSelectors.selectIds,
	selectIndexablePageById: indexablePageAdapterSelectors.selectById,
	selectIndexablePages: indexablePageAdapterSelectors.selectEntities,
};
indexablePagesSelectors.selectIndexablePagesWith = createSelector(
	[
		indexablePagesSelectors.selectIndexablePages,
		( state, additionalIndexablePage = {} ) => additionalIndexablePage,
	],
	( indexablePages, additionalIndexablePage ) => {
		const additionalIndexablePages = {};
		additionalIndexablePage.forEach( indexablePage => {
			if ( indexablePage?.id && ! indexablePages[ indexablePage.id ] ) {
				// Add the additional page.
				additionalIndexablePages[ indexablePage.id ] = { ...indexablePage };
			}
		} );
		const cleanIndexablePages = pickBy( indexablePages, ( value ) => ! value.protected );
		return { ...additionalIndexablePages, ...cleanIndexablePages };
	}
);

export const indexablePagesActions = {
	...indexablePagesSlice.actions,
	fetchIndexablePages,
};

export const indexablePagesControls = {
	[ FETCH_INDEXABLE_PAGES_ACTION_NAME ]: async( { payload } ) => {
		abortController?.abort();


		abortController = new AbortController();
		return apiFetch( {
			path: `/wp/v2/pages?${ buildQueryString( payload ) }`,
			signal: abortController.signal,
		} );
	},
};

export default indexablePagesSlice.reducer;
