<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Generators\Breadcrumbs_Generator;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Breadcrumbs_Generator_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Breadcrumbs_Generator
 *
 * @group generators
 * @group breadcrumbs
 */
final class Breadcrumbs_Generator_Test extends TestCase {

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
	 * The post type helper.
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
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url_helper;

	/**
	 * The pagination helper.
	 *
	 * @var Pagination_Helper
	 */
	private $pagination_helper;

	/**
	 * Method that is called before each individual test case.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository   = Mockery::mock( Indexable_Repository::class );
		$this->options      = Mockery::mock( Options_Helper::class );
		$this->current_page = Mockery::mock( Current_Page_Helper::class );

		$this->post_type_helper  = Mockery::mock( Post_Type_Helper::class );
		$this->url_helper        = Mockery::mock( Url_Helper::class );
		$this->pagination_helper = Mockery::mock( Pagination_Helper::class );
		$this->instance          = new Breadcrumbs_Generator( $this->repository, $this->options, $this->current_page, $this->post_type_helper, $this->url_helper, $this->pagination_helper );
		$this->context           = Mockery::mock( Meta_Tags_Context_Mock::class );
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
	 *
	 * @return void
	 */
	public function test_generate( $scenario, $page_for_posts, $breadcrumb_home, $front_page_id, $message ) {
		$this->indexable                   = Mockery::mock( Indexable_Mock::class );
		$this->indexable->object_id        = 1;
		$this->indexable->object_type      = 'post';
		$this->indexable->object_sub_type  = 'post';
		$this->indexable->permalink        = 'https://example.com/post';
		$this->indexable->breadcrumb_title = 'post';
		$this->context->indexable          = $this->indexable;
		$this->set_scenario( $scenario );

		$is_simple_page = false;

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
			$is_simple_page = true;
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
		else {
			$this->repository
				->expects( 'get_ancestors' )
				->once()
				->with( $this->indexable )
				->andReturn( $this->get_ancestors() );
		}
		$this->current_page
			->expects( 'get_page_type' )
			->twice()
			->andReturn( $page_type );

		$this->current_page
			->expects( 'is_simple_page' )
			->andReturn( $is_simple_page );

		if ( ! $is_simple_page ) {
			$this->current_page
				->expects( 'is_paged' )
				->once()
				->andReturnFalse();
		}
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
		if ( $scenario === 'on-home-page' ) {
			$expected = [
				[
					'url'  => 'https://example.com/post',
					'text' => 'home',
					'id'   => 1,
				],
			];
		}

		$this->assertEquals(
			$expected,
			\array_slice( $this->instance->generate( $this->context ), -2 ),
			$message
		);
	}

	/**
	 * Provides data for the generate test.
	 *
	 * @return array<array<string,int>> The data to use.
	 */
	public static function generate_provider() {
		return [
			'hide-blog-page' => [
				'scenario'         => 'hide-blog-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the display blog page option disabled.',
			],
			'show_posts_on_front' => [
				'scenario'         => 'show_posts_on_front',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the posts being shown on front',
			],
			'show_page_on_front' => [
				'scenario'         => 'show_page_on_front',
				'page_for_posts'   => 0,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with the page being shown on front, but no page being set',
			],
			'on-home-page' => [
				'scenario'         => 'on-home-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being the home page',
			],
			'on-search-page' => [
				'scenario'         => 'on-search-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being the search page',
			],
			'on-singular-post-page' => [
				'scenario'         => 'on-singular-post-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being a singular post page',
			],
			'not-on-home-search-or-singular-post-page' => [
				'scenario'         => 'not-on-home-search-or-singular-post-page',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 0,
				'message'          => 'Tests with current request being not the home, search or a singular post page',
			],
			'on-singular-post-page-with-front-page-id' => [
				'scenario'         => 'on-singular-post-page-with-front-page-id',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 2,
				'message'          => 'Tests with current request being a singular post page and a front page being set',
			],
			'show-custom-post-type' => [
				'scenario'         => 'show-custom-post-type',
				'page_for_posts'   => 1,
				'breadcrumb_home'  => 'home',
				'front_page_id'    => 2,
				'message'          => 'Tests with current request being a singular custom post page',
			],
		];
	}

	/**
	 * Tests the generation of the bread crumbs for a date archive.
	 *
	 * @dataProvider date_archive_provider
	 *
	 * @covers ::generate
	 * @covers ::get_date_archive_crumb
	 * @covers ::add_paged_crumb
	 *
	 * @param string   $scenario     Scenario to test (day, month, year).
	 * @param bool     $is_paged     Is the page being paged.
	 * @param int      $current_page The current page number.
	 * @param string[] $expected     The expected output.
	 *
	 * @return void
	 */
	public function test_with_date_archive( $scenario, $is_paged, $current_page, $expected ) {
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();
		$this->setup_expectations_for_date_archive( $scenario, $is_paged, $current_page );

		$this->assertEquals(
			$expected,
			\array_slice( $this->instance->generate( $this->context ), -2 )
		);
	}

