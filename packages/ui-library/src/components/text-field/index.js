import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import TextInput from "../../elements/text-input";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {JSX.node} [label] A label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {JSX.node} [error] An error "message".
 * @param {Object} [props] Any extra properties for the TextInput.
 * @returns {JSX.Element} The input field.
 */
const TextField = ( {
	id,
	onChange,
	label,
	className,
	description,
	error,
	...props
} ) => (
	<div className={ classNames( "yst-text-field", className ) }>
		{ label && <Label className="yst-text-field__label" htmlFor={ id }>{ label }</Label> }
		<div className="yst-relative yst-inline-flex">
			<TextInput
				id={ id }
				onChange={ onChange }
				className={ classNames(
					"yst-text-field__input",
					error && "yst-text-field__input--error",
				) }
				{ ...props }
			/>
			{ error && <div className="yst-text-field__error-icon">
				<ExclamationCircleIcon />
			</div> }
		</div>
		{ description && <p className="yst-text-field__description">{ description }</p> }
		{ error && <p className="yst-text-field__error">{ error }</p> }
	</div>
);

TextField.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.node,
	className: PropTypes.string,
	description: PropTypes.node,
	error: PropTypes.node,
};

TextField.defaultProps = {
	label: null,
	className: "",
	description: null,
	error: null,
};

export default TextField;
