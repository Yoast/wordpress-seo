import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {JSX.node} children Content of the Label.
 * @param {string|function} [as="label"] Base component.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Label component.
 */
const Label = ( {
	children,
	as: Component,
	className,
	...props
} ) => (
	<Component
		className={ classNames( "yst-label", className ) }
		{ ...props }
	>
		{ children }
	</Component>
);

Label.propTypes = {
	children: PropTypes.node.isRequired,
	as: PropTypes.elementType,
	className: PropTypes.string,
};

Label.defaultProps = {
	as: "label",
	className: "",
};

export default Label;
