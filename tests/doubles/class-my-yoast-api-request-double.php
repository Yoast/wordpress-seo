<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_MyYoast_Api_Request_Double extends WPSEO_MyYoast_Api_Request {

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
}
