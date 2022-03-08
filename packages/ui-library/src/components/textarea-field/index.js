import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import Textarea from "../../elements/textarea";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {JSX.node} [label] A label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {JSX.node} [error] An error "message".
 * @param {Object} [props] Any extra properties for the Textarea.
 * @returns {JSX.Element} The textarea field.
 */
const TextareaField = ( {
	id,
	label,
	className,
	description,
	error,
	...props
} ) => (
	<div className={ classNames( "yst-textarea-field", className ) }>
		{ label && <Label className="yst-textarea-field__label" htmlFor={ id }>{ label }</Label> }
		<div className="yst-relative">
			<Textarea
				id={ id }
				className={ classNames(
					"yst-textarea-field__input",
					error && "yst-textarea-field__input--error",
				) }
				{ ...props }
			/>
			{ error && <div className="yst-textarea-field__error-icon">
				<ExclamationCircleIcon />
			</div> }
		</div>
		{ error && <p className="yst-textarea-field__error">{ error }</p> }
		{ description && <p className="yst-textarea-field__description">{ description }</p> }
	</div>
);

TextareaField.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.node,
	className: PropTypes.string,
	description: PropTypes.node,
	error: PropTypes.node,
};

TextareaField.defaultProps = {
	label: null,
	className: "",
	description: null,
	error: null,
};

export default TextareaField;
