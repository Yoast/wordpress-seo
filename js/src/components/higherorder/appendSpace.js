import React, { Fragment } from "react";

/**
 * Appends a space to the passed component.
 *
 * @param {ReactElement} WrappedComponent The component to append a space to.
 * @returns {ReactElement} The component with an appended space.
 */
const appendSpace = function( WrappedComponent ) {
	return class ComponentWithAppendedSpace extends React.Component {
		render() {
			return(
				<Fragment>
					<WrappedComponent { ...this.props }/>
					{ " " }
				</Fragment>
			);
		}
	};
};

export default appendSpace;
