import { createSelector, createSlice } from "@reduxjs/toolkit";
import apiFetch from "@wordpress/api-fetch";
import { get, isNumber } from "lodash";
import { ASYNC_ACTION_NAMES, ASYNC_ACTION_STATUS } from "../../shared-admin/constants";

/**
 * @typedef {Object} UsageCount
 * @property {number} count The current usage count.
 * @property {number} limit The limit for the usage count.
 */

export const USAGE_COUNT_NAME = "usageCount";
export const FETCH_USAGE_COUNT_ACTION_NAME = "fetchUsageCount";
export const FETCH_USAGE_COUNT_SUCCESS_ACTION_NAME = `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`;
export const FETCH_USAGE_COUNT_ERROR_ACTION_NAME = `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`;

const ERROR_DEFAULT = {
	errorCode: null,
	errorIdentifier: null,
	errorMessage: null,
};

const slice = createSlice( {
	name: USAGE_COUNT_NAME,
	initialState: {
		status: ASYNC_ACTION_STATUS.idle,
		count: 0,
		limit: 10,
		endpoint: "yoast/v1/ai_generator/get_usage",
		error: ERROR_DEFAULT,
	},
	reducers: {
		addUsageCount: ( state, { payload = 1 } ) => {
			state.count += payload;
		},
		setUsageCount: ( state, { payload } ) => {
			state.count = payload;
		},
		setUsageCountEndpoint: ( state, { payload } ) => {
			state.endpoint = payload;
		},
		setUsageCountLimit: ( state, { payload } ) => {
			state.limit = payload;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }`, ( state ) => {
			state.status = ASYNC_ACTION_STATUS.loading;
			state.error = ERROR_DEFAULT;
		} );
		builder.addCase( FETCH_USAGE_COUNT_SUCCESS_ACTION_NAME, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.success;
			state.count = payload.count;
			state.limit = payload.limit;
			state.error = ERROR_DEFAULT;
		} );
		builder.addCase( `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.error }`, ( state, { payload } ) => {
			state.status = ASYNC_ACTION_STATUS.error;
			// Bad gateway error will not have a payload, so we set a default error.
			state.error = {
				errorCode: 502,
				...payload,
			};
		} );
	},
} );

export const getInitialUsageCount = slice.getInitialState;

export const usageCountSelectors = {
	selectUsageCountStatus: ( state ) => get( state, [ USAGE_COUNT_NAME, "status" ], slice.getInitialState() ),
	selectUsageCount: ( state ) => get( state, [ USAGE_COUNT_NAME, "count" ], slice.getInitialState().count ),
	selectUsageCountLimit: ( state ) => get( state, [ USAGE_COUNT_NAME, "limit" ], slice.getInitialState().limit ),
	selectUsageCountEndpoint: ( state ) => get( state, [ USAGE_COUNT_NAME, "endpoint" ], slice.getInitialState().endpoint ),
	selectUsageCountError: ( state ) => get( state, [ USAGE_COUNT_NAME, "error" ], slice.getInitialState().error ),
};
usageCountSelectors.selectUsageCountRemaining = createSelector(
	[
		usageCountSelectors.selectUsageCount,
		usageCountSelectors.selectUsageCountLimit,
	],
	( count, limit ) => Math.max( limit - count, 0 )
);
usageCountSelectors.isUsageCountLimitReached = createSelector(
	[
		usageCountSelectors.selectUsageCount,
		usageCountSelectors.selectUsageCountLimit,
		usageCountSelectors.selectUsageCountError,
	],
	( count, limit, error ) => error.errorCode === 429 || count >= limit );

/**
 * Validates the response structure of the usage count.
 *
 * Expected structure:
 * {
 *   totalUsed: {
 *     license: number, // The current usage count
 *     limit: number,   // The limit for the usage count
 *   }
 * }
 *
 * @param {any} result The result object returned from the API.
 * @returns {UsageCount} The validated count and limit.
 */
const validateUsageCountResponse = ( result ) => {
	const count = get( result, "totalUsed.license", null );
	const limit = get( result, "totalUsed.limit", null );

	if ( ! isNumber( count ) || count < 0 ) {
		throw new Error( "Invalid usage count: must be a number of zero or higher." );
	}
	if ( ! isNumber( limit ) || limit < -1 || limit === 0 ) {
		throw new Error( "Invalid usage count limit: must be a number of -1 or higher than 1" );
	}

	return { count, limit };
};

/**
 * @param {string} endpoint The endpoint to fetch the usage count from.
 * @returns {Object} Success or error action object.
 */
export function* fetchUsageCount( { endpoint } ) {
	yield{ type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.request }` };
	try {
		// Throws an error if the response structure is invalid.
		const payload = validateUsageCountResponse(
			// Trigger the fetch users control flow.
			yield{ type: FETCH_USAGE_COUNT_ACTION_NAME, payload: endpoint }
		);

		// Update the store with the fetched usage count.
		return { type: `${ FETCH_USAGE_COUNT_ACTION_NAME }/${ ASYNC_ACTION_NAMES.success }`, payload };
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
