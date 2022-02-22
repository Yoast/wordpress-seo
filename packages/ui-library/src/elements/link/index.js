import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.Element} Component The component to render as.
 * @param {string} className The HTML classes.
 * @param {JSX.node} children The content of the link.
 * @param {Object} props The props.
 * @returns {JSX.Element} The link.
 */
const Link = ( {
	as: Component,
	className,
	children,
	...props
} ) => (
	<Component
		className={ classNames(
			"yst-link",
			className,
		) }
		{ ...props }
	>
		{ children }
	</Component>
);
Link.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	className: PropTypes.string,
};
Link.defaultProps = {
	as: "a",
	className: "",
};

export default Link;
