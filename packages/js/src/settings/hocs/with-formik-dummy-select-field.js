import { noop } from "lodash";
import { useSelectSettings } from "../hooks";

/**
 * @param {JSX.ElementClass} Component The component to wrap.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withFormikDummySelectField = Component => {
	/**
	 * @param {Object} props Any extra props.
	 * @param {string} props.name The name.
	 * @param {boolean} [props.isDummy=false] Whether this is a dummy field.
	 *
	 * @returns {JSX.Element} The element.
	 */
	const ComponentWithFormikDummySelectField = ( { name, isDummy = false, ...props } ) => {
		const defaultValue = useSelectSettings( "selectDefaultSettingValue", [ name ], name );

		if ( isDummy ) {
			return <Component
				name={ name }
				{ ...props }
				// Override value and change handler with dummy values.
				disabled={ true }
				value={ defaultValue }
				onChange={ noop }
			/>;
		}

		return <Component name={ name } { ...props } />;
	};

	return ComponentWithFormikDummySelectField;
};

export default withFormikDummySelectField;
