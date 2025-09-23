import { useCallback } from "@wordpress/element";
import { ToggleField } from "@yoast/ui-library";
import { useField } from "formik";
import { isUndefined } from "lodash";
import PropTypes from "prop-types";

/**
 * Flips a toggle field and wraps it in a Formik field.
 * @param {Object} props The props to pass down to the component.
 * @param {string} props.name The field name.
 * @param {boolean} [props.checked=undefined] Whether the toggle is checked.
 * @returns {JSX.Element} The Formik compatible element.
 */
// eslint-disable-next-line no-undefined -- `undefined` is used to indicate that the `checked` prop is not set.
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

FormikFlippedToggleField.propTypes = {
	name: PropTypes.string.isRequired,
	checked: PropTypes.bool,
};

export default FormikFlippedToggleField;
