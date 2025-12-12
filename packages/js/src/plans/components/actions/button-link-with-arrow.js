import classNames from "classnames";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";
import { useSvgAria } from "@yoast/ui-library";
import { OutboundButtonLink } from "./outbound-button-link";

/**
 * A link that looks like a button and indicates that the user can buy a product.
 * @param {string} variant The button variant.
 * @param {string} label The label for the link.
 * @param {string} href The URL to the product page.
 * @param {string} iconClassName Additional classes for the icon.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const ButtonLinkWithArrow = ( { href, label, variant, iconClassName = "", ...props } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<OutboundButtonLink { ...props } href={ href } variant={ variant }>
			{ label }
			<ArrowNarrowRightIcon className={ classNames( "yst-w-5 yst-h-5 yst-shrink-0 rtl:yst-rotate-180", iconClassName ) } { ...svgAriaProps } />
		</OutboundButtonLink>
	);
};
