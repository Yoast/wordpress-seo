<?php

namespace Yoast\WP\Free\Tests\Values\Twitter;

use Mockery;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Tests\TestCase;
use Yoast\WP\Free\Values\Twitter\Images;

/**
 * Class OG_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Values\Twitter\Images
 *
 * @group values
 * @group twitter
 * @group twitter-image
 */
class Images_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Twitter_Image_Helper
	 */
	protected $twitter_image;

	/**
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * @var Images
	 */
	protected $instance;

	/**
	 * @var Url_Helper|Mockery\Mock
	 */
	protected $url;

	/**
	 * Setup the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->image         = Mockery::mock( Image_Helper::class )->makePartial();
		$this->url           = Mockery::mock( Url_Helper::class )->makePartial();
		$this->twitter_image = Mockery::mock( Twitter_Image_Helper::class )->makePartial();

		$this->instance      = new Images( $this->image, $this->url );
		$this->instance->set_helpers( $this->twitter_image );
	}

	/**
	 * Test adding an image by id.
	 *
	 * @covers ::add_image_by_id
	 */
	public function test_add_image_by_id() {

		$this->twitter_image
			->expects( 'get_image_size' )
			->once()
			->andReturn( 'full' );

		$this->image
			->expects( 'get_attachment_image_src' )
			->once()
			->with( 1337, 'full' )
			->andReturn( 'image.jpg' );


		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals(
			[
				'image.jpg' => [
					'url' => 'image.jpg',
				],
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Test adding an image by id with no image being found.
	 *
	 * @covers ::add_image_by_id
	 */
	public function test_add_image_by_id_no_image_found() {
		$this->twitter_image
			->expects( 'get_image_size' )
			->once()
			->andReturn( 'full' );

		$this->image
			->expects( 'get_attachment_image_src' )
			->once()
			->with( 1337, 'full' )
			->andReturnFalse();

		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals( [], $this->instance->get_images() );
	}

}
