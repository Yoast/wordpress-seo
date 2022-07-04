import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import {  useField } from "formik";
import { ToggleField } from "@yoast/ui-library";

/**
 * @param {Object} props The props object to pass down to ToggleField component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible ToggleField component.
 */
const FormikToggleField = ( props ) => {
	const [ field, , helpers ] = useField( props );

	const handleChange = useCallback( ( value ) => {
		helpers.setTouched( true, false );
		helpers.setValue( value );
	}, [ field.checked, props.name ] );

	return (
		<ToggleField
			{ ...field }
			{ ...props }
			onChange={ handleChange }
		/>
	);
};

FormikToggleField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikToggleField;
