import PropTypes from "prop-types";
import { useCallback } from "@wordpress/element";

import ValidatedTextInput from "./validated-text-input";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   socialMedium The social medium this fields refers to.
 * @param {bool}     isDisabled   A flag to disable the field.
 * @param {object}   restProps    The other props.
 * @returns {WPElement} A wrapped TextInput for the social inputs.
 */
export default function SocialInput( { onChange, socialMedium, isDisabled, ...restProps } ) {
	const onChangeHandler = socialMedium === "other"
		? useCallback(
			( newValue ) => onChange( newValue, restProps.index ),
			[ restProps.index ]
		)
		: useCallback(
			( newValue ) => onChange( newValue, socialMedium ),
			[ socialMedium ]
		);

	return <ValidatedTextInput
		onChange={ onChangeHandler }
		readOnly={ isDisabled }
		{ ...restProps }
	/>;
}

SocialInput.propTypes = {
	onChange: PropTypes.func.isRequired,
	socialMedium: PropTypes.string,
	isDisabled: PropTypes.bool,
};

SocialInput.defaultProps = {
	socialMedium: "",
	isDisabled: false,
};
