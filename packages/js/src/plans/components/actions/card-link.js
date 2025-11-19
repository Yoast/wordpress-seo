import { ExternalLinkIcon } from "@heroicons/react/outline";
import { useSvgAria } from "@yoast/ui-library";
import { OutboundButtonLink } from "./outbound-button-link";

/**
 * A link that looks like a button to manage a product in MyYoast.
 * @param {string} href The URL to the MyYoast page.
 * @param {string} [label] The label for the link.
 * @param {...Object} [props] Additional props to pass to the button.
 * @returns {JSX.Element} The element.
 */
export const CardLink = ( { href, label, ...props } ) => {
	const svgAriaProps = useSvgAria();

	return (
		<OutboundButtonLink { ...props } href={ href } variant="primary">
			{ label }
			<ExternalLinkIcon className="yst-h-5 yst-w-5 yst-shrink-0 rtl:yst-rotate-[270deg]" { ...svgAriaProps } />
		</OutboundButtonLink>
	);
};
