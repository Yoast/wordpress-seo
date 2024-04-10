import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, forEach, pickBy, map } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { EDITOR_STORE, CORE_EDITOR_STORE, SYNC_TIME, POST_METADATA_KEYS } from "../../shared-admin/constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore, getEstimatedReadingTime } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import { getSeoTitle, getSeoDescription } from "./snippetEditorFieldsStore";
import getPrimaryTerms from "./primaryTaxonomiesFieldsStore";


const taxonomiesKeys = map( getPrimaryTerms(), ( value, key ) => {
	return { [ key ]: `_yoast_wpseo_${key}` };
} );

const METADATA_KEYS = { ...POST_METADATA_KEYS, ...taxonomiesKeys };
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

		const changedData = pickBy( data, ( value, key ) => value !== metadata[ METADATA_KEYS[ key ] ] );

		if ( changedData ) {
			const newMetadata = {};
			forEach( changedData, ( value, key ) => {
				newMetadata[ METADATA_KEYS[ key ] ] = value;
			} );

			editPost( {
				meta: newMetadata,
			} );
		}
	};
};

/**
 * Initializes the sync: from Yoast editor store to core editor store.
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
