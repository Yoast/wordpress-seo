<?php

namespace Yoast\WP\SEO\Tests\Unit\Admin;

use Brain\Monkey;
use Mockery;
use WPSEO_Plugin_Availability;
use Yoast\WP\SEO\Conditionals\WooCommerce_Conditional;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Test class for WPSEO_Plugin_Availability.
 *
 * @covers WPSEO_Plugin_Availability
 */
final class Plugin_Availability_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		if ( ! \defined( 'WP_PLUGIN_DIR' ) ) {
			\define( 'WP_PLUGIN_DIR', '/' );
		}
		$this->stubTranslationFunctions();
		$this->instance = new WPSEO_Plugin_Availability();
	}

	/**
	 * Tests to make sure the get_plugins is consistent.
	 *
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins_status
	 * @covers WPSEO_Plugin_Availability::has_dependencies
	 * @covers WPSEO_Plugin_Availability::get_plugins_with_dependencies
	 * @return void
	 */
	public function test_get_plugins_with_dependencies() {

		$short_link = Mockery::mock( Short_Link_Helper::class );
		$short_link->expects( 'get' )->times( 5 )->andReturn( 'https://www.example.com?some=var' );
		$container = $this->create_container_with(
			[
				Short_Link_Helper::class => $short_link,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$this->instance->register();
		$this->assertEquals(
			[
				'yoast-woocommerce-seo' => [
					'url'           => 'https://www.example.com?some=var',
					'title'         => 'Yoast WooCommerce SEO',
					'description'   => 'Seamlessly integrate WooCommerce with Yoast SEO and get extra features!',
					'_dependencies' => [
						'WooCommerce' => [
							'slug'        => 'woocommerce/woocommerce.php',
							'conditional' => new WooCommerce_Conditional(),
						],
					],
					'installed'     => false,
					'slug'          => 'wpseo-woocommerce/wpseo-woocommerce.php',
					'version_sync'  => true,
					'premium'       => true,
				],
			],
			$this->instance->get_plugins_with_dependencies()
		);
	}

	/**
	 * Tests to make sure the get_plugins is consistent.
	 *
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins_status
	 * @covers WPSEO_Plugin_Availability::has_dependencies
	 * @covers WPSEO_Plugin_Availability::get_dependencies
	 * @return void
	 */
	public function test_get_dependencies() {
		$short_link = Mockery::mock( Short_Link_Helper::class );
		$short_link->expects( 'get' )->times( 5 )->andReturn( 'https://www.example.com?some=var' );
		$container = $this->create_container_with(
			[
				Short_Link_Helper::class => $short_link,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$plugin = [
			'url'           => 'https://www.example.com?some=var',
			'title'         => 'Yoast WooCommerce SEO',
			'description'   => 'Seamlessly integrate WooCommerce with Yoast SEO and get extra features!',
			'_dependencies' => [
				'WooCommerce' => [
					'slug'        => 'woocommerce/woocommerce.php',
					'conditional' => new WooCommerce_Conditional(),
				],
			],
			'installed'     => false,
			'slug'          => 'wpseo-woocommerce/wpseo-woocommerce.php',
			'version_sync'  => true,
			'premium'       => true,
		];

		$this->instance->register();
		$this->assertEquals( $plugin['_dependencies'], $this->instance->get_dependencies( $plugin ) );
	}

	/**
	 * Tests to make sure the get_plugins is consistent.
	 *
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins
	 * @covers WPSEO_Plugin_Availability::register_yoast_plugins_status
	 * @covers WPSEO_Plugin_Availability::has_dependencies
	 * @covers WPSEO_Plugin_Availability::get_dependencies
	 * @return void
	 */
	public function test_dependencies_are_satisfied() {
		$short_link = Mockery::mock( Short_Link_Helper::class );
		$short_link->expects( 'get' )->times( 5 )->andReturn( 'https://www.example.com?some=var' );
		$container = $this->create_container_with(
			[
				Short_Link_Helper::class => $short_link,
			]
		);

		Monkey\Functions\expect( 'YoastSEO' )
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$plugin = [
			'url'           => 'https://www.example.com?some=var',
			'title'         => 'Yoast WooCommerce SEO',
			'description'   => 'Seamlessly integrate WooCommerce with Yoast SEO and get extra features!',
			'_dependencies' => [
				'WooCommerce' => [
					'slug'        => 'woocommerce/woocommerce.php',
					'conditional' => new WooCommerce_Conditional(),
				],
			],
			'installed'     => false,
			'slug'          => 'wpseo-woocommerce/wpseo-woocommerce.php',
			'version_sync'  => true,
			'premium'       => true,
		];

		$this->instance->register();
		$this->assertFalse( $this->instance->dependencies_are_satisfied( $plugin ) );
	}
}
