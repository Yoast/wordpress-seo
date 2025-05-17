<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use WP_Query;
use Yoast\WP\SEO\Helpers\Crawl_Cleanup_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Cleanup_Helper_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Crawl_Cleanup_Helper
 *
 * @group integrations
 */
final class Crawl_Cleanup_Helper_Test extends TestCase {

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
	 * @return void
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
	 * @param bool   $is_robots         Mock return value for is_robots().
	 * @param string $sitemap           Mock return value for get_query_var().
	 * @param array  $get_response      Mock $_GET data.
	 * @param bool   $is_user_logged_in Mock return value for is_user_logged_in().
	 * @param int    $expected          Expected return value from the should_avoid_redirect() method.
	 *
	 * @return void
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
	 * Data provider for test_clean_permalinks_avoid_redirect.
	 *
	 * @return array
	 */
	public static function should_avoid_redirect_provider() {
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
	 * @param string $clean_permalinks_extra_variables Mock return value for clean_permalinks_extra_variables().
	 * @param array  $permalink_vars                   The return value from the filter to add extra vars.
	 * @param array  $expeted                          The allowed extra vars (is set in settings under 'Additional URL parameters to allow').
	 *
	 * @return void
	 */
	public function test_get_allowed_extravars( $clean_permalinks_extra_variables, $permalink_vars, $expeted ) {

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\allowlist_permalink_vars', [ 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gtm_debug' ] )
			->andReturn( $permalink_vars );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks_extra_variables' )
			->once()
			->andReturn( $clean_permalinks_extra_variables );

		$this->assertSame( $expeted, $this->instance->get_allowed_extravars() );
	}

	/**
	 * Data provider for test_clean_permalinks.
	 *
	 * @return array
	 */
	public static function get_allowed_extravars_provider() {
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
	 * @param bool   $is_home_posts_page  Mock return value for is_home_posts_page().
	 * @param bool   $is_home_static_page Mock return value for is_home_static_page().
	 * @param int    $static_times        The number of times is_home_static_page() is expected to be called.
	 * @param int    $home_url_times      The number of times home_url() is expected to be called.
	 * @param int    $permalink_times     The number of times get_permalink() is expected to be called.
	 * @param string $expected            Expected return value.
	 *
	 * @return void
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
	 * @return array
	 */
	public static function front_page_url_provider() {
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
	 * @param bool   $is_multisite           Mock return value for is_multisite().
	 * @param bool   $is_subdomain_install   Mock return value for is_subdomain_install().
	 * @param bool   $is_main_site           Mock return value for is_main_site().
	 * @param string $home_url               Mock return value for home_url().
	 * @param bool   $is_home_static_page    Mock return value for is_home_static_page().
	 * @param int    $home_static_page_times The number of times is_home_static_page() is expected to be called.
	 * @param int    $get_permalink_times    The number of times get_permalink() is expected to be called.
	 * @param int    $page_for_posts_times   The number of times times get_option(page_for_posts) is expected to be called.
	 * @param string $current_url            Input value for $current_url parameter.
	 * @param string $expected               Expected return value.
	 *
	 * @return void
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
	 * @return array
	 */
	public static function page_not_found_url_provider() {
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
	 * @param bool   $is_feed                  Mock return value for is_feed().
	 * @param int    $get_term_feed_link_times The number of times get_term_feed_link() is expected to be called.
	 * @param int    $get_term_link_times      The number of times get_term_link() is expected to be called.
	 * @param string $expected                 Expected return value.
	 *
	 * @return void
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
	 * Data provider for test_taxonomy_url.
	 *
	 * @return array
	 */
	public static function taxonomy_url_provider() {
		return [
			[ false, 0, 1, 'http://basic.wordpress.test/products' ],
			[ true, 1, 0, 'http://basic.wordpress.test/products/feed' ],
		];
	}

	/**
	 * Tests search_url.
	 *
	 * @covers ::search_url
	 *
	 * @return void
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
	 * @param bool   $is_search        Mock return value for is_search().
	 * @param string $proper_url       Input value for $proper_url parameter.
	 * @param int    $home_url         The number of times home_url() is expected to be called.
	 * @param int    $get_search_query The number of times get_search_query() is expected to be called.
	 * @param string $expected         Expected return value.
	 *
	 * @return void
	 */
	public function test_query_var_page_url( $is_search, $proper_url, $home_url, $get_search_query, $expected ) {
		global $wp_query;
		$wp_query                      = Mockery::mock( WP_Query::class );
		$wp_query->query_vars['paged'] = 'test';

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

		$this->assertSame( $expected, $this->instance->query_var_page_url( $proper_url ) );
	}

	/**
	 * Data provider for test_query_var_page_url.
	 *
	 * @return array
	 */
	public static function query_var_page_url_provider() {
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
	 * @param string $proper_url       Input value for $proper_url parameter.
	 * @param string $query_vars_paged WP_Query query_vars_paged input.
	 * @param int    $post_count       WP_Query post_count input.
	 * @param bool   $expected         Expected return value.
	 *
	 * @return void
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
	 * @return array
	 */
	public static function is_query_var_page_provider() {
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
	 *
	 * @return void
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
	 * @param bool   $singular        Mock return value for is_singular().
	 * @param bool   $front           Mock return value for is_front_page().
	 * @param bool   $category        Mock return value for is_category().
	 * @param bool   $tag             Mock return value for is_tag().
	 * @param bool   $tax             Mock return value for is_tax().
	 * @param bool   $search          Mock return value for is_search().
	 * @param bool   $is404           Mock return value for is_404().
	 * @param bool   $post_page       Mock return value for is_posts_page().
	 * @param int    $post_page_times The number of times is_posts_page() is expected to be called.
	 * @param string $expected        Expected return value.
	 *
	 * @return void
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
	 * @return array
	 */
	public static function get_url_type_provider() {
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
	 *
	 * @return void
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
