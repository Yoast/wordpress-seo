import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {string} [className=""] CSS class.
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {object} [props] Optional extra properties.
 * @returns {JSX.Element} Textarea component.
 */
const Textarea = ( {
	className,
	disabled,
	...props
} ) => (
	<textarea
		className={ classNames(
			"yst-textarea",
			disabled && "yst-textarea--disabled",
			className,
		) }
		disabled={ disabled }
		{ ...props }
	/>
);

Textarea.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
};

Textarea.defaultProps = {
	className: "",
	disabled: false,
};

export default Textarea;
