import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { identity } from "lodash";
import { useField } from "formik";

/**
 * @param {Object} props The props object to pass down to ToggleField component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible ToggleField component.
 */
const FormikValueChangeField = ( {
	as: Component,
	transformValue = identity,
	...props
} ) => {
	const [ field, , helpers ] = useField( props );

	const handleChange = useCallback( ( value ) => {
		helpers.setTouched( true, false );
		helpers.setValue( transformValue( value ) );
	}, [ props.name ] );

	return (
		<Component
			{ ...field }
			{ ...props }
			onChange={ handleChange }
		/>
	);
};

FormikValueChangeField.propTypes = {
	as: PropTypes.elementType.isRequired,
	name: PropTypes.string.isRequired,
	transformValue: PropTypes.func,
};

export default FormikValueChangeField;
