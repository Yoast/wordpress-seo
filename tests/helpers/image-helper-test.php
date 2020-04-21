<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
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
	public function setUp() {
		$this->instance = Mockery::mock( Image_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		parent::setUp();
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is no gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_absent() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '' ] );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->never();

		$this->assertEmpty( $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is an empty gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_empty() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '[gallery][/gallery]' ] );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->once()
			->andReturn( [] );

		$this->assertEmpty( $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is a gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_present() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '[gallery][/gallery]' ] );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->once()
			->andReturn(
				[
					'https://example.com/media/image.jpg',
					'https://example.com/media/image2.jpg',
				]
			);

		$this->assertEquals( 'https://example.com/media/image.jpg', $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests if the attachment is a valid image.
	 *
	 * @covers ::is_valid_attachment
	 */
	public function test_is_attachment_valid_image() {
		Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_valid_attachment( 1337 ) );
	}

	/**
	 * Test if the attachment is valid with false given as mimetype.
	 *
	 * @covers ::is_valid_attachment
	 */
	public function test_is_valid_attachment_no_mime_type() {
		Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->with( 100 )
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_mime_type' )
			->once()
			->with( 100 )
			->andReturn( false );

		$this->assertFalse( $this->instance->is_valid_attachment( 100 ) );
	}

	/**
	 * Test if the attachment is valid with false given as mimetype.
	 *
	 * @covers ::is_valid_attachment
	 */
	public function test_is_valid_attachment() {
		Monkey\Functions\expect( 'wp_attachment_is_image' )
			->once()
			->with( 100 )
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_mime_type' )
			->once()
			->with( 100 )
			->andReturn( 'image/jpeg' );

		$this->instance
			->expects( 'is_valid_image_type' )
			->once()
			->with( 'image/jpeg' )
			->andReturnTrue();

		$this->assertTrue( $this->instance->is_valid_attachment( 100 ) );
	}

	/**
	 * Test if extension is a valid image extension.
	 *
	 * @covers ::is_extension_valid
	 */
	public function test_is_extension_valid() {
		$this->assertTrue( $this->instance->is_extension_valid( 'jpg' ) );
	}

	/**
	 * Test if the mime type is a validate image type.
	 *
	 * @covers ::is_valid_image_type
	 */
	public function test_is_valid_image_type() {
		$this->assertTrue( $this->instance->is_valid_image_type( 'image/jpeg' ) );
	}

	/**
	 * Test retrieval of the attachment images source.
	 *
	 * @covers ::get_attachment_image_source
	 */
	public function test_get_attachment_image_source() {
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->once()
			->with( 1337, 'full' )
			->andReturn( [ 'image.jpg', 500, 600 ] );

		$this->assertEquals( 'image.jpg', $this->instance->get_attachment_image_source( 1337 ) );
	}

	/**
	 * Test retrieval of the attachment images source.
	 *
	 * @covers ::get_attachment_image_source
	 */
	public function test_get_attachment_image_source_no_image_found() {
		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->once()
			->with( 1337, 'full' )
			->andReturn( '' );

		$this->assertEmpty( $this->instance->get_attachment_image_source( 1337 ) );
	}

	/**
	 * Tests the retrieval of the featured image id.
	 *
	 * @covers ::get_featured_image_id
	 */
	public function test_get_featured_image_id() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 100 )
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->once()
			->with( 100 )
			->andReturn( 1337 );

		$this->assertEquals( 1337, $this->instance->get_featured_image_id( 100 ) );
	}

	/**
	 * Tests the retrieval of the featured image id.
	 *
	 * @covers ::get_featured_image_id
	 */
	public function test_get_featured_image_id_with_no_set_featured_image() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->once()
			->with( 100 )
			->andReturn( false );

		$this->assertFalse( $this->instance->get_featured_image_id( 100 ) );
	}

	/**
	 * Tests retrieving of the first content image.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image() {
		$this->instance
			->expects( 'get_first_usable_content_image_for_post' )
			->once()
			->with( 1337 )
			->andReturn( 'image.jpg' );

		$this->assertEquals( 'image.jpg', $this->instance->get_post_content_image( 1337 ) );
	}

	/**
	 * Tests retrieving of the first content image with no image being found.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image_with_no_image_found() {
		$this->instance
			->expects( 'get_first_usable_content_image_for_post' )
			->once()
			->with( 1337 )
			->andReturnNull();

		$this->assertEquals( '', $this->instance->get_post_content_image( 1337 ) );
	}

	/**
	 * Tests getting the first image from the post content.
	 *
	 * @covers ::get_term_content_image
	 */
	public function test_get_term_content_image() {
		$this->instance
			->expects( 'get_first_content_image_for_term' )
			->with( 1337 )
			->once()
			->andReturn( 'https://example.com/media/content_image.jpg' );

		$this->assertEquals(
			'https://example.com/media/content_image.jpg',
			$this->instance->get_term_content_image( 1337 )
		);
	}

	/**
	 * Tests whether an empty string is returned when the content contains no image.
	 *
	 * @covers ::get_term_content_image
	 */
	public function test_get_term_content_image_no_image_in_content() {
		$this->instance
			->expects( 'get_first_content_image_for_term' )
			->with( 1337 )
			->once()
			->andReturn( null );

		$this->assertEmpty( $this->instance->get_term_content_image( 1337 ) );
	}

	/**
	 * Tests retrieving the caption from the attachment.
	 *
	 * @covers ::get_caption
	 */
	public function test_get_caption_with_attachment_caption() {
		Monkey\Functions\expect( 'wp_get_attachment_caption' )
			->once()
			->with( 707 )
			->andReturn( 'This is the attachment caption' );

		$this->assertEquals( 'This is the attachment caption', $this->instance->get_caption( 707 ) );
	}

	/**
	 * Tests the retrieving the caption where the caption is set in post meta.
	 *
	 * @covers ::get_caption
	 */
	public function test_get_caption_with_caption_from_post_meta() {
		Monkey\Functions\expect( 'wp_get_attachment_caption' )
			->with( 707 )
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( 707, '_wp_attachment_image_alt', true )
			->andReturn( 'This is the post_meta caption' );

		$this->assertEquals( 'This is the post_meta caption', $this->instance->get_caption( 707 ) );
	}

	/**
	 * Tests retrieving the caption with no set caption.
	 *
	 * @covers ::get_caption
	 */
	public function test_get_caption_with_no_set_caption() {
		Monkey\Functions\expect( 'wp_get_attachment_caption' )
			->once()
			->with( 707 )
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_meta' )
			->once()
			->with( 707, '_wp_attachment_image_alt', true )
			->andReturn( '' );

		$this->assertEquals( '', $this->instance->get_caption( 707 ) );
	}

	/**
	 * Tests retrieving the meta data.
	 *
	 * @covers ::get_metadata
	 */
	public function test_get_metadata() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 1337 )
			->andReturn( [ 'meta' => 'data' ] );

		$this->assertEquals(
			[
				'meta' => 'data',
			],
			$this->instance->get_metadata( 1337 )
		);
	}

	/**
	 * Tests retrieving the meta data with no metadata found.
	 *
	 * @covers ::get_metadata
	 */
	public function test_get_metadata_with_no_metadata_found() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$this->assertEquals( [], $this->instance->get_metadata( 1337 ) );
	}

	/**
	 * Tests retrieving the meta data with unexpected return value.
	 *
	 * @covers ::get_metadata
	 */
	public function test_get_metadata_with_wrong_metadata_return_type() {
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->once()
			->with( 1337 )
			->andReturn( 'string' );

		$this->assertEquals( [], $this->instance->get_metadata( 1337 ) );
	}

	/**
	 * Tests retrieving the attachment image url.
	 *
	 * @covers ::get_attachment_image_url
	 */
	public function test_get_attachment_image_url() {
		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 1337, 'full' )
			->andReturn( 'https://example.org/image.jpg' );

		$this->assertEquals(
			'https://example.org/image.jpg',
			$this->instance->get_attachment_image_url( 1337, 'full' ) );
	}

	/**
	 * Tests retrieving the attachment image url with no url found.
	 *
	 * @covers ::get_attachment_image_url
	 */
	public function test_get_attachment_image_url_no_url_found() {
		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 1337, 'full' )
			->andReturn( false );

		$this->assertEquals( '', $this->instance->get_attachment_image_url( 1337, 'full' ) );
	}

	/**
	 * Tests the get_best_attachment_variation method.
	 *
	 * @covers ::get_best_attachment_variation
	 */
	public function test_get_best_attachment_variation() {
		$attachment_id = 1;
		$image_params  = [
			'min_width'  => 200,
			'min_height' => 200,
			'max_width'  => 2000,
			'max_height' => 2000,
		];

		$attachment_metadata  = [
			'width'    => 500,
			'height'   => 500,
			'id'       => 7,
			'pixels'   => 18602,
			'type'     => 'image/png',
			'filesize' => 40000
		];
		$attachment_image_url = 'http://basic.wordpress.test/wp-content/uploads/2020/04/image.png';
		$attached_file        = '/var/www/html/wp-content/uploads/2020/04/image.png';
		$alt_tag              = 'An alt tag.';

		// WP attachment (image) function expectations.
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->with( $attachment_id )
			->andReturn( $attachment_metadata );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->with( $attachment_id )
			->andReturn( $attachment_image_url );

		Monkey\Functions\expect( 'get_attached_file' )
			->with( $attachment_id )
			->andReturn( $attached_file );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( $attachment_id, '_wp_attachment_image_alt', true )
			->andReturn( $alt_tag );

		Monkey\Functions\expect( 'image_get_intermediate_size' )
			->with( $attachment_id, 'large' )
			->andReturn( false );

		$expected = [
			'width'    => 500,
			'height'   => 500,
			'url'      => 'http://basic.wordpress.test/wp-content/uploads/2020/04/image.png',
			'path'     => '/var/www/html/wp-content/uploads/2020/04/image.png',
			'size'     => 'full',
			'id'       => 1,
			'alt'      => 'An alt tag.',
			'pixels'   => 250000,
			'type'     => 'image/png',
			'filesize' => 40000,
		];

		$this->assertEquals( $expected, $this->instance->get_best_attachment_variation( 1, $image_params ) );
	}


	/**
	 * Tests the get_best_attachment_variation method when no image params are provided.
	 *
	 * @covers ::get_best_attachment_variation
	 */
	public function test_get_best_attachment_variation_no_image_params() {
		$attachment_id = 1;

		$attachment_metadata  = [
			'width'    => 500,
			'height'   => 500,
			'id'       => 7,
			'pixels'   => 18602,
			'type'     => 'image/png',
			'filesize' => 40000
		];
		$attachment_image_url = 'http://basic.wordpress.test/wp-content/uploads/2020/04/image.png';
		$attached_file        = '/var/www/html/wp-content/uploads/2020/04/image.png';
		$alt_tag              = 'An alt tag.';

		// WP attachment (image) function expectations.
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->with( $attachment_id )
			->andReturn( $attachment_metadata );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->with( $attachment_id )
			->andReturn( $attachment_image_url );

		Monkey\Functions\expect( 'get_attached_file' )
			->with( $attachment_id )
			->andReturn( $attached_file );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( $attachment_id, '_wp_attachment_image_alt', true )
			->andReturn( $alt_tag );

		Monkey\Functions\expect( 'image_get_intermediate_size' )
			->with( $attachment_id, 'large' )
			->andReturn( false );

		$expected = [
			'width'    => 500,
			'height'   => 500,
			'url'      => 'http://basic.wordpress.test/wp-content/uploads/2020/04/image.png',
			'path'     => '/var/www/html/wp-content/uploads/2020/04/image.png',
			'size'     => 'full',
			'id'       => 1,
			'alt'      => 'An alt tag.',
			'pixels'   => 250000,
			'type'     => 'image/png',
			'filesize' => 40000,
		];

		$this->assertEquals( $expected, $this->instance->get_best_attachment_variation( 1 ) );
	}

	/**
	 * Tests the get_best_attachment_variation method when no image params are provided.
	 *
	 * @covers ::get_best_attachment_variation
	 */
	public function test_get_best_attachment_variation_returns_false_when_no_variations() {
		$attachment_id = 1;
		$image_params  = [
			'min_width'  => 200,
			'min_height' => 200,
			'max_width'  => 2000,
			'max_height' => 2000,
		];

		// Small image.
		$attachment_metadata  = [
			'width'    => 100,
			'height'   => 500,
			'id'       => 7,
			'pixels'   => 18602,
			'type'     => 'image/png',
			'filesize' => 40000
		];
		$attachment_image_url = 'http://basic.wordpress.test/wp-content/uploads/2020/04/image.png';
		$attached_file        = '/var/www/html/wp-content/uploads/2020/04/image.png';
		$alt_tag              = 'An alt tag.';

		// WP attachment (image) function expectations.
		Monkey\Functions\expect( 'wp_get_attachment_metadata' )
			->with( $attachment_id )
			->andReturn( $attachment_metadata );

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->with( $attachment_id )
			->andReturn( $attachment_image_url );

		Monkey\Functions\expect( 'get_attached_file' )
			->with( $attachment_id )
			->andReturn( $attached_file );

		Monkey\Functions\expect( 'get_post_meta' )
			->with( $attachment_id, '_wp_attachment_image_alt', true )
			->andReturn( $alt_tag );

		Monkey\Functions\expect( 'image_get_intermediate_size' )
			->with( $attachment_id, 'large' )
			->andReturn( false );

		$this->assertEquals( false, $this->instance->get_best_attachment_variation( 1, $image_params ) );
	}
}
