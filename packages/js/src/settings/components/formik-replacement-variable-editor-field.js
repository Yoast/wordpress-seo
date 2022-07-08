import { useCallback, useState } from "@wordpress/element";
import { ReplacementVariableEditor } from "@yoast/replacement-variable-editor";
import { useField } from "formik";
import PropTypes from "prop-types";

/**
 * @param {Object} props The props to pass down to ToggleField component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikReplacementVariableEditorField = ( { ...props } ) => {
	const [ editorRef, setEditorRef ] = useState( null );
	const [ field, , { setTouched, setValue } ] = useField( props );

	const handleChange = useCallback( value => {
		setTouched( true, false );
		setValue( value );
	}, [ props.name ] );

	return (
		<ReplacementVariableEditor
			{ ...field }
			{ ...props }
			content={ field.value }
			onChange={ handleChange }
			editorRef={ setEditorRef }
		/>
	);
};

FormikReplacementVariableEditorField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikReplacementVariableEditorField;
