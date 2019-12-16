/* global wp */

import {
	isNil,
	isFunction,
} from "lodash-es";

/**
 * Checks if the data API from Gutenberg is available.
 *
 * @returns {boolean} True if the data API is available.
 */
const isGutenbergDataAvailable = () => {
	return (
		! isNil( window.wp ) &&
		! isNil( wp.data ) &&
		! isNil( wp.data.select( "core/edit-post" ) ) &&
		! isNil( wp.data.select( "core/editor" ) ) &&
		isFunction( wp.data.select( "core/editor" ).getEditedPostAttribute )
	);
};

export default isGutenbergDataAvailable;
