import PropTypes from "prop-types";
import { ErrorBoundary } from "@yoast/ui-library";
import DefaultErrorFallback from "./DefaultErrorFallback";

/**
 * Wrapper around the ErrorBoundary component that sets the default fallback component to use.
 *
 * @param {JSX.Element} fallback The fallback component to render when an error occurs.
 * @param {JSX.Node} children The children
 * @returns {JSX.Element} The rendered component
 */
const ErrorBoundaryWithDefaultFallback = ( { fallback = DefaultErrorFallback, children } ) => {
	return (
		<ErrorBoundary FallbackComponent={ fallback }>
			{ children }
		</ErrorBoundary>
	);
};

ErrorBoundaryWithDefaultFallback.propTypes = {
	fallback: PropTypes.elementType,
	children: PropTypes.node.isRequired,
};

ErrorBoundaryWithDefaultFallback.defaultProps = {
	fallback: DefaultErrorFallback,
};

export default ErrorBoundaryWithDefaultFallback;
