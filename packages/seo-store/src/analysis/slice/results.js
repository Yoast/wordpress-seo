/**
 * Analysis report result definition.
 * @typedef {Object} AnalysisReportResult
 * @property {string} rating
 * @property {bool} hasMarks
 * @property {string} text
 * @property {string} id
 * @property {func} marker
 * @property {number} score
 * @property {string} markerId
 */

/**
 * Analysis report results definition.
 * @typedef {Object} AnalysisReportResults
 * @property {Array<AnalysisReportResult>} errorsResults
 * @property {Array<AnalysisReportResult>} problemsResults
 * @property {Array<AnalysisReportResult>} improvementsResults
 * @property {Array<AnalysisReportResult>} goodResults
 * @property {Array<AnalysisReportResult>} considerationsResults
 */

import { createSlice } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { applyFilters } from "@wordpress/hooks";
import { get, reduce, forEach, merge, map } from "lodash";

import { ASYNC_ACTIONS, ASYNC_STATUS, FOCUS_KEYPHRASE_ID, STORE_NAME } from "../../common/constants";

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
		focus: {
			score: 0,
			results: {},
		},
	},
	readability: {
		score: 0,
		results: {},
	},
	research: {
		morphology: {},
	},
	activeMarker: {
		id: "",
		marks: [],
	},
};

/**
 * Maps a single analysis worker result to a analysis report result.
 *
 * So that it can be used by @yoast/analysis-report's ContentAnalysis.
 *
 * @param {Object} result Result provided by the analysis worker.
 * @param {string} key The keyphrase key to use for the marker id.
 *
 * @returns {AnalysisReportResult} The analysis report result.
 */
const transformAnalysisResult = ( result, keyphraseId ) => {
	const id = result.getIdentifier();
	const mappedResult = {
		score: result.score,
		rating: interpreters.scoreToRating( result.score ),
		hasMarks: result.hasMarks(),
		// Returning the marks instead of the marker to decouple the marker from the results. Leaving the marking to the UI.
		marker: result.marks.map( mark => {
			// Replacing the quotes to be the same as TinyMCE forces. Easier to detect if changes are from the editor or from marking.
			mark._properties.marked = mark._properties.marked.replace( "<yoastmark class='yoast-text-mark'>", "<yoastmark class=\"yoast-text-mark\">" );
			return mark;
		} ),
		id,
		text: result.text,
		markerId: `${ keyphraseId }:${ id }`,
	};

	// Because of inconsistency between yoastseo and @yoast/analysis-report.
	if ( mappedResult.rating === "ok" ) {
		mappedResult.rating = "OK";
	}

	return mappedResult;
};

/**
 *
 * @param {*} results
 * @returns {object} The results grouped by rating.
 */
const transformAnalysisResults = reduce(
	results,
	( transformedResults, result ) => merge( transformedResults, { [ result.rating ]: result } ),
	{},
);

const resultsSlice = createSlice( {
	name: "results",
	initialState,
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( analysisActions.request, ( state ) => {
			state.status = ASYNC_STATUS.LOADING;
		} );
		builder.addCase( analysisActions.success, ( state, action ) => {
			state.status = ASYNC_STATUS.SUCCESS;

			// Update SEO results state for each keyphrase
			forEach( action.payload.seo, ( keyphrasePayload, keyphrase ) => {
				state.seo[ keyphrase ].score = keyphrasePayload.score;
				state.seo[ keyphrase ].results = transformAnalysisResults( map( keyphrasePayload.results, transformAnalysisResult ) );
			} );

			state.readability = action.payload.readability;
			state.readability = action.payload.readability;

			state.research = action.payload.research;
		} );
		builder.addCase( analysisActions.error, ( state, action ) => {
			state.status = ASYNC_STATUS.ERROR;
			state.error = action.payload;
		} );
	},
} );

export const resultsSelectors = {
	selectSeoResults: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `analysis.results.seo.${ id }` ),
	selectReadabilityResults: ( state ) => get( state, "analysis.results.readability" ),
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
