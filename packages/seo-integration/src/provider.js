import { createContext } from "@wordpress/element";
import { PropTypes } from "prop-types";

export const SeoContext = createContext( {} );

/**
 * Creates an SEO provider.
 *
 * @param {Object} context The context to provide.
 *
 * @returns {function({children?: JSX.Element})} The SEO provider.
 */
const createSeoProvider = ( context ) => {
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

export default createSeoProvider;
