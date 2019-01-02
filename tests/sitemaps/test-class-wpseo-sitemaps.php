<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class WPSEO_Sitemaps_Test
 *
 * @group sitemaps
 */
class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps_Double
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemaps_Double();
	}

	/**
	 * Test the nested sitemap generation.
	 */
	public function test_post_sitemap() {
		self::$class_instance->reset();

		set_query_var( 'sitemap', 'post' );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$expected_contains = array(
			'<?xml',
			'<urlset ',
		);
		$this->expectOutputContains( $expected_contains );
	}

	/**
	 * Tests the main sitemap and also tests the transient cache.
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_main_sitemap() {

		add_filter( 'wpseo_enable_xml_sitemap_transient_caching', '__return_true' );

		self::$class_instance->reset();

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		// Go to the XML sitemap twice, see if transient cache is set.
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );
		$expected_contains = array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
		);
		$this->expectOutputContains( $expected_contains );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$expected_contains = array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
			'Served from transient cache',
		);
		$this->expectOutputContains( $expected_contains );

		remove_filter( 'wpseo_enable_xml_sitemap_transient_caching', '__return_true' );
	}

	/**
	 * Test for last modified date.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_post_type() {

		$older_date  = '2015-01-01 12:00:00';
		$newest_date = '2016-01-01 12:00:00';

		$post_type_args = array(
			'public'      => true,
			'has_archive' => true,
		);
		register_post_type( 'yoast', $post_type_args );

		$post_args = array(
			'post_status' => 'publish',
			'post_type'   => 'yoast',
			'post_date'   => $newest_date,
		);
		$this->factory->post->create( $post_args );

		$post_args['post_date'] = $older_date;
		$this->factory->post->create( $post_args );

		$this->assertEquals( $newest_date, WPSEO_Sitemaps::get_last_modified_gmt( array( 'yoast' ) ) );
	}

	/**
	 * Test for last modified date with invalid post types.
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_with_invalid_post_type() {
		$this->assertFalse( WPSEO_Sitemaps::get_last_modified_gmt( array( 'invalid_post_type' ) ) );
	}
}
