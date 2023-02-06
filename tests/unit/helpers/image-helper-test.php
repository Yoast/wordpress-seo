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
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Image_Helper
 *
 * @group helpers
 */
class Image_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Image_Helper
	 */
	private $instance;

	/**
	 * Represents the indexables repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Represents the SEO Links repository.
	 *
	 * @var Mockery\MockInterface|SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Represents the URL helper.
	 *
	 * @var Mockery\MockInterface|Url_Helper
	 */
	private $url_helper;

	/**
	 * Represents the mock of the instance to test.
	 *
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $mock_instance;

	/**
	 * Setup.
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->seo_links_repository = Mockery::mock( SEO_Links_Repository::class );
		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->url_helper           = Mockery::mock( Url_Helper::class );

		$this->instance = new Image_Helper(
			$this->indexable_repository,
			$this->seo_links_repository,
			$this->options_helper,
			$this->url_helper
		);

		$this->mock_instance = Mockery::mock( Image_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
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

		$this->assertEmpty( $this->mock_instance->get_gallery_image( 100 ) );
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

		$this->assertEmpty( $this->mock_instance->get_gallery_image( 100 ) );
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

		$this->assertEquals( 'https://example.com/media/image.jpg', $this->mock_instance->get_gallery_image( 100 ) );
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

		$this->assertFalse( $this->mock_instance->is_valid_attachment( 1337 ) );
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

		$this->assertFalse( $this->mock_instance->is_valid_attachment( 100 ) );
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

		$this->mock_instance
			->expects( 'is_valid_image_type' )
			->once()
			->with( 'image/jpeg' )
			->andReturnTrue();

		$this->assertTrue( $this->mock_instance->is_valid_attachment( 100 ) );
	}

	/**
	 * Test if extension is a valid image extension.
	 *
	 * @covers ::is_extension_valid
	 */
	public function test_is_extension_valid() {
		$this->assertTrue( $this->mock_instance->is_extension_valid( 'jpg' ) );
	}

	/**
	 * Test if the mime type is a validate image type.
	 *
	 * @covers ::is_valid_image_type
	 */
	public function test_is_valid_image_type() {
		$this->assertTrue( $this->mock_instance->is_valid_image_type( 'image/jpeg' ) );
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

		$this->assertEquals( 'image.jpg', $this->mock_instance->get_attachment_image_source( 1337 ) );
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

		$this->assertEmpty( $this->mock_instance->get_attachment_image_source( 1337 ) );
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

		$this->assertEquals( 1337, $this->mock_instance->get_featured_image_id( 100 ) );
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

		$this->assertFalse( $this->mock_instance->get_featured_image_id( 100 ) );
	}

	/**
	 * Tests retrieving of the first content image.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image() {
		$this->mock_instance
			->expects( 'get_first_usable_content_image_for_post' )
			->once()
			->with( 1337 )
			->andReturn( 'image.jpg' );

		$this->assertEquals( 'image.jpg', $this->mock_instance->get_post_content_image( 1337 ) );
	}

	/**
	 * Tests retrieving of the first content image with no image being found.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image_with_no_image_found() {
		$this->mock_instance
			->expects( 'get_first_usable_content_image_for_post' )
			->once()
			->with( 1337 )
			->andReturnNull();

		$this->assertEquals( '', $this->mock_instance->get_post_content_image( 1337 ) );
	}

	/**
	 * Tests getting the first image from the post content.
	 *
	 * @covers ::get_term_content_image
	 */
	public function test_get_term_content_image() {
		$this->mock_instance
			->expects( 'get_first_content_image_for_term' )
			->with( 1337 )
			->once()
			->andReturn( 'https://example.com/media/content_image.jpg' );

		$this->assertEquals(
			'https://example.com/media/content_image.jpg',
			$this->mock_instance->get_term_content_image( 1337 )
		);
	}

	/**
	 * Tests whether an empty string is returned when the content contains no image.
	 *
	 * @covers ::get_term_content_image
	 */
	public function test_get_term_content_image_no_image_in_content() {
		$this->mock_instance
			->expects( 'get_first_content_image_for_term' )
			->with( 1337 )
			->once()
			->andReturn( null );

		$this->assertEmpty( $this->mock_instance->get_term_content_image( 1337 ) );
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

		$this->assertEquals( 'This is the attachment caption', $this->mock_instance->get_caption( 707 ) );
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

		$this->assertEquals( 'This is the post_meta caption', $this->mock_instance->get_caption( 707 ) );
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

		$this->assertEquals( '', $this->mock_instance->get_caption( 707 ) );
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
			$this->mock_instance->get_metadata( 1337 )
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

		$this->assertEquals( [], $this->mock_instance->get_metadata( 1337 ) );
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

		$this->assertEquals( [], $this->mock_instance->get_metadata( 1337 ) );
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
			$this->mock_instance->get_attachment_image_url( 1337, 'full' )
		);
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

		$this->assertEquals( '', $this->mock_instance->get_attachment_image_url( 1337, 'full' ) );
	}

	/**
	 * Tests the get_attachment_by_url method for when attachments are enabled.
	 *
	 * @dataProvider provider_get_attachment_by_url_disabled_attachments
	 * @covers ::get_attachment_by_url
	 *
	 * @param string    $url                               The URL to find the attachment for.
	 * @param string    $link_type                         The link type of the URL.
	 * @param int       $get_is_attachments_disabled_times The times we'll check if attachments are disabled.
	 * @param string    $final_url                         The final URL to be used to find the ID.
	 * @param int       $find_by_permalink_times           The times the indexable will be retrieved via its permalink.
	 * @param Indexable $indexable                         The retrieved indexable.
	 * @param int       $image_utils_times                 The times WPSEO_Image_Utils will be used.
	 * @param int       $image_utils_id                    The ID WPSEO_Image_Utils returns.
	 * @param int       $find_by_id_and_type_times         The times the indexable will be retrieved via its ID and type.
	 * @param int       $expected_result                   The expected result.
	 */
	public function test_get_attachment_by_url_disabled_attachments( $url, $link_type, $get_is_attachments_disabled_times, $final_url, $find_by_permalink_times, $indexable, $image_utils_times, $image_utils_id, $find_by_id_and_type_times, $expected_result ) {
		$image_utils_mock = Mockery::mock( 'alias:WPSEO_Image_Utils' );

		$this->url_helper
			->expects( 'get_link_type' )
			->with( $url )
			->once()
			->andReturn( $link_type );

		$this->options_helper
			->expects( 'get' )
			->with( 'disable-attachment' )
			->times( $get_is_attachments_disabled_times )
			->andReturn( false );

		$this->indexable_repository
			->expects( 'find_by_permalink' )
			->with( $final_url )
			->times( $find_by_permalink_times )
			->andReturn( $indexable );

		$image_utils_mock
			->expects( 'get_attachment_by_url' )
			->with( $final_url )
			->times( $image_utils_times )
			->andReturn( $image_utils_id );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( $image_utils_id, 'post' )
			->times( $find_by_id_and_type_times );

		$this->assertSame( $expected_result, $this->instance->get_attachment_by_url( $url ) );
	}

	/**
	 * Data provider for test_get_attachment_by_url_disabled_attachments().
	 *
	 * @return array
	 */
	public function provider_get_attachment_by_url_disabled_attachments() {
		$indexable_not_attachment                  = Mockery::mock( Indexable_Mock::class );
		$indexable_not_attachment->object_type     = 'post';
		$indexable_not_attachment->object_sub_type = 'not_attachment';

		$indexable_attachment                  = Mockery::mock( Indexable_Mock::class );
		$indexable_attachment->object_type     = 'post';
		$indexable_attachment->object_sub_type = 'attachment';
		$indexable_attachment->object_id       = 234;

		$image         = 'http://wordpress.test/wp-content/uploads/2022/11/image.png';
		$resized_image = 'http://wordpress.test/wp-content/uploads/2022/11/image-1024x694.png';

		return [
			[ $image, 'external', 0, 'irrelevant', 0, 'irrelevant', 0, 'irrelevant', 0, 0 ],
			[ $image, 'image-in', 1, $image, 1, $indexable_not_attachment, 1, 123, 1, 123 ],
			[ $image, 'image-in', 1, $image, 1, $indexable_not_attachment, 1, 0, 0, 0 ],
			[ $resized_image, 'image-in', 1, $image, 1, $indexable_not_attachment, 1, 123, 1, 123 ],
			[ $image, 'image-in', 1, $image, 1, $indexable_attachment, 0, 'irrelevant', 0, 234 ],
		];
	}
}
