import { useCallback, useState } from "@wordpress/element";
import { ReplacementVariableEditor } from "@yoast/replacement-variable-editor";
import { useField } from "formik";
import PropTypes from "prop-types";

/**
 * @param {string} className The wrapper class.
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikReplacementVariableEditorField = ( { className = "", ...props } ) => {
	const [ editorRef, setEditorRef ] = useState( null );
	const [ field, , { setTouched, setValue } ] = useField( props );

	const handleChange = useCallback( value => {
		setTouched( true, false );
		setValue( value );
	}, [ props.name ] );

	const handleFocus = useCallback( () => editorRef?.focus(), [ editorRef ] );

	return (
		<div className={ className }>
			<ReplacementVariableEditor
				{ ...field }
				{ ...props }
				content={ field.value }
				onChange={ handleChange }
				editorRef={ setEditorRef }
				onFocus={ handleFocus }
			/>
		</div>
	);
};

FormikReplacementVariableEditorField.propTypes = {
	name: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default FormikReplacementVariableEditorField;
