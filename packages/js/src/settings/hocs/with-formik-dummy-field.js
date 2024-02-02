import { noop } from "lodash";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

/**
 * @param {JSX.ElementClass} Component The component to wrap.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withFormikDummyField = Component => {
	/**
	 * @param {string} name The name.
	 * @param {boolean} isDummy Whether this is a dummy field.
	 * @param {Object} [props] Any extra props.
	 * @returns {JSX.Element} The element.
	 */
	const ComponentWithFormikDummyField = ( { name, isDummy = false, ...props } ) => {
		const defaultValue = useSelectSettings( "selectDefaultSettingValue", [ name ], name );

		if ( isDummy ) {
			return <Component
				name={ name }
				{ ...props }
				// Override value and change handler with dummy values.
				disabled={ true }
				value={ defaultValue }
				onChange={ noop }
				// Specific override for checkbox type components.
				checked={ defaultValue }
				// Specific override for ReplacementVariableEditor components.
				content={ defaultValue }
			/>;
		}

		return <Component name={ name } { ...props } />;
	};

	ComponentWithFormikDummyField.propTypes = {
		name: PropTypes.string.isRequired,
		isDummy: PropTypes.bool,
	};

	return ComponentWithFormikDummyField;
};

export default withFormikDummyField;
