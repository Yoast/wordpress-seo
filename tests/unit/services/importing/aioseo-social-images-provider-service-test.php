<?php

namespace Yoast\WP\SEO\Tests\Unit\Services\Importing;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Aioseo_Helper;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Social_Images_Provider_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Aioseo_Social_Images_Provider_Service_Test.
 *
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Services\Importing\Aioseo\Aioseo_Social_Images_Provider_Service
 * @phpcs:disable Yoast.Yoast.AlternativeFunctions.json_encode_json_encode,Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Social_Images_Provider_Service_Test extends TestCase {

	/**
	 * The class under test.
	 *
	 * @var Aioseo_Social_Images_Provider_Service
	 */
	protected $aioseo_social_images_provider_service;

	/**
	 * The AIOSEO helper.
	 *
	 * @var Mockery\MockInterface|Aioseo_Helper
	 */
	protected $aioseo_helper;

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * {@inheritDoc}
	 */
	public function set_up() {
		$this->aioseo_helper                         = Mockery::mock( Aioseo_Helper::class );
		$this->image                                 = Mockery::mock( Image_Helper::class );
		$this->aioseo_social_images_provider_service = new Aioseo_Social_Images_Provider_Service( $this->aioseo_helper, $this->image );
	}

	/**
	 * Tests retrieving the default source of social images.
	 *
	 * @dataProvider provider_get_default_social_image_source
	 * @covers ::get_default_social_image_source
	 * @covers ::get_social_defaults
	 *
	 * @param string $aioseo_options  The AIOSEO settings coming from the db.
	 * @param string $social_setting  The social settings we're working with, eg. open-graph or twitter.
	 * @param string $expected_source The source that's expected to be retrieved.
	 */
	public function test_get_default_social_image_source( $aioseo_options, $social_setting, $expected_source ) {
		$this->aioseo_helper->expects( 'get_global_option' )
			->once()
			->andReturn( $aioseo_options );

		$actual_source = $this->aioseo_social_images_provider_service->get_default_social_image_source( $social_setting );
		$this->assertSame( $expected_source, $actual_source );
	}

	/**
	 * Tests retrieving the default custom social image.
	 *
	 * @dataProvider provider_get_default_custom_social_image
	 * @covers ::get_default_custom_social_image
	 * @covers ::get_social_defaults
	 *
	 * @param string $aioseo_options The AIOSEO settings coming from the db.
	 * @param string $social_setting The social settings we're working with, eg. open-graph or twitter.
	 * @param string $expected_url   The URL that's expected to be retrieved.
	 */
	public function test_get_default_custom_social_image( $aioseo_options, $social_setting, $expected_url ) {
		$this->aioseo_helper->expects( 'get_global_option' )
			->once()
			->andReturn( $aioseo_options );

		$actual_url = $this->aioseo_social_images_provider_service->get_default_custom_social_image( $social_setting );
		$this->assertSame( $expected_url, $actual_url );
	}

	/**
	 * Tests retrieving the url of the first image in content.
	 *
	 * @dataProvider provider_get_first_image_in_content
	 * @covers ::get_first_image_in_content
	 *
	 * @param string $gallery_image      The post's gallery image.
	 * @param string $post_content_image The post's content image.
	 * @param int    $post_content_times The times we'll look for the post's content image.
	 * @param string $expected_url       The URL that's expected to be retrieved.
	 */
	public function test_get_first_image_in_content( $gallery_image, $post_content_image, $post_content_times, $expected_url ) {
		$post_id = 123;

		$this->image->expects( 'get_gallery_image' )
			->once()
			->with( $post_id )
			->andReturn( $gallery_image );

		$this->image->expects( 'get_post_content_image' )
			->times( $post_content_times )
			->with( $post_id )
			->andReturn( $post_content_image );

		$actual_url = $this->aioseo_social_images_provider_service->get_first_image_in_content( $post_id );
		$this->assertSame( $expected_url, $actual_url );
	}

	/**
	 * Tests retrieving the url of the first image in content.
	 *
	 * @dataProvider provider_get_first_attached_image
	 * @covers ::get_first_attached_image
	 *
	 * @param string $post_type               The post's type.
	 * @param int    $attachment_type_times   The times we'll look for attachment image source of an attachment.
	 * @param array  $children                The post's children.
	 * @param int    $children_times          The times we'll look for the post's children.
	 * @param string $source_attachment       The image source for an attachment id.
	 * @param int    $source_attachment_times The times we'll look for the image source for an attachment id.
	 * @param string $expected_url            The URL that's expected to be retrieved.
	 */
	public function test_get_first_attached_image( $post_type, $attachment_type_times, $children, $children_times, $source_attachment, $source_attachment_times, $expected_url ) {
		$post_id = 123;

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( $post_id )
			->andReturn( $post_type );

		$this->image->expects( 'get_attachment_image_source' )
			->times( $attachment_type_times )
			->with( $post_id, 'fullsize' )
			->andReturn( $expected_url );

		Monkey\Functions\expect( 'get_children' )
			->times( $children_times )
			->with(
				[
					'post_parent'    => $post_id,
					'post_status'    => 'inherit',
					'post_type'      => 'attachment',
					'post_mime_type' => 'image',
				]
			)
			->andReturn( $children );

		$this->image->expects( 'get_attachment_image_source' )
			->times( $source_attachment_times )
			->with( $source_attachment, 'fullsize' )
			->andReturn( $expected_url );

		$actual_url = $this->aioseo_social_images_provider_service->get_first_attached_image( $post_id );
		$this->assertSame( $expected_url, $actual_url );
	}

	/**
	 * Tests retrieving the url of the first image in content.
	 *
	 * @dataProvider provider_get_featured_image
	 * @covers ::get_featured_image
	 *
	 * @param string $feature_image_id        The id of the post's featured image.
	 * @param string $source_attachment       The image source for an attachment id.
	 * @param int    $source_attachment_times The times we'll look for the image source for an attachment id.
	 * @param string $expected_url            The URL that's expected to be retrieved.
	 */
	public function test_get_featured_image( $feature_image_id, $source_attachment, $source_attachment_times, $expected_url ) {
		$post_id = 123;

		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->once()
			->with( $post_id )
			->andReturn( $feature_image_id );

		$this->image->expects( 'get_attachment_image_source' )
			->times( $source_attachment_times )
			->with( $source_attachment, 'fullsize' )
			->andReturn( $expected_url );


		$actual_url = $this->aioseo_social_images_provider_service->get_featured_image( $post_id );
		$this->assertSame( $expected_url, $actual_url );
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_get_featured_image() {
		return [
			[ 234, 234, 1, 'https://example.com/featured-image.png' ],
			[ false, 'irrelevant', 0, '' ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_get_first_attached_image() {
		$no_attachments = [];

		$multiple_attachments = [
			'111' => (object) [
				'ID' => '111',
			],
			'222' => (object) [
				'ID' => '222',
			],
		];

		return [
			[ 'attachment', 1, [ 'irrelevant' ], 0, 'irrelevant', 0, 'https://example.com/attachment.png' ],
			[ 'not_attachment', 0, $no_attachments, 1, 'irrelevant', 0, '' ],
			[ 'not_attachment', 0, $multiple_attachments, 1, '111', 1, 'https://example.com/child.png' ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_get_first_image_in_content() {
		return [
			[ 'https://example.com/gallery-image.png', 'irrelevant', 0, 'https://example.com/gallery-image.png' ],
			[ '', 'https://example.com/post-content-image.png', 1, 'https://example.com/post-content-image.png' ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_get_default_custom_social_image() {
		$image_url      = 'https://example.com/image.png';
		$empty_settings = [];

		$fb_custom_image             = [
			'social' => [
				'facebook' => [
					'general' => [
						'defaultImagePosts' => $image_url,
					],
				],
			],
		];
		$fb_malformed_no_general_key = [
			'social' => [
				'facebook' => [
					'no_general' => [
						'defaultImagePosts' => 'irrelevant',
					],
				],
			],
		];
		$fb_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'irrelevant',
					],
				],
			],
		];

		$twitter_custom_image             = [
			'social' => [
				'twitter' => [
					'general' => [
						'defaultImagePosts' => $image_url,
					],
				],
			],
		];
		$twitter_malformed_no_general_key = [
			'social' => [
				'twitter' => [
					'no_general' => [
						'defaultImagePosts' => 'irrelevant',
					],
				],
			],
		];
		$twitter_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImagePosts' => 'irrelevant',
					],
				],
			],
		];

		return [
			[ $empty_settings, 'irrelevant', '' ],
			[ $fb_custom_image, 'og', $image_url ],
			[ $fb_malformed_no_general_key, 'og', '' ],
			[ $fb_malformed_no_social_key, 'og', '' ],
			[ $twitter_custom_image, 'twitter', $image_url ],
			[ $twitter_malformed_no_general_key, 'twitter', '' ],
			[ $twitter_malformed_no_social_key, 'twitter', '' ],
		];
	}

	/**
	 * Data provider for test_query().
	 *
	 * @return array
	 */
	public function provider_get_default_social_image_source() {
		$empty_settings = [];

		$fb_default_image            = [
			'social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'default',
					],
				],
			],
		];
		$fb_featured_image           = [
			'social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'featured',
					],
				],
			],
		];
		$fb_malformed_no_general_key = [
			'social' => [
				'facebook' => [
					'no_general' => [
						'defaultImageSourcePosts' => 'irrelevant',
					],
				],
			],
		];
		$fb_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'irrelevant',
					],
				],
			],
		];


		$twitter_default_image            = [
			'social' => [
				'twitter' => [
					'general' => [
						'defaultImageSourcePosts' => 'default',
					],
				],
			],
		];
		$twitter_featured_image           = [
			'social' => [
				'twitter' => [
					'general' => [
						'defaultImageSourcePosts' => 'featured',
					],
				],
			],
		];
		$twitter_malformed_no_general_key = [
			'social' => [
				'twitter' => [
					'no_general' => [
						'defaultImageSourcePosts' => 'irrelevant',
					],
				],
			],
		];
		$twitter_malformed_no_social_key  = [
			'no_social' => [
				'facebook' => [
					'general' => [
						'defaultImageSourcePosts' => 'irrelevant',
					],
				],
			],
		];

		return [
			[ $empty_settings, 'irrelevant', '' ],
			[ $fb_default_image, 'og', 'default' ],
			[ $fb_featured_image, 'og', 'featured' ],
			[ $fb_malformed_no_general_key, 'og', '' ],
			[ $fb_malformed_no_social_key, 'og', '' ],
			[ $twitter_default_image, 'twitter', 'default' ],
			[ $twitter_featured_image, 'twitter', 'featured' ],
			[ $twitter_malformed_no_general_key, 'twitter', '' ],
			[ $twitter_malformed_no_social_key, 'twitter', '' ],
		];
	}
}
