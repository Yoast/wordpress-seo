import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";

/**
 * @returns {{search: string, page: number, statuses: string[]}} The initial table query state.
 */
export const createInitialQueryState = () => ( { search: "", page: 1, statuses: [] } );

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
		// Toggling a status filter resets to the first page: the filtered set may have fewer pages.
		toggleStatus: ( state, { payload } ) => {
			state.statuses = state.statuses.includes( payload )
				? state.statuses.filter( ( status ) => status !== payload )
				: [ ...state.statuses, payload ];
			state.page = 1;
		},
		clearStatuses: ( state ) => {
			state.statuses = [];
			state.page = 1;
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
	selectStatuses: ( state ) => get( state, "query.statuses", [] ),
	selectQuery: ( state ) => get( state, "query", createInitialQueryState() ),
};

export const queryActions = slice.actions;

export default slice.reducer;
