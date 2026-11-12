import { useCallback } from "@wordpress/element";
import { identity } from "lodash";
import { useField } from "formik";

/**
 * Wraps a non-default change event field to be a Formik field.
 *
 * @param {Object} props The props to pass down to the component.
 * @param {import("react").ElementType} props.as The field component.
 * @param {string} props.name The field name.
 * @param {Function} [props.transformValue] Transforms the incoming change value before Formik receives it.
 *
 * @returns {JSX.Element} The Formik compatible element.
 */
export const FormikValueChangeField = ( { as: Component, transformValue = identity, ...props } ) => {
	const [ field, , { setTouched, setValue } ] = useField( props );

	const handleChange = useCallback( ( value ) => {
		setTouched( true, false );
		setValue( transformValue( value ) );
	}, [ props.name ] );

	return (
		<Component
			{ ...field }
			onChange={ handleChange }
			{ ...props }
		/>
	);
};
