import { Badge } from "@yoast/ui-library";
import PropTypes from "prop-types";
import { useDisabledMessage } from "../hooks";

/**
 * Adds disabled message support around a component.
 * @param {JSX.ElementClass} Component The component.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withDisabledMessageSupport = ( Component ) => {
	/**
	 * @param {string} name The field name.
	 * @param {Object} props The props.
	 * @returns {JSX.Element} The element.
	 */
	const WithDisabledMessageSupport = ( { name, ...props } ) => {
		const { isDisabled, message } = useDisabledMessage( { name } );

		if ( isDisabled ) {
			return <Component
				name={ name }
				{ ...props }
				disabled={ true }
				labelSuffix={ <Badge variant="plain" size="small" className="yst-ml-1.5">{ message }</Badge> }
			/>;
		}
		return <Component name={ name } { ...props } />;
	};

	WithDisabledMessageSupport.propTypes = {
		name: PropTypes.string.isRequired,
	};

	return WithDisabledMessageSupport;
};

export default withDisabledMessageSupport;
