import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { forwardRef } from "@wordpress/element";

/**
 * @param {string} href The href.
 * @param {JSX.node} [children] The content.
 * @param {Object} [props] Extra props.
 * @returns {JSX.Element} The element.
 */
export const OutboundLink = forwardRef( ( { href, children, ...props }, ref ) => (
	<Link target="_blank" rel="noopener noreferrer" { ...props } href={ href } ref={ ref }>
		{ children }
		<span className="yst-sr-only">
			{
				/* translators: Hidden accessibility text. */
				__( "(Opens in a new browser tab)", "wordpress-seo" )
			}
		</span>
	</Link>
) );
OutboundLink.propTypes = {
	href: PropTypes.string.isRequired,
	children: PropTypes.node,
};
OutboundLink.defaultProps = {
	children: null,
};
