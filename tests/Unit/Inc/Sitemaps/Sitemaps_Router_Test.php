<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Sitemaps;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Sitemaps_Router;
use Yoast\WP\SEO\Conditionals\Deactivating_Yoast_Seo_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group sitemaps
 *
 * @coversDefaultClass WPSEO_Sitemaps_Router
 */
final class Sitemaps_Router_Test extends TestCase {

	/**
	 * Mock of the deactivating Yoast SEO conditional.
	 *
	 * @var Mockery\Mock|Deactivating_Yoast_Seo_Conditional
	 */
	protected $deactivating_yoast_conditional;

	/**
	 * Mock of the redirect helper.
	 *
	 * @var Mockery\Mock|Redirect_Helper
	 */
	protected $redirect_helper;

	/**
	 * The mock container to use for the test.
	 *
	 * @var Mockery\Mock|Container
	 */
	protected $container;

	/**
	 * Class instance to use for the test.
	 *
	 * @var WPSEO_Sitemaps_Router
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->deactivating_yoast_conditional = Mockery::mock( Deactivating_Yoast_Seo_Conditional::class );
		$this->container                      = $this->create_container_with(
			[
				Deactivating_Yoast_Seo_Conditional::class => $this->deactivating_yoast_conditional,
			]
		);
		$this->deactivating_yoast_conditional->expects( 'is_met' )
			->once()
			->andReturnFalse();

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'classes' => $this->create_classes_surface( $this->container ) ] );

		$this->instance = new WPSEO_Sitemaps_Router();
	}

	/**
	 * Tests the construct method.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		$this->deactivating_yoast_conditional->expects( 'is_met' )
			->once()
			->andReturnTrue();

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'classes' => $this->create_classes_surface( $this->container ) ] );

		$instance = new WPSEO_Sitemaps_Router();

		$this->assertNotFalse( \has_action( 'yoast_add_dynamic_rewrite_rules', [ $instance, 'add_rewrite_rules' ] ) );
		$this->assertNotFalse( \has_filter( 'query_vars', [ $instance, 'add_query_vars' ] ), 'query_vars filter is not set' );
		$this->assertNotFalse( \has_filter( 'redirect_canonical', [ $instance, 'redirect_canonical' ] ), 'redirect_canonical filter is not set' );
		$this->assertNotFalse( \has_action( 'template_redirect', [ $instance, 'template_redirect' ] ), 'template_redirect action is not set' );
	}

	/**
	 * Tests add_query_vars method.
	 *
	 * @covers ::add_query_vars
	 *
	 * @return void
	 */
	public function test_add_query_vars() {
		$this->instance->add_query_vars( [] );

		$this->assertContains( 'sitemap', $this->instance->add_query_vars( [] ), 'sitemap is not in the query vars' );
		$this->assertContains( 'sitemap_n', $this->instance->add_query_vars( [] ), 'sitemap_n is not in the query vars' );
		$this->assertContains( 'yoast-sitemap-xsl', $this->instance->add_query_vars( [] ), 'yoast-sitemap-xsl is not in the query vars' );
	}

