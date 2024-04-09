import PropTypes from "prop-types";
import { DefaultErrorFallback } from "./DefaultErrorFallback";
import { ErrorBoundary } from "@yoast/ui-library";

/**
 * Wrapper around the ErrorBoundary component that sets the default fallback component to use.
 *
 * @param {JSX.Element} fallback The fallback component to render when an error occurs.
 * @param {JSX.Node} children The children
 *
 * @returns {JSX.Element} The rendered component
 */
export const ErrorBoundaryWithDefaultFallback = ( { fallback, children } ) => {
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
