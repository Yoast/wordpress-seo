import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} label Content of the Label. Note that this is a string ONLY for a11y reasons.
 * @param {string|function} [as="label"] Base component.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Label component.
 */
const Label = ( {
	as: Component,
	className,
	label,
	...props
} ) => (
	<Component
		className={ classNames( "yst-label", className ) }
		{ ...props }
	>
		{ label }
	</Component>
);

Label.propTypes = {
	label: PropTypes.string.isRequired,
	as: PropTypes.elementType,
	className: PropTypes.string,
};

Label.defaultProps = {
	as: "label",
	className: "",
};

export default Label;
