import { __, sprintf } from "@wordpress/i18n";
import { LockOpenIcon } from "@heroicons/react/outline";
import { Button, Root } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 *
 * @returns {React.Component} The react component for highlighting button upsell ads.
 */
const HighlightingButtonUpsell = ( { link } ) => {
	const text = __( "Save time - highlight the analysis checks in your text, so you don't have to search for them!", "wordpress-seo" );
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
				<LockOpenIcon className="yst-w-4 yst-h-4 yst--ml-1 yst-shrink-0" />
				{ sprintf(
					/* translators: %1$s expands to Yoast SEO Premium. */
					__( "Unlock with %1$s", "wordpress-seo" ),
					"Yoast SEO Premium"
				) }
			</Button>
		</Root>
	);
};

HighlightingButtonUpsell.propTypes = {
	link: PropTypes.string.isRequired,
};

export default HighlightingButtonUpsell;
