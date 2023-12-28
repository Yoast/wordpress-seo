import { Checkbox } from "@yoast/ui-library";
import { useField } from "formik";

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

export default FormikCheckboxField;
