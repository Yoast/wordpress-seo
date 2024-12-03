import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const FTC_NAME = "firstTimeConfiguration";

const slice = createSlice( {
	name: FTC_NAME,
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
export const getInitialFirstTimeConfigurationState = slice.getInitialState;

export const firstTimeConfigurationSelectors = {
	selectResolvedNotices: state => get( state, `${ FTC_NAME }.resolvedNotices`, [] ),
};

export const firstTimeConfigurationActions = slice.actions;

export const firstTimeConfigurationReducer = slice.reducer;
