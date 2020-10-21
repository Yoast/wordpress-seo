import { pickBy } from "lodash";
import { combineReducers, registerStore } from "@wordpress/data";
import reducers from "../redux/reducers";
import * as selectors from "../redux/selectors";
import * as actions from "../redux/actions";
import { setSettings } from "../redux/actions/settings";
import { loadCornerstoneContent, loadFocusKeyword, setSEMrushChangeCountry, loadSnippetEditorData } from "../redux/actions";
import { setSEMrushLoginStatus } from "../redux/actions";

/**
 * Populates the store.
 *
 * @param {Object} store The store to populate.
 *
 * @returns {void}
 */
const populateStore = store => {
	// Initialize the cornerstone content.
	store.dispatch( loadCornerstoneContent() );
	// Initialize the focus keyphrase.
	store.dispatch( loadFocusKeyword() );

	store.dispatch(
		setSettings( {
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

	store.dispatch(
		setSEMrushChangeCountry( window.wpseoScriptData.metabox.countryCode )
	);
	store.dispatch(
		setSEMrushLoginStatus( window.wpseoScriptData.metabox.SEMrushLoginStatus )
	);
};

/**
 * Initializes the Yoast SEO editor store.
 *
 * @returns {object} The Yoast SEO editor store.
 */
export default function initEditorStore() {
	const store = registerStore( "yoast-seo/editor", {
		reducer: combineReducers( reducers ),
		selectors,
		actions: pickBy( actions, x => typeof x === "function" ),
	} );

	populateStore( store );

	return store;
}
