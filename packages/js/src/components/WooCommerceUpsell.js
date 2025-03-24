import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Button, Root } from "@yoast/ui-library";

/**
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

WooCommerceUpsell.propTypes = {
	link: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
};

export default WooCommerceUpsell;
