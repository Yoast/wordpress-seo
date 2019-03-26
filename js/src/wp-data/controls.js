/* External dependencies */
import apiFetch from "@wordpress/api-fetch";

/* Internal dependencies */
import {
	FETCH_FROM_API,
} from "./actions";

/**
 * Object containing controls for wp-data api.
 *
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/packages/packages-data/#controls.
 */
export default {
	/**
	 * Control to trigger an api request.
	 *
	 * @param {Object} request Request parameters.
	 *
	 * @returns {Promise} API promise.
	 */
	[ FETCH_FROM_API ]( { request } ) {
		return apiFetch( request );
	},
};
