import classNames from "classnames";
import PropTypes from "prop-types";

const classNameMap = {
	variant: {
		"default": "yst-link--default",
		primary: "yst-link--primary",
		error: "yst-link--error",
	},
};

/**
 * @param {JSX.Element} [Component] The component to render as.
 * @param {string} [variant] The variant of the link.
 * @param {string} [className] The HTML classes.
 * @param {JSX.node} children The content of the link.
 * @param {Object} [props] The props.
 * @returns {JSX.Element} The link.
 */
const Link = ( {
	as: Component = "a",
	variant = "default",
	className = "",
	children,
	...props
} ) => (
	<Component
		className={ classNames(
			"yst-link",
			classNameMap.variant[ variant ],
			className,
		) }
		{ ...props }
	>
		{ children }
	</Component>
);

Link.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	as: PropTypes.elementType,
	className: PropTypes.string,
};

export default Link;
