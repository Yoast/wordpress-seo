import { Field } from "formik";
import PropTypes from "prop-types";

import { useFormikError } from "../hooks";

/**
 * A higher order component that adds an error prop to a specified component based on Formik error state and field name.
 * @param {JSX.Element} Component The component to wrap.
 * @returns {JSX.Element} The wrapped component.
 */
// eslint-disable-next-line no-unused-vars
const withFormikError = ( Component ) => {
	const ComponentWithFormikError = ( { name, ...props } ) => {
		const { isTouched, error } = useFormikError( { name } );
		return <Component { ...props } name={ name } error={ isTouched && error } />;
	};
	return ComponentWithFormikError;
};

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
