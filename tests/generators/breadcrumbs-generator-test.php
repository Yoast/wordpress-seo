<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Generators
 */

namespace Yoast\WP\SEO\Tests\Generators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Breadcrumbs_Generator
 *
 * @group generators
 * @group breadcrumbs
 */
class Breadcrumbs_Generator_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Mockery\MockInterface|Breadcrumbs_Generator
	 */
	private $instance;

	/**
	 * Represents the indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * Represents the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page;

	/**
	 * The post type helper
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type_helper;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Represents the meta tags context.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Mock
	 */
	private $context;

	/**
	 * Represents the indexable.
	 *
	 * @var Mockery\MockInterface|Indexable_Mock
	 */
	private $indexable;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->repository       = Mockery::mock( Indexable_Repository::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->current_page     = Mockery::mock( Current_Page_Helper::class );
		$this->post_type_helper = Mockery::mock( Post_Type_Helper::class );
		$this->instance         = new Breadcrumbs_Generator( $this->repository, $this->options, $this->current_page, $this->post_type_helper );

		$this->indexable                   = Mockery::mock( Indexable_Mock::class );
		$this->indexable->object_id        = 1;
		$this->indexable->object_type      = 'post';
		$this->indexable->object_sub_type  = 'post';
		$this->indexable->permalink        = 'https://example.com/post';
		$this->indexable->breadcrumb_title = 'post';
		$this->context                     = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->context->indexable          = $this->indexable;
	}

	/**
	 * Tests the working of the generate method.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::should_have_blog_crumb
	 *
	 * @dataProvider generate_provider
	 *
	 * @param string $scenario        The scenario to test.
	 * @param int    $page_for_posts  ID for page for posts option.
	 * @param bool   $breadcrumb_home Show the home breadcrumbs.
	 * @param int    $front_page_id   The front page ID.
	 * @param string $message         Message to show when test fails.
	 */
	public function test_generate( $scenario, $page_for_posts, $breadcrumb_home, $front_page_id, $message ) {
		$this->set_scenario( $scenario );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( $page_for_posts );

		$this->options
			->expects( 'get' )
			->once()
			->with( 'breadcrumbs-home' )
			->andReturn( $breadcrumb_home );

		if ( $front_page_id !== 0 ) {
			$this->repository
				->expects( 'find_by_id_and_type' )
				->once()
				->with( $front_page_id, 'post' )
				->andReturn( $this->indexable );
		}
		elseif ( $scenario !== 'on-home-page' ) {
			$this->repository
				->expects( 'find_for_home_page' )
				->once()
				->andReturn( $this->indexable );
		}

		if ( \strpos( $scenario, 'on-singular-post-page' ) === 0 ) {
			$this->repository
				->expects( 'find_by_id_and_type' )
				->once()
				->with( $page_for_posts, 'post' )
				->andReturn( $this->indexable );
		}

		if ( $scenario === 'show-custom-post-type' ) {
			$this->post_type_helper
				->expects( 'has_archive' )
				->once()
				->with( 'custom' )
				->andReturnTrue();

			$this->repository
				->expects( 'find_for_post_type_archive' )
				->once()
				->with( 'custom' )
				->andReturn( $this->indexable );
		}

		$this->repository
			->expects( 'get_ancestors' )
			->once()
			->with( $this->indexable )
			->andReturn( $this->get_ancestors() );

		if ( $scenario !== 'on-home-page' ) {
			$this->current_page
				->expects( 'get_front_page_id' )
				->once()
				->andReturn( $front_page_id );
		}

		$page_type       = 'Post_Type';
		$first_link_text = 'post-type';
		if ( $scenario === 'on-home-page' ) {
			$page_type       = 'Home_Page';
			$first_link_text = 'home';
		}
		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->andReturn( $page_type );


		$expected = [
			[
				'url'       => 'https://example.com/post-type',
				'text'      => $first_link_text,
				'ptarchive' => 'post',
			],
			[
				'url'  => 'https://example.com/post',
				'text' => 'post',
				'id'   => 1,
			],
		];

		$this->assertEquals(
			$expected,
			\array_slice( $this->instance->generate( $this->context ), -2 ),
			$message
		);
	}

	/**
	 * Provides data for the generate test.
	 *
	 * @return array The data to use.
	 */
	public function generate_provider() {
		return [
			[
				'scenario'         => 'hide-blog-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the display blog page option disabled.',
			],
			[
				'scenario'         => 'show_posts_on_front',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the posts being shown on front',
			],
			[
				'scenario'         => 'show_page_on_front',
				'page_for_posts'   => 0,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the page being shown on front, but no page being set',
			],
			[
				'scenario'         => 'on-home-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being the home page',
			],
			[
				'scenario'         => 'on-search-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being the search page',
			],
			[
				'scenario'         => 'on-singular-post-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being a singular post page',
			],
			[
				'scenario'         => 'not-on-home-search-or-singular-post-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being not the home, search or a singular post page',
			],
			[
				'scenario'         => 'on-singular-post-page-with-front-page-id',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 2,
				'message'          => 'Tests with current request being a singular post page and a front page being set',
			],
			[
				'scenario'         => 'show-custom-post-type',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 2,
				'message'          => 'Tests with current request being a singular custom post page',
			],
		];
	}

	/**
	 * Sets expectations based on the given scenario.
	 *
	 * @param string $scenario The scenario.
	 */
	private function set_scenario( $scenario ) {
		if ( $scenario === 'hide-blog-page' ) {
			return;
		}

		if ( $scenario === 'show_posts_on_front' ) {
			Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'show_on_front' )
				->andReturn( 'posts' );

			return;
		}

		if ( $scenario !== 'show_page_on_front' ) {
			$this->options
				->expects( 'get' )
				->with( 'breadcrumbs-display-blog-page' )
				->andReturnTrue();
		}


		if ( $scenario === 'show-custom-post-type' ) {
			$this->indexable->object_sub_type = 'custom';
		}

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'show_on_front' )
			->andReturn( 'page' );

		$is_home     = ( $scenario === 'on-home-page' );
		$is_search   = ( $scenario === 'on-search-page' );
		$is_singular = ( \strpos( $scenario, 'on-singular-post-page' ) === 0 );

		Monkey\Functions\expect( 'is_home' )
			->andReturn( $is_home );

		Monkey\Functions\expect( 'is_search' )
			->andReturn( $is_search );

		Monkey\Functions\expect( 'is_singular' )
			->andReturn( $is_singular );
	}

	/**
	 * Retrieves the 'ancestors'.
	 *
	 * @return Indexable_Mock[] The ancestors.
	 */
	private function get_ancestors() {
		$post_type_indexable                   = new Indexable_Mock();
		$post_type_indexable->object_type      = 'post-type-archive';
		$post_type_indexable->object_sub_type  = 'post';
		$post_type_indexable->permalink        = 'https://example.com/post-type';
		$post_type_indexable->breadcrumb_title = 'post-type';

		return [ $post_type_indexable ];
	}
}
