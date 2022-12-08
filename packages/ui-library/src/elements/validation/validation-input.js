import { forwardRef } from "@wordpress/element";
import PropTypes from "prop-types";
import classNames from "classnames";
import ValidationIcon from "./validation-icon";
import { validationPropType } from ".";

const CLASSNAME_MAP = {
	variant: {
		success: "yst-validation-input--success",
		warning: "yst-validation-input--warning",
		info: "yst-validation-input--info",
		error: "yst-validation-input--error",
	},
};

/**
 * @param {string} variant The variant to render.
 * @returns {JSX.Element} The ValidationInput component.
 */
const ValidationInput = forwardRef( ( {
	as: Component,
	validation = {},
	className = "",
	...props
}, ref ) => {
	return (
		<div className={ classNames( "yst-validation-input", validation?.message && CLASSNAME_MAP.variant[ validation?.variant ] ) }>
			<Component
				ref={ ref }
				{ ...props }
				className={ classNames( "yst-validation-input__input", className ) }
			/>
			{ validation?.message && (
				<ValidationIcon variant={ validation?.variant } className="yst-validation-input__icon" />
			) }
		</div>
	);
} );

ValidationInput.propTypes = {
	as: PropTypes.elementType.isRequired,
	validation: validationPropType,
	className: PropTypes.string,
};

export default ValidationInput;
