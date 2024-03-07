import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, get } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { EDITOR_STORE, CORE_EDITOR_STORE, SYNC_TIME, POST_METADATA_KEYS } from "../../shared-admin/constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import { getSeoTitle, getSeoDescription } from "./snippetEditorFieldsStore";
import { getEstimatedReadingTime } from "./additionalFieldsStore";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {object} An object with taxonomies keys and their primary term id.
 */
const getPrimaryTerms = () => {
	const wpseoScriptDataMetaData = get( window, "wpseoScriptData.metabox.metadata", {} );
	const getPrimaryTermsStore = {};
	const primaryTerms = pickBy( wpseoScriptDataMetaData, ( value, key ) => key.startsWith( "primary_" ) && value );
	forEach( primaryTerms, ( value, key ) => {
		const taxonomy = key.replace( "primary_", "" );
		getPrimaryTermsStore[ `primary_${taxonomy}` ] = () => {
			const termId = select( EDITOR_STORE )?.getPrimaryTaxonomyId( taxonomy );
			if ( ! termId || termId === -1 ) {
				return "";
			} else if ( typeof termId === "number" ) {
				return termId.toString();
			}
			return termId;
		};
		POST_METADATA_KEYS[ `primary_${taxonomy}` ] = `_yoast_wpseo_primary_${taxonomy}`;
	} );
	return getPrimaryTermsStore;
};

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( CORE_EDITOR_STORE );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		const metadata = select( CORE_EDITOR_STORE ).getCurrentPost().meta;

		if ( ! metadata || ! data ) {
			return;
		}

		const changedData = pickBy( data, ( value, key ) => value !== metadata[ POST_METADATA_KEYS[ key ] ] );

		if ( changedData ) {
			const newMetadata = {};
			forEach( changedData, ( value, key ) => {
				newMetadata[ POST_METADATA_KEYS[ key ] ] = value;
			} );

			editPost( {
				meta: newMetadata,
			} );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to product metadata.
 * @returns {function} The un-subscriber.
 */
export const blockEditorSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			focusKeyphrase: getFocusKeyphrase,
			noIndex: getNoIndex,
			noFollow: getNoFollow,
			facebookTitle: getFacebookTitle,
			facebookDescription: getFacebookDescription,
			facebookImageUrl: getFacebookImageUrl,
			facebookImageId: getFacebookImageId,
			twitterTitle: getTwitterTitle,
			twitterDescription: getTwitterDescription,
			twitterImageUrl: getTwitterImageUrl,
			twitterImageId: getTwitterImageId,
			pageType: getPageType,
			articleType: getArticleType,
			isCornerstone: isCornerstoneContent,
			readabilityScore: getReadabilityScore,
			seoScore: getSeoScore,
			inclusiveLanguageScore: getInclusiveLanguageScore,
			advanced: getAdvanced,
			breadcrumbsTitle: getBreadcrumbsTitle,
			canonical: getCanonical,
			wordProofTimestamp: getWordProofTimestamp,
			seoTitle: getSeoTitle,
			seoDescription: getSeoDescription,
			readingTime: getEstimatedReadingTime,
			...getPrimaryTerms(),

		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), EDITOR_STORE );
};
