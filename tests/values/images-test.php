<?php

namespace Yoast\WP\SEO\Tests\Values;

use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\Images;

/**
 * Class Images_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Values\Images
 *
 * @group values
 */
class Images_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * @var Images|Mockery\MockInterface
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

		$this->image    = Mockery::mock( Image_Helper::class );
		$this->url      = Mockery::mock( Url_Helper::class );
		$this->instance = Mockery::mock( Images::class, [ $this->image, $this->url ] );
	}

	/**
	 * Tests adding an image.
	 *
	 * @covers ::add_image
	 */
	public function test_add_image() {
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
	 */
	public function test_add_image_with_string_given() {
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
	 */
	public function test_add_image_that_is_added_before() {
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
	 */
	public function test_add_image_by_url_with_empty_url_given() {
		$this->assertNull( $this->instance->add_image_by_url( false ) );
	}

	/**
	 * Tests adding an image by url with url given as value.
	 *
	 * @covers ::add_image_by_url
	 */
	public function test_add_image_by_url() {
		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturn( 1337 );

		$this->instance
			->expects( 'get_image_by_id' )
			->once()
			->with( 1337 )
			->andReturn( 'image.jpg' );

		$this->assertEquals( 1337, $this->instance->add_image_by_url( 'image.jpg' ) );
	}

	/**
	 * Tests adding an image by url with empty url givne as value.
	 *
	 * @covers ::add_image_by_url
	 */
	public function test_add_image_by_url_with_no_attachment_found() {
		$this->image
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturnFalse();

		$this->assertEquals( -1, $this->instance->add_image_by_url( 'image.jpg' ) );
	}

	/**
	 * Test adding an image by id.
	 *
	 * @covers ::add_image_by_id
	 */
	public function test_add_image_by_id() {
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
		$this->image
			->expects( 'get_attachment_image_src' )
			->once()
			->with( 1337, 'full' )
			->andReturnFalse();

		$this->instance->add_image_by_id( 1337 );

		$this->assertEquals( [], $this->instance->get_images() );
	}
}
