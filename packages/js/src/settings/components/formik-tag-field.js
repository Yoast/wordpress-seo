import { useCallback, useMemo } from "@wordpress/element";
import { TagField } from "@yoast/ui-library";
import { useField } from "formik";
import { trim, reduce } from "lodash";
import PropTypes from "prop-types";

/**
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikTagField = props => {
	const [ { value, ...field }, , { setTouched, setValue } ] = useField( props );
	const tags = useMemo( () => reduce(
		value?.split( "," ) || [],
		( acc, item ) => {
			const trimmed = trim( item );
			return trimmed ? [ ...acc, trimmed ] : acc;
		},
		[]
	), [ value ] );

	const handleAddTag = useCallback( tag => {
		setTouched( true, false );
		setValue( [ ...tags, tag ].join( "," ) );
	}, [ setTouched, setValue, tags ] );
	const handleRemoveTag = useCallback( index => {
		setTouched( true, false );
		setValue( [ ...tags.slice( 0, index ), ...tags.slice( index + 1 ) ].join( "," ) );
	}, [ setTouched, setValue, tags ] );
	const handleSetTags = useCallback( tagValue => {
		setTouched( true, false );
		setValue( tagValue.join( "," )  );
	}, [ setTouched, setValue ] );
	return (
		<TagField
			{ ...field }
			tags={ tags }
			onAddTag={ handleAddTag }
			onRemoveTag={ handleRemoveTag }
			onSetTags={ handleSetTags }
			{ ...props }
		/>
	);
};

FormikTagField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikTagField;
