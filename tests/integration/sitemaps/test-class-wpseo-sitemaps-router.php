<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Router_Test.
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Router_Test extends WPSEO_UnitTestCase {

	/**
	 * Temporary home URL storage.
	 *
	 * @var string
	 */
	private $home_url = '';

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Sitemaps_Router
	 */
	private static $class_instance;

	/**
	 * Set up our class.
	 */
	public static function set_up_before_class() {
		parent::set_up_before_class();
		self::$class_instance = new WPSEO_Sitemaps_Router();
	}

	/**
	 * Tests redirecting of the canonical.
	 *
	 * @covers WPSEO_Sitemaps_Router::redirect_canonical
	 */
	public function test_redirect_canonical() {
		global $wp_query;
		unset( $wp_query->query_vars['sitemap'] );
		unset( $wp_query->query_vars['xls'] );

		$url = site_url();

		$this->assertNotEmpty( self::$class_instance->redirect_canonical( $url ) );

		set_query_var( 'sitemap', 'sitemap_value' );
		$this->assertFalse( self::$class_instance->redirect_canonical( $url ) );

		set_query_var( '$yoast_sitemap_xsl', 'xsl_value' );
		$this->assertFalse( self::$class_instance->redirect_canonical( $url ) );
	}

	/**
	 * Tests retrieval of the base url.
	 *
	 * @covers WPSEO_Sitemaps_Router::get_base_url
	 */
	public function test_get_base_url() {

		update_option( 'home', 'http://example.org' );
		$this->assertEquals( 'http://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'https://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );

		update_option( 'home', 'https://example.org' );
		$this->assertEquals( 'https://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'http://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );

		update_option( 'home', 'example.org' );
		$this->assertEquals( 'https://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'http://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
	}

	/**
	 * Tests whether the current request should be redirected to sitemap_index.xml.
	 *
	 * @covers       WPSEO_Sitemaps_Router::needs_sitemap_index_redirect
	 * @dataProvider data_needs_sitemap_index_redirect
	 *
	 * @param array    $server_vars Associative array of `$_SERVER` vars to set.
	 * @param string   $home_url    The home URL to set.
	 * @param WP_Query $wp_query    WP_Query instance to set.
	 * @param bool     $expected    The expected test result.
	 */
	public function test_needs_sitemap_index_redirect( $server_vars, $home_url, $wp_query, $expected ) {
		$server_orig   = $_SERVER;
		$wp_query_orig = $GLOBALS['wp_query'];

		$_SERVER             = array_merge( $_SERVER, $server_vars );
		$this->home_url      = $home_url;
		$GLOBALS['wp_query'] = $wp_query;

		add_filter( 'home_url', [ $this, 'filter_home_url' ], 100, 2 );
		$result = self::$class_instance->needs_sitemap_index_redirect();
		remove_filter( 'home_url', [ $this, 'filter_home_url' ], 100 );

		$GLOBALS['wp_query'] = $wp_query_orig;
		$this->home_url      = '';
		$_SERVER             = $server_orig;

		$this->assertSame( $expected, $result );
	}

	/**
	 * Filters the home URL.
	 *
	 * @param string $home_url Original home URL.
	 * @param string $path     Relative path.
	 *
	 * @return string Home URL to override, or value of $home_url.
	 */
	public function filter_home_url( $home_url, $path ) {
		if ( ! empty( $this->home_url ) ) {
			if ( ! empty( $path ) ) {
				return $this->home_url . '/' . ltrim( $path, '/' );
			}
			return $this->home_url;
		}

		return $home_url;
	}

	/**
	 * Provides test data for the `test_needs_sitemap_index_redirect()` test.
	 *
	 * The format for each record is:
	 * [0] array:    Associative array of `$_SERVER` vars to set.
	 * [1] string:   The home URL to set.
	 * [2] WP_Query: WP_Query instance to set.
	 * [3] bool:     The expected test result.
	 *
	 * @return array The test data.
	 */
	public function data_needs_sitemap_index_redirect() {
		$server_vars_sets = [
			[
				'SERVER_NAME' => 'testsite.org',
				'REQUEST_URI' => '/sitemap.xml',
			],
			[
				'HTTP_HOST'   => 'testsite.org',
				'REQUEST_URI' => '/sitemap.xml',
			],
			[
				'SERVER_NAME' => 'testsite.org',
				'REQUEST_URI' => '/sitemap_index.xml',
			],
			[
				'HTTP_HOST'   => 'other-testsite.org',
				'REQUEST_URI' => '/sitemap_index.xml',
			],
			[
				'SERVER_NAME' => 'other-testsite.org',
				'REQUEST_URI' => '/sitemap.xml',
			],
			[
				'HTTP_HOST'   => 'other-testsite.org',
				'REQUEST_URI' => '/sitemap.xml',
			],
		];

		$home_urls = [
			'http://testsite.org',
			'http://other-testsite.org',
			'https://testsite.org',
			'https://other-testsite.org',
		];

		$wp_queries            = [
			new WP_Query(),
			new WP_Query(),
		];
		$wp_queries[1]->is_404 = true;

		// Create test data from all possible combinations, plus HTTP vs HTTPS.
		$testdata = [];
		foreach ( $server_vars_sets as $server_vars ) {
			foreach ( $home_urls as $home_url ) {
				foreach ( $wp_queries as $wp_query ) {
					$domain = ! empty( $server_vars['HTTP_HOST'] ) ? $server_vars['HTTP_HOST'] : $server_vars['SERVER_NAME'];
					$path   = $server_vars['REQUEST_URI'];

					$expected   = $home_url === 'http://' . $domain && $path === '/sitemap.xml' && $wp_query->is_404;
					$testdata[] = [ $server_vars, $home_url, $wp_query, $expected ];

					$expected   = $home_url === 'https://' . $domain && $path === '/sitemap.xml' && $wp_query->is_404;
					$testdata[] = [ array_merge( $server_vars, [ 'HTTPS' => 'on' ] ), $home_url, $wp_query, $expected ];
				}
			}
		}

		return $testdata;
	}
}
