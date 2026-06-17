import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";

/**
 * @returns {{search: string, page: number}} The initial table query state.
 */
export const createInitialQueryState = () => ( { search: "", page: 1 } );

const slice = createSlice( {
	name: "query",
	initialState: createInitialQueryState(),
	reducers: {
		// Changing the search resets to the first page: the previous page may not exist in the new result set.
		setSearch: ( state, { payload } ) => {
			state.search = payload;
			state.page = 1;
		},
		setPage: ( state, { payload } ) => {
			state.page = payload;
		},
	},
	extraReducers: ( builder ) => {
		// Switching content type resets to the first page: the current page may not exist in the new content type's results.
		builder.addCase( activeContentTypeActions.setActiveContentType, ( state ) => {
			state.page = 1;
		} );
	},
} );

export const querySelectors = {
	selectSearch: ( state ) => get( state, "query.search", "" ),
	selectPage: ( state ) => get( state, "query.page", 1 ),
	selectQuery: ( state ) => get( state, "query", createInitialQueryState() ),
};

export const queryActions = slice.actions;

export default slice.reducer;
