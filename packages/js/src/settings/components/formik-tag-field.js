import { useCallback, useMemo } from "@wordpress/element";
import { TagField } from "@yoast/ui-library";
import { useField } from "formik";
import PropTypes from "prop-types";

/**
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikTagField = props => {
	const [ { value, onBlur }, , { setTouched, setValue } ] = useField( props );
	const tags = useMemo( () => ( value && value.split( "," ) ) || [], [ value ] );

	const handleAddTag = useCallback( tag => {
		setTouched( true, false );
		setValue( [ ...tags, tag ].join( "," ) );
	}, [ setTouched, setValue, tags ] );
	const handleRemoveTag = useCallback( index => {
		setTouched( true, false );
		setValue( [ ...tags.slice( 0, index ), ...tags.slice( index + 1 ) ].join( "," ) );
	}, [ setTouched, setValue, tags ] );

	return (
		<TagField
			onBlur={ onBlur }
			{ ...props }
			tags={ tags }
			onAddTag={ handleAddTag }
			onRemoveTag={ handleRemoveTag }
		/>
	);
};

FormikTagField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikTagField;
