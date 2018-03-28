/* global wp */

import isUndefined from "lodash/isUndefined";

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
const isGutenbergDataAvailable = () => {
	return ( ! isUndefined( window.wp ) && ! isUndefined( wp.data ) );
};

export default isGutenbergDataAvailable;

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
	return ! isUndefined( window._wpGutenbergPost );
};
