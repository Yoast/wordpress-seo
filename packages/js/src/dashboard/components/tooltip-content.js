import { __ } from "@wordpress/i18n";
import { Button } from "@yoast/ui-library";
import { ArrowNarrowRightIcon  } from "@heroicons/react/solid";

/**
 * The content of the info tooltip.
 *
 * @param {string} url The learn more link.
 * @param {string} localizedString The content of the tooltip.
 *
 * @returns {JSX.Element} The element.
 */
export const TooltipContent = ( { url, localizedString } ) => (
	<>
		<p>
			{ localizedString }
		</p>
		{ url && <Button
			variant="tertiary"
			as="a"
			target="_blank"
			href={ url }
			className="yst-px-0"
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-me-1 rtl:yst-rotate-180 yst-ms-1.5" />
			<span className="yst-sr-only">
				{
					/* translators: Hidden accessibility text. */
					__( "(Opens in a new browser tab)", "wordpress-seo" )
				}
			</span>
		</Button> }
	</>
);
