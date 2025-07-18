import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Label from "../label";

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {string} [label=""] Label.
 * @param {boolean} [disabled=false] Whether the checkbox is disabled.
 * @param {string} [className=""] CSS class.
 * @returns {JSX.Element} Checkbox component.
 */
const Checkbox = forwardRef( ( {
	id,
	name,
	value,
	label = "",
	disabled = false,
	className = "",
	...props
}, ref ) => (
	<div
		className={ classNames(
			"yst-checkbox",
			disabled && "yst-checkbox--disabled",
			className,
		) }
	>
		<input
			ref={ ref }
			type="checkbox"
			id={ id }
			name={ name }
			value={ value }
			disabled={ disabled }
			className="yst-checkbox__input"
			{ ...props }
		/>
		{ label && <Label htmlFor={ id } className="yst-checkbox__label" label={ label } /> }
	</div>
) );

Checkbox.displayName = "Checkbox";
Checkbox.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string,
	className: PropTypes.string,
	disabled: PropTypes.bool,
};
Checkbox.defaultProps = {
	className: "",
	disabled: false,
	label: "",
};

export default Checkbox;
