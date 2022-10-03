import PropTypes from "prop-types";
import { useFormikError } from "../hooks";

/**
 * A higher order component that adds an error prop to a specified component based on Formik error state and field name.
 * @param {JSX.Element} Component The component to wrap.
 * @returns {JSX.Element} The wrapped component.
 */
const withFormikError = Component => {
	/**
	 * @param {string} name The name.
	 * @param {Object} props The props.
	 * @returns {JSX.Element} The element.
	 */
	const ComponentWithFormikError = ( { name, ...props } ) => {
		const { isTouched, error } = useFormikError( { name } );
		return <Component { ...props } name={ name } error={ isTouched && error } />;
	};

	ComponentWithFormikError.propTypes = {
		name: PropTypes.string.isRequired,
	};

	return ComponentWithFormikError;
};

export default withFormikError;
