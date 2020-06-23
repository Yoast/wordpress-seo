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
use Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Marker_Open_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Debug\Marker_Open_Presenter
 *
 * @group presenters
 * @group debug
 */
class Marker_Open_Presenter_Test extends TestCase {

	/**
	 * Tests the presentation of the open debug marker.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$product_mock = Mockery::mock( Product_Helper::class );
		$product_mock->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );

		$instance          = new Marker_Open_Presenter();
		$instance->helpers = (object) [
			'product' => $product_mock,
		];

		$this->assertEquals(
			'<!-- This site is optimized with the Yoast SEO plugin v' . \WPSEO_VERSION . ' - https://yoast.com/wordpress/plugins/seo/ -->',
			$instance->present()
		);
	}

	/**
	 * Tests the presentation of the close debug marker.
	 *
	 * @covers ::present
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
	 */
	public function test_get() {
		$instance = new Marker_Open_Presenter();

		$this->assertSame( '', $instance->get() );
	}
}
