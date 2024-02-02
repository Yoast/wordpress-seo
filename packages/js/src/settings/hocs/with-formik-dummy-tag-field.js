import { noop } from "lodash";
import PropTypes from "prop-types";
import { useSelectSettings } from "../hooks";

/**
 * @param {JSX.ElementClass} Component The component to wrap.
 * @returns {JSX.ElementClass} The wrapped component.
 */
const withFormikDummyTagField = Component => {
	/**
	 * @param {string} name The name.
	 * @param {boolean} isDummy Whether this is a dummy field.
	 * @param {Object} [props] Any extra props.
	 * @returns {JSX.Element} The element.
	 */
	const ComponentWithFormikDummyTagField = ( { name, isDummy = false, ...props } ) => {
		const defaultValue = useSelectSettings( "selectDefaultSettingValue", [ name ], name );

		if ( isDummy ) {
			return <Component
				name={ name }
				{ ...props }
				// Override value and change handler with dummy values.
				disabled={ true }
				value={ defaultValue }
				onChange={ noop }
				tags={ [] }
				onAddTag={ noop }
				onRemoveTag={ noop }
			/>;
		}

		return <Component name={ name } { ...props } />;
	};

	ComponentWithFormikDummyTagField.propTypes = {
		name: PropTypes.string.isRequired,
		isDummy: PropTypes.bool,
	};

	return ComponentWithFormikDummyTagField;
};

export default withFormikDummyTagField;
