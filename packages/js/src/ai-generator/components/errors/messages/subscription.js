import { useSelect } from "@wordpress/data";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { safeCreateInterpolateElement } from "../../../../helpers/i18n";
import { OutboundLink } from "../../../../shared-admin/components";
import { STORE_NAME_EDITOR } from "../../../constants";
import { Paragraph } from "./parts";

export const title = __( "Subscription required", "wordpress-seo" );

/**
 * The copy for the subscription-required error (402, and 429 / USAGE_LIMIT_REACHED).
 *
 * The "Refresh page" action that accompanies this error lives in the alert and
 * modal chrome, not here.
 *
 * @param {string[]} [invalidSubscriptions=[]] The products with an invalid subscription.
 * @returns {JSX.Element} The element.
 */
export const Body = ( { invalidSubscriptions = [] } ) => {
	const { newYoastWooLink, activateYoastWooLink, newPremiumLink, activatePremiumLink } = useSelect( ( select ) => {
		const editorSelect = select( STORE_NAME_EDITOR );
		return {
			newYoastWooLink: editorSelect.selectLink( "https://yoa.st/ai-generator-new-yoast-woocommerce" ),
			activateYoastWooLink: editorSelect.selectLink( "https://yoa.st/ai-generator-activate-yoast-woocommerce" ),
			newPremiumLink: editorSelect.selectLink( "https://yoa.st/ai-generator-new-premium" ),
			activatePremiumLink: editorSelect.selectLink( "https://yoa.st/ai-generator-activate-premium" ),
		};
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
		<Paragraph>
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
		</Paragraph>
	);
};
Body.propTypes = { invalidSubscriptions: PropTypes.arrayOf( PropTypes.string ) };
