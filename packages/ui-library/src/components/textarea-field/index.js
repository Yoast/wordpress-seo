import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import Textarea from "../../elements/textarea";
import { ValidationInput, ValidationMessage } from "../../elements/validation";
import { useDescribedBy } from "../../hooks";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {string} label The label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {Object} [error] The validation state.
 * @param {Object} [props] Any extra properties for the Textarea.
 * @returns {JSX.Element} The textarea field.
 */
const TextareaField = ( {
	id,
	label,
	className = "",
	description = "",
	validation = {},
	...props
} ) => {
	const { ids, describedBy } = useDescribedBy( id, { validation: validation?.message, description } );

	return (
		<div className={ classNames( "yst-textarea-field", className ) }>
			<div className="yst-flex yst-items-center yst-mb-2">
				<Label className="yst-textarea-field__label" htmlFor={ id }>{ label }</Label>
			</div>
			<ValidationInput
				as={ Textarea }
				id={ id }
				className="yst-textarea-field__input"
				aria-describedby={ describedBy }
				validation={ validation }
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
};

TextareaField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	description: PropTypes.node,
	validation: PropTypes.shape( {
		variant: PropTypes.string,
		message: PropTypes.node,
	} ),
};

export default TextareaField;
