<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Debug\Marker_Close_Presenter;
use Yoast\WP\Free\Helpers\Product_Helper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Marker_Close_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Debug\Marker_Close_Presenter
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
		$product_helper_mock = Mockery::mock( Product_Helper::class );
		$product_helper_mock->expects( 'get_name' )->andReturn( 'Yoast SEO plugin' );

		$instance     = new Marker_Close_Presenter( $product_helper_mock );
		$presentation = new Indexable_Presentation();

		$this->assertEquals(
			'<!-- / Yoast SEO plugin. -->' . PHP_EOL . PHP_EOL,
			$instance->present( $presentation )
		);
	}

}
