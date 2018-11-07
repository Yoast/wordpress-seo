/* global wp */

import { isUndefined } from "lodash-es";
import { isFunction } from "lodash-es";

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
