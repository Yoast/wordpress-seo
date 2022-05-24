<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Initializers\Options_Initializer;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Integration_Test.
 *
 * @group initializers
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Options_Initializer
 */
class Options_Initializer_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Options_Initializer
	 */
	protected $instance;

	/**
	 * Holds the network admin options service instance.
	 *
	 * @var Network_Admin_Options_Service|Mockery\Mock
	 */
	protected $network_admin_options_service;

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * Holds the capability helper instance.
	 *
	 * @var Capability_Helper|Mockery\Mock
	 */
	protected $capability_helper;

	/**
	 * Holds the site helper instance.
	 *
	 * @var Site_Helper|Mockery\Mock
	 */
	protected $site_helper;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();

		$this->network_admin_options_service = Mockery::mock( Network_Admin_Options_Service::class );
		$this->options_helper                = Mockery::mock( Options_Helper::class );
		$this->capability_helper             = Mockery::mock( Capability_Helper::class );
		$this->site_helper                   = Mockery::mock( Site_Helper::class );
		$this->instance                      = new Options_Initializer(
			$this->network_admin_options_service,
			$this->options_helper,
			$this->capability_helper,
			$this->site_helper
		);
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Options_Initializer::class, $this->instance );
		$this->assertInstanceOf(
			Network_Admin_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'network_admin_options_service' )
		);
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options_helper' )
		);
		$this->assertInstanceOf(
			Capability_Helper::class,
			$this->getPropertyValue( $this->instance, 'capability_helper' )
		);
		$this->assertInstanceOf(
			Site_Helper::class,
			$this->getPropertyValue( $this->instance, 'site_helper' )
		);
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], Options_Initializer::get_conditionals() );
	}

	/**
	 * Tests that the expected hooks are registered.
	 *
	 * @covers ::initialize
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'registered_post_type' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'unregistered_post_type' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'registered_taxonomy' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();
		Monkey\Actions\expectAdded( 'unregistered_taxonomy' )
			->with( [ $this->options_helper, 'clear_cache' ] )
			->once();

		Monkey\Actions\expectAdded( 'admin_init' )
			->with( [ $this->instance, 'register_options' ] )
			->once();

		$this->instance->initialize();
	}

	/**
	 * Tests that the expected options are registered.
	 *
	 * @covers ::register_options
	 */
	public function test_register_options() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( true );

		$this->site_helper->expects( 'is_multisite' )
			->once()
			->andReturn( true );

		$network_settings = Mockery::mock( 'overload:Yoast_Network_Settings_API' );
		$network_settings->expects( 'register_setting' )->once()->with( 'wpseo_network_admin_options', 'wpseo_network_admin_options' );
		$network_settings->expects( 'get' )->andReturn( $network_settings );

		$this->instance->register_options();
	}

	/**
	 * Tests that the expected options are not registered when not enough capabilities.
	 *
	 * @covers ::register_options
	 */
	public function test_register_options_unallowed() {
		$this->capability_helper->expects( 'current_user_can' )
			->once()
			->with( 'wpseo_manage_options' )
			->andReturn( false );

		$this->site_helper->expects( 'is_multisite' )->never();

		$this->instance->register_options();
	}
}
