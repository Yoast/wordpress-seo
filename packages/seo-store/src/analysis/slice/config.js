import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

const initialState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const configSlice = createSlice( {
	name: "config",
	initialState,
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
	selectConfig: state => get( state, "analysis.config" ),
	selectIsSeoActive: state => get( state, "analysis.config.isSeoActive" ),
	selectAnalysisType: state => get( state, "analysis.config.analysisType" ),
	selectIsReadabilityActive: state => get( state, "analysis.config.isReadabilityActive" ),
	selectResearches: state => get( state, "analysis.config.researches" ),
};

export const configActions = configSlice.actions;

export default configSlice.reducer;
