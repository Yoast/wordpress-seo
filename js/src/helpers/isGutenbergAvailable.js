import has from "lodash/has";

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
export const isGutenbergDataAvailable = () => {
	return has( window, "wp.data" );
};

/**
 * Checks if the Gutenberg editor is being used.
 *
 * Gutenberg uses wp_add_inline_script to pass along the initial post data.
 * Therefor we can test if this variable exists to know if the Gutenberg editor is being used.
 * see: https://github.com/WordPress/gutenberg/blob/master/lib/client-assets.php#L853
 *
 * @returns {boolean} True if the Gutenberg editor is being used.
 */
export const isGutenbergPostAvailable = () => {
	return has( window, "_wpGutenbergPost" );
};

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
export const isGutenbergEditorAvailable = () => {
	return has( window, "wp.editor.Blocks" );
};
