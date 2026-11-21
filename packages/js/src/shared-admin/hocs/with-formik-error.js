import { useFormikError } from "../hooks";

/**
 * A higher order component that adds an error prop to a specified component based on Formik error state and field name.
 * @param {JSX.Element} Component The component to wrap.
 * @returns {JSX.Element} The wrapped component.
 */
const withFormikError = Component => {
	/**
	 * @param {Object} props The props. Additional props are passed to the wrapped component.
	 * @param {string} props.name The name.
	 *
	 * @returns {JSX.Element} The element.
	 */
	const ComponentWithFormikError = ( { name, ...props } ) => {
		const { isTouched, error } = useFormikError( { name } );
		return <Component name={ name } validation={ { variant: "error", message: isTouched && error } } { ...props } />;
	};

	return ComponentWithFormikError;
};

export default withFormikError;
