import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import apiFetch from "@wordpress/api-fetch";
import { ASYNC_ACTION_NAMES } from "../../shared-admin/constants";

export const USAGE_COUNT_NAME = "usageCount";

export const FETCH_USAGE_COUNT_ACTION_NAME = "fetchUsageCount";


const slice = createSlice( {
	name: USAGE_COUNT_NAME,
	initialState: {
		currentUsageCount: 0,
		currentLimit: 100,
	},
	reducers: {
		addUsageCount: ( state, { payload = 1 } ) => {
			state.currentUsageCount = state.currentUsageCount + payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, state => {
			state.currentUsageCount = 0;
		} );
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, ( state, action ) => {
			state.currentUsageCount = get( action, "payload.totalUsed.license", 0 );
			state.currentLimit = get( action, "payload.totalUsed.limit", 100 );
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
};

/**
 *
 * @returns {Object} Success or error action object.
 */
export function* fetchUsageCount() {
	yield{ type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Trigger the fetch users control flow.
		const counts = yield{
			type: FETCH_USAGE_COUNT_ACTION_NAME,
		};
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
	[ FETCH_USAGE_COUNT_ACTION_NAME ]: async() => apiFetch( {
		method: "POST",
		path: "yoast/v1/ai_generator/get_usage",
	} ),
};

export const usageCountReducer = slice.reducer;
