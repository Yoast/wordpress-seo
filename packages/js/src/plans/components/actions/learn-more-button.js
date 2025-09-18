import { ExternalLinkIcon } from "@heroicons/react/outline";
import { __, sprintf } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import { OutboundButtonLink } from "./outbound-button-link";

/**
 * A link that looks like a button
 * @param {string} href The URL to the Yoast learn more page.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const LearnMoreButton = ( { href, ...props } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<OutboundButtonLink { ...props } href={ href } variant="primary">
			{
				__( "Learn more", "wordpress-seo" )
			}
			<ExternalLinkIcon className="yst-h-5 yst-w-5 yst-shrink-0 rtl:yst-rotate-[270deg]" { ...svgAriaProps } />
		</OutboundButtonLink>
	);
};
