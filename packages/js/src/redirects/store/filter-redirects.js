import { createSlice } from "@reduxjs/toolkit";

export const FILTER_SLICE_NAME = "filterRedirects";

/**
 * Initial state for the redirect filter slice.
 */
const initialState = {
	bulkAction: "",
	filterRedirectType: "",
	searchRedirects: "",
};

const slice = createSlice( {
	name: FILTER_SLICE_NAME,
	initialState,
	reducers: {
		setBulkAction( state, action ) {
			state.bulkAction = action.payload;
		},
		setFilterRedirectType( state, action ) {
			state.filterRedirectType = action.payload;
		},
		setSearchRedirects( state, action ) {
			state.searchRedirects = action.payload;
		},
		resetFilters( state ) {
			state.bulkAction = "";
			state.filterRedirectType = "";
			state.searchRedirects = "";
		},
	},
} );

export const filterActions = slice.actions;

export const getInitialFilterState = () => initialState;

export const filterSelectors = {
	selectBulkAction: state => state[ FILTER_SLICE_NAME ].bulkAction,
	selectFilterRedirectType: state => state[ FILTER_SLICE_NAME ].filterRedirectType,
	selectSearchRedirects: state => state[ FILTER_SLICE_NAME ].searchRedirects,
	selectFilterError: state => state[ FILTER_SLICE_NAME ].filterError,
};

export const filterReducer = slice.reducer;
