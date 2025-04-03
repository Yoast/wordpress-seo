import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { getMigratingNoticeInfo } from "../../helpers/migrateNotices";

export const ADMIN_NOTICES_NAME = "adminNotices";

const slice = createSlice( {
	name: ADMIN_NOTICES_NAME,
	initialState: { notices: getMigratingNoticeInfo() },
	reducers: {
		/**
		 * @param {Object} state The state of the slice.
		 * @param {string} noticeID The ID of the notice to resolve.
		 * @returns {void}
		 */
		dismissNotice( state, { payload: noticeID } ) {
			state.notices.map( ( notice ) => {
				if ( notice.id === noticeID ) {
					notice.isDismissed = true;
				}
			} );
		},
		/**
		 * @param {Object} state The state of the slice.
		 * @param {string} noticeID The ID of the notice to unresolve.
		 * @returns {void}
		 */
		restoreNotice( state, { payload: noticeID } ) {
			state.notices.map( ( notice ) => {
				if ( notice.id === noticeID ) {
					notice.isDismissed = false;
				}
			} );
		},
	},
} );

/**
 * @returns {Object} The initial state.
 */
export const getInitialAdminNoticesState = slice.getInitialState;

export const adminNoticesSelectors = {
	selectNotices: state => get( state, `${ ADMIN_NOTICES_NAME }.notices`, [] ),
};

export const adminNoticesActions = slice.actions;

export const adminNoticesReducer = slice.reducer;
