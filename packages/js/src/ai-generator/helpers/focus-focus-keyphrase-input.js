/**
 * Tries to focus the focus keyphrase input, based on the location.
 *
 * This is the fragile way out. A React ref would be the React way to go.
 * However, even if we do refactor the keyphrase component to forward refs, the sidebar does not play nice.
 *
 * @param {string} location The location.
 * @returns {void}
 */
export const focusFocusKeyphraseInput = ( location ) => {
	const id = `focus-keyword-input-${ location === "modal" ? "sidebar" : location }`;
	if ( location === "metabox" ) {
		// Ensure the SEO tab is active first.
		const tabElement = document.getElementById( "wpseo-meta-tab-content" );
		if ( tabElement ) {
			tabElement.click();
		}
	}
	const inputElement = document.getElementById( id );
	if ( inputElement ) {
		inputElement.focus();
	}
};
