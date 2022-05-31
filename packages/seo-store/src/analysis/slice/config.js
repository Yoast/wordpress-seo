import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const defaultConfigState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	shouldApplyCornerstoneAnalysis: false,
	researches: [ "morphology" ],
};

const configSlice = createSlice( {
	name: "config",
	initialState: defaultConfigState,
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
		updateShouldApplyCornerstoneAnalysis: ( state, { payload } ) => {
			state.shouldApplyCornerstoneAnalysis = Boolean( payload );
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
	selectIsSeoAnalysisActive: state => get( state, "analysis.config.isSeoActive" ),
	selectIsReadabilityAnalysisActive: state => get( state, "analysis.config.isReadabilityActive" ),
	shouldApplyCornerstoneAnalysis: state => get( state, "analysis.config.shouldApplyCornerstoneAnalysis" ),
	selectResearches: state => get( state, "analysis.config.researches" ),
};

export const configActions = configSlice.actions;

export default configSlice.reducer;
