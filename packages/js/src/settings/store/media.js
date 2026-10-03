/* eslint-disable camelcase, complexity */
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { buildQueryString } from "@wordpress/url";
import { get, map, mapValues } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

const mediaAdapter = createEntityAdapter();

/**
 * @returns {Object} The initial state.
 */
export const createInitialMediaState = () => mediaAdapter.getInitialState( {
	status: ASYNC_ACTION_STATUS.idle,
	error: "",
} );

export const FETCH_MEDIA_ACTION_NAME = "fetchMedia";

/**
 * @param {number[]} ids Ids to include in request.
 * @returns {Object} Success or error action object.
 */
export function* fetchMedia( ids ) {
	yield{ type: `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch media control flow.
		const media = yield{
			type: FETCH_MEDIA_ACTION_NAME,
			payload: {
				per_page: 100,
				include: ids,
			},
		};
		return { type: `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: media };
	} catch ( error ) {
		return { type: `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

/**
 * Prepares a media object to a predictable structure.
 * @param {Object} media The original media object.
 * @returns {Object} The prepared and predictable media.
 */
const prepareMedia = media => ( {
	id: media?.id,
	title: media?.title?.rendered || media?.title,
	slug: media?.slug || media?.name,
	alt: media?.alt_text || media?.alt,
	url: media?.source_url || media?.url,
	type: media?.media_type || media?.type,
	mime: media?.mime_type || media?.mime,
	author: media?.author,
	sizes: mapValues( media?.sizes || media?.media_details?.sizes, size => ( {
		url: size?.url || size?.source_url,
		width: size?.width,
		height: size?.height,
	} ), {} ),
} );

const mediaSlice = createSlice( {
	name: "media",
	initialState: createInitialMediaState(),
	reducers: {
		addOneMedia: {
			reducer: mediaAdapter.addOne,
			prepare: media => ( { payload: prepareMedia( media ) } ),
		},
		addManyMedia: {
			reducer: mediaAdapter.addMany,
			prepare: media => ( { payload: map( media, prepareMedia ) } ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			mediaAdapter.addMany( state, map( action.payload, prepareMedia ) );
		} );
		builder.addCase( `${ FETCH_MEDIA_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			state.error = action.payload;
		} );
	},
} );

// Prefix selectors
const adapterSelectors = mediaAdapter.getSelectors( state => state.media );
export const mediaSelectors = {
	selectMediaIds: adapterSelectors.selectIds,
	selectMediaById: adapterSelectors.selectById,
	selectIsMediaLoading: state => get( state, "media.status", ASYNC_ACTION_STATUS.idle ) === ASYNC_ACTION_STATUS.loading,
	selectIsMediaError: state => get( state, "media.status", ASYNC_ACTION_STATUS.idle ) === ASYNC_ACTION_STATUS.error,
};

export const mediaActions = {
	...mediaSlice.actions,
	fetchMedia,
};

export const mediaControls = {
	[ FETCH_MEDIA_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		path: `/wp/v2/media?${ buildQueryString( payload ) }`,
	} ),
};

export default mediaSlice.reducer;
