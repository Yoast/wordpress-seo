<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Presenters
 */

namespace Yoast\WP\SEO\Tests\Presenters\Debug;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Marker_Close_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter
 *
 * @group presenters
 * @group debug
 */
class Marker_Close_Presenter_Test extends TestCase {

	/**
	 * Tests the presentation of the close debug marker.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$product = Mockery::mock( Product_Helper::class );
		$product->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );

		Monkey\Filters\expectApplied( 'wpseo_debug_markers' )->andReturn( true );

		$instance          = new Marker_Close_Presenter();
		$instance->helpers = (object) [
			'product' => $product,
		];

		$this->assertEquals(
			'<!-- / Yoast SEO plugin. -->',
			$instance->present()
		);
	}

	/**
	 * Tests the presentation of the close debug marker.
	 *
	 * @covers ::present
	 */
	public function test_present_disabled_by_filter() {
		$product = Mockery::mock( Product_Helper::class );
		$product->expects( 'get_name' )->never();

		Monkey\Filters\expectApplied( 'wpseo_debug_markers' )->andReturn( false );

		$instance          = new Marker_Close_Presenter();
		$instance->helpers = (object) [
			'product' => $product,
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
	 */
	public function test_get() {
		$instance = new Marker_Close_Presenter();

		$this->assertSame( '', $instance->get() );
	}
}
