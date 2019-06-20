import React, { Fragment } from "react";

/**
 * A higher order component that appends a space to the given component.
 *
 * @param {ReactComponent} WrappedComponent The component to append a space to.
 * @returns {ReactComponent} The component with an appended space.
 */
const appendSpace = function( WrappedComponent ) {
	return class ComponentWithAppendedSpace extends React.Component {
		/**
		 * Renders the React component.
		 *
		 * @returns {ReactElement} The rendered component.
		 */
		render() {
			return (
				<Fragment>
					<WrappedComponent { ...this.props } />
					{ " " }
				</Fragment>
			);
		}
	};
};

export default appendSpace;
