import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import apiFetch from "@wordpress/api-fetch";

// Action name constants
export const LLMS_TXT_NAME = "llmsTxt";
export const FETCH_GENERATION_FAILURE_ACTION_NAME = `${LLMS_TXT_NAME}/fetchGenerationFailure`;

/**
 * @returns {Object} The initial llmsTxt state.
 */
export const createInitialLlmsTxtState = () =>(
	{
		generationFailure: false,
		generationFailureReason: "",
		llmsTxtUrl: "",
		disabledPageIndexables: false,
		otherIncludedPagesLimit: 100,
		failureFetchStatus: ASYNC_ACTION_STATUS.idle,
	}
);

/**
 * @returns {Object} Success or error action object.
 */
export function* fetchGenerationFailure() {
	yield{ type: `${FETCH_GENERATION_FAILURE_ACTION_NAME}/request` };
	try {
		const result = yield{
			type: FETCH_GENERATION_FAILURE_ACTION_NAME,
		};
		return { type: `${FETCH_GENERATION_FAILURE_ACTION_NAME}/success`, payload: result };
	} catch ( error ) {
		console.error( "Error fetching generation failure:", error );
		return { type: `${FETCH_GENERATION_FAILURE_ACTION_NAME}/error`, payload: {} };
	}
}

const slice = createSlice( {
	name: LLMS_TXT_NAME,
	initialState: createInitialLlmsTxtState(),
	reducers: {},
	extraReducers: builder => {
		builder.addCase( `${FETCH_GENERATION_FAILURE_ACTION_NAME}/request`, state => {
			state.failureFetchStatus = ASYNC_ACTION_STATUS.loading;
		} );
		builder.addCase( `${FETCH_GENERATION_FAILURE_ACTION_NAME}/success`, ( state, { payload } ) => {
			state.failureFetchStatus = ASYNC_ACTION_STATUS.success;
			state.generationFailure = payload.generationFailure;
			state.generationFailureReason = payload.generationFailureReason;
		} );
		builder.addCase( `${FETCH_GENERATION_FAILURE_ACTION_NAME}/error`, state => {
			state.failureFetchStatus = ASYNC_ACTION_STATUS.error;
		} );
	},
} );

export const llmsTxtControls = {
	[ FETCH_GENERATION_FAILURE_ACTION_NAME ]: async() => {
		return apiFetch( { path: "/yoast/v1/llms_txt_generation_failure" } );
	},
};

export const llmsTxtActions = {
	...slice.actions,
	fetchGenerationFailure,
};

export const llmsTxtSelectors = {
	selectLlmsTxtGenerationFailure: state => get( state, "llmsTxt.generationFailure", false ),
	selectLlmsTxtGenerationFailureReason: state => get( state, "llmsTxt.generationFailureReason", "" ),
	selectLlmsTxtUrl: state => get( state, "llmsTxt.llmsTxtUrl", "" ),
	selectLlmsTxtDisabledPageIndexables: state => get( state, "llmsTxt.disabledPageIndexables", false ),
	selectLlmsTxtOtherIncludedPagesLimit: state => get( state, "llmsTxt.otherIncludedPagesLimit", 100 ),
	selectLlmsTxtFailureFetchStatus: state => get( state, "llmsTxt.failureFetchStatus", "idle" ),
};

export default slice.reducer;
