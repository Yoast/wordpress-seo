<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\SEO\Tests\Presenters;

use Mockery;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
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
		$product_mock = Mockery::mock( Product_Helper::class );
		$product_mock->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );

		$instance     = new Marker_Close_Presenter( $product_mock );
		$presentation = new Indexable_Presentation();

		$this->assertEquals(
			'<!-- / Yoast SEO plugin. -->' . PHP_EOL . PHP_EOL,
			$instance->present( $presentation )
		);
	}

}
