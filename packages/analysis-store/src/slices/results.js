import { createSlice } from "@reduxjs/toolkit";
import { get, reduce } from "lodash";
import { ASYNC_ACTIONS, ASYNC_STATUS, FOCUS_ID } from "../constants";

export const RESULTS_SLICE_NAME = "results";
export const ANALYZE_ACTION_NAME = "analyze";
export const PREPARE_PAPER_ACTION_NAME = "preparePaper";
export const PROCESS_RESULTS_ACTION_NAME = "processResults";

const analyzeActions = reduce(
	ASYNC_ACTIONS,
	( actions, action ) => ( { ...actions, [ action ]: `${ ANALYZE_ACTION_NAME }/${ action }` } ),
	{},
);

function* preparePaper( payload ) {
	return yield { type: PREPARE_PAPER_ACTION_NAME, payload };
}

function* processResults( payload ) {
	return yield { type: PROCESS_RESULTS_ACTION_NAME, payload };
}

function* analyze( { paper, targets, config } ) {
	yield { type: analyzeActions.request };

	try {
		const preparedPaper = yield { type: PREPARE_PAPER_ACTION_NAME, payload: paper };
		// Add seoTitleWidth to paper here in some smart way (after preparePaper/replaceVars)

		const response = yield {
			type: ANALYZE_ACTION_NAME, payload: {
				paper: preparedPaper,
				targets,
				config,
			},
		};

		// Should we call process per type? E.g. seo, readability.
		const processedResults = yield { type: PROCESS_RESULTS_ACTION_NAME, payload: response };

		return { type: analyzeActions.success, payload: processedResults };
	} catch ( error ) {
		return { type: analyzeActions.error, payload: error };
	}
}

const results = createSlice( {
	name: RESULTS_SLICE_NAME,
	initialState: {
		status: ASYNC_STATUS.IDLE,
		error: "",
		seo: {
			focus: {},
		},
		readability: {},
		research: {
			morphology: {},
		},
	},
	reducers: {},
	extraReducers: ( builder ) => {
		builder.addCase( analyzeActions.request, ( state ) => {
			state.status = ASYNC_STATUS.LOADING;
		} );
		builder.addCase( analyzeActions.success, ( state, action ) => {
			state.status = ASYNC_STATUS.SUCCESS;
			state.seo = action.payload.seo;
			state.readability = action.payload.readability;
			state.research = action.payload.research;
		} );
		builder.addCase( analyzeActions.error, ( state, action ) => {
			state.status = ASYNC_STATUS.ERROR;
			state.error = action.payload;
		} );
	},
} );

const selectSeoResults = ( state, id = FOCUS_ID ) => get( state, `results.seo.${ id }`, {} );

export const resultsSelectors = {
	selectSeoResults,
};

export const resultsActions = {
	...results.actions,
	analyze,
	preparePaper,
	processResults,
};

export default results.reducer;
