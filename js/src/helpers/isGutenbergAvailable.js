/* global window */

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
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
export const isGutenbergEditorAvailable = () => {
	return has( window, "wp.editor.Blocks" );
};
