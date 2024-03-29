import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import ValidationIcon from "./validation-icon";

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
 * @param {Object} [validation] The validation state.
 * @param {string} [className] The classname.
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

ValidationInput.displayName = "ValidationInput";
ValidationInput.propTypes = {
	as: PropTypes.elementType.isRequired,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
	className: PropTypes.string,
};
ValidationInput.defaultProps = {
	validation: {},
	className: "",
};

export default ValidationInput;
