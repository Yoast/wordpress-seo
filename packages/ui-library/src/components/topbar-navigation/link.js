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
const Link = ( { as: Component, children, className, hrefProp, ...props } ) => {
	const { activePath } = useTopbarNavigationContext();

	return (
		<Component
			className={ classNames(
				"yst-inline-flex yst-items-center yst-border-b-2 yst-px-1 yst-pt-1 yst-text-sm yst-font-medium yst-no-underline focus:yst-outline-none focus:yst-ring-1 focus:yst-ring-primary-500",
				activePath === props?.[ hrefProp ]
					? "yst-border-primary-500 yst-text-slate-900"
					: "yst-border-transparent yst-text-slate-500 hover:yst-border-slate-300 hover:yst-text-slate-700",
				className,
			) }
			{ ...props }
		>
			{ children }
		</Component>
	);
};

Link.propTypes = {
	as: PropTypes.elementType,
	hrefProp: PropTypes.string,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};

Link.defaultProps = {
	as: LinkElement,
	hrefProp: "href",
	className: "",
};

export default Link;
