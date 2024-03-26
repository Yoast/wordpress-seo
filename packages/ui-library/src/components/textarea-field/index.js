import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Label from "../../elements/label";
import Textarea from "../../elements/textarea";
import { ValidationInput, ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {string} label The label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {Object} [validation] The validation state.
 * @param {boolean} disabled Whether the input is disabled.
 * @param {boolean} readOnly Whether the input is read-only.
 * @param {Object} [props] Any extra properties for the Textarea.
 * @returns {JSX.Element} The textarea field.
 */
const TextareaField = forwardRef( ( {
	id,
	label,
	className = "",
	description = "",
	validation = {},
	disabled,
	readOnly,
	...props
}, ref ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div
			className={ classNames(
				"yst-textarea-field",
				disabled && "yst-textarea-field--disabled",
				readOnly && "yst-textarea-field--read-only",
				className ) }
		>
			<div className="yst-flex yst-items-center yst-mb-2">
				<Label className="yst-textarea-field__label" htmlFor={ id }>{ label }</Label>
			</div>
			<ValidationInput
				as={ Textarea }
				ref={ ref }
				id={ id }
				className="yst-textarea-field__input"
				aria-describedby={ describedBy }
				validation={ validation }
				disabled={ disabled }
				readOnly={ readOnly }
				{ ...props }
			/>
			{ validation?.message && (
				<ValidationMessage variant={ validation?.variant } id={ ids.validation } className="yst-textarea-field__validation">
					{ validation.message }
				</ValidationMessage>
			) }
			{ description && <p id={ ids.description } className="yst-textarea-field__description">{ description }</p> }
		</div>
	);
} );

TextareaField.displayName = "TextareaField";
TextareaField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	description: PropTypes.node,
	disabled: PropTypes.bool,
	readOnly: PropTypes.bool,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
};
TextareaField.defaultProps = {
	className: "",
	description: null,
	disabled: false,
	readOnly: false,
	validation: {},
};

export default TextareaField;
