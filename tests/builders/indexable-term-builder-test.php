<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as OG_Image_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Helpers\Twitter\Image_Helper as Twitter_Image_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

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

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'term' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_sub_type', 'category' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://example.org/category/1' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://canonical-term' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_title', 'open_graph_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'open_graph_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'image.jpg' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_id', 'open_graph_image_id' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'first-content-image' );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_description', 'open_graph_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_title', 'twitter_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'image.jpg' );
		$indexable_mock->orm->expects( 'set' )->times( 2 )->with( 'twitter_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'first-content-image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_description', 'twitter_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword', 'focuskeyword' );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword_score', 75 );
		$indexable_mock->orm->expects( 'set' )->with( 'readability_score', 50 );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_id' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_source' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$indexable_mock->orm->expects( 'offsetExists' )->once()->with( 'breadcrumb_title' )->andReturnTrue();
		$indexable_mock->orm->expects( 'get' )->once()->with( 'breadcrumb_title' )->andReturnTrue();

		$indexable_mock->orm->expects( 'get' )->twice()->with( 'is_robots_noindex' )->andReturn( true );
		$indexable_mock->orm->expects( 'set' )->once()->with( 'is_public', false );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		$image            = Mockery::mock( Image_Helper::class );
		$open_graph_image = Mockery::mock( OG_Image_Helper::class );
		$twitter_image    = Mockery::mock( Twitter_Image_Helper::class );

		$image
			->expects( 'get_term_content_image' )
			->once()
			->andReturn( 'image.jpg' );

		$taxonomy = Mockery::mock( Taxonomy_Helper::class );
		$taxonomy->expects( 'get_term_meta' )
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
					'wpseo_twitter-description'   => 'twitter_description',
				]
			);

		$builder = new Indexable_Term_Builder( $taxonomy );

		$builder->set_social_image_helpers(
			$image,
			$open_graph_image,
			$twitter_image
		);

		$builder->build( 1, $indexable_mock );
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

		$builder = new Indexable_Term_Builder( Mockery::mock( Taxonomy_Helper::class ) );

		$this->assertFalse( $builder->build( 1, false ) );
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

		$builder = new Indexable_Term_Builder( Mockery::mock( Taxonomy_Helper::class ) );

		$this->assertFalse( $builder->build( 1, false ) );
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

		$builder = new Indexable_Term_Builder( Mockery::mock( Taxonomy_Helper::class ) );

		$this->assertFalse( $builder->build( 1, false ) );
	}
}
