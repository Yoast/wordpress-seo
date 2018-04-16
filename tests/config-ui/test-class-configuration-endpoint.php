<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

/**
 * Class WPSEO_Configuration_Endpoint_Test
 */
class WPSEO_Configuration_Endpoint_Test extends WPSEO_UnitTestCase {
	/** @var WPSEO_Configuration_Endpoint_Mock */
	protected $endpoint;

	/**
	 * Set up
	 */
	public function setUp() {
		parent::setUp();

		$this->endpoint = new WPSEO_Configuration_Endpoint_Mock();
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::set_service()
	 */
	public function test_set_service() {
		$service = $this->getMockBuilder( 'WPSEO_Configuration_Service' )->getMock();

		$this->assertNull( $this->endpoint->set_service( $service ) );
		$this->assertEquals( $service, $this->endpoint->get_service() );
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::can_retrieve_data()
	 */
	public function test_can_retrieve_data_fail() {
		$user_id = $this->factory->user->create();

		wp_set_current_user( $user_id );

		$this->assertFalse( $this->endpoint->can_retrieve_data() );
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::can_retrieve_data()
	 */
	public function test_can_retrieve_data_pass() {
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		wp_set_current_user( $user_id );

		$this->assertTrue( $this->endpoint->can_retrieve_data() );
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::can_save_data()
	 */
	public function test_can_save_data_fail() {
		$user_id = $this->factory->user->create();

		wp_set_current_user( $user_id );

		$this->assertFalse( $this->endpoint->can_save_data() );
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::can_save_data()
	 */
	public function test_can_save_data_pass() {
		$user_id = $this->factory->user->create( array( 'role' => 'administrator' ) );

		wp_set_current_user( $user_id );

		$this->assertTrue( $this->endpoint->can_save_data() );
	}

	/**
	 * @covers WPSEO_Configuration_Endpoint::register()
	 *
	 */
	public function test_register() {

		if ( ! class_exists( 'WP_REST_Server' ) ) {
			$this->markTestSkipped( 'WordPress version too low to test with WP_REST_Server.' );

			return;
		}

		global $wp_rest_server;
		$wp_rest_server = new WPSEO_WP_REST_Server_Mock();

		$this->endpoint->register();

		$endpoints = $wp_rest_server->get_endpoints();

		$this->assertTrue( isset( $endpoints[ '/' . WPSEO_Configuration_Endpoint::REST_NAMESPACE ] ) );
		$this->assertTrue( isset( $endpoints[ '/' . WPSEO_Configuration_Endpoint::REST_NAMESPACE . '/' . WPSEO_Configuration_Endpoint::ENDPOINT_RETRIEVE ] ) );
		$this->assertTrue( isset( $endpoints[ '/' . WPSEO_Configuration_Endpoint::REST_NAMESPACE . '/' . WPSEO_Configuration_Endpoint::ENDPOINT_STORE ] ) );
	}
}
