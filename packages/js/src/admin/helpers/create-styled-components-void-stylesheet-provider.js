import PropTypes from "prop-types";
import { StyleSheetManager } from "styled-components";
import { ensureElement } from "./index";

/**
 * Creates a provider that voids the Styled Components stylesheet.
 *
 * By rendering them in a shadow root.
 *
 * @param {string} [id] The ID for the shadow host element.
 *
 * @returns {function({children: JSX.node}): JSX.Element} The StyleSheetProvider that effectively voids the styles.
 */
const createStyledComponentsVoidStylesheetProvider = ( id = "yoast-styled-components-void" ) => {
	const shadowRoot = ensureElement( id ).attachShadow( { mode: "open" } );

	/**
	 * @param {JSX.node} children The content.
	 * @returns {JSX.Element} The element.
	 */
	const StyledComponentsVoidStylesheetProvider = ( { children } ) => (
		<StyleSheetManager target={ shadowRoot }>{ children }</StyleSheetManager>
	);
	StyledComponentsVoidStylesheetProvider.propTypes = {
		children: PropTypes.node.isRequired,
	};

	return StyledComponentsVoidStylesheetProvider;
};

export default createStyledComponentsVoidStylesheetProvider;
