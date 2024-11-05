import { combineReducers, registerStore } from "@wordpress/data";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import { get, pickBy } from "lodash";
import * as controls from "../../redux/controls";
import { createFreezeReducer } from "../../redux/utils/create-freeze-reducer";
import { createSnapshotReducer } from "../../redux/utils/create-snapshot-reducer";
import * as snippetEditorActions from "../redux/actions/snippetEditor";
import * as analysisSelectors from "../redux/selectors/analysis";
import * as snippetEditorSelectors from "../redux/selectors/snippet-editor";
import * as wincherSelectors from "../redux/selectors/wincher-seo-performance";

/**
 * Populates the store.
 *
 * @param {Object} store The store to populate.
 *
 * @returns {void}
 */
const populateStore = store => {
	// Initialize the cornerstone content.
	store.dispatch( actions.loadCornerstoneContent() );
	// Initialize the focus keyphrase.
	store.dispatch( actions.loadFocusKeyword() );
	// Show marker buttons.
	store.dispatch( actions.setMarkerStatus( window.wpseoScriptData.metabox.elementorMarkerStatus ) );

	store.dispatch(
		actions.setSettings( {
			socialPreviews: {
				sitewideImage: window.wpseoScriptData.sitewideSocialImage,
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

	// Initialize the Social Preview data depending on which platform should be present
	const { facebook: showFacebook, twitter: showTwitter } = window.wpseoScriptData.metabox.showSocial;
	if ( showFacebook ) {
		store.dispatch( actions.loadFacebookPreviewData() );
	}
	if ( showTwitter ) {
		store.dispatch( actions.loadTwitterPreviewData() );
	}

	store.dispatch( actions.setSEMrushChangeCountry( window.wpseoScriptData.metabox.countryCode ) );
	store.dispatch( actions.setSEMrushLoginStatus( window.wpseoScriptData.metabox.SEMrushLoginStatus ) );
	store.dispatch( actions.setWincherLoginStatus( window.wpseoScriptData.metabox.wincherLoginStatus, false ) );
	store.dispatch( actions.setWincherWebsiteId( window.wpseoScriptData.metabox.wincherWebsiteId ) );
	store.dispatch( actions.setWincherAutomaticKeyphaseTracking( window.wpseoScriptData.metabox.wincherAutoAddKeyphrases ) );

	store.dispatch( actions.setDismissedAlerts( get( window, "wpseoScriptData.dismissedAlerts", {} ) ) );
	store.dispatch( actions.setCurrentPromotions( get( window, "wpseoScriptData.currentPromotions", {} ) ) );

	store.dispatch( actions.setIsPremium( Boolean( get( window, "wpseoScriptData.metabox.isPremium", false ) ) ) );

	store.dispatch( actions.setAdminUrl( get( window, "wpseoScriptData.adminUrl", "" ) ) );
	store.dispatch( actions.setLinkParams( get( window, "wpseoScriptData.linkParams", {} ) ) );
	store.dispatch( actions.setPluginUrl( get( window, "wpseoScriptData.pluginUrl", "" ) ) );
	store.dispatch( actions.setWistiaEmbedPermissionValue( get( window, "wpseoScriptData.wistiaEmbedPermission", false ) === "1" ) );

	// Due to Elementor not including a way to get the slug, we include it in our form data.
	// Hydrate the store with that slug value on load.
	const slugInput = document.getElementById( "yoast_wpseo_slug" );
	if ( slugInput ) {
		store.dispatch( actions.setEditorDataSlug( slugInput.value ) );
	}
};

/**
 * Initializes the Yoast SEO editor store.
 *
 * @returns {object} The Yoast SEO editor store.
 */
export default function initEditorStore() {
	const { snapshotReducer, takeSnapshot, restoreSnapshot } = createSnapshotReducer( combineReducers( reducers ) );
	const { freezeReducer, toggleFreeze } = createFreezeReducer( snapshotReducer );

	const store = registerStore( "yoast-seo/editor", {
		reducer: freezeReducer,
		selectors: {
			...selectors,
			// Add or override selectors that are specific for Elementor.
			...analysisSelectors,
			...snippetEditorSelectors,
			...wincherSelectors,
		},
		actions: pickBy( {
			...actions,
			// Add or override actions that are specific for Elementor.
			...snippetEditorActions,
		}, x => typeof x === "function" ),
		controls,
	} );

	populateStore( store );

	store._freeze = toggleFreeze.bind( null, store.getState );
	store._takeSnapshot = takeSnapshot.bind( null, store.getState, store.dispatch );
	store._restoreSnapshot = restoreSnapshot.bind( null, store.dispatch );

	return store;
}
