import { registerStore, StoreConfig } from "@wordpress/data";
import { pickBy } from "lodash";
import { SchemaBlocksDefaultState, SchemaBlocksState } from "./SchemaBlocksState";
import * as actions from "./actions";
import * as reducer from "./reducer";
import * as selectors from "./selectors";

export const YOAST_SCHEMA_STORE_NAME = "yoast-seo/schema-blocks";
/**
 * Initializes the Schema Blocks store.
 *
 * @returns {object} The Schema Blocks store.
 */
export default function initEditorStore() {
	const storeOptions: StoreConfig<SchemaBlocksState> = {
		reducer: reducer,
		selectors: { ...getFunctions( "function", selectors ) },
		actions: { ...getFunctions( "function", actions ) },
		initialState: SchemaBlocksDefaultState,
	};

	const store = registerStore( YOAST_SCHEMA_STORE_NAME, storeOptions );

	populateStore( store );

	return store;
}

function getFunctions( ...items: any[] ): Function[] {
	return pickBy( { ...items }, ( item: unknown ) => if ( typeof item === "function" ) );
}


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
		} ),
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
