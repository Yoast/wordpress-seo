import { useCallback } from "@wordpress/element";

import { TextInput } from "@yoast/components";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {Object} dispatch The props for the SocialInput.
 *
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
