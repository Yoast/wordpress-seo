<?php

namespace Yoast\WP\SEO\Tests\Unit\Values;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Images;

/**
 * Class Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\Images
 *
 * @group values
 */
final class Images_Test extends TestCase {

	/**
	 * Represents the image helper.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * Represents the class to test.
	 *
	 * @var Images
	 */
	protected $instance;

	/**
	 * Represents the url helper.
	 *
	 * @var Url_Helper|Mockery\Mock
	 */
	protected $url;

	/**
	 * Setup the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->image    = Mockery::mock( Image_Helper::class );
		$this->url      = Mockery::mock( Url_Helper::class );
		$this->instance = new Images( $this->image, $this->url );
	}

	/**
	 * Tests adding an image.
	 *
	 * @covers ::add_image
	 *
	 * @return void
	 */
	public function test_add_image() {
		$this->url
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

		$image = [
			'url' => 'image.jpg',
		];

		$this->instance->add_image( $image );

		$this->assertEquals(
			[
				'image.jpg' => $image,
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Tests adding an image with string given as value.
	 *
	 * @covers ::add_image
	 *
	 * @return void
	 */
	public function test_add_image_with_string_given() {
		$this->url
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

		$image = 'image.jpg';

		$this->instance->add_image( $image );

		$this->assertEquals(
			[
				'image.jpg' => [
					'url' => $image,
				],
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Tests adding an image with a boolean given as value.
	 *
	 * @covers ::add_image
	 * @covers ::has_images
	 * @covers ::get_images
	 *
	 * @return void
	 */
	public function test_add_image_with_boolean_given() {
		$this->instance->add_image( false );

		$this->assertFalse( $this->instance->has_images() );
		$this->assertEmpty( $this->instance->get_images() );
	}

	/**
	 * Tests that a second image being added with the same name doesn't overwrite the first.
	 *
	 * @covers ::add_image
	 * @covers ::has_images
	 * @covers ::get_images
	 *
	 * @return void
	 */
	public function test_add_image_that_is_added_before() {
		$this->url
			->expects( 'is_relative' )
			->twice()
			->andReturnFalse();

		$image1 = [
			'url' => 'image.jpg',
		];
		$image2 = [
			'url'    => 'image.jpg',
			'width'  => '100',
			'height' => '100',
		];

		$this->instance->add_image( $image1 );
		$this->instance->add_image( $image2 );

		$this->assertTrue( $this->instance->has_images() );
		$this->assertEquals(
			[
				'image.jpg' => $image1,
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Tests adding an image by url with empty url given as value.
	 *
	 * @covers ::add_image_by_url
	 *
	 * @return void
	 */
	public function test_add_image_by_url_with_empty_url_given() {
		$this->assertNull( $this->instance->add_image_by_url( false ) );
	}

	/**
	 * Tests adding an image by url with url given as value.
	 *
	 * @covers ::add_image_by_url
	 *
	 * @return void
	 */
	public function test_add_image_by_url() {
		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturn( 1337 );

		$this->image
			->expects( 'get_attachment_image_source' )
			->once()
			->andReturn( 'image.jpg' );

		$this->url
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

		$this->assertEquals( 1337, $this->instance->add_image_by_url( 'image.jpg' ) );
	}

	/**
	 * Tests adding an image by url with empty url given as value.
	 *
	 * @covers ::add_image_by_url
	 *
	 * @return void
	 */
	public function test_add_image_by_url_with_no_attachment_found() {
		$this->assertEquals( null, $this->instance->add_image_by_url( '' ) );
	}

	/**
	 * Tests adding an image by url when the url is given but the image id is not.
	 *
	 * @covers ::add_image_by_url
	 * @covers ::add_image
	 *
	 * @return void
	 */
	public function test_add_image_by_url_with_no_image_id() {
		$this->url
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

		$image = [
			'url' => 'image.jpg',
		];

		$this->instance->add_image( $image );

		$this->assertEquals(
			[
				'image.jpg' => $image,
			],
			$this->instance->get_images()
		);
	}

	/**
	 * Test adding an image by id.
	 *
	 * @covers ::add_image_by_id
	 *
	 * @return void
	 */
	public function test_add_image_by_id() {
		$this->image
			->expects( 'get_attachment_image_source' )
			->once()
			->with( 1337, 'full' )
			->andReturn( 'image.jpg' );

		$this->url
			->expects( 'is_relative' )
			->once()
			->andReturnFalse();

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
	 *
	 * @return void
	 */
	public function test_add_image_by_id_no_image_found() {
		$this->image
			->expects( 'get_attachment_image_source' )
			->once()
			->with( 1337, 'full' )
			->andReturnFalse();

		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals( [], $this->instance->get_images() );
	}
}
