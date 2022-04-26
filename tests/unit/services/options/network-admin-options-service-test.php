<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Exceptions\Option\Delete_Failed_Exception;
use Yoast\WP\SEO\Exceptions\Option\Save_Failed_Exception;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Validation_Helper;
use Yoast\WP\SEO\Services\Options\Network_Admin_Options_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Network_Admin_Options_Service class.
 *
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
	 * @var Network_Admin_Options_Service|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Holds the validation helper instance.
	 *
	 * @var Validation_Helper|Mockery\Mock
	 */
	protected $validation_helper;

	/**
	 * Holds the post type helper instance.
	 *
	 * @var Post_Type_Helper|Mockery\Mock
	 */
	protected $post_type_helper;

	/**
	 * Holds the taxonomy helper instance.
	 *
	 * @var Taxonomy_Helper|Mockery\Mock
	 */
	protected $taxonomy_helper;

	/**
	 * Sets up the test fixtures.
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->validation_helper = Mockery::mock( Validation_Helper::class );
		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );
		$this->taxonomy_helper   = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = new Network_Admin_Options_Service( $this->validation_helper, $this->post_type_helper, $this->taxonomy_helper );
	}

	/**
	 * Tests the attributes after constructing.
	 *
	 * @covers ::__construct
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
			->with( [] )
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->once()->andReturn( [] );

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
			->with( [] )
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->once()->andReturn( [] );

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
			->with( [] )
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->once()->andReturn( [] );

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
			->with( [] )
			->andReturn( [] );

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->once()->andReturn( [] );

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
			->with( [] )
			->andReturn(
				[
					'test' => [
						'default' => '',
						'types'   => [],
					],
				]
			);

		$this->post_type_helper->expects( 'get_public_post_types' )->once()->andReturn( [] );
		$this->taxonomy_helper->expects( 'get_public_taxonomies' )->once()->andReturn( [] );

		$this->assertArrayHasKey( 'test', $this->instance->get_configurations() );
	}
}
