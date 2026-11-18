import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";
import PropTypes from "prop-types";

/**
 * @param {string} href The href.
 * @param {React.ReactNode} [children=null] The content.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const OutboundLink = ( { href, children = null, ...props } ) => (
	<Link target="_blank" rel="noopener noreferrer" { ...props } href={ href }>
		{ children }
		<span className="yst-sr-only">
			{
				/* translators: Hidden accessibility text. */
				__( "(Opens in a new browser tab)", "wordpress-seo" )
			}
		</span>
	</Link>
);
OutboundLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.node,
};
