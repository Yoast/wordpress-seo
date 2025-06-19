import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";

/**
 * An outbound link that looks like a button.
 * @param {string} href The URL.
 * @param {React.ReactNode} children The main content of the button.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const OutboundButtonLink = ( { href, children, ...props } ) => (
	<Button
		className="yst-gap-2 yst-w-full yst-px-2 yst-leading-5"
		{ ...props }
		as="a"
		href={ href }
		target="_blank"
		rel="noopener"
	>
		{ children }
		<span className="yst-sr-only">
			{
				/* translators: Hidden accessibility text. */
				__( "(Opens in a new browser tab)", "wordpress-seo" )
			}
		</span>
	</Button>
);
