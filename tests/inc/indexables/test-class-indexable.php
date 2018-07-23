<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group indexable
 */
class WPSEO_Indexable_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Indexable_Service_Term_Provider_Double
	 */
	protected $provider;

	/**
	 * Sets an instance of the provider.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();

		$this->provider = new WPSEO_Indexable_Service_Double();
	}

	/**
	 * Tests the handling of an unknown object type.
	 *
	 * @covers       WPSEO_Indexable::handle_unknown_object_type()
	 */
	public function test_handle_unknown_object_type() {
		$this->assertInstanceOf( 'WP_REST_Response', $this->provider->handle_unknown_object_type( 'unknown' ) );
	}
}
