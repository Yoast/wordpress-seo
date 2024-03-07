/* eslint-disable complexity */
/* eslint-disable camelcase */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, get } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { STORE, SYNC_TIME } from "../../shared-admin/constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import { getEstimatedReadingTime } from "./additionalFieldsStore";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {integer} The no index value.
 */
const getPrimaryTerms = () => {
	const wpseoScriptDataMetaData = get( window, "wpseoScriptData.metabox.metadata", {} );
	const getPrimaryTermsStore = {};
	const primaryTerms = pickBy( wpseoScriptDataMetaData, ( value, key ) => key.startsWith( "primary_" ) && value );
	forEach( primaryTerms, ( value, key ) => {
		const taxonomy = key.replace( "primary_", "" );
		getPrimaryTermsStore[ `primary_${taxonomy}` ] = () => String( select( STORE )?.getPrimaryTaxonomyId( taxonomy ) );
	} );
	return getPrimaryTermsStore;
};

/**
 * Prepare twitter title to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
const prepareSocialTitle = ( value ) => {
	if ( value.trim() === select( STORE ).getSocialTitleTemplate().trim() ) {
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
	if ( value.trim() === select( STORE ).getSocialDescriptionTemplate().trim() ) {
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
		case "is_cornerstone":
			return value ? "1" : "0";
		case "twitter-title":
		case "opengraph-title":
			return prepareSocialTitle( value );
		case "twitter-description":
		case "opengraph-description":
			return prepareSocialDescription( value );
		default:
			if ( /^primary_/.test( key ) ) {
				return value === -1 ? "" : String( value );
			}
			return value;
	}
};


/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		// Get the values from hidden fields.
		const hiddenFieldsData = {};
		const wpseoMetaElement = document.getElementById( "wpseo_meta" );
		const hiddenFields = wpseoMetaElement?.querySelectorAll( "input[type=hidden]" );
		forEach( hiddenFields, ( field ) => {
			if ( field.id ) {
				hiddenFieldsData[ field.id ] = field.value;
			}
		} );

		if ( ! hiddenFieldsData || ! data ) {
			return;
		}
		console.log( { hiddenFieldsData } );

		const isPost = get( window, "wpseoScriptData.isPost", false );
		const prefix = isPost ? "yoast_wpseo_" : "hidden_wpseo_";

		const changedData = pickBy( data, ( value, key ) => ( prefix + key ) in hiddenFieldsData && value !== hiddenFieldsData[ prefix + key ] );
		console.log( changedData );

		if ( changedData ) {
			forEach( changedData, ( value, key ) => {
				document.getElementById( prefix + key ).value = prepareValue( key, value );
			} );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to product metadata.
 * @returns {function} The un-subscriber.
 */
export const hiddenFieldsrSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			focuskw: getFocusKeyphrase,
			"meta-robots-noindex": getNoIndex,
			// Same as meta-robots-noindex for term metabox.
			noindex: getNoIndex,
			"meta-robots-nofollow": getNoFollow,
			"meta-robots-adv": getAdvanced,
			bctitle: getBreadcrumbsTitle,
			canonical: getCanonical,
			wordproof_timestamp: getWordProofTimestamp,
			// primary_category_term: getPrimaryCategoryId,
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
			primary_category: () => String( select( STORE )?.getPrimaryTaxonomyId( "category" ) ),
			...getPrimaryTerms(),
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORE );
};
