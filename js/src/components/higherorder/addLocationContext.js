import React from "react";
import { LocationProvider } from "../contexts/location";

/**
 * A higher order component that appends a space to the given component.
 *
 * @param {ReactComponent} WrappedComponent The component to add the location context to.
 * @param {string} location The location context.
 * @returns {ReactComponent} The component with the location context added to.
 */
const addLocationContext = function( WrappedComponent, location ) {
	return class ComponentWithLocationContext extends React.Component {
		render() {
			return (
				<LocationProvider value={ location }>
					<WrappedComponent { ...this.props } />
				</LocationProvider>
			);
		}
	};
};

export default addLocationContext;
