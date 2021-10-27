<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

use Yoast\WPTestUtils\WPIntegration\TestCase;

/**
 * Class WPSEO_Configuration_Service_Test.
 */
class WPSEO_Configuration_Service_Test extends TestCase {

	use Yoast_SEO_ReflectionToString_Deprecation_Handler;

	/**
	 * Instance.
	 *
	 * @var WPSEO_Configuration_Service
	 */
	protected $configuration_service;

	/**
	 * Preparation.
	 */
	public function set_up() {
		parent::set_up();

		$this->configuration_service = new WPSEO_Configuration_Service();
	}

	/**
	 * Cleaning.
	 */
	public function tear_down() {
		remove_action(
			'rest_api_init',
			[ $this->configuration_service, 'initialize' ]
		);

		parent::tear_down();
	}

	/**
	 * Test set storage.
	 *
	 * @covers WPSEO_Configuration_Service::set_storage
	 */
	public function test_set_storage() {

		$this->expect_reflection_deprecation_warning_php74();

		$service = new WPSEO_Configuration_Service_Mock();
		$storage = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->getMock();

		$this->assertNull( $service->set_storage( $storage ) );
		$this->assertEquals( $storage, $service->get( 'storage' ) );
	}

	/**
	 * Test set endpoint.
	 *
	 * @covers WPSEO_Configuration_Service::set_endpoint
	 */
	public function test_set_endpoint() {

		$this->expect_reflection_deprecation_warning_php74();

		$service  = new WPSEO_Configuration_Service_Mock();
		$endpoint = $this->getMockBuilder( 'WPSEO_Configuration_Endpoint' )->getMock();

		$this->assertNull( $service->set_endpoint( $endpoint ) );
		$this->assertEquals( $endpoint, $service->get( 'endpoint' ) );
	}

	/**
	 * Test set options adapter.
	 *
	 * @covers WPSEO_Configuration_Service::set_options_adapter
	 */
	public function test_set_options_adapter() {

		$this->expect_reflection_deprecation_warning_php74();

		$service = new WPSEO_Configuration_Service_Mock();
		$adapter = $this->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )->getMock();

		$this->assertNull( $service->set_options_adapter( $adapter ) );
		$this->assertEquals( $adapter, $service->get( 'adapter' ) );
	}

	/**
	 * Test set components.
	 *
	 * @covers WPSEO_Configuration_Service::set_components
	 */
	public function test_set_components() {

		$this->expect_reflection_deprecation_warning_php74();

		$service    = new WPSEO_Configuration_Service_Mock();
		$components = $this->getMockBuilder( 'WPSEO_Configuration_Components' )->getMock();

		$this->assertNull( $service->set_components( $components ) );
		$this->assertEquals( $components, $service->get( 'components' ) );
	}

	/**
	 * Test set structure.
	 *
	 * @covers WPSEO_Configuration_Service::set_structure
	 */
	public function test_set_structure() {
		$service   = new WPSEO_Configuration_Service_Mock();
		$structure = $this->getMockBuilder( 'WPSEO_Configuration_Structure' )->getMock();

		$this->assertNull( $service->set_structure( $structure ) );
		$this->assertEquals( $structure, $service->get( 'structure' ) );
	}

	/**
	 * Test retrieving configuration.
	 *
	 * @covers WPSEO_Configuration_Service::get_configuration
	 */
	public function test_get_configuration() {
		$storage   = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->setMethods( [ 'retrieve' ] )->getMock();
		$structure = $this->getMockBuilder( 'WPSEO_Configuration_Structure' )->setMethods( [ 'retrieve' ] )->getMock();
		$adapter   = new WPSEO_Configuration_Options_Adapter();

		$storage
			->expects( $this->once() )
			->method( 'retrieve' )
			->will( $this->returnValue( [] ) );

		$structure
			->expects( $this->once() )
			->method( 'retrieve' )
			->will( $this->returnValue( [] ) );

		$this->configuration_service->set_storage( $storage );
		$this->configuration_service->set_options_adapter( $adapter );
		$this->configuration_service->set_structure( $structure );
		$this->configuration_service->set_components( new WPSEO_Configuration_Components() );
		$this->configuration_service->set_translations( new WPSEO_Configuration_Translations( 'en_US' ) );

		$result = $this->configuration_service->get_configuration();

		$this->assertIsArray( $result );

		$this->assertEquals(
			[
				'fields'       => [],
				'steps'        => [],
				'translations' => [],
			],
			$result
		);
	}

	/**
	 * Test saving configuration function calls.
	 *
	 * @covers WPSEO_Configuration_Service::set_configuration
	 */
	public function test_set_configuration() {

		if ( ! class_exists( 'WP_REST_Request' ) ) {
			$this->markTestSkipped( 'WordPress version too low to test with WP_REST_Request.' );

			return;
		}


		$expected = [ 'some_data' ];

		$storage = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->setMethods( [ 'store' ] )->getMock();

		$data = new WP_REST_Request();
		$data->set_header( 'content-type', 'application/json' );

		$data->set_body( WPSEO_Utils::format_json_encode( $expected ) );

		$storage
			->expects( $this->once() )
			->method( 'store' )
			->with( $expected );

		$this->configuration_service->set_storage( $storage );
		$this->configuration_service->set_options_adapter( new WPSEO_Configuration_Options_Adapter() );
		$this->configuration_service->set_components( new WPSEO_Configuration_Components() );
		$this->configuration_service->set_structure( new WPSEO_Configuration_Structure() );
		$this->configuration_service->set_configuration( $data );
	}

	/**
	 * Make sure all providers are set with default providers call.
	 *
	 * @covers WPSEO_Configuration_Service::set_default_providers
	 */
	public function test_set_default_providers() {
		$configuration_service = new WPSEO_Configuration_Service_Mock();
		$configuration_service->set_default_providers();

		$properties = [
			'storage',
			'adapter',
			'structure',
			'endpoint',
			'components',
		];

		foreach ( $properties as $property ) {
			$this->assertNotNull( $configuration_service->get( $property ) );
		}
	}
}
