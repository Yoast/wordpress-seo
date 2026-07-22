import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { activeContentTypeActions } from "./active-content-type";

/**
 * @returns {{search: string, page: number, statuses: string[], overviewIds: number[], isOverviewFilterActive: boolean}} The initial query state.
 */
export const createInitialQueryState = () => ( {
	search: "",
	page: 1,
	statuses: [],
	// The post IDs carried over from the WP admin overview, backing the "Overview selection" filter;
	// empty when the user did not come in via the overview's bulk action.
	overviewIds: [],
	isOverviewFilterActive: false,
} );

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
		// Changing the status filter resets to the first page: the filtered set may have fewer pages.
		setStatuses: ( state, { payload } ) => {
			state.statuses = payload;
			state.page = 1;
		},
		// Toggling the overview filter resets to the first page, like any other change to the result set.
		setOverviewFilterActive: ( state, { payload } ) => {
			state.isOverviewFilterActive = Boolean( payload );
			state.page = 1;
		},
	},
	extraReducers: ( builder ) => {
		// Switching content type resets to the first page: the current page may not exist in the new content
		// type's results. The overview selection belongs to the content type it was made for, so it goes too.
		builder.addCase( activeContentTypeActions.setActiveContentType, ( state ) => {
			state.page = 1;
			state.overviewIds = [];
			state.isOverviewFilterActive = false;
		} );
	},
} );

export const querySelectors = {
	selectSearch: ( state ) => get( state, "query.search", "" ),
	selectPage: ( state ) => get( state, "query.page", 1 ),
	selectStatuses: ( state ) => get( state, "query.statuses", [] ),
	selectOverviewIds: ( state ) => get( state, "query.overviewIds", [] ),
	selectIsOverviewFilterActive: ( state ) => get( state, "query.isOverviewFilterActive", false ),
	selectQuery: ( state ) => get( state, "query", createInitialQueryState() ),
};

export const queryActions = slice.actions;

export default slice.reducer;
