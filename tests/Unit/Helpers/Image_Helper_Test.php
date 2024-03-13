<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\SEO_Links_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
 *
 * @group helpers
 */
final class Image_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Represents the instance to test.
	 *
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $actual_instance;

	/**
	 *  The Indexable_Repository instance.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 *  The SEO_Links_Repository instance.
	 *
	 * @var Mockery\MockInterface|SEO_Links_Repository
	 */
	protected $indexable_seo_links_repository;

	/**
	 *  The Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 *  The Url_Helper instance.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url_helper;

	/**
	 * Setup.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Image_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		$this->indexable_repository           = Mockery::mock( Indexable_Repository::class );
		$this->indexable_seo_links_repository = Mockery::mock( SEO_Links_Repository::class );
		$this->options_helper                 = Mockery::mock( Options_Helper::class );
		$this->url_helper                     = Mockery::mock( Url_Helper::class );

		$this->actual_instance = new Image_Helper( $this->indexable_repository, $this->indexable_seo_links_repository, $this->options_helper, $this->url_helper );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is no gallery.
	 *
	 * @covers ::get_gallery_image
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_is_extension_valid() {
		$this->assertTrue( $this->instance->is_extension_valid( 'jpg' ) );
	}

	/**
	 * Test if the mime type is a validate image type.
	 *
	 * @covers ::is_valid_image_type
	 *
	 * @return void
	 */
	public function test_is_valid_image_type() {
		$this->assertTrue( $this->instance->is_valid_image_type( 'image/jpeg' ) );
	}

	/**
	 * Test retrieval of the attachment images source.
	 *
	 * @covers ::get_attachment_image_source
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_get_attachment_image_url() {

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 1337, 'full' )
			->andReturn( 'https://example.org/image.jpg' );

		$this->assertEquals(
			'https://example.org/image.jpg',
			$this->instance->get_attachment_image_url( 1337, 'full' )
		);
	}

	/**
	 * Tests retrieving the attachment image url with no url found.
	 *
	 * @covers ::get_attachment_image_url
	 *
	 * @return void
	 */
	public function test_get_attachment_image_url_no_url_found() {

		Monkey\Functions\expect( 'wp_get_attachment_image_url' )
			->once()
			->with( 1337, 'full' )
			->andReturn( false );

		$this->assertEquals( '', $this->instance->get_attachment_image_url( 1337, 'full' ) );
	}

	/**
	 * Tests the get_attachment_by_url function with an external image url.
	 *
	 * @covers ::get_attachment_by_url
	 * @return void
	 */
	public function test_get_attachment_by_url_with_external_url_image() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'https://example.com/image.jpg' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);
		$this->url_helper->expects( 'get_link_type' )->andReturn( SEO_Links::TYPE_EXTERNAL );
		$this->assertEquals( 0, $this->actual_instance->get_attachment_by_url( 'https://example.com/image.jpg' ) );
	}

	/**
	 * Tests the get_attachment_by_url function with an external image.
	 *
	 * @covers ::get_attachment_by_url
	 * @return void
	 */
	public function test_get_attachment_by_url_with_external_image() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( '' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);
		$this->url_helper->expects( 'get_link_type' )->andReturn( SEO_Links::TYPE_EXTERNAL );
		$this->assertEquals( 0, $this->actual_instance->get_attachment_by_url( '' ) );
	}

	/**
	 * Tests the get_attachment_by_url function with using an existing indexable.
	 *
	 * @covers ::get_attachment_by_url
	 * @return void
	 */
	public function test_get_attachment_by_url_with_existing_indexable() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( '' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);
		$indexable                  = new Indexable_Mock();
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = 'attachment';
		$indexable->object_id       = 17;
		$this->url_helper->expects( 'get_link_type' )->andReturn( SEO_Links::TYPE_INTERNAL );
		$this->options_helper->expects( 'get' )->with( 'disable-attachment' )->andReturn( false );
		$this->indexable_repository->expects( 'find_by_permalink' )->andReturn( $indexable );
		$this->assertEquals( 17, $this->actual_instance->get_attachment_by_url( '' ) );
	}

	/**
	 * Tests the get_attachment_by_url function with using the SEO links table.
	 *
	 * @covers ::get_attachment_by_url
	 * @return void
	 */
	public function test_get_attachment_by_url_with_existing_link() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'a_dir/something' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

		$url = \md5( 'a_dir/something' );
		Monkey\Functions\expect( 'wp_cache_get' )
			->once()
			->with( 'attachment_seo_link_object_' . $url, 'yoast-seo-attachment-link', false, false )
			->andReturn( false );

		$link                 = new SEO_Links_Mock();
		$link->target_post_id = 17;
		$this->url_helper->expects( 'get_link_type' )->andReturn( SEO_Links::TYPE_INTERNAL );
		$this->options_helper->expects( 'get' )->with( 'disable-attachment' )->andReturn( true );
		$this->indexable_seo_links_repository->expects( 'find_one_by_url' )->andReturn( $link );

		Monkey\Functions\expect( 'wp_cache_set' )
			->once()
			->with( 'attachment_seo_link_object_' . $url, $link, 'yoast-seo-attachment-link', \MINUTE_IN_SECONDS );
		$this->assertEquals( 17, $this->actual_instance->get_attachment_by_url( 'a_dir/something' ) );
	}
}
