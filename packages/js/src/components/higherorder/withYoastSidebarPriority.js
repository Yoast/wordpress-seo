import PropTypes from "prop-types";

/**
 * Adds a priority prop to a React component.
 *
 * @param {React.ComponentType} WrappedComponent the component to give priority.
 * @returns {React.ComponentType} the wrapped function.
 */
const withYoastSidebarPriority = ( WrappedComponent ) => {
	/**
	 * The new component in which the wrapped component is returned.
	 *
	 * @param {number|undefined} [renderPriority] The priority of the component.
	 * @param {...Object} [props] The props to pass to the component.
	 *
	 * @returns {JSX.Element} The element.
	 */
	// eslint-disable-next-line no-unused-vars, no-undefined -- The renderPriority is consumed by the slot.
	const YoastSidebarPriority = ( { renderPriority = undefined, ...props } ) => {
		return <WrappedComponent { ...props } />;
	};
	YoastSidebarPriority.propTypes = {
		renderPriority: PropTypes.number,
	};
	return YoastSidebarPriority;
};

export default withYoastSidebarPriority;
