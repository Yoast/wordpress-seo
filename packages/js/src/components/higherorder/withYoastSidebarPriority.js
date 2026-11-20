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
	 * @param {Object} props Component props. The remaining props are passed to the wrapped component.
	 * @param {number} [props.renderPriority=undefined] The priority of the component.
	 *
	 * @returns {JSX.Element} The element.
	 */
	// eslint-disable-next-line no-unused-vars -- The renderPriority is consumed by the slot.
	const YoastSidebarPriority = ( { renderPriority = undefined, ...props } ) => {
		return <WrappedComponent { ...props } />;
	};
	return YoastSidebarPriority;
};

export default withYoastSidebarPriority;
