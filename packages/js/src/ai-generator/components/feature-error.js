import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR, STORE_NAME_AI, ASYNC_ACTION_STATUS } from "../constants";
import { isWooActiveAndProductPostType } from "../helpers";
import { useTypeContext } from "../hooks";
import { SeoAnalysisInactiveError, SubscriptionError } from "./errors";
import { UsageCountError } from "./usage-count-error";

/**
 * @param {Object} currentSubscriptions An object containing the information of product subscriptions validity status.
 * @param {boolean} currentSubscriptions.premiumSubscription The validity status of Yoast SEO Premium subscription.
 * @param {boolean} currentSubscriptions.wooCommerceSubscription The validity status of Yoast WooCommerce SEO subscription.
 * @param {boolean} [isSeoAnalysisActive=true] Whether SEO analysis feature is active.
 * @returns { JSX.Element } The element.
 */
export const FeatureError = ( { currentSubscriptions, isSeoAnalysisActive = true } ) => {
	const { postType } = useTypeContext();
	const { isPremium, isWooCommerceActive, usageCountStatus, usageCountError } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isPremium: editorSelect.getIsPremium(),
			isWooCommerceActive: editorSelect.getIsWooCommerceActive(),
			usageCountStatus: select( STORE_NAME_AI ).selectUsageCountStatus(),
			usageCountError: select( STORE_NAME_AI ).selectUsageCountError(),
		};
	}, [] );
	const missingWooSeo = useMemo( () => {
		return ! currentSubscriptions.wooCommerceSubscription && isWooActiveAndProductPostType( isWooCommerceActive, postType );
	}, [ isWooCommerceActive, postType, currentSubscriptions.wooCommerceSubscription ] );

	const invalidSubscriptions = useMemo( () => {
		if ( ! isPremium ) {
			return [];
		}
		const subscriptions = [];
		if ( ! currentSubscriptions.premiumSubscription ) {
			subscriptions.push( "Yoast SEO Premium" );
		}

		if ( missingWooSeo ) {
			subscriptions.push( "Yoast WooCommerce SEO" );
		}

		return subscriptions;
	}, [ isPremium, currentSubscriptions.premiumSubscription, missingWooSeo, currentSubscriptions.wooCommerceSubscription ] );

	if ( invalidSubscriptions.length > 0 ) {
		return <SubscriptionError invalidSubscriptions={ invalidSubscriptions } />;
	}

	if ( ! isSeoAnalysisActive ) {
		return <SeoAnalysisInactiveError />;
	}

	if ( usageCountStatus === ASYNC_ACTION_STATUS.error ) {
		return <UsageCountError { ...usageCountError } />;
	}
};

FeatureError.propTypes = {
	currentSubscriptions: PropTypes.object.isRequired,
	isSeoAnalysisActive: PropTypes.bool,
};
