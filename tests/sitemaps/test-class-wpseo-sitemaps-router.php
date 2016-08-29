<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_Sitemaps_Router_Test
 */
class WPSEO_Sitemaps_Router_Test extends WPSEO_UnitTestCase {

	/** @var WPSEO_Sitemaps_Router */
	private static $class_instance;

	/**
	 * Set up our class.
	 */
	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_Sitemaps_Router();
	}

	/**
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

		set_query_var( 'xsl', 'xsl_value' );
		$this->assertFalse( self::$class_instance->redirect_canonical( $url ) );
	}

	/**
	 * @covers WPSEO_Sitemaps_Router::get_base_url
	 */
	public function test_get_base_url() {

		update_option( 'home', 'http://example.org' );
		$this->assertEquals( 'http://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'https://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );

		update_option( 'home', 'https://example.org' );
		$this->assertEquals( 'https://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
		$this->assertNotEquals( 'http://example.org/sitemap.xml', WPSEO_Sitemaps_Router::get_base_url( 'sitemap.xml' ) );
	}
}
