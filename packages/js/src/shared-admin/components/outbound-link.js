import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";

/**
 * @param {Object} props Component props. Additional props are passed to the Link.
 * @param {string} props.href The href.
 * @param {React.ReactNode} [props.children=null] The content.
 *
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
