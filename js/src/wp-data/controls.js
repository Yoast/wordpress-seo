/* External dependencies */
import apiFetch from "@wordpress/api-fetch";

/* Internal dependencies */
import {
	FETCH_FROM_API,
} from "./actions";

export default {
	/**
	 * Control to trigger an api request.
	 *
	 * @param {object} request Request parameters.
	 *
	 * @returns {Promise} API promise.
	 */
	[ FETCH_FROM_API ]( { request } ) {
		return apiFetch( request );
	},
};
