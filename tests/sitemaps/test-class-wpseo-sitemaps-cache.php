<?php
/**
 * @package WPSEO\Unittests
 */

require_once 'class-wpseo-sitemaps-double.php';

/**
 * Class WPSEO_Sitemaps_Test
 */
class WPSEO_Sitemaps_Cache_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		self::$class_instance = new WPSEO_Sitemaps_Double;
		$this->factory = $this->factory();
	}

	/**
	 * Clean up
	 */
	public function tearDown() {
		$transient_key = 'wpseo_sitemap_cache_post_1';
		delete_transient( $transient_key );
	}

	/**
	 * Test sitemap cache not set
	 */
	public function test_transient_not_set() {
		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( 'post', 1 );

		$this->assertNull( $result );
	}

	/**
	 * Test sitemap cache XML set as value
	 */
	public function test_transient_sitemap_xml_string() {
		$sitemap = 'this is not a wpseo_sitemap_cache_data object';
		$type    = 'post';
		$page    = 1;

		/**
		 * todo: change this to dynamic key when 3.1 is merged into trunk.
		 */
		$transient_key = 'wpseo_sitemap_cache_' . $type . '_' . $page;

		set_transient( $transient_key, $sitemap, DAY_IN_SECONDS );

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap( $type, $page );

		$this->assertEquals( $sitemap, $result );
	}

	/**
	 * Test sitemap cache XML set as value
	 */
	public function test_transient_string_to_cache_data() {
		$sitemap = 'this is not a wpseo_sitemap_cache_data object';
		$type    = 'post';
		$page    = 1;

		$sitemap_data = new WPSEO_Sitemap_Cache_Data();
		$sitemap_data->set_sitemap( $sitemap );
		$sitemap_data->is_usable( true );

		/**
		 * todo: change this to dynamic key when 3.1 is merged into trunk.
		 */
		$transient_key = 'wpseo_sitemap_cache_' . $type . '_' . $page;

		set_transient( $transient_key, $sitemap, DAY_IN_SECONDS );

		$cache  = new WPSEO_Sitemaps_Cache();
		$result = $cache->get_sitemap_data( $type, $page );

		$this->assertEquals( $sitemap_data, $result );
	}

	/**
	 * Test if the transient cache is set as a cache data object
	 */
	public function test_transient_cache_data_object() {
		$sitemap = 'this_is_a_sitemap';
		$type    = 'post';
		$page    = 1;

		$test = new WPSEO_Sitemap_Cache_Data();
		$test->set_sitemap( $sitemap );

		$cache = new WPSEO_Sitemaps_Cache();
		$this->assertTrue( $cache->store_sitemap( $type, $page, $sitemap, true ) );

		$result = $cache->get_sitemap( $type, $page );

		$this->assertEquals( $test, unserialize( $result ) );
		$this->assertEquals( $test, $cache->get_sitemap_data( $type, $page ) );
	}

	/**
	 * Tests the main sitemap and also tests the transient cache
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_main_sitemap() {

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		// Go to the XML sitemap twice, see if transient cache is set.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );
		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Queries executed ',
		) );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Served from transient cache',
		) );
	}

	/**
	 * Test disabled transient cache usage
	 */
	public function test_disabled_transient_cache() {
		$disable_transient_cache_callback = array( $this, 'return_false' );
		add_filter( 'wpseo_enable_xml_sitemap_transient_caching', $disable_transient_cache_callback, 1 );

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		// Go to the XML sitemap twice, see if transient cache is not set.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Queries executed ',
		) );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Queries executed ',
		) );

		remove_filter( 'wpseo_enable_xml_sitemap_transient_caching', $disable_transient_cache_callback );

		// Clean up set_query_var.
		global $wp_query;
		unset( $wp_query->query_vars['sitemap'] );
	}

	/**
	 * Force return false.
	 *
	 * @return bool false
	 */
	public function return_false() {
		return false;
	}
}
