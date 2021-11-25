import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const initialConfigState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const configSlice = createSlice( {
	name: "config",
	initialState: initialConfigState,
	reducers: {
		updateAnalysisType: ( state, { payload } ) => {
			state.analysisType = payload;
		},
		updateIsSeoActive: ( state, { payload } ) => {
			state.isSeoActive = Boolean( payload );
		},
		updateIsReadabilityActive: ( state, { payload } ) => {
			state.isReadabilityActive = Boolean( payload );
		},
		addResearch: ( state, { payload } ) => {
			state.researches.push( payload );
		},
		removeResearch: ( state, { payload } ) => {
			state.researches = state.researches.filter( research => research !== payload );
		},
	},
} );

export const configSelectors = {
	selectAnalysisConfig: state => get( state, "analysis.config" ),
	selectAnalysisType: state => get( state, "analysis.config.analysisType" ),
	isSeoAnalysisActive: state => get( state, "analysis.config.isSeoActive" ),
	isReadabilityAnalysisActive: state => get( state, "analysis.config.isReadabilityActive" ),
	selectResearches: state => get( state, "analysis.config.researches" ),
};

export const configActions = configSlice.actions;

export default configSlice.reducer;
