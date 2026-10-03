import PropTypes from "prop-types";
import { createContext } from "@wordpress/element";

const defaultRootContext = {};

export const RootContext = createContext( defaultRootContext );

/**
 * This Root is only used for pre-tailwind components when working on a tailwind component use the Ui library Root.
 * To refactor this to the new Ui root: Swap this root out for the Ui library root the properties are the same. Just change the import.
 *
 * @param {JSX.node} children The React children.
 * @param {Object} context The root context value.
 * @returns {JSX.Element} The Root component.
 */
const Root = ( { children, context = {} } ) => {
	return (
		<RootContext.Provider value={ { ...defaultRootContext, ...context } }>
			{ children }
		</RootContext.Provider>
	);
};

Root.propTypes = {
	children: PropTypes.node.isRequired,
	context: PropTypes.object,
};

export default Root;
