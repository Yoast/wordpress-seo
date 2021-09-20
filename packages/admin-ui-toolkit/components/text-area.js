import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { getErrorAriaProps, getErrorId } from "@yoast/toolkit/helpers";
import { validationErrorPropType } from "@yoast/toolkit/prop-types";
import classNames from "classnames";
import { PropTypes } from "prop-types";

import MultiLineText from "./multi-line-text";

/**
 * The TextArea Component.
 *
 * @param {Object} props Props object.
 * @param {string} props.id The id for the label and textarea.
 * @param {string} props.label The label.
 * @param {number} [props.rows=4] The number for the amount of rows. Default is 4.
 * @param {string} props.value The value for the textarea.
 * @param {function} props.onChange The onChange handler for the textarea.
 * @param {ValidationError} [props.error] Validation error object.
 *
 * @returns {JSX.Element} The TextArea Component
 */
export default function TextArea( { id, label, rows, value, onChange, error } ) {
	return (
		<>
			{ label && <label
				htmlFor={ id }
				className="yst-block yst-mb-2"
			>
				{ label }
			</label> }
			<div className="yst-relative yst-mb-8">
				<textarea
					id={ id }
					rows={ rows }
					className={ classNames(
						"yst-block yst-w-full yst-input",
						error.isVisible ? "yst-border-red-300 yst-text-red-900 focus:yst-ring-red-500 focus:yst-border-red-500" : "yst-text-gray-700 yst-border-gray-300 focus:yst-ring-indigo-500 focus:yst-border-indigo-500",
					) }
					value={ value }
					onChange={ onChange }
					{ ...getErrorAriaProps( id, error ) }
				/>
				{ error.isVisible && <>
					<div className="yst-absolute yst-inset-y-0 yst-right-0 yst-mt-3 yst-mr-3">
						<ExclamationCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-red-500" />
					</div>
					{ error.isVisible && <MultiLineText id={ getErrorId( id ) } className="yst-mt-2 yst-text-sm yst-text-red-600" texts={ error.messages } /> }
				</> }
			</div>
		</>
	);
}

TextArea.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	rows: PropTypes.number,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	error: validationErrorPropType.propType,
};

TextArea.defaultProps = {
	rows: 4,
	error: validationErrorPropType.defaultProp,
};
