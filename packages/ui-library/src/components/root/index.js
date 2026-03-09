import classNames from "classnames";
import PropTypes from "prop-types";
import React, { createContext } from "react";

const defaultRootContext = {
	isRtl: false,
};

export const RootContext = createContext( defaultRootContext );

/**
 * @param {JSX.node} children The React children.
 * @param {{ isRtl: boolean }} [context] The root context value.
 * @param {string} [className] Additional CSS class names for the wrapper div.
 * @param {Object} [props] Additional HTML attributes to pass to the wrapper div (id, data-*, etc.).
 * @returns {JSX.Element} The Root component.
 */
const Root = ( { children, context = {}, className, ...props } ) => {
	return (
		<RootContext.Provider value={ { ...defaultRootContext, ...context } }>
			<div className={ classNames( "yst-root", className ) } { ...props }>
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
	className: PropTypes.string,
};

export default Root;
