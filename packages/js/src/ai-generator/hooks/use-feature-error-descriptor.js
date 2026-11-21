import { select } from "@wordpress/data";
import { useCallback } from "@wordpress/element";
import { ASYNC_ACTION_STATUS } from "../../shared-admin/constants";
import { STORE_NAME_AI, STORE_NAME_EDITOR } from "../constants";

/**
 * Whether a valid Premium subscription is required but missing for this entity.
 *
 * @param {Object} editorSelect The editor store selectors.
 * @param {Object} currentSubscriptions The premium/woo subscription validity.
 * @returns {boolean} Whether Premium is needed but not active.
 */
const needsPremiumSubscription = ( editorSelect, currentSubscriptions ) => {
	const requiresPremium = editorSelect.getIsPremium() || editorSelect.getIsWooProductEntity();
	return requiresPremium && ! currentSubscriptions.premiumSubscription;
};

/**
 * Whether a valid WooCommerce SEO subscription is required but missing for this entity.
 *
 * @param {Object} editorSelect The editor store selectors.
 * @param {Object} currentSubscriptions The premium/woo subscription validity.
 * @returns {boolean} Whether WooCommerce SEO is needed but not active.
 */
const needsWooSeoSubscription = ( editorSelect, currentSubscriptions ) => {
	const requiresWooSeo = editorSelect.getIsWooProductEntity() && editorSelect.getIsWooSeoActive();
	return requiresWooSeo && ! currentSubscriptions.wooCommerceSubscription;
};

/**
 * Collects the products whose subscription is invalid for the current entity.
 *
 * @param {Object} currentSubscriptions The premium/woo subscription validity.
 * @returns {string[]} The product names with an invalid subscription.
 */
const collectInvalidSubscriptions = ( currentSubscriptions ) => {
	const editorSelect = select( STORE_NAME_EDITOR );

	const invalidSubscriptions = [];
	if ( needsPremiumSubscription( editorSelect, currentSubscriptions ) ) {
		invalidSubscriptions.push( "Yoast SEO Premium" );
	}
	if ( needsWooSeoSubscription( editorSelect, currentSubscriptions ) ) {
		invalidSubscriptions.push( "Yoast WooCommerce SEO" );
	}
	return invalidSubscriptions;
};

/**
 * Reads the usage-count error from the store as an error descriptor, or null when
 * the usage-count fetch did not fail.
 *
 * @returns {Object|null} The descriptor or null.
 */
const usageCountErrorDescriptor = () => {
	const aiSelect = select( STORE_NAME_AI );
	if ( aiSelect.selectUsageCountStatus() !== ASYNC_ACTION_STATUS.error ) {
		return null;
	}
	const usageCountError = aiSelect.selectUsageCountError();
	return {
		errorCode: usageCountError.errorCode,
		errorIdentifier: usageCountError.errorIdentifier ?? "",
		invalidSubscriptions: [],
		errorMessage: usageCountError.errorMessage ?? "",
	};
};

/**
 * Returns a resolver that turns the current feature-precondition state into an
 * error descriptor for the AI error modal, or `null` when there's nothing to show.
 *
 * Mirrors the decision the inline `FeatureError` component makes (invalid
 * subscription → SEO analysis inactive → usage-count fetch error), but yields a
 * plain descriptor the modal can render instead of JSX. Kept editor-only so the
 * shared `FeatureError`/`SuggestionError` contract used by Premium stays untouched.
 *
 * The resolver reads the store imperatively (via `select`) at call time rather
 * than from a render snapshot, because callers invoke it right after awaiting a
 * usage-count fetch — the fresh error state must be observed, not a stale one.
 *
 * @returns {function(Object): (Object|null)} Resolver taking
 *   `{ currentSubscriptions, isSeoAnalysisActive }` and returning a descriptor
 *   `{ errorCode, errorIdentifier, invalidSubscriptions, errorMessage }` or null.
 */
export const useFeatureErrorDescriptor = () => useCallback( ( { currentSubscriptions, isSeoAnalysisActive } ) => {
	const invalidSubscriptions = collectInvalidSubscriptions( currentSubscriptions );
	if ( invalidSubscriptions.length > 0 ) {
		return { errorCode: 402, errorIdentifier: "", invalidSubscriptions, errorMessage: "" };
	}

	if ( ! isSeoAnalysisActive ) {
		return { errorCode: 0, errorIdentifier: "SEO_ANALYSIS_INACTIVE", invalidSubscriptions: [], errorMessage: "" };
	}

	return usageCountErrorDescriptor();
}, [] );
