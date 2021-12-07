<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Invalid_Term_Exception;
use Yoast\WP\SEO\Exceptions\Indexable\Term_Not_Found_Exception;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\Doubles\Builders\Indexable_Term_Builder_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Term_Builder_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Term_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Term_Builder
 */
class Indexable_Term_Builder_Test extends TestCase {

	/**
	 * The options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * The instance under test.
	 *
	 * @var Mockery\Mock|Indexable_Term_Builder|Indexable_Term_Builder_Double
	 */
	protected $instance;

	/**
	 * The taxonomy helper mock.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	protected $taxonomy;

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	protected $image;

	/**
	 * The open graph image helper mock.
	 *
	 * @var Mockery\MockInterface|OG_Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * The twitter image helper mock.
	 *
	 * @var Mockery\MockInterface|Twitter_Image_Helper
	 */
	protected $twitter_image;

	/**
	 * The indexable builder versions
	 *
	 * @var Indexable_Builder_Versions|Mockery\MockInterface
	 */
	protected $versions;

	/**
	 * The post helper
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post_helper;

	/**
	 * The wpdb instance
	 *
	 * @var wpdb|Mockery\MockInterface
	 */
	protected $wpdb;

	/**
	 * Sets up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubTranslationFunctions();

		$this->taxonomy                 = Mockery::mock( Taxonomy_Helper::class );
		$this->versions                 = Mockery::mock( Indexable_Builder_Versions::class );
		$this->post_helper              = Mockery::mock( Post_Helper::class );
		$this->wpdb                     = Mockery::mock( 'wpdb' );
		$this->wpdb->posts              = 'wp_posts';
		$this->wpdb->term_relationships = 'wp_term_relationships';
		$this->wpdb->term_taxonomy      = 'wp_term_taxonomy';

		$this->versions
			->expects( 'get_latest_version_for_type' )
			->with( 'term' )
			->andReturn( 1 );

		$this->instance = new Indexable_Term_Builder_Double(
			$this->taxonomy,
			$this->versions,
			$this->post_helper,
			$this->wpdb
		);

		$this->image            = Mockery::mock( Image_Helper::class );
		$this->open_graph_image = Mockery::mock( OG_Image_Helper::class );
		$this->twitter_image    = Mockery::mock( Twitter_Image_Helper::class );


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
			$indexable_mock->orm->expects( 'set' )->with( $key, $value );
		}
	}

	/**
	 * Mocks a Twitter image that has been set by the user.
	 *
	 * @param Mockery\Mock|Indexable $indexable_mock The mocked indexable.
	 */
	protected function twitter_image_set_by_user( $indexable_mock ) {
		$indexable_mock->orm->shouldReceive( 'get' )
			->with( 'twitter_image' )
			->andReturn( 'twitter-image' );

		$indexable_mock->orm->shouldReceive( 'get' )
			->with( 'twitter_image_id' )
			->andReturn( 'twitter-image-id' );

		$this->twitter_image->shouldReceive( 'get_by_id' )
			->with( 'twitter-image-id' )
			->andReturn( 'twitter_image' );

		$indexable_mock->orm->shouldReceive( 'get' )
			->with( 'twitter_image_source' )
			->andReturn( 'set-by-user' );
	}

	/**
	 * Mocks an Open Graph image that is set by the user.
	 *
	 * @param Mockery\Mock|Indexable $indexable_mock The mocked indexable.
	 * @param array                  $image_meta     The mocked meta data of the image.
	 */
	protected function open_graph_image_set_by_user( $indexable_mock, $image_meta ) {
		$indexable_mock->orm->shouldReceive( 'get' )
			->with( 'open_graph_image' )
			->andReturn( 'open-graph-image' );

		$indexable_mock->orm->shouldReceive( 'get' )
			->twice()
			->with( 'open_graph_image_id' )
			->andReturn( 'open-graph-image-id' );

		$indexable_mock->orm->shouldReceive( 'get' )
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
			Indexable_Term_Builder::class,
			$this->instance
		);
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$term = (object) [
			'taxonomy'    => 'category',
			'term_id'     => 1,
			'name'        => 'some_category',
			'description' => 'description',
		];

		Monkey\Functions\expect( 'get_term' )->once()->with( 1 )->andReturn( $term );
		Monkey\Functions\expect( 'get_term_link' )->once()->with( $term, 'category' )->andReturn( 'https://example.org/category/1' );
		Monkey\Functions\expect( 'is_wp_error' )->twice()->andReturn( false );

