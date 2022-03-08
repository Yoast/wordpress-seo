import classNames from "classnames";
import PropTypes from "prop-types";

/**
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {string} [rows] Textarea rows (height).
 * @param {string} [className=""] CSS class.
 * @returns {JSX.Element} Textarea component.
 */
const Textarea = ( {
	disabled,
	rows,
	className,
	...props
} ) => (
	<textarea
		disabled={ disabled }
		rows={ rows }
		className={ classNames(
			"yst-textarea",
			disabled && "yst-textarea--disabled",
			className,
		) }
		{ ...props }
	/>
);

Textarea.propTypes = {
	className: PropTypes.string,
	disabled: PropTypes.bool,
	cols: PropTypes.number,
	rows: PropTypes.number,
};

Textarea.defaultProps = {
	className: "",
	disabled: false,
	cols: 20,
	rows: 2,
};

export default Textarea;
