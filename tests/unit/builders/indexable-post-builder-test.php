<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Builders\Indexable_Post_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Post_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group   indexables
 * @group   builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Post_Builder
 * @covers ::<!public>
 */
class Indexable_Post_Builder_Test extends TestCase {

	/**
	 * Holds the Indexable instance.
	 *
	 * @var Indexable|Mockery\MockInterface
	 */
	private $indexable;

	/**
	 * Holds the Indexable_Repository instance.
	 *
	 * @var Indexable_Repository|Mockery\MockInterface
	 */
	private $indexable_repository;

	/**
	 * Holds the Image_Helper instance.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	private $image;

	/**
	 * Holds the Open_Graph_Image_Helper instance.
	 *
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	private $open_graph_image;

	/**
	 * Holds the Twitter_Image_Helper instance.
	 *
	 * @var Twitter_Image_Helper|Mockery\MockInterface
	 */
	private $twitter_image;

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder|Mockery\MockInterface
	 */
	protected $link_builder;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	private $post;

	/**
	 * Holds the Indexable_Post_Builder instance.
	 *
	 * @var Indexable_Post_Builder|Indexable_Post_Builder_Double|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Initializes the test mocks.
	 */
	public function setUp() {
		$this->indexable            = Mockery::mock();
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->image                = Mockery::mock( Image_Helper::class );
		$this->open_graph_image     = Mockery::mock( Open_Graph_Image_Helper::class );
		$this->twitter_image        = Mockery::mock( Twitter_Image_Helper::class );
		$this->link_builder         = Mockery::mock( Indexable_Link_Builder::class );
		$this->post                 = Mockery::mock( Post_Helper::class );

		$this->instance = Mockery::mock(
			Indexable_Post_Builder_Double::class,
			[
				$this->link_builder,
				$this->post,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();
		$this->instance->set_indexable_repository( $this->indexable_repository );
		$this->instance->set_social_image_helpers(
			$this->image,
			$this->open_graph_image,
			$this->twitter_image
		);

		return parent::setUp();
	}

	/**
	 * Mocks the 'set' method of the given indexable's ORM object with the key value pairs in `$expectations`.
	 *
	 * @param Mockery\MockInterface|Indexable $indexable_mock The indexable mock object.
	 * @param array                           $expectations   The expectation of the 'set' method of the mock object.
	 */
	private function set_indexable_set_expectations( $indexable_mock, $expectations ) {
		foreach ( $expectations as $key => $value ) {
			$indexable_mock->orm->expects( 'set' )->with( $key, $value );
		}
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = new Indexable_Post_Builder(
			$this->link_builder,
			$this->post
		);

		$this->assertAttributeInstanceOf( Indexable_Link_Builder::class, 'link_builder', $instance );
		$this->assertAttributeInstanceOf( Post_Helper::class, 'post', $instance );
	}

	/**
	 * Tests that the set_indexable_repository method sets the indexable repository.
	 *
	 * @covers ::set_indexable_repository
	 */
	public function test_set_indexable_repository() {
		$this->instance->set_indexable_repository( $this->indexable_repository );
		$this->assertAttributeInstanceOf( Indexable_Repository::class, 'indexable_repository', $this->instance );
	}

	/**
	 * Tests building a basic post indexable from postmeta.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_permalink' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_post_custom' )->with( 1 )->andReturn(
			[
				'_yoast_wpseo_focuskw'               => [ 'focuskeyword' ],
				'_yoast_wpseo_linkdex'               => [ '100' ],
				'_yoast_wpseo_is_cornerstone'        => [ '1' ],
				'_yoast_wpseo_meta-robots-noindex'   => [ '1' ],
				'_yoast_wpseo_meta-robots-adv'       => [ '' ],
				'_yoast_wpseo_content_score'         => [ '50' ],
				'_yoast_wpseo_canonical'             => [ 'https://canonical' ],
				'_yoast_wpseo_meta-robots-nofollow'  => [ '1' ],
				'_yoast_wpseo_title'                 => [ 'title' ],
				'_yoast_wpseo_metadesc'              => [ 'description' ],
				'_yoast_wpseo_opengraph-title'       => [ 'open_graph_title' ],
				'_yoast_wpseo_opengraph-image'       => [ 'open_graph_image' ],
				'_yoast_wpseo_opengraph-image-id'    => [ 'open_graph_image_id' ],
				'_yoast_wpseo_opengraph-description' => [ 'open_graph_description' ],
				'_yoast_wpseo_twitter-title'         => [ 'twitter_title' ],
				'_yoast_wpseo_twitter-image'         => [ 'twitter_image' ],
				'_yoast_wpseo_twitter-description'   => [ 'twitter_description' ],
				'_yoast_wpseo_schema_page_type'      => [ 'FAQPage' ],
				'_yoast_wpseo_schema_article_type'   => [ 'NewsArticle' ],
			]
		);
		Monkey\Functions\expect( 'maybe_unserialize' )->andReturnFirstArg();

		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_content'  => 'The content of the post',
					'post_type'     => 'post',
					'post_status'   => 'publish',
					'post_password' => '',
					'post_author'   => '1',
					'post_parent'   => '0',
				]
			);

		$indexable_expectations = [
			'object_id'                   => 1,
			'object_type'                 => 'post',
			'object_sub_type'             => 'post',
			'permalink'                   => 'https://permalink',
			'canonical'                   => 'https://canonical',
			'title'                       => 'title',
			'breadcrumb_title'            => 'breadcrumb_title',
			'description'                 => 'description',
			'open_graph_title'            => 'open_graph_title',
			'open_graph_image'            => 'open_graph_image',
			'open_graph_image_id'         => 'open_graph_image_id',
			'open_graph_description'      => 'open_graph_description',
			'twitter_title'               => 'twitter_title',
			'twitter_image'               => 'twitter_image',
			'twitter_image_id'            => null,
			'twitter_description'         => 'twitter_description',
			'is_cornerstone'              => true,
			'is_robots_noindex'           => true,
			'is_robots_nofollow'          => true,
			'is_robots_noarchive'         => false,
			'is_robots_noimageindex'      => false,
			'is_robots_nosnippet'         => false,
			'primary_focus_keyword'       => 'focuskeyword',
			'primary_focus_keyword_score' => 100,
			'readability_score'           => 50,
			'number_of_pages'             => null,
			'is_public'                   => 0,
			'post_status'                 => 'publish',
			'is_protected'                => false,
			'author_id'                   => 1,
			'post_parent'                 => 0,
			'has_public_posts'            => false,
			'blog_id'                     => 1,
			'schema_page_type'            => 'FAQPage',
			'schema_article_type'         => 'NewsArticle',
		];

		$this->indexable      = Mockery::mock( Indexable::class );
		$this->indexable->orm = Mockery::mock( ORM::class );

		$this->set_indexable_set_expectations( $this->indexable, $indexable_expectations );

		$this->link_builder->expects( 'build' )->with( $this->indexable, 'The content of the post' );

		// Mock social images method (from the social image trait).
		$this->instance->expects( 'reset_social_images' )->with( $this->indexable );
		$this->instance->expects( 'handle_social_images' )->with( $this->indexable );

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
			'source'   => 'attachment-image'
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
			'source'   => 'featured-image'
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
			'type'   => 'image/jpeg'
		];

		$this->image->allows( 'get_post_content_image' )
			->with( 123 )
			->andReturn( $image_meta );

		$actual = $this->instance->find_alternative_image( $this->indexable );

		$expected = [
			'image'  => $image_meta,
			'source' => 'first-content-image'
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

		$this->instance->expects( 'is_public_attachment' )->once()->with( $this->indexable )->andReturnFalse();

		$this->assertFalse( $this->instance->is_public( $this->indexable ) );
	}

	/**
	 * Tests is_public for when the post status is not public.
	 *
	 * @covers ::is_public
	 * @covers ::is_public_post_status
	 */
	public function test_is_public_post_status_is_not_public() {
		$this->indexable->is_protected      = false;
		$this->indexable->is_robots_noindex = false;
		$this->indexable->object_sub_type   = 'post';
		$this->indexable->post_status       = 'private';

		Monkey\Filters\expectApplied( 'wpseo_public_post_statuses' )->once();

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
	 * Tests that build returns false when no term was returned.
	 *
	 * @covers ::build
	 */
	public function test_build_term_null() {
		$this->post->expects( 'get_post' )->once()->with( 1 )->andReturn( null );

		$this->assertFalse( $this->instance->build( 1, false ) );
	}
}
