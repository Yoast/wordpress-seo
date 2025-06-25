import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { __ } from "@wordpress/i18n";
import { useSvgAria } from "@yoast/ui-library";
import { OutboundButtonLink } from "./outbound-button-link";

/**
 * A link that looks like a button and indicates that the user can buy a product.
 * @param {string} href The URL to the product page.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const BuyProduct = ( { href, ...props } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<OutboundButtonLink { ...props } href={ href } variant="upsell">
			{ __( "Buy product", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-5 yst-h-5 yst-shrink-0 rtl:yst-rotate-180" { ...svgAriaProps } />
		</OutboundButtonLink>
	);
};
