import { createSlice } from "@reduxjs/toolkit";

export const FILTER_SLICE_NAME = "filterRedirects";

/**
 * Initial state for the redirect filter slice.
 */
const initialState = {
	bulkAction: "",
	filterRedirectType: "",
	searchRedirects: "",
	selectedRedirects: [],
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
		setSelectedRedirects( state, action ) {
			state.selectedRedirects = action.payload;
		},
		toggleSelectRedirect( state, action ) {
			const id = action.payload;
			if ( state.selectedRedirects.includes( id ) ) {
				state.selectedRedirects = state.selectedRedirects.filter( item => item !== id );
			} else {
				state.selectedRedirects.push( id );
			}
		},
		clearSelectedRedirects( state ) {
			state.selectedRedirects = [];
		},
		resetFilters( state ) {
			state.bulkAction = "";
			state.filterRedirectType = "";
			state.searchRedirects = "";
			state.selectedRedirects = [];
		},
	},
} );

export const filterActions = slice.actions;

export const getInitialFilterState = () => initialState;

export const filterSelectors = {
	selectBulkAction: state => state[ FILTER_SLICE_NAME ].bulkAction,
	selectFilterRedirectType: state => state[ FILTER_SLICE_NAME ].filterRedirectType,
	selectSearchRedirects: state => state[ FILTER_SLICE_NAME ].searchRedirects,
	selectSelectedRedirects: state => state[ FILTER_SLICE_NAME ].selectedRedirects,
	selectFilterError: state => state[ FILTER_SLICE_NAME ].filterError,
};

export const filterReducer = slice.reducer;
