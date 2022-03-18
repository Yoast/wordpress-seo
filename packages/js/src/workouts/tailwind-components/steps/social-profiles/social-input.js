import PropTypes from "prop-types";
import { useCallback } from "@wordpress/element";

import TextInput from "../../base/text-input";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {function} dispatch     The function to update the container's state.
 * @param {string}   socialMedium The social medium this fields refers to.
 * @param {bool}     isDisabled   A flag to disable the field.
 * @param {object}   restProps    The other props.
 * @returns {WPElement} A wrapped TextInput for the social inputs.
 */
export default function SocialInput( { id, onChange, socialMedium, isDisabled, ...restProps } ) {
	const onChangeHandler = useCallback(
		( event ) => {
			if ( socialMedium === "other" ) {
				onChange( event.target.value, restProps.index );
			} else {
				onChange( event.target.value, socialMedium );
			}
		},
		[ socialMedium, restProps.index ]
	);

	return <TextInput
		onChange={ onChangeHandler }
		readOnly={ isDisabled }
		id={ id }
		{ ...restProps }
	/>;
}

SocialInput.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	socialMedium: PropTypes.string,
	isDisabled: PropTypes.bool,
};

SocialInput.defaultProps = {
	socialMedium: "",
	isDisabled: false,
};
