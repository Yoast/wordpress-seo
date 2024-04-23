/* eslint-disable complexity */
import { select, subscribe } from "@wordpress/data";
import { debounce, forEach, mapKeys } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { HIDDEN_INPUT_ID_PREFIX, SYNC_TIME, META_KEYS } from "./constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore, getEstimatedReadingTime } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import getPrimaryTerms from "./primaryTaxonomiesFieldsStore";
import { getSeoTitle, getSeoDescription } from "./snippetEditorFieldsStore";

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
		forEach( data, ( value, key ) => {
			const field = document.getElementById( key );
			if ( field && field.value !== value ) {
				field.value = prepareValue( key, value );
			}
		} );
	};
};

/**
 * Initializes the sync: from Yoast editor store to the hidden fields.
 * @returns {function} The un-subscriber.
 */
export const hiddenFieldsSync = () => {
	const isPost = select( STORE_NAME_EDITOR.free ).getIsPost();
	const prefix = isPost ? HIDDEN_INPUT_ID_PREFIX.post : HIDDEN_INPUT_ID_PREFIX.term;
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
		seoTitle: getSeoTitle,
		seoDescription: getSeoDescription,
	}, ( value, key ) => prefix + META_KEYS[ key ] );

	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			...getters,
			...primaryTaxonomiesGetters,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORE_NAME_EDITOR.free );
};
