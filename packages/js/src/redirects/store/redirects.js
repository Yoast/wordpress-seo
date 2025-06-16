import { createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { map } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const redirectsAdapter = createEntityAdapter();
export const REDIRECTS_NAME = "redirects";
export const FETCH_REDIRECTS_ACTION_NAME = "fetchRedirects";
export const ADD_REDIRECT_ACTION_NAME = "addRedirect";
export const EDIT_REDIRECT_ACTION_NAME = "editRedirect";
export const DELETE_REDIRECT_ACTION_NAME = "deleteRedirect";

let abortController;

/**
 * @param {Object} redirect A single redirect object.
 * @returns {Object}
 */
const prepareRedirect = ( redirect ) => ( {
	id: redirect.id,
	format: redirect.format,
	type: redirect.type,
	origin: redirect.origin,
	target: redirect.target,
} );

/**
 * Get all redirects.
 *
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* fetchRedirects() {
	yield{ type: `${FETCH_REDIRECTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}` };
	try {
		const response = yield{
			type: FETCH_REDIRECTS_ACTION_NAME,
			payload: {},
		};

		yield{
			type: `${FETCH_REDIRECTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`,
			payload: response,
		};
	} catch ( error ) {
		yield{
			type: `${FETCH_REDIRECTS_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`,
			payload: error,
		};
	}
}

/**
 * Delete redirect
 *
 * @param {Object} values Values for create redirect.
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* addRedirectAsync( values ) {
	yield{
		type: ADD_REDIRECT_ACTION_NAME,
		payload: values,
	};
	yield* fetchRedirects();

	return {
		type: `${ADD_REDIRECT_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`,
		payload: null,
	};
}

/**
 * Delete redirect
 *
 * @param {Object} values Values for create redirect.
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* editRedirectAsync( values ) {
	yield{
		type: EDIT_REDIRECT_ACTION_NAME,
		payload: values,
	};
	yield* fetchRedirects();

	return {
		type: `${EDIT_REDIRECT_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`,
		payload: null,
	};
}

/**
 * Delete redirect
 *
 * @param {Object} values Values for delete redirect.
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* deleteRedirectAsync( values ) {
	return yield{
		type: DELETE_REDIRECT_ACTION_NAME,
		payload: values,
	};
}

/**
 * Delete multiple redirects
 *
 * @param {Array} ids - Redirect IDs to delete.
 * @returns {Generator<Object, Object, *>} Redux generator action object.
 */
export function* deleteMultipleRedirectsAsync( ids ) {
	yield{
		type: `${DELETE_REDIRECT_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}`,
	};

	try {
		for ( const id of ids ) {
			yield{
				type: DELETE_REDIRECT_ACTION_NAME,
				payload: { origin: id },
			};
		}

		yield* fetchRedirects();

		yield{
			type: `${DELETE_REDIRECT_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`,
		};
	} catch ( error ) {
		yield{
			type: `${DELETE_REDIRECT_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`,
			payload: error,
		};
	}
}
const redirectsSlice = createSlice( {
	name: "redirects",
	initialState: redirectsAdapter.getInitialState( {
		status: ASYNC_ACTION_STATUS.idle,
		error: "",
	} ),
	reducers: {
		addOneRedirect: {
			reducer: redirectsAdapter.addOne,
			prepare: redirect => ( { payload: prepareRedirect( redirect ) } ),
		},
		addManyRedirects: {
			reducer: redirectsAdapter.addMany,
			prepare: redirects => ( { payload: map( redirects, prepareRedirect ) } ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_REDIRECTS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_REDIRECTS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			redirectsAdapter.setAll( state, map( action.payload, prepareRedirect ) );
		} );
		builder.addCase( `${ FETCH_REDIRECTS_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

export const getRedirectsInitialState = redirectsSlice.getInitialState;

// Selectors
const redirectSelectorsBase = redirectsAdapter.getSelectors( ( state ) => state.redirects );

export const redirectsSelectors = {
	selectRedirectIds: redirectSelectorsBase.selectIds,
	selectRedirectById: redirectSelectorsBase.selectById,
	selectRedirectEntities: redirectSelectorsBase.selectEntities,
	selectAllRedirects: redirectSelectorsBase.selectAll,
	selectRedirectsStatus: ( state ) => state.redirects.status,
};

redirectsSelectors.selectRedirectsWithType = createSelector(
	[
		redirectsSelectors.selectAllRedirects,
		( _, type ) => type,
	],
	( redirects, type ) => redirects.filter( ( r ) => r.type === type )
);

// Controls
export const redirectsControls = {
	[ FETCH_REDIRECTS_ACTION_NAME ]: async() => {
		abortController?.abort();
		abortController = new AbortController();

		const response = await apiFetch( {
			path: "/yoast/v1/redirects/list?format=plain",
			signal: abortController.signal,
		} );
		return Object.values( response.redirects ).map( ( redirect ) => ( {
			id: redirect.origin,
			...redirect,
		} ) ) || [];
	},

	[ ADD_REDIRECT_ACTION_NAME ]: async( { payload } ) => {
		return apiFetch( {
			path: "/yoast/v1/redirects",
			method: "POST",
			data: payload,
		} );
	},
	[ EDIT_REDIRECT_ACTION_NAME ]: async( { payload } ) => {
		return apiFetch( {
			path: "/yoast/v1/redirects/update",
			method: "PUT",
			data: payload,
		} );
	},
	[ DELETE_REDIRECT_ACTION_NAME ]: async( { payload } ) => {
		return apiFetch( {
			path: "/yoast/v1/redirects/delete",
			method: "POST",
			data: payload,
		} );
	},
};

// Actions
export const redirectsActions = {
	...redirectsSlice.actions,
	fetchRedirects,
	addRedirectAsync,
	deleteRedirectAsync,
	editRedirectAsync,
	deleteMultipleRedirectsAsync,
};

export default redirectsSlice.reducer;

