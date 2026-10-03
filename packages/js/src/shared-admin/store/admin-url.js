import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const ADMIN_URL_NAME = "adminUrl";

const slice = createSlice( {
	name: ADMIN_URL_NAME,
	initialState: "",
	reducers: {
		setAdminUrl: ( state, { payload } ) => payload,
	},
} );

export const getInitialAdminUrlState = slice.getInitialState;

export const adminUrlSelectors = {
	selectAdminUrl: state => get( state, ADMIN_URL_NAME, "" ),
};
adminUrlSelectors.selectAdminLink = createSelector(
	[
		adminUrlSelectors.selectAdminUrl,
		( state, link ) => link,
	],
	( adminUrl, link = "" ) => {
		try {
			const url = new URL( link, adminUrl );
			return url.href;
		} catch ( e ) {
			return adminUrl;
		}
	}
);

export const adminUrlActions = slice.actions;

export const adminUrlReducer = slice.reducer;
