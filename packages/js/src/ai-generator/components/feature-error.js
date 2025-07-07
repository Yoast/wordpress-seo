/* eslint-disable complexity */
import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR, STORE_NAME_AI, ASYNC_ACTION_STATUS } from "../constants";
import { isWooActiveAndProductPostType } from "../helpers";
import { useTypeContext } from "../hooks";
import { SeoAnalysisInactiveError, SubscriptionError, RateLimitAlert, GenericAlert } from "./errors";

/**
 * @param {Object} currentSubscriptions An object containing the information of product subscriptions validity status.
 * @param {boolean} currentSubscriptions.premiumSubscription The validity status of Yoast SEO Premium subscription.
 * @param {boolean} currentSubscriptions.wooCommerceSubscription The validity status of Yoast WooCommerce SEO subscription.
 * @param {boolean} [isSeoAnalysisActive=true] Whether SEO analysis feature is active.
 * @returns { JSX.Element } The element.
 */
export const FeatureError = ( { currentSubscriptions, isSeoAnalysisActive = true } ) => {
	const { postType } = useTypeContext();
	const { isPremium, isWooCommerceActive, usageCountStatus, usageCountErrorCode } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isPremium: editorSelect.getIsPremium(),
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			usageCountStatus: select( STORE_NAME_AI ).selectUsageCountStatus(),
			usageCountErrorCode: select( STORE_NAME_AI ).selectUsageCountErrorCode(),
		};
	}, [] );
	const missingWooSeo = useMemo( () => {
		return ! currentSubscriptions.wooCommerceSubscription && isWooActiveAndProductPostType( isWooCommerceActive, postType );
	}, [ isWooCommerceActive, postType, currentSubscriptions.wooCommerceSubscription ] );

	const invalidSubscriptions = [];
	if ( isPremium ) {
		if ( ! currentSubscriptions.premiumSubscription ) {
			invalidSubscriptions.push( "Yoast SEO Premium" );
		}

		if ( missingWooSeo ) {
			invalidSubscriptions.push( "Yoast WooCommerce SEO" );
		}
	}

	if ( invalidSubscriptions.length > 0 ) {
		return <SubscriptionError invalidSubscriptions={ invalidSubscriptions } />;
	}

	if ( ! isSeoAnalysisActive ) {
		return <SeoAnalysisInactiveError />;
	}

	if ( usageCountStatus === ASYNC_ACTION_STATUS.error ) {
		if ( currentSubscriptions.premiumSubscription && usageCountErrorCode === 429 ) {
			return <RateLimitAlert />;
		}
		if ( usageCountErrorCode !== 429 ) {
			return <GenericAlert />;
		}
	}
};

FeatureError.propTypes = {
	currentSubscriptions: PropTypes.object.isRequired,
	isSeoAnalysisActive: PropTypes.bool,
};
