import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, get } from "lodash";
import createWatcher, { createCollectorFromObject } from "../../helpers/create-watcher";
import { STORE, CORE_EDITOR_STORE, SYNC_TIME, METADATA_KEYS } from "../../constants";
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
 * @returns {integer} The no index value.
 */
const getPrimaryTerms = () => {
	const wpseoScriptDataMetaData = get( window, "wpseoScriptData.metabox.metadata", {} );
	const getPrimaryTermsStore = {};
	const primaryTerms = pickBy( wpseoScriptDataMetaData, ( value, key ) => key.startsWith( "primary_" ) && value );
	forEach( primaryTerms, ( value, key ) => {
		const taxonomy = key.replace( "primary_", "" );
		getPrimaryTermsStore[ `primary_${taxonomy}` ] = () => String( select( STORE )?.getPrimaryTaxonomyId( taxonomy ) );
		METADATA_KEYS[ `primary_${taxonomy}` ] = `_yoast_wpseo_primary_${taxonomy}`;
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
		console.log( { data } );
		console.log( { metadata } );
		const changedData = pickBy( data, ( value, key ) => value !== metadata[ METADATA_KEYS[ key ] ] );
		console.log( { changedData } );

		if ( changedData ) {
			const newMetadata = {};
			forEach( changedData, ( value, key ) => {
				newMetadata[ METADATA_KEYS[ key ] ] = value;
			} );

			console.log( { newMetadata } );

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
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), STORE );
};
