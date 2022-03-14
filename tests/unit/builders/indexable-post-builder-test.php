<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Post_Not_Found_Exception;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Post_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Post_Builder_Test.
 *
 * @group  indexables
 * @group  builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Post_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Post_Builder
 */
class Indexable_Post_Builder_Test extends TestCase {

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable|Mockery\MockInterface
	 */
	protected $indexable;

	/**
	 * Holds the Indexable_Repository instance.
	 *
	 * @var Indexable_Repository|Mockery\MockInterface
	 */
	protected $indexable_repository;

	/**
	 * Holds the Image_Helper instance.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * Holds the Open_Graph_Image_Helper instance.
	 *
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image;

	/**
	 * Holds the Twitter_Image_Helper instance.
	 *
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	protected $twitter_image;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post;

	/**
	 * The post type helper.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the Indexable_Post_Builder instance.
	 *
	 * @var Indexable_Post_Builder|Indexable_Post_Builder_Double|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * Initializes the test mocks.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->indexable            = Mockery::mock();
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->image                = Mockery::mock( Image_Helper::class );
		$this->open_graph_image     = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter_image        = Mockery::mock( Twitter_Image_Helper::class );
		$this->post                 = Mockery::mock( Post_Helper::class );
		$this->post_type_helper     = Mockery::mock( Post_Type_Helper::class );

		$this->instance = new Indexable_Post_Builder_Double(
			$this->post,
			$this->post_type_helper,
			new Indexable_Builder_Versions()
		);

		$this->instance->set_indexable_repository( $this->indexable_repository );
		$this->instance->set_social_image_helpers(
			$this->image,
			$this->open_graph_image,
			$this->twitter_image
		);
	}

	/**
	 * Mocks the 'set' method of the given indexable's ORM object with the key value pairs in `$expectations`.
	 *
	 * @param Mockery\MockInterface|Indexable $indexable_mock The indexable mock object.
	 * @param array                           $expectations   The expectation of the 'set' method of the mock object.
	 */
	protected function set_indexable_set_expectations( $indexable_mock, $expectations ) {
		foreach ( $expectations as $key => $value ) {
			$closure = static function ( $actual_key, $actual_value ) use ( $key, $value ) {
				if ( $actual_key === $key && $actual_value === $value ) {
					return true;
				}
				else {
					return false;
				}
			};
			$indexable_mock->orm->expects( 'set' )->once()->withArgs( $closure );
		}
	}

	/**
	 * Mocks a Twitter image that has been set by the user.
	 */
	protected function twitter_image_set_by_user() {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image' )
			->andReturn( 'twitter-image' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_id' )
			->andReturn( 'twitter-image-id' );

		$this->twitter_image->shouldReceive( 'get_by_id' )
			->with( 'twitter-image-id' )
			->andReturn( 'twitter_image' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'twitter_image_source' )
			->andReturn( 'set-by-user' );
	}

	/**
	 * Mocks an Open Graph image that is set by the user.
	 *
	 * @param array $image_meta The mocked meta data of the image.
	 */
	protected function open_graph_image_set_by_user( $image_meta ) {
		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image' )
			->andReturn( 'open-graph-image' );

		$this->indexable->orm->shouldReceive( 'get' )
			->twice()
			->with( 'open_graph_image_id' )
			->andReturn( 'open-graph-image-id' );

		$this->indexable->orm->shouldReceive( 'get' )
			->with( 'open_graph_image_source' )
			->andReturn( 'set-by-user' );

		$this->open_graph_image->shouldReceive( 'get_image_by_id' )
			->with( 'open-graph-image-id' )
			->andReturn( $image_meta );
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Post_Type_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_type_helper' )
		);
		$this->assertInstanceOf(
			Post_Helper::class,
			$this->getPropertyValue( $this->instance, 'post_helper' )
		);
	}

	/**
	 * Tests that the set_indexable_repository method sets the indexable repository.
	 *
	 * @covers ::set_indexable_repository
	 */
	public function test_set_indexable_repository() {
		$this->instance->set_indexable_repository( $this->indexable_repository );

		$this->assertInstanceOf(
			Indexable_Repository::class,
			$this->getPropertyValue( $this->instance, 'indexable_repository' )
		);
	}

