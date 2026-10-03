import PropTypes from "prop-types";
import React, { createContext } from "react";

const defaultRootContext = {
	isRtl: false,
};

export const RootContext = createContext( defaultRootContext );

// Stable reference so the empty-object default keeps a constant identity across renders.
const DEFAULT_CONTEXT = {};

/**
 * @param {JSX.node} children The React children.
 * @param {{ isRtl: boolean }} context The root context value.
 * @returns {JSX.Element} The Root component.
 */
const Root = ( { children, context = DEFAULT_CONTEXT, ...props } ) => {
	return (
		<RootContext.Provider value={ { ...defaultRootContext, ...context } }>
			<div className="yst-root" { ...props }>
				{ children }
			</div>
		</RootContext.Provider>
	);
};

Root.propTypes = {
	children: PropTypes.node.isRequired,
	context: PropTypes.shape( {
		isRtl: PropTypes.bool,
	} ),
};

export default Root;
