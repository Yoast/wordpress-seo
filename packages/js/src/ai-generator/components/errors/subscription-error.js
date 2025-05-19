import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { Fragment, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, useModalContext } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../helpers/i18n";
import { OutboundLink } from "../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../constants";

/**
 * @param {array} invalidSubscriptions The array with the names of products with invalid subscription.
 * @returns {JSX.Element} The element.
 */
export const SubscriptionError = ( { invalidSubscriptions } ) => {
	const activatePremiumLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-activate-premium" ),
		[]
	);
	const newPremiumLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-new-premium" ),
		[] );
	const activateYoastWooLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-activate-yoast-woocommerce" ),
		[]
	);
	const newYoastWooLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-new-yoast-woocommerce" ),
		[] );
	const activatePremiumWooBundleLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-activate-woocommerce-premium-bundle" ),
		[]
	);
	const newPremiumWooBundleLink = useSelect(
		select => select( STORE_NAME_EDITOR ).selectLink( "https://yoa.st/ai-generator-new-woocommerce-premium-bundle" ),
		[] );
	const { onClose } = useModalContext();

	const handleRefresh = useCallback( async() => {
		try {
			await apiFetch( {
				path: "yoast/v1/ai_generator/bust_subscription_cache",
				method: "POST",
				parse: false,
			} );
		} catch ( e ) {
			console.error( e );
		}
		window.location.reload();
	}, [] );

	let addonProduct;
	let activateSubscriptionLink;
	let newSubscriptionLink;
	if ( invalidSubscriptions.length === 1 ) {
		addonProduct = invalidSubscriptions[ 0 ];
		activateSubscriptionLink = addonProduct === "Yoast SEO Premium"
			? activatePremiumLink
			: activateYoastWooLink;
		newSubscriptionLink = addonProduct === "Yoast SEO Premium"
			? newPremiumLink
			: newYoastWooLink;
	}


	const errorMessageNoPremiumOrWoo = safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators:
			 * %1$s expands to Yoast SEO Premium or Yoast WooCommerce SEO.
			 * %2$s expands to MyYoast.
			 * %3$s and %4$s expand to an opening and closing anchor tag, respectively, to activate your subscription.
			 * %5$s and %6$s expand to an opening and closing anchor tag, respectively, to get a new subscription.
			 **/
			__(
				"To access this feature, you need an active %1$s subscription. Please %3$sactivate your subscription in %2$s%4$s or %5$sget a new %1$s subscription%6$s. Afterward, refresh this page. It may take up to 30 seconds for the feature to function correctly.",
				"wordpress-seo-premium"
			),
			addonProduct,
			"MyYoast",
			"<Activate>",
			"</Activate>",
			"<New>",
			"</New>"
		),
		{
			Activate: <OutboundLink variant="error" href={ activateSubscriptionLink } />,
			New: <OutboundLink variant="error" href={ newSubscriptionLink } />,
		}
	);

	const errorMessageNoPremiumAndWoo = safeCreateInterpolateElement(
		sprintf(
			/**
			 * translators:
			 * %1$s expands to MyYoast.
			 * %2$s expands to Yoast SEO Premium.
			 * %3$s expands to Yoast WooCommerce SEO.
			 * %4$s expands to Yoast WooCommerce SEO Premium bundle.
			 * %5$s and %6$s expand to an opening and closing anchor tag, respectively, to activate your subscription.
			 * %7$s and %8$s expand to an opening and closing anchor tag, respectively, to get a new subscription.
			 **/
			__(
				"To access this feature, you need active %2$s and %3$s subscriptions. Please %5$sactivate your subscriptions in %1$s%6$s or %7$sget a new %4$s%8$s. Afterward, refresh this page. It may take up to 30 seconds for the feature to function correctly.",
				"wordpress-seo-premium"
			),
			"MyYoast",
			"Yoast SEO Premium",
			"Yoast WooCommerce SEO",
			"Yoast WooCommerce SEO Premium bundle",
			"<Activate>",
			"</Activate>",
			"<New>",
			"</New>"
		),
		{
			Activate: <OutboundLink variant="error" href={ activatePremiumWooBundleLink } />,
			New: <OutboundLink variant="error" href={ newPremiumWooBundleLink } />,
		}
	);

	return (
		<Fragment>
			<Alert variant="error">
				<span className="yst-block yst-font-medium">{ __( "Subscription required", "wordpress-seo" ) }</span>
				<p className="yst-mt-2">
					{ invalidSubscriptions.length === 1 && errorMessageNoPremiumOrWoo }
					{ invalidSubscriptions.length > 1 && errorMessageNoPremiumAndWoo }
				</p>
			</Alert>
			<div className="yst-mt-6 yst-mb-1 yst-flex yst-space-x-3 rtl:yst-space-x-reverse yst-place-content-end">
				<Button variant="secondary" onClick={ onClose }>
					{ __( "Close", "wordpress-seo" ) }
				</Button>
				<Button variant="primary" onClick={ handleRefresh }>
					{ __( "Refresh page", "wordpress-seo" ) }
				</Button>
			</div>
		</Fragment>
	);
};

SubscriptionError.propTypes = {
	invalidSubscriptions: PropTypes.array,
};

SubscriptionError.defaultProps = {
	invalidSubscriptions: [],
};
