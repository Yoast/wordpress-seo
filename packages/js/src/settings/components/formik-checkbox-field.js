import { Checkbox } from "@yoast/ui-library";
import { useField } from "formik";
import PropTypes from "prop-types";

/**
 * Checks the Formik checkbox.
 * @param {Object} props The props to pass down to the component.
 * @returns {JSX.Element} The Formik compatible element.
 */
const FormikCheckboxField = props => {
	const [ field, , ] = useField( { ...props, type: "checkbox" } );

	return (
		<Checkbox
			{ ...field }
			{ ...props }
			checked={ field.value }
			value={ field.value ? "1" : "0" }
		/>
	);
};

FormikCheckboxField.propTypes = {
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	className: PropTypes.string,
	disabled: PropTypes.bool,
};

FormikCheckboxField.defaultProps = {
	className: "",
	disabled: false,
};

export default FormikCheckboxField;
