<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Crawl_Cleanup_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Cleanup_Permalinks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks
 *
 * @group integrations
 */
final class Crawl_Cleanup_Permalinks_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Crawl_Cleanup_Permalinks
	 */
	private $instance;

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
	 * The Crawl_Cleanup_Helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $crawl_cleanup_helper;

	/**
	 * Sets up the tests.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->options_helper       = Mockery::mock( Options_Helper::class );
		$this->url_helper           = Mockery::mock( Url_Helper::class );
		$this->redirect_helper      = Mockery::mock( Redirect_Helper::class );
		$this->crawl_cleanup_helper = Mockery::mock( Crawl_Cleanup_Helper::class );

		$this->instance = new Crawl_Cleanup_Permalinks(
			$this->options_helper,
			$this->url_helper,
			$this->redirect_helper,
			$this->crawl_cleanup_helper
		);
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 *
	 * @return void
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'plugins_loaded' )
			->with( [ $this->instance, 'register_hooks' ] )
			->times( 1 );
		$this->instance->initialize();
	}

	/**
	 * Tests register_hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider register_hooks_provider
	 *
	 * @param string $permalink_structure       Mock return value for get_option(permalink_structure).
	 * @param string $campaign_tracking_urls    Mock return value for option_helper.
	 * @param string $clean_permalinks          Mock return value for option_helper.
	 * @param int    $expected_utm_redirect     The number of times the utm_redirect action is expected to be added.
	 * @param int    $expected_clean_permalinks The number of times the clean_permalinks action is expected to be added.
	 *
	 * @return void
	 */
	public function test_register_hooks( $permalink_structure, $campaign_tracking_urls, $clean_permalinks, $expected_utm_redirect, $expected_clean_permalinks ) {

		Monkey\Functions\expect( 'get_option' )
			->with( 'permalink_structure' )
			->andReturn( $permalink_structure );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_campaign_tracking_urls' )
			->once()
			->andReturns( $campaign_tracking_urls );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks' )
			->once()
			->andReturns( $clean_permalinks );

		Monkey\Actions\expectAdded( 'template_redirect' )
			->with( [ $this->instance, 'utm_redirect' ] )
			->times( $expected_utm_redirect );

		Monkey\Actions\expectAdded( 'template_redirect' )
			->with( [ $this->instance, 'clean_permalinks' ] )
			->times( $expected_clean_permalinks );

		$this->instance->register_hooks();
	}

	/**
	 * Data provider for test_register_hooks.
	 *
	 * @return array
	 */
	public static function register_hooks_provider() {
		return [
			[ null, 'returned_value_campaign_tracking_urls', 'returned_value_clean_permalinks', 0, 0 ],
			[ null, 'returned_value_campaign_tracking_urls', null, 0, 0 ],
			[ null, null, 'returned_value_clean_permalinks', 0, 0 ],
			[ null, null, null, 0, 0 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', 'returned_value_clean_permalinks', 1, 1 ],
			[ 'permalink_structure_option', null, 'returned_value_clean_permalinks', 0, 1 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', null, 1, 0 ],
		];
	}

	/**
	 * Tests get_conditionals.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Front_End_Conditional::class ], $this->instance->get_conditionals() );
	}

	/**
	 * Tests utm_redirect.
	 *
	 * @covers ::utm_redirect
	 *
	 * @dataProvider utm_redirect_provider
	 *
	 * @param string $request_uri         Mock $_SERVER['REQUEST_URI'] data.
	 * @param array  $wp_parse_url        Mock return value for wp_parse_url().
	 * @param int    $is_wp_safe_redirect The number of times wp_safe_redirect() is expected to be called.
	 *
	 * @return void
	 */
	public function test_utm_redirect( $request_uri, $wp_parse_url, $is_wp_safe_redirect ) {
		$_SERVER['REQUEST_URI'] = $request_uri;

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( $request_uri )
			->andReturn( $wp_parse_url );

		Monkey\Functions\expect( 'trailingslashit' )
			->times( $is_wp_safe_redirect );

		$this->url_helper
			->expects( 'recreate_current_url' )
			->with( false )
			->times( $is_wp_safe_redirect )
			->andReturn( 'www.example.com/' );

		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->times( $is_wp_safe_redirect );

		$this->instance->utm_redirect();
	}

	/**
	 * Data provider for utm_redirect.
	 *
	 * @return array
	 */
	public static function utm_redirect_provider() {
		return [
			[ null, null, 0 ],
			[ 'random_post_slug', null, 0 ],
			[ '/?page=1234', null, 0 ],
			[
				'/?page=4&testing=123utm_',
				[
					'path'  => '/',
					'query' => 'page=4&testing=123utm_',
				],
				0,
			],
			[
				'/?utm_medium=organic',
				[
					'path'  => '/',
					'query' => 'utm_medium=organic',
				],
				1,
			],
		];
	}

	/**
	 * Tests clean_permalinks.
	 *
	 * @covers ::clean_permalinks
	 *
	 * @dataProvider clean_permalinks_no_redirect_provider
	 *
	 * @param bool   $avoid_redirect             Mock return value for should avoid redirect().
	 * @param int    $recreate_current_url_times The number of times recreate_current_url() is expected to be called.
	 * @param string $current_url                Mock return value for recreate_current_url().
	 * @param array  $allowed_params             Mock return value for allowed_params().
	 * @param int    $expected                   The number of times do_clean_redirect() is expected to be called.
	 *
	 * @return void
	 */
	public function test_clean_permalinks_no_redirect( $avoid_redirect, $recreate_current_url_times, $current_url, $allowed_params, $expected ) {

		$this->crawl_cleanup_helper
			->expects( 'should_avoid_redirect' )
			->once()
			->andReturn( $avoid_redirect );

		$this->url_helper
			->expects( 'recreate_current_url' )
			->times( $recreate_current_url_times )
			->andReturn( $current_url );

		$this->crawl_cleanup_helper
			->expects( 'allowed_params' )
			->times( $recreate_current_url_times )
			->with( $current_url )
			->andReturn( $allowed_params );

		$this->crawl_cleanup_helper
			->expects( 'do_clean_redirect' )
			->times( $expected );

		$this->instance->clean_permalinks();
	}

	/**
	 * Data provider for clean_permalinks when there is no redirect in the begining of the function.
	 *
	 * Checks:
	 * 1. If avoid_redirect is true then do_clean_redirect shouldn't be called.
	 * 2. If avoid_redirect is false and 'query' is empty then do_clean_redirect shouldn't be called.
	 *
	 * @return array
	 */
	public static function clean_permalinks_no_redirect_provider() {
		return [
			[ true, 0, null, null, 0 ],
			[ false, 1, 'http://www.example.com/?unknown=123', [ 'query' => [] ], 0 ],
		];
	}

	/**
	 * Tests clean_permalinks.
	 *
	 * @covers ::clean_permalinks
	 *
	 * @dataProvider clean_permalinks_provider
	 *
	 * @param string $current_url    Mock return value for recreate_current_url().
	 * @param array  $allowed_params Mock return value for allowed_params().
	 * @param string $url_type       Mock return value for get_url_type() and the function name in the helper.
	 * @param string $proper_url     Mock return value for helper.
	 * @param int    $expected       The number of times do_clean_redirect() is expected to be called.
	 *
	 * @return void
	 */
	public function test_clean_permalinks( $current_url, $allowed_params, $url_type, $proper_url, $expected ) {

		$this->crawl_cleanup_helper
			->expects( 'should_avoid_redirect' )
			->once()
			->andReturn( false );

		$this->url_helper
			->expects( 'recreate_current_url' )
			->once()
			->andReturn( $current_url );

		$this->crawl_cleanup_helper
			->expects( 'allowed_params' )
			->once()
			->with( $current_url )
			->andReturn( $allowed_params );

		$this->crawl_cleanup_helper
			->expects( 'get_url_type' )
			->once()
			->andReturn( $url_type );

		$this->crawl_cleanup_helper
			->expects( $url_type )
			->once()
			->andReturn( $proper_url );

		$this->crawl_cleanup_helper
			->expects( 'is_query_var_page' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( $allowed_params['allowed_query'], $proper_url )
			->andReturn( $proper_url . '?utm_medium=allowed' );

		$this->crawl_cleanup_helper
			->expects( 'do_clean_redirect' )
			->times( $expected );

		$this->instance->clean_permalinks();
	}

	/**
	 * Data provider for clean_permalinks.
	 *
	 * Checks ( When avoid_redirect and is_query_var_page are false, and proper_url is not null and not equal to current url ):
	 * 1. If url type is singular, then singular_url should be called and do_clean_redirect should be called.
	 * 2. If url type is front page, then front_page_url should be called and do_clean_redirect should be called.
	 * 3. If url type is taxonomy, then taxonomy_url should be called and do_clean_redirect should be called.
	 * 4. If url type is search, then search_url should be called and do_clean_redirect should be called.
	 * 5. If url type is page_not_found_url, then page_not_found_url should be called and do_clean_redirect should be called.
	 *
	 * @return array
	 */
	public static function clean_permalinks_provider() {
		$allowed_params = [
			'query'         => [ 'unknown' => '123' ],
			'allowed_query' => [ 'utm_medium' => 'allowed' ],
		];
		$base_url       = 'http://www.example.com';

		return [
			[
				$base_url . '/product/?unknown=123&utm_medium=allowed',
				$allowed_params,
				'singular_url',
				$base_url . '/product/book',
				1,
			],
			[
				$base_url . '/?unknown=123&utm_medium=allowed',
				$allowed_params,
				'front_page_url',
				$base_url,
				1,
			],
			[
				$base_url . '/products/?unknown=123&utm_medium=allowed',
				$allowed_params,
				'taxonomy_url',
				$base_url . '/products',
				1,
			],
			[
				$base_url . '/?unknown=123&utm_medium=allowed&s=book',
				$allowed_params,
				'search_url',
				$base_url,
				1,
			],
			[
				$base_url . '/non-existing?unknown=123&utm_medium=allowed',
				$allowed_params,
				'page_not_found_url',
				$base_url . '/page_for_posts',
				1,
			],
		];
	}

	/**
	 * Tests clean_permalinks with page var.
	 *
	 * @covers ::clean_permalinks
	 *
	 * @dataProvider clean_permalinks_with_page_var_provider
	 *
	 * @param string $current_url    Mock return value for recreate_current_url().
	 * @param array  $allowed_params Mock return value for allowed_params().
	 * @param string $proper_url     Mock return value for query_var_page_url().
	 * @param int    $expected       The number of times do_clean_redirect() is expected to be called.
	 *
	 * @return void
	 */
	public function test_clean_permalinks_with_page_var( $current_url, $allowed_params, $proper_url, $expected ) {

		$this->crawl_cleanup_helper
			->expects( 'should_avoid_redirect' )
			->once()
			->andReturn( false );

		$this->url_helper
			->expects( 'recreate_current_url' )
			->once()
			->andReturn( $current_url );

		$this->crawl_cleanup_helper
			->expects( 'allowed_params' )
			->once()
			->with( $current_url )
			->andReturn( $allowed_params );

		$this->crawl_cleanup_helper
			->expects( 'get_url_type' )
			->once()
			->andReturn( '' );

		$this->crawl_cleanup_helper
			->expects( 'is_query_var_page' )
			->once()
			->andReturn( true );

		$this->crawl_cleanup_helper
			->expects( 'query_var_page_url' )
			->once()
			->andReturn( $proper_url );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( $allowed_params['allowed_query'], $proper_url )
			->andReturn( $proper_url );

		$this->crawl_cleanup_helper
			->expects( 'do_clean_redirect' )
			->times( $expected );

		$this->instance->clean_permalinks();
	}

	/**
	 * Data provider for test_clean_permalinks_with_page_var.
	 *
	 * Checks ( When avoid_redirect and is_query_var_page are false, and proper_url is not null and not equal to current url ):
	 * 1. If is_query_var_page true and if so, does query_var_page_url is called.
	 * 2. If $proper_url is empty, then do_clean_redirect should not be called.
	 * 3. If $proper_url is equal to $current_url, then do_clean_redirect should not be called.
	 *
	 * @return array
	 */
	public static function clean_permalinks_with_page_var_provider() {
		$allowed_params = [
			'query'         => [ 'unknown' => '123' ],
			'allowed_query' => [ 'utm_medium' => 'allowed' ],
		];
		$base_url       = 'http://www.example.com';

		return [
			[
				$base_url . '/page/?unknown=123&utm_medium=allowed',
				$allowed_params,
				$base_url . '/page',
				1,
			],
			[
				$base_url . '/page',
				$allowed_params,
				$base_url . '/page',
				0,
			],
			[
				$base_url . '/page123/?unknown=123',
				$allowed_params,
				'',
				0,
			],
		];
	}
}