	/**
	 * Provides data to test_with_date_archive.
	 *
	 * @return array<array<string,int,string[]>> Test data to use.
	 */
	public static function date_archive_provider() {
		return [
			'for_day' => [
				'scenario'     => 'day',
				'is_paged'     => true,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/11/',
						'text' => 'Archive August 11th, 2020',
					],
					[
						'text' => 'Page 5',
					],
				],
			],
			'for_day_on_first_page' => [
				'scenario'     => 'day',
				'is_paged'     => true,
				'current_page' => 1,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/11/',
						'text' => 'Archive August 11th, 2020',
					],
				],
			],
			'for_day_not_paged' => [
				'scenario'     => 'day',
				'is_paged'     => false,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/11/',
						'text' => 'Archive August 11th, 2020',
					],
				],
			],
			'for_month' => [
				'scenario'     => 'month',
				'is_paged'     => true,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/',
						'text' => 'Archive August',
					],
					[
						'text' => 'Page 5',
					],
				],
			],
			'for_month_on_first_page' => [
				'scenario'     => 'month',
				'is_paged'     => true,
				'current_page' => 1,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/',
						'text' => 'Archive August',
					],
				],
			],
			'for_month_not_paged' => [
				'scenario'     => 'month',
				'is_paged'     => false,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/08/',
						'text' => 'Archive August',
					],
				],
			],
			'for_year' => [
				'scenario'     => 'year',
				'is_paged'     => true,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/',
						'text' => 'Archive 2020',
					],
					[
						'text' => 'Page 5',
					],
				],
			],
			'for_year_on_first_page' => [
				'scenario'     => 'year',
				'is_paged'     => true,
				'current_page' => 1,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/',
						'text' => 'Archive 2020',
					],
				],
			],
			'for_year_not_paged' => [
				'scenario'     => 'year',
				'is_paged'     => false,
				'current_page' => 5,
				'expected'     => [
					[
						'url'  => 'https://example.com/2020/',
						'text' => 'Archive 2020',
					],
				],
			],
		];
	}

	/**
	 * Sets some expectations specific for the data archive tests.
	 *
	 * @param string $scenario     The scenario to set.
	 * @param bool   $is_paged     When the page is paged.
	 * @param bool   $current_page The current page number.
	 *
	 * @return void
	 */
	protected function setup_expectations_for_date_archive( $scenario, $is_paged, $current_page ) {
		$this->indexable                   = Mockery::mock( Indexable_Mock::class );
		$this->indexable->object_id        = 1;
		$this->indexable->object_type      = 'date-archive';
		$this->indexable->object_sub_type  = null;
		$this->indexable->permalink        = null;
		$this->indexable->breadcrumb_title = null;
		$this->context                     = Mockery::mock( Meta_Tags_Context_Mock::class );
		$this->context->indexable          = $this->indexable;

		$is_day   = false;
		$is_month = false;
		$is_year  = false;

		switch ( $scenario ) {
			case 'day':
				$is_day = true;

				Monkey\Functions\expect( 'get_the_date' )
					->once()
					->withNoArgs()
					->andReturn( 'August 11th, 2020' );

				Monkey\Functions\expect( 'get_the_date' )
					->once()
					->with( 'Y/m/d' )
					->andReturn( '2020/08/11' );
				break;
			case 'month':
				$is_month = true;

				Monkey\Functions\expect( 'single_month_title' )
					->once()
					->with( ' ', false )
					->andReturn( 'August' );

				Monkey\Functions\expect( 'get_the_date' )
					->once()
					->with( 'Y/m' )
					->andReturn( '2020/08' );

				break;

			case 'year':
				$is_year = true;

				Monkey\Functions\expect( 'get_the_date' )
					->once()
					->with( 'Y' )
					->andReturn( 2020 );

				break;
		}

		Monkey\Functions\expect( 'is_day' )->andReturn( $is_day );
		Monkey\Functions\expect( 'is_month' )->andReturn( $is_month );
		Monkey\Functions\expect( 'is_year' )->andReturn( $is_year );

		$this->current_page
			->expects( 'is_paged' )
			->andReturn( $is_paged );
		$this->current_page
			->expects( 'get_page_type' )
			->once()
			->andReturn( 'date-archive' );

		if ( $is_paged ) {
			$this->pagination_helper
				->expects( 'get_current_page_number' )
				->andReturn( $current_page );
		}

		$this->options
			->expects( 'get' )
			->with( 'breadcrumbs-home' )
			->andReturn( '' );

		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'page_for_posts' )
			->andReturn( false );

		$this->repository
			->expects( 'get_ancestors' )
			->once()
			->with( $this->indexable )
			->andReturn( [] );

		$this->url_helper
			->expects( 'home' )
			->andReturn( 'https://example.com/' );

		$this->options
			->expects( 'get' )
			->with( 'breadcrumbs-archiveprefix' )
			->andReturn( 'Archive' );

		$this->current_page
			->expects( 'is_simple_page' )
			->once()
			->andReturnFalse();
	}

	/**
	 * Sets expectations based on the given scenario.
	 *
	 * @param string $scenario The scenario.
	 *
	 * @return void
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
