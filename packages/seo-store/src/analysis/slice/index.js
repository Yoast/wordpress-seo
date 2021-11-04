import { createSelector } from "@reduxjs/toolkit";
import { combineReducers } from "@wordpress/data";
import { editorSelectors } from "../../editor/slice";
import { formSelectors } from "../../form/slice";
import configReducer, { configActions, configSelectors } from "./config";
import resultsReducer, { resultsActions, resultsSelectors } from "./results";

export const ANALYSIS_SLICE_NAME = "analysis";

export const analysisSelectors = {
	...resultsSelectors,
	...configSelectors,
	selectPaper: createSelector(
		editorSelectors.selectContent,
		formSelectors.selectTitle,
		formSelectors.selectDescription,
		formSelectors.selectSlug,
		editorSelectors.selectPermalink,
		editorSelectors.selectDate,
		( content, title, description, slug, permalink, date ) => ( { content, title, description, slug, permalink, date } ),
	),
};

export const analysisActions = {
	...resultsActions,
	...configActions,
};

export default combineReducers( {
	config: configReducer,
	results: resultsReducer,
} );
