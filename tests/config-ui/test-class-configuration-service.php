<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\ConfigUI
 */

/**
 * Class WPSEO_Configuration_Service_Test
 */
class WPSEO_Configuration_Service_Test extends PHPUnit_Framework_TestCase {

	/** @var WPSEO_Configuration_Service instance */
	protected $configuration_service;

	/**
	 * Preparation
	 */
	public function setUp() {
		parent::setUp();

		$this->configuration_service = new WPSEO_Configuration_Service();
	}

	/**
	 * Cleaning
	 */
	public function tearDown() {
		parent::tearDown();

		remove_action( 'rest_api_init', array(
			$this->configuration_service,
			'initialize',
		) );
	}

	/**
	 * Make sure the REST API init is hooked on
	 */
	public function test_rest_api_init_hooked() {
		$this->assertEquals( 10, has_action( 'rest_api_init', 'wpseo_init_rest_api' ) );
	}

	/**
	 * Test set storage
	 *
	 * @covers WPSEO_Configuration_Service::set_storage()
	 */
	public function test_set_storage() {
		$service = new WPSEO_Configuration_Service_Mock();
		$storage = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->getMock();

		$this->assertNull( $service->set_storage( $storage ) );
		$this->assertEquals( $storage, $service->get( 'storage' ) );
	}

	/**
	 * Test set endpoint
	 *
	 * @covers WPSEO_Configuration_Service::set_endpoint()
	 */
	public function test_set_endpoint() {
		$service  = new WPSEO_Configuration_Service_Mock();
		$endpoint = $this->getMockBuilder( 'WPSEO_Configuration_Endpoint' )->getMock();

		$this->assertNull( $service->set_endpoint( $endpoint ) );
		$this->assertEquals( $endpoint, $service->get( 'endpoint' ) );
	}

	/**
	 * Test set options adapter
	 *
	 * @covers WPSEO_Configuration_Service::set_options_adapter()
	 */
	public function test_set_options_adapter() {
		$service = new WPSEO_Configuration_Service_Mock();
		$adapter = $this->getMockBuilder( 'WPSEO_Configuration_Options_Adapter' )->getMock();

		$this->assertNull( $service->set_options_adapter( $adapter ) );
		$this->assertEquals( $adapter, $service->get( 'adapter' ) );
	}

	/**
	 * Test set components
	 *
	 * @covers WPSEO_Configuration_Service::set_components()
	 */
	public function test_set_components() {
		$service    = new WPSEO_Configuration_Service_Mock();
		$components = $this->getMockBuilder( 'WPSEO_Configuration_Components' )->getMock();

		$this->assertNull( $service->set_components( $components ) );
		$this->assertEquals( $components, $service->get( 'components' ) );
	}

	/**
	 * Test set structure
	 *
	 * @covers WPSEO_Configuration_Service::set_structure()
	 */
	public function test_set_structure() {
		$service   = new WPSEO_Configuration_Service_Mock();
		$structure = $this->getMockBuilder( 'WPSEO_Configuration_Structure' )->getMock();

		$this->assertNull( $service->set_structure( $structure ) );
		$this->assertEquals( $structure, $service->get( 'structure' ) );
	}

	/**
	 * Test retrieving configuration
	 *
	 * @covers WPSEO_Configuration_Service::get_configuration()
	 */
	public function test_get_configuration() {
		$storage   = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->setMethods( array( 'retrieve' ) )->getMock();
		$structure = $this->getMockBuilder( 'WPSEO_Configuration_Structure' )->setMethods( array( 'retrieve' ) )->getMock();
		$adapter   = new WPSEO_Configuration_Options_Adapter();

		$storage
			->expects( $this->once() )
			->method( 'retrieve' )
			->will( $this->returnValue( array() ) );

		$structure
			->expects( $this->once() )
			->method( 'retrieve' )
			->will( $this->returnValue( array() ) );

		$this->configuration_service->set_storage( $storage );
		$this->configuration_service->set_options_adapter( $adapter );
		$this->configuration_service->set_structure( $structure );
		$this->configuration_service->set_components( new WPSEO_Configuration_Components() );
		$this->configuration_service->set_translations( new WPSEO_Configuration_Translations( 'en_US' ) );

		$result = $this->configuration_service->get_configuration();

		$this->assertInternalType( 'array', $result );

		$this->assertEquals(
			array(
				'fields'       => array(),
				'steps'        => array(),
				'translations' => array(),
			),
			$result
		);
	}

	/**
	 * Test saving configuration function calls
	 *
	 * @covers WPSEO_Configuration_Service::set_configuration()
	 */
	public function test_set_configuration() {

		if ( ! class_exists( 'WP_REST_Request' ) ) {
			$this->markTestSkipped( 'WordPress version too low to test with WP_REST_Request.' );

			return;
		}


		$expected = array( 'some_data' );

		$storage = $this->getMockBuilder( 'WPSEO_Configuration_Storage' )->setMethods( array( 'store' ) )->getMock();

		$data = new WP_REST_Request();
		$data->set_header( 'content-type', 'application/json' );

		$data->set_body( json_encode( $expected ) );

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
	 * Make sure all providers are set with default providers call
	 *
	 * @covers WPSEO_Configuration_Service::set_default_providers()
	 */
	public function test_set_default_providers() {
		$configuration_service = new WPSEO_Configuration_Service_Mock();
		$configuration_service->set_default_providers();

		$properties = array(
			'storage',
			'adapter',
			'structure',
			'endpoint',
			'components',
		);

		foreach ( $properties as $property ) {
			$this->assertNotNull( $configuration_service->get( $property ) );
		}
	}
}
