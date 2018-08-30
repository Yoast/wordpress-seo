<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\OnPage
 */

/**
 * Unit Test Class.
 */
class WPSEO_OnPage_Request_Test extends WPSEO_UnitTestCase {

	/**
	 * Test if there is a response
	 *
	 * @covers WPSEO_OnPage_Request::get_remote
	 */
	public function test_get_remote() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals(
			$request->do_request( home_url() ),
			array(
				'is_indexable'    => '1',
				'passes_juice_to' => '',
			)
		);
	}

	/**
	 * Test if there is a response for an url that will be redirected
	 *
	 * @covers WPSEO_OnPage_Request::get_remote
	 */
	public function test_get_remote_redirected() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals(
			$request->do_request( 'http:://will-be-redirected.wp' ),
			array(
				'is_indexable'    => '1',
				'passes_juice_to' => '',
			)
		);
	}

	/**
	 * Test if there is a response for a domain that isn't 'indexable'
	 *
	 * @covers WPSEO_OnPage_Request::get_remote
	 */
	public function test_get_remote_not_indexable() {
		$request = new WPSEO_OnPage_Request_Double();

		$this->assertEquals(
			$request->do_request( 'http://not_indexable.wp' ),
			array(
				'is_indexable'    => '0',
				'passes_juice_to' => '',
			)
		);
	}
}
