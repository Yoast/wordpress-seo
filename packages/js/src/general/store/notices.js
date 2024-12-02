import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const NOTICES_NAME = "notices";

const slice = createSlice( {
	name: NOTICES_NAME,
	initialState: { resolvedNotices: [] },
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
export const getInitialNoticesState = slice.getInitialState;

export const noticesSelectors = {
	selectResolvedNotices: state => get( state, `${ NOTICES_NAME }.resolvedNotices`, [] ),
};

export const noticesActions = slice.actions;

export const noticesReducer = slice.reducer;
