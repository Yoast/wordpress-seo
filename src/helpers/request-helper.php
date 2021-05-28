<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for the request state.
 */
class Request_Helper {

	/**
	 * Checks if the current request is a REST request.
	 *
	 * @return bool True when the current request is a REST request.
	 */
	public function is_rest_request() {
		return \defined( 'REST_REQUEST' ) && \REST_REQUEST === true;
	}
}
