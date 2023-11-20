<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Inc;

use WPSEO_MyYoast_Api_Request;
use WPSEO_MyYoast_Bad_Request_Exception;

/**
 * Test Helper Class.
 */
class MyYoast_Api_Request_Double extends WPSEO_MyYoast_Api_Request {

	/**
	 * Checks if MyYoast tokens are allowed and adds the token to the request body.
	 *
	 * When tokens are disallowed it will add the url to the request body.
	 *
	 * @param array $request_arguments The arguments to enrich.
	 *
	 * @return array The enriched arguments.
	 */
	public function enrich_request_arguments( array $request_arguments ) {
		return parent::enrich_request_arguments( $request_arguments );
	}

	/**
	 * Performs the request using WordPress internals.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url               The request URL.
	 * @param array  $request_arguments The request arguments.
	 *
	 * @return string                                 The retrieved body.
	 * @throws WPSEO_MyYoast_Bad_Request_Exception    When request is invalid.
	 */
	public function do_request( $url, $request_arguments ) {
		return parent::do_request( $url, $request_arguments );
	}
}
