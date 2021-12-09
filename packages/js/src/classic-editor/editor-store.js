import { combineReducers, registerStore } from "@wordpress/data";
import { pickBy } from "lodash";
import * as actions from "../redux/actions";
import * as controls from "../redux/controls";
import reducers from "../redux/reducers";
import * as selectors from "../redux/selectors";

export const EDITOR_STORE_NAME = "yoast-seo/editor";

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
				authorName: window.wpseoScriptData.metabox.author_name,
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
};

/**
 * Initializes the Yoast SEO editor store.
 *
 * @returns {object} The Yoast SEO editor store.
 */
export default function initEditorStore() {
	const store = registerStore( EDITOR_STORE_NAME, {
		reducer: combineReducers( reducers ),
		selectors: {
			...selectors,
		},
		actions: pickBy( {
			...actions,
		}, x => typeof x === "function" ),
		controls,
	} );

	populateStore( store );

	return store;
}
