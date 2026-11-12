import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { STORE_NAME_EDITOR, STORE_NAME_AI, ASYNC_ACTION_STATUS } from "../constants";
import { SeoAnalysisInactiveError, SubscriptionError } from "./errors";
import { UsageCountError } from "./usage-count-error";

/**
 * @param {Object} props Component props.
 * @param {Object} props.currentSubscriptions An object containing the information of product subscriptions validity status.
 * @param {boolean} props.currentSubscriptions.premiumSubscription The validity status of Yoast SEO Premium subscription.
 * @param {boolean} props.currentSubscriptions.wooCommerceSubscription The validity status of Yoast WooCommerce SEO subscription.
 * @param {boolean} [props.isSeoAnalysisActive=true] Whether SEO analysis feature is active.
 *
 * @returns { JSX.Element } The element.
 */
export const FeatureError = ( { currentSubscriptions, isSeoAnalysisActive = true } ) => {
	const { isPremium, usageCountStatus, usageCountError, isWooProductEntity, isWooSeoActive } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			isPremium: editorSelect.getIsPremium(),
			usageCountStatus: select( STORE_NAME_AI ).selectUsageCountStatus(),
			usageCountError: select( STORE_NAME_AI ).selectUsageCountError(),
			isWooProductEntity: editorSelect.getIsWooProductEntity(),
			isWooSeoActive: editorSelect.getIsWooSeoActive(),
		};
	}, [] );
	const missingWooSeo = useMemo( () => {
		return ! currentSubscriptions.wooCommerceSubscription && isWooProductEntity;
	}, [ currentSubscriptions.wooCommerceSubscription ] );

	const invalidSubscriptions = useMemo( () => {
		const subscriptions = [];

		if ( ( isPremium || isWooProductEntity ) && ! currentSubscriptions.premiumSubscription ) {
			subscriptions.push( "Yoast SEO Premium" );
		}

		if ( missingWooSeo && isWooSeoActive ) {
			subscriptions.push( "Yoast WooCommerce SEO" );
		}

		return subscriptions;
	}, [ isPremium, currentSubscriptions.premiumSubscription, missingWooSeo, isWooSeoActive, isWooProductEntity ] );

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
