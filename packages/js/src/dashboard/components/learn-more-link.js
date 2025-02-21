import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { Link } from "@yoast/ui-library";

/**
 * A link with the text "Learn more" and an arrow icon.
 *
 * @param {string} href The link.
 * @param {Object} [props] Extra props.
 *
 * @returns {JSX.Element} The learn more link.
 */
export const LearnMoreLink = ( { href, ...props } ) => (
	<Link
		href={ href }
		variant="primary"
		className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
		target="_blank"
		rel="noopener"
		{ ...props }
	>
		{ __( "Learn more", "wordpress-seo" ) }
		<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:yst-rotate-180" />
		<span className="yst-sr-only">
			{
				/* translators: Hidden accessibility text. */
				__( "(Opens in a new browser tab)", "wordpress-seo" )
			}
		</span>
	</Link>
);
