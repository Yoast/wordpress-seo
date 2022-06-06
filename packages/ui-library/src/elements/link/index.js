import classNames from "classnames";
import PropTypes from "prop-types";

const classNameMap = {
	variant: {
		"default": "yst-link--primary",
		primary: "yst-link--primary",
	},
};

/**
 * @param {JSX.Element} Component The component to render as.
 * @param {string} className The HTML classes.
 * @param {JSX.node} children The content of the link.
 * @param {Object} props The props.
 * @returns {JSX.Element} The link.
 */
const Link = ( {
	as: Component,
	variant,
	className,
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

Link.defaultProps = {
	as: "a",
	variant: "default",
	className: "",
};

export default Link;
