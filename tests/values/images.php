<?php

namespace Yoast\WP\Free\Tests\Values;

use Mockery;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Tests\TestCase;
use Yoast\WP\Free\Values\Images;

/**
 * Class OG_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Values\Images
 *
 * @group values
 */
class Images_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Images|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Url_Helper|Mockery\Mock
	 */
	protected $url_helper;

	/**
	 * Setup the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->image_helper = Mockery::mock( Image_Helper::class )->makePartial();
		$this->url_helper   = Mockery::mock( Url_Helper::class )->makePartial();
		$this->instance     = Mockery::mock( Images::class, [ $this->image_helper, $this->url_helper ] );
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
	 * Tests adding an image with a boolean given as value.
	 *
	 * @covers ::add_image
	 * @covers::has_images
	 * @covers ::get_images
	 */
	public function test_add_image_that_is_added_before() {
		$image = [
			'url' => 'image.jpg',
		];

		$this->instance->add_image( $image );
		$this->instance->add_image( [
			'url'    => 'image.jpg',
			'width'  => '100',
			'height' => '100',
		] );


		$this->assertTrue( $this->instance->has_images() );
		$this->assertEquals(
			[
				'image.jpg' => $image,
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
		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturn( 1337 );

		$this->instance
			->expects( 'get_image_url_by_id' )
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
		$this->image_helper
			->expects( 'get_attachment_by_url' )
			->once()
			->with( 'image.jpg' )
			->andReturnFalse();

		$this->assertEquals( -1, $this->instance->add_image_by_url( 'image.jpg' ) );
	}
}
