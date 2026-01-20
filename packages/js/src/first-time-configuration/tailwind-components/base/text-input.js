/* eslint-disable complexity */
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { useMemo } from "@wordpress/element";
import classNames from "classnames";
import { PropTypes } from "prop-types";

import { getErrorAriaProps } from "../helpers";
import MultiLineText from "./multi-line-text";

/**
 * An icon for when feedback should be shown.
 *
 * @param {boolean} [hasError=false] Whether there is an error icon.
 * @param {boolean} [hasSuccess=false] Whether there is a success icon.
 *
 * @returns {JSX.Element} Returns an icon or null.
 */
function FeedbackIcon( { hasError = false, hasSuccess = false } ) {
	if ( hasError ) {
		return <div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-end-0 yst-me-3">
			<ExclamationCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-red-500" />
		</div>;
	} else if ( hasSuccess ) {
		return <div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-end-0 yst-me-3">
			<CheckCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-emerald-600" />
		</div>;
	}
	return null;
}

FeedbackIcon.propTypes = {
	hasError: PropTypes.bool,
	hasSuccess: PropTypes.bool,
};

/**
 * The Text Input component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The id for the label and input field.
 * @param {string} [label=""] The text for the label.
 * @param {React.ReactNode} [description=null] The text for the description.
 * @param {string} [value=""] The value for the input field.
 * @param {string} [placeholder=""] The placeholder for the input field.
 * @param {function} onChange The function which handles the onChange event.
 * @param {string} [type="text"] The type of the input, defaults to text.
 * @param {{type: string, message: [], isVisible: boolean}} [error] Validation error object.
 * @param {...Object} [inputProps] Additional props to pass to the input element.
 *
 * @returns {JSX.Element} The Text Input component.
 */
export default function TextInput( {
	className = "",
	id,
	label = "",
	description = null,
	value = "",
	onChange,
	placeholder = "",
	feedback = { message: [], isVisible: false },
	type = "text",
	...inputProps
} ) {
	const inputType = type ? type : "text";

	const hasError = useMemo( () => feedback.isVisible && feedback.type === "error", [ feedback.isVisible, feedback.type ] );
	const hasSuccess = useMemo( () => feedback.isVisible && feedback.type === "success", [ feedback.isVisible, feedback.type ] );

	return (
		<div className={ className }>
			{ label && <label className="yst-block yst-mb-2 yst-font-medium yst-text-slate-800" htmlFor={ id }>
				{ label }
			</label> }
			<div className="yst-relative">
				<input
					id={ id }
					type={ inputType }
					value={ value }
					className={ classNames(
						"yst-block yst-w-full yst-h-[40px] yst-input focus:yst-ring-1",
						{
							"yst-border-red-300 yst-text-red-900 focus:yst-ring-red-500 focus:yst-border-red-500": hasError,
							"yst-border-emerald-600 yst-text-slate-700 focus:yst-ring-emerald-600 focus:yst-border-emerald-600": hasSuccess,
							"yst-text-slate-700 yst-border-slate-300 focus:yst-ring-primary-500 focus:yst-border-primary-500": ! hasError && ! hasSuccess,
						}
					) }
					onChange={ onChange }
					placeholder={ placeholder }
					{ ...getErrorAriaProps( id, feedback ) }
					{ ...inputProps }
				/>
				<FeedbackIcon hasError={ hasError } hasSuccess={ hasSuccess } />
			</div>
			{ feedback.isVisible && <MultiLineText
				id={ `${ hasError ? "error-" : "success-" }${ id }` }
				className={ classNames(
					"yst-mt-2 yst-text-sm",
					{
						"yst-text-red-600": hasError,
						"yst-text-emerald-600": hasSuccess,
					}
				) }
				texts={ feedback.message }
			/> }
			{ description }
		</div>
	);
}

TextInput.propTypes = {
	className: PropTypes.string,
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	description: PropTypes.node,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	feedback: PropTypes.shape( {
		type: PropTypes.string,
		message: PropTypes.array,
		isVisible: PropTypes.bool,
	} ),
	type: PropTypes.string,
};
