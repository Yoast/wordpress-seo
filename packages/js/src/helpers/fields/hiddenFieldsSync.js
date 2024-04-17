/* eslint-disable complexity */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, get, mapKeys } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { STORE_NAME_EDITOR, SYNC_TIME, META_KEYS, POST_INPUT_ID_PREFIX, TERM_INPUT_ID_PREFIX } from "../../shared-admin/constants";
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
	if ( value.trim() === select( STORE_NAME_EDITOR.free ).getSocialTitleTemplate().trim() ) {
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
	if ( value.trim() === select( STORE_NAME_EDITOR.free ).getSocialDescriptionTemplate().trim() ) {
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
		const yoastFormElement = document.getElementById( "wpseo_meta" ) || document.getElementById( "yoast-form" );

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

		const changedData = pickBy( data, ( value, key ) => ( key ) in hiddenFieldsData && value !== hiddenFieldsData[ key ] );

		if ( changedData ) {
			forEach( changedData, ( value, key ) => {
				document.getElementById( key ).value = prepareValue( key, value );
			} );
		}
	};
};

const isPost = get( window, "wpseoScriptData.isPost", false );
const prefix = isPost ? POST_INPUT_ID_PREFIX : TERM_INPUT_ID_PREFIX;

const primaryTaxonomiesGetters = mapKeys( getPrimaryTerms(), ( value, key ) => prefix + key );

const getters = mapKeys( {
	focusKeyphrase: getFocusKeyphrase,
	robotsNoIndex: getNoIndex,
	robotsNoFollow: getNoFollow,
	robotsAdvanced: getAdvanced,
	facebookTitle: getFacebookTitle,
	facebookDescription: getFacebookDescription,
	facebookImageUrl: getFacebookImageUrl,
	facebookImageId: getFacebookImageId,
	twitterTitle: getTwitterTitle,
	twitterDescription: getTwitterDescription,
	twitterImageUrl: getTwitterImageUrl,
	twitterImageId: getTwitterImageId,
	schemaPageType: getPageType,
	schemaArticleType: getArticleType,
	isCornerstone: isCornerstoneContent,
	readabilityScore: getReadabilityScore,
	seoScore: getSeoScore,
	inclusiveLanguageScore: getInclusiveLanguageScore,
	breadcrumbsTitle: getBreadcrumbsTitle,
	canonical: getCanonical,
	wordProofTimestamp: getWordProofTimestamp,
	readingTime: getEstimatedReadingTime,
}, ( value, key ) => prefix + META_KEYS[ key ] );

/**
 * Initializes the sync: from Yoast editor store to the hidden fields.
 * @returns {function} The un-subscriber.
 */
export const hiddenFieldsSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			...getters,
			...primaryTaxonomiesGetters,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORE_NAME_EDITOR.free );
};
