import { createSelector, createSlice } from "@reduxjs/toolkit";
import { defaultTo, get, isEmpty } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPreferencesState = () => ( {
	...get( window, "wpseoScriptData.preferences", {} ),
	documentTitle: defaultTo( document?.title, "" ),
} );

const slice = createSlice( {
	name: "preferences",
	initialState: createInitialPreferencesState(),
	reducers: {},
} );

export const preferencesSelectors = {
	selectPreference: ( state, preference, defaultValue = {} ) => get( state, `preferences.${ preference }`, defaultValue ),
	selectPreferences: state => get( state, "preferences", {} ),
};
preferencesSelectors.selectHasPageForPosts = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "homepageIsLatestPosts" ),
		state => preferencesSelectors.selectPreference( state, "homepagePostsEditUrl" ),
	],
	( homepageIsLatestPosts, homepagePostsEditUrl ) => ! homepageIsLatestPosts && ! isEmpty( homepagePostsEditUrl )
);
preferencesSelectors.selectCanEditUser = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "currentUserId", -1 ),
		state => preferencesSelectors.selectPreference( state, "canEditUsers", false ),
		( state, userId ) => userId,
	],
	( currentUserId, canEditUsers, userId ) => currentUserId === userId || canEditUsers
);
preferencesSelectors.selectExampleUrl = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "siteUrl", "https://example.com" ),
		( state, path ) => path,
	],
	( siteUrl, path ) => siteUrl + path
);
preferencesSelectors.selectPluginUrl = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "pluginUrl", "https://example.com" ),
		( state, path ) => path,
	],
	( pluginUrl, path ) => pluginUrl + path
);
preferencesSelectors.selectUpsellSettingsAsProps = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "upsellSettings", {} ),
		( state, ctbName = "premiumCtbId" ) => ctbName,
	],
	( upsellSettings, ctbName ) => ( {
		"data-action": upsellSettings?.actionId,
		"data-ctb-id": upsellSettings?.[ ctbName ],
	} )
);

export const preferencesActions = slice.actions;

export default slice.reducer;
