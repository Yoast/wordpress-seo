/**
 * Tries to extract the array of elements from the live container model.
 *
 * @param {Object} currentDocument The Elementor document.
 * @returns {Array|null} The array of elements, or null if not accessible.
 */
function getContainerElements( currentDocument ) {
	const elements = currentDocument.container?.model?.get( "elements" );
	if ( ! elements || typeof elements.toJSON !== "function" ) {
		return null;
	}
	return elements.toJSON();
}

/**
 * Reads the atomic widget JSON tree from an Elementor document, trying the live
 * container model first and falling back to the initial config.
 *
 * @param {Object} currentDocument The Elementor document.
 * @returns {Array} The top-level elements array, or empty if not accessible.
 */
function getDocumentTree( currentDocument ) {
	if ( ! currentDocument ) {
		return [];
	}
	const fromContainer = getContainerElements( currentDocument );
	if ( fromContainer ) {
		return fromContainer;
	}
	return Array.isArray( currentDocument.config?.elements ) ? currentDocument.config.elements : [];
}

export { getContainerElements, getDocumentTree };
