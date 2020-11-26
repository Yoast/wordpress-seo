<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Twitter;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Twitter\Image_Helper
 *
 * @group helpers
 */
class Image_Helper_Test extends TestCase {

	/**
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Setup.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Image_Helper::class )->makePartial();
	}

	/**
	 * Tests retrieval image size.
	 *
	 * @covers ::get_image_size
	 */
	public function test_get_image_size() {
		Monkey\Functions\expect( 'apply_filters' )
			->with( 'wpseo_twitter_image_size', 'full' )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'full', $this->instance->get_image_size() );
	}
}
