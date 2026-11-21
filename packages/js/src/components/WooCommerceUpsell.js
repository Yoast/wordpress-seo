import { __, sprintf } from "@wordpress/i18n";
import LockOpenIcon from "@heroicons/react/outline/LockOpenIcon";
import { Button, Root } from "@yoast/ui-library";

/**
 * @param {Object} props Component props.
 * @param {string} props.link The URL of the upsell button.
 * @param {string} props.text The upsell text.
 *
 * @returns {React.Component} The react component for woocommerce upsell ads.
 */
const WooCommerceUpsell = ( { link, text } ) => {
	return (
		<Root>
			<p>{ text }</p>
			<Button
				href={ link }
				as="a"
				className="yst-gap-2 yst-mb-5 yst-mt-2"
				variant="upsell"
				target="_blank"
				rel="noopener"
			>
				<LockOpenIcon className="yst-w-4 yst-h-4 yst--ms-1 yst-shrink-0" />
				{ sprintf(
				/* translators: %1$s expands to Yoast WooCommerce SEO. */
					__( "Unlock with %1$s", "wordpress-seo" ),
					"Yoast WooCommerce SEO"
				) }
			</Button>
		</Root>
	);
};

export default WooCommerceUpsell;
