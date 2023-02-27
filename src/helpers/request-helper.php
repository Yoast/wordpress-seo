<?php

namespace Yoast\WP\SEO\Helpers;

use YoastSEO_Vendor\Symfony\Component\HttpFoundation\Request;

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

	/**
	 * Get a Request object based on the current state of the PHP superglobals.
	 *
	 * @return Request The request, based on the current state of the PHP superglobals.
	 */
	public function get_current_request() {
		return Request::createFromGlobals();
	}
}
