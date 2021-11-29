import { createContext, useContext } from "@wordpress/element";
import { PropTypes } from "prop-types";

const SeoContext = createContext( {} );

/**
 * Use the SEO context via hook.
 *
 * @returns {Object} The SEO context.
 */
export const useSeoContext = () => useContext( SeoContext );

/**
 * Creates an SEO provider.
 *
 * @param {Object} context The context to provide.
 *
 * @returns {function({children: ?JSX.Element})} The SEO provider.
 */
export const createSeoProvider = ( context ) => {
	/**
	 * Provides the SEO context.
	 *
	 * @param {JSX.Element} [children] Any React children to render inside.
	 *
	 * @returns {JSX.Element} The SEO provider.
	 */
	const SeoProvider = ( { children } ) => (
		<SeoContext.Provider value={ context }>{ children }</SeoContext.Provider>
	);

	SeoProvider.propTypes = {
		children: PropTypes.node,
	};

	SeoProvider.defaultProps = {
		children: null,
	};

	return SeoProvider;
};

export default SeoContext;
