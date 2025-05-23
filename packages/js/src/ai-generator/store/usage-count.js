import { createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get } from "lodash";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

export const USAGE_COUNT_NAME = "usageCount";

export const FETCH_USAGE_COUNT_ACTION_NAME = "fetchUsageCount";


const slice = createSlice( {
	name: USAGE_COUNT_NAME,
	initialState: {
		currentUsageCount: 0,
		currentLimit: 10,
		endpoint: "yoast/v1/ai_generator/get_usage",
	},
	reducers: {
		addUsageCount: ( state, { payload = 1 } ) => {
			state.currentUsageCount = state.currentUsageCount + payload;
		},
		setUsageCountEndpoint: ( state, { payload } ) => {
			state.endpoint = payload;
		},
		setUsageCountLimit: ( state, { payload } ) => {
			state.currentLimit = payload;
		}
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, state => {
			state.currentUsageCount = 0;
		} );
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.currentUsageCount = get( action, "payload.totalUsed.license", 0 );
			state.currentLimit = get( action, "payload.totalUsed.limit", 10 );
		} );

		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, state => {
			state.currentUsageCount = 0;
		} );
	},
} );

export const getInitialUsageCount = slice.getInitialState;

export const UsageCountSelectors = {
	selectUsageCount: state => get( state, [ USAGE_COUNT_NAME, "currentUsageCount" ], slice.getInitialState().currentUsageCount ),
	selectUsageCountLimit: state => get( state, [ USAGE_COUNT_NAME, "currentLimit" ], slice.getInitialState().limit ),
	selectUsageCountEndpoint: state => get( state, [ USAGE_COUNT_NAME, "endpoint" ], slice.getInitialState().endpoint ),
};

/**
 * @param {string} endpoint The endpoint to fetch the usage count from.
 * @returns {Object} Success or error action object.
 */
export function* fetchUsageCount( { endpoint } ) {
	yield{ type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch users control flow.
		const counts = yield{ type: FETCH_USAGE_COUNT_ACTION_NAME, payload: endpoint };
		return { type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload: counts };
	} catch ( error ) {
		return { type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, payload: error };
	}
}

export const usageCountActions = {
	...slice.actions,
	fetchUsageCount,
};

export const usageCountControls = {
	[ FETCH_USAGE_COUNT_ACTION_NAME ]: async( { payload } ) => apiFetch( {
		method: "POST",
		path: payload,
	} ),
};

export const usageCountReducer = slice.reducer;
