/* eslint-disable complexity */
/* eslint-disable camelcase */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, get } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { EDITOR_STORE, SYNC_TIME } from "../../shared-admin/constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore, getEstimatedReadingTime } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import getPrimaryTerms from "./primaryTaxonomiesFieldsStore";

/**
 * Prepare twitter title to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
const prepareSocialTitle = ( value ) => {
	if ( value.trim() === select( EDITOR_STORE ).getSocialTitleTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Prepare twitter and facebook description to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
const prepareSocialDescription = ( value ) => {
	if ( value.trim() === select( EDITOR_STORE ).getSocialDescriptionTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Prepare value to be saved in hidden field.
 *
 * @param {string} key The key of the value.
 * @param {string} value The value to be saved.
 *
 * @returns {string} The value to be saved.
 */
const prepareValue = ( key, value ) => {
	switch ( key ) {
		case "wordproof_timestamp":
			return value ? "1" : "0";
		case "twitter-title":
		case "opengraph-title":
			return prepareSocialTitle( value );
		case "twitter-description":
		case "opengraph-description":
			return prepareSocialDescription( value );
		default:
			return value;
	}
};


/**
 * Creates an updater.
 * @returns {function} The updater.
 */
export const createUpdater = () => {
	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		// Get the values from hidden fields.
		const hiddenFieldsData = {};
		const yoastFormElement = document.getElementById( "yoast-form" ) || document.getElementById( "wpseo_meta" );

		if ( yoastFormElement ) {
			const hiddenFields = yoastFormElement?.querySelectorAll( "input[type=hidden]" );
			if ( hiddenFields ) {
				forEach( hiddenFields, ( field ) => {
					if ( field.id ) {
						hiddenFieldsData[ field.id ] = field.value;
					}
				} );
			}
		}

		if ( ! hiddenFieldsData || ! data ) {
			return;
		}

		const isPost = get( window, "wpseoScriptData.isPost", false );
		const prefix = isPost ? "yoast_wpseo_" : "hidden_wpseo_";

		const changedData = pickBy( data, ( value, key ) => ( prefix + key ) in hiddenFieldsData && value !== hiddenFieldsData[ prefix + key ] );

		if ( changedData ) {
			forEach( changedData, ( value, key ) => {
				document.getElementById( prefix + key ).value = prepareValue( key, value );
			} );
		}
	};
};

/**
 * The values to sync.
 *
 * Add values to sync from Yoast editor store to hidden fields.
 */
export const valuesToSync = {
	focuskw: getFocusKeyphrase,
	"meta-robots-noindex": getNoIndex,
	// Same as meta-robots-noindex for term metabox.
	noindex: getNoIndex,
	"meta-robots-nofollow": getNoFollow,
	"meta-robots-adv": getAdvanced,
	bctitle: getBreadcrumbsTitle,
	canonical: getCanonical,
	wordproof_timestamp: getWordProofTimestamp,
	"opengraph-title": getFacebookTitle,
	"opengraph-description": getFacebookDescription,
	"opengraph-image": getFacebookImageUrl,
	"opengraph-image-id": getFacebookImageId,
	"twitter-title": getTwitterTitle,
	"twitter-description": getTwitterDescription,
	"twitter-image": getTwitterImageUrl,
	"twitter-image-id": getTwitterImageId,
	schema_page_type: getPageType,
	schema_article_type: getArticleType,
	is_cornerstone: isCornerstoneContent,
	content_score: getReadabilityScore,
	linkdex: getSeoScore,
	inclusive_language_score: getInclusiveLanguageScore,
	"estimated-reading-time-minutes": getEstimatedReadingTime,
	...getPrimaryTerms(),
};

/**
 * Initializes the sync: from Yoast editor store to product metadata.
 * @returns {function} The un-subscriber.
 */
export const hiddenFieldsSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( valuesToSync ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), EDITOR_STORE );
};
