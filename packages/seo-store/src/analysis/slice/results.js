import { createSlice } from "@reduxjs/toolkit";
import { select } from "@wordpress/data";
import { get, reduce } from "lodash";
import { ASYNC_ACTIONS, ASYNC_STATUS, FOCUS_KEYPHRASE_ID, STORE_NAME } from "../../constants";

export const RESULTS_SLICE_NAME = "results";
export const ANALYZE_ACTION_NAME = "analyze";
export const PREPARE_PAPER_ACTION_NAME = "preparePaper";
export const PROCESS_RESULTS_ACTION_NAME = "processResults";

const analysisActions = reduce(
	ASYNC_ACTIONS,
	( actions, action ) => ( { ...actions, [ action ]: `${ ANALYZE_ACTION_NAME }/${ action }` } ),
	{},
);

function* analyze() {
	yield { type: analysisActions.request };

	try {
		const paper = yield select( STORE_NAME ).selectPaper();
		const keyphrases = yield select( STORE_NAME ).selectKeyphrases();
		const config = yield select( STORE_NAME ).selectConfig();

		const preparedPaper = yield { type: PREPARE_PAPER_ACTION_NAME, payload: paper };
		// Add seoTitleWidth to paper here in some smart way (after preparePaper/replaceVars)
		const response = yield {
			type: ANALYZE_ACTION_NAME, payload: {
				paper: preparedPaper,
				keyphrases,
				config,
			},
		};

		// Should we call process per type? E.g. seo, readability.
		const processedResults = yield { type: PROCESS_RESULTS_ACTION_NAME, payload: response };

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
		builder.addCase( analysisActions.success, ( state, action ) => {
			state.status = ASYNC_STATUS.SUCCESS;
			state.seo = action.payload.seo;
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
	selectSeoResults: ( state, id = FOCUS_KEYPHRASE_ID ) => get( state, `results.seo.${ id }`, {} ),
	selectReadabilityResults: ( state ) => get( state, "results.readability", {} ),
	selectResearchResults: ( state, id ) => get( state, `results.research.${ id }`, {} ),
};

export const resultsActions = {
	...resultsSlice.actions,
	analyze,
};

export default resultsSlice.reducer;
