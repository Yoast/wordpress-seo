import classNames from "classnames";
import PropTypes from "prop-types";
import React, { forwardRef } from "react";
import Label from "../../elements/label";
import TagInput from "../../elements/tag-input";
import { ValidationInput, ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {string} label The label.
 * @param {JSX.node} [labelSuffix] Extra elements after the label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {boolean} [disabled] The disabled state.
 * @param {Object} [validation] The validation state.
 * @param {Object} [props] Any extra properties for the TagInput.
 * @returns {JSX.Element} The tag field.
 */
const TagField = forwardRef( ( {
	id,
	label,
	labelSuffix,
	disabled,
	className,
	description,
	validation,
	...props
}, ref ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div className={ classNames( "yst-tag-field", disabled && "yst-tag-field--disabled", className ) }>
			<div className="yst-flex yst-items-center yst-mb-2">
				<Label className="yst-tag-field__label" htmlFor={ id } label={ label } />
				{ labelSuffix }
			</div>
			<ValidationInput
				as={ TagInput }
				ref={ ref }
				id={ id }
				disabled={ disabled }
				className="yst-tag-field__input"
				aria-describedby={ describedBy }
				validation={ validation }
				{ ...props }
			/>
			{ validation?.message && (
				<ValidationMessage variant={ validation?.variant } id={ ids.validation } className="yst-tag-field__validation">
					{ validation.message }
				</ValidationMessage>
			) }
			{ description && <p id={ ids.description } className="yst-tag-field__description">{ description }</p> }
		</div>
	);
} );

TagField.displayName = "TagField";
TagField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	labelSuffix: PropTypes.node,
	disabled: PropTypes.bool,
	className: PropTypes.string,
	description: PropTypes.node,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
};
TagField.defaultProps = {
	labelSuffix: null,
	disabled: false,
	className: "",
	description: null,
	validation: {},
};

export default TagField;