	/**
	 * Tests add_rewrite_rules method.
	 *
	 * @covers ::add_rewrite_rules
	 *
	 * @return void
	 */
	public function test_add_rewrite_rules() {
		$dynamic_rewrites = Mockery::mock( 'Yoast_Dynamic_Rewrites' );

		$dynamic_rewrites->expects( 'add_rule' )
			->with( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' )
			->once();

		$dynamic_rewrites->expects( 'add_rule' )
			->with( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' )
			->once();

		$dynamic_rewrites->expects( 'add_rule' )
			->with( '([a-z]+)?-?sitemap\.xsl$', 'index.php?yoast-sitemap-xsl=$matches[1]', 'top' )
			->once();

		$this->instance->add_rewrite_rules( $dynamic_rewrites );
	}

	/**
	 * Tests redirect_canonical method.
	 *
	 * @covers ::redirect_canonical
	 *
	 * @dataProvider redirect_canonical_data_provider
	 *
	 * @param bool $is_sitemap           Whether the sitemap query var is set.
	 * @param bool $is_yoast_sitemap_xsl Whether the yoast-sitemap-xsl query var is set.
	 * @param bool $redirect             Whether to redirect.
	 * @param bool $expected             Whether to redirect.
	 *
	 * @return void
	 */
	public function test_redirect_canonical( $is_sitemap, $is_yoast_sitemap_xsl, $redirect, $expected ) {
		Functions\expect( 'get_query_var' )
			->with( 'sitemap' )
			->once()
			->andReturn( $is_sitemap );

		Functions\expect( 'get_query_var' )
			->with( 'yoast-sitemap-xsl' )
			->times( (int) ! $is_sitemap )
			->andReturn( $is_yoast_sitemap_xsl );

		$this->assertSame( $expected, $this->instance->redirect_canonical( $redirect ) );
	}

	/**
	 * Data provider for test_redirect_canonical.
	 *
	 * @return array<array<bool>>
	 */
	public static function redirect_canonical_data_provider() {
		return [
			'no sitemap' => [
				'is_sitemap'           => false,
				'is_yoast_sitemap_xsl' => false,
				'redirect'             => false,
				'expected'             => false,
			],
			'sitemap' => [
				'is_sitemap'           => true,
				'is_yoast_sitemap_xsl' => false,
				'redirect'             => false,
				'expected'             => false,
			],
			'yoast-sitemap-xsl' => [
				'is_sitemap'           => false,
				'is_yoast_sitemap_xsl' => true,
				'redirect'             => false,
				'expected'             => false,
			],
			'both' => [
				'is_sitemap'           => true,
				'is_yoast_sitemap_xsl' => true,
				'redirect'             => false,
				'expected'             => false,
			],
			'redirect' => [
				'is_sitemap'           => false,
				'is_yoast_sitemap_xsl' => false,
				'redirect'             => true,
				'expected'             => true,
			],
		];
	}

	/**
	 * Tests template_redirect method.
	 *
	 * @covers ::template_redirect
	 *
	 * @return void
	 */
	public function test_template_redirect() {
		global $wp_query;
		$wp_query         = Mockery::mock( 'WP_Query' );
		$wp_query->is_404 = false;

		$this->instance->template_redirect();
	}

	/**
	 * Tests needs_sitemap_index_redirect method.
	 *
	 * @covers ::needs_sitemap_index_redirect
	 *
	 * @dataProvider needs_sitemap_index_redirect_data_provider
	 *
	 * @param bool   $https       Whether the request is over HTTPS.
	 * @param string $server_name The server name.
	 * @param string $request_uri The request URI.
	 * @param bool   $is_404      Whether the request is a 404.
	 * @param string $http_host   The HTTP host.
	 * @param string $home_url    The home URL.
	 * @param bool   $expected    Whether to redirect.
	 *
	 * @return void
	 */
	public function test_needs_sitemap_index_redirect( $https, $server_name, $request_uri, $is_404, $http_host, $home_url, $expected ) {
		$_SERVER['HTTPS']       = $https;
		$_SERVER['SERVER_NAME'] = $server_name;
		$_SERVER['REQUEST_URI'] = $request_uri;
		$_SERVER['HTTP_HOST']   = $http_host;

		global $wp_query;
		$wp_query         = Mockery::mock( 'WP_Query' );
		$wp_query->is_404 = $is_404;

		Functions\expect( 'home_url' )
			->with( '/sitemap.xml' )
			->once()
			->andReturn( $home_url );

		$this->assertSame( $expected, $this->instance->needs_sitemap_index_redirect() );
	}

	/**
	 * Data provider for test_needs_sitemap_index_redirect.
	 *
	 * @return array<array<bool|string>>
	 */
	public static function needs_sitemap_index_redirect_data_provider() {
		return [
			'no https 1' => [
				'https'       => false,
				'server_name' => 'example.com',
				'request_uri' => '/sitemap.xml',
				'http_host'   => 'example.com',
				'is_404'      => true,
				'home_url'    => 'http://example.com/sitemap.xml',
				'expected'    => true,
			],
			'no https 2' => [
				'https'       => true,
				'server_name' => 'example.com',
				'request_uri' => '/sitemap.xml',
				'http_host'   => 'example.com',
				'is_404'      => true,
				'home_url'    => 'http://example.com/sitemap.xml',
				'expected'    => true,
			],
			'with https' => [
				'https'       => 'on',
				'server_name' => 'example.com',
				'request_uri' => '/sitemap.xml',
				'http_host'   => 'example.com',
				'is_404'      => true,
				'home_url'    => 'http://example.com/sitemap.xml',
				'expected'    => false,
			],
			'no server name' => [
				'https'       => true,
				'server_name' => '',
				'request_uri' => '/sitemap.xml',
				'is_404'      => true,
				'http_host'   => null,
				'home_url'    => 'http://example.com/sitemap.xml',
				'expected'    => false,
			],
		];
	}

	/**
	 * Tests get_base_url method.
	 *
	 * @covers ::get_base_url
	 *
	 * @dataProvider get_base_url_data_provider
	 *
	 * @param bool   $using_index_permalinks Whether index permalinks are used.
	 * @param string $base                   The base.
	 *
	 * @return void
	 */
	public function test_get_base_url( $using_index_permalinks, $base ) {
		global $wp_rewrite;
		$wp_rewrite = Mockery::mock( 'WP_Rewrite' );
		$wp_rewrite->expects( 'using_index_permalinks' )
			->once()
			->andReturn( $using_index_permalinks );

		$page = 'sitemap_index.xml';

		Functions\expect( 'get_option' )
			->with( 'home' )
			->once()
			->andReturn( 'https://wordpress.test' );

		Functions\expect( 'wp_parse_url' )
			->with( 'https://wordpress.test' )
			->once()
			->andReturn( 'https' );

		Functions\expect( 'home_url' )
			->with( $base . $page, 'https' )
			->once()
			->andReturn( 'https://wordpress.test/sitemap_index.xml' );

		$this->assertSame( 'https://wordpress.test/sitemap_index.xml', $this->instance->get_base_url( $page ) );
	}

	/**
	 * Data provider for test_get_base_url.
	 *
	 * @return array<array<bool|string>>
	 */
	public static function get_base_url_data_provider() {
		return [
			'index permalinks' => [
				'using_index_permalinks' => true,
				'base'                   => 'index.php/',
			],
			'no index permalinks' => [
				'using_index_permalinks' => false,
				'base'                   => '/',
			],
		];
	}

	/**
	 * Tests template_redirect method.
	 *
	 * @covers ::template_redirect
	 *
	 * @return void
	 */
	public function test_template_redirect_exit() {
		global $wp_query;
		$wp_query         = Mockery::mock( 'WP_Query' );
		$wp_query->is_404 = true;

		$_SERVER['HTTPS']       = true;
		$_SERVER['SERVER_NAME'] = 'example.com';
		$_SERVER['REQUEST_URI'] = '/sitemap.xml';
		$_SERVER['HTTP_HOST']   = 'example.com';

		Functions\expect( 'home_url' )
			->with( '/sitemap.xml' )
			->times( 2 )
			->andReturn( 'http://example.com/sitemap.xml' );

		$this->redirect_helper = Mockery::mock( Redirect_Helper::class );
		$container             = $this->create_container_with( [ Redirect_Helper::class => $this->redirect_helper ] );

		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->with( 'http://example.com/sitemap.xml', 301, 'Yoast SEO' )
			->once();

		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'helpers' => $this->create_helper_surface( $container ) ] );

		$this->instance->template_redirect();
	}
}
