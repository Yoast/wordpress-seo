import { Component, Fragment } from "@wordpress/element";

/**
 * A higher order component that appends a space to the given component.
 *
 * @param {wp.Component} WrappedComponent The component to append a space to.
 * @returns {wp.Component} The component with an appended space.
 */
const appendSpace = function( WrappedComponent ) {
	return class ComponentWithAppendedSpace extends Component {
		/**
		 * Renders the React component.
		 *
		 * @returns {wp.Element} The rendered component.
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
