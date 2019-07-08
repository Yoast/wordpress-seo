// External dependencies.
import get from "lodash/get";

/**
 * Retrieves the default query params.
 *
 * @returns {Object} The default query params.
 */
export default function getDefaultQueryParams() {
	return get( window, [ "wpseoAdminL10n", "default_query_params" ], {} );
}
