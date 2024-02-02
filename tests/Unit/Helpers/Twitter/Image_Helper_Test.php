<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Twitter;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper as Base_Image_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Twitter\Image_Helper
 *
 * @group helpers
 */
final class Image_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Image_Helper( Mockery::mock( Base_Image_Helper::class ) );
	}

	/**
	 * Tests retrieval image size.
	 *
	 * @covers ::get_image_size
	 *
	 * @return void
	 */
	public function test_get_image_size() {
		Monkey\Filters\expectApplied( 'wpseo_twitter_image_size' )
			->with( 'full' )
			->once()
			->andReturn( 'full' );

		$this->assertEquals( 'full', $this->instance->get_image_size() );
	}
}
