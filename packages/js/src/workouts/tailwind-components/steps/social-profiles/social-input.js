import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";

import TextInput from "../../base/text-input";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {Object}   props              The props object.
 * @param {string}   props.id           The id to associate to the text field element.
 * @param {function} props.onChange     The function to update the container's state.
 * @param {string}   props.socialMedium The social medium this fields refers to.
 * @param {bool}     props.isDisabled   A flag to disable the field.
 * @param {object}   props.restProps    The other props.
 *
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
		disabled={ isDisabled }
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
