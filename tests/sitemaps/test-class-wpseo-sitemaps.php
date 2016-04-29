<?php
/**
 * @package WPSEO\Unittests
 */

require_once 'class-wpseo-sitemaps-double.php';

/**
 * Class WPSEO_Sitemaps_Test
 */
class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemaps_Double;
	}

	/**
	 * @covers WPSEO_Sitemaps::get_last_modified
	 */
	public function test_get_last_modified() {

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		$date = self::$class_instance->get_last_modified( array( 'post' ) );
		$post = get_post( $post_id );

		$this->assertEquals( $date, date( 'c', strtotime( $post->post_modified_gmt ) ) );
	}

	/**
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_post_sitemap() {
		self::$class_instance->reset();

		$post_id   = $this->factory->post->create();
		$permalink = get_permalink( $post_id );

		set_query_var( 'sitemap', 'post' );

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( array(
			'<?xml',
			'<urlset ',
			'<loc>' . $permalink . '</loc>',
		) );
	}

	/**
	 * Tests the main sitemap and also tests the transient cache
	 *
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_main_sitemap() {
		self::$class_instance->reset();

		set_query_var( 'sitemap', '1' );

		$this->factory->post->create();

		// Go to the XML sitemap twice, see if transient cache is set
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );
		$this->expectOutputContains( array(
			'<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
			'<sitemap>',
			'<lastmod>',
			'</sitemapindex>',
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
	 * Test for last modified date
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_post_type() {

		$older_date  = '2015-01-01 12:00:00';
		$newest_date = '2016-01-01 12:00:00';

		$this->factory->post->create( array( 'post_status' => 'publish', 'post_date' => $newest_date ) );
		$this->factory->post->create( array( 'post_status' => 'publish', 'post_date' => $older_date ) );

		$this->assertEquals( $newest_date, WPSEO_Sitemaps::get_last_modified_gmt( array( 'post' ) ) );
	}

	/**
	 * Test for last modified date with invalid post types
	 *
	 * @covers WPSEO_Sitemaps::get_last_modified_gmt
	 */
	public function test_last_modified_with_invalid_post_type() {
		$this->assertFalse( WPSEO_Sitemaps::get_last_modified_gmt( array( 'invalid_post_type' ) ) );
	}
}
