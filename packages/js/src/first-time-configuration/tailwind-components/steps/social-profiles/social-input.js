import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import TextInput from "../../base/text-input";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {string} id The id to associate to the text field element.
 * @param {function} onChange The function to update the container's state.
 * @param {string} [socialMedium=""] The social medium this field refers to.
 * @param {boolean} [isDisabled=false] A flag to disable the field.
 * @param {...Object} restProps The other props.
 * @returns {JSX.Element} A wrapped TextInput for the social inputs.
 */
export default function SocialInput( {
	id,
	onChange,
	socialMedium = "",
	isDisabled = false,
	...restProps
} ) {
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