	/**
	 * Tests building a basic post indexable from postmeta.
	 * If this starts failing, the $default_values of the Indexable_Helper maybe need changing too.
	 *
	 * @dataProvider provider_build
	 * @covers ::build
	 *
	 * @param array $postmeta        The postmeta of the post.
	 * @param array $expected_result The expected indexable values.
	 */
	public function test_build( $postmeta, $expected_result ) {
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_post_custom' )->with( 1 )->andReturn( $postmeta );
		Monkey\Functions\expect( 'maybe_unserialize' )->andReturnFirstArg();

		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_content'      => 'The content of the post',
					'post_type'         => 'post',
					'post_status'       => 'publish',
					'post_password'     => '',
					'post_author'       => '1',
					'post_parent'       => '0',
					'post_date_gmt'     => '1234-12-12 00:00:00',
					'post_modified_gmt' => '1234-12-12 00:00:00',
				]
			);

		$this->post_type_helper
			->expects( 'is_excluded' )
			->with( 'post' )
			->andReturn( false );

		$this->post
			->expects( 'is_post_indexable' )
			->with( 1 )
			->andReturn( true );

		$indexable_expectations = [
			'object_id'                      => '1',
			'object_type'                    => 'post',
			'object_sub_type'                => 'post',
			'permalink'                      => 'https://permalink',
			'breadcrumb_title'               => 'breadcrumb_title',
			'number_of_pages'                => null,
			'is_public'                      => '0',
			'post_status'                    => 'publish',
			'is_protected'                   => '0',
			'author_id'                      => '1',
			'post_parent'                    => '0',
			'has_public_posts'               => null,
			'blog_id'                        => '1',
			'version'                        => '2',
			'object_published_at'            => '1234-12-12 00:00:00',
			'object_last_modified'           => '1234-12-12 00:00:00',
		];
		$indexable_expectations = \array_merge( $indexable_expectations, $expected_result );

		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->set_indexable_set_expectations( $this->indexable, $indexable_expectations );

		// Reset all social images first.
		$this->set_indexable_set_expectations(
			$this->indexable,
			[
				'open_graph_image'        => null,
				'open_graph_image_id'     => null,
				'open_graph_image_source' => null,
				'open_graph_image_meta'   => null,
				'twitter_image'           => null,
				'twitter_image_id'        => null,
				'twitter_image_source'    => null,
			]
		);

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		// Mock that the open graph and twitter images have been set by the user.
		$this->open_graph_image_set_by_user( $image_meta );
		$this->twitter_image_set_by_user();

		// We expect the open graph image, its source and its metadata to be set.
		$this->indexable->orm->expects( 'set' )->with( 'open_graph_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )
			->with( 'open_graph_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg' );
		$this->indexable->orm->expects( 'set' )
			// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encodeWithAdditionalParams -- Test code, mocking WP.
			->with( 'open_graph_image_meta', \json_encode( $image_meta, ( \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES ) ) );

		// We expect the twitter image and its source to be set.
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image_source', 'set-by-user' );
		$this->indexable->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );

		// Is public method.
		$this->indexable->orm->expects( 'get' )->with( 'is_protected' )->andReturnFalse();
		$this->indexable->orm->expects( 'get' )->with( 'is_robots_noindex' )->andReturn( true );

		// Has public posts.
		$this->indexable->orm->expects( 'get' )->with( 'object_sub_type' )->andReturn( 'post' );

		// Breadcrumb title.
		$this->indexable->orm->expects( 'set' )->with( 'breadcrumb_title', null );
		$this->indexable->orm->expects( 'offsetExists' )->with( 'breadcrumb_title' )->andReturnFalse();

		Monkey\Functions\expect( 'get_the_title' )->with( 1 )->andReturn( 'breadcrumb_title' );
		Monkey\Functions\expect( 'wp_strip_all_tags' )->with( 'breadcrumb_title', true )->andReturn( 'breadcrumb_title' );

		// Blog ID.
		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );

		$this->instance->build( 1, $this->indexable );
	}

	/**
	 * Provides data to the test_build function.
	 *
	 * @return array The data to provide.
	 */
	public function provider_build() {
		$postmeta_set_with_missing_data                     = [
			'_yoast_wpseo_linkdex'                        => [ '100' ],
			'_yoast_wpseo_is_cornerstone'                 => [ '1' ],
			'_yoast_wpseo_content_score'                  => [ '50' ],
			'_yoast_wpseo_opengraph-image'                => [ 'open_graph_image' ],
			'_yoast_wpseo_opengraph-image-id'             => [ 'open_graph_image_id' ],
			'_yoast_wpseo_twitter-image'                  => [ 'twitter_image' ],
			'_yoast_wpseo_schema_page_type'               => [ 'FAQPage' ],
			'_yoast_wpseo_schema_article_type'            => [ 'NewsArticle' ],
			'_yoast_wpseo_estimated-reading-time-minutes' => [ '11' ],
		];
		$indexable_with_default_values_for_missing_postmeta = [
			'canonical'                      => null,
			'title'                          => null,
			'description'                    => null,
			'open_graph_title'               => null,
			'open_graph_image'               => 'open_graph_image',
			'open_graph_image_id'            => 'open_graph_image_id',
			'open_graph_description'         => null,
			'twitter_title'                  => null,
			'twitter_image'                  => 'twitter_image',
			'twitter_image_id'               => null,
			'twitter_description'            => null,
			'is_cornerstone'                 => '1',
			'is_robots_noindex'              => null,
			'is_robots_nofollow'             => '0',
			'is_robots_noarchive'            => null,
			'is_robots_noimageindex'         => null,
			'is_robots_nosnippet'            => null,
			'primary_focus_keyword'          => null,
			'primary_focus_keyword_score'    => null,
			'readability_score'              => '50',
			'schema_page_type'               => 'FAQPage',
			'schema_article_type'            => 'NewsArticle',
			'estimated_reading_time_minutes' => '11',
		];

		$extra_postmeta                      = [
			'_yoast_wpseo_focuskw'                        => [ 'focuskeyword' ],
			'_yoast_wpseo_meta-robots-noindex'            => [ '1' ],
			'_yoast_wpseo_meta-robots-adv'                => [ '' ],
			'_yoast_wpseo_canonical'                      => [ 'https://canonical' ],
			'_yoast_wpseo_meta-robots-nofollow'           => [ '1' ],
			'_yoast_wpseo_title'                          => [ 'title' ],
			'_yoast_wpseo_metadesc'                       => [ 'description' ],
			'_yoast_wpseo_opengraph-title'                => [ 'open_graph_title' ],
			'_yoast_wpseo_opengraph-description'          => [ 'open_graph_description' ],
			'_yoast_wpseo_twitter-title'                  => [ 'twitter_title' ],
			'_yoast_wpseo_twitter-description'            => [ 'twitter_description' ],
		];
		$full_postmeta_set                   = \array_merge( $postmeta_set_with_missing_data, $extra_postmeta );
		$indexable_values_for_extra_postmeta = [
			'canonical'                      => 'https://canonical',
			'title'                          => 'title',
			'description'                    => 'description',
			'open_graph_title'               => 'open_graph_title',
			'open_graph_description'         => 'open_graph_description',
			'twitter_title'                  => 'twitter_title',
			'twitter_description'            => 'twitter_description',
			'is_robots_noindex'              => '1',
			'is_robots_nofollow'             => '1',
			'is_robots_noarchive'            => null,
			'is_robots_noimageindex'         => null,
			'is_robots_nosnippet'            => null,
			'primary_focus_keyword'          => 'focuskeyword',
			'primary_focus_keyword_score'    => '100',
		];
		$indexable_with_full_postmeta_set    = \array_merge( $indexable_with_default_values_for_missing_postmeta, $indexable_values_for_extra_postmeta );

		return [
			[ $postmeta_set_with_missing_data, $indexable_with_default_values_for_missing_postmeta ],
			[ $full_postmeta_set, $indexable_with_full_postmeta_set ],
		];
	}

	/**
	 * Tests if the build function returns false when the options_helper->is_post_indexable criterium is not met.
	 *
	 * @covers ::build
	 */
	public function test_build_post_not_indexable() {
		$this->indexable = Mockery::mock( Indexable::class );

		$this->post
			->expects( 'is_post_indexable' )
			->with( 1 )
			->andReturn( false );

		$this->assertEquals( false, $this->instance->build( 1, $this->indexable ) );
	}

	/**
	 * Tests find_alternative_image when the post is an attachment.
	 *
	 * @covers ::find_alternative_image
	 */
	public function test_find_alternative_image_from_attachment() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_sub_type' )
			->andReturn( 'attachment' );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_id' )
			->andReturn( 123 );

		$this->image->allows( 'is_valid_attachment' )
			->with( 123 )
			->andReturn( true );

		$actual = $this->instance->find_alternative_image( $this->indexable );

		$expected = [
			'image_id' => 123,
			'source'   => 'attachment-image',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests find_alternative_image when a featured image is set on the post.
	 *
	 * @covers ::find_alternative_image
	 */
	public function test_find_alternative_image_from_featured_image() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_sub_type' )
			->andReturn( 'post' );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_id' )
			->andReturn( 123 );

		$this->image->allows( 'get_featured_image_id' )
			->with( 123 )
			->andReturn( 456 );

		$actual = $this->instance->find_alternative_image( $this->indexable );

		$expected = [
			'image_id' => 456,
			'source'   => 'featured-image',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests find_alternative_image when a gallery image is set on the post,
	 * but not a featured image.
	 *
	 * @covers ::find_alternative_image
	 */
	public function test_find_alternative_image_from_gallery() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_sub_type' )
			->andReturn( 'post' );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_id' )
			->andReturn( 123 );

		$this->image->allows( 'get_featured_image_id' )
			->with( 123 )
			->andReturn( false );

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		$this->image->allows( 'get_gallery_image' )
			->with( 123 )
			->andReturn( $image_meta );

		$actual = $this->instance->find_alternative_image( $this->indexable );

		$expected = [
			'image'  => $image_meta,
			'source' => 'gallery-image',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests find_alternative_image when a gallery image is set on the post,
	 * but not a featured image.
	 *
	 * @covers ::find_alternative_image
	 */
	public function test_find_alternative_image_from_post_content() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_sub_type' )
			->andReturn( 'post' );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_id' )
			->andReturn( 123 );

		$this->image->allows( 'get_featured_image_id' )
			->with( 123 )
			->andReturn( false );

		$this->image->allows( 'get_gallery_image' )
			->with( 123 )
			->andReturn( false );

		$image_meta = [
			'width'  => 640,
			'height' => 480,
			'url'    => 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg',
			'path'   => '/var/www/html/wp-content/uploads/2020/07/WordPress5.jpg',
			'size'   => 'full',
			'id'     => 13,
			'alt'    => '',
			'pixels' => 307200,
			'type'   => 'image/jpeg',
		];

		$this->image->allows( 'get_post_content_image' )
			->with( 123 )
			->andReturn( $image_meta );

		$actual = $this->instance->find_alternative_image( $this->indexable );

		$expected = [
			'image'  => $image_meta,
			'source' => 'first-content-image',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests find_alternative_image when a gallery image is set on the post,
	 * but not a featured image.
	 *
	 * @covers ::find_alternative_image
	 */
	public function test_find_alternative_image_no_image() {
		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_sub_type' )
			->andReturn( 'post' );

		$this->indexable->orm->allows( 'get' )
			->with( 'object_id' )
			->andReturn( 123 );

		$this->image->allows( 'get_featured_image_id' )
			->with( 123 )
			->andReturn( false );

		$this->image->allows( 'get_gallery_image' )
			->with( 123 )
			->andReturn( false );

		$this->image->allows( 'get_post_content_image' )
			->with( 123 )
			->andReturn( false );

		$this->assertFalse( $this->instance->find_alternative_image( $this->indexable ) );
	}

	/**
	 * Tests counting the number of pages in a paginated post when there are multiple pages.
	 *
	 * @covers ::get_number_of_pages_for_post
	 */
	public function test_get_number_of_pages_for_post_multiple_pages() {
		$post = (object) [
			'post_content'  => 'The content of the post <!--nextpage--> page 2 <!--nextpage--> page 3',
			'post_type'     => 'post',
			'post_status'   => 'publish',
			'post_password' => '',
			'post_author'   => '1',
			'post_parent'   => '0',
		];

		$this->assertSame( 3, $this->instance->get_number_of_pages_for_post( $post ) );
	}

	/**
	 * Tests that get_robots_noindex transforms a meta value of 2 to `false`.
	 *
	 * @covers ::get_robots_noindex
	 */
	public function test_get_robots_noindex_noindex() {
		$this->assertFalse( $this->instance->get_robots_noindex( 2 ) );
	}

	/**
	 * Tests that get_robots_noindex transforms an invalid meta value of 2 to `null`.
	 *
	 * @covers ::get_robots_noindex
	 */
	public function test_get_robots_noindex_invalid() {
		$this->assertNull( $this->instance->get_robots_noindex( 'invalid' ) );
	}

	/**
	 * Tests the get_permalink method.
	 *
	 * @covers ::get_permalink
	 */
	public function test_get_permalink() {
		$permalink = 'https://example.org/permalink';
		$post_type = 'post';
		$post_id   = 4;

		Monkey\Functions\expect( 'get_permalink' )
			->with( $post_id )
			->andReturn( $permalink );

		$this->assertSame( $permalink, $this->instance->get_permalink( $post_type, $post_id ) );
	}

	/**
	 * Tests the get_permalink method when the post is an attachment.
	 *
	 * @covers ::get_permalink
	 */
	public function test_get_permalink_attachment() {
		$permalink = 'https://example.org/permalink-of-attachment';
		$post_type = 'attachment';
		$post_id   = 4;

		Monkey\Functions\expect( 'wp_get_attachment_url' )
			->with( $post_id )
			->andReturn( $permalink );

		$this->assertSame( $permalink, $this->instance->get_permalink( $post_type, $post_id ) );
	}

	/**
	 * Tests the get_keyword_score method.
	 *
	 * @covers ::get_keyword_score
	 */
	public function test_get_keyword_score() {
		$this->assertSame( 3, $this->instance->get_keyword_score( 'keyword', 3 ) );
	}

	/**
	 * Tests that the keyword score is set to `null` when no keyword is set.
	 *
	 * @covers ::get_keyword_score
	 */
	public function test_get_keyword_score_no_keyword() {
		$this->assertNull( $this->instance->get_keyword_score( '', 3 ) );
	}

	/**
	 * Tests is_public for when the post is protected.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_protected() {
		$this->indexable->is_protected = true;

		$this->assertFalse( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post is noindex.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_noindex() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = true;

		$this->assertFalse( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post is an attachment.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_is_attachment() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = false;
		$this->indexable->object_sub_type   = 'attachment';

		$this->assertFalse( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post status is not public.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_status_is_not_public() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = false;
		$this->indexable->object_sub_type   = 'post';
		$this->indexable->post_status       = 'private';

		$this->post->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->assertFalse( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post noindex is false.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_noindex_false() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = false;
		$this->indexable->object_sub_type   = 'post';
		$this->indexable->post_status       = 'publish';

		$this->post->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->assertTrue( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post noindex is null.
	 *
	 * @covers ::is_public
	 */
	public function test_is_public_post_noindex_null() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = null;
		$this->indexable->object_sub_type   = 'post';
		$this->indexable->post_status       = 'publish';

		$this->post->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->assertNull( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public_attachment when the post parent is null.
	 *
	 * @covers ::is_public_attachment
	 */
	public function test_is_public_attachment_post_parent_null() {
		$this->indexable->post_parent = null;

		$this->assertFalse( $this->instance->is_public_attachment( $this->indexable ) );
	}

	/**
	 * Tests is_public_attachment when the post parent is zero.
	 *
	 * @covers ::is_public_attachment
	 */
	public function test_is_public_attachment_post_parent_zero() {
		$this->indexable->post_parent = 0;

		$this->assertFalse( $this->instance->is_public_attachment( $this->indexable ) );
	}

	/**
	 * Tests is_public_attachment with a post parent.
	 *
	 * @covers ::is_public_attachment
	 */
	public function test_is_public_attachment_with_post_parent() {
		$this->indexable->post_parent = 1337;

		$this->assertNull( $this->instance->is_public_attachment( $this->indexable ) );
	}

	/**
	 * Tests has_public_posts for when the indexable does not represent an attachment.
	 *
	 * @covers ::has_public_posts
	 */
	public function test_has_public_posts_no_attachment() {
		$this->indexable->object_sub_type = 'post';

		$this->assertNull( $this->instance->has_public_posts( $this->indexable ) );
	}

	/**
	 * Tests has_public_posts for when the attachment does not have a post parent.
	 *
	 * @covers ::has_public_posts
	 */
	public function test_has_public_posts_attachment_no_parent() {
		$this->indexable->object_sub_type = 'attachment';
		$this->indexable->post_parent     = 0;

		$this->assertFalse( $this->instance->has_public_posts( $this->indexable ) );
	}

	/**
	 * Tests has_public_posts for when the attachment does not have the post status inherit.
	 *
	 * @covers ::has_public_posts
	 */
	public function test_has_public_posts_attachment_no_inherit() {
		$this->indexable->object_sub_type = 'attachment';
		$this->indexable->post_parent     = 1;
		$this->indexable->post_status     = 'private';

		$this->assertFalse( $this->instance->has_public_posts( $this->indexable ) );
	}

	/**
	 * Tests has_public_posts for when the attachment has a post parent.
	 *
	 * @covers ::has_public_posts
	 */
	public function test_has_public_posts_attachment_with_post_parent() {
		$this->indexable->object_sub_type = 'attachment';
		$this->indexable->post_parent     = 1;
		$this->indexable->post_status     = 'inherit';

		$post_parent_indexable            = Mockery::mock();
		$post_parent_indexable->is_public = true;

		$this->indexable_repository->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'post' )
			->andReturn( $post_parent_indexable );

		$this->assertTrue( $this->instance->has_public_posts( $this->indexable ) );
	}

	/**
	 * Tests has_public_posts for when the attachment has a post parent but the ORM throws an false.
	 *
	 * @covers ::has_public_posts
	 */
	public function test_has_public_posts_attachment_with_post_parent_false() {
		$this->indexable->object_sub_type = 'attachment';
		$this->indexable->post_parent     = 1;
		$this->indexable->post_status     = 'inherit';

		$post_parent_indexable            = Mockery::mock();
		$post_parent_indexable->is_public = true;

		$this->indexable_repository->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'post' )
			->andReturn( false );

		$this->assertFalse( $this->instance->has_public_posts( $this->indexable ) );
	}

	/**
	 * Tests that build throws an exception when no post could be found.
	 *
	 * @covers ::build
	 */
	public function test_build_term_null() {
		$this->post
			->expects( 'is_post_indexable' )
			->with( 1 )
			->andReturn( true );

		$this->post->expects( 'get_post' )->once()->with( 1 )->andReturn( null );

		$this->expectException( Post_Not_Found_Exception::class );

		$this->instance->build( 1, false );
	}

	/**
	 * Tests that the builder does not build an indexable for a post
	 * when the post type of the post is excluded from indexing.
	 *
	 * @covers ::build
	 * @covers ::should_exclude_post
	 */
	public function test_build_post_type_excluded() {
		$post_id = 1;

		$this->post
			->expects( 'is_post_indexable' )
			->with( $post_id )
			->andReturn( true );

		$this->post->expects( 'get_post' )
			->once()
			->with( $post_id )
			->andReturn(
				(object) [
					'post_type' => 'excluded_post_type',
				]
			);

		$this->post_type_helper->expects( 'is_excluded' )
			->once()
			->andReturnTrue();

		self::assertFalse( $this->instance->build( $post_id, false ) );
	}
}
