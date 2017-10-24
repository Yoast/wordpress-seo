<?php
/**
 * @package WPSEO\Tests\OnPage
 */

/**
 * Unit Test Class.
 */
class WPSEO_OnPage_Request_Test extends WPSEO_UnitTestCase {

	/**
	 * Include helper class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/wpseo-onpage-request-double.php';
	}

	/**
	 * Test if there is a response
	 *
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response() {
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
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response_redirected() {
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
	 * @covers WPSEO_OnPage_Request::get_response
	 */
	public function test_get_response_not_indexable() {
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