		$this->taxonomy->expects( 'get_term_meta' )
			->once()
			->with( $term )
			->andReturn(
				[
					'wpseo_focuskw'               => 'focuskeyword',
					'wpseo_linkdex'               => '75',
					'wpseo_noindex'               => 'noindex',
					'wpseo_meta-robots-adv'       => '',
					'wpseo_content_score'         => '50',
					'wpseo_canonical'             => 'https://canonical-term',
					'wpseo_meta-robots-nofollow'  => '1',
					'wpseo_title'                 => 'title',
					'wpseo_desc'                  => 'description',
					'wpseo_opengraph-title'       => 'open_graph_title',
					'wpseo_opengraph-image'       => 'open_graph_image',
					'wpseo_opengraph-image-id'    => 'open_graph_image_id',
					'wpseo_opengraph-description' => 'open_graph_description',
					'wpseo_twitter-title'         => 'twitter_title',
					'wpseo_twitter-image'         => 'twitter_image',
					'wpseo_twitter-image-id'      => 'twitter_image_id',
					'wpseo_twitter-description'   => 'twitter_description',
				]
			);

		$this->post_helper->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->wpdb->expects( 'prepare' )->once()->with(
			"
			SELECT MAX(p.post_modified_gmt) AS last_modified, MIN(p.post_date_gmt) AS published_at
			FROM	{$this->wpdb->posts} AS p
			INNER JOIN {$this->wpdb->term_relationships} AS term_rel
				ON		term_rel.object_id = p.ID
			INNER JOIN {$this->wpdb->term_taxonomy} AS term_tax
				ON		term_tax.term_taxonomy_id = term_rel.term_taxonomy_id
				AND		term_tax.taxonomy = %s
				AND		term_tax.term_id = %d
			WHERE	p.post_status IN (%s)
				AND		p.post_password = ''
		",
			[ 'category', 1, 'publish' ]
		)->andReturn( 'PREPARED_QUERY' );
		$this->wpdb->expects( 'get_row' )->once()->with( 'PREPARED_QUERY' )->andReturn(
			(object) [
				'last_modified' => '1234-12-12 00:00:00',
				'published_at'  => '1234-12-12 00:00:00',
			]
		);

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );

		$indexable_expectations = [
			'object_id'                   => 1,
			'object_type'                 => 'term',
			'object_sub_type'             => 'category',
			'permalink'                   => 'https://example.org/category/1',
			'canonical'                   => 'https://canonical-term',
			'title'                       => 'title',
			'breadcrumb_title'            => 'some_category',
			'description'                 => 'description',
			'open_graph_title'            => 'open_graph_title',
			'open_graph_image'            => 'open_graph_image',
			'open_graph_image_id'         => 'open_graph_image_id',
			'open_graph_description'      => 'open_graph_description',
			'twitter_title'               => 'twitter_title',
			'twitter_image'               => 'twitter_image',
			'twitter_image_id'            => 'twitter_image_id',
			'twitter_description'         => 'twitter_description',
			'is_cornerstone'              => false,
			'is_robots_noindex'           => true,
			'is_robots_nofollow'          => null,
			'is_robots_noarchive'         => null,
			'is_robots_noimageindex'      => null,
			'is_robots_nosnippet'         => null,
			'primary_focus_keyword'       => 'focuskeyword',
			'primary_focus_keyword_score' => 75,
			'readability_score'           => 50,
			'version'                     => 1,
		];

		$this->set_indexable_set_expectations( $indexable_mock, $indexable_expectations );

		// Reset all social images first.
		$this->set_indexable_set_expectations(
			$indexable_mock,
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
		$this->open_graph_image_set_by_user( $indexable_mock, $image_meta );
		$this->twitter_image_set_by_user( $indexable_mock );

		// We expect the open graph image, its source and its metadata to be set.
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'set-by-user' );
		$indexable_mock->orm->expects( 'set' )
			->with( 'open_graph_image', 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg' );
		$indexable_mock->orm->expects( 'set' )
			// phpcs:ignore Yoast.Yoast.AlternativeFunctions.json_encode_json_encodeWithAdditionalParams -- Test code, mocking WP.
			->with( 'open_graph_image_meta', \json_encode( $image_meta, ( \JSON_PRETTY_PRINT | \JSON_UNESCAPED_SLASHES ) ) );

		// We expect the twitter image and its source to be set.
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'set-by-user' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );

		$indexable_mock->orm->expects( 'offsetExists' )->once()->with( 'breadcrumb_title' )->andReturnFalse();
		$indexable_mock->orm->expects( 'set' )->once()->with( 'breadcrumb_title', null );

		$indexable_mock->orm->expects( 'get' )->twice()->with( 'is_robots_noindex' )->andReturn( true );
		$indexable_mock->orm->expects( 'set' )->once()->with( 'is_public', false );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_published_at', '1234-12-12 00:00:00' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 00:00:00' );

		$this->instance->build( 1, $indexable_mock );
	}

	/**
	 * Tests that build throws an exception when no term was returned.
	 *
	 * @covers ::build
	 */
	public function test_build_term_null() {
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( null );

		$this->expectException( Term_Not_Found_Exception::class );

		$this->instance->build( 1, false );
	}

	/**
	 * Tests that build throws an exception when the term is a WP error.
	 *
	 * @covers ::build
	 */
	public function test_build_term_error() {
		$error = Mockery::mock( '\WP_Error' );
		$error
			->expects( 'get_error_message' )
			->andReturn( 'An error message' );

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $error );

		$this->expectException( Invalid_Term_Exception::class );

		$this->instance->build( 1, false );
	}

	/**
	 * Tests that build returns false when the term link is a WP error.
	 *
	 * @covers ::build
	 */
	public function test_build_term_link_error() {
		$term = (object) [ 'taxonomy' => 'tax' ];

		$error = Mockery::mock( '\WP_Error' );
		$error
			->expects( 'get_error_message' )
			->andReturn( 'An error message' );

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );
		Monkey\Functions\expect( 'get_term_link' )
			->once()
			->with( $term, 'tax' )
			->andReturn( $error );

		$this->expectException( Invalid_Term_Exception::class );

		$this->assertFalse( $this->instance->build( 1, false ) );
	}

	/**
	 * Tests that the get_noindex_value method correctly converts a `noindex`
	 * to `true`.
	 *
	 * @covers ::get_noindex_value
	 */
	public function test_get_noindex_value_noindex() {
		$this->assertTrue( $this->instance->get_noindex_value( 'noindex' ) );
	}

	/**
	 * Tests that the get_noindex_value method correctly converts a `noindex`
	 * to `true`.
	 *
	 * @covers ::get_noindex_value
	 */
	public function test_get_noindex_value_index() {
		$this->assertFalse( $this->instance->get_noindex_value( 'index' ) );
	}

	/**
	 * Tests that the get_noindex_value method correctly converts a `noindex`
	 * to `true`.
	 *
	 * @covers ::get_noindex_value
	 */
	public function test_get_noindex_value_invalid() {
		$this->assertNull( $this->instance->get_noindex_value( 'invalid' ) );
	}

	/**
	 * Tests that an alternative image is found in the content, if one exists.
	 */
	public function test_find_alternative_image_content_image() {
		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$object_id           = 123;

		$indexable_mock->orm->expects( 'get' )
			->with( 'object_id' )
			->andReturn( $object_id );

		$image = 'http://basic.wordpress.test/wp-content/uploads/2020/07/WordPress5.jpg';

		$this->image->expects( 'get_term_content_image' )
			->with( $object_id )
			->andReturn( $image );

		$expected = [
			'image'  => $image,
			'source' => 'first-content-image',
		];
		$actual   = $this->instance->find_alternative_image( $indexable_mock );
	}

	/**
	 * Tests that an alternative image is found in the content, if one exists.
	 */
	public function test_find_alternative_image_no_content_image() {
		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$object_id           = 123;

		$indexable_mock->orm->expects( 'get' )
			->with( 'object_id' )
			->andReturn( $object_id );

		$this->image->expects( 'get_term_content_image' )
			->with( $object_id )
			->andReturn( null );

		$this->assertFalse( $this->instance->find_alternative_image( $indexable_mock ) );
	}

	/**
	 * Tests the get_keyword_score method.
	 *
	 * @covers ::get_keyword_score
	 */
	public function test_get_keyword_score() {
		$this->assertSame( 2, $this->instance->get_keyword_score( 'keyword', 2 ) );
	}

	/**
	 * Tests the get_keyword_score method.
	 *
	 * @covers ::get_keyword_score
	 */
	public function test_get_keyword_score_no_keyword() {
		$this->assertNull( $this->instance->get_keyword_score( '', 2 ) );
	}

	/**
	 * Test the get_meta_value method.
	 *
	 * @covers ::get_meta_value
	 */
	public function test_get_meta_value() {
		$term_meta = [
			'wpseo_focuskw' => 'focuskeyword',
			'wpseo_title'   => '',
		];

		$this->assertSame( 'focuskeyword', $this->instance->get_meta_value( 'wpseo_focuskw', $term_meta ) );
	}

	/**
	 * Test that the get_meta_value method returns `null`
	 * when the meta key does not exist.
	 *
	 * @covers ::get_meta_value
	 */
	public function test_get_meta_value_non_existing_meta_key() {
		$term_meta = [
			'wpseo_focuskw' => 'focuskeyword',
			'wpseo_title'   => '',
		];

		$this->assertNull( $this->instance->get_meta_value( 'wpseo_desc', $term_meta ) );
	}

	/**
	 * Test that the get_meta_value method returns `null`
	 * when the meta value is empty.
	 *
	 * @covers ::get_meta_value
	 */
	public function test_get_meta_value_empty_value() {
		$term_meta = [
			'wpseo_focuskw' => 'focuskeyword',
			'wpseo_title'   => '',
		];

		$this->assertNull( $this->instance->get_meta_value( 'wpseo_title', $term_meta ) );
	}
}
