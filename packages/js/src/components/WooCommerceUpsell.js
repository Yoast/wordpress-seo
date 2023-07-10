import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Button, Root } from "@yoast/ui-library";

/**
 *
 * @returns {React.Component} The Y.
 */
const WooCommerceUpsell = ( { link } ) => {
	return (
		<Root>
			<p>{ __( "Want an enhanced Google preview of how your WooCommerce products look in the search results?", "wordpress-seo" ) }</p>
			<Button
				href={ link }
				as="a"
				className="yst-gap-2 yst-mb-5 yst-mt-2"
				variant="upsell"
				target="_blank"
				rel="noopener"
			>
				<LockOpenIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-shrink-0" />
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
	link: PropTypes.string,
};

export default WooCommerceUpsell;
