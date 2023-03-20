<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Mockery;
use WP_Query;
use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\Crawl_Cleanup_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;


/**
 * Class Crawl_Cleanup_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Crawl_Cleanup_Helper
 *
 * @group integrations
 */
class Crawl_Cleanup_Helper_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Crawl_Cleanup_Helper
	 */
	private $instance;

	/**
	 * The current page helper
	 *
	 * @var Mockery\MockInterface
	 */
	private $current_page_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $options_helper;

	/**
	 * The URL helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $url_helper;

	/**
	 * The Redirect helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $redirect_helper;

	/**
	 * Sets up the tests.
	 *
	 * @covers ::__construct
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->redirect_helper     = Mockery::mock( Redirect_Helper::class );

		$this->instance = new Crawl_Cleanup_Helper(
			$this->current_page_helper,
			$this->options_helper,
			$this->url_helper,
			$this->redirect_helper
		);
	}

	/**
	 * Tests should_avoid_redirect.
	 *
	 * @covers ::should_avoid_redirect
	 *
	 * @dataProvider should_avoid_redirect_provider
	 *
	 * @param boolean $is_robots is_robots return value.
	 * @param string  $sitemap get_query_var return value.
	 * @param array   $get_response get_response value.
	 * @param boolean $is_user_logged_in is_user_logged_in return value.
	 * @param int     $expected The return value from the should_avoid_redirect function.
	 */
	public function test_should_avoid_redirect( $is_robots, $sitemap, $get_response, $is_user_logged_in, $expected ) {

		$_GET = $get_response;

		Monkey\Functions\expect( 'get_query_var' )
			->with( 'sitemap' )
			->andReturn( $sitemap );

		Monkey\Functions\stubs(
			[
				'is_robots'         => $is_robots,
				'is_user_logged_in' => $is_user_logged_in,
			]
		);

		$this->assertSame( $expected, $this->instance->should_avoid_redirect() );
	}

	/**
	 *
	 * Data provider for test_clean_permalinks_avoid_redirect.
	 *
	 * @return array is_roboto, get_query_var( 'sitemap' ), $_GET, is_user_logged_in(), expected.
	 */
	public function should_avoid_redirect_provider() {
		return [
			[ true, false, null, false, true ],
			[ false, true, null, false, true ],
			[ false, false, null, true, true ],
			[ false, false, null, false, true ],
			[
				false,
				false,
				[
					'preview'       => 'random preview',
					'preview_nonce' => '1234',
				],
				false,
				false,
			],
		];
	}

	/**
	 * Tests get_allowed_extravars.
	 *
	 * @covers ::get_allowed_extravars
	 *
	 * @dataProvider get_allowed_extravars_provider
	 *
	 * @param string $clean_permalinks_extra_variables return value.
	 * @param array  $permalink_vars The return value from the filter to add extra vars.
	 * @param array  $expeted The allowed extra vars (is set in settings under 'Additional URL parameters to allow').
	 */
	public function test_get_allowed_extravars( $clean_permalinks_extra_variables, $permalink_vars, $expeted ) {

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\allowlist_permalink_vars', [] )
			->andReturn( $permalink_vars );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks_extra_variables' )
			->once()
			->andReturn( $clean_permalinks_extra_variables );

		$this->assertSame( $expeted, $this->instance->get_allowed_extravars() );
	}

	/**
	 *
	 * Data provider for test_clean_permalinks.
	 *
	 * @return array avoid_redirect, expected.
	 */
	public function get_allowed_extravars_provider() {
		return [
			[ 'variable1,variable2,variable3', [], [ 'variable1', 'variable2', 'variable3' ] ],
			[ '', [], [] ],
			[ 'variable1,variable2,variable3', [ 'variable4', 'variable5' ], [ 'variable4', 'variable5', 'variable1', 'variable2', 'variable3' ] ],
		];
	}

	/**
	 * Tests front_page_url.
	 *
	 * @covers ::front_page_url
	 *
	 * @dataProvider front_page_url_provider
	 *
	 * @param boolean $is_home_posts_page is_home_posts_page return value.
	 * @param boolean $is_home_static_page is_home_static_page return value.
	 * @param int     $static_times The times is_home_static_page function is called.
	 * @param int     $home_url_times home_url times called.
	 * @param int     $permalink_times get_permalink times called.
	 * @param string  $expected expected return value.
	 */
	public function test_front_page_url( $is_home_posts_page, $is_home_static_page, $static_times, $home_url_times, $permalink_times, $expected ) {

		$GLOBALS['post'] = (object) [ 'ID' => 5 ];

		$this->current_page_helper
			->expects( 'is_home_posts_page' )
			->once()
			->andReturn( $is_home_posts_page );

		Monkey\Functions\expect( 'home_url' )
			->with( '/' )
			->times( $home_url_times )
			->andReturn( 'http://basic.wordpress.test/' );

		$this->current_page_helper
			->expects( 'is_home_static_page' )
			->times( $static_times )
			->andReturn( $is_home_static_page );

		Monkey\Functions\expect( 'get_permalink' )
			->with( 5 )
			->times( $permalink_times )
			->andReturn( 'http://basic.wordpress.test/permalink' );

		$this->assertSame( $expected, $this->instance->front_page_url() );
	}

	/**
	 * Provider for test_front_page_url.
	 *
	 * @return array is_home_posts_page, is_home_static_page, static_times, home_url_times,permalink_times, expected.
	 */
	public function front_page_url_provider() {
		return [
			[ true, false, 0, 1, 0, 'http://basic.wordpress.test/' ],
			[ false, true, 1, 0, 1, 'http://basic.wordpress.test/permalink' ],
			[ false, false, 1, 0, 0, '' ],
		];
	}

	/**
	 * Tests page_not_found_url.
	 *
	 * @covers ::page_not_found_url
	 *
	 * @dataProvider page_not_found_url_provider
	 *
	 * @param bool   $is_multisite is_multisite return value.
	 * @param bool   $is_subdomain_install is_subdomain_install return value.
	 * @param bool   $is_main_site is_main_site return value.
	 * @param string $home_url home_url return value.
	 * @param bool   $is_home_static_page The return value from is_home_static_page function.
	 * @param int    $home_static_page_times The times is_home_static_page function is called.
	 * @param int    $get_permalink_times get_permalink times called.
	 * @param int    $page_for_posts_times times get_option(page_for_posts) is called.
	 * @param string $current_url current_url return value.
	 * @param string $expected expected return value.
	 */
	public function test_page_not_found_url( $is_multisite, $is_subdomain_install, $is_main_site, $home_url, $is_home_static_page, $home_static_page_times, $get_permalink_times, $page_for_posts_times, $current_url, $expected ) {

		Monkey\Functions\stubs(
			[
				'is_multisite'         => $is_multisite,
				'is_subdomain_install' => $is_subdomain_install,
				'is_main_site'         => $is_main_site,
			]
		);

		Monkey\Functions\expect( 'home_url' )
			->andReturn( $home_url );

		$this->current_page_helper
			->expects( 'is_home_static_page' )
			->times( $home_static_page_times )
			->andReturn( $is_home_static_page );

		Monkey\Functions\expect( 'get_permalink' )
			->times( $get_permalink_times )
			->andReturn( 'http://basic.wordpress.test/sub-domain' );

		Monkey\Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->times( $page_for_posts_times );

		$this->assertSame( $expected, $this->instance->page_not_found_url( $current_url ) );
	}

	/**
	 * Data provider for test_page_not_found_url.
	 *
	 * @return array is_multisite,is_subdomain_install,is_main_site,home_url,is_home_static_page,home_static_page_times,get_permalink_times,page_for_posts_times, current_url, expected.
	 */
	public function page_not_found_url_provider() {
		return [
			[ true, true, true, '', null, 0, 0, 0, '', '' ],
			[ false, false, true, '', null, 0, 0, 0, '', '' ],
			[ false, true, false, '', null, 0, 0, 0, '', '' ],
			[ true, false, true, 'http://basic.wordpress.test', null, 0, 0, 0, 'http://basic.wordpress.test/not-blog', '' ],
			[ true, false, true, 'http://basic.wordpress.test', false, 1, 0, 0, 'http://basic.wordpress.test/blog', 'http://basic.wordpress.test' ],
			[ true, false, true, 'http://basic.wordpress.test', false, 1, 0, 0, 'http://basic.wordpress.test/blog/', 'http://basic.wordpress.test' ],
			[ true, false, true, 'http://basic.wordpress.test', true, 1, 1, 1, 'http://basic.wordpress.test/blog', 'http://basic.wordpress.test/sub-domain' ],
		];
	}

	/**
	 * Tests taxonomy_url.
	 *
	 * @covers ::taxonomy_url
	 *
	 * @dataProvider taxonomy_url_provider
	 *
	 * @param bool   $is_feed is_feed return value.
	 * @param int    $get_term_feed_link_times times get_term_feed_link is called.
	 * @param int    $get_term_link_times times get_term_link is called.
	 * @param string $expected expected return value.
	 */
	public function test_taxonomy_url( $is_feed, $get_term_feed_link_times, $get_term_link_times, $expected ) {

		$term_mock = (object) [
			'term_id'  => 108,
			'taxonomy' => 'products',
		];

		global $wp_query;
		$wp_query = Mockery::mock( WP_Query::class );

		$wp_query->expects( 'get_queried_object' )
			->once()
			->andReturn(
				(object) [
					'term_id'  => 108,
					'taxonomy' => 'products',
				]
			);

		Monkey\Functions\expect( 'is_feed' )
			->once()
			->andReturn( $is_feed );

		Monkey\Functions\expect( 'get_term_feed_link' )
			->with( $term_mock->term_id, $term_mock->taxonomy )
			->times( $get_term_feed_link_times )
			->andReturn( 'http://basic.wordpress.test/products/feed' );

		Monkey\Functions\expect( 'get_term_link' )
			->with( $term_mock, $term_mock->taxonomy )
			->times( $get_term_link_times )
			->andReturn( 'http://basic.wordpress.test/products' );

		$this->assertSame( $expected, $this->instance->taxonomy_url() );
	}

	/**
	 *
	 * Data provider for test_taxonomy_url.
	 *
	 * @return array $is_feed, $get_term_feed_link_times, $get_term_link_times, $expected
	 */
	public function taxonomy_url_provider() {
		return [
			[ false, 0, 1, 'http://basic.wordpress.test/products' ],
			[ true, 1, 0, 'http://basic.wordpress.test/products/feed' ],
		];
	}

	/**
	 * Tests search_url.
	 *
	 * @covers ::search_url
	 */
	public function test_search_url() {
		Monkey\Functions\expect( 'get_search_query' )
			->once()
			->andReturn( 'test' );

		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'http://basic.wordpress.test' );

		$this->assertSame( 'http://basic.wordpress.test/?s=test', $this->instance->search_url() );
	}

	/**
	 * Tests query_var_page_url.
	 *
	 * @covers ::query_var_page_url
	 *
	 * @dataProvider query_var_page_url_provider
	 *
	 * @param bool   $is_search is_search return value.
	 * @param string $proper_url proper url.
	 * @param int    $home_url times home_url is called.
	 * @param int    $get_search_query times get_search_query is called.
	 * @param string $expected expected return value.
	 */
	public function test_query_var_page_url( $is_search, $proper_url, $home_url, $get_search_query, $expected ) {
		global $wp_query;
		$wp_query = Mockery::mock( WP_Query::class );


		Monkey\Functions\expect( 'is_search' )
			->once()
			->with( $proper_url )
			->andReturn( $is_search );

			Monkey\Functions\expect( 'home_url' )
				->times( $home_url )
				->andReturn( 'http://basic.wordpress.test' );

			Monkey\Functions\expect( 'get_search_query' )
				->times( $get_search_query )
				->andReturn( 'test' );

		global $wp_query;

		$wp_query = Mockery::mock( WP_Query::class );

		$wp_query->query_vars['paged'] = 'test';

		$this->assertSame( $expected, $this->instance->query_var_page_url( $proper_url ) );
	}

	/**
	 * Data provider for test_query_var_page_url.
	 *
	 * @return array $is_search, $expected
	 */
	public function query_var_page_url_provider() {
		$proper_url = 'http://basic.wordpress.test';
		return [
			[ true, $proper_url, 1, 1, 'http://basic.wordpress.test/page/test/?s=test' ],
			[ false, $proper_url, 0, 0, 'http://basic.wordpress.test/page/test/' ],

		];
	}

	/**
	 * Tests is_query_var_page.
	 *
	 * @covers ::is_query_var_page
	 *
	 * @dataProvider is_query_var_page_provider
	 *
	 * @param string $proper_url proper url.
	 * @param string $query_vars_paged query_vars_paged.
	 * @param int    $post_count post_count.
	 * @param bool   $expected expected return value.
	 */
	public function test_is_query_var_page( $proper_url, $query_vars_paged, $post_count, $expected ) {
		global $wp_query;

		$wp_query = Mockery::mock( WP_Query::class );

		$wp_query->query_vars['paged'] = $query_vars_paged;

		$wp_query->post_count = $post_count;

		$this->assertSame( $expected, $this->instance->is_query_var_page( $proper_url ) );
	}

	/**
	 * Data provider for test_is_query_var_page.
	 *
	 * @return array $is_search, $expected
	 */
	public function is_query_var_page_provider() {
		$proper_url = 'http://basic.wordpress.test';
		return [
			[ '', null, null, false ],
			[ 'http://basic.wordpress.test', 0, null, false ],
			[ 'http://basic.wordpress.test', 1, 0, false ],
			[ 'http://basic.wordpress.test', 1, 3, true ],
		];
	}

	/**
	 * Tests page_for_posts_url.
	 *
	 * @covers ::page_for_posts_url
	 */
	public function test_page_for_posts_url() {

		Monkey\Functions\expect( 'get_option' )
			->with( 'page_for_posts' )
			->once()
			->andReturn( 5 );

		Monkey\Functions\expect( 'get_permalink' )
			->once()
			->andReturn( 'http://basic.wordpress.test/posts-page' );

		$this->assertSame( 'http://basic.wordpress.test/posts-page', $this->instance->page_for_posts_url() );
	}

	/**
	 * Tests get_url_type.
	 *
	 * @covers ::get_url_type
	 *
	 * @dataProvider get_url_type_provider
	 *
	 * @param bool   $singular is_singular return value.
	 * @param bool   $front is_front_page return value.
	 * @param bool   $category is_category return value.
	 * @param bool   $tag is_tag return value.
	 * @param bool   $tax is_tax return value.
	 * @param bool   $search is_search return value.
	 * @param bool   $is404 is_404 return value.
	 * @param bool   $post_page is_posts_page return value.
	 * @param int    $post_page_times times is_posts_page is called.
	 * @param string $expected expected return value.
	 */
	public function test_get_url_type( $singular, $front, $category, $tag, $tax, $search, $is404, $post_page, $post_page_times, $expected ) {

		Monkey\Functions\stubs(
			[
				'is_singular'   => $singular,
				'is_front_page' => $front,
				'is_category'   => $category,
				'is_tag'        => $tag,
				'is_tax'        => $tax,
				'is_search'     => $search,
				'is_404'        => $is404,
			]
		);

		$this->current_page_helper
			->expects( 'is_posts_page' )
			->times( $post_page_times )
			->andReturn( $post_page );


		$this->assertSame( $expected, $this->instance->get_url_type() );
	}

	/**
	 * Data provider for test_get_url_type.
	 *
	 * @return array $singular,$front,$category,$tag,$tax,$search,$is404,$post_page,$post_page_times, $expected
	 */
	public function get_url_type_provider() {
		return [
			[ true, false, false, false, false, false, false, false, 0, 'singular_url' ],
			[ false, true, false, false, false, false, false, false, 0, 'front_page_url' ],
			[ false, false, true, false, false, false, false, false, 1, 'taxonomy_url' ],
			[ false, false, false, true, false, false, false, false, 1, 'taxonomy_url' ],
			[ false, false, false, false, true, false, false, false, 1, 'taxonomy_url' ],
			[ false, false, false, false, false, true, false, false, 1, 'search_url' ],
			[ false, false, false, false, false, false, true, false, 1, 'page_not_found_url' ],
			[ false, false, false, false, false, false, false, false, 1, '' ],
		];
	}

	/**
	 * Tests do_clean_redirect.
	 *
	 * @covers ::do_clean_redirect
	 */
	public function test_do_clean_redirect() {
		$proper_url = 'http://basic.wordpress.test';
		$this->redirect_helper
			->expects( 'set_header' )
			->with( 'Content-Type: redirect', true )
			->once();

		$this->redirect_helper
			->expects( 'remove_header' )
			->with( 'Content-Type' )
			->once();

		$this->redirect_helper
			->expects( 'remove_header' )
			->with( 'Last-Modified' )
			->once();

		$this->redirect_helper
			->expects( 'remove_header' )
			->with( 'X-Pingback' )
			->once();

		$message = \sprintf(
			/* translators: %1$s: Yoast SEO */
			\__( '%1$s: unregistered URL parameter removed. See %2$s', 'wordpress-seo' ),
			'Yoast SEO',
			'https://yoa.st/advanced-crawl-settings'
		);

		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->with( $proper_url, 301, $message )
			->once();

		$this->instance->do_clean_redirect( $proper_url );
	}
}
