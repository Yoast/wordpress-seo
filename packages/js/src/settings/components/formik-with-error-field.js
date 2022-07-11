import { Field } from "formik";
import PropTypes from "prop-types";

import { useFormikError } from "../hooks";

/**
 * @param {Object} props The props.
 * @param {string} name The field name.
 * @returns {JSX.Element} A Formik Field element with error message support.
 */
const FormikWithErrorField = ( { name, ...props } ) => {
	const { isTouched, error } = useFormikError( { name } );
	return <Field { ...props } name={ name } error={ isTouched && error } />;
};

FormikWithErrorField.propTypes = {
	name: PropTypes.string.isRequired,
};

export default FormikWithErrorField;
