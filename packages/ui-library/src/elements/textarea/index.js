import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";

/**
 * @param {boolean} [disabled=false] Whether the input is disabled.
 * @param {string} [cols] Textarea columns (width).
 * @param {string} [rows] Textarea rows (height).
 * @param {string} [className=""] CSS class.
 * @returns {JSX.Element} Textarea component.
 */
const Textarea = forwardRef( ( {
	disabled,
	cols,
	rows,
	className,
	...props
}, ref ) => (
	<textarea
		ref={ ref }
		disabled={ disabled }
		cols={ cols }
		rows={ rows }
		className={ classNames(
			"yst-textarea",
			disabled && "yst-textarea--disabled",
			className,
		) }
		{ ...props }
	/>
) );

Textarea.displayName = "Textarea";
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
