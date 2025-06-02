import { useSelect } from "@wordpress/data";
import { useMemo } from "@wordpress/element";
import { Modal } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { STORE_NAME_EDITOR } from "../constants";
import { isWooActiveAndProductPostType } from "../helpers";
import { useTypeContext } from "../hooks";
import { SeoAnalysisInactiveError, SubscriptionError } from "./errors";

/**
 * @param {Object} currentSubscriptions An object containing the information of product subscriptions validity status.
 * @param {boolean} currentSubscriptions.premiumSubscription The validity status of Yoast SEO Premium subscription.
 * @param {boolean} currentSubscriptions.wooCommerceSubscription The validity status of Yoast WooCommerce SEO subscription.
 * @param {boolean} [isSeoAnalysisActive=true] Whether SEO analysis feature is active.
 * @returns { JSX.Element } The element.
 */
export const FeatureError = ( { currentSubscriptions, isSeoAnalysisActive = true } ) => {
	const { postType } = useTypeContext();
	const isWooCommerceActive = useSelect( select => select( STORE_NAME_EDITOR ).getIsWooCommerceActive(), [] );
	const missingWooSeo = useMemo( () => {
		return ! currentSubscriptions.wooCommerceSubscription && isWooActiveAndProductPostType( isWooCommerceActive, postType );
	}, [ isWooCommerceActive, postType, currentSubscriptions.wooCommerceSubscription ] );

	const invalidSubscriptions = [];
	if ( ! currentSubscriptions.premiumSubscription ) {
		invalidSubscriptions.push( "Yoast SEO Premium" );
	}

	if ( missingWooSeo ) {
		invalidSubscriptions.push( "Yoast WooCommerce SEO" );
	}

	if ( invalidSubscriptions.length > 0 ) {
		return (
			<Modal.Container.Content className="yst-pt-6">
				<SubscriptionError invalidSubscriptions={ invalidSubscriptions } />
			</Modal.Container.Content>
		);
	}

	if ( ! isSeoAnalysisActive ) {
		return <SeoAnalysisInactiveError />;
	}
};

FeatureError.propTypes = {
	currentSubscriptions: PropTypes.object.isRequired,
	isSeoAnalysisActive: PropTypes.bool,
};
