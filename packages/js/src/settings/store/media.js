/* eslint-disable camelcase */
import { createSlice, createEntityAdapter } from "@reduxjs/toolkit";
import { map } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "./constants";

const mediaAdapter = createEntityAdapter();

export const FETCH_MEDIA_ACTION_NAME = "fetchMedia";

/**
 * @param {number[]} ids Ids to include in request.
 * @returns {Object} Success or error action object.
 */
export function* fetchMedia( ids ) {
	yield{ type: `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}` };
	try {
		// Trigger the fetch media control flow.
		const media = yield{
			type: FETCH_MEDIA_ACTION_NAME,
			payload: {
				data: {
					per_page: 100,
					include: ids,
				},
			},
		};
		return { type: `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, payload: media };
	} catch ( error ) {
		return { type: `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, payload: error };
	}
}

const prepareMediaPayload = media => ( {
	payload: {
		...media,
		type: media.type || media.media_type,
		alt: media.alt || media.alt_text,
	},
} );

const mediaSlice = createSlice( {
	name: "media",
	initialState: mediaAdapter.getInitialState( {
		status: "idle",
		error: "",
	} ),
	reducers: {
		addOneMedia: {
			reducer: mediaAdapter.addOne,
			prepare: ( payload ) => prepareMediaPayload( payload ),
		},
		addManyMedia: {
			reducer: mediaAdapter.addMany,
			prepare: ( payload ) => map( payload, prepareMediaPayload ),
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.request}`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.success}`, ( state, action ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			mediaAdapter.addMany( state, action.payload );
		} );
		builder.addCase( `${FETCH_MEDIA_ACTION_NAME}/${ASYNC_ACTION_NAMES.error}`, ( state, action ) => {
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
};

export const mediaActions = {
	...mediaSlice.actions,
	fetchMedia,
};

export default mediaSlice.reducer;
