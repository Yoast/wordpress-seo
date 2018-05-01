/* global wp */

import isUndefined from "lodash/isUndefined";
import isFunction from "lodash/isFunction";

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
const isGutenbergDataAvailable = () => {
	return (
		! isUndefined( window.wp ) &&
		! isUndefined( wp.data ) &&
		! isUndefined( wp.data.select( "core/editor" ) ) &&
		isFunction( wp.data.select( "core/editor" ).getEditedPostAttribute )
	);
};

export default isGutenbergDataAvailable;
