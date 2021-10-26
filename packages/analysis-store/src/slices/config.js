import { createSlice } from "@reduxjs/toolkit";
import { reduce, upperFirst } from "lodash";

export const CONFIG_SLICE_NAME = "config";

const initialState = {
	analysisType: "post",
	isSeoActive: true,
	isReadabilityActive: true,
	researches: [ "morphology" ],
};

const config = createSlice( {
	name: CONFIG_SLICE_NAME,
	initialState,
	reducers: {},
} );

export const configSelectors = reduce(
	initialState,
	( selectors, _, name ) => ( {
		...selectors,
		[ `select${ upperFirst( name ) }` ]: state => state[ CONFIG_SLICE_NAME ][ name ],
	} ),
	{},
);
configSelectors.selectConfig = state => state;

export const configActions = config.actions;

export default config.reducer;
