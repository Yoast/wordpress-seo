<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
 */

class WPSEO_Sitemaps_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Sitemaps;
	}

	/**
	 * @covers WPSEO_Sitemaps::canonical
	 */
	public function test_canonical() {
		$url = site_url();
		$this->assertNotEmpty( self::$class_instance->canonical( $url ) );

		set_query_var( 'sitemap', 'sitemap_value' );
		$this->assertFalse( self::$class_instance->canonical( $url ) );

		set_query_var( 'xsl', 'xsl_value' );
		$this->assertFalse( self::$class_instance->canonical( $url ) );
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
	 * @covers WPSEO_Sitemaps::redirect
	 */
	public function test_main_sitemap_transient_cache() {
		set_query_var( 'sitemap', 1 );

		// Go to the XML sitemap twice, see if transient cache is set
		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );
		ob_clean();

		self::$class_instance->redirect( $GLOBALS['wp_the_query'] );

		$this->expectOutputContains( 'Served from transient cache' );
	}
}