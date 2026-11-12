import { useCallback } from "@wordpress/element";
import { ToggleField } from "@yoast/ui-library";
import { useField } from "formik";
import { isUndefined } from "lodash";

/**
 * Flips a toggle field and wraps it in a Formik field.
 *
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @param {boolean} [props.checked=undefined] Whether the toggle is checked.
 *
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikFlippedToggleField = ( { name, checked = undefined, ...props } ) => {
	const [ field, , { setTouched, setValue } ] = useField( { name, checked, ...props, type: "checkbox" } );

	const handleChange = useCallback( value => {
		setTouched( true, false );
		setValue( ! value );
	}, [ props.name ] );

	return (
		<ToggleField
			{ ...field }
			checked={ isUndefined( props.checked ) ? ! field.checked : ! props.checked }
			onChange={ handleChange }
			{ ...props }
		/>
	);
};

export default FormikFlippedToggleField;
