import { dispatch, select, subscribe } from "@wordpress/data";
import { debounce, pickBy, mapKeys } from "lodash";
import { createWatcher, createCollectorFromObject } from "../../helpers/create-watcher";
import { EDITOR_STORE, CORE_EDITOR_STORE, SYNC_TIME, META_KEYS, POST_META_KEY_PREFIX } from "../../shared-admin/constants";
import { getFacebookImageId, getFacebookTitle, getFacebookDescription, getFacebookImageUrl } from "./facebookFieldsStore";
import { getTwitterImageId, getTwitterTitle, getTwitterDescription, getTwitterImageUrl } from "./twitterFieldsStore";
import { getPageType, getArticleType } from "./schemaFieldsStore";
import { getFocusKeyphrase, isCornerstoneContent, getReadabilityScore, getSeoScore, getInclusiveLanguageScore, getEstimatedReadingTime } from "./analysisFieldsStore";
import { getNoIndex, getNoFollow, getAdvanced, getBreadcrumbsTitle, getCanonical, getWordProofTimestamp } from "./advancedFieldsStore";
import { getSeoTitle, getSeoDescription } from "./snippetEditorFieldsStore";
import getPrimaryTerms from "./primaryTaxonomiesFieldsStore";

/**
 * Creates an updater.
 * @returns {function} The updater.
 */
const createUpdater = () => {
	const { editPost } = dispatch( CORE_EDITOR_STORE );
	const { getCurrentPost } = select( CORE_EDITOR_STORE );

	/**
	 * Syncs the data to the WP entity record.
	 * @param {Object} data The collected data.
	 * @returns {void}
	 */
	return ( data ) => {
		const currentPost = getCurrentPost();

		if ( ! currentPost.hasOwnProperty( "meta" ) || ! data ) {
			return;
		}

		const metadata = currentPost.meta;

		const changedData = pickBy( data, ( value, key ) => value !== metadata[ key ] );

		if ( changedData ) {
			editPost( {
				meta: changedData,
			} );
		}
	};
};

const primaryTaxonomiesGetters = mapKeys( getPrimaryTerms(), ( value, key ) => POST_META_KEY_PREFIX + key );

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
	seoTitle: getSeoTitle,
	seoDescription: getSeoDescription,
	readingTime: getEstimatedReadingTime,
}, ( value, key ) => POST_META_KEY_PREFIX + META_KEYS[ key ] );

/**
 * Initializes the sync: from Yoast editor store to core editor store.
 * @returns {function} The un-subscriber.
 */
export const blockEditorSync = () => {
	return subscribe( debounce( createWatcher(
		createCollectorFromObject( {
			...getters,
			...primaryTaxonomiesGetters,
		} ),
		createUpdater()
	), SYNC_TIME.wait, { maxWait: SYNC_TIME.max } ), EDITOR_STORE );
};
