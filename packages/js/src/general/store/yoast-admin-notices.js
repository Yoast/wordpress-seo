import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const YOAST_ADMIN_NOTICES_NAME = "YoastAdminNotices";

const slice = createSlice( {
	name: FTC_NAME,
	initialState: { resolvedNotices: [] },
	name: YOAST_ADMIN_NOTICES_NAME,
	reducers: {
		/**
		 * @param {Object} state The state of the slice.
		 * @param {string} noticeID The ID of the notice to resolve.
		 * @returns {void}
		 */
		resolveNotice( state, { payload: noticeID } ) {
			if ( ! state.resolvedNotices.includes( noticeID ) ) {
				state.resolvedNotices.push( noticeID );
			}
		},
		/**
		 * @param {Object} state The state of the slice.
		 * @param {string} noticeID The ID of the notice to unresolve.
		 * @returns {void}
		 */
		unresolveNotice( state, { payload: noticeID } ) {
			state.resolvedNotices = state.resolvedNotices.filter( ( id ) => id !== noticeID );
		},
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialYoastAdminNoticesState = slice.getInitialState;

export const YoastAdminNoticesSelectors = {
	selectResolvedNotices: state => get( state, `${ YOAST_ADMIN_NOTICES_NAME }.resolvedNotices`, [] ),
};

export const YoastAdminNoticesActions = slice.actions;

export const YoastAdminNoticesReducer = slice.reducer;
