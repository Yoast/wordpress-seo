import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Label from "../../elements/label";
import TextInput from "../../elements/text-input";
import { ValidationInput, ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {string} label The label.
 * @param {JSX.node} [labelSuffix] Extra elements after the label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {boolean} [disabled] The disabled state.
 * @param {boolean} [readOnly] The read-only state.
 * @param {Object} [validation] The validation state.
 * @param {Object} [props] Any extra properties for the TextInput.
 * @returns {JSX.Element} The input field.
 */
const TextField = forwardRef( ( {
	id,
	onChange,
	label,
	labelSuffix,
	disabled,
	readOnly,
	className,
	description,
	validation,
	...props
}, ref ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div
			className={ classNames(
				"yst-text-field",
				disabled && "yst-text-field--disabled",
				readOnly && "yst-text-field--read-only",
				className,
			) }
		>
			<div className="yst-flex yst-items-center yst-mb-2">
				<Label className="yst-text-field__label" htmlFor={ id }>{ label }</Label>
				{ labelSuffix }
			</div>
			<ValidationInput
				as={ TextInput }
				ref={ ref }
				id={ id }
				onChange={ onChange }
				disabled={ disabled }
				readOnly={ readOnly }
				className="yst-text-field__input"
				aria-describedby={ describedBy }
				validation={ validation }
				{ ...props }
			/>
			{ validation?.message && (
				<ValidationMessage variant={ validation?.variant } id={ ids.validation } className="yst-text-field__validation">
					{ validation.message }
				</ValidationMessage>
			) }
			{ description && <p id={ ids.description } className="yst-text-field__description">{ description }</p> }
		</div>
	);
} );

TextField.displayName = "TextField";
TextField.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.string.isRequired,
	labelSuffix: PropTypes.node,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	className: PropTypes.string,
	description: PropTypes.node,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
};
TextField.defaultProps = {
	labelSuffix: null,
	disabled: false,
	readOnly: false,
	className: "",
	description: null,
	validation: {},
};

export default TextField;
