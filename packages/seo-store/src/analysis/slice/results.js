import { createSlice } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { applyFilters } from "@wordpress/hooks";
import { forEach, get, reduce } from "lodash";
import { ASYNC_ACTIONS, ASYNC_STATUS, FOCUS_KEYPHRASE_ID, STORE_NAME } from "../../common/constants";
import { ANALYZE_ACTION_NAME } from "../constants";

export const analysisAsyncActions = reduce(
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
export function* analyze() {
	yield { type: analysisAsyncActions.request };

	try {
		const paper = yield select( STORE_NAME ).selectPaper();
		const keyphrases = yield select( STORE_NAME ).selectKeyphrases();
		const config = yield select( STORE_NAME ).selectAnalysisConfig();

		const preparedPaper = yield applyFilters( "yoast.seoStore.analysis.preparePaper", paper, { keyphrases, config } );

		const results = yield { type: ANALYZE_ACTION_NAME, payload: { paper: preparedPaper, keyphrases, config } };

		const processedResults = yield applyFilters( "yoast.seoStore.analysis.processResults", results, {
			paper: preparedPaper,
			keyphrases,
			config,
		} );

		return { type: analysisAsyncActions.success, payload: processedResults };
	} catch ( error ) {
		return { type: analysisAsyncActions.error, payload: error };
	}
}

export const defaultResultsState = {
	status: ASYNC_STATUS.IDLE,
	error: "",
	seo: {
		focus: {
			score: 0,
			results: [],
		},
	},
	readability: {
		score: 0,
		results: [],
	},
	research: {},
	activeMarker: {
		id: "",
		marks: [],
	},
};

const resultsSlice = createSlice( {
	name: "results",
	initialState: defaultResultsState,
	reducers: {
		updateActiveMarker: ( state, { payload } ) => {
			state.activeMarker.id = payload.id;
			state.activeMarker.marks = payload.marks;
		},
	},
	extraReducers: ( builder ) => {
		builder.addCase( analysisAsyncActions.request, ( state ) => {
			state.status = ASYNC_STATUS.LOADING;
		} );
		builder.addCase( analysisAsyncActions.success, ( state, { payload } ) => {
			state.status = ASYNC_STATUS.SUCCESS;

			// Update SEO results state for each keyphrase
			forEach( payload.seo, ( keyphrasePayload, keyphraseId ) => {
				state.seo[ keyphraseId ] = {
					score: keyphrasePayload.score,
					results: keyphrasePayload.results,
				};
			} );

			state.readability.score = payload.readability.score;
			state.readability.results = payload.readability.results;

			state.research = payload.research;
		} );
		builder.addCase( analysisAsyncActions.error, ( state, { payload } ) => {
			state.status = ASYNC_STATUS.ERROR;
			state.error = payload;
		} );
	},
} );

export const resultsSelectors = {
	selectSeoScore: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `analysis.results.seo.${ id }.score` ),
	selectSeoResults: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `analysis.results.seo.${ id }.results` ),
	selectReadabilityScore: ( state ) => get( state, "analysis.results.readability.score" ),
	selectReadabilityResults: ( state ) => get( state, "analysis.results.readability.results" ),
	selectResearchResults: ( state, id ) => get( state, `analysis.results.research.${ id }` ),
	selectActiveMarker: ( state ) => get( state, "analysis.results.activeMarker" ),
	selectActiveMarkerId: ( state ) => get( state, "analysis.results.activeMarker.id" ),
	selectActiveMarks: ( state ) => get( state, "analysis.results.activeMarker.marks" ),
};

export const resultsActions = {
	...resultsSlice.actions,
	analyze,
};

export default resultsSlice.reducer;
