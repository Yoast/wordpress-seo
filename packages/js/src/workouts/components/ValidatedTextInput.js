import { TextInput } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * A wrapper for the TextInput that can handle validation feedback.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The ValidationTextInput element.
 */
export default function ValidatedTextInput( { inputExplanation, feedbackState, feedbackMessage, ...textInputProps } ) {
	return (
		<div className="yoast-validated-text-input">
			<TextInput
				{ ...textInputProps }
			/>
			{ inputExplanation && <p className="yoast-validated-text-input--explanation">
				{ inputExplanation }
			</p>
			}
			{
				[ "error", "success" ].includes( feedbackState ) && <p className={ `yoast-validated-text-input--feedback ${ feedbackState }` }>
					{ feedbackMessage }
				</p>
			}
		</div>
	);
}

ValidatedTextInput.propTypes = {
	inputExplanation: PropTypes.any,
	feedbackState: PropTypes.string,
	feedbackMessage: PropTypes.string,
};

ValidatedTextInput.defaultProps = {
	inputExplanation: "",
	feedbackState: "",
	feedbackMessage: "",
};
