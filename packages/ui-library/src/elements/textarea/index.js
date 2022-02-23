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
	cols,
	rows,
	...props
} ) => (
	<textarea
		className={ classNames(
			"yst-textarea",
			disabled && "yst-textarea--disabled",
			className,
		) }
		disabled={ disabled }
		cols={ cols }
		rows={ rows }
		{ ...props }
	/>
);

Textarea.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	cols: PropTypes.number,
	rows: PropTypes.number
};

Textarea.defaultProps = {
	className: "",
	disabled: false,
	cols: 20,
	rows: 2
};

export default Textarea;
