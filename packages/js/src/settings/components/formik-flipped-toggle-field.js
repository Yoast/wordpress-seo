import { useCallback } from "@wordpress/element";
import { ToggleField } from "@yoast/ui-library";
import { useField } from "formik";
import { isUndefined } from "lodash";
import PropTypes from "prop-types";

/**
 * Flips a toggle field and wraps it in a Formik field.
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikFlippedToggleField = props => {
	const [ field, , { setTouched, setValue } ] = useField( { ...props, type: "checkbox" } );

	const handleChange = useCallback( value => {
		setTouched( true, false );
		setValue( ! value );
	}, [ props.name ] );

	return (
		<ToggleField
			{ ...field }
			{ ...props }
			checked={ isUndefined( props.checked ) ? ! field.checked : ! props.checked }
			onChange={ handleChange }
		/>
	);
};

FormikFlippedToggleField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikFlippedToggleField;
