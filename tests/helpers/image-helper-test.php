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
}
