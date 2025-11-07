import { ExternalLinkIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import { OutboundButtonLink } from "./outbound-button-link";

/**
 * A link that looks like a button and indicates that the user can buy a product.
 * @param {string} href The URL to the product page.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const InstallPlugin = ( { href, ...props } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<OutboundButtonLink { ...props } href={ href } variant="primary">
			{ __( "Install plugin", "wordpress-seo" ) }
			<ExternalLinkIcon className="yst-h-5 yst-w-5 yst-shrink-0 rtl:yst-rotate-[270deg]" { ...svgAriaProps } />
		</OutboundButtonLink>
	);
};
