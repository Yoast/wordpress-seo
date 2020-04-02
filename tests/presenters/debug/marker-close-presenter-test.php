<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Yoast\WP\SEO\Presenters\Debug\Marker_Close_Presenter;
use Yoast\WP\SEO\Helpers\Product_Helper;
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
	 * @covers ::__construct
	 * @covers ::present
	 */
	public function test_present() {
		$product = Mockery::mock( Product_Helper::class );
		$product->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );

		$instance = new Marker_Close_Presenter();
		$instance->helpers = (object) [
			'product' => $product,
		];

		$this->assertEquals(
			'<!-- / Yoast SEO plugin. -->' . PHP_EOL . PHP_EOL,
			$instance->present()
		);
	}

}
