<?php

namespace Yoast\WP\SEO\Tests\Frontend\Schema;

use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;
use WPSEO_Schema_Image;
use Mockery;

/**
 * Class WPSEO_Schema_HowTo_Test.
 *
 * @group schema
 *
 * @package Yoast\Tests\Frontend\Schema
 */
class Schema_Image_Test extends TestCase {

	/**
	 * The `@id` to use for the image schema.
	 *
	 * @var string
	 */
	const IMAGE_ID = 'https://example.com/#media-123';

	/**
	 * The WPSEO_Schema_Image instance used for testing.
	 *
	 * @var \WPSEO_Schema_Image
	 */
	private $instance;

	/**
	 * Test setup.
	 */
	public function setUp() {
		parent::setUp();

		Monkey\Functions\stubs(
			[
				'get_site_url'                => 'https://www.example.com',
				'wp_cache_get'                => 123,
				'attachment_url_to_postid'    => 123,
				'wp_cache_set'                => true,
				'wp_get_attachment_image_url' => 'https://www.example.com/media/image.png',
				'wp_get_attachment_caption'   => 'image caption',
			]
		);

		$this->instance = Mockery::mock( WPSEO_Schema_Image::class, [ self::IMAGE_ID ] )->makePartial();
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_url for an internal URL.
	 *
	 * Important is that the `-200x200` part in the image URL is removed.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_url
	 * @covers WPSEO_Schema_Image::add_image_size
	 * @covers WPSEO_Schema_Image::add_caption
	 * @covers WPSEO_Image_Utils::get_attachment_by_url
	 * @covers WPSEO_Image_Utils::attachment_url_to_postid
	 */
	public function test_generate_from_url_internal() {
		Monkey\Functions\stubs(
			[
				'wp_get_attachment_metadata' => [],
			]
		);

		$image_schema = $this->instance->generate_from_url( 'https://www.example.com/media/image-200x200.jpg' );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'image caption',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_url for an internal URL with image metadata containing the image's width
	 * and height.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_url
	 * @covers WPSEO_Schema_Image::add_image_size
	 */
	public function test_generate_from_url_internal_with_image_size() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 123 )
			->andReturn(
				[
					'height' => 120,
					'width'  => 100,
				]
			);

		$image_schema = $this->instance->generate_from_url( 'https://www.example.com/media/image-200x200.jpg' );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'image caption',
			'height'     => 120,
			'width'      => 100,
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_url for an external URL.
	 *
	 * Important is that the `-200x200` part in the image URL is NOT removed.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_url
	 * @covers WPSEO_Schema_Image::simple_image_object
	 * @covers WPSEO_Image_Utils::get_attachment_by_url
	 */
	public function test_generate_from_url_external() {
		// When the image is from an external URL, wp_get_attachment_metadata should never be called.
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->never();

		$image_schema = $this->instance->generate_from_url( 'https://www.external.com/media/image-200x200.png' );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.external.com/media/image-200x200.png',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_attachment_id for an internal URL.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_attachment_id
	 * @covers WPSEO_Schema_Image::add_caption
	 */
	public function test_generate_from_attachment_id() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 123 )
			->andReturn( [] );

		$image_schema = $this->instance->generate_from_attachment_id( 123 );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'image caption',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_attachment_id for an internal URL, for which no attachment caption is
	 * available but and image alt caption is.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_attachment_id
	 * @covers WPSEO_Schema_Image::add_caption
	 */
	public function test_generate_from_attachment_id_image_alt_caption() {
		Monkey\Functions\stubs(
			[
				'wp_get_attachment_metadata' => [],
				'wp_get_attachment_caption'  => '',
			]
		);

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 123, '_wp_attachment_image_alt', true )
			->once()
			->andReturn( 'Image alt caption' );

		$image_schema = $this->instance->generate_from_attachment_id( 123 );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'Image alt caption',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_attachment_id for an internal URL, for which a custom caption is
	 * provided.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_attachment_id
	 * @covers WPSEO_Schema_Image::add_caption
	 */
	public function test_generate_from_attachment_id_with_passed_caption() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 123 )
			->andReturn(
				[
					'height' => 120,
					'width'  => 100,
				]
			);

		$image_schema = $this->instance->generate_from_attachment_id( 123, 'Different caption' );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'Different caption',
			'height'     => 120,
			'width'      => 100,
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::generate_from_attachment_id for an internal URL with image metadata containing the
	 * image's width and height.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::generate_from_attachment_id
	 * @covers WPSEO_Schema_Image::add_image_size
	 */
	public function test_generate_from_attachment_id_with_size() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 123 )
			->andReturn(
				[
					'height' => 120,
					'width'  => 100,
				]
			);

		$image_schema = $this->instance->generate_from_attachment_id( 123 );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'image caption',
			'height'     => 120,
			'width'      => 100,
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}

	/**
	 * Tests WPSEO_Schema_Image::simple_image_object.
	 *
	 * @covers WPSEO_Schema_Image::__construct
	 * @covers WPSEO_Schema_Image::generate_object
	 * @covers WPSEO_Schema_Image::simple_image_object
	 */
	public function test_simple_image_object_with_caption() {
		$image_schema = $this->instance->simple_image_object( 'https://www.example.com/media/image.png', 'Different caption' );

		$expected = [
			'@id'        => self::IMAGE_ID,
			'@type'      => 'ImageObject',
			'url'        => 'https://www.example.com/media/image.png',
			'caption'    => 'Different caption',
			'inLanguage' => 'language',
		];

		$this->assertEquals( $expected, $image_schema );
	}
}
