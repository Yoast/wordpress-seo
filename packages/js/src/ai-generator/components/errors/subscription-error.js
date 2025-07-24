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
 * @param {string[]} [invalidSubscriptions=[]] The array with the names of products with invalid subscription.
 * @returns {JSX.Element} The element.
 */
export const SubscriptionError = ( { invalidSubscriptions = [] } ) => {
	const { newYoastWooLink, activateYoastWooLink, newPremiumLink, activatePremiumLink } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			newYoastWooLink: editorSelect.selectLink( "https://yoa.st/ai-generator-new-yoast-woocommerce" ),
			activateYoastWooLink: editorSelect.selectLink( "https://yoa.st/ai-generator-activate-yoast-woocommerce" ),
			newPremiumLink: editorSelect.selectLink( "https://yoa.st/ai-generator-new-premium" ),
			activatePremiumLink: editorSelect.selectLink( "https://yoa.st/ai-generator-activate-premium" ),
		};
	}, [] );

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
	if ( invalidSubscriptions.includes( "Yoast WooCommerce SEO" ) ) {
		addonProduct = "Yoast WooCommerce SEO";
		activateSubscriptionLink = activateYoastWooLink;
		newSubscriptionLink = newYoastWooLink;
	} else if ( invalidSubscriptions.includes( "Yoast SEO Premium" ) ) {
		addonProduct = "Yoast SEO Premium";
		activateSubscriptionLink = activatePremiumLink;
		newSubscriptionLink = newPremiumLink;
	}

	return (
		<Fragment>
			<Alert variant="error">
				<span className="yst-block yst-font-medium">{ __( "Subscription required", "wordpress-seo" ) }</span>
				<p className="yst-mt-2">
					{ safeCreateInterpolateElement(
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
								"wordpress-seo"
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
					) }
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
	invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ),
};
