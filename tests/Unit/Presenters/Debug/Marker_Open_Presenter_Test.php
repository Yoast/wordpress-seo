<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Debug;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Marker_Open_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter
 *
 * @group presenters
 * @group debug
 */
final class Marker_Open_Presenter_Test extends TestCase {

	/**
	 * Tests the presentation of the open debug marker.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present() {
		$this->stubEscapeFunctions();

		$product_mock = Mockery::mock( Product_Helper::class );
		$product_mock->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );
		$product_mock->expects( 'is_premium' )->andReturn( false );

		$instance          = new Marker_Open_Presenter();
		$instance->helpers = (object) [
			'product' => $product_mock,
		];

		$this->assertEquals(
			'<!-- This site is optimized with the Yoast SEO plugin v' . \WPSEO_VERSION . ' - https://yoast.com/product/yoast-seo-wordpress/ -->',
			$instance->present()
		);
	}

	/**
	 * Tests the presentation of the close debug marker.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_disabled_by_filter() {
		$product_mock = Mockery::mock( Product_Helper::class );
		$product_mock->expects( 'get_name' )->never();

		Monkey\Filters\expectApplied( 'wpseo_debug_markers' )->andReturn( false );

		$instance          = new Marker_Open_Presenter();
		$instance->helpers = (object) [
			'product' => $product_mock,
		];

		$this->assertEquals(
			'',
			$instance->present()
		);
	}

	/**
	 * Tests the get method.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$instance = new Marker_Open_Presenter();

		$this->assertSame( '', $instance->get() );
	}

	/**
	 * Tests the presentation of the open debug marker for premium version.
	 *
	 * @covers ::present
	 * @covers ::construct_version_info
	 *
	 * @return void
	 */
	public function test_present_premium() {
		// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedConstantFound -- Intended use for testing.
		if ( ! \defined( 'WPSEO_PREMIUM_VERSION' ) ) {
			\define( 'WPSEO_PREMIUM_VERSION', '2.0' );
		}

		$this->stubEscapeFunctions();

		Monkey\Filters\expectApplied( 'wpseo_hide_version' )->andReturn( false );

		$product_mock = Mockery::mock( Product_Helper::class );
		$product_mock->expects( 'get_name' )->andReturn( 'Yoast SEO Premium' );
		$product_mock->expects( 'is_premium' )->andReturn( true );

		$instance          = new Marker_Open_Presenter();
		$instance->helpers = (object) [
			'product' => $product_mock,
		];

		$expected_version = 'v' . \WPSEO_PREMIUM_VERSION . ' (Yoast SEO v' . \WPSEO_VERSION . ')';
		$this->assertEquals(
			'<!-- This site is optimized with the Yoast SEO Premium ' . $expected_version . ' - https://yoast.com/product/yoast-seo-premium-wordpress/ -->',
			$instance->present()
		);
	}
}
