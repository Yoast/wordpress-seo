<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Multisite_Conditional;
use Yoast\WP\SEO\Initializers\Network_Admin_Options_Initializer;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Network_Admin_Options_Initializer class.
 *
 * @group initializers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Network_Admin_Options_Initializer
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Initializer should not count.
 */
class Network_Admin_Options_Initializer_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Network_Admin_Options_Initializer
	 */
	protected $instance;

	/**
	 * Holds the multisite options service instance.
	 *
	 * @var Multisite_Options_Service|Mockery\Mock
	 */
	protected $multisite_options_service;

	/**
	 * Holds the Network_Admin_Options_Service instance.
	 *
	 * @var Network_Admin_Options_Service|Mockery\Mock
	 */
	protected $network_admin_options_service;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->multisite_options_service     = Mockery::mock( Multisite_Options_Service::class );
		$this->network_admin_options_service = Mockery::mock( Network_Admin_Options_Service::class );

		$this->instance = new Network_Admin_Options_Initializer( $this->multisite_options_service, $this->network_admin_options_service );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Network_Admin_Options_Initializer::class, $this->instance );
		$this->assertInstanceOf(
			Multisite_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'multisite_options_service' )
		);
		$this->assertInstanceOf(
			Network_Admin_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'network_admin_options_service' )
		);
	}

	/**
	 * Tests the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Multisite_Conditional::class ],
			Network_Admin_Options_Initializer::get_conditionals()
		);
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 */
	public function test_initialize() {
		Monkey\Filters\expectAdded( 'wpseo_network_admin_options_additional_configurations' )
			->with( [ $this->instance, 'add_multisite_verify_configurations' ] );
		$this->network_admin_options_service->expects( 'clear_cache' )->once();

		Monkey\Filters\expectAdded( 'wpseo_multisite_options_values' )
			->with( [ $this->instance, 'verify_options_against_network' ] );
		$this->multisite_options_service->expects( 'clear_cache' )->once();

		$this->instance->initialize();
	}

	/**
	 * Tests add multisite verify configurations.
	 *
	 * @covers ::add_multisite_verify_configurations
	 * @covers ::is_multisite_verify_configuration
	 */
	public function test_add_multisite_verify_configurations() {
		$this->multisite_options_service->expects( 'get_configurations' )
			->once()
			->andReturn(
				[
					'foo' => [
						'default' => true,
						'types'   => [ 'boolean' ],
					],
					'bar' => [
						'default'   => true,
						'types'     => [ 'boolean' ],
						'ms_verify' => true,
					],
					'baz' => [
						'default'   => true,
						'types'     => [ 'boolean' ],
						'ms_verify' => false,
					],
				]
			);

		$result = $this->instance->add_multisite_verify_configurations( [ 'pre-existing' => [] ] );

		$this->assertEquals(
			[
				'pre-existing' => [],
				'allow_bar'    => [
					'default' => true,
					'types'   => [ 'boolean' ],
				],
				'allow_baz'    => [
					'default' => false,
					'types'   => [ 'boolean' ],
				],
			],
			$result
		);
		$this->assertArrayNotHasKey( 'allow_foo', $result );
	}

	/**
	 * Tests verify options against network.
	 *
	 * @covers ::verify_options_against_network
	 * @covers ::is_multisite_verify_configuration
	 */
	public function test_verify_options_against_network() {
		$this->multisite_options_service->expects( 'get_configurations' )
			->once()
			->andReturn(
				[
					'foo'        => [
						'default'   => true,
						'types'     => [ 'boolean' ],
						'ms_verify' => true,
					],
					'bar'        => [
						'default'   => true,
						'types'     => [ 'boolean' ],
						'ms_verify' => true,
					],
					'baz'        => [
						'default'   => false,
						'types'     => [ 'boolean' ],
						'ms_verify' => false,
					],
					'non_verify' => [
						'default' => true,
						'types'   => [ 'boolean' ],
					],
				]
			);

		$this->network_admin_options_service->expects( 'get_defaults' )->andReturn(
			[
				'allow_foo' => true,
				'allow_bar' => false,
				// Using default fallback for `baz` here.
			]
		);

		$this->assertEquals(
			[
				'foo'        => true,
				'bar'        => false,
				'baz'        => false,
				'some_value' => 123,
			],
			$this->instance->verify_options_against_network(
				[
					'foo'        => true,
					'bar'        => true,
					'baz'        => true,
					'some_value' => 123,
				]
			)
		);
	}
}
