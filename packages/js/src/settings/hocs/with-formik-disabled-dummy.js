/* eslint-disable require-jsdoc */
import { useMemo } from "@wordpress/element";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { get, noop } from "lodash";

const withFormikDisabledDummy = Component => {
	const ComponentWithFormikDummy = ( { name, isDummy = false, ...props } ) => {
		const { initialValues } = useFormikContext();
		const value = useMemo( () => get( initialValues, name ), [ initialValues, name ] );

		if ( isDummy ) {
			return <Component
				name={ name }
				{ ...props }
				// Override value and change hanlder with dummy values.
				disabled={ true }
				value={ value }
				onChange={ noop }
			/>;
		}

		return <Component name={ name } { ...props } />;
	};

	ComponentWithFormikDummy.propTypes = {
		name: PropTypes.string.isRequired,
		isDummy: PropTypes.string,
	};

	return ComponentWithFormikDummy;
};

export default withFormikDisabledDummy;
