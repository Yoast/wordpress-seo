import { combineReducers, registerStore } from "@wordpress/data";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import { get, pickBy } from "lodash";
import * as controls from "../redux/controls";
import { STORES } from "../shared-admin/constants";

/**
 * Populates the store.
 *
 * @param {Object} store The store to populate.
 *
 * @returns {void}
 */
const populateStore = store => {
	store.dispatch(
		actions.setSettings( {
			socialPreviews: {
				sitewideImage: window.wpseoScriptData.metabox.sitewide_social_image,
				siteName: window.wpseoScriptData.metabox.site_name,
				contentImage: window.wpseoScriptData.metabox.first_content_image,
				twitterCardType: window.wpseoScriptData.metabox.twitterCardType,
			},
			snippetEditor: {
				baseUrl: window.wpseoScriptData.metabox.base_url,
				date: window.wpseoScriptData.metabox.metaDescriptionDate,
				recommendedReplacementVariables: window.wpseoScriptData.analysis.plugins.replaceVars.recommended_replace_vars,
				siteIconUrl: window.wpseoScriptData.metabox.siteIconUrl,
			},
		} )
	);

	store.dispatch( actions.setSEMrushChangeCountry( window.wpseoScriptData.metabox.countryCode ) );
	store.dispatch( actions.setSEMrushLoginStatus( window.wpseoScriptData.metabox.SEMrushLoginStatus ) );
	store.dispatch( actions.setWincherLoginStatus( window.wpseoScriptData.metabox.wincherLoginStatus, false ) );
	store.dispatch( actions.setWincherWebsiteId( window.wpseoScriptData.metabox.wincherWebsiteId ) );
	store.dispatch( actions.setWincherAutomaticKeyphaseTracking( window.wpseoScriptData.metabox.wincherAutoAddKeyphrases ) );

	store.dispatch( actions.setDismissedAlerts( get( window, "wpseoScriptData.dismissedAlerts", {} ) ) );
	store.dispatch( actions.setCurrentPromotions( get( window, "wpseoScriptData.currentPromotions", [] ) ) );
	store.dispatch( actions.setIsPremium( Boolean( get( window, "wpseoScriptData.metabox.isPremium", false ) ) ) );
	store.dispatch( actions.setPostId( Number( get( window, "wpseoScriptData.postId", null ) ) ) );

	store.dispatch( actions.setLinkParams( get( window, "wpseoScriptData.linkParams", {} ) ) );
	store.dispatch( actions.setPluginUrl( get( window, "wpseoScriptData.pluginUrl", "" ) ) );
	store.dispatch( actions.setWistiaEmbedPermissionValue( get( window, "wpseoScriptData.wistiaEmbedPermission", false ) === "1" ) );
};

/**
 * Initializes the Yoast SEO editor store.
 * @param {Object} [extra] Additional store configuration.
 * @returns {object} The Yoast SEO editor store.
 */
export default function initEditorStore( extra = {} ) {
	const store = registerStore( STORES.editor, {
		reducer: combineReducers( { ...reducers, ...extra.reducers } ),
		initialState: { ...extra.initialState },
		actions: pickBy( { ...actions, ...extra.actions }, x => typeof x === "function" ),
		selectors: { ...selectors, ...extra.selectors },
		controls: { ...controls, ...extra.controls },
		resolvers: { ...extra.resolvers },
	} );

	populateStore( store );

	return store;
}
