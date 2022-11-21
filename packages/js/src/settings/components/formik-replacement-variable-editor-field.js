import { useCallback, useState, useMemo } from "@wordpress/element";
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

	const handleChange = useCallback( newValue => {
		setTouched( true, false );
		setValue( newValue );
	}, [ props.name ] );

	const handleFocus = useCallback( () => editorRef?.focus(), [ editorRef ] );

	/**
	 * Preemptively add a space at the end.
	 * Adding a space is a thing that the replacement variable editor does to auto-separate after a variable.
	 * If we don't do that in our original data, it will trigger an update and then a save prompt.
	 * Adding a space here will prevent this scenario, there is no need to actually save the space.
	 * Being precise here is important, because otherwise a space is added when the user types `%%` and the editor
	 * resets its focus because unexpected content was received. E.g. only add a space when it is `%%sitename%%`,
	 * not when it is only `%%` or `%%sitename`.
	 */
	const value = useMemo( () => ( field.value?.match( /%%\w+%%$/ ) ? `${ field.value } ` : field.value ) || "", [ field.value ] );

	return (
		<div className={ className }>
			<ReplacementVariableEditor
				{ ...field }
				content={ value }
				onChange={ handleChange }
				editorRef={ setEditorRef }
				onFocus={ handleFocus }
				{ ...props }
			/>
		</div>
	);
};

FormikReplacementVariableEditorField.propTypes = {
	name: PropTypes.string.isRequired,
	className: PropTypes.string,
};

export default FormikReplacementVariableEditorField;
