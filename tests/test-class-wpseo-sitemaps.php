<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Exposes the protected functions of the WPSEO Twitter class for testing
 */
class WPSEO_Sitemaps_Double extends WPSEO_Sitemaps {

	/**
	 * Overwrite sitemap_close() so we don't die on outputting the sitemap
	 */
	function sitemap_close() {
		remove_all_actions( 'wp_footer' );
	}

	/**
	 * Cleans out the sitemap variable
	 */
	public function reset() {
		$this->sitemap     = false;
		$this->bad_sitemap = false;
	}
}


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
	public static function setUpBeforeClass() {
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
	 * @covers WPSEO_Sitemaps::build_post_type_map
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
}