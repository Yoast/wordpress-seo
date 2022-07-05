import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { identity } from "lodash";
import { useField } from "formik";

/**
 * Wraps a non-default change event field to be a Formik field.
 * @param {JSX.ElementClass} as The field component.
 * @param {function} transformValue Transforms the incoming change value before Formik receives it.
 * @param {Object} props The props to pass down to ToggleField component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible ToggleField component.
 */
const FormikValueChangeField = ( { as: Component, transformValue, ...props } ) => {
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

FormikValueChangeField.defaultProps = {
	transformValue: identity,
};

export default FormikValueChangeField;
