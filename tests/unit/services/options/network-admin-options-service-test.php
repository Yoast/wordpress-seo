<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Multisite_Options_Service;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Network_Admin_Options_Service class.
 *
 * @group services
 * @group options
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Service should not count.
 */
class Network_Admin_Options_Service_Test extends TestCase {

	/**
	 * Holds the instance to test.
	 *
	 * @var Network_Admin_Options_Service
	 */
	protected $instance;

	/**
	 * Holds the multisite options service instance.
	 *
	 * @var Multisite_Options_Service|Mockery\MockInterface
	 */
	protected $multisite_options_service;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\MockInterface
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\MockInterface
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\MockInterface
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->multisite_options_service = Mockery::mock( Multisite_Options_Service::class );
		$this->validation_helper         = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper          = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper           = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Network_Admin_Options_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
		$this->instance->set_dependencies( $this->multisite_options_service );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 */
	public function test_constructor() {
		$this->assertInstanceOf( Network_Admin_Options_Service::class, $this->instance );
		$this->assertEquals(
			'wpseo_network_admin_options',
			$this->getPropertyValue( $this->instance, 'option_name' )
		);
		$this->assertNotEmpty(
			$this->getPropertyValue( $this->instance, 'configurations' )
		);
		$this->assertInstanceOf(
			Multisite_Options_Service::class,
			$this->getPropertyValue( $this->instance, 'multisite_options_service' )
		);
		$this->assertInstanceOf(
			Validation_Helper::class,
			$this->getPropertyValue( $this->instance, 'validation_helper' )
		);
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' )
		);
	}

	/**
	 * Tests the magic get' happy path.
	 *
	 * @covers ::__get
	 * @covers ::get_values
	 * @covers ::get_wp_option
	 * @covers ::get_filtered_values
	 */
	public function test_get() {
		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( [ 'foo' => 'bar' ] );

		Monkey\Filters\expectApplied( 'wpseo_network_admin_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->assertEquals( 'bar', $this->instance->foo );
	}

	/**
	 * Tests the magic set' happy path.
	 *
	 * @covers ::__set
	 * @covers ::update_option
	 * @covers ::update_wp_options
	 */
	public function test_set() {
		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( [ 'access' => 'admin' ] );

		Monkey\Filters\expectApplied( 'wpseo_network_admin_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with(
				'superadmin',
				[
					'in_array' => [
						'allow' => [
							'admin',
							'superadmin',
						],
					],
				]
			)
			->andReturn( 'superadmin' );

		Monkey\Functions\expect( 'update_site_option' )->andReturn( true );

		$this->instance->access = 'superadmin';
	}

	/**
	 * Tests the magic set' with "database failure".
	 *
	 * @covers ::__set
	 * @covers ::update_wp_options
	 */
	public function test_set_failed() {
		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( [ 'access' => 'admin' ] );

		Monkey\Filters\expectApplied( 'wpseo_network_admin_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		$this->validation_helper
			->expects( 'validate_as' )
			->once()
			->with(
				'superadmin',
				[
					'in_array' => [
						'allow' => [
							'admin',
							'superadmin',
						],
					],
				]
			)
			->andReturn( 'superadmin' );

		Monkey\Functions\expect( 'update_site_option' )->andReturn( false );

		$this->expectException( Save_Failed_Exception::class );
		$this->expectExceptionMessage(
			Save_Failed_Exception::for_option( 'wpseo_network_admin_options' )->getMessage()
		);

		$this->instance->access = 'superadmin';
	}

	/**
	 * Tests that reset options deletes all and then saves.
	 *
	 * @covers ::reset_options
	 * @covers ::delete_wp_options
	 * @covers ::update_wp_options
	 */
	public function test_reset_options() {
		Monkey\Filters\expectApplied( 'wpseo_network_admin_options_additional_configurations' )
			->once()
			->andReturnFirstArg();

		Monkey\Functions\expect( 'delete_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( true );

		Monkey\Functions\expect( 'update_site_option' )
			->once()
			->withAnyArgs()
			->andReturn( true );

		$this->instance->reset_options();
	}

	/**
	 * Tests that reset options, deletion failed.
	 *
	 * @covers ::reset_options
	 * @covers ::delete_wp_options
	 * @covers ::update_wp_options
	 */
	public function test_reset_options_delete_failure() {
		Monkey\Functions\expect( 'delete_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( false );

		Monkey\Functions\expect( 'update_site_option' )->never();

		$this->expectException( Delete_Failed_Exception::class );
		$this->expectExceptionMessage(
			Delete_Failed_Exception::for_option( 'wpseo_network_admin_options' )->getMessage()
		);

		$this->instance->reset_options();
	}

	/**
	 * Tests that configurations can be added.
	 *
	 * @covers ::get_configurations
	 * @covers ::get_additional_configurations
	 * @covers \Yoast\WP\SEO\Services\Options\Abstract_Options_Service::get_additional_configurations
	 * @covers ::is_valid_configuration
	 */
	public function test_get_configurations_additional() {
		Monkey\Filters\expectApplied( 'wpseo_network_admin_options_additional_configurations' )
			->once()
			->andReturn(
				[
					'test' => [
						'default' => '',
						'types'   => [],
					],
				]
			);

		$this->assertArrayHasKey( 'test', $this->instance->get_configurations() );
	}

	/**
	 * Tests that options can be reset for a blog.
	 *
	 * @covers ::reset_options_for
	 */
	public function test_reset_options_for() {
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->andReturn( 1 );

		Monkey\Functions\expect( 'delete_blog_option' )
			->once()
			->with( 1, 'wpseo_options' )
			->andReturn( true );

		$this->multisite_options_service->expects( 'get_defaults' )->once()->andReturn( [] );

		Monkey\Functions\expect( 'update_blog_option' )
			->once()
			->with( 1, 'wpseo_options', [ 'ms_defaults_set' => true ] )
			->andReturn( true );

		$this->instance->reset_options_for( 1 );
	}

	/**
	 * Tests that options can be reset for a blog, using the default blog.
	 *
	 * @covers ::reset_options_for
	 */
	public function test_reset_options_for_default_blog() {
		$blog_id      = 1;
		$default_blog = 2;

		Monkey\Functions\expect( 'get_site_option' )
			->once()
			->with( 'wpseo_network_admin_options' )
			->andReturn( [ 'defaultblog' => $default_blog ] );

		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->andReturn( 1 );

		Monkey\Functions\expect( 'delete_blog_option' )
			->once()
			->with( $blog_id, 'wpseo_options' )
			->andReturn( true );

		// Note the $default_blog blog ID here, which is the `defaultblog` value from the `wpseo_network_admin_options`.
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->with( $default_blog, 'wpseo_options' )
			->andReturn( [ 'secret' => 'will be reset to default' ] );

		$this->multisite_options_service->expects( 'get_configurations' )
			->once()
			->andReturn(
				[
					'secret' => [
						'default'    => '',
						'types'      => [ 'text_field' ],
						'ms_exclude' => true,
					],
				]
			);

		Monkey\Functions\expect( 'update_blog_option' )
			->once()
			->with(
				$blog_id,
				'wpseo_options',
				[
					'secret'          => '',
					'ms_defaults_set' => true,
				]
			)
			->andReturn( true );

		$this->instance->reset_options_for( $blog_id );
	}

	/**
	 * Tests that an exception is thrown when delete fails.
	 *
	 * @covers ::reset_options_for
	 */
	public function test_reset_options_for_delete_failed() {
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->andReturn( 1 );

		Monkey\Functions\expect( 'delete_blog_option' )
			->once()
			->with( 1, 'wpseo_options' )
			->andReturn( false );

		$this->expectException( Delete_Failed_Exception::class );
		$this->expectExceptionMessage( Delete_Failed_Exception::for_option( 'wpseo_options' )->getMessage() );

		Monkey\Functions\expect( 'update_blog_option' )
			->never();

		$this->instance->reset_options_for( 1 );
	}

	/**
	 * Tests that an exception is thrown when update fails.
	 *
	 * @covers ::reset_options_for
	 */
	public function test_reset_options_for_update_failed() {
		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->andReturn( 1 );

		Monkey\Functions\expect( 'delete_blog_option' )
			->once()
			->with( 1, 'wpseo_options' )
			->andReturn( true );

		$this->multisite_options_service->expects( 'get_defaults' )->once()->andReturn( [] );

		Monkey\Functions\expect( 'update_blog_option' )
			->once()
			->with( 1, 'wpseo_options', [ 'ms_defaults_set' => true ] )
			->andReturn( false );

		$this->expectException( Save_Failed_Exception::class );
		$this->expectExceptionMessage( Save_Failed_Exception::for_option( 'wpseo_options' )->getMessage() );

		$this->instance->reset_options_for( 1 );
	}

	/**
	 * Tests that the current blog is reset.
	 *
	 * @covers ::maybe_reset_current_blog_options
	 */
	public function test_maybe_reset_current_blog_options() {
		$current_blog_id = 3;

		$this->multisite_options_service->expects( 'get_defaults' )->twice()->andReturn( [] );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( $current_blog_id );

		Monkey\Functions\expect( 'get_blog_option' )
			->once()
			->andReturn( 1 );

		Monkey\Functions\expect( 'delete_blog_option' )
			->once()
			->with( $current_blog_id, 'wpseo_options' )
			->andReturn( true );

		Monkey\Functions\expect( 'update_blog_option' )
			->once()
			->with( $current_blog_id, 'wpseo_options', [ 'ms_defaults_set' => true ] )
			->andReturn( true );

		$this->assertTrue( $this->instance->maybe_reset_current_blog_options() );
	}

	/**
	 * Tests that the current blog is not reset when `ms_defaults_set` is true.
	 *
	 * @covers ::maybe_reset_current_blog_options
	 */
	public function test_maybe_reset_current_blog_options_already_set() {
		$this->multisite_options_service->expects( 'get_defaults' )
			->once()
			->andReturn( [ 'ms_defaults_set' => true ] );

		Monkey\Functions\expect( 'get_current_blog_id' )->never();
		Monkey\Functions\expect( 'delete_blog_option' )->never();
		Monkey\Functions\expect( 'update_blog_option' )->never();

		$this->assertFalse( $this->instance->maybe_reset_current_blog_options() );
	}
}
