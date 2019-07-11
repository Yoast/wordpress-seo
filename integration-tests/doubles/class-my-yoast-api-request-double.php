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
	 * @inheritdoc
	 */
	public function enrich_request_arguments( array $request_arguments ) {
		return parent::enrich_request_arguments( $request_arguments );
	}

	/**
	 * @inheritdoc
	 */
	public function do_request( $url, $request_arguments ) {
		return parent::do_request( $url, $request_arguments );
	}
}
