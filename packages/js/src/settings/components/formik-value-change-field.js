import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { identity } from "lodash";
import { useField } from "formik";

/**
 * Wraps a non-default change event field to be a Formik field.
 * @param {JSX.ElementClass} as The field component.
 * @param {function} [transformValue] Transforms the incoming change value before Formik receives it.
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikValueChangeField = ( { as: Component, transformValue = identity, ...props } ) => {
	const [ field, , { setTouched, setValue } ] = useField( props );

	const handleChange = useCallback( ( value ) => {
		setTouched( true, false );
		setValue( transformValue( value ) );
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
