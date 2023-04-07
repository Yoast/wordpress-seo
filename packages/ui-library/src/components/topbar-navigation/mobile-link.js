import { useCallback } from "@wordpress/element";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link as LinkElement } from "../../";
import { useTopbarNavigationContext } from "./index";

/**
 * @param {JSX.Element} [Component] The component to render as.
 * @param {JSX.node} children The link content.
 * @param {string} [className] Any extra CSS class.
 * @param {string} [hrefProp] The name of the prop that contains the URL. Props is expected to store the href there.
 * @param {Object} [props] Any extra props.
 * @returns {JSX.Element} The topbar center element.
 */
const MobileLink = ( { as: Component, children, className, hrefProp, ...props } ) => {
	const { activePath, setMobileMenuOpen } = useTopbarNavigationContext();
	const handleClick = useCallback( () => setMobileMenuOpen( false ), [ setMobileMenuOpen ] );

	return (
		<Component
			className={ classNames(
				"yst-block yst-border-l-4 yst-py-2 yst-pl-3 yst-pr-4 yst-text-base yst-font-medium yst-no-underline focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500",
				activePath === props?.[ hrefProp ]
					? "yst-border-primary-500 yst-text-primary-700 yst-bg-primary-50"
					: "yst-border-transparent yst-text-slate-500 hover:yst-bg-slate-50 hover:yst-border-slate-300 hover:yst-text-slate-700",
				className,
			) }
			{ ...props }
			// Circumvent using Disclosure.Button by closing the mobile menu on click.
			onClick={ handleClick }
		>
			{ children }
		</Component>
	);
};

MobileLink.propTypes = {
	as: PropTypes.elementType,
	children: PropTypes.node.isRequired,
	hrefProp: PropTypes.string,
	className: PropTypes.string,
};

MobileLink.defaultProps = {
	as: LinkElement,
	hrefProp: "href",
	className: "",
};

export default MobileLink;
