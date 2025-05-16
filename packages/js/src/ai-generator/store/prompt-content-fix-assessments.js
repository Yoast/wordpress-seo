import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const PROMPT_CONTENT_FIX_ASSESSMENTS_NAME = "promptContentFixAssessments";

const slice = createSlice( {
	name: PROMPT_CONTENT_FIX_ASSESSMENTS_NAME,
	initialState: {
		introduction: {
			text: "",
			length: 0,
			blockIds: [],
		},
		fullContent: {
			text: "",
			length: 0,
			blockIds: [],
		},
		sentenceLength: {
			text: "",
			length: 0,
			blockIds: [],
		},
		paragraphLength: {
			text: "",
			length: 0,
			blockIds: [],
		},
	},
	reducers: {
		setPromptContentFixAssessments: ( state, { payload } ) => payload,
		updateBlockIds: ( state, { payload } ) => {
			const { promptContentType, blockIds } = payload;
			state[ promptContentType ].blockIds = blockIds;
		},
	},
} );

export const getInitialPromptContentFixAssessmentsState = slice.getInitialState;

export const promptContentFixAssessmentsSelectors = {
	selectPromptContentFixAssessments: state => get( state, PROMPT_CONTENT_FIX_ASSESSMENTS_NAME, "" ),
	selectRelevantBlockIds: ( state, promptContentType ) => get( state, [ PROMPT_CONTENT_FIX_ASSESSMENTS_NAME, promptContentType, "blockIds" ], [] ),
};

export const promptContentFixAssessmentsActions = slice.actions;

export const promptContentFixAssessmentsReducer = slice.reducer;
