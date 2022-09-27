import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} [type="text"] The type of input.
 * @param {string} [className=""] CSS class.
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {object} [props] Optional extra properties.
 * @returns {JSX.Element} TextInput component.
 */
const TextInput = ( {
	type,
	className,
	disabled,
	...props
} ) => (
	<input
		type={ type }
		className={ classNames(
			"yst-text-input",
			disabled && "yst-text-input--disabled",
			className,
		) }
		disabled={ disabled }
		{ ...props }
	/>
);

TextInput.propTypes = {
	type: PropTypes.string,
	className: PropTypes.string,
	disabled: PropTypes.bool,
};

TextInput.defaultProps = {
	type: "text",
	className: "",
	disabled: false,
};

export default TextInput;
