import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "lodash";

import { ASYNC_STATUS } from "./constants";

const SLICE_NAME = "analysisResults";
const INITIAL_RESULTS = {};

const fetchSeoResults = createAsyncThunk(
	`${SLICE_NAME}/fetchSeoResults`,
	async( { key, paper }, { dispatch, getState, extra: service } ) => {
		// NOTE: Pass key to worker here?
		// Add seoTitleWidth to paper here in some smart way (after preparePaper/replaceVars)
		const response = await service.fetchSeoResults(
			service.preparePaper( paper, { dispatch, getState } )
		);
		return {
			key,
			results: response.data,
		};
	}
);

const results = createSlice( {
	name: SLICE_NAME,
	initialState: {
		seo: {
			status: ASYNC_STATUS.IDLE,
			error: "",
			results: {
				// How to determine which keys are accepted here?
				focus: INITIAL_RESULTS,
				a: INITIAL_RESULTS,
				b: INITIAL_RESULTS,
				c: INITIAL_RESULTS,
				d: INITIAL_RESULTS,
			},
		},
		readability: {},
		// research: "",
	},
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( fetchSeoResults.pending, ( state ) => {
			state.seo.status = ASYNC_STATUS.PENDING;
		} );
		builder.addCase( fetchSeoResults.fulfilled, ( state, action ) => {
			state.seo.status = ASYNC_STATUS.FULFILLED;
			state.seo.results[ action.payload.key ] = action.payload.results;
		} );
		builder.addCase( fetchSeoResults.rejected, ( state, action ) => {
			state.seo.status = ASYNC_STATUS.REJECTED;
			state.seo.error = action.payload;
		} );
	},
} );

const selectSeoResults = ( state, key ) => get( state, `analysisResults.seo.results.${ key }`, INITIAL_RESULTS );

export const analysisResultsSelectors = {
	selectSeoResults,
};

export const analysisResultsActions = {
	...results.actions,
	fetchSeoResults,
};

export default results.reducer;
