import { createSlice } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { applyFilters } from "@wordpress/hooks";
import { get, reduce } from "lodash";
import { ASYNC_ACTIONS, ASYNC_STATUS, FOCUS_KEYPHRASE_ID, STORE_NAME } from "../../common/constants";

export const RESULTS_SLICE_NAME = "results";
export const ANALYZE_ACTION_NAME = "analyze";

const analysisActions = reduce(
	ASYNC_ACTIONS,
	( actions, action ) => ( { ...actions, [ action ]: `${ ANALYZE_ACTION_NAME }/${ action }` } ),
	{},
);

/**
 * Analyzes the current data.
 *
 * This is a generator function that iterates over the steps to analyze.
 * @see [WP data controls]{@link https://developer.wordpress.org/block-editor/reference-guides/packages/packages-data/#controls-2}
 *
 * @returns {Generator<Object>} Analyze steps.
 */
function* analyze() {
	yield { type: analysisActions.request };

	try {
		const paper = yield select( STORE_NAME ).selectPaper();
		const keyphrases = yield select( STORE_NAME ).selectKeyphrases();
		const config = yield select( STORE_NAME ).selectConfig();

		const preparedPaper = yield applyFilters( "yoast.seoStore.analysis.preparePaper", paper );

		const results = yield {
			type: ANALYZE_ACTION_NAME,
			payload: {
				paper: preparedPaper,
				keyphrases,
				config,
			},
		};

		const processedResults = yield applyFilters( "yoast.seoStore.analysis.processResults", results );

		return { type: analysisActions.success, payload: processedResults };
	} catch ( error ) {
		return { type: analysisActions.error, payload: error };
	}
}

const initialState = {
	status: ASYNC_STATUS.IDLE,
	error: "",
	seo: {
		focus: {},
	},
	readability: {},
	research: {
		morphology: {},
	},
};

const resultsSlice = createSlice( {
	name: RESULTS_SLICE_NAME,
	initialState,
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( analysisActions.request, ( state ) => {
			state.status = ASYNC_STATUS.LOADING;
		} );
		builder.addCase( analysisActions.success, ( state, { payload } ) => {
			state.status = ASYNC_STATUS.SUCCESS;
			state.seo = payload.seo;
			state.readability = payload.readability;
			state.research = payload.research;
		} );
		builder.addCase( analysisActions.error, ( state, { payload } ) => {
			state.status = ASYNC_STATUS.ERROR;
			state.error = payload;
		} );
	},
} );

export const resultsSelectors = {
	selectSeoResults: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `results.seo.${ id }`, {} ),
	selectReadabilityResults: ( state ) => get( state, "results.readability", {} ),
	selectResearchResults: ( state, id ) => get( state, `results.research.${ id }`, {} ),
};

export const resultsActions = {
	...resultsSlice.actions,
	analyze,
};

export default resultsSlice.reducer;
