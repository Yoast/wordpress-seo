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
	 * Represents the base image helper.
	 *
	 * @var Base_Image_Helper
	 */
	protected $image;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image = Mockery::mock( Base_Image_Helper::class )->makePartial();

		$this->instance = new Image_Helper( $this->image );
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

	/**
	 * Tests retrieval of an image by its id.
	 *
	 * @covers ::get_by_id
	 * @dataProvider get_by_id_data_provider
	 *
	 * @param bool   $is_valid Whether the attachment is valid.
	 * @param string $expected The expected result.
	 * @param int    $times    The number of times get_attachment_image_source should be called.
	 *
	 * @return void
	 */
	public function test_get_by_id( $is_valid, $expected, $times ) {
		$this->image
			->expects( 'is_valid_attachment' )
			->with( 1337 )
			->once()
			->andReturn( $is_valid );

		$this->image
			->expects( 'get_attachment_image_source' )
			->times( $times )
			->andReturn( $expected );

		$this->assertEquals( $expected, $this->instance->get_by_id( 1337 ) );
	}

	/**
	 * Data provider for the test_get_by_id test.
	 *
	 * @return array<string,bool|string|int> The data for the test.
	 */
	public static function get_by_id_data_provider() {
			yield 'invalid attachment' => [ false, '', 0 ];
			yield 'valid attachment' => [ true, 'image.jpg', 1 ];
	}
}
