<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Term_Builder
 * @covers ::<!public>
 */
class Indexable_Term_Builder_Test extends TestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * The instance under test.
	 *
	 * @var Mockery\Mock|Indexable_Term_Builder
	 */
	private $instance;

	/**
	 * The taxonomy helper mock.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * The image helper mock.
	 *
	 * @var Mockery\MockInterface|Image_Helper
	 */
	private $image;

	/**
	 * The open graph image helper mock.
	 *
	 * @var Mockery\MockInterface|OG_Image_Helper
	 */
	private $open_graph_image;

	/**
	 * The twitter image helper mock.
	 *
	 * @var Mockery\MockInterface|Twitter_Image_Helper
	 */
	private $twitter_image;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->taxonomy = Mockery::mock( Taxonomy_Helper::class );

		$this->instance = Mockery::mock( Indexable_Term_Builder::class, [ $this->taxonomy ] )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

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
	private function set_indexable_set_expectations( $indexable_mock, $expectations ) {
		foreach ( $expectations as $key => $value ) {
			$indexable_mock->orm->expects( 'set' )->with( $key, $value );
		}
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$term = (object) [
			'taxonomy' => 'category',
			'term_id'  => 1,
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
					'wpseo_bctitle'               => 'breadcrumb_title',
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

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );

		$indexable_expectations = [
			'object_id'                   => 1,
			'object_type'                 => 'term',
			'object_sub_type'             => 'category',
			'permalink'                   => 'https://example.org/category/1',
			'canonical'                   => 'https://canonical-term',
			'title'                       => 'title',
			'breadcrumb_title'            => 'breadcrumb_title',
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
		];

		$this->set_indexable_set_expectations( $indexable_mock, $indexable_expectations );

		$this->instance->expects( 'reset_social_images' )->with( $indexable_mock );
		$this->instance->expects( 'handle_social_images' )->with( $indexable_mock );

		$indexable_mock->orm->expects( 'offsetExists' )->once()->with( 'breadcrumb_title' )->andReturnTrue();
		$indexable_mock->orm->expects( 'get' )->once()->with( 'breadcrumb_title' )->andReturnTrue();

		$indexable_mock->orm->expects( 'get' )->twice()->with( 'is_robots_noindex' )->andReturn( true );
		$indexable_mock->orm->expects( 'set' )->once()->with( 'is_public', false );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$this->instance->build( 1, $indexable_mock );
	}

	/**
	 * Tests that build returns false when no term was returned.
	 *
	 * @covers ::build
	 */
	public function test_build_term_null() {
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( null );

		$this->assertFalse( $this->instance->build( 1, false ) );
	}

	/**
	 * Tests that build returns false when the term is a WP error.
	 *
	 * @covers ::build
	 */
	public function test_build_term_error() {
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( Mockery::mock( '\WP_Error' ) );

		$this->assertFalse( $this->instance->build( 1, false ) );
	}

	/**
	 * Tests that build returns false when the term link is a WP error.
	 *
	 * @covers ::build
	 */
	public function test_build_term_link_error() {
		$term = (object) [ 'taxonomy' => 'tax' ];

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn( $term );
		Monkey\Functions\expect( 'get_term_link' )
			->once()
			->with( $term, 'tax' )
			->andReturn( Mockery::mock( '\WP_Error' ) );

		$this->assertFalse( $this->instance->build( 1, false ) );
	}
}
