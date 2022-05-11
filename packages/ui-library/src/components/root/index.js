import PropTypes from "prop-types";
import { createContext, useContext } from "@wordpress/element";

const defaultRootContext = {
	isRtl: false,
};

export const RootContext = createContext( defaultRootContext );

/**
 * @returns {{ isRtl: boolean }} The root context.
 */
export const useRootContext = () => useContext( RootContext );


/**
 * @param {JSX.node} children The React children.
 * @param {{ isRtl: boolean }} context The root context value.
 * @returns {JSX.Element} The Root component.
 */
const Root = ( { children, context } ) => {
	return (
		<RootContext.Provider value={ { ...defaultRootContext, ...context } }>
			<div className="yst-root">
				{ children }
			</div>
		</RootContext.Provider>
	);
};

Root.propTypes = {
	children: PropTypes.node.isRequired,
	context: PropTypes.shape( {
		isRtl: PropTypes.bool.isRequired,
	} ),
};

export default Root;
