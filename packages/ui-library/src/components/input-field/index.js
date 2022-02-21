import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import Input from "../../elements/input";
import Label from "../../elements/label";

/**
 * @param {string} id The ID of the input.
 * @param {function} onChange The input change handler.
 * @param {JSX.node} [label] A label.
 * @param {string} [className] The HTML class.
 * @param {JSX.node} [description] A description.
 * @param {JSX.node} [error] An error "message".
 * @param {Object} [props] Any extra properties for the Input.
 * @returns {JSX.Element} The input field.
 */
const InputField = ( {
	id,
	onChange,
	label,
	className,
	description,
	error,
	...props
} ) => {
	return <div className={ classNames( "yst-input-field", className ) }>
		{ label && <Label className="yst-input-field__label" htmlFor={ id }>{ label }</Label> }
		<div className="yst-relative yst-inline-flex">
			<Input
				id={ id }
				className={ classNames( error ? "yst-input-error" : "" ) }
				onChange={ onChange }
				{ ...props }
			/>
			{ error && <div className="yst-input-field__error__icon">
				<ExclamationCircleIcon />
			</div> }
		</div>
		{ description && <p className="yst-input-field__description">{ description }</p> }
		{ error && <p className="yst-input-field__error__description">{ error }</p> }
	</div>;
};

InputField.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	label: PropTypes.node,
	className: PropTypes.string,
	description: PropTypes.node,
	error: PropTypes.node,
};

InputField.defaultProps = {
	label: null,
	className: "",
	description: null,
	error: null,
};

export default InputField;
