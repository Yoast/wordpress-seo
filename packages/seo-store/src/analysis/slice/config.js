import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const initialState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const configSlice = createSlice( {
	name: "config",
	initialState,
	reducers: {
		updateAnalysisType: ( state, action ) => {
			state.analysisType = action.payload;
		},
		updateIsSeoActive: ( state, action ) => {
			state.isSeoActive = Boolean( action.payload );
		},
		updateIsReadabilityActive: ( state, action ) => {
			state.isReadabilityActive = Boolean( action.payload );
		},
		addResearch: ( state, payload ) => {
			state.researches.push( payload );
		},
		removeResearch: ( state, payload ) => {
			state.researches.filter( research => research !== payload );
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
