import { combineReducers, registerStore } from "@wordpress/data";
import { pickBy } from "lodash";
import { actions, reducers, selectors } from "@yoast/externals/redux";
import * as analysisSelectors from "../redux/selectors/analysis";
import * as controls from "../../redux/controls";
import * as snippetEditorActions from "../redux/actions/snippetEditor";

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
	// Hide marker buttons.
	store.dispatch( actions.setMarkerStatus( "hidden" ) );

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
};

/**
 * Initializes the Yoast SEO editor store.
 *
 * @returns {object} The Yoast SEO editor store.
 */
export default function initEditorStore() {
	const store = registerStore( "yoast-seo/editor", {
		reducer: combineReducers( reducers ),
		selectors: {
			...selectors,
			// Add or override selectors that are specific for Elementor.
			...analysisSelectors,
		},
		actions: pickBy( {
			...actions,
			// Add or override actions that are specific for Elementor.
			...snippetEditorActions,
		}, x => typeof x === "function" ),
		controls,
	} );

	populateStore( store );

	return store;
}
