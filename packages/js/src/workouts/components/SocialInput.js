import { useCallback } from "@wordpress/element";

import { TextInput } from "@yoast/components";
import PropTypes from "prop-types";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   socialMedium The social medium this fields refers to.
 * @param {bool}     isDisabled   A flag to disable the field.
 * @param {object}   restProps    The other props.
 * @returns {WPElement} A wrapped TextInput for the social inputs.
 */
export function SocialInput( { dispatch, socialMedium, isDisabled, ...restProps } ) {
	const onChangeHandler = useCallback(
		( newValue ) => dispatch( { type: "CHANGE_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } ),
		[ socialMedium ]
	);

	return <TextInput
		onChange={ onChangeHandler }
		readOnly={ isDisabled }
		{ ...restProps }
	/>;
}

SocialInput.propTypes = {
	dispatch: PropTypes.func.isRequired,
	socialMedium: PropTypes.string,
	isDisabled: PropTypes.bool,
};

SocialInput.defaultProps = {
	socialMedium: "",
	isDisabled: false,
};
