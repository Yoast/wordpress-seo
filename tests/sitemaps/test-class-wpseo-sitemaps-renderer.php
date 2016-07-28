<?php
/**
 * @package WPSEO\Unittests
 */

/**
 * Class WPSEO_Sitemaps_Renderer_Test
 */
class WPSEO_Sitemaps_Renderer_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Sitemaps_Renderer
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Sitemaps_Renderer();
	}

	/**
	 * @covers WPSEO_Sitemaps_Renderer::get_index
	 */
	public function test_get_index() {

		$loc     = 'http://example.com/';
		$lastmod = date( 'c' );
		$links   = array(
			array(
				'loc'     => $loc,
				'lastmod' => $lastmod,
			),
		);

		$index = self::$class_instance->get_index( $links );
		$this->assertContains( "<loc>{$loc}</loc>", $index );
		$this->assertContains( "<lastmod>{$lastmod}</lastmod>", $index );
	}

	/**
	 * @covers WPSEO_Sitemaps_Renderer::get_sitemap
	 */
	public function test_get_sitemap() {

		$loc     = 'http://example.com/';
		$lastmod = date( 'c' );
		$links   = array(
			array(
				'loc'     => $loc,
				'lastmod' => $lastmod,
			),
		);

		$index = self::$class_instance->get_index( $links );
		$this->assertContains( "<loc>{$loc}</loc>", $index );
		$this->assertContains( "<lastmod>{$lastmod}</lastmod>", $index );
	}
}


