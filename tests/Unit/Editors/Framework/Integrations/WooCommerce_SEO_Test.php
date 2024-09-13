<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Integrations;

use Brain\Monkey;
use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\Editors\Framework\Integrations\WooCommerce_SEO;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class WooCommerce_SEO_Test
 *
 * @group editors
 *
 * @covers \Yoast\WP\SEO\Editors\Framework\Integrations\WooCommerce_SEO
 */
final class WooCommerce_SEO_Test extends TestCase {

	/**
	 * Holds the WPSEO_Addon_Manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * The WooCommerce_SEO feature.
	 *
	 * @var WooCommerce_SEO
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->addon_manager = Mockery::mock( WPSEO_Addon_Manager::class );
		$this->instance      = new WooCommerce_SEO( $this->addon_manager );
	}

	/**
	 * Tests the is_enabled method.
	 *
	 * @dataProvider data_provider_is_enabled
	 *
	 * @param bool $woocommerce_seo_enabled If the woocommerce plugin is enabled.
	 * @param bool $expected                The expected outcome.
	 *
	 * @return void
	 */
	public function test_is_enabled(
		bool $woocommerce_seo_enabled,
		bool $expected
	) {

		$this->addon_manager
			->expects( 'get_plugin_file' )
			->times( 3 )
			->with( 'yoast-seo-woocommerce' )
			->andReturn( 'wpseo-woocommerce/wpseo-woocommerce.php' );

		Monkey\Functions\expect( 'is_plugin_active' )
			->times( 3 )
			->with( 'wpseo-woocommerce/wpseo-woocommerce.php' )
			->andReturn( $woocommerce_seo_enabled );

		$is_woo_seo_active = $this->instance->is_enabled();

		$this->assertSame( $expected, $is_woo_seo_active );
		$this->assertSame( [ 'isWooCommerceSeoActive' => $is_woo_seo_active ], $this->instance->to_legacy_array() );
		$this->assertSame( [ 'isWooCommerceSeoActive' => $is_woo_seo_active ], $this->instance->to_array() );
	}

	/**
	 * Data provider for test_is_enabled.
	 *
	 * @return array<array<string,bool>>
	 */
	public static function data_provider_is_enabled() {
		return [
			'Enabled' => [
				'woocommerce_seo_enabled' => true,
				'expected'                => true,
			],
			'Disabled' => [
				'woocommerce_seo_enabled' => false,
				'expected'                => false,
			],
		];
	}
}
