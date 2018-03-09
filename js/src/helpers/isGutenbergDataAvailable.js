/* global wp */

import isUndefined from "lodash/isUndefined";

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
const isGutenbergDataAvailable = () => {
	return ( ! isUndefined( wp ) && ! isUndefined( wp.data ) );
};

export default isGutenbergDataAvailable;
