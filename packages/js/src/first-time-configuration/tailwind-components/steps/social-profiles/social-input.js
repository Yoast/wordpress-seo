import { useCallback } from "@wordpress/element";
import TextInput from "../../base/text-input";

/**
 * A wrapped TextInput for the social inputs
 *
 * @param {Object} props Component props. Additional props are passed to the TextInput.
 * @param {string} props.id The id to associate to the text field element.
 * @param {Function} props.onChange The function to update the container's state.
 * @param {string} [props.socialMedium=""] The social medium this field refers to.
 * @param {boolean} [props.isDisabled=false] A flag to disable the field.
 *
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
