/* External dependencies */
import PropTypes from "prop-types";

/**
 * Adds a priority prop to a React component.
 *
 * @param {function} WrappedComponent the component to give priority.
 * @returns {function} the wrapped function.
 */
const withYoastSidebarPriority = ( WrappedComponent ) => {
	/**
	 * The new function in which the wrapped component is returned.
	 * @param {object} props The props.
	 * @returns {wp.Element} The component.
	 * @constructor
	 */
	const YoastSidebarPriority = ( props ) => {
		const {
			// eslint-disable-next-line
			renderPriority,
			...otherProps
		} = props;
		return <WrappedComponent { ...otherProps } />;
	};
	YoastSidebarPriority.propTypes = {
		renderPriority: PropTypes.number,
	};
	return YoastSidebarPriority;
};

export default withYoastSidebarPriority;
