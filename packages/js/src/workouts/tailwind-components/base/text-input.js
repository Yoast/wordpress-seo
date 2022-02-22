import { ExclamationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { PropTypes } from "prop-types";

import { getErrorAriaProps, getErrorId } from "../helpers";
import MultiLineText from "./multi-line-text";

/**
 * The Text Input component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The id for the label and input field.
 * @param {string} [label=""] The text for the label.
 * @param {string} value The value for the input field.
 * @param {string} [placeholder=""] The placeholder for the input field.
 * @param {Object} onChange The function which handles the onChange event.
 * @param {String} type The type of the input, defaults to text.
 * @param {ValidationError} [error] Validation error object.
 *
 * @returns {JSX.Element} The Text Input component.
 */
export default function TextInput( { className, id, label, value, onChange, placeholder, error, type, ...inputProps } ) {
	const inputType = type ? type : "text";
	return (
		<div className={ className }>
			{ label && <label className="yst-block yst-mb-2 yst-font-medium" htmlFor={ id }>
				{ label }
			</label> }
			<div className="yst-relative">
				<input
					id={ id }
					type={ inputType }
					value={ value }
					className={ classNames(
						"yst-block yst-w-full yst-h-[45px] yst-input",
						error.isVisible ? "yst-border-red-300 yst-text-red-900 focus:yst-ring-red-500 focus:yst-border-red-500" : "yst-text-gray-700 yst-border-gray-300 focus:yst-ring-1 focus:yst-ring-primary-500 focus:yst-border-primary-500"
					) }
					onChange={ onChange }
					placeholder={ placeholder }
					{ ...getErrorAriaProps( id, error ) }
					{ ...inputProps }
				/>
				{ error.isVisible && <div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-right-0 yst-mr-3">
					<ExclamationCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-red-500" />
				</div> }
			</div>
			{ error.isVisible && <MultiLineText id={ getErrorId( id ) } className="yst-mt-2 yst-text-sm yst-text-red-600" texts={ error.messages } /> }
		</div>
	);
}

TextInput.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.shape( {
		message: PropTypes.string,
		isVisible: PropTypes.bool,
	} ),
	type: PropTypes.string,
};

TextInput.defaultProps = {
	value: "",
	className: "",
	label: "",
	placeholder: "",
	error: {
		message: "",
		isVisible: false,
	},
	type: "text",
};
