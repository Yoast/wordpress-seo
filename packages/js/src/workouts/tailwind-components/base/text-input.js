import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import { PropTypes } from "prop-types";
import { useMemo } from "@wordpress/element";

import { getErrorAriaProps } from "../helpers";
import MultiLineText from "./multi-line-text";

/**
 * An icon for when feedback should be shown.
 *
 * @param {Object}  props            The props object.
 * @param {boolean} props.hasError   Whether there is an error icon.
 * @param {boolean} props.hasSuccess Whether there is a success icon.
 *
 * @returns {WPElement|null} Returns an icon or null.
 */
function FeedbackIcon( { hasError, hasSuccess } ) {
	if ( hasError ) {
		return <div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-right-0 yst-mr-3">
			<ExclamationCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-red-500" />
		</div>;
	} else if ( hasSuccess ) {
		return <div className="yst-flex yst-items-center yst-absolute yst-inset-y-0 yst-right-0 yst-mr-3">
			<CheckCircleIcon className="yst-pointer-events-none yst-h-5 yst-w-5 yst-text-emerald-600" />
		</div>;
	}
	return null;
}

FeedbackIcon.propTypes = {
	hasError: PropTypes.bool,
	hasSuccess: PropTypes.bool,
};

FeedbackIcon.defaultProps = {
	hasError: false,
	hasSuccess: false,
};

/**
 * The Text Input component.
 *
 * @param {string} [className=""] The classname for the wrapper div.
 * @param {string} id The id for the label and input field.
 * @param {string} [label=""] The text for the label.
 * @param {string} [description=""] The text for the description.
 * @param {string} value The value for the input field.
 * @param {string} [placeholder=""] The placeholder for the input field.
 * @param {Object} onChange The function which handles the onChange event.
 * @param {String} type The type of the input, defaults to text.
 * @param {ValidationError} [error] Validation error object.
 *
 * @returns {WPElement} The Text Input component.
 */
export default function TextInput( { className, id, label, description, value, onChange, placeholder, feedback, type, ...inputProps } ) {
	const inputType = type ? type : "text";

	const hasError = useMemo( () => feedback.isVisible && feedback.type === "error", [ feedback.isVisible, feedback.type ] );
	const hasSuccess = useMemo( () => feedback.isVisible && feedback.type === "success", [ feedback.isVisible, feedback.type ] );

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
						{
							"yst-border-red-300 yst-text-red-900 focus:yst-ring-red-500 focus:yst-border-red-500": hasError,
							"yst-border-emerald-600 yst-text-gray-700 focus:yst-ring-emerald-600 focus:yst-border-emerald-600": hasSuccess,
							"yst-text-gray-700 yst-border-gray-300 focus:yst-ring-1 focus:yst-ring-primary-500 focus:yst-border-primary-500": ! hasError && ! hasSuccess,
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

TextInput.defaultProps = {
	value: "",
	className: "",
	label: "",
	description: null,
	placeholder: "",
	feedback: {
		message: [],
		isVisible: false,
	},
	type: "text",
};
